import Link from 'next/link';
import {
  MOCK_COMPANY,
  MOCK_ASSIGNED_AGENT,
  MOCK_COMPANY_JOBS,
  MOCK_COMPANY_APPLICATIONS,
  MOCK_MESSAGES,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/company';
import { formatSalary, cn } from '@/lib/utils';

export default function CompanyDashboardPage() {
  const activeJobs = MOCK_COMPANY_JOBS.filter(j => j.status === 'ACTIVE');
  const totalApplications = MOCK_COMPANY_APPLICATIONS.length;
  const activeApplications = MOCK_COMPANY_APPLICATIONS.filter(
    a => !['REJECTED', 'WITHDRAWN'].includes(a.status),
  );
  const newApplications = MOCK_COMPANY_JOBS.reduce((s, j) => s + j.newApplicationCount, 0);
  const unreadMessages = MOCK_MESSAGES.filter(m => !m.isRead && m.senderId === 'agent').length;
  const lastMessage = [...MOCK_MESSAGES].reverse().find(m => m.senderId === 'agent');

  const STATS = [
    {
      label: '公開中求人', value: activeJobs.length,
      sub: `全${MOCK_COMPANY_JOBS.length}件`, color: 'text-green-600', bg: 'bg-green-50',
      href: '/company/jobs',
    },
    {
      label: '選考中候補者', value: activeApplications.length,
      sub: `全${totalApplications}名`, color: 'text-blue-600', bg: 'bg-blue-50',
      href: '/company/jobs',
    },
    {
      label: '新着応募', value: newApplications,
      sub: '未確認', color: 'text-amber-600', bg: 'bg-amber-50',
      href: '/company/jobs',
    },
    {
      label: '未読メッセージ', value: unreadMessages,
      sub: 'エージェントから', color: 'text-violet-600', bg: 'bg-violet-50',
      href: '/company/messages',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">{MOCK_COMPANY.name}</h1>
        <p className="mt-0.5 text-sm text-gray-500">企業ダッシュボード</p>
      </div>

      {/* New message alert */}
      {unreadMessages > 0 && lastMessage && (
        <Link href="/company/messages">
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 hover:bg-violet-100 transition-colors">
            <div className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
              MOCK_ASSIGNED_AGENT.avatarColor,
            )}>
              {MOCK_ASSIGNED_AGENT.avatarInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-violet-900">
                {MOCK_ASSIGNED_AGENT.displayName} からメッセージが届いています
              </p>
              <p className="mt-0.5 truncate text-xs text-violet-600">{lastMessage.content}</p>
            </div>
            <span className="shrink-0 rounded-full bg-violet-600 px-2 py-0.5 text-xs font-bold text-white">
              {unreadMessages}件
            </span>
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className={cn('rounded-xl border border-gray-100 p-4 transition-all hover:shadow-sm', s.bg)}>
              <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-700">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active jobs */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">求人一覧</h2>
            <Link href="/company/jobs" className="text-xs font-medium text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {MOCK_COMPANY_JOBS.map((job) => (
              <Link key={job.id} href={`/company/jobs/${job.id}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {job.title}
                    </p>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', JOB_STATUS_COLORS[job.status])}>
                      {JOB_STATUS_LABELS[job.status]}
                    </span>
                    {job.newApplicationCount > 0 && (
                      <span className="shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                        +{job.newApplicationCount}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    <span>応募 {job.applicationCount}件</span>
                    <span>閲覧 {job.viewCount}回</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {job.status === 'ACTIVE' && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      公開中
                    </span>
                  )}
                  {job.status === 'DRAFT' && (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                      下書き
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Agent card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">担当エージェント</h2>
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white',
                MOCK_ASSIGNED_AGENT.avatarColor,
              )}>
                {MOCK_ASSIGNED_AGENT.avatarInitial}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{MOCK_ASSIGNED_AGENT.displayName}</p>
                <p className="text-xs text-gray-400">{MOCK_ASSIGNED_AGENT.email}</p>
              </div>
            </div>
            <Link
              href="/company/messages"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              メッセージを送る
            </Link>
          </div>

          {/* Recent applications */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-900">最近の応募</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_COMPANY_APPLICATIONS.filter(a => a.status !== 'REJECTED').slice(0, 3).map((app) => (
                <div key={app.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                      app.avatarColor,
                    )}>
                      {app.avatarInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-900">{app.candidateName}</p>
                      <p className="truncate text-xs text-gray-400">{app.jobTitle}</p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLORS[app.status])}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
