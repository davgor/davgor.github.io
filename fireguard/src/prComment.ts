import type { FireguardReport } from './types.js';
import { formatHumanReport } from './report.js';

export const FIREGUARD_COMMENT_MARKER = '<!-- fireguard-report -->';

export function formatPrMarkdown(report: FireguardReport): string {
  const lines: string[] = [
    FIREGUARD_COMMENT_MARKER,
    `## Fireguard grade: **${report.grade.letter}** (score ${report.grade.score})`,
    '',
  ];

  if (report.skipped) {
    lines.push(`_${report.skipReason ?? 'Nothing to grade.'}_`);
    lines.push('');
    lines.push(
      'Added/modified Vitest unit tests vs the base ref are graded for mock/assert quality, flake isolation, and mutation kill rate on changed modules. Module-only diffs without test updates fail closed with F.'
    );
    return `${lines.join('\n')}\n`;
  }

  lines.push(`Base ref: \`${report.scope.baseRef}\``);
  lines.push(
    `Graded tests: ${
      report.scope.gradedTestFiles.length > 0
        ? report.scope.gradedTestFiles.map((f) => `\`${f}\``).join(', ')
        : '_(none)_'
    }`
  );
  lines.push(
    `Changed modules: ${
      report.scope.changedModules.length > 0
        ? report.scope.changedModules.map((f) => `\`${f}\``).join(', ')
        : '_(none)_'
    }`
  );
  lines.push('');

  const ast = report.gates.ast;
  if (ast) {
    lines.push(
      `- **Gate 1 AST:** ${ast.pass ? 'PASS' : 'FAIL'} (mocks/asserts=${ast.mockToAssertRatio.toFixed(2)}, tautology=${ast.tautologicalRatio.toFixed(2)})`
    );
    for (const finding of ast.findings.slice(0, 15)) {
      lines.push(`  - \`${finding.file}:${finding.line}\` [${finding.rule}] ${finding.message}`);
    }
  }

  const flake = report.gates.flake;
  if (flake) {
    lines.push(
      `- **Gate 2 Flake:** ${flake.pass ? 'PASS' : 'FAIL'} (${flake.failures} failed; executed ${flake.runs}/${flake.configuredRuns}${flake.failFast ? ', fail-fast' : ''})`
    );
    for (const failed of flake.failedRuns.slice(0, 5)) {
      lines.push(`  - run #${failed.run}: ${failed.error}`);
    }
  }

  const mutation = report.gates.mutation;
  if (mutation) {
    lines.push(
      `- **Gate 3 Mutation:** ${mutation.pass ? 'PASS' : 'FAIL'} (${mutation.score}% killed; ${mutation.killed}/${mutation.total})`
    );
    for (const survivor of mutation.survivors.slice(0, 10)) {
      lines.push(`  - survivor \`${survivor.file}:${survivor.line}\` ${survivor.description}`);
    }
  }

  lines.push('');
  lines.push('<details><summary>Full fireguard report</summary>');
  lines.push('');
  lines.push('```');
  lines.push(formatHumanReport(report));
  lines.push('```');
  lines.push('</details>');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

export interface PrComment {
  id: number;
  body: string;
}

export async function upsertPrComment(options: {
  body: string;
  listComments: () => Promise<PrComment[]>;
  createComment: (body: string) => Promise<void>;
  updateComment: (id: number, body: string) => Promise<void>;
}): Promise<'created' | 'updated'> {
  const comments = await options.listComments();
  const existing = comments.find((comment) => comment.body.includes(FIREGUARD_COMMENT_MARKER));
  if (existing) {
    await options.updateComment(existing.id, options.body);
    return 'updated';
  }
  await options.createComment(options.body);
  return 'created';
}

export async function postPrCommentViaGithub(options: {
  token: string;
  repository: string;
  pullNumber: number;
  body: string;
  fetchImpl?: typeof fetch;
}): Promise<'created' | 'updated'> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const [owner, repo] = options.repository.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid repository "${options.repository}" (expected owner/repo)`);
  }

  const api = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${options.token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'fireguard',
  };

  return upsertPrComment({
    body: options.body,
    listComments: async () => {
      const comments: PrComment[] = [];
      let page = 1;
      while (page <= 10) {
        const response = await fetchImpl(
          `${api}/issues/${options.pullNumber}/comments?per_page=100&page=${page}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error(`list comments failed: ${response.status} ${await response.text()}`);
        }
        const batch = (await response.json()) as Array<{ id: number; body?: string }>;
        if (batch.length === 0) break;
        for (const item of batch) {
          comments.push({ id: item.id, body: item.body ?? '' });
        }
        if (batch.length < 100) break;
        page += 1;
      }
      return comments;
    },
    createComment: async (body) => {
      const response = await fetchImpl(`${api}/issues/${options.pullNumber}/comments`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        throw new Error(`create comment failed: ${response.status} ${await response.text()}`);
      }
    },
    updateComment: async (id, body) => {
      const response = await fetchImpl(`${api}/issues/comments/${id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (!response.ok) {
        throw new Error(`update comment failed: ${response.status} ${await response.text()}`);
      }
    },
  });
}

/** Read pull_request.number from Actions event payload when present. */
export function resolvePullNumberFromEvent(
  eventPath: string | undefined,
  readFile: (path: string) => string
): number | undefined {
  if (!eventPath) return undefined;
  try {
    const payload = JSON.parse(readFile(eventPath)) as {
      pull_request?: { number?: number };
      number?: number;
    };
    return payload.pull_request?.number ?? payload.number;
  } catch {
    return undefined;
  }
}
