import type { ApplicationStatus } from './applications';
import { STATUS_LABELS, STATUS_COLORS } from './applications';

export { STATUS_LABELS, STATUS_COLORS };
export type { ApplicationStatus };

// ── Company profile ───────────────────────────────────────────

export const MOCK_COMPANY = {
  id: '1',
  code: 'C0000001',
  name: 'テックスタート株式会社',
  nameEn: 'TechStart Inc.',
  logoInitial: 'T',
  logoColor: 'bg-blue-600',
  industry: 'IT・SaaS',
  employeeCount: '50〜100名',
  founded: 2018,
  prefecture: '東京都',
  city: '渋谷区',
  address: '東京都渋谷区道玄坂1-2-3 テックビル5F',
  websiteUrl: 'https://techstart.jp',
  description:
    'B2B SaaSプロダクトを開発するスタートアップ。急成長中のエンジニアリングチームを拡大中。リモートフレンドリー、外国籍エンジニア歓迎。',
  isVerified: true,
  isActive: true,
};

// ── Assigned agent ────────────────────────────────────────────

export const MOCK_ASSIGNED_AGENT = {
  id: '1',
  code: 'A0000001',
  displayName: '田中 健太',
  avatarInitial: 'T',
  avatarColor: 'bg-violet-600',
  email: 'tanaka@jobmatch.com',
  phone: '03-0000-0000',
};

// ── Company jobs ──────────────────────────────────────────────

export type CompanyJobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface CompanyJob {
  id: string;
  code: string;
  title: string;
  jobType: string;
  workLocation: string;
  prefecture: string;
  salaryMin: number;
  salaryMax: number;
  japaneseLevel: string;
  visaSponsorship: boolean;
  skills: string[];
  status: CompanyJobStatus;
  applicationCount: number;
  newApplicationCount: number; // unread
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export const MOCK_COMPANY_JOBS: CompanyJob[] = [
  {
    id: '1', code: 'J0000010',
    title: 'シニアフロントエンドエンジニア',
    jobType: 'FULL_TIME', workLocation: 'HYBRID', prefecture: '東京都',
    salaryMin: 650, salaryMax: 950,
    japaneseLevel: 'N2', visaSponsorship: true,
    skills: ['React', 'TypeScript', 'Next.js'],
    status: 'ACTIVE', applicationCount: 8, newApplicationCount: 2, viewCount: 320,
    publishedAt: '2025-03-20', createdAt: '2025-03-18',
  },
  {
    id: '2', code: 'J0000011',
    title: 'バックエンドエンジニア（Go/Python）',
    jobType: 'FULL_TIME', workLocation: 'REMOTE', prefecture: '東京都',
    salaryMin: 600, salaryMax: 900,
    japaneseLevel: 'NONE', visaSponsorship: true,
    skills: ['Go', 'Python', 'PostgreSQL', 'Docker'],
    status: 'ACTIVE', applicationCount: 5, newApplicationCount: 1, viewCount: 210,
    publishedAt: '2025-03-22', createdAt: '2025-03-20',
  },
  {
    id: '3', code: 'J0000012',
    title: 'プロダクトマネージャー',
    jobType: 'FULL_TIME', workLocation: 'ONSITE', prefecture: '東京都',
    salaryMin: 700, salaryMax: 1100,
    japaneseLevel: 'N1', visaSponsorship: false,
    skills: ['プロダクト戦略', 'SQL', 'Figma'],
    status: 'DRAFT', applicationCount: 0, newApplicationCount: 0, viewCount: 0,
    publishedAt: null, createdAt: '2025-04-01',
  },
];

// ── Applications (for company's jobs) ────────────────────────

export interface CompanyApplication {
  id: string;
  code: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateCode: string;
  avatarInitial: string;
  avatarColor: string;
  japaneseLevel: string;
  yearsOfExperience: number;
  skills: string[];
  matchScore: number;
  status: ApplicationStatus;
  appliedAt: string;
  agentNote: string;
}

export const MOCK_COMPANY_APPLICATIONS: CompanyApplication[] = [
  {
    id: '1', code: 'APP0000010',
    jobId: '1', jobTitle: 'シニアフロントエンドエンジニア',
    candidateName: 'アリシェル ナザロフ', candidateCode: 'U0000010',
    avatarInitial: 'A', avatarColor: 'bg-indigo-600',
    japaneseLevel: 'N2', yearsOfExperience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    matchScore: 92, status: 'FIRST_INTERVIEW',
    appliedAt: '2025-03-22',
    agentNote: '技術力高い。面接通過率高いと判断。',
  },
  {
    id: '2', code: 'APP0000011',
    jobId: '1', jobTitle: 'シニアフロントエンドエンジニア',
    candidateName: '佐藤 美咲', candidateCode: 'U0000011',
    avatarInitial: 'S', avatarColor: 'bg-pink-500',
    japaneseLevel: 'NATIVE', yearsOfExperience: 3,
    skills: ['React', 'Vue.js', 'TypeScript'],
    matchScore: 78, status: 'SCREENING',
    appliedAt: '2025-03-25',
    agentNote: '書類審査中。デザインセンスも高い。',
  },
  {
    id: '3', code: 'APP0000012',
    jobId: '2', jobTitle: 'バックエンドエンジニア（Go/Python）',
    candidateName: 'Jasurbek Mirzayev', candidateCode: 'U0000012',
    avatarInitial: 'J', avatarColor: 'bg-teal-600',
    japaneseLevel: 'N3', yearsOfExperience: 4,
    skills: ['Go', 'Python', 'Docker', 'Kubernetes'],
    matchScore: 88, status: 'CASUAL_INTERVIEW',
    appliedAt: '2025-03-28',
    agentNote: 'Goエキスパート。リモートOKで問題なし。',
  },
  {
    id: '4', code: 'APP0000013',
    jobId: '2', jobTitle: 'バックエンドエンジニア（Go/Python）',
    candidateName: '山本 健二', candidateCode: 'U0000015',
    avatarInitial: 'Y', avatarColor: 'bg-gray-600',
    japaneseLevel: 'NATIVE', yearsOfExperience: 6,
    skills: ['Python', 'PostgreSQL', 'AWS'],
    matchScore: 80, status: 'REJECTED',
    appliedAt: '2025-03-15',
    agentNote: '希望年収が合わなかった。',
  },
];

// ── Agent messages ────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: 'company' | 'agent';
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1', senderId: 'agent',
    content: 'こんにちは！シニアフロントエンドエンジニアのポジションに新しい候補者が応募しました。アリシェルさんはReactとTypeScriptの経験が5年あり、マッチスコアは92%です。面接を進めますか？',
    createdAt: '2025-03-22T10:00:00',
    isRead: true,
  },
  {
    id: '2', senderId: 'company',
    content: 'ありがとうございます！ぜひ一次面接を設定してください。来週の火曜日か水曜日が都合が良いです。',
    createdAt: '2025-03-22T11:30:00',
    isRead: true,
  },
  {
    id: '3', senderId: 'agent',
    content: '承知しました。4月5日（火）14:00でオンライン面接を設定しました。Zoom URLをアリシェルさんにお送りします。ご確認ください。',
    createdAt: '2025-03-23T09:15:00',
    isRead: true,
  },
  {
    id: '4', senderId: 'agent',
    content: 'また、バックエンドエンジニアポジションにJasurbekさんが応募しました。GoとPythonのエキスパートで経験4年。カジュアル面談から始めますか？',
    createdAt: '2025-03-28T14:00:00',
    isRead: true,
  },
  {
    id: '5', senderId: 'company',
    content: 'はい、カジュアル面談をお願いします。来週中に設定できますか？',
    createdAt: '2025-03-28T15:30:00',
    isRead: true,
  },
  {
    id: '6', senderId: 'agent',
    content: '了解です。日程調整してご連絡します。なお、プロダクトマネージャーのポジションはまだ下書き状態です。公開する準備ができたらお知らせください。求人票の内容を一緒に確認しましょうか？',
    createdAt: '2025-04-01T09:00:00',
    isRead: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────

export const JOB_STATUS_LABELS: Record<CompanyJobStatus, string> = {
  DRAFT: '下書き',
  ACTIVE: '公開中',
  PAUSED: '一時停止',
  CLOSED: '終了',
};

export const JOB_STATUS_COLORS: Record<CompanyJobStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  CLOSED: 'bg-red-100 text-red-600',
};

export const JAPANESE_LEVEL_LABELS: Record<string, string> = {
  NONE: '不問', N5: 'N5', N4: 'N4', N3: 'N3', N2: 'N2', N1: 'N1',
  BUSINESS: 'ビジネス', NATIVE: 'ネイティブ',
};

export const WORK_LOCATION_LABELS: Record<string, string> = {
  ONSITE: 'オフィス', REMOTE: 'リモート', HYBRID: 'ハイブリッド',
};
