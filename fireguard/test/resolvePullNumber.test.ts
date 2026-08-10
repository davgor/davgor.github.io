import { describe, it, expect } from 'vitest';
import { resolvePullNumberFromEvent } from '../src/prComment.js';

describe('resolvePullNumberFromEvent', () => {
  it('reads pull_request.number from the Actions event payload', () => {
    const n = resolvePullNumberFromEvent('/event.json', () =>
      JSON.stringify({ pull_request: { number: 5 } })
    );
    expect(n).toBe(5);
  });

  it('returns undefined when path missing or payload invalid', () => {
    expect(resolvePullNumberFromEvent(undefined, () => '')).toBeUndefined();
    expect(resolvePullNumberFromEvent('/x', () => 'nope')).toBeUndefined();
  });
});
