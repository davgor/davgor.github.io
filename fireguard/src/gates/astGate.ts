import ts from 'typescript';
import type { AstFinding, AstGateResult, FireguardConfig } from '../types.js';

export interface FileSource {
  path: string;
  source: string;
}

export interface FileAstMetrics {
  path: string;
  assertionCount: number;
  mockCount: number;
  tautologicalCount: number;
  emptyTests: Array<{ file: string; line: number; name: string }>;
  assertionLines: number[];
  mockLines: number[];
}

const MOCK_PROPERTY_NAMES = new Set([
  'mock',
  'fn',
  'spyOn',
  'mocked',
  'mockReturnValue',
  'mockReturnValueOnce',
  'mockResolvedValue',
  'mockResolvedValueOnce',
  'mockRejectedValue',
  'mockRejectedValueOnce',
  'mockImplementation',
  'mockImplementationOnce',
]);

const TAUTOLOGY_MATCHERS = new Set([
  'toHaveBeenCalled',
  'toHaveBeenCalledTimes',
  'toHaveBeenCalledWith',
  'toHaveBeenLastCalledWith',
  'toHaveBeenNthCalledWith',
  'toHaveReturned',
  'toHaveReturnedWith',
  'toHaveLastReturnedWith',
]);

function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function isViIdentifier(expr: ts.Expression): boolean {
  return ts.isIdentifier(expr) && expr.text === 'vi';
}

function getCallName(node: ts.CallExpression): string | undefined {
  const expr = node.expression;
  if (ts.isIdentifier(expr)) return expr.text;
  if (ts.isPropertyAccessExpression(expr)) return expr.name.text;
  return undefined;
}

function collectsMockCall(node: ts.CallExpression): boolean {
  const expr = node.expression;
  // Only count Vitest `vi.*` mock APIs — not arbitrary `.fn` / `.mock` property access.
  if (ts.isPropertyAccessExpression(expr)) {
    return isViIdentifier(expr.expression) && MOCK_PROPERTY_NAMES.has(expr.name.text);
  }
  return false;
}

function isExpectCall(node: ts.CallExpression): boolean {
  return getCallName(node) === 'expect' && ts.isIdentifier(node.expression);
}

function getExpectRootArgument(node: ts.CallExpression): ts.Expression | undefined {
  return node.arguments[0];
}

function expressionLooksMocked(expr: ts.Expression | undefined, mockIdents: Set<string>): boolean {
  if (!expr) return false;
  if (ts.isIdentifier(expr)) {
    return mockIdents.has(expr.text);
  }
  if (ts.isPropertyAccessExpression(expr)) {
    // `fn.mock.results` / mock object internals tied to a known mock binding
    if (expressionLooksMocked(expr.expression, mockIdents)) return true;
    return false;
  }
  if (ts.isCallExpression(expr)) {
    return expressionLooksMocked(expr.expression, mockIdents);
  }
  if (ts.isElementAccessExpression(expr)) {
    return expressionLooksMocked(expr.expression, mockIdents);
  }
  return false;
}

function getChainedMatcherName(
  expectCall: ts.CallExpression,
  sourceFile: ts.SourceFile
): string | undefined {
  // expect(x).toBe(...) — parent of expect call is property access, its parent is call
  let current: ts.Node = expectCall;
  while (current.parent) {
    const parent = current.parent;
    if (ts.isPropertyAccessExpression(parent) && parent.expression === current) {
      if (
        parent.parent &&
        ts.isCallExpression(parent.parent) &&
        parent.parent.expression === parent
      ) {
        return parent.name.text;
      }
      if (parent.parent && ts.isPropertyAccessExpression(parent.parent)) {
        current = parent;
        continue;
      }
    }
    break;
  }
  void sourceFile;
  return undefined;
}

function testCallbackHasAssertions(callback: ts.Expression): boolean {
  let count = 0;
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && isExpectCall(node)) {
      count += 1;
    }
    ts.forEachChild(node, visit);
  };
  visit(callback);
  return count > 0;
}

function getTestName(call: ts.CallExpression): string {
  const arg0 = call.arguments[0];
  if (arg0 && ts.isStringLiteral(arg0)) return arg0.text;
  return '(unnamed)';
}

export function analyzeTestSource(path: string, source: string): FileAstMetrics {
  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  let assertionCount = 0;
  let mockCount = 0;
  let tautologicalCount = 0;
  const emptyTests: FileAstMetrics['emptyTests'] = [];
  const assertionLines: number[] = [];
  const mockLines: number[] = [];
  const mockIdents = new Set<string>();

  const visit = (node: ts.Node): void => {
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      ts.isCallExpression(node.initializer)
    ) {
      if (collectsMockCall(node.initializer) && ts.isIdentifier(node.name)) {
        mockIdents.add(node.name.text);
      }
    }

    if (ts.isCallExpression(node)) {
      if (collectsMockCall(node)) {
        mockCount += 1;
        mockLines.push(lineOf(sourceFile, node));
      }

      if (isExpectCall(node)) {
        assertionCount += 1;
        assertionLines.push(lineOf(sourceFile, node));
        const arg = getExpectRootArgument(node);
        const matcher = getChainedMatcherName(node, sourceFile);
        const tautology =
          (matcher !== undefined && TAUTOLOGY_MATCHERS.has(matcher)) ||
          expressionLooksMocked(arg, mockIdents);
        if (tautology) {
          tautologicalCount += 1;
        }
      }

      const callName = getCallName(node);
      if ((callName === 'it' || callName === 'test') && node.arguments.length >= 2) {
        const callback = node.arguments[1];
        if (
          callback &&
          (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) &&
          !testCallbackHasAssertions(callback)
        ) {
          emptyTests.push({
            file: path,
            line: lineOf(sourceFile, node),
            name: getTestName(node),
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return {
    path,
    assertionCount,
    mockCount,
    tautologicalCount,
    emptyTests,
    assertionLines,
    mockLines,
  };
}

export function runAstGate(options: {
  config: FireguardConfig;
  files: FileSource[];
}): AstGateResult {
  const findings: AstFinding[] = [];
  let assertionCount = 0;
  let mockCount = 0;
  let tautologicalCount = 0;
  const emptyTests: AstGateResult['emptyTests'] = [];

  for (const file of options.files) {
    const metrics = analyzeTestSource(file.path, file.source);
    assertionCount += metrics.assertionCount;
    mockCount += metrics.mockCount;
    tautologicalCount += metrics.tautologicalCount;
    emptyTests.push(...metrics.emptyTests);

    if (metrics.assertionCount < options.config.thresholds.minAssertionsPerFile) {
      findings.push({
        file: file.path,
        line: 1,
        rule: 'min-assertions',
        message: `assertions ${metrics.assertionCount} < minAssertionsPerFile ${options.config.thresholds.minAssertionsPerFile}`,
      });
    }

    for (const empty of metrics.emptyTests) {
      findings.push({
        file: empty.file,
        line: empty.line,
        rule: 'empty-test',
        message: `test "${empty.name}" has zero assertions`,
      });
    }
  }

  const mockToAssertRatio = assertionCount === 0 ? mockCount : mockCount / assertionCount;
  const tautologicalRatio = assertionCount === 0 ? 0 : tautologicalCount / assertionCount;

  if (assertionCount > 0 && mockToAssertRatio > options.config.thresholds.maxMockToAssertRatio) {
    findings.push({
      file: options.files[0]?.path ?? '(suite)',
      line: 1,
      rule: 'mock-ratio',
      message: `mock/assert ratio ${mockToAssertRatio.toFixed(2)} > ${options.config.thresholds.maxMockToAssertRatio}`,
    });
  }

  if (assertionCount > 0 && tautologicalRatio > options.config.thresholds.maxTautologicalRatio) {
    findings.push({
      file: options.files[0]?.path ?? '(suite)',
      line: 1,
      rule: 'tautology-ratio',
      message: `tautological assertion ratio ${tautologicalRatio.toFixed(2)} > ${options.config.thresholds.maxTautologicalRatio}`,
    });
  }

  return {
    name: 'ast',
    pass: findings.length === 0,
    assertionCount,
    mockCount,
    mockToAssertRatio,
    tautologicalCount,
    tautologicalRatio,
    emptyTests,
    findings,
  };
}
