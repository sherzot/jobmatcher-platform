import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MOCK_AGENT_JOBS,
  MOCK_AGENT_CANDIDATES,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  WORK_LOCATION_LABELS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/agent';
import { formatSalary, cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentJobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = MOCK_AGENT_JOBS.find(j => j.id === id);
  if (!job) notFound();

  const candidates = MOCK_AGENT_CANDIDATES.filter(c => c.appliedJobId === id);
  const active = candidates.filter(c => !['REJECTED', 'WITHDRAWN'].includes(c.status));
  const closed = candidates.filter(c => ['REJECTED', 'WITHDRAWN'].includes(c.status));

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/agent/jobs" className="hover:text-gray-600">求人管理</Link>
        <span>/</span>
        <span className="text-gray-600">{job.code}</span>
      </nav>

      {/* Job header */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white',
              job.companyLogoColor,
            )}>
              {job.companyLogoInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{job.title}</h1>
                <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', JOB_STATUS_COLORS[job.status])}>
                  {JOB_STATUS_LABELS[job.status]}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{job.companyName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  {WORK_LOCATION_LABELS[job.workLocation]}
                </span>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  日本語: {JAPANESE_LEVEL_LABELS[job.japaneseLevel]}
                </span>
                {job.visaSponsorship && (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-600">ビザサポート</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              編集
            </button>
            {job.status === 'ACTIVE' && (
              <button className="rounded-lg border border-amber-200 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50">
                一時停止
              </button>
            )}
            {job.status === 'DRAFT' && (
              <button className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                公開する
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3 rounded-lg bg-gray-50 p-3">
          <div className="text-center">
            <p className="text-xl font-bold text-violet-600">{candidates.length}</p>
            <p className="text-xs text-gray-400">総応募</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{active.length}</p>
            <p className="text-xs text-gray-400">選考中</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-600">{job.viewCount}</p>
            <p className="text-xs text-gray-400">閲覧数</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-indigo-600">{formatSalary(job.salaryMin, job.salaryMax)}</p>
            <p className="text-xs text-gray-400">年収</p>
          </div>
        </div>
      </div>

      {/* Candidates */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            応募候補者 — 選考中 {active.length}名 / 全{candidates.length}名
          </h2>
        </div>

        {candidates.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p>まだ応募がありません</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...active, ...closed].map((candidate) => (
              <div
                key={candidate.id}
                className={cn('px-5 py-4', ['REJECTED', 'WITHDRAWN'].includes(candidate.status) && 'opacity-50')}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
                    candidate.avatarColor,
                  )}>
                    {candidate.avatarInitial}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{candidate.name}</p>
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                            {candidate.matchScore}% マッチ
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {candidate.prefecture} · 経験 {candidate.yearsOfExperience}年 · 日本語 {JAPANESE_LEVEL_LABELS[candidate.japaneseLevel]}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[candidate.status])}>
                          {STATUS_LABELS[candidate.status]}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {skill}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400">
                        希望: {formatSalary(candidate.desiredSalaryMin, candidate.desiredSalaryMax)}
                      </span>
                    </div>

                    {/* Agent note */}
                    {candidate.agentNote && (
                      <p className="mt-2 rounded-lg bg-violet-50 px-3 py-1.5 text-xs text-violet-700">
                        メモ: {candidate.agentNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {!['REJECTED', 'WITHDRAWN'].includes(candidate.status) && (
                  <div className="mt-3 flex items-center gap-2 pl-15">
                    <button className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                      ステータス変更
                    </button>
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      メッセージ送信
                    </button>
                    <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      履歴書を見る
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
    </div>
  );
}
