export const RESUME_SECTION_LIMITS = {
  education: 3,
  experience: 10,
} as const;

export type LimitedResumeSection = keyof typeof RESUME_SECTION_LIMITS;

export function canAddResumeSection(
  section: LimitedResumeSection,
  currentCount: number,
): boolean {
  return currentCount < RESUME_SECTION_LIMITS[section];
}
