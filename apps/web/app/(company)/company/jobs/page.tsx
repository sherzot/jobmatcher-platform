'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MOCK_COMPANY_JOBS,
  CompanyJob,
  CompanyJobStatus,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  WORK_LOCATION_LABELS,
  JAPANESE_LEVEL_LABELS,
} from '@/lib/mock/company';
import { formatSalary, cn } from '@/lib/utils';

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<CompanyJob[]>(MOCK_COMPANY_JOBS);

  const toggleStatus = (id: string, current: CompanyJobStatus) => {
    const next: CompanyJobStatus =
      current === 'ACTIVE' ? 'PAUSED' :
      current === 'PAUSED' ? 'ACTIVE' :
      current === 'DRAFT'  ? 'ACTIVE' : current;
    setJobs(jobs.map(j => j.id === id ? { ...j, status: next, publishedAt: next === 'ACTIVE' && !j.publishedAt ? new Date().toISOString().split('T')[0] : j.publishedAt } : j));
  };

  const activeCount  = jobs.filter(j => j.status === 'ACTIVE').length;
  const draftCount   = jobs.filter(j => j.status === 'DRAFT').length;
  const pausedCount  = jobs.filter(j => j.status === 'PAUSED').length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">求人管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">{jobs.length}件 — 公開中 {activeCount} · 下書き {draftCount} · 停止中 {pausedCount}</p>
        </div>
        {/* Company cannot create jobs directly — must request agent */}
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          新しい求人はエージェントが作成します
          <Link href="/company/messages" className="ml-1 font-semibold underline hover:text-blue-900">
            依頼する →
          </Link>
        </div>
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className={cn(
            'rounded-xl border bg-white transition-all',
            job.status === 'ACTIVE' ? 'border-gray-200' :
            job.status === 'PAUSED' ? 'border-amber-100' : 'border-gray-100 opacity-80',
          )}>
            <div className="flex items-start gap-4 p-5">
              <div className="min-w-0 flex-1">
                {/* Title + status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', JOB_STATUS_COLORS[job.status])}>
                    {JOB_STATUS_LABELS[job.status]}
                  </span>
                  {job.newApplicationCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      新着 +{job.newApplicationCount}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{job.code}</span>
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
                    <span key={s} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{s}</span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-5 text-xs text-gray-400">
                  <span className="font-semibold text-blue-600">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  <span>応募: <strong className="text-gray-700">{job.applicationCount}名</strong></span>
                  <span>閲覧: <strong className="text-gray-700">{job.viewCount}回</strong></span>
                  {job.publishedAt && <span>公開: {job.publishedAt}</span>}
                </div>
              </div>

              {/* Toggle button */}
              <div className="shrink-0">
                {job.status === 'ACTIVE' && (
                  <button
                    onClick={() => toggleStatus(job.id, job.status)}
                    className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    一時停止
                  </button>
                )}
                {job.status === 'PAUSED' && (
                  <button
                    onClick={() => toggleStatus(job.id, job.status)}
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                  >
                    再開する
                  </button>
                )}
                {job.status === 'DRAFT' && (
                  <button
                    onClick={() => toggleStatus(job.id, job.status)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    公開する
                  </button>
                )}
              </div>
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 border-t border-gray-100 px-5 py-3">
              <Link
                href={`/company/jobs/${job.id}`}
                className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                応募者を見る ({job.applicationCount}名)
              </Link>
              <Link
                href="/company/messages"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                エージェントに相談
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
