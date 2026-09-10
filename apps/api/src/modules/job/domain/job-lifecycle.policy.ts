export type JobStatusValue =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CLOSED'
  | 'REJECTED'
  | 'DELETED';

export type SalaryTypeValue = 'HOURLY' | 'MONTHLY' | 'ANNUAL';
export type JobTypeValue =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE';

export function resolveInitialJobStatus(
  salaryType: SalaryTypeValue,
  jobType: JobTypeValue,
): JobStatusValue {
  if (salaryType === 'HOURLY') {
    return 'PENDING_REVIEW';
  }

  if (salaryType === 'MONTHLY' && jobType === 'PART_TIME') {
    return 'PENDING_REVIEW';
  }

  return 'ACTIVE';
}

export function canReviewJob(status: JobStatusValue): boolean {
  return status === 'PENDING_REVIEW';
}

export function canToggleJobPublication(status: JobStatusValue): boolean {
  return status === 'ACTIVE' || status === 'PAUSED';
}

export function hasValidSalaryRange(
  minimum?: number,
  maximum?: number,
): boolean {
  return minimum === undefined || maximum === undefined || minimum <= maximum;
}
