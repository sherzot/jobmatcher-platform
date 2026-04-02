import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { MOCK_USER } from '@/lib/mock/user';
import { MOCK_APPLICATIONS, STATUS_LABELS, STATUS_COLORS } from '@/lib/mock/applications';
import { MOCK_JOBS } from '@/lib/mock/jobs';
import { formatSalary, timeAgo, cn } from '@/lib/utils';

const STATS = [
  { label: '応募中', value: MOCK_APPLICATIONS.filter(a => !['REJECTED','WITHDRAWN','ACCEPTED'].includes(a.status)).length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: '面接予定', value: MOCK_APPLICATIONS.filter(a => a.status.includes('INTERVIEW')).length, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: '内定', value: MOCK_APPLICATIONS.filter(a => a.status === 'OFFER' || a.status === 'ACCEPTED').length, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '不採用', value: MOCK_APPLICATIONS.filter(a => a.status === 'REJECTED').length, color: 'text-red-500', bg: 'bg-red-50' },
];

export default function DashboardPage() {
  const recentApps = MOCK_APPLICATIONS.slice(0, 3);
  const recommendedJobs = MOCK_JOBS.filter((j) => j.japaneseLevel === 'NONE' || j.japaneseLevel === 'N2').slice(0, 3);
  const nextAction = MOCK_APPLICATIONS.find((a) => a.nextAction);

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          おかえりなさい、{MOCK_USER.lastName}さん
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          求職活動の状況を確認しましょう
        </p>
      </div>

      {/* Profile completeness alert */}
      {MOCK_USER.profileCompleteness < 100 && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">プロフィールが{MOCK_USER.profileCompleteness}%完成しています</p>
              <p className="text-xs text-amber-600">完成させると応募採択率が2倍になります</p>
            </div>
          </div>
          <Link href="/profile" className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700">
            完成させる
          </Link>
        </div>
      )}

      {/* Next action alert */}
      {nextAction && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-800">次のアクション</p>
              <p className="text-xs text-indigo-600">{nextAction.nextAction} — {nextAction.companyName}</p>
            </div>
          </div>
          <Link href="/applications" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
            詳細を見る
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className={cn('rounded-xl border border-gray-100 p-4', stat.bg)}>
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent applications */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">最近の応募</h2>
            <Link href="/applications" className="text-xs font-medium text-indigo-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApps.map((app) => (
              <div key={app.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                      app.companyLogoColor,
                    )}>
                      {app.companyLogoInitial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{app.jobTitle}</p>
                      <p className="text-xs text-gray-400">{app.companyName}</p>
                    </div>
                  </div>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[app.status])}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </div>
                {app.agentNote && (
                  <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 line-clamp-1">
                    エージェント: {app.agentNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended jobs */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">おすすめ求人</h2>
            <Link href="/jobs" className="text-xs font-medium text-indigo-600 hover:underline">
              もっと見る →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recommendedJobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="group block px-5 py-3.5">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                    job.company.logoColor,
                  )}>
                    {job.company.logoInitial}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                      {job.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-indigo-500">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="text-xs text-gray-400">{job.prefecture}</span>
                      {job.japaneseLevel === 'NONE' && (
                        <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-xs text-green-600">日本語不問</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">登録スキル</h2>
          <Link href="/resume" className="text-xs font-medium text-indigo-600 hover:underline">編集</Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOCK_USER.skills.map((skill) => (
            <span key={skill} className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
