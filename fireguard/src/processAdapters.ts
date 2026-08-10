import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseNameStatus } from './gitScope.js';
import type { DiffEntry, FireguardConfig, RunOnceResult } from './types.js';

function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on('close', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
  });
}

export async function getGitDiffEntries(options: {
  cwd: string;
  baseRef: string;
}): Promise<DiffEntry[]> {
  const range = `${options.baseRef}...HEAD`;
  const result = await runCommand('git', ['diff', '--name-status', range], options.cwd);
  if (result.code !== 0) {
    // Fallback for shallow clones / missing merge-base: diff against baseRef
    const fallback = await runCommand(
      'git',
      ['diff', '--name-status', options.baseRef],
      options.cwd
    );
    if (fallback.code !== 0) {
      throw new Error(
        `git diff failed: ${result.stderr || fallback.stderr || 'unknown git error'}`
      );
    }
    return parseNameStatus(fallback.stdout);
  }
  return parseNameStatus(result.stdout);
}

export function createVitestRunner(options: {
  cwd: string;
  config: FireguardConfig;
}): (files: string[]) => Promise<RunOnceResult> {
  return async (files: string[]) => {
    if (files.length === 0) return { ok: true };
    const parts = options.config.testCommand.split(/\s+/).filter(Boolean);
    const command = parts[0] ?? 'npx';
    const baseArgs = parts.slice(1);
    const result = await runCommand(command, [...baseArgs, ...files], options.cwd);
    if (result.code === 0) return { ok: true };
    return {
      ok: false,
      error: (result.stderr || result.stdout || `exit ${result.code}`).slice(0, 2000),
    };
  };
}

/** Pending in-place restores so process `exit` can put sources back. */
const pendingRestores = new Map<string, string>();
let exitHookInstalled = false;

function restoreAllPending(): void {
  for (const [filePath, original] of pendingRestores) {
    try {
      writeFileSync(filePath, original, 'utf8');
    } catch {
      // best-effort on process teardown
    }
  }
  pendingRestores.clear();
}

function installExitHook(): void {
  if (exitHookInstalled) return;
  exitHookInstalled = true;
  process.on('exit', restoreAllPending);
}

export function createMutationApplier(options: {
  cwd: string;
  runOnce: (files: string[]) => Promise<RunOnceResult>;
}): (input: {
  file: string;
  originalSource: string;
  mutatedSource: string;
  relatedTests: string[];
}) => Promise<RunOnceResult> {
  installExitHook();
  return async (input) => {
    const filePath = join(options.cwd, input.file);
    pendingRestores.set(filePath, input.originalSource);
    await writeFile(filePath, input.mutatedSource, 'utf8');
    try {
      if (input.relatedTests.length === 0) {
        // No related graded tests — treat mutant as survived (cannot validate)
        return { ok: true };
      }
      return await options.runOnce(input.relatedTests);
    } finally {
      await writeFile(filePath, input.originalSource, 'utf8');
      pendingRestores.delete(filePath);
    }
  };
}

export async function readWorkspaceFile(cwd: string, path: string): Promise<string> {
  return readFile(join(cwd, path), 'utf8');
}
