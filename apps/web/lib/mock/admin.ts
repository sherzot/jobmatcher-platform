// ─────────────────────────────────────────────────────────────
// Admin Mock Data
// Full system view: agents, companies, users, platform stats
// ─────────────────────────────────────────────────────────────

// ── Platform stats ────────────────────────────────────────────

export const PLATFORM_STATS = {
  totalUsers:        1_248,
  newUsersThisMonth:    87,
  totalAgents:           6,
  totalCompanies:       34,
  newCompaniesThisMonth: 4,
  activeJobs:           91,
  totalApplications: 3_412,
  applicationsThisMonth: 312,
  offerRate:          18.4, // %
  avgMatchScore:      76.2, // %
  pendingVerifications:  3,
  flaggedAccounts:       1,
};

// ── Agent management ──────────────────────────────────────────

export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AdminAgent {
  id: string;
  code: string;
  displayName: string;
  email: string;
  phone: string;
  avatarInitial: string;
  avatarColor: string;
  status: AgentStatus;
  assignedCompanies: number;
  activeJobs: number;
  totalCandidates: number;
  applicationsThisMonth: number;
  offersMadeTotal: number;
  joinedAt: string;
}

export const MOCK_ADMIN_AGENTS: AdminAgent[] = [
  {
    id: 'ag1', code: 'A0000001',
    displayName: '田中 健太',
    email: 'tanaka@jobmatch.com',
    phone: '03-0000-0001',
    avatarInitial: 'T', avatarColor: 'bg-violet-600',
    status: 'ACTIVE',
    assignedCompanies: 3, activeJobs: 8, totalCandidates: 42,
    applicationsThisMonth: 56, offersMadeTotal: 18,
    joinedAt: '2024-04-01',
  },
  {
    id: 'ag2', code: 'A0000002',
    displayName: '鈴木 あかり',
    email: 'suzuki@jobmatch.com',
    phone: '03-0000-0002',
    avatarInitial: 'S', avatarColor: 'bg-pink-500',
    status: 'ACTIVE',
    assignedCompanies: 5, activeJobs: 14, totalCandidates: 68,
    applicationsThisMonth: 94, offersMadeTotal: 31,
    joinedAt: '2024-02-15',
  },
  {
    id: 'ag3', code: 'A0000003',
    displayName: 'Bekzod Yusupov',
    email: 'bekzod@jobmatch.com',
    phone: '03-0000-0003',
    avatarInitial: 'B', avatarColor: 'bg-teal-600',
    status: 'ACTIVE',
    assignedCompanies: 4, activeJobs: 11, totalCandidates: 55,
    applicationsThisMonth: 72, offersMadeTotal: 22,
    joinedAt: '2024-06-10',
  },
  {
    id: 'ag4', code: 'A0000004',
    displayName: '山本 裕二',
    email: 'yamamoto@jobmatch.com',
    phone: '03-0000-0004',
    avatarInitial: 'Y', avatarColor: 'bg-orange-500',
    status: 'ACTIVE',
    assignedCompanies: 6, activeJobs: 17, totalCandidates: 83,
    applicationsThisMonth: 120, offersMadeTotal: 45,
    joinedAt: '2023-11-01',
  },
  {
    id: 'ag5', code: 'A0000005',
    displayName: '中村 美里',
    email: 'nakamura@jobmatch.com',
    phone: '03-0000-0005',
    avatarInitial: 'N', avatarColor: 'bg-emerald-600',
    status: 'INACTIVE',
    assignedCompanies: 2, activeJobs: 0, totalCandidates: 19,
    applicationsThisMonth: 0, offersMadeTotal: 8,
    joinedAt: '2024-08-20',
  },
  {
    id: 'ag6', code: 'A0000006',
    displayName: '伊藤 誠',
    email: 'ito@jobmatch.com',
    phone: '03-0000-0006',
    avatarInitial: 'I', avatarColor: 'bg-rose-500',
    status: 'SUSPENDED',
    assignedCompanies: 1, activeJobs: 0, totalCandidates: 7,
    applicationsThisMonth: 0, offersMadeTotal: 1,
    joinedAt: '2025-01-05',
  },
];

// ── Company management ────────────────────────────────────────

export type CompanyVerificationStatus = 'VERIFIED' | 'PENDING' | 'REJECTED';

export interface AdminCompany {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  logoInitial: string;
  logoColor: string;
  industry: string;
  prefecture: string;
  employeeCount: string;
  assignedAgentId: string;
  assignedAgentName: string;
  verificationStatus: CompanyVerificationStatus;
  isActive: boolean;
  activeJobCount: number;
  totalApplications: number;
  registeredAt: string;
}

export const MOCK_ADMIN_COMPANIES: AdminCompany[] = [
  {
    id: 'c1', code: 'C0000001',
    name: 'テックスタート株式会社', nameEn: 'TechStart Inc.',
    logoInitial: 'T', logoColor: 'bg-blue-600',
    industry: 'IT・SaaS', prefecture: '東京都', employeeCount: '50〜100名',
    assignedAgentId: 'ag1', assignedAgentName: '田中 健太',
    verificationStatus: 'VERIFIED', isActive: true,
    activeJobCount: 3, totalApplications: 26,
    registeredAt: '2025-01-15',
  },
  {
    id: 'c2', code: 'C0000002',
    name: 'グローバルフィンテック株式会社', nameEn: 'Global FinTech Corp.',
    logoInitial: 'G', logoColor: 'bg-green-600',
    industry: 'フィンテック', prefecture: '東京都', employeeCount: '100〜300名',
    assignedAgentId: 'ag2', assignedAgentName: '鈴木 あかり',
    verificationStatus: 'VERIFIED', isActive: true,
    activeJobCount: 5, totalApplications: 61,
    registeredAt: '2024-11-20',
  },
  {
    id: 'c3', code: 'C0000003',
    name: 'ロジスティクスAI株式会社', nameEn: 'LogisticsAI Inc.',
    logoInitial: 'L', logoColor: 'bg-amber-600',
    industry: 'IT・インターネット', prefecture: '大阪府', employeeCount: '10〜50名',
    assignedAgentId: 'ag3', assignedAgentName: 'Bekzod Yusupov',
    verificationStatus: 'PENDING', isActive: false,
    activeJobCount: 0, totalApplications: 0,
    registeredAt: '2025-03-28',
  },
  {
    id: 'c4', code: 'C0000004',
    name: 'メディカルイノベーション株式会社', nameEn: 'Medical Innovation Ltd.',
    logoInitial: 'M', logoColor: 'bg-red-500',
    industry: 'その他', prefecture: '東京都', employeeCount: '300〜1,000名',
    assignedAgentId: 'ag4', assignedAgentName: '山本 裕二',
    verificationStatus: 'PENDING', isActive: false,
    activeJobCount: 0, totalApplications: 0,
    registeredAt: '2025-03-30',
  },
  {
    id: 'c5', code: 'C0000005',
    name: 'クリエイティブスタジオ合同会社', nameEn: 'Creative Studio LLC.',
    logoInitial: 'C', logoColor: 'bg-purple-500',
    industry: 'ゲーム・エンタメ', prefecture: '神奈川県', employeeCount: '10〜50名',
    assignedAgentId: 'ag2', assignedAgentName: '鈴木 あかり',
    verificationStatus: 'PENDING', isActive: false,
    activeJobCount: 0, totalApplications: 0,
    registeredAt: '2025-04-01',
  },
  {
    id: 'c6', code: 'C0000006',
    name: '古いシステム株式会社', nameEn: 'OldSys Co.',
    logoInitial: 'O', logoColor: 'bg-gray-500',
    industry: 'その他', prefecture: '北海道', employeeCount: '1〜10名',
    assignedAgentId: 'ag1', assignedAgentName: '田中 健太',
    verificationStatus: 'REJECTED', isActive: false,
    activeJobCount: 0, totalApplications: 0,
    registeredAt: '2025-02-10',
  },
];

// ── User management ───────────────────────────────────────────

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AdminUser {
  id: string;
  code: string;
  lastName: string;
  firstName: string;
  email: string;
  avatarInitial: string;
  avatarColor: string;
  japaneseLevel: string;
  visaType: string;
  nationality: string;
  profileCompleteness: number;
  applicationCount: number;
  status: UserStatus;
  registeredAt: string;
  lastLoginAt: string;
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'u1', code: 'U0000001',
    lastName: 'ナザロフ', firstName: 'アリシェル',
    email: 'alisher@example.com',
    avatarInitial: 'A', avatarColor: 'bg-indigo-600',
    japaneseLevel: 'N2', visaType: '技術・人文知識・国際業務', nationality: 'ウズベキスタン',
    profileCompleteness: 85, applicationCount: 5,
    status: 'ACTIVE',
    registeredAt: '2025-03-01', lastLoginAt: '2025-04-02',
  },
  {
    id: 'u2', code: 'U0000002',
    lastName: '佐藤', firstName: '美咲',
    email: 'misaki@example.com',
    avatarInitial: 'S', avatarColor: 'bg-pink-500',
    japaneseLevel: 'NATIVE', visaType: '日本人', nationality: '日本',
    profileCompleteness: 92, applicationCount: 3,
    status: 'ACTIVE',
    registeredAt: '2025-02-18', lastLoginAt: '2025-04-01',
  },
  {
    id: 'u3', code: 'U0000003',
    lastName: 'Mirzayev', firstName: 'Jasurbek',
    email: 'jasurbek@example.com',
    avatarInitial: 'J', avatarColor: 'bg-teal-600',
    japaneseLevel: 'N3', visaType: '技術・人文知識・国際業務', nationality: 'ウズベキスタン',
    profileCompleteness: 78, applicationCount: 4,
    status: 'ACTIVE',
    registeredAt: '2025-03-10', lastLoginAt: '2025-03-31',
  },
  {
    id: 'u4', code: 'U0000004',
    lastName: '山田', firstName: '太郎',
    email: 'yamada@example.com',
    avatarInitial: 'Y', avatarColor: 'bg-gray-500',
    japaneseLevel: 'NATIVE', visaType: '日本人', nationality: '日本',
    profileCompleteness: 45, applicationCount: 1,
    status: 'ACTIVE',
    registeredAt: '2025-03-22', lastLoginAt: '2025-03-25',
  },
  {
    id: 'u5', code: 'U0000005',
    lastName: 'Kim', firstName: 'Jiyeon',
    email: 'jiyeon@example.com',
    avatarInitial: 'K', avatarColor: 'bg-rose-500',
    japaneseLevel: 'N1', visaType: '特定技能', nationality: '韓国',
    profileCompleteness: 60, applicationCount: 2,
    status: 'ACTIVE',
    registeredAt: '2025-03-15', lastLoginAt: '2025-03-28',
  },
  {
    id: 'u6', code: 'U0000006',
    lastName: 'Rahimov', firstName: 'Doniyor',
    email: 'doniyor@example.com',
    avatarInitial: 'D', avatarColor: 'bg-blue-500',
    japaneseLevel: 'N2', visaType: '技術・人文知識・国際業務', nationality: 'ウズベキスタン',
    profileCompleteness: 30, applicationCount: 0,
    status: 'INACTIVE',
    registeredAt: '2025-04-01', lastLoginAt: '2025-04-01',
  },
  {
    id: 'u7', code: 'U0000007',
    lastName: '中田', firstName: '浩二',
    email: 'nakata@example.com',
    avatarInitial: 'N', avatarColor: 'bg-gray-400',
    japaneseLevel: 'NATIVE', visaType: '日本人', nationality: '日本',
    profileCompleteness: 10, applicationCount: 0,
    status: 'SUSPENDED',
    registeredAt: '2025-01-20', lastLoginAt: '2025-02-05',
  },
];

// ── Recent activity (for dashboard) ──────────────────────────

export interface ActivityItem {
  id: string;
  type: 'NEW_USER' | 'NEW_COMPANY' | 'NEW_APPLICATION' | 'OFFER_MADE' | 'AGENT_ACTION';
  description: string;
  actorName: string;
  targetName: string;
  createdAt: string;
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1', type: 'NEW_USER',
    description: '新規ユーザー登録',
    actorName: 'Doniyor Rahimov', targetName: 'U0000006',
    createdAt: '2025-04-01T14:30:00',
  },
  {
    id: 'a2', type: 'NEW_COMPANY',
    description: '企業登録（審査待ち）',
    actorName: 'クリエイティブスタジオ合同会社', targetName: 'C0000005',
    createdAt: '2025-04-01T11:00:00',
  },
  {
    id: 'a3', type: 'OFFER_MADE',
    description: '内定通知',
    actorName: '田中 健太', targetName: 'アリシェル ナザロフ → テックスタート',
    createdAt: '2025-03-31T16:00:00',
  },
  {
    id: 'a4', type: 'NEW_APPLICATION',
    description: '新規応募',
    actorName: 'Jasurbek Mirzayev', targetName: 'バックエンドエンジニア（Go/Python）',
    createdAt: '2025-03-30T09:00:00',
  },
  {
    id: 'a5', type: 'NEW_COMPANY',
    description: '企業登録（審査待ち）',
    actorName: 'メディカルイノベーション株式会社', targetName: 'C0000004',
    createdAt: '2025-03-30T08:00:00',
  },
  {
    id: 'a6', type: 'AGENT_ACTION',
    description: '書類選考通過',
    actorName: '鈴木 あかり', targetName: '佐藤 美咲 → シニアFE',
    createdAt: '2025-03-29T14:00:00',
  },
];

// ── Helpers ───────────────────────────────────────────────────

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  ACTIVE:    'アクティブ',
  INACTIVE:  '非アクティブ',
  SUSPENDED: '停止中',
};

export const AGENT_STATUS_COLORS: Record<AgentStatus, string> = {
  ACTIVE:    'bg-green-100 text-green-700',
  INACTIVE:  'bg-gray-100 text-gray-500',
  SUSPENDED: 'bg-red-100 text-red-600',
};

export const VERIFICATION_LABELS: Record<CompanyVerificationStatus, string> = {
  VERIFIED: '認証済み',
  PENDING:  '審査中',
  REJECTED: '却下',
};

export const VERIFICATION_COLORS: Record<CompanyVerificationStatus, string> = {
  VERIFIED: 'bg-green-100 text-green-700',
  PENDING:  'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-600',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE:    'アクティブ',
  INACTIVE:  '未アクティブ',
  SUSPENDED: '停止中',
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE:    'bg-green-100 text-green-700',
  INACTIVE:  'bg-gray-100 text-gray-500',
  SUSPENDED: 'bg-red-100 text-red-600',
};

export const ACTIVITY_ICONS: Record<ActivityItem['type'], string> = {
  NEW_USER:        '👤',
  NEW_COMPANY:     '🏢',
  NEW_APPLICATION: '📄',
  OFFER_MADE:      '🎉',
  AGENT_ACTION:    '🤝',
};

export const JAPANESE_LEVEL_LABELS: Record<string, string> = {
  NONE: '不問', N5: 'N5', N4: 'N4', N3: 'N3', N2: 'N2', N1: 'N1',
  BUSINESS: 'ビジネス', NATIVE: 'ネイティブ',
};
