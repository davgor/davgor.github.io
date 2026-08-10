import type {
  AstGateResult,
  FlakeGateResult,
  GradeResult,
  LetterGrade,
  MutationGateResult,
} from './types.js';

function letterFromScore(score: number): LetterGrade {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function computeGrade(gates: {
  ast?: AstGateResult;
  flake?: FlakeGateResult;
  mutation?: MutationGateResult;
}): GradeResult {
  const reasons: string[] = [];

  if (gates.ast && !gates.ast.pass) {
    reasons.push('ast gate failed');
  }
  if (gates.flake && !gates.flake.pass) {
    reasons.push('flake gate failed');
  }
  if (gates.mutation && !gates.mutation.pass) {
    reasons.push('mutation gate failed');
  }

  if (reasons.length > 0) {
    return { letter: 'F', score: 0, reasons };
  }

  // Base C for meeting thresholds; earn higher scores with cleaner metrics.
  let score = 70;
  const ast = gates.ast;
  if (ast) {
    const mockHeadroom = Math.max(0, 1.5 - ast.mockToAssertRatio) / 1.5;
    score += Math.round(mockHeadroom * 15);
    const tautologyHeadroom = Math.max(0, 0.1 - ast.tautologicalRatio) / 0.1;
    score += Math.round(tautologyHeadroom * 5);
  } else {
    score += 20;
  }

  const mutation = gates.mutation;
  if (mutation) {
    const mutationBonus = Math.max(0, Math.min(25, mutation.score - 75));
    score += Math.round((mutationBonus / 25) * 10);
  } else {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));
  return {
    letter: letterFromScore(score),
    score,
    reasons: ['all hard gates passed'],
  };
}
