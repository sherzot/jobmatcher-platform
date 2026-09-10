export type CompanyStatusValue =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type CompanyReviewAction = 'approve' | 'reject';

export function canReviewCompany(status: CompanyStatusValue): boolean {
  return status === 'PENDING_APPROVAL';
}

export function hasValidCompanyRejectionReason(
  action: CompanyReviewAction,
  reason?: string,
): boolean {
  return action === 'approve' || Boolean(reason?.trim());
}
