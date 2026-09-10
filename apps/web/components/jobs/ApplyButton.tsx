"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { api } from "@/lib/api/client";

export function ApplyButton({ jobCode }: { jobCode: string }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const start = () => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=/jobs/${encodeURIComponent(jobCode)}&apply=1`,
      );
      return;
    }
    if (user?.role !== "USER") {
      setError("候補者アカウントでログインしてください。");
      setState("error");
      return;
    }
    setOpen(true);
    setState("idle");
    setError("");
  };

  const submit = async () => {
    setState("submitting");
    try {
      await api.applyToJob(jobCode, coverLetter.trim() || undefined);
      setState("success");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "応募に失敗しました。",
      );
      setState("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={start}
        className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        この求人に応募する
      </button>
      {open && (
        <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
          {state === "success" ? (
            <p className="text-sm font-medium text-green-700">
              応募が完了しました。応募履歴で確認できます。
            </p>
          ) : (
            <>
              <label
                className="block text-xs font-medium text-indigo-900"
                htmlFor={`cover-${jobCode}`}
              >
                カバーレター（任意）
              </label>
              <textarea
                id={`cover-${jobCode}`}
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-indigo-200 bg-white p-2 text-sm"
                placeholder="この求人への意欲や経験を記入してください"
              />
              {state === "error" && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
              )}
              <button
                type="button"
                onClick={() => void submit()}
                disabled={state === "submitting"}
                className="mt-2 w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {state === "submitting" ? "送信中..." : "応募を送信する"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
