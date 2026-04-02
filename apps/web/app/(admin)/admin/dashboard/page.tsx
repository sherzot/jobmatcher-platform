import Link from 'next/link';
import {
  PLATFORM_STATS,
  MOCK_ADMIN_AGENTS,
  MOCK_ADMIN_COMPANIES,
  RECENT_ACTIVITY,
  AGENT_STATUS_COLORS,
  VERIFICATION_COLORS,
  VERIFICATION_LABELS,
  ACTIVITY_ICONS,
} from '@/lib/mock/admin';
import { cn } from '@/lib/utils';

// ── Stat card ─────────────────────────────────────────────────

function StatCard({
  label, value, sub, color = 'text-gray-900', href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className={cn('mt-1.5 text-2xl font-bold', color)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ── Page ─────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const pendingCompanies = MOCK_ADMIN_COMPANIES.filter(c => c.verificationStatus === 'PENDING');
  const topAgents = [...MOCK_ADMIN_AGENTS]
    .filter(a => a.status === 'ACTIVE')
    .sort((a, b) => b.applicationsThisMonth - a.applicationsThisMonth)
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <p className="mt-0.5 text-sm text-gray-400">2026年4月2日 現在</p>
      </div>

      {/* Alert banner */}
      {(PLATFORM_STATS.pendingVerifications > 0 || PLATFORM_STATS.flaggedAccounts > 0) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {PLATFORM_STATS.pendingVerifications > 0 && (
            <Link href="/admin/companies"
              className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100 transition-colors">
              <svg className="h-4 w-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span><strong>{PLATFORM_STATS.pendingVerifications}社</strong>が企業認証待ちです →</span>
            </Link>
          )}
          {PLATFORM_STATS.flaggedAccounts > 0 && (
            <Link href="/admin/users"
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 hover:bg-red-100 transition-colors">
              <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span><strong>{PLATFORM_STATS.flaggedAccounts}件</strong>のフラグ付きアカウント →</span>
            </Link>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="総ユーザー数"
          value={PLATFORM_STATS.totalUsers}
          sub={`今月 +${PLATFORM_STATS.newUsersThisMonth}名`}
          color="text-indigo-600"
          href="/admin/users"
        />
        <StatCard
          label="エージェント"
          value={PLATFORM_STATS.totalAgents}
          sub="アクティブ"
          color="text-violet-600"
          href="/admin/agents"
        />
        <StatCard
          label="登録企業"
          value={PLATFORM_STATS.totalCompanies}
          sub={`今月 +${PLATFORM_STATS.newCompaniesThisMonth}社`}
          color="text-blue-600"
          href="/admin/companies"
        />
        <StatCard
          label="公開中求人"
          value={PLATFORM_STATS.activeJobs}
          sub="掲載中"
          color="text-green-600"
        />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="総応募数"
          value={PLATFORM_STATS.totalApplications}
          sub={`今月 ${PLATFORM_STATS.applicationsThisMonth}件`}
          color="text-gray-900"
        />
        <StatCard
          label="内定率"
          value={`${PLATFORM_STATS.offerRate}%`}
          sub="全期間平均"
          color="text-emerald-600"
        />
        <StatCard
          label="平均マッチスコア"
          value={`${PLATFORM_STATS.avgMatchScore}%`}
          sub="AIマッチング"
          color="text-blue-600"
        />
        <StatCard
          label="認証待ち企業"
          value={PLATFORM_STATS.pendingVerifications}
          sub="要対応"
          color={PLATFORM_STATS.pendingVerifications > 0 ? 'text-amber-600' : 'text-gray-900'}
          href="/admin/companies"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agent performance */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-gray-900">エージェント実績（今月）</h2>
            <Link href="/admin/agents" className="text-xs text-blue-600 hover:underline">すべて見る →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topAgents.map((agent, idx) => (
              <div key={agent.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-5 shrink-0 text-sm font-bold text-gray-300">#{idx + 1}</span>
                <div className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                  agent.avatarColor,
                )}>
                  {agent.avatarInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{agent.displayName}</p>
                  <p className="text-xs text-gray-400">{agent.code}</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="text-sm font-bold text-violet-600">{agent.applicationsThisMonth}</p>
                  <p className="text-xs text-gray-400">応募</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="text-sm font-bold text-blue-600">{agent.assignedCompanies}</p>
                  <p className="text-xs text-gray-400">企業</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="text-sm font-bold text-green-600">{agent.totalCandidates}</p>
                  <p className="text-xs text-gray-400">候補者</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="text-sm font-bold text-gray-700">{agent.offersMadeTotal}</p>
                  <p className="text-xs text-gray-400">内定</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pending verifications */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">認証待ち企業</h2>
              <Link href="/admin/companies" className="text-xs text-blue-600 hover:underline">管理 →</Link>
            </div>
            {pendingCompanies.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">審査待ちはありません</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingCompanies.map(c => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                    <div className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                      c.logoColor,
                    )}>
                      {c.logoInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.assignedAgentName} · {c.registeredAt}</p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', VERIFICATION_COLORS[c.verificationStatus])}>
                      {VERIFICATION_LABELS[c.verificationStatus]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">最近のアクティビティ</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {RECENT_ACTIVITY.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                  <span className="mt-0.5 text-base leading-none">{ACTIVITY_ICONS[item.type]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-700">{item.description}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">{item.actorName}</p>
                  </div>
                  <p className="shrink-0 text-xs text-gray-300">
                    {new Date(item.createdAt).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
