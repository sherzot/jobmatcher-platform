import Link from 'next/link';
import { ApplicationPipeline } from '@/components/applications/ApplicationPipeline';
import { MOCK_APPLICATIONS, STATUS_LABELS, STATUS_COLORS } from '@/lib/mock/applications';
import { formatSalary, formatDate, cn } from '@/lib/utils';

export default function ApplicationsPage() {
  const active = MOCK_APPLICATIONS.filter(a => !['REJECTED', 'WITHDRAWN'].includes(a.status));
  const closed = MOCK_APPLICATIONS.filter(a => ['REJECTED', 'WITHDRAWN'].includes(a.status));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">応募履歴</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {MOCK_APPLICATIONS.length}件の応募 — {active.length}件進行中
        </p>
      </div>

      {/* Active applications */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">進行中 ({active.length})</h2>
        {active.map((app) => (
          <div key={app.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Card header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white',
                  app.companyLogoColor,
                )}>
                  {app.companyLogoInitial}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                  <p className="text-sm text-gray-500">{app.companyName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span>{app.prefecture}</span>
                    <span>{formatSalary(app.salaryMin, app.salaryMax)}</span>
                    <span>応募日: {formatDate(app.appliedAt)}</span>
                  </div>
                </div>
              </div>
              <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-semibold', STATUS_COLORS[app.status])}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>

            {/* Pipeline */}
            <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
              <ApplicationPipeline currentStatus={app.status} />
            </div>

            {/* Agent note + next action */}
            {(app.agentNote || app.nextAction) && (
              <div className="border-t border-gray-100 px-5 py-3">
                {app.agentNote && (
                  <div className="flex items-start gap-2 text-sm">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                      A
                    </div>
                    <p className="text-gray-600">{app.agentNote}</p>
                  </div>
                )}
                {app.nextAction && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs">
                    <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-amber-700">{app.nextAction}</span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3">
              <Link href={`/jobs/${app.jobId}`} className="text-xs font-medium text-indigo-600 hover:underline">
                求人を見る
              </Link>
              <span className="text-gray-200">|</span>
              <button className="text-xs text-gray-400 hover:text-gray-600">エージェントにメッセージ</button>
              <span className="text-gray-200">|</span>
              <button className="text-xs text-red-400 hover:text-red-600">辞退する</button>
            </div>
          </div>
        ))}
      </div>

      {/* Closed applications */}
      {closed.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">終了 ({closed.length})</h2>
          {closed.map((app) => (
            <div key={app.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 opacity-60">
              <div className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                app.companyLogoColor,
              )}>
                {app.companyLogoInitial}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-700">{app.jobTitle}</p>
                <p className="text-xs text-gray-400">{app.companyName} · {formatDate(app.appliedAt)}</p>
              </div>
              <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', STATUS_COLORS[app.status])}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
