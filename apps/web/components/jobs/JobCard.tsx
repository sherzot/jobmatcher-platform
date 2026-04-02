import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatSalary, timeAgo, cn } from '@/lib/utils';
import { MockJob, JOB_TYPE_LABELS, WORK_LOCATION_LABELS, JAPANESE_LEVEL_LABELS } from '@/lib/mock/jobs';

interface JobCardProps {
  job: MockJob;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <article className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Company logo */}
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white',
              job.company.logoColor,
            )}
          >
            {job.company.logoInitial}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-indigo-600">
              {job.title}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">
              {job.company.name}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="default">{JOB_TYPE_LABELS[job.jobType]}</Badge>
          <Badge variant="outline">{WORK_LOCATION_LABELS[job.workLocation]}</Badge>
          {job.japaneseLevel === 'NONE' ? (
            <Badge variant="success">日本語不問</Badge>
          ) : (
            <Badge variant="outline">{JAPANESE_LEVEL_LABELS[job.japaneseLevel]}</Badge>
          )}
          {job.visaSponsorship && (
            <Badge variant="warning">ビザサポート</Badge>
          )}
        </div>

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              +{job.skills.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div>
            <span className="text-sm font-semibold text-indigo-600">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
            <span className="ml-1 text-xs text-gray-400">年収</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{job.prefecture}</span>
            <span>掲載 {timeAgo(job.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
