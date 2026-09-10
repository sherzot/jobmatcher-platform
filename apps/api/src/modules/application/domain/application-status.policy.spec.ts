import {
  canAgentTransitionApplication,
  canCandidateWithdrawApplication,
} from './application-status.policy';

describe('application status policy', () => {
  it.each([
    ['PENDING', 'CASUAL_INTERVIEW'],
    ['CASUAL_INTERVIEW', 'SCREENING'],
    ['FINAL_INTERVIEW', 'OFFER'],
    ['OFFER', 'ACCEPTED'],
  ] as const)(
    'allows the next pipeline transition from %s to %s',
    (from, to) => {
      expect(canAgentTransitionApplication(from, to)).toBe(true);
    },
  );

  it('allows rejection from a non-terminal status', () => {
    expect(canAgentTransitionApplication('SECOND_INTERVIEW', 'REJECTED')).toBe(
      true,
    );
  });

  it.each([
    ['PENDING', 'OFFER'],
    ['SCREENING', 'CASUAL_INTERVIEW'],
    ['ACCEPTED', 'REJECTED'],
    ['REJECTED', 'SCREENING'],
    ['PENDING', 'WITHDRAWN'],
  ] as const)('rejects invalid agent transition from %s to %s', (from, to) => {
    expect(canAgentTransitionApplication(from, to)).toBe(false);
  });

  it.each(['ACCEPTED', 'REJECTED', 'WITHDRAWN'] as const)(
    'does not allow candidate withdrawal from %s',
    (status) => {
      expect(canCandidateWithdrawApplication(status)).toBe(false);
    },
  );
});
