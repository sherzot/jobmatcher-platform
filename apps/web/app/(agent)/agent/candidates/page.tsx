'use client';

import { useState } from 'react';
import {
  MOCK_AGENT_CANDIDATES,
  MOCK_AGENT_JOBS,
  STATUS_LABELS,
  STATUS_COLORS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/agent';
import { formatSalary, cn } from '@/lib/utils';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'すべて' },
  { value: 'PENDING', label: '応募済み' },
  { value: 'CASUAL_INTERVIEW', label: 'カジュアル面談' },
  { value: 'SCREENING', label: '書類選考' },
  { value: 'FIRST_INTERVIEW', label: '一次面接' },
  { value: 'SECOND_INTERVIEW', label: '二次面接' },
  { value: 'FINAL_INTERVIEW', label: '最終面接' },
  { value: 'OFFER', label: '内定' },
];

export default function AgentCandidatesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClosedToo, setShowClosedToo] = useState(false);

  const filtered = MOCK_AGENT_CANDIDATES.filter(c => {
    if (!showClosedToo && ['REJECTED', 'WITHDRAWN'].includes(c.status)) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (jobFilter && c.appliedJobId !== jobFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.appliedJobTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">候補者管理</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          選考中 {MOCK_AGENT_CANDIDATES.filter(c => !['REJECTED', 'WITHDRAWN', 'ACCEPTED'].includes(c.status)).length}名 / 全{MOCK_AGENT_CANDIDATES.length}名
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="名前・スキルで検索..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-violet-400 focus:outline-none"
          />
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 focus:border-violet-400 focus:outline-none"
        >
          {STATUS_FILTER_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={jobFilter}
          onChange={e => setJobFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 focus:border-violet-400 focus:outline-none"
        >
          <option value="">すべての求人</option>
          {MOCK_AGENT_JOBS.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={showClosedToo}
            onChange={e => setShowClosedToo(e.target.checked)}
            className="h-3.5 w-3.5 rounded"
          />
          終了分も表示
        </label>
      </div>

      {/* Results count */}
      <p className="mb-4 text-xs text-gray-400">
        <span className="font-medium text-gray-700">{filtered.length}名</span> 表示中
      </p>

      {/* Candidate cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center text-gray-400">
          条件に合う候補者がいません
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((candidate) => (
            <div
              key={candidate.id}
              className={cn(
                'rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm',
                ['REJECTED', 'WITHDRAWN'].includes(candidate.status) && 'opacity-50',
              )}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
                  candidate.avatarColor,
                )}>
                  {candidate.avatarInitial}
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <span className="text-xs text-gray-400">{candidate.code}</span>
                        {/* Match score */}
                        <span className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-bold',
                          candidate.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                          candidate.matchScore >= 75 ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600',
                        )}>
                          {candidate.matchScore}% マッチ
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {candidate.prefecture} · 経験 {candidate.yearsOfExperience}年 · 日本語 {JAPANESE_LEVEL_LABELS[candidate.japaneseLevel]}
                        · 希望 {formatSalary(candidate.desiredSalaryMin, candidate.desiredSalaryMax)}
                      </p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[candidate.status])}>
                      {STATUS_LABELS[candidate.status]}
                    </span>
                  </div>

                  {/* Applied job */}
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium text-gray-700">{candidate.appliedJobTitle}</span>
                    <span>·</span>
                    <span>{candidate.companyName}</span>
                    <span>· 応募: {candidate.appliedAt}</span>
                  </div>

                  {/* Skills */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Agent note */}
                  {candidate.agentNote && (
                    <div className="mt-2 flex items-start gap-2">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                        A
                      </div>
                      <p className="text-xs text-gray-500">{candidate.agentNote}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {!['REJECTED', 'WITHDRAWN'].includes(candidate.status) && (
                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                  <button className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                    ステータス変更
                  </button>
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    メッセージ
                  </button>
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    履歴書を見る
                  </button>
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    メモを追加
                  </button>
                  <button className="ml-auto rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-400 hover:bg-red-50">
                    不採用
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
