import {
  canReviewCompany,
  hasValidCompanyRejectionReason,
} from './company-approval.policy';

describe('company approval policy', () => {
  it('only reviews pending registrations', () => {
    expect(canReviewCompany('PENDING_APPROVAL')).toBe(true);
    expect(canReviewCompany('APPROVED')).toBe(false);
    expect(canReviewCompany('REJECTED')).toBe(false);
  });

  it('requires a rejection reason', () => {
    expect(hasValidCompanyRejectionReason('reject', undefined)).toBe(false);
    expect(hasValidCompanyRejectionReason('reject', '  ')).toBe(false);
    expect(
      hasValidCompanyRejectionReason(
        'reject',
        'Registration could not be verified',
      ),
    ).toBe(true);
    expect(hasValidCompanyRejectionReason('approve')).toBe(true);
  });
});
