"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Job } from "@/lib/api/client";

export default function EditAgentJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    prefecture: "",
    workLocation: "ONSITE",
    jobType: "FULL_TIME",
    japaneseLevel: "NONE",
    skills: "",
    closesAt: "",
    visaSponsorship: false,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .getJob(id)
      .then((data) => {
        setJob(data);
        setForm({
          title: data.title,
          description: data.description,
          salaryMin: String(data.salaryMin ?? ""),
          salaryMax: String(data.salaryMax ?? ""),
          prefecture: data.prefecture ?? "",
          workLocation: data.workLocation,
          jobType: data.jobType,
          japaneseLevel: data.japaneseLevel ?? "NONE",
          skills:
            typeof data.skills === "string"
              ? (JSON.parse(data.skills) as string[]).join(", ")
              : data.skills.join(", "),
          closesAt: data.closesAt ? data.closesAt.slice(0, 10) : "",
          visaSponsorship: data.visaSponsorship,
        });
      })
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "求人情報の取得に失敗しました",
        ),
      );
  }, [id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!job) return;
    setSaving(true);
    try {
      await api.updateJob(job.jobCode ?? job.code ?? id, {
        title: form.title,
        description: form.description,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        prefecture: form.prefecture || undefined,
        workLocation: form.workLocation,
        jobType: form.jobType,
        japaneseLevel: form.japaneseLevel,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        closesAt: form.closesAt || undefined,
        visaSponsorship: form.visaSponsorship,
      });
      router.push(`/agent/jobs/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "求人の更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (error && !job)
    return (
      <div className="m-8 rounded-xl bg-red-50 p-5 text-sm text-red-700">
        {error}
      </div>
    );
  if (!job) return <div className="p-8 text-sm text-gray-500">読み込み中…</div>;

  return (
    <div className="mx-auto max-w-3xl p-6 lg:p-8">
      <Link
        href={`/agent/jobs/${id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← 求人詳細に戻る
      </Link>
      <h1 className="mt-5 text-xl font-bold text-gray-900">求人を編集</h1>
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form
        onSubmit={submit}
        className="mt-5 space-y-5 rounded-xl border border-gray-200 bg-white p-6"
      >
        {(
          [
            ["title", "タイトル", "text"],
            ["description", "仕事内容", "textarea"],
            ["prefecture", "勤務地", "text"],
            ["salaryMin", "最低年収（万円）", "number"],
            ["salaryMax", "最高年収（万円）", "number"],
          ] as const
        ).map(([name, label, type]) => (
          <label key={name} className="block text-sm font-medium text-gray-700">
            {label}
            {type === "textarea" ? (
              <textarea
                required={name === "description"}
                value={form[name]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [name]: e.target.value }))
                }
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            ) : (
              <input
                required={name === "title"}
                type={type}
                value={form[name]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [name]: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            )}
          </label>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["workLocation", "勤務形態", ["ONSITE", "HYBRID", "REMOTE"]],
              ["jobType", "雇用形態", ["FULL_TIME", "PART_TIME", "CONTRACT"]],
              [
                "japaneseLevel",
                "日本語レベル",
                ["NONE", "N3", "N2", "N1", "NATIVE"],
              ],
            ] as const
          ).map(([name, label, options]) => (
            <label
              key={name}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
              <select
                value={form[name]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [name]: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label className="block text-sm font-medium text-gray-700">
          スキル（カンマ区切り）
          <input
            value={form.skills}
            onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={form.visaSponsorship}
            onChange={(e) =>
              setForm((p) => ({ ...p, visaSponsorship: e.target.checked }))
            }
          />
          ビザサポートあり
        </label>
        <button
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "保存中…" : "変更を保存"}
        </button>
      </form>
    </div>
  );
}
