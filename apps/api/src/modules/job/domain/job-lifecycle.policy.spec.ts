import {
  canReviewJob,
  canToggleJobPublication,
  hasValidSalaryRange,
  resolveInitialJobStatus,
} from './job-lifecycle.policy';

describe('job lifecycle policy', () => {
  it.each([
    ['HOURLY', 'FULL_TIME', 'PENDING_REVIEW'],
    ['MONTHLY', 'PART_TIME', 'PENDING_REVIEW'],
    ['MONTHLY', 'FULL_TIME', 'ACTIVE'],
    ['ANNUAL', 'PART_TIME', 'ACTIVE'],
  ] as const)('resolves %s/%s to %s', (salaryType, jobType, expected) => {
    expect(resolveInitialJobStatus(salaryType, jobType)).toBe(expected);
  });

  it('only reviews pending jobs', () => {
    expect(canReviewJob('PENDING_REVIEW')).toBe(true);
    expect(canReviewJob('ACTIVE')).toBe(false);
  });

  it('only toggles active and paused jobs', () => {
    expect(canToggleJobPublication('ACTIVE')).toBe(true);
    expect(canToggleJobPublication('PAUSED')).toBe(true);
    expect(canToggleJobPublication('DRAFT')).toBe(false);
  });

  it('rejects an inverted salary range', () => {
    expect(hasValidSalaryRange(800, 600)).toBe(false);
    expect(hasValidSalaryRange(600, 800)).toBe(true);
  });
});
