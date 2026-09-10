import {
  canTransitionAIExecution,
  hasValidAIUsage,
} from './ai-execution.policy';

describe('AI execution policy', () => {
  it.each([
    ['REQUESTED', 'RUNNING'],
    ['REQUESTED', 'BLOCKED'],
    ['RUNNING', 'SUCCEEDED'],
    ['RUNNING', 'FAILED'],
  ] as const)('allows %s to transition to %s', (from, to) => {
    expect(canTransitionAIExecution(from, to)).toBe(true);
  });

  it.each([
    ['SUCCEEDED', 'RUNNING'],
    ['FAILED', 'RUNNING'],
    ['BLOCKED', 'RUNNING'],
    ['REQUESTED', 'SUCCEEDED'],
  ] as const)('rejects %s to %s', (from, to) => {
    expect(canTransitionAIExecution(from, to)).toBe(false);
  });

  it('accepts non-negative usage values', () => {
    expect(hasValidAIUsage(10, 20, 300, 1_000n)).toBe(true);
  });

  it('rejects negative usage values', () => {
    expect(hasValidAIUsage(-1, 20, 300)).toBe(false);
    expect(hasValidAIUsage(10, 20, -1)).toBe(false);
    expect(hasValidAIUsage(10, 20, 300, -1n)).toBe(false);
  });

  it('rejects fractional and unbounded integer usage values', () => {
    expect(hasValidAIUsage(1.5, 20, 300)).toBe(false);
    expect(hasValidAIUsage(10, Number.POSITIVE_INFINITY, 300)).toBe(false);
    expect(hasValidAIUsage(10, 20, Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
});
