import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Badge } from '@/components/ui/Badge';
import { MOCK_JOBS, JOB_TYPE_LABELS, WORK_LOCATION_LABELS, JAPANESE_LEVEL_LABELS } from '@/lib/mock/jobs';
import { formatSalary, timeAgo, cn } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = MOCK_JOBS.find((j) => j.id === id);
  if (!job) notFound();

  const related = MOCK_JOBS.filter((j) => j.id !== job.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          {/* Main content */}
          <main className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/jobs" className="hover:text-gray-600">求人一覧</Link>
              <span>/</span>
              <span className="text-gray-600">{job.code}</span>
            </nav>

            {/* Job header card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-bold text-white',
                  job.company.logoColor,
                )}>
                  {job.company.logoInitial}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                  <p className="mt-1 text-base font-medium text-gray-600">{job.company.name}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="default">{JOB_TYPE_LABELS[job.jobType]}</Badge>
                    <Badge variant="outline">{WORK_LOCATION_LABELS[job.workLocation]}</Badge>
                    {job.japaneseLevel === 'NONE' ? (
                      <Badge variant="success">日本語不問</Badge>
                    ) : (
                      <Badge variant="outline">{JAPANESE_LEVEL_LABELS[job.japaneseLevel]}</Badge>
                    )}
                    {job.visaSponsorship && <Badge variant="warning">ビザサポート</Badge>}
                  </div>
                </div>
              </div>

              {/* Key info */}
              <div className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-400">年収</p>
                  <p className="mt-0.5 font-semibold text-indigo-600">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">勤務地</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{job.prefecture} {job.city}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">経験</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{job.minExperience}年以上</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">掲載日</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-900">{timeAgo(job.publishedAt)}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-400">必要スキル</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-gray-900">仕事内容</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-gray-900">応募要件</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {job.requirements}
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-gray-900">待遇・給与</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {job.benefits}
              </div>
            </div>

            {/* Company info */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-base font-bold text-gray-900">会社情報</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">会社名</span>
                  <p className="font-medium text-gray-900">{job.company.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">業界</span>
                  <p className="font-medium text-gray-900">{job.company.industry}</p>
                </div>
                <div>
                  <span className="text-gray-400">従業員数</span>
                  <p className="font-medium text-gray-900">{job.company.employeeCount}</p>
                </div>
                <div>
                  <span className="text-gray-400">所在地</span>
                  <p className="font-medium text-gray-900">{job.company.prefecture}</p>
                </div>
              </div>
            </div>
          </main>

          {/* Sticky apply sidebar */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Apply card */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                  <p className="text-xs text-gray-400">年収</p>
                </div>

                <Link
                  href={`/register?from=/jobs/${job.id}&apply=1`}
                  className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  この求人に応募する
                </Link>
                <p className="mt-2 text-center text-xs text-gray-400">
                  応募には無料会員登録が必要です
                </p>

                <div className="mt-4 flex justify-around border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{job.applyCount}</p>
                    <p>応募数</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{job.viewCount}</p>
                    <p>閲覧数</p>
                  </div>
                </div>
              </div>

              {/* Related jobs */}
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">類似求人</h3>
                <div className="space-y-3">
                  {related.map((rJob) => (
                    <Link key={rJob.id} href={`/jobs/${rJob.id}`} className="group block">
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
                          rJob.company.logoColor,
                        )}>
                          {rJob.company.logoInitial}
                        </div>
                        <div>
                          <p className="line-clamp-2 text-xs font-medium text-gray-900 group-hover:text-indigo-600">
                            {rJob.title}
                          </p>
                          <p className="mt-0.5 text-xs text-indigo-500">
                            {formatSalary(rJob.salaryMin, rJob.salaryMax)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile apply bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 lg:hidden">
        <Link
          href={`/register?from=/jobs/${job.id}&apply=1`}
          className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-semibold text-white"
        >
          この求人に応募する — {formatSalary(job.salaryMin, job.salaryMax)}
        </Link>
      </div>
    </div>
  );
}
