"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MOCK_AGENT_JOBS,
  JOB_STATUS_LABELS,
  JOB_STATUS_COLORS,
  WORK_LOCATION_LABELS,
  JAPANESE_LEVEL_LABELS,
  type AgentJob,
} from "@/lib/mock/agent";
import { api } from "@/lib/api/client";
import { formatSalary, cn } from "@/lib/utils";

export default function AgentJobsPage() {
  const [jobs, setJobs] = useState<AgentJob[]>(MOCK_AGENT_JOBS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api
      .agentCompanies()
      .then((records) => {
        const liveJobs = records.flatMap(({ company }) =>
          (company.jobs ?? []).map((job) => ({
            id: job.jobCode,
            code: job.jobCode,
            companyId: String(company.id),
            companyName: company.name,
            companyLogoInitial: company.name.charAt(0),
            companyLogoColor: "bg-indigo-600",
            title: job.title,
            jobType: job.jobType,
            workLocation: job.workLocation ?? "HYBRID",
            prefecture: job.prefecture ?? company.prefecture ?? "—",
            salaryMin: job.salaryMin ?? 0,
            salaryMax: job.salaryMax ?? 0,
            japaneseLevel: job.japaneseLevel ?? "NONE",
            visaSponsorship: job.visaSponsorship ?? false,
            skills:
              typeof job.skills === "string"
                ? JSON.parse(job.skills)
                : (job.skills ?? []),
            status: job.status as AgentJob["status"],
            applicationCount: job.applyCount,
            viewCount: job.viewCount ?? 0,
            publishedAt: job.publishedAt ?? null,
            createdAt: job.publishedAt ?? new Date().toISOString(),
          })),
        );
        setJobs(liveJobs);
      })
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "求人一覧の取得に失敗しました",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleJob = async (job: AgentJob, activate: boolean) => {
    setUpdating(job.code);
    try {
      await (activate ? api.activateJob(job.code) : api.pauseJob(job.code));
      setJobs((prev) =>
        prev.map((item) =>
          item.code === job.code
            ? { ...item, status: activate ? "ACTIVE" : "PAUSED" }
            : item,
        ),
      );
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "求人ステータスの更新に失敗しました",
      );
    } finally {
      setUpdating(null);
    }
  };

  const removeJob = async (job: AgentJob) => {
    if (!window.confirm("この求人を削除しますか？")) return;
    setUpdating(job.code);
    try {
      await api.deleteJob(job.code);
      setJobs((prev) => prev.filter((item) => item.code !== job.code));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "求人の削除に失敗しました");
    } finally {
      setUpdating(null);
    }
  };

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
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          求人を作成
        </Link>
      </div>

      {/* Status summary */}
      <div className="mb-5 grid grid-cols-4 gap-3">
        {[
          {
            key: "ACTIVE",
            count: jobs.filter((j) => j.status === "ACTIVE").length,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            key: "DRAFT",
            count: jobs.filter((j) => j.status === "DRAFT").length,
            color: "text-gray-600",
            bg: "bg-gray-50",
          },
          {
            key: "PAUSED",
            count: jobs.filter((j) => j.status === "PAUSED").length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            key: "CLOSED",
            count: jobs.filter((j) => j.status === "CLOSED").length,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.key}
            className={cn(
              "rounded-xl border border-gray-100 p-3 text-center",
              s.bg,
            )}
          >
            <p className={cn("text-xl font-bold", s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500">
              {JOB_STATUS_LABELS[s.key as keyof typeof JOB_STATUS_LABELS]}
            </p>
          </div>
        ))}
      </div>

      {/* Job list */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
          読み込み中…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex items-start gap-4 p-5">
                {/* Company logo */}
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white",
                    job.companyLogoColor,
                  )}
                >
                  {job.companyLogoInitial}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            JOB_STATUS_COLORS[job.status],
                          )}
                        >
                          {JOB_STATUS_LABELS[job.status]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {job.companyName}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-400">
                      {job.code}
                    </span>
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
                      <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                        ビザサポート
                      </span>
                    )}
                    {job.skills.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-violet-50 px-2 py-0.5 text-xs text-violet-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="mt-3 flex items-center gap-5 text-xs text-gray-400">
                    <span className="font-medium text-violet-600">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                    <span>{job.prefecture}</span>
                    <span>
                      応募:{" "}
                      <strong className="text-gray-700">
                        {job.applicationCount}
                      </strong>
                      件
                    </span>
                    <span>
                      閲覧:{" "}
                      <strong className="text-gray-700">{job.viewCount}</strong>
                      回
                    </span>
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
                {job.status === "ACTIVE" && (
                  <button
                    onClick={() => void toggleJob(job, false)}
                    disabled={updating === job.code}
                    className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                  >
                    一時停止
                  </button>
                )}
                {job.status === "PAUSED" && (
                  <button
                    onClick={() => void toggleJob(job, true)}
                    disabled={updating === job.code}
                    className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                  >
                    再公開
                  </button>
                )}
                {job.status === "DRAFT" && (
                  <button
                    onClick={() => void toggleJob(job, true)}
                    disabled={updating === job.code}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    公開する
                  </button>
                )}
                <button
                  onClick={() => void removeJob(job)}
                  disabled={updating === job.code}
                  className="ml-auto rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-50 disabled:opacity-50"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
