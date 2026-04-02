'use client';

import { useState } from 'react';
import {
  MOCK_ADMIN_COMPANIES,
  AdminCompany,
  CompanyVerificationStatus,
  VERIFICATION_LABELS,
  VERIFICATION_COLORS,
} from '@/lib/mock/admin';
import { cn } from '@/lib/utils';

type FilterTab = 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>(MOCK_ADMIN_COMPANIES);
  const [tab, setTab] = useState<FilterTab>('ALL');
  const [search, setSearch] = useState('');

  const filtered = companies.filter(c => {
    const matchTab = tab === 'ALL' || c.verificationStatus === tab;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedAgentName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const setVerification = (id: string, status: CompanyVerificationStatus) => {
    setCompanies(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, verificationStatus: status, isActive: status === 'VERIFIED' }
          : c,
      ),
    );
  };

  const counts = {
    ALL: companies.length,
    PENDING:  companies.filter(c => c.verificationStatus === 'PENDING').length,
    VERIFIED: companies.filter(c => c.verificationStatus === 'VERIFIED').length,
    REJECTED: companies.filter(c => c.verificationStatus === 'REJECTED').length,
  };

  const TAB_LABELS: Record<FilterTab, string> = {
    ALL: `すべて (${counts.ALL})`,
    PENDING:  `審査中 (${counts.PENDING})`,
    VERIFIED: `認証済み (${counts.VERIFIED})`,
    REJECTED: `却下 (${counts.REJECTED})`,
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">企業管理</h1>
          <p className="mt-0.5 text-sm text-gray-400">{companies.length}社登録中</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          {(Object.keys(TAB_LABELS) as FilterTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="企業名・コード・担当者"
            className="rounded-lg border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">企業</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">業界 / 規模</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 lg:table-cell">担当エージェント</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 xl:table-cell">求人</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 xl:table-cell">応募</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">認証</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 xl:table-cell">登録日</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                  該当する企業が見つかりません
                </td>
              </tr>
            ) : (
              filtered.map(company => (
                <tr key={company.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                        company.logoColor,
                      )}>
                        {company.logoInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-400">{company.code} · {company.prefecture}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <p className="text-xs font-medium text-gray-700">{company.industry}</p>
                    <p className="text-xs text-gray-400">{company.employeeCount}</p>
                  </td>
                  <td className="hidden px-4 py-4 lg:table-cell">
                    <p className="text-xs font-medium text-gray-700">{company.assignedAgentName}</p>
                    <p className="text-xs text-gray-400">{company.assignedAgentId}</p>
                  </td>
                  <td className="hidden px-4 py-4 text-center xl:table-cell">
                    <span className="font-semibold text-blue-600">{company.activeJobCount}</span>
                  </td>
                  <td className="hidden px-4 py-4 text-center xl:table-cell">
                    <span className="font-semibold text-gray-700">{company.totalApplications}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', VERIFICATION_COLORS[company.verificationStatus])}>
                      {VERIFICATION_LABELS[company.verificationStatus]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-xs text-gray-400 xl:table-cell">
                    {company.registeredAt}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {company.verificationStatus === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setVerification(company.id, 'VERIFIED')}
                            className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                          >
                            承認
                          </button>
                          <button
                            onClick={() => setVerification(company.id, 'REJECTED')}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            却下
                          </button>
                        </>
                      )}
                      {company.verificationStatus === 'VERIFIED' && (
                        <button
                          onClick={() => setVerification(company.id, 'PENDING')}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                        >
                          取り消し
                        </button>
                      )}
                      {company.verificationStatus === 'REJECTED' && (
                        <button
                          onClick={() => setVerification(company.id, 'PENDING')}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          再審査
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          {filtered.length}社表示中（全{companies.length}社）
        </div>
      </div>
    </div>
  );
}
