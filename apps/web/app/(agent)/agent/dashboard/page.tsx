import Link from 'next/link';
import {
  MOCK_AGENT,
  MOCK_AGENT_COMPANIES,
  MOCK_AGENT_JOBS,
  MOCK_AGENT_CANDIDATES,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/mock/agent';
import { formatSalary, timeAgo, cn } from '@/lib/utils';

const STATS = [
  {
    label: '担当企業',
    value: MOCK_AGENT_COMPANIES.length,
    sub: `${MOCK_AGENT_COMPANIES.filter(c => c.isActive).length}社 稼働中`,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    href: '/agent/companies',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: '公開中求人',
    value: MOCK_AGENT_JOBS.filter(j => j.status === 'ACTIVE').length,
    sub: `全${MOCK_AGENT_JOBS.length}件`,
    color: 'text-green-600',
    bg: 'bg-green-50',
    href: '/agent/jobs',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: '選考中候補者',
    value: MOCK_AGENT_CANDIDATES.filter(c => !['REJECTED', 'WITHDRAWN', 'ACCEPTED'].includes(c.status)).length,
    sub: `全${MOCK_AGENT_CANDIDATES.length}名`,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    href: '/agent/candidates',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: '今月の応募',
    value: MOCK_AGENT_JOBS.reduce((sum, j) => sum + j.applicationCount, 0),
    sub: '今月合計',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    href: '/agent/candidates',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export default function AgentDashboardPage() {
  const recentCandidates = MOCK_AGENT_CANDIDATES
    .filter(c => !['REJECTED', 'WITHDRAWN'].includes(c.status))
    .slice(0, 4);

  const activeJobs = MOCK_AGENT_JOBS
    .filter(j => j.status === 'ACTIVE')
    .sort((a, b) => b.applicationCount - a.applicationCount)
    .slice(0, 4);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            おはようございます、{MOCK_AGENT.displayName}さん
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">エージェントダッシュボード</p>
        </div>
        <Link
          href="/agent/jobs/new"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          求人を作成
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className={cn(
              'group rounded-xl border border-gray-100 p-4 transition-all hover:shadow-sm',
              stat.bg,
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-700">{stat.label}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </div>
                <span className={cn('rounded-lg p-2', stat.bg, stat.color)}>{stat.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active jobs */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">公開中求人（応募数順）</h2>
            <Link href="/agent/jobs" className="text-xs font-medium text-violet-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {activeJobs.map((job) => (
              <Link key={job.id} href={`/agent/jobs/${job.id}`} className="group flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50">
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                  job.companyLogoColor,
                )}>
                  {job.companyLogoInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 group-hover:text-violet-600">
                    {job.title}
                  </p>
                  <p className="truncate text-xs text-gray-400">{job.companyName}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-violet-600">{job.applicationCount}</p>
                  <p className="text-xs text-gray-400">応募</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent candidates */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">選考中候補者</h2>
            <Link href="/agent/candidates" className="text-xs font-medium text-violet-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCandidates.map((c) => (
              <div key={c.id} className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    c.avatarColor,
                  )}>
                    {c.avatarInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-gray-900">{c.name}</p>
                      <span className="shrink-0 rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600">
                        {c.matchScore}%
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-400">{c.appliedJobTitle}</p>
                  </div>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[c.status])}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Companies overview */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">担当企業</h2>
          <Link href="/agent/companies" className="text-xs font-medium text-violet-600 hover:underline">
            管理する →
          </Link>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {MOCK_AGENT_COMPANIES.map((company) => (
            <Link key={company.id} href="/agent/companies" className="group flex items-center gap-3 px-5 py-4 hover:bg-gray-50">
              <div className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white',
                company.logoColor,
              )}>
                {company.logoInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-violet-600">
                  {company.name}
                </p>
                <p className="text-xs text-gray-400">
                  求人 {company.activeJobCount}件 · 応募 {company.totalApplications}件
                </p>
                {!company.isVerified && (
                  <span className="mt-0.5 inline-block rounded-full bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">
                    審査中
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
