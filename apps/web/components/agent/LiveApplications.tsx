"use client";

import { useEffect, useState } from "react";
import { api, type AgentApplicationRecord } from "@/lib/api/client";

const STATUSES = [
  "PENDING",
  "CASUAL_INTERVIEW",
  "SCREENING",
  "FIRST_INTERVIEW",
  "SECOND_INTERVIEW",
  "THIRD_INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "応募受付",
  CASUAL_INTERVIEW: "カジュアル面談",
  SCREENING: "書類選考",
  FIRST_INTERVIEW: "一次面接",
  SECOND_INTERVIEW: "二次面接",
  THIRD_INTERVIEW: "三次面接",
  FINAL_INTERVIEW: "最終面接",
  OFFER: "内定",
  ACCEPTED: "採用決定",
  REJECTED: "不採用",
};

export function LiveApplications({ jobCode }: { jobCode: string }) {
  const [items, setItems] = useState<AgentApplicationRecord[]>([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api
      .agentJobApplications(jobCode)
      .then(setItems)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "応募者の取得に失敗しました"),
      );
  }, [jobCode]);

  const updateStatus = async (code: string, status: string) => {
    setUpdating(code);
    try {
      const updated = await api.updateApplicationStatus(code, status);
      setItems((prev) =>
        prev.map((item) =>
          item.applicationCode === code
            ? { ...item, ...updated, status }
            : item,
        ),
      );
    } catch (e) {
      window.alert(
        e instanceof Error ? e.message : "ステータス更新に失敗しました",
      );
    } finally {
      setUpdating(null);
    }
  };

  if (error)
    return (
      <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  if (items.length === 0) return null;

  return (
    <div className="mb-5 rounded-xl border border-indigo-100 bg-indigo-50/40">
      <div className="border-b border-indigo-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">
          リアルタイム応募者（API）
        </h2>
      </div>
      <div className="divide-y divide-indigo-100">
        {items.map((item) => {
          const candidate = item.user?.candidate;
          const name = candidate
            ? `${candidate.firstName} ${candidate.lastName}`
            : (item.user?.email ?? "候補者");
          return (
            <div
              key={item.applicationCode}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div>
                <p className="font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">
                  {item.applicationCode} · {item.user?.email}
                </p>
              </div>
              <select
                value={item.status}
                disabled={updating === item.applicationCode}
                onChange={(e) =>
                  void updateStatus(item.applicationCode, e.target.value)
                }
                className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-medium text-gray-700"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {item.statusHistory && item.statusHistory.length > 0 && (
                <div className="basis-full rounded-lg border border-indigo-100 bg-white/70 px-3 py-2">
                  <p className="text-[11px] font-semibold text-indigo-700">
                    選考履歴 ({item.statusHistory.length})
                  </p>
                  <div className="mt-1 space-y-1">
                    {item.statusHistory.map((entry, index) => (
                      <p
                        key={`${entry.createdAt}-${index}`}
                        className="text-[11px] text-gray-500"
                      >
                        {entry.fromStatus
                          ? `${STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus} → `
                          : ""}
                        {STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                        <span className="ml-1 text-gray-400">
                          {new Date(entry.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
