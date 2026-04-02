'use client';

import { useState, useRef, useEffect } from 'react';
import { MOCK_ASSIGNED_AGENT, MOCK_COMPANY, MOCK_MESSAGES, ChatMessage } from '@/lib/mock/company';
import { cn } from '@/lib/utils';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CompanyMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(
    MOCK_MESSAGES.map(m => ({ ...m, isRead: true })),
  );
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'company',
      content: input.trim(),
      createdAt: new Date().toISOString(),
      isRead: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-4">
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
          MOCK_ASSIGNED_AGENT.avatarColor,
        )}>
          {MOCK_ASSIGNED_AGENT.avatarInitial}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{MOCK_ASSIGNED_AGENT.displayName}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <p className="text-xs text-gray-400">担当エージェント · オンライン</p>
          </div>
        </div>
        <div className="ml-auto text-sm text-gray-400">
          {MOCK_ASSIGNED_AGENT.email}
        </div>
      </div>

      {/* Important notice */}
      <div className="border-b border-blue-100 bg-blue-50 px-6 py-2.5 text-xs text-blue-700">
        <span className="font-medium">ご注意：</span>
        候補者との直接連絡はできません。すべての候補者対応はエージェント（{MOCK_ASSIGNED_AGENT.displayName}）を通じて行われます。
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-6 py-5">
        {messages.map((msg, idx) => {
          const isCompany = msg.senderId === 'company';
          const showDate =
            idx === 0 ||
            new Date(messages[idx - 1].createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();

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
              <div className={cn('flex items-end gap-2', isCompany && 'flex-row-reverse')}>
                {/* Avatar */}
                {!isCompany && (
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    MOCK_ASSIGNED_AGENT.avatarColor,
                  )}>
                    {MOCK_ASSIGNED_AGENT.avatarInitial}
                  </div>
                )}
                {isCompany && (
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    MOCK_COMPANY.logoColor,
                  )}>
                    {MOCK_COMPANY.logoInitial}
                  </div>
                )}

                {/* Bubble */}
                <div className={cn('max-w-sm', isCompany && 'items-end flex flex-col')}>
                  <div className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    isCompany
                      ? 'rounded-br-sm bg-blue-600 text-white'
                      : 'rounded-bl-sm bg-white border border-gray-200 text-gray-800',
                  )}>
                    {msg.content}
                  </div>
                  <p className="mt-1 px-1 text-xs text-gray-400">{formatTime(msg.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <form onSubmit={sendMessage} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder={`${MOCK_ASSIGNED_AGENT.displayName} にメッセージを送る...`}
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
      </div>
    </div>
  );
}
