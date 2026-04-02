import { ApplicationStatus, STATUS_LABELS, STATUS_COLORS } from './applications';

export { STATUS_LABELS, STATUS_COLORS };
export type { ApplicationStatus };

// ── Agent profile ─────────────────────────────────────────────

export const MOCK_AGENT = {
  id: 1,
  code: 'A0000001',
  displayName: '田中 健太',
  email: 'tanaka@jobmatch.com',
  avatarInitial: 'T',
  avatarColor: 'bg-violet-600',
  totalCompanies: 3,
  totalJobs: 8,
  totalCandidates: 42,
};

// ── Companies (assigned to this agent) ───────────────────────

export interface AgentCompany {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  logoInitial: string;
  logoColor: string;
  industry: string;
  employeeCount: string;
  prefecture: string;
  city: string;
  websiteUrl: string;
  description: string;
  isVerified: boolean;
  isActive: boolean;
  activeJobCount: number;
  totalApplications: number;
  createdAt: string;
}

export const MOCK_AGENT_COMPANIES: AgentCompany[] = [
  {
    id: '1',
    code: 'C0000001',
    name: 'テックスタート株式会社',
    nameEn: 'TechStart Inc.',
    logoInitial: 'T',
    logoColor: 'bg-blue-600',
    industry: 'IT・SaaS',
    employeeCount: '50〜100名',
    prefecture: '東京都',
    city: '渋谷区',
    websiteUrl: 'https://techstart.jp',
    description: 'B2B SaaSプロダクトを開発するスタートアップ。急成長中のエンジニアリングチームを拡大中。',
    isVerified: true,
    isActive: true,
    activeJobCount: 3,
    totalApplications: 18,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    code: 'C0000002',
    name: 'グローバルデジタル合同会社',
    nameEn: 'Global Digital LLC',
    logoInitial: 'G',
    logoColor: 'bg-emerald-600',
    industry: 'デジタルマーケティング',
    employeeCount: '100〜300名',
    prefecture: '東京都',
    city: '港区',
    websiteUrl: 'https://globaldigital.co.jp',
    description: '外資系クライアント向けデジタルマーケティング・システム開発会社。日英バイリンガル環境。',
    isVerified: true,
    isActive: true,
    activeJobCount: 2,
    totalApplications: 31,
    createdAt: '2025-02-03',
  },
  {
    id: '3',
    code: 'C0000003',
    name: 'フューチャーファーム株式会社',
    nameEn: 'FutureFarm Co., Ltd.',
    logoInitial: 'F',
    logoColor: 'bg-orange-500',
    industry: 'AgriTech',
    employeeCount: '20〜50名',
    prefecture: '大阪府',
    city: '北区',
    websiteUrl: 'https://futurefarm.jp',
    description: 'AIを活用した農業DXスタートアップ。IoT・データ分析エンジニア急募。',
    isVerified: false,
    isActive: true,
    activeJobCount: 1,
    totalApplications: 7,
    createdAt: '2025-03-10',
  },
];

// ── Jobs (created by this agent, each tied to a company) ──────

export type AgentJobStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

export interface AgentJob {
  id: string;
  code: string;
  companyId: string;
  companyName: string;
  companyLogoInitial: string;
  companyLogoColor: string;
  title: string;
  jobType: string;
  workLocation: string;
  prefecture: string;
  salaryMin: number;
  salaryMax: number;
  japaneseLevel: string;
  visaSponsorship: boolean;
  skills: string[];
  status: AgentJobStatus;
  applicationCount: number;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export const MOCK_AGENT_JOBS: AgentJob[] = [
  {
    id: '1', code: 'J0000010',
    companyId: '1', companyName: 'テックスタート株式会社',
    companyLogoInitial: 'T', companyLogoColor: 'bg-blue-600',
    title: 'シニアフロントエンドエンジニア',
    jobType: 'FULL_TIME', workLocation: 'HYBRID',
    prefecture: '東京都', salaryMin: 650, salaryMax: 950,
    japaneseLevel: 'N2', visaSponsorship: true,
    skills: ['React', 'TypeScript', 'Next.js'],
    status: 'ACTIVE', applicationCount: 8, viewCount: 320,
    publishedAt: '2025-03-20', createdAt: '2025-03-18',
  },
  {
    id: '2', code: 'J0000011',
    companyId: '1', companyName: 'テックスタート株式会社',
    companyLogoInitial: 'T', companyLogoColor: 'bg-blue-600',
    title: 'バックエンドエンジニア（Go/Python）',
    jobType: 'FULL_TIME', workLocation: 'REMOTE',
    prefecture: '東京都', salaryMin: 600, salaryMax: 900,
    japaneseLevel: 'NONE', visaSponsorship: true,
    skills: ['Go', 'Python', 'PostgreSQL', 'Docker'],
    status: 'ACTIVE', applicationCount: 5, viewCount: 210,
    publishedAt: '2025-03-22', createdAt: '2025-03-20',
  },
  {
    id: '3', code: 'J0000012',
    companyId: '1', companyName: 'テックスタート株式会社',
    companyLogoInitial: 'T', companyLogoColor: 'bg-blue-600',
    title: 'プロダクトマネージャー',
    jobType: 'FULL_TIME', workLocation: 'ONSITE',
    prefecture: '東京都', salaryMin: 700, salaryMax: 1100,
    japaneseLevel: 'N1', visaSponsorship: false,
    skills: ['プロダクト戦略', 'SQL', 'Figma'],
    status: 'DRAFT', applicationCount: 0, viewCount: 0,
    publishedAt: null, createdAt: '2025-04-01',
  },
  {
    id: '4', code: 'J0000013',
    companyId: '2', companyName: 'グローバルデジタル合同会社',
    companyLogoInitial: 'G', companyLogoColor: 'bg-emerald-600',
    title: 'フルスタックエンジニア（日本語不問）',
    jobType: 'FULL_TIME', workLocation: 'HYBRID',
    prefecture: '東京都', salaryMin: 550, salaryMax: 850,
    japaneseLevel: 'NONE', visaSponsorship: true,
    skills: ['React', 'Node.js', 'MySQL', 'AWS'],
    status: 'ACTIVE', applicationCount: 14, viewCount: 580,
    publishedAt: '2025-03-10', createdAt: '2025-03-08',
  },
  {
    id: '5', code: 'J0000014',
    companyId: '2', companyName: 'グローバルデジタル合同会社',
    companyLogoInitial: 'G', companyLogoColor: 'bg-emerald-600',
    title: 'データアナリスト',
    jobType: 'FULL_TIME', workLocation: 'HYBRID',
    prefecture: '東京都', salaryMin: 500, salaryMax: 750,
    japaneseLevel: 'N2', visaSponsorship: false,
    skills: ['Python', 'SQL', 'Tableau', 'BigQuery'],
    status: 'PAUSED', applicationCount: 6, viewCount: 145,
    publishedAt: '2025-02-20', createdAt: '2025-02-18',
  },
  {
    id: '6', code: 'J0000015',
    companyId: '3', companyName: 'フューチャーファーム株式会社',
    companyLogoInitial: 'F', companyLogoColor: 'bg-orange-500',
    title: 'IoTエンジニア（組み込み/クラウド）',
    jobType: 'FULL_TIME', workLocation: 'HYBRID',
    prefecture: '大阪府', salaryMin: 500, salaryMax: 800,
    japaneseLevel: 'N3', visaSponsorship: true,
    skills: ['C/C++', 'Python', 'AWS IoT', 'MQTT'],
    status: 'ACTIVE', applicationCount: 3, viewCount: 98,
    publishedAt: '2025-03-28', createdAt: '2025-03-26',
  },
];

// ── Candidates (applied to agent's jobs) ─────────────────────

export interface AgentCandidate {
  id: string;
  code: string;
  name: string;
  nameKana: string;
  avatarInitial: string;
  avatarColor: string;
  prefecture: string;
  japaneseLevel: string;
  yearsOfExperience: number;
  skills: string[];
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  isOpenToWork: boolean;
  applicationId: string;
  applicationCode: string;
  appliedJobId: string;
  appliedJobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  lastUpdated: string;
  agentNote: string;
  matchScore: number; // 0-100
}

export const MOCK_AGENT_CANDIDATES: AgentCandidate[] = [
  {
    id: '1', code: 'U0000010',
    name: 'アリシェル ナザロフ', nameKana: 'アリシェル ナザロフ',
    avatarInitial: 'A', avatarColor: 'bg-indigo-600',
    prefecture: '東京都', japaneseLevel: 'N2',
    yearsOfExperience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    desiredSalaryMin: 600, desiredSalaryMax: 1000,
    isOpenToWork: true,
    applicationId: 'a1', applicationCode: 'APP0000010',
    appliedJobId: '1', appliedJobTitle: 'シニアフロントエンドエンジニア',
    companyName: 'テックスタート株式会社',
    status: 'FIRST_INTERVIEW',
    appliedAt: '2025-03-22', lastUpdated: '2025-03-28',
    agentNote: '技術力高い。Next.js経験豊富。面接通過率高いと判断。',
    matchScore: 92,
  },
  {
    id: '2', code: 'U0000011',
    name: '佐藤 美咲', nameKana: 'サトウ ミサキ',
    avatarInitial: 'S', avatarColor: 'bg-pink-500',
    prefecture: '東京都', japaneseLevel: 'NATIVE',
    yearsOfExperience: 3,
    skills: ['React', 'Vue.js', 'TypeScript', 'Figma'],
    desiredSalaryMin: 550, desiredSalaryMax: 800,
    isOpenToWork: true,
    applicationId: 'a2', applicationCode: 'APP0000011',
    appliedJobId: '1', appliedJobTitle: 'シニアフロントエンドエンジニア',
    companyName: 'テックスタート株式会社',
    status: 'SCREENING',
    appliedAt: '2025-03-25', lastUpdated: '2025-03-26',
    agentNote: '書類審査中。デザインセンスも高い。',
    matchScore: 78,
  },
  {
    id: '3', code: 'U0000012',
    name: 'Jasurbek Mirzayev', nameKana: 'ジャスルベク ミルザエフ',
    avatarInitial: 'J', avatarColor: 'bg-teal-600',
    prefecture: '大阪府', japaneseLevel: 'N3',
    yearsOfExperience: 4,
    skills: ['Go', 'Python', 'Docker', 'Kubernetes', 'PostgreSQL'],
    desiredSalaryMin: 600, desiredSalaryMax: 900,
    isOpenToWork: true,
    applicationId: 'a3', applicationCode: 'APP0000012',
    appliedJobId: '2', appliedJobTitle: 'バックエンドエンジニア（Go/Python）',
    companyName: 'テックスタート株式会社',
    status: 'CASUAL_INTERVIEW',
    appliedAt: '2025-03-28', lastUpdated: '2025-03-29',
    agentNote: 'Goエキスパート。リモートOKなので大阪在住でも問題なし。',
    matchScore: 88,
  },
  {
    id: '4', code: 'U0000013',
    name: '鈴木 太郎', nameKana: 'スズキ タロウ',
    avatarInitial: 'S', avatarColor: 'bg-amber-500',
    prefecture: '東京都', japaneseLevel: 'NATIVE',
    yearsOfExperience: 7,
    skills: ['React', 'Node.js', 'MySQL', 'AWS', 'TypeScript'],
    desiredSalaryMin: 700, desiredSalaryMax: 1000,
    isOpenToWork: true,
    applicationId: 'a4', applicationCode: 'APP0000013',
    appliedJobId: '4', appliedJobTitle: 'フルスタックエンジニア',
    companyName: 'グローバルデジタル合同会社',
    status: 'SECOND_INTERVIEW',
    appliedAt: '2025-03-12', lastUpdated: '2025-03-30',
    agentNote: '経験豊富。リーダーシップあり。最終面接に進む可能性高い。',
    matchScore: 95,
  },
  {
    id: '5', code: 'U0000014',
    name: 'Dilnoza Yusupova', nameKana: 'ディルノザ ユスポワ',
    avatarInitial: 'D', avatarColor: 'bg-purple-500',
    prefecture: '東京都', japaneseLevel: 'N2',
    yearsOfExperience: 2,
    skills: ['Python', 'SQL', 'pandas', 'Tableau'],
    desiredSalaryMin: 450, desiredSalaryMax: 650,
    isOpenToWork: true,
    applicationId: 'a5', applicationCode: 'APP0000014',
    appliedJobId: '5', appliedJobTitle: 'データアナリスト',
    companyName: 'グローバルデジタル合同会社',
    status: 'PENDING',
    appliedAt: '2025-04-01', lastUpdated: '2025-04-01',
    agentNote: '',
    matchScore: 71,
  },
  {
    id: '6', code: 'U0000015',
    name: '山本 健二', nameKana: 'ヤマモト ケンジ',
    avatarInitial: 'Y', avatarColor: 'bg-gray-600',
    prefecture: '東京都', japaneseLevel: 'NATIVE',
    yearsOfExperience: 6,
    skills: ['React', 'TypeScript', 'GraphQL'],
    desiredSalaryMin: 700, desiredSalaryMax: 1000,
    isOpenToWork: false,
    applicationId: 'a6', applicationCode: 'APP0000015',
    appliedJobId: '1', appliedJobTitle: 'シニアフロントエンドエンジニア',
    companyName: 'テックスタート株式会社',
    status: 'REJECTED',
    appliedAt: '2025-03-15', lastUpdated: '2025-03-25',
    agentNote: '技術面は問題ないが、希望年収が合わなかった。',
    matchScore: 80,
  },
];

// ── Job status helpers ────────────────────────────────────────

export const JOB_STATUS_LABELS: Record<AgentJobStatus, string> = {
  DRAFT: '下書き',
  ACTIVE: '公開中',
  PAUSED: '一時停止',
  CLOSED: '終了',
};

export const JOB_STATUS_COLORS: Record<AgentJobStatus, string> = {
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
