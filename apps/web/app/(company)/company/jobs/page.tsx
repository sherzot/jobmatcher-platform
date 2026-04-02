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

// ── Job form types ────────────────────────────────────────────

interface JobFormData {
  title: string;
  jobType: string;
  workLocation: string;
  prefecture: string;
  salaryMin: string;
  salaryMax: string;
  japaneseLevel: string;
  visaSponsorship: boolean;
  skillInput: string;
  skills: string[];
}

const EMPTY_FORM: JobFormData = {
  title: '',
  jobType: 'FULL_TIME',
  workLocation: 'HYBRID',
  prefecture: '東京都',
  salaryMin: '',
  salaryMax: '',
  japaneseLevel: 'N2',
  visaSponsorship: false,
  skillInput: '',
  skills: [],
};

const JOB_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: '正社員' },
  { value: 'PART_TIME', label: 'パート・アルバイト' },
  { value: 'CONTRACT', label: '契約社員' },
  { value: 'FREELANCE', label: 'フリーランス' },
];

const WORK_LOCATION_OPTIONS = [
  { value: 'ONSITE', label: 'オフィス勤務' },
  { value: 'REMOTE', label: 'リモート' },
  { value: 'HYBRID', label: 'ハイブリッド' },
];

const JAPANESE_LEVEL_OPTIONS = [
  { value: 'NONE', label: '不問' },
  { value: 'N5', label: 'N5' },
  { value: 'N4', label: 'N4' },
  { value: 'N3', label: 'N3' },
  { value: 'N2', label: 'N2' },
  { value: 'N1', label: 'N1' },
  { value: 'BUSINESS', label: 'ビジネス' },
  { value: 'NATIVE', label: 'ネイティブ' },
];

// ── Job form modal ────────────────────────────────────────────

function JobFormModal({
  mode,
  initialData,
  onClose,
  onSave,
}: {
  mode: 'create' | 'edit';
  initialData: JobFormData;
  onClose: () => void;
  onSave: (data: JobFormData) => void;
}) {
  const [form, setForm] = useState<JobFormData>(initialData);

  const set = (key: keyof JobFormData, value: string | boolean | string[]) =>
    setForm(f => ({ ...f, [key]: value }));

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s], skillInput: '' }));
    }
  };

  const removeSkill = (s: string) =>
    setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {mode === 'create' ? '新規求人を作成' : '求人を編集'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">求人タイトル *</label>
            <input
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="例：シニアフロントエンドエンジニア"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Job type + Work location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">雇用形態</label>
              <select
                value={form.jobType}
                onChange={e => set('jobType', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              >
                {JOB_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">勤務形態</label>
              <select
                value={form.workLocation}
                onChange={e => set('workLocation', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              >
                {WORK_LOCATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Prefecture */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">勤務地（都道府県）</label>
            <input
              value={form.prefecture}
              onChange={e => set('prefecture', e.target.value)}
              placeholder="東京都"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">年収下限（万円）</label>
              <input
                type="number"
                min={100}
                max={5000}
                value={form.salaryMin}
                onChange={e => set('salaryMin', e.target.value)}
                placeholder="500"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">年収上限（万円）</label>
              <input
                type="number"
                min={100}
                max={5000}
                value={form.salaryMax}
                onChange={e => set('salaryMax', e.target.value)}
                placeholder="800"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Japanese level + Visa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">日本語レベル</label>
              <select
                value={form.japaneseLevel}
                onChange={e => set('japaneseLevel', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              >
                {JAPANESE_LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.visaSponsorship}
                  onChange={e => set('visaSponsorship', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                ビザサポートあり
              </label>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">必要スキル</label>
            <div className="flex gap-2">
              <input
                value={form.skillInput}
                onChange={e => set('skillInput', e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="例：React"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                追加
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 rounded-full bg-blue-100 pl-2.5 pr-1.5 py-1 text-xs font-medium text-blue-700">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {mode === 'create' ? '下書きとして保存' : '変更を保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<CompanyJob[]>(MOCK_COMPANY_JOBS);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; jobId?: string } | null>(null);

  const activeCount = jobs.filter(j => j.status === 'ACTIVE').length;
  const draftCount  = jobs.filter(j => j.status === 'DRAFT').length;
  const pausedCount = jobs.filter(j => j.status === 'PAUSED').length;

  const toggleStatus = (id: string, current: CompanyJobStatus) => {
    const next: CompanyJobStatus =
      current === 'ACTIVE' ? 'PAUSED' :
      current === 'PAUSED' ? 'ACTIVE' :
      current === 'DRAFT'  ? 'ACTIVE' : current;
    setJobs(jobs.map(j =>
      j.id === id
        ? { ...j, status: next, publishedAt: next === 'ACTIVE' && !j.publishedAt ? new Date().toISOString().split('T')[0] : j.publishedAt }
        : j,
    ));
  };

  const getModalInitialData = (): JobFormData => {
    if (!modal || modal.mode === 'create') return EMPTY_FORM;
    const job = jobs.find(j => j.id === modal.jobId);
    if (!job) return EMPTY_FORM;
    return {
      title: job.title,
      jobType: job.jobType,
      workLocation: job.workLocation,
      prefecture: job.prefecture,
      salaryMin: String(job.salaryMin),
      salaryMax: String(job.salaryMax),
      japaneseLevel: job.japaneseLevel,
      visaSponsorship: job.visaSponsorship,
      skillInput: '',
      skills: [...job.skills],
    };
  };

  const handleSave = (data: JobFormData) => {
    if (!modal) return;

    if (modal.mode === 'create') {
      const newJob: CompanyJob = {
        id: String(Date.now()),
        code: `J${String(jobs.length + 13).padStart(7, '0')}`,
        title: data.title,
        jobType: data.jobType,
        workLocation: data.workLocation,
        prefecture: data.prefecture,
        salaryMin: Number(data.salaryMin) || 0,
        salaryMax: Number(data.salaryMax) || 0,
        japaneseLevel: data.japaneseLevel,
        visaSponsorship: data.visaSponsorship,
        skills: data.skills,
        status: 'DRAFT',
        applicationCount: 0,
        newApplicationCount: 0,
        viewCount: 0,
        publishedAt: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setJobs(prev => [...prev, newJob]);
    } else {
      setJobs(prev =>
        prev.map(j =>
          j.id === modal.jobId
            ? {
                ...j,
                title: data.title,
                jobType: data.jobType,
                workLocation: data.workLocation,
                prefecture: data.prefecture,
                salaryMin: Number(data.salaryMin) || j.salaryMin,
                salaryMax: Number(data.salaryMax) || j.salaryMax,
                japaneseLevel: data.japaneseLevel,
                visaSponsorship: data.visaSponsorship,
                skills: data.skills,
              }
            : j,
        ),
      );
    }
    setModal(null);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">求人管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {jobs.length}件 — 公開中 {activeCount} · 下書き {draftCount} · 停止中 {pausedCount}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規求人を作成
        </button>
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
                  {job.skills.length > 3 && (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400">+{job.skills.length - 3}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-5 text-xs text-gray-400">
                  <span className="font-semibold text-blue-600">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  <span>応募: <strong className="text-gray-700">{job.applicationCount}名</strong></span>
                  <span>閲覧: <strong className="text-gray-700">{job.viewCount}回</strong></span>
                  {job.publishedAt && <span>公開: {job.publishedAt}</span>}
                </div>
              </div>

              {/* Right controls */}
              <div className="flex shrink-0 items-center gap-2">
                {/* Edit button */}
                <button
                  onClick={() => setModal({ mode: 'edit', jobId: job.id })}
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  title="編集"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Status toggle */}
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <JobFormModal
          mode={modal.mode}
          initialData={getModalInitialData()}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
