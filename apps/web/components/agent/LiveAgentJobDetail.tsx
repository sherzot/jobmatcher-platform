"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type Job } from "@/lib/api/client";
import { LiveApplications } from "@/components/agent/LiveApplications";

export function LiveAgentJobDetail({ jobCode }: { jobCode: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getJob(jobCode)
      .then(setJob)
      .catch((e) => setError(e instanceof Error ? e.message : "求人の取得に失敗しました"));
  }, [jobCode]);

  if (error) {
    return <div className="p-8 text-sm text-red-700">{error}</div>;
  }
  if (!job) {
    return <div className="p-8 text-sm text-gray-400">読み込み中…</div>;
  }

  const code = job.jobCode ?? job.code ?? jobCode;
  const companyName = job.company?.name ?? "企業";

  return (
    <div className="p-6 lg:p-8">
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/agent/jobs" className="hover:text-gray-600">求人管理</Link>
        <span>/</span>
        <span className="text-gray-600">{code}</span>
      </nav>
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-base font-bold text-white">
            {companyName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{job.title}</h1>
            <p className="mt-0.5 text-sm text-gray-500">{companyName}</p>
            <p className="mt-2 text-xs text-gray-500">{job.status} · {job.workLocation ?? "—"}</p>
          </div>
        </div>
      </div>
      <LiveApplications jobCode={code} />
    </div>
  );
}
