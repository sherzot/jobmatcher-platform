// ─────────────────────────────────────────────────────────────
// JobMatch Platform — Shared Types
// Used by both apps/web and apps/api
// ─────────────────────────────────────────────────────────────

// ── Enums ────────────────────────────────────────────────────

export type UserRole = 'CANDIDATE' | 'AGENT' | 'COMPANY' | 'ADMIN';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION';

export type JobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DELETED';

export type JobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE';

export type WorkLocation = 'ONSITE' | 'REMOTE' | 'HYBRID';

export type ApplicationStatus =
  | 'PENDING'
  | 'CASUAL_INTERVIEW'
  | 'SCREENING'
  | 'FIRST_INTERVIEW'
  | 'SECOND_INTERVIEW'
  | 'THIRD_INTERVIEW'
  | 'FINAL_INTERVIEW'
  | 'OFFER'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type JapaneseLevel =
  | 'N1'
  | 'N2'
  | 'N3'
  | 'N4'
  | 'N5'
  | 'BUSINESS'
  | 'NATIVE'
  | 'NONE';

export type VisaStatus =
  | 'NOT_REQUIRED'
  | 'SPONSORED'
  | 'SELF_SPONSORED'
  | 'ALREADY_HAVE';

// ── API Response ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── User ──────────────────────────────────────────────────────

export interface UserDto {
  id: number;
  code: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface ProfileDto {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  firstNameKana?: string;
  lastNameKana?: string;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  prefecture?: string;
  city?: string;
  japaneseLevel: JapaneseLevel;
  visaStatus: VisaStatus;
  isOpenToWork: boolean;
  desiredSalaryMin?: number;
  desiredSalaryMax?: number;
}

// ── Resume ────────────────────────────────────────────────────

export interface ResumeDto {
  id: number;
  title: string;
  educations: EducationDto[];
  experiences: ExperienceDto[];
  skills: SkillDto[];
  qualifications: QualificationDto[];
  updatedAt: string;
}

export interface EducationDto {
  id: number;
  schoolName: string;
  faculty?: string;
  degree?: string;
  startDate: string;
  endDate?: string;
  isGraduated: boolean;
  description?: string;
  sortOrder: number;
}

export interface ExperienceDto {
  id: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  achievements?: string;
  sortOrder: number;
}

export interface SkillDto {
  id: number;
  name: string;
  level?: string;
  yearsUsed?: number;
  sortOrder: number;
}

export interface QualificationDto {
  id: number;
  name: string;
  issuedBy?: string;
  issuedDate?: string;
  expiryDate?: string;
  sortOrder: number;
}

// ── Job ───────────────────────────────────────────────────────

export interface JobDto {
  id: number;
  code: string;
  companyId: number;
  company?: CompanyDto;
  title: string;
  description: string;
  jobType: JobType;
  workLocation: WorkLocation;
  status: JobStatus;
  country?: string;
  prefecture?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  japaneseLevel: JapaneseLevel;
  visaSponsorship: boolean;
  minExperience?: number;
  skills?: string[];
  viewCount: number;
  applyCount: number;
  publishedAt?: string;
  closesAt?: string;
  createdAt: string;
}

// ── Company ───────────────────────────────────────────────────

export interface CompanyDto {
  id: number;
  code: string;
  name: string;
  nameEn?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  industry?: string;
  employeeCount?: string;
  prefecture?: string;
  city?: string;
  isVerified: boolean;
}

// ── Application ───────────────────────────────────────────────

export interface ApplicationDto {
  id: number;
  code: string;
  userId: number;
  jobId: number;
  job?: JobDto;
  status: ApplicationStatus;
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
}

// ── Application Pipeline Labels ───────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: '応募済み',
  CASUAL_INTERVIEW: 'カジュアル面談',
  SCREENING: '書類選考',
  FIRST_INTERVIEW: '一次面接',
  SECOND_INTERVIEW: '二次面接',
  THIRD_INTERVIEW: '三次面接',
  FINAL_INTERVIEW: '最終面接',
  OFFER: '内定',
  ACCEPTED: '承諾',
  REJECTED: '不採用',
  WITHDRAWN: '辞退',
};

// ── Job Type Labels ───────────────────────────────────────────

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: '正社員',
  PART_TIME: 'パートタイム',
  CONTRACT: '契約社員',
  INTERNSHIP: 'インターン',
  FREELANCE: 'フリーランス',
};

export const WORK_LOCATION_LABELS: Record<WorkLocation, string> = {
  ONSITE: 'オフィス勤務',
  REMOTE: 'リモートワーク',
  HYBRID: 'ハイブリッド',
};

export const JAPANESE_LEVEL_LABELS: Record<JapaneseLevel, string> = {
  N1: 'JLPT N1',
  N2: 'JLPT N2',
  N3: 'JLPT N3',
  N4: 'JLPT N4',
  N5: 'JLPT N5',
  BUSINESS: 'ビジネスレベル',
  NATIVE: 'ネイティブ',
  NONE: '不問',
};
