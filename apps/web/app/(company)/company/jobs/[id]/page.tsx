import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MOCK_COMPANY_JOBS,
  MOCK_COMPANY_APPLICATIONS,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  JAPANESE_LEVEL_LABELS,
  WORK_LOCATION_LABELS,
} from '@/lib/mock/company';
import { formatSalary, cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompanyJobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = MOCK_COMPANY_JOBS.find(j => j.id === id);
  if (!job) notFound();

  const applications = MOCK_COMPANY_APPLICATIONS.filter(a => a.jobId === id);
  const active = applications.filter(a => !['REJECTED', 'WITHDRAWN'].includes(a.status));
  const rejected = applications.filter(a => a.status === 'REJECTED');

  return (
    <div className="p-6 lg:p-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/company/jobs" className="hover:text-gray-600">求人管理</Link>
        <span>/</span>
        <span className="text-gray-600">{job.code}</span>
      </nav>

      {/* Job header */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{job.title}</h1>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', JOB_STATUS_COLORS[job.status])}>
                {JOB_STATUS_LABELS[job.status]}
              </span>
            </div>
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
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/company/messages"
              className="rounded-lg border border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50">
              エージェントに相談
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3 rounded-lg bg-gray-50 p-3">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{applications.length}</p>
            <p className="text-xs text-gray-400">総応募</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{active.length}</p>
            <p className="text-xs text-gray-400">選考中</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-600">{job.viewCount}</p>
            <p className="text-xs text-gray-400">閲覧数</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{formatSalary(job.salaryMin, job.salaryMax)}</p>
            <p className="text-xs text-gray-400">年収</p>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            応募者一覧 — 選考中 {active.length}名 / 全{applications.length}名
          </h2>
        </div>

        {applications.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">まだ応募がありません</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {[...active, ...rejected].map((app) => (
              <div key={app.id} className={cn(
                'px-5 py-4',
                app.status === 'REJECTED' && 'opacity-50',
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
                    app.avatarColor,
                  )}>
                    {app.avatarInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">{app.candidateName}</p>
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-bold',
                            app.matchScore >= 90 ? 'bg-green-100 text-green-700' :
                            app.matchScore >= 75 ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500',
                          )}>
                            {app.matchScore}% マッチ
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          経験 {app.yearsOfExperience}年 · 日本語 {JAPANESE_LEVEL_LABELS[app.japaneseLevel]}
                          · 応募日 {app.appliedAt}
                        </p>
                      </div>
                      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[app.status])}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {app.skills.map(s => (
                        <span key={s} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{s}</span>
                      ))}
                    </div>

                    {/* Agent note */}
                    {app.agentNote && (
                      <div className="mt-2 flex items-start gap-2">
                        <span className="mt-0.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-xs font-bold text-violet-600">A</span>
                        <p className="text-xs text-gray-500">{app.agentNote}</p>
                      </div>
                    )}
                  </div>
                </div>

                {app.status !== 'REJECTED' && (
                  <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
                    <Link href="/company/messages"
                      className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                      エージェントに連絡
                    </Link>
                    <span className="text-xs text-gray-400">
                      ※ 候補者との直接連絡はエージェント経由になります
                    </span>
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
