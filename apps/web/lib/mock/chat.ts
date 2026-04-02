// ─────────────────────────────────────────────────────────────
// Chat Mock Data
//
// Access rules:
//   CANDIDATE ↔ AGENT      — always allowed
//   COMPANY   ↔ AGENT      — always allowed
//   CANDIDATE ↔ COMPANY    — BLOCKED unless agent explicitly enables it
//   ADMIN     ↔ anyone     — always allowed
// ─────────────────────────────────────────────────────────────

export type ParticipantRole = 'CANDIDATE' | 'AGENT' | 'COMPANY' | 'ADMIN';
export type ConversationType =
  | 'CANDIDATE_AGENT'
  | 'COMPANY_AGENT'
  | 'CANDIDATE_COMPANY' // only when agent-enabled
  | 'ADMIN_SUPPORT';

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
  title: string;
  subtitle: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  // For CANDIDATE_COMPANY: agent must explicitly enable
  agentEnabled?: boolean;
  agentId?: string;
  // context
  relatedJobTitle?: string;
  relatedApplicationCode?: string;
}

// ── Participants ──────────────────────────────────────────────

export const PARTICIPANTS: Record<string, ChatParticipant> = {
  candidate_alisher: {
    id: 'u1', role: 'CANDIDATE',
    name: 'アリシェル ナザロフ', avatarInitial: 'A', avatarColor: 'bg-indigo-600',
  },
  candidate_sato: {
    id: 'u2', role: 'CANDIDATE',
    name: '佐藤 美咲', avatarInitial: 'S', avatarColor: 'bg-pink-500',
  },
  agent_tanaka: {
    id: 'ag1', role: 'AGENT',
    name: '田中 健太', avatarInitial: 'T', avatarColor: 'bg-violet-600',
  },
  company_techstart: {
    id: 'c1', role: 'COMPANY',
    name: 'テックスタート株式会社', avatarInitial: 'T', avatarColor: 'bg-blue-600',
  },
  admin: {
    id: 'adm1', role: 'ADMIN',
    name: 'システム管理者', avatarInitial: 'A', avatarColor: 'bg-gray-700',
  },
};

// ── Conversations ─────────────────────────────────────────────

export const ALL_CONVERSATIONS: Conversation[] = [
  // ── 1. Candidate Alisher ↔ Agent Tanaka ─────────────────
  {
    id: 'conv-1',
    type: 'CANDIDATE_AGENT',
    title: '田中 健太',
    subtitle: 'エージェント',
    participants: [PARTICIPANTS.candidate_alisher, PARTICIPANTS.agent_tanaka],
    relatedJobTitle: 'シニアフロントエンドエンジニア',
    relatedApplicationCode: 'APP0000001',
    lastMessage: '4月5日の一次面接、頑張ってください！何かあればご連絡ください。',
    lastMessageAt: '2025-04-01T09:30:00',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'アリシェルさん、こんにちは！テックスタートのシニアフロントエンドポジションに応募いただきありがとうございます。書類選考を通過しました。一次面接の日程を調整したいのですが、来週はいかがでしょうか？',
        createdAt: '2025-03-28T10:00:00', isRead: true },
      { id: 'm2', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'ありがとうございます！来週なら火曜日か木曜日の午後が都合良いです。',
        createdAt: '2025-03-28T11:30:00', isRead: true },
      { id: 'm3', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '承知しました。4月5日（火）14:00でオンライン面接を設定しました。ZoomのURLをメールでお送りします。',
        createdAt: '2025-03-28T14:00:00', isRead: true },
      { id: 'm4', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'ありがとうございます。面接の準備として、何か特に準備しておくことはありますか？',
        createdAt: '2025-03-29T09:00:00', isRead: true },
      { id: 'm5', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'Reactの実務経験と、チームでの開発について具体的な事例を準備しておくと良いと思います。あとは技術的な課題（コーディングテスト）が出る可能性があります。',
        createdAt: '2025-03-29T10:30:00', isRead: true },
      { id: 'm6', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '4月5日の一次面接、頑張ってください！何かあればご連絡ください。',
        createdAt: '2025-04-01T09:30:00', isRead: false },
    ],
  },

  // ── 2. Candidate Sato ↔ Agent Tanaka ───────────────────
  {
    id: 'conv-2',
    type: 'CANDIDATE_AGENT',
    title: '田中 健太',
    subtitle: 'エージェント',
    participants: [PARTICIPANTS.candidate_sato, PARTICIPANTS.agent_tanaka],
    relatedJobTitle: 'シニアフロントエンドエンジニア',
    relatedApplicationCode: 'APP0000011',
    lastMessage: '書類選考の結果は今週中にご連絡します。',
    lastMessageAt: '2025-03-26T15:00:00',
    unreadCount: 0,
    messages: [
      { id: 'm10', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '佐藤さん、ご応募ありがとうございます。現在書類選考中です。結果は1週間以内にご連絡します。',
        createdAt: '2025-03-25T12:00:00', isRead: true },
      { id: 'm11', senderId: 'u2', senderRole: 'CANDIDATE', senderName: '佐藤 美咲',
        content: 'ありがとうございます。よろしくお願いします。',
        createdAt: '2025-03-25T13:00:00', isRead: true },
      { id: 'm12', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '書類選考の結果は今週中にご連絡します。',
        createdAt: '2025-03-26T15:00:00', isRead: true },
    ],
  },

  // ── 3. Company TechStart ↔ Agent Tanaka ────────────────
  {
    id: 'conv-3',
    type: 'COMPANY_AGENT',
    title: '田中 健太',
    subtitle: 'JobMatch エージェント',
    participants: [PARTICIPANTS.company_techstart, PARTICIPANTS.agent_tanaka],
    lastMessage: 'プロダクトマネージャーの求人票の内容を一緒に確認しましょうか？',
    lastMessageAt: '2025-04-01T09:00:00',
    unreadCount: 1,
    messages: [
      { id: 'm20', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'シニアフロントエンドポジションに新しい候補者が応募しました。アリシェルさん（マッチスコア92%）です。面接を進めますか？',
        createdAt: '2025-03-22T10:00:00', isRead: true },
      { id: 'm21', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'ありがとうございます！ぜひ一次面接を設定してください。来週の火曜日か水曜日が都合が良いです。',
        createdAt: '2025-03-22T11:30:00', isRead: true },
      { id: 'm22', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '4月5日（火）14:00でZoom面接を設定しました。候補者にも連絡済みです。',
        createdAt: '2025-03-23T09:15:00', isRead: true },
      { id: 'm23', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'バックエンドエンジニアのポジションも急いでいます。Go経験者はいますか？',
        createdAt: '2025-03-28T14:00:00', isRead: true },
      { id: 'm24', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'Jasurbekさん（Go/Pythonエキスパート、経験4年）が応募しています。カジュアル面談から始めますか？',
        createdAt: '2025-03-28T14:30:00', isRead: true },
      { id: 'm25', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'プロダクトマネージャーの求人票の内容を一緒に確認しましょうか？',
        createdAt: '2025-04-01T09:00:00', isRead: false },
    ],
  },

  // ── 4. Admin ↔ Agent Tanaka ────────────────────────────
  {
    id: 'conv-4',
    type: 'ADMIN_SUPPORT',
    title: '田中 健太',
    subtitle: 'エージェント · A0000001',
    participants: [PARTICIPANTS.admin, PARTICIPANTS.agent_tanaka],
    lastMessage: 'ご確認ありがとうございます。',
    lastMessageAt: '2025-03-30T11:00:00',
    unreadCount: 0,
    messages: [
      { id: 'm30', senderId: 'adm1', senderRole: 'ADMIN', senderName: 'システム管理者',
        content: '田中さん、今月の応募数レポートをご確認ください。3社で合計56件の応募があります。',
        createdAt: '2025-03-30T10:00:00', isRead: true },
      { id: 'm31', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: 'ご確認ありがとうございます。来月はさらに増やせるよう頑張ります。',
        createdAt: '2025-03-30T11:00:00', isRead: true },
    ],
  },

  // ── 5. Admin ↔ Candidate Alisher ──────────────────────
  {
    id: 'conv-5',
    type: 'ADMIN_SUPPORT',
    title: 'アリシェル ナザロフ',
    subtitle: '候補者 · U0000001',
    participants: [PARTICIPANTS.admin, PARTICIPANTS.candidate_alisher],
    lastMessage: 'ご不便をおかけして申し訳ありません。問題を修正しました。',
    lastMessageAt: '2025-03-20T16:00:00',
    unreadCount: 0,
    messages: [
      { id: 'm40', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'プロフィール写真のアップロードがうまくいきません。エラーが表示されます。',
        createdAt: '2025-03-20T15:00:00', isRead: true },
      { id: 'm41', senderId: 'adm1', senderRole: 'ADMIN', senderName: 'システム管理者',
        content: 'ご不便をおかけして申し訳ありません。問題を修正しました。再度お試しください。',
        createdAt: '2025-03-20T16:00:00', isRead: true },
    ],
  },

  // ── 6. Candidate↔Company (agent-enabled) ───────────────
  {
    id: 'conv-6',
    type: 'CANDIDATE_COMPANY',
    title: 'テックスタート株式会社',
    subtitle: '企業 · エージェント承認済み',
    participants: [
      PARTICIPANTS.candidate_alisher,
      PARTICIPANTS.company_techstart,
      PARTICIPANTS.agent_tanaka, // agent monitors
    ],
    agentEnabled: true,
    agentId: 'ag1',
    relatedJobTitle: 'シニアフロントエンドエンジニア',
    lastMessage: 'それでは面接当日にお会いしましょう。よろしくお願いします。',
    lastMessageAt: '2025-04-02T10:00:00',
    unreadCount: 1,
    messages: [
      { id: 'm50', senderId: 'ag1', senderRole: 'AGENT', senderName: '田中 健太',
        content: '【システム通知】エージェント（田中 健太）がこのチャットを承認しました。アリシェルさんとテックスタートの直接連絡が可能になりました。',
        createdAt: '2025-04-01T14:00:00', isRead: true },
      { id: 'm51', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'アリシェルさん、はじめまして。テックスタートのエンジニアリングマネージャーの鈴木です。面接について事前にお話しできればと思いご連絡しました。',
        createdAt: '2025-04-01T14:30:00', isRead: true },
      { id: 'm52', senderId: 'u1', senderRole: 'CANDIDATE', senderName: 'アリシェル ナザロフ',
        content: 'よろしくお願いします！何かご質問があればお気軽にどうぞ。',
        createdAt: '2025-04-01T15:00:00', isRead: true },
      { id: 'm53', senderId: 'c1', senderRole: 'COMPANY', senderName: 'テックスタート株式会社',
        content: 'それでは面接当日にお会いしましょう。よろしくお願いします。',
        createdAt: '2025-04-02T10:00:00', isRead: false },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────

export function getConversationsForRole(
  role: ParticipantRole,
  userId: string,
): Conversation[] {
  switch (role) {
    case 'CANDIDATE':
      // Candidate sees: CANDIDATE_AGENT + agent-enabled CANDIDATE_COMPANY
      return ALL_CONVERSATIONS.filter(
        c =>
          c.participants.some(p => p.id === userId) &&
          (c.type === 'CANDIDATE_AGENT' ||
            (c.type === 'CANDIDATE_COMPANY' && c.agentEnabled === true)),
      );

    case 'AGENT':
      // Agent sees: CANDIDATE_AGENT + COMPANY_AGENT + CANDIDATE_COMPANY (monitored)
      return ALL_CONVERSATIONS.filter(
        c =>
          c.participants.some(p => p.id === userId) ||
          (c.type === 'CANDIDATE_COMPANY' && c.agentId === userId),
      );

    case 'COMPANY':
      // Company sees: COMPANY_AGENT only (NO direct candidate chat unless agent-enabled)
      return ALL_CONVERSATIONS.filter(
        c =>
          c.participants.some(p => p.id === userId) &&
          (c.type === 'COMPANY_AGENT' ||
            (c.type === 'CANDIDATE_COMPANY' && c.agentEnabled === true)),
      );

    case 'ADMIN':
      // Admin sees everything
      return ALL_CONVERSATIONS;

    default:
      return [];
  }
}

export function formatChatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export const ROLE_BADGE: Record<ParticipantRole, { label: string; color: string }> = {
  CANDIDATE: { label: '候補者', color: 'bg-indigo-100 text-indigo-700' },
  AGENT:     { label: 'エージェント', color: 'bg-violet-100 text-violet-700' },
  COMPANY:   { label: '企業', color: 'bg-blue-100 text-blue-700' },
  ADMIN:     { label: '管理者', color: 'bg-gray-100 text-gray-700' },
};
