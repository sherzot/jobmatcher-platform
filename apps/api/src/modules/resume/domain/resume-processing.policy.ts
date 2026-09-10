export type ResumeProcessingStatusValue =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'PROPOSED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'FAILED'
  | 'EXPIRED';

const TRANSITIONS: Record<
  ResumeProcessingStatusValue,
  readonly ResumeProcessingStatusValue[]
> = {
  REQUESTED: ['PROCESSING', 'FAILED', 'EXPIRED'],
  PROCESSING: ['PROPOSED', 'FAILED', 'EXPIRED'],
  PROPOSED: ['CONFIRMED', 'REJECTED', 'EXPIRED'],
  CONFIRMED: [],
  REJECTED: [],
  FAILED: [],
  EXPIRED: [],
};

export function canTransitionResumeProcessing(
  from: ResumeProcessingStatusValue,
  to: ResumeProcessingStatusValue,
): boolean {
  return TRANSITIONS[from].includes(to);
}
