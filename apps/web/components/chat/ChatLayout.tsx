'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Conversation,
  ChatMessage,
  ParticipantRole,
  ConversationType,
  formatChatTime,
  ROLE_BADGE,
} from '@/lib/mock/chat';
import { cn } from '@/lib/utils';

// ── Type badge config ────────────────────────────────────────────
const TYPE_LABELS: Record<ConversationType, string> = {
  CANDIDATE_AGENT: '候補者',
  COMPANY_AGENT: '企業',
  CANDIDATE_COMPANY: '候補者↔企業',
  ADMIN_SUPPORT: 'サポート',
};

const TYPE_COLORS: Record<ConversationType, string> = {
  CANDIDATE_AGENT: 'bg-indigo-100 text-indigo-700',
  COMPANY_AGENT: 'bg-blue-100 text-blue-700',
  CANDIDATE_COMPANY: 'bg-amber-100 text-amber-700',
  ADMIN_SUPPORT: 'bg-gray-100 text-gray-600',
};

// ── Helpers ──────────────────────────────────────────────────────

function getConvDisplayName(conv: Conversation, currentUserId: string): string {
  const other = conv.participants.find(p => p.id !== currentUserId);
  return other ? other.name : conv.title;
}

function getConvAvatar(conv: Conversation, currentUserId: string) {
  const other = conv.participants.find(p => p.id !== currentUserId);
  return other
    ? { initial: other.avatarInitial, color: other.avatarColor, role: other.role }
    : { initial: conv.title[0], color: 'bg-gray-400', role: 'ADMIN' as ParticipantRole };
}

// ── Subcomponents ────────────────────────────────────────────────

function ConvItem({
  conv,
  active,
  currentUserId,
  currentUserRole,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  currentUserId: string;
  currentUserRole: ParticipantRole;
  onClick: () => void;
}) {
  const avatar = getConvAvatar(conv, currentUserId);
  const isMonitoring =
    currentUserRole === 'AGENT' &&
    conv.type === 'CANDIDATE_COMPANY' &&
    !conv.participants.some(p => p.id === currentUserId);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3.5 transition-colors border-b border-gray-100',
        active ? 'bg-blue-50' : 'hover:bg-gray-50',
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
          avatar.color,
        )}>
          {avatar.initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              'truncate text-sm font-semibold',
              active ? 'text-blue-700' : 'text-gray-900',
            )}>
              {getConvDisplayName(conv, currentUserId)}
            </p>
            <span className="shrink-0 text-xs text-gray-400">{formatChatTime(conv.lastMessageAt)}</span>
          </div>

          {/* Badges row */}
          <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
            {currentUserRole === 'ADMIN' && (
              <span className={cn('rounded-full px-1.5 py-0.5 text-xs font-medium', TYPE_COLORS[conv.type])}>
                {TYPE_LABELS[conv.type]}
              </span>
            )}
            {isMonitoring && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                監視中
              </span>
            )}
            {conv.relatedJobTitle && (
              <span className="truncate text-xs text-gray-400">{conv.relatedJobTitle}</span>
            )}
          </div>

          <p className={cn(
            'mt-0.5 truncate text-xs',
            conv.unreadCount > 0 ? 'font-semibold text-gray-700' : 'text-gray-400',
          )}>
            {conv.lastMessage}
          </p>
        </div>

        {/* Unread badge */}
        {conv.unreadCount > 0 && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {conv.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}

function MessageBubble({
  msg,
  isOwn,
  showAvatar,
  avatar,
}: {
  msg: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  avatar: { initial: string; color: string };
}) {
  return (
    <div className={cn('flex items-end gap-2', isOwn && 'flex-row-reverse')}>
      {/* Avatar placeholder for spacing */}
      <div className="w-8 shrink-0">
        {!isOwn && showAvatar && (
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
            avatar.color,
          )}>
            {avatar.initial}
          </div>
        )}
      </div>

      <div className={cn('max-w-sm', isOwn && 'items-end flex flex-col')}>
        {/* Sender name (only for non-own messages in group-style) */}
        {!isOwn && showAvatar && (
          <p className="mb-1 px-1 text-xs text-gray-400">{msg.senderName}</p>
        )}
        <div className={cn(
          'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isOwn
            ? 'rounded-br-sm bg-blue-600 text-white'
            : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800',
        )}>
          {msg.content}
        </div>
        <p className="mt-1 px-1 text-xs text-gray-400">
          {new Date(msg.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ── Main ChatLayout ──────────────────────────────────────────────

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUserId: string;
  currentUserRole: ParticipantRole;
}

export function ChatLayout({ conversations, currentUserId, currentUserRole }: ChatLayoutProps) {
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? '');
  const [allConvs, setAllConvs] = useState<Conversation[]>(conversations);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = allConvs.find(c => c.id === activeId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConv?.messages.length]);

  // Mark as read when opening
  useEffect(() => {
    if (!activeId) return;
    setAllConvs(prev =>
      prev.map(c =>
        c.id === activeId ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) } : c,
      ),
    );
  }, [activeId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderRole: currentUserRole,
      senderName: activeConv.participants.find(p => p.id === currentUserId)?.name ?? 'あなた',
      content: input.trim(),
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    setAllConvs(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastMessageAt: newMsg.createdAt }
          : c,
      ),
    );
    setInput('');
  };

  const isMonitoringConv =
    currentUserRole === 'AGENT' &&
    activeConv?.type === 'CANDIDATE_COMPANY' &&
    !activeConv.participants.some(p => p.id === currentUserId);

  return (
    <div className="flex h-full">
      {/* ── Left: Conversation list ── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3.5">
          <h2 className="text-sm font-semibold text-gray-900">メッセージ</h2>
          <p className="text-xs text-gray-400">{allConvs.length}件の会話</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {allConvs.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">会話がありません</div>
          ) : (
            allConvs.map(conv => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === activeId}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onClick={() => setActiveId(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right: Message pane ── */}
      {activeConv ? (
        <div className="flex flex-1 flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-5 py-4">
            {(() => {
              const avatar = getConvAvatar(activeConv, currentUserId);
              return (
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                  avatar.color,
                )}>
                  {avatar.initial}
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">
                  {getConvDisplayName(activeConv, currentUserId)}
                </p>
                {isMonitoringConv && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    監視モード
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">{activeConv.subtitle}</p>
            </div>
            {activeConv.relatedJobTitle && (
              <div className="ml-auto rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                {activeConv.relatedJobTitle}
              </div>
            )}
          </div>

          {/* Notices */}
          {activeConv.type === 'CANDIDATE_COMPANY' && activeConv.agentEnabled && (
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-2.5 text-xs text-amber-700">
              <span className="font-medium">エージェント承認済み</span>
              {' '}— 担当エージェントがこの会話を監視しています。
            </div>
          )}
          {isMonitoringConv && (
            <div className="border-b border-violet-100 bg-violet-50 px-5 py-2.5 text-xs text-violet-700">
              <span className="font-medium">監視モード</span>
              {' '}— あなたはこの会話を監視しています。候補者と企業間のやり取りを確認できます。
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 px-5 py-5">
            {activeConv.messages.map((msg, idx) => {
              const prevMsg = idx > 0 ? activeConv.messages[idx - 1] : null;
              const showDate =
                !prevMsg ||
                new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
              const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
              const isOwn = msg.senderId === currentUserId;
              const senderParticipant = activeConv.participants.find(p => p.id === msg.senderId);
              const avatar = {
                initial: senderParticipant?.avatarInitial ?? msg.senderName[0],
                color: senderParticipant?.avatarColor ?? 'bg-gray-400',
              };

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="flex-1 border-t border-gray-100" />
                      <span className="text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                      </span>
                      <div className="flex-1 border-t border-gray-100" />
                    </div>
                  )}
                  <MessageBubble
                    msg={msg}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    avatar={avatar}
                  />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            {isMonitoringConv ? (
              <div className="rounded-xl border border-violet-200 bg-violet-50 py-3 text-center text-sm text-violet-600">
                監視モードでは返信できません。このチャットを管理するには候補者または企業に直接連絡してください。
              </div>
            ) : (
              <form onSubmit={sendMessage} className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e as unknown as React.FormEvent);
                      }
                    }}
                    placeholder="メッセージを入力..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-400">Enter で送信 · Shift+Enter で改行</p>
                </div>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          会話を選択してください
        </div>
      )}
    </div>
  );
}
