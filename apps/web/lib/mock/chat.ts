// ─────────────────────────────────────────────────────────────
// Chat Mock Data — Application-scoped architecture
//
// Every conversation is scoped to either:
//   1. An APPLICATION (applicationId required) — tied to a specific
//      job + candidate + company triplet
//   2. GENERAL — free-form between a pair, not job-specific
//
// Access rules:
//   CANDIDATE ↔ AGENT      — always allowed (general + per-application)
//   COMPANY   ↔ AGENT      — always allowed (general + per-application)
//   CANDIDATE ↔ COMPANY    — BLOCKED unless agent explicitly enables it
//   ADMIN     ↔ anyone     — always allowed, unrestricted
// ─────────────────────────────────────────────────────────────

export type ParticipantRole = 'CANDIDATE' | 'AGENT' | 'COMPANY' | 'ADMIN';

export type ConversationType =
  | 'APPLICATION_AGENT_CANDIDATE'  // Agent ↔ Candidate about a specific application
  | 'APPLICATION_AGENT_COMPANY'    // Agent ↔ Company about a specific candidate/application
  | 'APPLICATION_CANDIDATE_COMPANY'// Candidate ↔ Company (agent-enabled only)
  | 'GENERAL_AGENT_CANDIDATE'      // Agent ↔ Candidate — no specific job
  | 'GENERAL_AGENT_COMPANY'        // Agent ↔ Company — no specific job
  | 'ADMIN_SUPPORT';               // Admin ↔ any role

export interface ChatParticipant {
  id: string;
  role: ParticipantRole;
  name: string;
  avatarInitial: string;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: ParticipantRole;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;

  // ── Application context (required for APPLICATION_* types) ──
  applicationId?: string;    // APP0000001
  applicationCode?: string;
  jobId?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  candidateId?: string;
  candidateName?: string;
  agentId?: string;
  agentName?: string;

  // ── Participants & messages ──────────────────────────────────
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;

  // ── CANDIDATE_COMPANY gate ───────────────────────────────────
  agentEnabled?: boolean;   // must be true for APPLICATION_CANDIDATE_COMPANY
}

// ── Participants ───────────────────────────────────────────────

const P = {
  alisher: {
    id: 'u1', role: 'CANDIDATE' as const,
    name: 'アリシェル ナザロフ', avatarInitial: 'A', avatarColor: 'bg-indigo-600',
  },
  sato: {
    id: 'u2', role: 'CANDIDATE' as const,
    name: '佐藤 美咲', avatarInitial: 'S', avatarColor: 'bg-pink-500',
  },
  tanaka: {
    id: 'ag1', role: 'AGENT' as const,
    name: '田中 健太', avatarInitial: 'T', avatarColor: 'bg-violet-600',
  },
  techstart: {
    id: 'c1', role: 'COMPANY' as const,
    name: 'テックスタート株式会社', avatarInitial: 'T', avatarColor: 'bg-blue-600',
  },
  admin: {
    id: 'adm1', role: 'ADMIN' as const,
    name: 'システム管理者', avatarInitial: 'A', avatarColor: 'bg-gray-700',
  },
};

// ── Application context objects (reused below) ─────────────────

const APP1 = {
  applicationId: 'app1',
  applicationCode: 'APP0000001',
  jobId: 'j1',
  jobTitle: 'シニアフロントエンドエンジニア',
  companyId: 'c1',
  companyName: 'テックスタート株式会社',
  candidateId: 'u1',
  candidateName: 'アリシェル ナザロフ',
  agentId: 'ag1',
  agentName: '田中 健太',
};

const APP2 = {
  applicationId: 'app2',
  applicationCode: 'APP0000011',
  jobId: 'j1',
  jobTitle: 'シニアフロントエンドエンジニア',
  companyId: 'c1',
  companyName: 'テックスタート株式会社',
  candidateId: 'u2',
  candidateName: '佐藤 美咲',
  agentId: 'ag1',
  agentName: '田中 健太',
};

// ── Conversations ──────────────────────────────────────────────

export const ALL_CONVERSATIONS: Conversation[] = [

  // ── 1. APPLICATION: Agent ↔ Alisher (APP0000001) ────────────
  {
    id: 'conv-1',
    type: 'APPLICATION_AGENT_CANDIDATE',
    ...APP1,
    participants: [P.tanaka, P.alisher],
    lastMessage: '4月5日の一次面接、頑張ってください！何かあればご連絡ください。',
    lastMessageAt: '2025-04-01T09:30:00',
    unreadCount: 1,
    messages: [
      {
        id: 'm1-1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'アリシェルさん、テックスタートのシニアFEポジション（APP0000001）に応募いただきありがとうございます。書類選考を通過しました。一次面接の日程を調整したいのですが、来週はいかがでしょうか？',
        createdAt: '2025-03-28T10:00:00', isRead: true,
      },
      {
        id: 'm1-2', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'ありがとうございます！来週なら火曜日か木曜日の午後が都合良いです。',
        createdAt: '2025-03-28T11:30:00', isRead: true,
      },
      {
        id: 'm1-3', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '承知しました。4月5日（火）14:00でZoom面接を設定しました。URLをメールでお送りします。ReactとTypeScriptの実務経験、チーム開発の事例を準備しておくと良いです。',
        createdAt: '2025-03-28T14:00:00', isRead: true,
      },
      {
        id: 'm1-4', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '4月5日の一次面接、頑張ってください！何かあればご連絡ください。',
        createdAt: '2025-04-01T09:30:00', isRead: false,
      },
    ],
  },

  // ── 2. APPLICATION: Agent ↔ TechStart (APP0000001 / Alisher) ─
  {
    id: 'conv-2',
    type: 'APPLICATION_AGENT_COMPANY',
    ...APP1,
    participants: [P.tanaka, P.techstart],
    lastMessage: 'プロダクトマネージャーの求人票の内容を一緒に確認しましょうか？',
    lastMessageAt: '2025-04-01T09:00:00',
    unreadCount: 1,
    messages: [
      {
        id: 'm2-1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '【APP0000001】シニアFEポジションにアリシェルさんが応募しました。React/TS 5年、マッチスコア92%です。一次面接を進めますか？',
        createdAt: '2025-03-22T10:00:00', isRead: true,
      },
      {
        id: 'm2-2', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'ぜひお願いします！来週火曜か水曜が都合良いです。',
        createdAt: '2025-03-22T11:30:00', isRead: true,
      },
      {
        id: 'm2-3', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '4月5日（火）14:00でZoom面接を設定しました。候補者にも連絡済みです。',
        createdAt: '2025-03-23T09:15:00', isRead: true,
      },
      {
        id: 'm2-4', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'プロダクトマネージャーの求人票の内容を一緒に確認しましょうか？',
        createdAt: '2025-04-01T09:00:00', isRead: false,
      },
    ],
  },

  // ── 3. APPLICATION: Alisher ↔ TechStart (APP0000001, agent-enabled) ─
  {
    id: 'conv-3',
    type: 'APPLICATION_CANDIDATE_COMPANY',
    ...APP1,
    agentEnabled: true,
    participants: [P.alisher, P.techstart, P.tanaka],
    lastMessage: 'それでは面接当日にお会いしましょう。よろしくお願いします。',
    lastMessageAt: '2025-04-02T10:00:00',
    unreadCount: 1,
    messages: [
      {
        id: 'm3-1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '【システム通知】エージェント（田中 健太）がこのチャットを承認しました。APP0000001の選考に関してアリシェルさんとテックスタートの直接連絡が可能になりました。',
        createdAt: '2025-04-01T14:00:00', isRead: true,
      },
      {
        id: 'm3-2', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'アリシェルさん、はじめまして。エンジニアリングマネージャーの鈴木です。面接について事前にお話しできればと思いご連絡しました。',
        createdAt: '2025-04-01T14:30:00', isRead: true,
      },
      {
        id: 'm3-3', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'よろしくお願いします！何かご質問があればお気軽にどうぞ。',
        createdAt: '2025-04-01T15:00:00', isRead: true,
      },
      {
        id: 'm3-4', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'それでは面接当日にお会いしましょう。よろしくお願いします。',
        createdAt: '2025-04-02T10:00:00', isRead: false,
      },
    ],
  },

  // ── 4. APPLICATION: Agent ↔ Sato (APP0000011) ───────────────
  {
    id: 'conv-4',
    type: 'APPLICATION_AGENT_CANDIDATE',
    ...APP2,
    participants: [P.tanaka, P.sato],
    lastMessage: '書類選考の結果は今週中にご連絡します。',
    lastMessageAt: '2025-03-26T15:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm4-1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '佐藤さん、テックスタート シニアFEポジション（APP0000011）へのご応募ありがとうございます。現在書類選考中です。',
        createdAt: '2025-03-25T12:00:00', isRead: true,
      },
      {
        id: 'm4-2', senderId: 'u2', senderRole: 'CANDIDATE', senderName: '佐藤 美咲',
        content: 'ありがとうございます。よろしくお願いします。',
        createdAt: '2025-03-25T13:00:00', isRead: true,
      },
      {
        id: 'm4-3', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '書類選考の結果は今週中にご連絡します。',
        createdAt: '2025-03-26T15:00:00', isRead: true,
      },
    ],
  },

  // ── 5. APPLICATION: Agent ↔ TechStart (APP0000011 / Sato) ───
  {
    id: 'conv-5',
    type: 'APPLICATION_AGENT_COMPANY',
    ...APP2,
    participants: [P.tanaka, P.techstart],
    lastMessage: '佐藤さんの書類を確認しました。デザインセンスも高いと思います。',
    lastMessageAt: '2025-03-27T10:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm5-1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '【APP0000011】佐藤さんがシニアFEポジションに応募しました。React/Vue.js 3年、日本語ネイティブ、マッチスコア78%です。',
        createdAt: '2025-03-25T14:00:00', isRead: true,
      },
      {
        id: 'm5-2', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'ありがとうございます。書類を確認します。',
        createdAt: '2025-03-26T09:00:00', isRead: true,
      },
      {
        id: 'm5-3', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '佐藤さんの書類を確認しました。デザインセンスも高いと思います。',
        createdAt: '2025-03-27T10:00:00', isRead: true,
      },
    ],
  },

  // ── 6. GENERAL: Agent ↔ TechStart ───────────────────────────
  {
    id: 'conv-6',
    type: 'GENERAL_AGENT_COMPANY',
    agentId: 'ag1', agentName: '田中 健太',
    companyId: 'c1', companyName: 'テックスタート株式会社',
    participants: [P.tanaka, P.techstart],
    lastMessage: '来月からバックエンドエンジニアの採用も強化しますので引き続きよろしくお願いします。',
    lastMessageAt: '2025-03-20T16:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm6-1', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: '田中さん、今月の採用活動ありがとうございます。来月はバックエンドの採用も強化したいと思っています。',
        createdAt: '2025-03-20T15:00:00', isRead: true,
      },
      {
        id: 'm6-2', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '来月からバックエンドエンジニアの採用も強化しますので引き続きよろしくお願いします。',
        createdAt: '2025-03-20T16:00:00', isRead: true,
      },
    ],
  },

  // ── 7. GENERAL: Agent ↔ Alisher ─────────────────────────────
  {
    id: 'conv-7',
    type: 'GENERAL_AGENT_CANDIDATE',
    agentId: 'ag1', agentName: '田中 健太',
    candidateId: 'u1', candidateName: 'アリシェル ナザロフ',
    participants: [P.tanaka, P.alisher],
    lastMessage: 'ビザの更新手続きについては、会社側でサポートできます。ご安心ください。',
    lastMessageAt: '2025-03-15T11:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm7-1', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: '田中さん、ビザの更新手続きについて相談があるのですが、就労ビザの更新は会社側でサポートしてもらえますか？',
        createdAt: '2025-03-15T10:00:00', isRead: true,
      },
      {
        id: 'm7-2', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'ビザの更新手続きについては、会社側でサポートできます。ご安心ください。',
        createdAt: '2025-03-15T11:00:00', isRead: true,
      },
    ],
  },

  // ── 8. ADMIN_SUPPORT: Admin ↔ Agent ─────────────────────────
  {
    id: 'conv-8',
    type: 'ADMIN_SUPPORT',
    agentId: 'ag1', agentName: '田中 健太',
    participants: [P.admin, P.tanaka],
    lastMessage: 'ご確認ありがとうございます。来月はさらに増やせるよう頑張ります。',
    lastMessageAt: '2025-03-30T11:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm8-1', senderId: 'adm1', senderRole: 'ADMIN', senderName: 'システム管理者',
        content: '田中さん、今月の応募数レポートをご確認ください。3社で合計56件の応募があります。',
        createdAt: '2025-03-30T10:00:00', isRead: true,
      },
      {
        id: 'm8-2', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'ご確認ありがとうございます。来月はさらに増やせるよう頑張ります。',
        createdAt: '2025-03-30T11:00:00', isRead: true,
      },
    ],
  },

  // ── 9. ADMIN_SUPPORT: Admin ↔ Alisher ───────────────────────
  {
    id: 'conv-9',
    type: 'ADMIN_SUPPORT',
    candidateId: 'u1', candidateName: 'アリシェル ナザロフ',
    participants: [P.admin, P.alisher],
    lastMessage: 'ご不便をおかけして申し訳ありません。問題を修正しました。',
    lastMessageAt: '2025-03-20T16:00:00',
    unreadCount: 0,
    messages: [
      {
        id: 'm9-1', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'プロフィール写真のアップロードがうまくいきません。エラーが表示されます。',
        createdAt: '2025-03-20T15:00:00', isRead: true,
      },
      {
        id: 'm9-2', senderId: 'adm1', senderRole: 'ADMIN', senderName: 'システム管理者',
        content: 'ご不便をおかけして申し訳ありません。問題を修正しました。再度お試しください。',
        createdAt: '2025-03-20T16:00:00', isRead: true,
      },
    ],
  },
];

// ── Role-based filtering ───────────────────────────────────────

export function getConversationsForRole(
  role: ParticipantRole,
  userId: string,
): Conversation[] {
  switch (role) {
    case 'CANDIDATE':
      return ALL_CONVERSATIONS.filter(c => {
        const isParticipant = c.participants.some(p => p.id === userId);
        if (!isParticipant) return false;
        if (c.type === 'APPLICATION_CANDIDATE_COMPANY') return c.agentEnabled === true;
        return (
          c.type === 'APPLICATION_AGENT_CANDIDATE' ||
          c.type === 'GENERAL_AGENT_CANDIDATE' ||
          c.type === 'ADMIN_SUPPORT'
        );
      });

    case 'AGENT':
      return ALL_CONVERSATIONS.filter(c => {
        // Agent sees all convs they participate in
        const isParticipant = c.participants.some(p => p.id === userId);
        // Agent also monitors CANDIDATE_COMPANY convs where they are the gating agent
        const isMonitoring =
          c.type === 'APPLICATION_CANDIDATE_COMPANY' &&
          c.agentId === userId;
        return isParticipant || isMonitoring;
      });

    case 'COMPANY':
      return ALL_CONVERSATIONS.filter(c => {
        const isParticipant = c.participants.some(p => p.id === userId);
        if (!isParticipant) return false;
        if (c.type === 'APPLICATION_CANDIDATE_COMPANY') return c.agentEnabled === true;
        return (
          c.type === 'APPLICATION_AGENT_COMPANY' ||
          c.type === 'GENERAL_AGENT_COMPANY'
        );
      });

    case 'ADMIN':
      return ALL_CONVERSATIONS;

    default:
      return [];
  }
}

// ── Grouping helper ────────────────────────────────────────────

export type ConvGroup =
  | { kind: 'application'; applicationCode: string; jobTitle: string; companyName: string; candidateName: string; conversations: Conversation[] }
  | { kind: 'general'; conversations: Conversation[] }
  | { kind: 'admin'; conversations: Conversation[] };

export function groupConversations(convs: Conversation[]): ConvGroup[] {
  const applicationMap = new Map<string, Conversation[]>();
  const general: Conversation[] = [];
  const admin: Conversation[] = [];

  for (const c of convs) {
    if (c.type === 'ADMIN_SUPPORT') {
      admin.push(c);
    } else if (c.applicationId) {
      const existing = applicationMap.get(c.applicationId) ?? [];
      existing.push(c);
      applicationMap.set(c.applicationId, existing);
    } else {
      general.push(c);
    }
  }

  const groups: ConvGroup[] = [];

  for (const [, appConvs] of applicationMap) {
    const first = appConvs[0];
    groups.push({
      kind: 'application',
      applicationCode: first.applicationCode ?? '',
      jobTitle: first.jobTitle ?? '',
      companyName: first.companyName ?? '',
      candidateName: first.candidateName ?? '',
      conversations: appConvs,
    });
  }

  if (general.length > 0) groups.push({ kind: 'general', conversations: general });
  if (admin.length > 0)   groups.push({ kind: 'admin',   conversations: admin });

  return groups;
}

// ── Display helpers ────────────────────────────────────────────

/** Returns the "other party" name as seen by userId */
export function getConvDisplayName(conv: Conversation, userId: string, role: ParticipantRole): string {
  switch (conv.type) {
    case 'APPLICATION_AGENT_CANDIDATE':
      return role === 'CANDIDATE' ? (conv.agentName ?? '') : (conv.candidateName ?? '');
    case 'APPLICATION_AGENT_COMPANY':
      if (role === 'COMPANY') return conv.agentName ?? '';
      // Agent sees: candidate name (this is about the candidate)
      return conv.candidateName ?? '';
    case 'APPLICATION_CANDIDATE_COMPANY':
      if (role === 'CANDIDATE') return conv.companyName ?? '';
      if (role === 'COMPANY')   return conv.candidateName ?? '';
      // Agent monitoring — show both
      return `${conv.candidateName} ↔ ${conv.companyName}`;
    case 'GENERAL_AGENT_CANDIDATE':
      return role === 'CANDIDATE' ? (conv.agentName ?? '') : (conv.candidateName ?? '');
    case 'GENERAL_AGENT_COMPANY':
      return role === 'COMPANY' ? (conv.agentName ?? '') : (conv.companyName ?? '');
    case 'ADMIN_SUPPORT': {
      const other = conv.participants.find(p => p.id !== userId);
      return other?.name ?? '';
    }
    default:
      return '';
  }
}

/** Short type label for badges */
export function getConvTypeLabel(type: ConversationType, isMonitoring = false): string {
  if (isMonitoring) return '監視中';
  switch (type) {
    case 'APPLICATION_AGENT_CANDIDATE':   return 'エージェント';
    case 'APPLICATION_AGENT_COMPANY':     return 'エージェント';
    case 'APPLICATION_CANDIDATE_COMPANY': return '直接連絡';
    case 'GENERAL_AGENT_CANDIDATE':       return '一般相談';
    case 'GENERAL_AGENT_COMPANY':         return '一般';
    case 'ADMIN_SUPPORT':                 return 'サポート';
  }
}

export function getConvTypeBadgeColor(type: ConversationType, isMonitoring = false): string {
  if (isMonitoring) return 'bg-amber-100 text-amber-700';
  switch (type) {
    case 'APPLICATION_AGENT_CANDIDATE':   return 'bg-indigo-100 text-indigo-700';
    case 'APPLICATION_AGENT_COMPANY':     return 'bg-blue-100 text-blue-700';
    case 'APPLICATION_CANDIDATE_COMPANY': return 'bg-green-100 text-green-700';
    case 'GENERAL_AGENT_CANDIDATE':       return 'bg-gray-100 text-gray-500';
    case 'GENERAL_AGENT_COMPANY':         return 'bg-gray-100 text-gray-500';
    case 'ADMIN_SUPPORT':                 return 'bg-gray-100 text-gray-600';
  }
}

export function formatChatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  if (diffDays === 1) return '昨日';
  if (diffDays < 7)  return `${diffDays}日前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
