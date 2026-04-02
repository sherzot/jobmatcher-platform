'use client';

import { useState } from 'react';
import {
  MOCK_ADMIN_AGENTS,
  AdminAgent,
  AgentStatus,
  AGENT_STATUS_LABELS,
  AGENT_STATUS_COLORS,
} from '@/lib/mock/admin';
import { cn } from '@/lib/utils';

// ── Agent form modal ──────────────────────────────────────────

interface AgentFormData {
  displayName: string;
  email: string;
  phone: string;
}

const EMPTY_FORM: AgentFormData = { displayName: '', email: '', phone: '' };

function AgentFormModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: 'create' | 'edit';
  initial: AgentFormData;
  onClose: () => void;
  onSave: (d: AgentFormData) => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof AgentFormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {mode === 'create' ? 'エージェントを追加' : 'エージェントを編集'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">氏名 *</label>
            <input
              required value={form.displayName}
              onChange={e => set('displayName', e.target.value)}
              placeholder="田中 健太"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">メールアドレス *</label>
            <input
              required type="email" value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="tanaka@jobmatch.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">電話番号</label>
            <input
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="03-0000-0000"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              キャンセル
            </button>
            <button type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
              {mode === 'create' ? '追加する' : '変更を保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-violet-600', 'bg-pink-500', 'bg-teal-600',
  'bg-orange-500', 'bg-emerald-600', 'bg-rose-500', 'bg-blue-600',
];

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AdminAgent[]>(MOCK_ADMIN_AGENTS);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; agentId?: string } | null>(null);

  const getInitial = (): AgentFormData => {
    if (!modal || modal.mode === 'create') return EMPTY_FORM;
    const a = agents.find(x => x.id === modal.agentId);
    return a ? { displayName: a.displayName, email: a.email, phone: a.phone } : EMPTY_FORM;
  };

  const handleSave = (data: AgentFormData) => {
    if (!modal) return;
    if (modal.mode === 'create') {
      const newAgent: AdminAgent = {
        id: `ag${Date.now()}`,
        code: `A${String(agents.length + 1).padStart(7, '0')}`,
        displayName: data.displayName,
        email: data.email,
        phone: data.phone,
        avatarInitial: data.displayName[0].toUpperCase(),
        avatarColor: AVATAR_COLORS[agents.length % AVATAR_COLORS.length],
        status: 'ACTIVE',
        assignedCompanies: 0,
        activeJobs: 0,
        totalCandidates: 0,
        applicationsThisMonth: 0,
        offersMadeTotal: 0,
        joinedAt: new Date().toISOString().split('T')[0],
      };
      setAgents(prev => [...prev, newAgent]);
    } else {
      setAgents(prev =>
        prev.map(a =>
          a.id === modal.agentId
            ? { ...a, displayName: data.displayName, email: data.email, phone: data.phone }
            : a,
        ),
      );
    }
    setModal(null);
  };

  const toggleStatus = (id: string, current: AgentStatus) => {
    const next: AgentStatus = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: next } : a));
  };

  const activeCount   = agents.filter(a => a.status === 'ACTIVE').length;
  const inactiveCount = agents.filter(a => a.status !== 'ACTIVE').length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">エージェント管理</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {agents.length}名 — アクティブ {activeCount} · 非アクティブ {inactiveCount}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          エージェントを追加
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">エージェント</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">ステータス</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 sm:table-cell">担当企業</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 md:table-cell">求人</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 lg:table-cell">候補者</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 lg:table-cell">今月応募</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 xl:table-cell">内定数</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 xl:table-cell">参加日</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {agents.map(agent => (
              <tr key={agent.id} className={cn('transition-colors hover:bg-gray-50', agent.status !== 'ACTIVE' && 'opacity-60')}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                      agent.avatarColor,
                    )}>
                      {agent.avatarInitial}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{agent.displayName}</p>
                      <p className="text-xs text-gray-400">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', AGENT_STATUS_COLORS[agent.status])}>
                    {AGENT_STATUS_LABELS[agent.status]}
                  </span>
                </td>
                <td className="hidden px-4 py-4 text-center sm:table-cell">
                  <span className="font-semibold text-blue-600">{agent.assignedCompanies}</span>
                </td>
                <td className="hidden px-4 py-4 text-center md:table-cell">
                  <span className="font-semibold text-gray-700">{agent.activeJobs}</span>
                </td>
                <td className="hidden px-4 py-4 text-center lg:table-cell">
                  <span className="font-semibold text-gray-700">{agent.totalCandidates}</span>
                </td>
                <td className="hidden px-4 py-4 text-center lg:table-cell">
                  <span className="font-semibold text-violet-600">{agent.applicationsThisMonth}</span>
                </td>
                <td className="hidden px-4 py-4 text-center xl:table-cell">
                  <span className="font-semibold text-green-600">{agent.offersMadeTotal}</span>
                </td>
                <td className="hidden px-4 py-4 text-xs text-gray-400 xl:table-cell">{agent.joinedAt}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setModal({ mode: 'edit', agentId: agent.id })}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      編集
                    </button>
                    {agent.status !== 'SUSPENDED' && (
                      <button
                        onClick={() => toggleStatus(agent.id, agent.status)}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                          agent.status === 'ACTIVE'
                            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
                        )}
                      >
                        {agent.status === 'ACTIVE' ? '停止' : '有効化'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <AgentFormModal
          mode={modal.mode}
          initial={getInitial()}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
