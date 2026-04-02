'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_PENDING_COMPANIES, PendingCompany } from '@/lib/mock/pending-companies';

type FilterStatus = 'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export default function AgentApprovalsPage() {
  const [companies, setCompanies] = useState<PendingCompany[]>(MOCK_PENDING_COMPANIES);
  const [filter, setFilter] = useState<FilterStatus>('PENDING_APPROVAL');
  const [selected, setSelected] = useState<PendingCompany | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [modal, setModal] = useState<'approve' | 'reject' | null>(null);

  const filtered = companies.filter((c) =>
    filter === 'ALL' ? true : c.status === filter
  );

  const pendingCount = companies.filter((c) => c.status === 'PENDING_APPROVAL').length;

  const handleApprove = () => {
    if (!selected) return;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selected.id ? { ...c, status: 'APPROVED' as const } : c
      )
    );
    setModal(null);
    setSelected(null);
    // TODO: call PATCH /api/agent/companies/:id/approve
  };

  const handleReject = () => {
    if (!selected || !rejectReason.trim()) return;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, status: 'REJECTED' as const, rejectionReason: rejectReason }
          : c
      )
    );
    setModal(null);
    setSelected(null);
    setRejectReason('');
    // TODO: call PATCH /api/agent/companies/:id/reject
  };

  const openModal = (company: PendingCompany, type: 'approve' | 'reject') => {
    setSelected(company);
    setModal(type);
    setRejectReason('');
  };

  const FILTERS: { label: string; value: FilterStatus; color: string }[] = [
    { label: `審査待ち (${pendingCount})`, value: 'PENDING_APPROVAL', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: '承認済み', value: 'APPROVED', color: 'text-green-700 bg-green-50 border-green-200' },
    { label: '否認済み', value: 'REJECTED', color: 'text-red-700 bg-red-50 border-red-200' },
    { label: 'すべて', value: 'ALL', color: 'text-gray-700 bg-gray-50 border-gray-200' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">企業審査</h1>
          {pendingCount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {pendingCount}件待ち
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          新規登録した企業の情報を確認し、承認または否認してください
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value ? f.color : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Company list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <p className="text-sm text-gray-400">該当する企業がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                    {company.name.charAt(0)}
                  </div>
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{company.name}</h3>
                      {company.nameEn && (
                        <span className="text-xs text-gray-400">{company.nameEn}</span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                        </svg>
                        {company.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {company.prefecture}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {company.email}
                      </span>
                      <span className="font-mono text-gray-400">{company.companyCode}</span>
                    </div>

                    {company.businessRegNumber && (
                      <p className="mt-1.5 text-xs text-gray-500">
                        法人番号：<span className="font-mono">{company.businessRegNumber}</span>
                      </p>
                    )}

                    {company.registrationNote && (
                      <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 leading-relaxed">
                        <p className="mb-1 font-semibold text-gray-500">申請メッセージ</p>
                        {company.registrationNote}
                      </div>
                    )}

                    {company.status === 'REJECTED' && company.rejectionReason && (
                      <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                        <p className="font-semibold">否認理由：</p>{company.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusBadge status={company.status} />
                  <p className="text-xs text-gray-400">
                    {new Date(company.registeredAt).toLocaleDateString('ja-JP')}
                  </p>
                  <div className="mt-1 flex gap-2">
                    <Link
                      href={`/agent/approvals/${company.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      詳細を見る
                    </Link>
                    {company.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => openModal(company, 'reject')}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          否認
                        </button>
                        <button
                          onClick={() => openModal(company, 'approve')}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                        >
                          承認する
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Approve Modal ── */}
      {modal === 'approve' && selected && (
        <Modal onClose={() => setModal(null)}>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">企業を承認しますか？</h3>
          <p className="mb-1 text-sm text-gray-600">
            <strong>{selected.name}</strong> を承認すると、この企業はログインして採用活動を開始できます。
          </p>
          <p className="mb-6 text-xs text-gray-400">承認後、企業のメールアドレスに通知が送られます。</p>
          <div className="flex gap-3">
            <button
              onClick={() => setModal(null)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700"
            >
              承認する
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reject Modal ── */}
      {modal === 'reject' && selected && (
        <Modal onClose={() => setModal(null)}>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">否認理由を入力してください</h3>
          <p className="mb-4 text-sm text-gray-500">
            <strong>{selected.name}</strong> の登録を否認します。
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="例：法人番号が確認できませんでした。正確な番号を添えて再申請してください。"
            className="mb-4 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setModal(null)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              否認する
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: PendingCompany['status'] }) {
  if (status === 'PENDING_APPROVAL')
    return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">審査待ち</span>;
  if (status === 'APPROVED')
    return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">承認済み</span>;
  return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">否認済み</span>;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}
