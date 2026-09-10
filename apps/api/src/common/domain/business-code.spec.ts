import {
  createTemporaryBusinessCode,
  formatAdminCode,
  formatAgentCode,
  formatApplicationCode,
  formatCandidateCode,
  formatCompanyCode,
  formatJobCode,
} from './business-code';

describe('business codes', () => {
  it('formats role and aggregate codes from database identifiers', () => {
    expect(formatCandidateCode(42)).toBe('U0000042');
    expect(formatCompanyCode(42)).toBe('C0000042');
    expect(formatAgentCode(42)).toBe('A0000042');
    expect(formatAdminCode(42)).toBe('admin42');
    expect(formatJobCode(42)).toBe('J0000042');
    expect(formatApplicationCode(42)).toBe('APP0000042');
  });

  it('creates a bounded temporary code', () => {
    const code = createTemporaryBusinessCode(12);

    expect(code).toHaveLength(12);
    expect(code).toMatch(/^T[0-9a-f]{11}$/);
  });
});
