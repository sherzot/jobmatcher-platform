import Link from 'next/link';
import {
  MOCK_AGENT_JOBS,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  WORK_LOCATION_LABELS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/agent';
import { formatSalary, cn } from '@/lib/utils';

const STATUS_TABS = [
  { key: 'ALL', label: 'すべて' },
  { key: 'ACTIVE', label: '公開中' },
  { key: 'DRAFT', label: '下書き' },
  { key: 'PAUSED', label: '一時停止' },
  { key: 'CLOSED', label: '終了' },
] as const;

export default function AgentJobsPage() {
  const jobs = MOCK_AGENT_JOBS;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">求人管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">{jobs.length}件の求人</p>
        </div>
        <Link
          href="/agent/jobs/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          求人を作成
        </Link>
      </div>

      {/* Status summary */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          { key: 'ACTIVE', count: jobs.filter(j => j.status === 'ACTIVE').length, color: 'text-green-600', bg: 'bg-green-50' },
          { key: 'DRAFT', count: jobs.filter(j => j.status === 'DRAFT').length, color: 'text-gray-600', bg: 'bg-gray-50' },
          { key: 'PAUSED', count: jobs.filter(j => j.status === 'PAUSED').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { key: 'CLOSED', count: jobs.filter(j => j.status === 'CLOSED').length, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.key} className={cn('rounded-xl border border-gray-100 p-3 text-center', s.bg)}>
            <p className={cn('text-xl font-bold', s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500">{JOB_STATUS_LABELS[s.key as keyof typeof JOB_STATUS_LABELS]}</p>
          </div>
        ))}
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-start gap-4 p-5">
              {/* Company logo */}
              <div className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white',
                job.companyLogoColor,
              )}>
                {job.companyLogoInitial}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', JOB_STATUS_COLORS[job.status])}>
                        {JOB_STATUS_LABELS[job.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{job.companyName}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">{job.code}</span>
                </div>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {WORK_LOCATION_LABELS[job.workLocation]}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    日本語: {JAPANESE_LEVEL_LABELS[job.japaneseLevel]}
                  </span>
                  {job.visaSponsorship && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-600">ビザサポート</span>
                  )}
                  {job.skills.slice(0, 3).map(s => (
                    <span key={s} className="rounded-md bg-violet-50 px-2 py-0.5 text-xs text-violet-600">{s}</span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="mt-3 flex items-center gap-5 text-xs text-gray-400">
                  <span className="font-medium text-violet-600">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  <span>{job.prefecture}</span>
                  <span>応募: <strong className="text-gray-700">{job.applicationCount}</strong>件</span>
                  <span>閲覧: <strong className="text-gray-700">{job.viewCount}</strong>回</span>
                  {job.publishedAt && <span>公開: {job.publishedAt}</span>}
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-3">
              <Link
                href={`/agent/jobs/${job.id}`}
                className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100"
              >
                詳細・候補者
              </Link>
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                編集
              </button>
              {job.status === 'ACTIVE' && (
                <button className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50">
                  一時停止
                </button>
              )}
              {job.status === 'PAUSED' && (
                <button className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50">
                  再公開
                </button>
              )}
              {job.status === 'DRAFT' && (
                <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                  公開する
                </button>
              )}
              <button className="ml-auto rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-50">
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
