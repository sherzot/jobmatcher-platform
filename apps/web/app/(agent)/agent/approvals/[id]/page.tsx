'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PENDING_COMPANIES } from '@/lib/mock/pending-companies';

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const company = MOCK_PENDING_COMPANIES.find((c) => c.id === id);

  const [status, setStatus] = useState(company?.status ?? 'PENDING_APPROVAL');
  const [rejectionReason, setRejectionReason] = useState(company?.rejectionReason ?? '');
  const [modal, setModal] = useState<'approve' | 'reject' | null>(null);
  const [rejectInput, setRejectInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!company) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-400">企業が見つかりません</p>
        <Link href="/agent/approvals" className="mt-3 text-sm text-violet-600 hover:underline">
          ← 審査一覧に戻る
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800)); // TODO: PATCH /api/agent/companies/:id/approve
    setStatus('APPROVED');
    setModal(null);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectInput.trim()) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800)); // TODO: PATCH /api/agent/companies/:id/reject
    setStatus('REJECTED');
    setRejectionReason(rejectInput);
    setModal(null);
    setIsProcessing(false);
  };

  const isPending = status === 'PENDING_APPROVAL';

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Back */}
      <Link
        href="/agent/approvals"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        企業審査一覧に戻る
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
              <StatusBadge status={status} />
            </div>
            {company.nameEn && (
              <p className="text-sm text-gray-400">{company.nameEn}</p>
            )}
            <p className="mt-0.5 font-mono text-xs text-gray-400">{company.companyCode}</p>
          </div>
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setModal('reject')}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              否認
            </button>
            <button
              onClick={() => setModal('approve')}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              承認する
            </button>
          </div>
        )}
      </div>

      {/* Rejection notice */}
      {status === 'REJECTED' && rejectionReason && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-1 text-sm font-semibold text-red-700">否認済み</p>
          <p className="text-sm text-red-600">{rejectionReason}</p>
        </div>
      )}

      {status === 'APPROVED' && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">この企業は承認済みです。ログインして採用活動を開始できます。</p>
        </div>
      )}

      {/* Details card */}
      <div className="space-y-4">

        {/* Basic info */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-700">基本情報</h2>
          <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8">
            <DetailRow label="業種" value={company.industry} />
            <DetailRow label="所在地" value={company.prefecture} />
            <DetailRow label="メールアドレス" value={company.email} />
            <DetailRow
              label="登録日時"
              value={new Date(company.registeredAt).toLocaleString('ja-JP', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            />
          </dl>
        </section>

        {/* Registration number */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-gray-700">法人情報</h2>
          {company.businessRegNumber ? (
            <dl className="space-y-3">
              <DetailRow label="法人番号 / 登録番号" value={company.businessRegNumber} mono />
            </dl>
          ) : (
            <p className="text-sm text-gray-400">法人番号の登録なし</p>
          )}
        </section>

        {/* Agent message */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-bold text-gray-700">エージェントへのメッセージ</h2>
          {company.registrationNote ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
              {company.registrationNote}
            </p>
          ) : (
            <p className="text-sm text-gray-400">メッセージなし</p>
          )}
        </section>

        {/* Checklist for agent */}
        {isPending && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-3 text-sm font-bold text-amber-800">審査チェックリスト</h2>
            <ul className="space-y-2 text-sm text-amber-700">
              {[
                '法人番号が実在する法人と一致するか確認する',
                '会社名・業種・所在地が整合しているか確認する',
                'メールアドレスが会社ドメインと一致するか確認する',
                '申請メッセージに不審な点がないか確認する',
                '日本の国税庁法人番号検索または外国法人登録証で実在を確認する',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Bottom action */}
        {isPending && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModal('reject')}
              className="flex-1 rounded-xl border border-red-200 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              否認する
            </button>
            <button
              onClick={() => setModal('approve')}
              className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700"
            >
              承認して採用活動を許可する
            </button>
          </div>
        )}
      </div>

      {/* ── Approve Modal ── */}
      {modal === 'approve' && (
        <Modal onClose={() => !isProcessing && setModal(null)}>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">承認しますか？</h3>
          <p className="mb-1 text-sm text-gray-600">
            <strong>{company.name}</strong> を承認します。
          </p>
          <p className="mb-6 text-xs text-gray-400">
            承認後、この企業は即時ログインして採用活動を開始できます。
            登録メールアドレス（{company.email}）に通知が送られます。
          </p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} disabled={isProcessing}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              キャンセル
            </button>
            <button onClick={handleApprove} disabled={isProcessing}
              className="flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60">
              {isProcessing ? '処理中...' : '承認する'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reject Modal ── */}
      {modal === 'reject' && (
        <Modal onClose={() => !isProcessing && setModal(null)}>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">否認理由を入力してください</h3>
          <p className="mb-4 text-sm text-gray-500">
            この理由は企業側（{company.email}）に通知されます。
          </p>
          <textarea
            value={rejectInput}
            onChange={(e) => setRejectInput(e.target.value)}
            rows={4}
            placeholder="例：法人番号が確認できませんでした。正確な番号を添えて再申請してください。"
            className="mb-4 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} disabled={isProcessing}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              キャンセル
            </button>
            <button onClick={handleReject} disabled={!rejectInput.trim() || isProcessing}
              className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50">
              {isProcessing ? '処理中...' : '否認する'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className={`mt-0.5 text-sm text-gray-900 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PENDING_APPROVAL')
    return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">審査待ち</span>;
  if (status === 'APPROVED')
    return <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">承認済み</span>;
  return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">否認済み</span>;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
