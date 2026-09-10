import type { Job } from "@/lib/api/client";
import type { MockJob } from "@/lib/mock/jobs";

export function toMockJob(job: Job): MockJob {
  const code = job.code ?? job.jobCode ?? "";
  const companyName = job.company?.name ?? "企業情報未設定";
  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
      ? (() => {
          try {
            return JSON.parse(job.skills) as string[];
          } catch {
            return [];
          }
        })()
      : [];
  return {
    id: code,
    code,
    title: job.title,
    company: {
      id: job.company?.companyCode ?? "unknown",
      name: companyName,
      nameEn: companyName,
      logoInitial: companyName.slice(0, 1),
      logoColor: "bg-indigo-600",
      industry: "—",
      employeeCount: "—",
      prefecture: job.company?.prefecture ?? job.prefecture ?? "—",
    },
    jobType: job.jobType as MockJob["jobType"],
    workLocation: job.workLocation as MockJob["workLocation"],
    prefecture: job.prefecture ?? "—",
    city: job.city ?? "—",
    salaryMin: job.salaryMin ?? 0,
    salaryMax: job.salaryMax ?? 0,
    japaneseLevel: (job.japaneseLevel ?? "NONE") as MockJob["japaneseLevel"],
    visaSponsorship: job.visaSponsorship,
    minExperience: job.minExperience ?? 0,
    skills,
    description: job.description ?? "仕事内容の詳細はお問い合わせください。",
    requirements: job.requirements ?? "応募要件は求人詳細をご確認ください。",
    benefits: job.benefits ?? "待遇・給与は求人詳細をご確認ください。",
    publishedAt: job.publishedAt ?? new Date().toISOString(),
    applyCount: 0,
    viewCount: 0,
  };
}
