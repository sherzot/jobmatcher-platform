'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Conversation,
  ChatMessage,
  ParticipantRole,
  groupConversations,
  getConvDisplayName,
  getConvTypeLabel,
  getConvTypeBadgeColor,
  formatChatTime,
} from '@/lib/mock/chat';
import { cn } from '@/lib/utils';

// ── Conversation list item ─────────────────────────────────────

function ConvItem({
  conv,
  active,
  userId,
  role,
  onClick,
}: {
  conv: Conversation;
  active: boolean;
  userId: string;
  role: ParticipantRole;
  onClick: () => void;
}) {
  const isMonitoring =
    role === 'AGENT' &&
    conv.type === 'APPLICATION_CANDIDATE_COMPANY' &&
    !conv.participants.some(p => p.id === userId);

  const displayName = getConvDisplayName(conv, userId, role);
  const typeLabel   = getConvTypeLabel(conv.type, isMonitoring);
  const typeColor   = getConvTypeBadgeColor(conv.type, isMonitoring);

  // Avatar — show the "other" participant
  const other = conv.participants.find(p => p.id !== userId) ?? conv.participants[0];
  const avatar = { initial: other.avatarInitial, color: other.avatarColor };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 transition-colors border-b border-gray-100 last:border-0',
        active ? 'bg-blue-50' : 'hover:bg-gray-50',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
          avatar.color,
        )}>
          {avatar.initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className={cn(
              'truncate text-sm font-semibold',
              active ? 'text-blue-700' : 'text-gray-900',
            )}>
              {displayName}
            </p>
            <span className="shrink-0 text-xs text-gray-400">
              {formatChatTime(conv.lastMessageAt)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className={cn('rounded-full px-1.5 py-0.5 text-xs font-medium', typeColor)}>
              {typeLabel}
            </span>
          </div>
          <p className={cn(
            'mt-0.5 truncate text-xs',
            conv.unreadCount > 0 ? 'font-medium text-gray-700' : 'text-gray-400',
          )}>
            {conv.lastMessage}
          </p>
        </div>

        {conv.unreadCount > 0 && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {conv.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}

// ── Grouped left panel ─────────────────────────────────────────

function ConvList({
  convs,
  activeId,
  userId,
  role,
  onSelect,
}: {
  convs: Conversation[];
  activeId: string;
  userId: string;
  role: ParticipantRole;
  onSelect: (id: string) => void;
}) {
  const groups = groupConversations(convs);

  return (
    <div className="flex-1 overflow-y-auto">
      {groups.map((group, gi) => {
        if (group.kind === 'application') {
          return (
            <div key={`app-${gi}`}>
              {/* Application header */}
              <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-700">
                    {group.applicationCode}
                  </span>
                  <span className="truncate text-xs font-medium text-gray-600">
                    {group.jobTitle}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-gray-400">
                  {group.candidateName} → {group.companyName}
                </p>
              </div>
              {group.conversations.map(c => (
                <ConvItem
                  key={c.id}
                  conv={c}
                  active={c.id === activeId}
                  userId={userId}
                  role={role}
                  onClick={() => onSelect(c.id)}
                />
              ))}
            </div>
          );
        }

        if (group.kind === 'general') {
          return (
            <div key={`gen-${gi}`}>
              <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 px-4 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">一般</p>
              </div>
              {group.conversations.map(c => (
                <ConvItem key={c.id} conv={c} active={c.id === activeId} userId={userId} role={role} onClick={() => onSelect(c.id)} />
              ))}
            </div>
          );
        }

        // admin
        return (
          <div key={`adm-${gi}`}>
            <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50 px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">サポート</p>
            </div>
            {group.conversations.map(c => (
              <ConvItem key={c.id} conv={c} active={c.id === activeId} userId={userId} role={role} onClick={() => onSelect(c.id)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────

function MessageBubble({
  msg,
  isOwn,
  showSender,
  senderColor,
}: {
  msg: ChatMessage;
  isOwn: boolean;
  showSender: boolean;
  senderColor: string;
}) {
  return (
    <div className={cn('flex items-end gap-2', isOwn && 'flex-row-reverse')}>
      <div className="w-8 shrink-0">
        {!isOwn && showSender && (
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white',
            senderColor,
          )}>
            {msg.senderName[0]}
          </div>
        )}
      </div>
      <div className={cn('max-w-sm', isOwn && 'flex flex-col items-end')}>
        {!isOwn && showSender && (
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

// ── Main ChatLayout ────────────────────────────────────────────

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUserId: string;
  currentUserRole: ParticipantRole;
}

export function ChatLayout({ conversations, currentUserId, currentUserRole }: ChatLayoutProps) {
  const [allConvs, setAllConvs] = useState<Conversation[]>(conversations);
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id ?? '');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConv = allConvs.find(c => c.id === activeId) ?? null;

  const isMonitoring =
    currentUserRole === 'AGENT' &&
    activeConv?.type === 'APPLICATION_CANDIDATE_COMPANY' &&
    !activeConv.participants.some(p => p.id === currentUserId);

  // Scroll to bottom on conversation change or new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConv?.messages.length]);

  // Mark as read when opening
  useEffect(() => {
    if (!activeId) return;
    setAllConvs(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) }
          : c,
      ),
    );
  }, [activeId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConv || isMonitoring) return;

    const currentParticipant = activeConv.participants.find(p => p.id === currentUserId);
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderRole: currentUserRole,
      senderName: currentParticipant?.name ?? 'あなた',
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

  return (
    <div className="flex h-full">
      {/* ── Left: conversation list ──────────────────────────── */}
      <div className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3.5">
          <h2 className="text-sm font-semibold text-gray-900">メッセージ</h2>
          <p className="text-xs text-gray-400">{allConvs.length}件の会話</p>
        </div>
        {allConvs.length === 0 ? (
          <div className="flex-1 py-16 text-center text-sm text-gray-400">会話がありません</div>
        ) : (
          <ConvList
            convs={allConvs}
            activeId={activeId}
            userId={currentUserId}
            role={currentUserRole}
            onSelect={setActiveId}
          />
        )}
      </div>

      {/* ── Right: message pane ──────────────────────────────── */}
      {activeConv ? (
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-5 py-4">
            {(() => {
              const other = activeConv.participants.find(p => p.id !== currentUserId) ?? activeConv.participants[0];
              return (
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                  other.avatarColor,
                )}>
                  {other.avatarInitial}
                </div>
              );
            })()}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900">
                  {getConvDisplayName(activeConv, currentUserId, currentUserRole)}
                </p>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  getConvTypeBadgeColor(activeConv.type, isMonitoring),
                )}>
                  {getConvTypeLabel(activeConv.type, isMonitoring)}
                </span>
              </div>
              {/* Application context breadcrumb */}
              {activeConv.applicationCode && (
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 font-bold text-blue-600">
                    {activeConv.applicationCode}
                  </span>
                  <span>·</span>
                  <span className="truncate">{activeConv.jobTitle}</span>
                  <span>·</span>
                  <span className="truncate">{activeConv.companyName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notice banners */}
          {activeConv.type === 'APPLICATION_CANDIDATE_COMPANY' && activeConv.agentEnabled && !isMonitoring && (
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-700">
              <span className="font-medium">エージェント承認済み</span>
              {' '}— 担当エージェント（{activeConv.agentName}）がこの会話を監視しています。
            </div>
          )}
          {isMonitoring && (
            <div className="border-b border-violet-100 bg-violet-50 px-5 py-2 text-xs text-violet-700">
              <span className="font-medium">監視モード</span>
              {' '}— {activeConv.candidateName} と {activeConv.companyName} の直接チャットを監視しています。
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 px-5 py-5">
            {activeConv.messages.map((msg, idx) => {
              const prev = idx > 0 ? activeConv.messages[idx - 1] : null;
              const showDate =
                !prev ||
                new Date(prev.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
              const showSender = !prev || prev.senderId !== msg.senderId;
              const isOwn = msg.senderId === currentUserId;
              const senderParticipant = activeConv.participants.find(p => p.id === msg.senderId);

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
                    showSender={showSender}
                    senderColor={senderParticipant?.avatarColor ?? 'bg-gray-400'}
                  />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white px-5 py-4">
            {isMonitoring ? (
              <div className="rounded-xl border border-violet-200 bg-violet-50 py-3 text-center text-sm text-violet-600">
                監視モードでは返信できません。必要な場合は候補者または企業に直接ご連絡ください。
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
