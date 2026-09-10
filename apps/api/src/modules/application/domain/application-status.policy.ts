export const APPLICATION_STATUSES = [
  'PENDING',
  'CASUAL_INTERVIEW',
  'SCREENING',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'THIRD_INTERVIEW',
  'FINAL_INTERVIEW',
  'OFFER',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
] as const;

export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

const NEXT_PIPELINE_STATUS: Partial<
  Record<ApplicationStatusValue, ApplicationStatusValue>
> = {
  PENDING: 'CASUAL_INTERVIEW',
  CASUAL_INTERVIEW: 'SCREENING',
  SCREENING: 'FIRST_INTERVIEW',
  FIRST_INTERVIEW: 'SECOND_INTERVIEW',
  SECOND_INTERVIEW: 'THIRD_INTERVIEW',
  THIRD_INTERVIEW: 'FINAL_INTERVIEW',
  FINAL_INTERVIEW: 'OFFER',
  OFFER: 'ACCEPTED',
};

const TERMINAL_STATUSES = new Set<ApplicationStatusValue>([
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN',
]);

export function canAgentTransitionApplication(
  from: ApplicationStatusValue,
  to: ApplicationStatusValue,
): boolean {
  if (TERMINAL_STATUSES.has(from) || to === 'WITHDRAWN') {
    return false;
  }

  return to === 'REJECTED' || NEXT_PIPELINE_STATUS[from] === to;
}

export function canCandidateWithdrawApplication(
  status: ApplicationStatusValue,
): boolean {
  return !TERMINAL_STATUSES.has(status);
}
