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

export interface MockApplication {
  id: string;
  code: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoInitial: string;
  companyLogoColor: string;
  prefecture: string;
  salaryMin: number;
  salaryMax: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  agentNote?: string;
  nextAction?: string;
}

export const PIPELINE_STAGES: ApplicationStatus[] = [
  'PENDING',
  'CASUAL_INTERVIEW',
  'SCREENING',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'FINAL_INTERVIEW',
  'OFFER',
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
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

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  CASUAL_INTERVIEW: 'bg-blue-100 text-blue-700',
  SCREENING: 'bg-indigo-100 text-indigo-700',
  FIRST_INTERVIEW: 'bg-violet-100 text-violet-700',
  SECOND_INTERVIEW: 'bg-purple-100 text-purple-700',
  THIRD_INTERVIEW: 'bg-fuchsia-100 text-fuchsia-700',
  FINAL_INTERVIEW: 'bg-orange-100 text-orange-700',
  OFFER: 'bg-green-100 text-green-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-gray-100 text-gray-500',
};

export const MOCK_APPLICATIONS: MockApplication[] = [
  {
    id: '1',
    code: 'APP0000001',
    jobId: '1',
    jobTitle: 'フロントエンドエンジニア（React/TypeScript）',
    companyName: '楽天グループ株式会社',
    companyLogoInitial: 'R',
    companyLogoColor: 'bg-red-600',
    prefecture: '東京都',
    salaryMin: 600,
    salaryMax: 1000,
    status: 'FIRST_INTERVIEW',
    appliedAt: '2025-03-20',
    updatedAt: '2025-03-28',
    agentNote: '一次面接のご案内をお送りしました。ご確認ください。',
    nextAction: '2025-04-05 一次面接（オンライン）',
  },
  {
    id: '2',
    code: 'APP0000002',
    jobId: '2',
    jobTitle: 'バックエンドエンジニア（NestJS/TypeScript）',
    companyName: 'メルカリ',
    companyLogoInitial: 'M',
    companyLogoColor: 'bg-red-500',
    prefecture: '東京都',
    salaryMin: 700,
    salaryMax: 1200,
    status: 'SCREENING',
    appliedAt: '2025-03-25',
    updatedAt: '2025-03-26',
    agentNote: '書類選考中です。結果は1週間以内にご連絡します。',
  },
  {
    id: '3',
    code: 'APP0000003',
    jobId: '4',
    jobTitle: 'Pythonエンジニア（AI/ML）',
    companyName: 'ソフトバンク株式会社',
    companyLogoInitial: 'S',
    companyLogoColor: 'bg-blue-600',
    prefecture: '東京都',
    salaryMin: 650,
    salaryMax: 1100,
    status: 'OFFER',
    appliedAt: '2025-03-01',
    updatedAt: '2025-03-30',
    agentNote: '内定通知が届きました！承諾期限は4月15日です。',
    nextAction: '2025-04-15 承諾期限',
  },
  {
    id: '4',
    code: 'APP0000004',
    jobId: '5',
    jobTitle: 'インフラエンジニア（AWS/Kubernetes）',
    companyName: 'DeNA Co., Ltd.',
    companyLogoInitial: 'D',
    companyLogoColor: 'bg-purple-600',
    prefecture: '東京都',
    salaryMin: 600,
    salaryMax: 1000,
    status: 'REJECTED',
    appliedAt: '2025-03-10',
    updatedAt: '2025-03-22',
    agentNote: '今回は残念ながら選考を通過できませんでした。',
  },
  {
    id: '5',
    code: 'APP0000005',
    jobId: '3',
    jobTitle: 'Webエンジニア（フルスタック）',
    companyName: 'LINE株式会社',
    companyLogoInitial: 'L',
    companyLogoColor: 'bg-green-500',
    prefecture: '東京都',
    salaryMin: 550,
    salaryMax: 900,
    status: 'CASUAL_INTERVIEW',
    appliedAt: '2025-04-01',
    updatedAt: '2025-04-01',
    agentNote: 'カジュアル面談の日程調整中です。',
  },
];
