import {
  canAddResumeSection,
  RESUME_SECTION_LIMITS,
} from './resume-limits.policy';

describe('resume limits policy', () => {
  it('allows education below the limit', () => {
    expect(
      canAddResumeSection('education', RESUME_SECTION_LIMITS.education - 1),
    ).toBe(true);
  });

  it('rejects education at the limit', () => {
    expect(
      canAddResumeSection('education', RESUME_SECTION_LIMITS.education),
    ).toBe(false);
  });

  it('rejects experience at the limit', () => {
    expect(
      canAddResumeSection('experience', RESUME_SECTION_LIMITS.experience),
    ).toBe(false);
  });
});
