'use client';

import { useState } from 'react';
import {
  MOCK_ADMIN_USERS,
  AdminUser,
  UserStatus,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/admin';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'ALL'>('ALL');

  const filtered = users.filter(u => {
    const matchSearch =
      !search ||
      `${u.lastName} ${u.firstName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: string, current: UserStatus) => {
    const next: UserStatus = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ユーザー管理</h1>
          <p className="mt-0.5 text-sm text-gray-400">{users.length}名登録中</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="氏名・メール・コードで検索"
            className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-gray-400 focus:outline-none"
          />
        </div>
        {(['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              filterStatus === s
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
          >
            {s === 'ALL' ? 'すべて' : USER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">ユーザー</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 md:table-cell">国籍 / ビザ</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 lg:table-cell">日本語</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 lg:table-cell">完成度</th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold text-gray-500 xl:table-cell">応募数</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">ステータス</th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold text-gray-500 xl:table-cell">登録日</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-gray-400">
                  該当するユーザーが見つかりません
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id} className={cn('transition-colors hover:bg-gray-50', user.status === 'SUSPENDED' && 'opacity-60')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                        user.avatarColor,
                      )}>
                        {user.avatarInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.lastName} {user.firstName}</p>
                        <p className="text-xs text-gray-400">{user.code} · {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <p className="text-xs font-medium text-gray-700">{user.nationality}</p>
                    <p className="text-xs text-gray-400 truncate max-w-32">{user.visaType}</p>
                  </td>
                  <td className="hidden px-4 py-4 text-center lg:table-cell">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {JAPANESE_LEVEL_LABELS[user.japaneseLevel]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            user.profileCompleteness >= 80 ? 'bg-green-500' :
                            user.profileCompleteness >= 50 ? 'bg-amber-500' : 'bg-red-400',
                          )}
                          style={{ width: `${user.profileCompleteness}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-gray-500">{user.profileCompleteness}%</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-center xl:table-cell">
                    <span className="font-semibold text-gray-700">{user.applicationCount}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', USER_STATUS_COLORS[user.status])}>
                      {USER_STATUS_LABELS[user.status]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-xs text-gray-400 xl:table-cell">{user.registeredAt}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(user.id, user.status)}
                        className={cn(
                          'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                          user.status === 'ACTIVE'
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                            : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
                        )}
                      >
                        {user.status === 'ACTIVE' ? '停止' : '有効化'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
          {filtered.length}名表示中（全{users.length}名）
        </div>
      </div>
    </div>
  );
}
