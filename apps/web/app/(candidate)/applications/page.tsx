"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationPipeline } from "@/components/applications/ApplicationPipeline";
import { api, type Application } from "@/lib/api/client";
import { formatDate, formatSalary, cn } from "@/lib/utils";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type ApplicationStatus,
} from "@/lib/mock/applications";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  useEffect(() => {
    void api
      .myApplications()
      .then(setApplications)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "応募履歴の取得に失敗しました。",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <div className="p-8 text-sm text-gray-500">
        応募履歴を読み込んでいます...
      </div>
    );
  if (error)
    return (
      <div className="m-8 rounded-xl bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  const active = applications.filter(
    (a) => !["REJECTED", "WITHDRAWN"].includes(a.status),
  );
  const closed = applications.filter((a) =>
    ["REJECTED", "WITHDRAWN"].includes(a.status),
  );
  const card = (application: Application) => {
    const job = application.job;
    const status = application.status as ApplicationStatus;
    const canWithdraw = !["REJECTED", "WITHDRAWN", "HIRED"].includes(
      application.status,
    );
    const handleWithdraw = async () => {
      if (!canWithdraw || withdrawing === application.applicationCode) return;
      if (!window.confirm("この応募を取り消しますか？")) return;
      setWithdrawing(application.applicationCode);
      try {
        const updated = await api.withdrawApplication(
          application.applicationCode,
        );
        setApplications((prev) =>
          prev.map((item) =>
            item.applicationCode === application.applicationCode
              ? { ...item, ...updated, status: updated.status }
              : item,
          ),
        );
      } catch (e) {
        window.alert(
          e instanceof Error ? e.message : "応募の取り消しに失敗しました。",
        );
      } finally {
        setWithdrawing(null);
      }
    };
    return (
      <div
        key={application.applicationCode}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {job?.title ?? "求人情報"}
            </h3>
            <p className="text-sm text-gray-500">
              {job?.company?.name ?? "企業情報"}
            </p>
            <div className="mt-1 flex gap-3 text-xs text-gray-400">
              <span>{job?.prefecture ?? "—"}</span>
              <span>
                {formatSalary(job?.salaryMin ?? 0, job?.salaryMax ?? 0)}
              </span>
              <span>
                応募日:{" "}
                {application.createdAt
                  ? formatDate(application.createdAt)
                  : "—"}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
              STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600",
            )}
          >
            {STATUS_LABELS[status] ?? application.status}
          </span>
        </div>
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
          <ApplicationPipeline currentStatus={status} />
        </div>
        <div className="border-t border-gray-100 px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/jobs/${job?.code ?? job?.jobCode ?? ""}`}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              求人を見る
            </Link>
            {canWithdraw && (
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={withdrawing === application.applicationCode}
                className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
              >
                {withdrawing === application.applicationCode
                  ? "処理中…"
                  : "応募を取り消す"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">応募履歴</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          {applications.length}件の応募 — {active.length}件進行中
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          進行中 ({active.length})
        </h2>
        {active.map(card)}
      </div>
      {closed.length > 0 && (
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            終了 ({closed.length})
          </h2>
          {closed.map(card)}
        </div>
      )}
      {applications.length === 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">
          応募履歴はまだありません。
          <Link href="/jobs" className="ml-1 text-indigo-600 hover:underline">
            求人を探す
          </Link>
        </div>
      )}
    </div>
  );
}
