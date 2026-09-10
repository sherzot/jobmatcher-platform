import { canTransitionResumeProcessing } from './resume-processing.policy';

describe('resume processing policy', () => {
  it.each([
    ['REQUESTED', 'PROCESSING'],
    ['PROCESSING', 'PROPOSED'],
    ['PROPOSED', 'CONFIRMED'],
    ['PROPOSED', 'REJECTED'],
  ] as const)('allows %s to transition to %s', (from, to) => {
    expect(canTransitionResumeProcessing(from, to)).toBe(true);
  });

  it.each([
    ['REQUESTED', 'CONFIRMED'],
    ['PROPOSED', 'PROCESSING'],
    ['CONFIRMED', 'REJECTED'],
    ['FAILED', 'PROCESSING'],
  ] as const)('rejects %s to %s', (from, to) => {
    expect(canTransitionResumeProcessing(from, to)).toBe(false);
  });
});
