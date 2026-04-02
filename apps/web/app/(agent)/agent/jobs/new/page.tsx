'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { MOCK_AGENT_COMPANIES } from '@/lib/mock/agent';
import { cn } from '@/lib/utils';

const JOB_TYPES = [
  { value: 'FULL_TIME', label: '正社員' },
  { value: 'CONTRACT', label: '契約社員' },
  { value: 'PART_TIME', label: 'パートタイム' },
  { value: 'INTERNSHIP', label: 'インターン' },
];

const WORK_LOCATIONS = [
  { value: 'ONSITE', label: 'オフィス勤務' },
  { value: 'REMOTE', label: 'フルリモート' },
  { value: 'HYBRID', label: 'ハイブリッド' },
];

const JAPANESE_LEVELS = [
  { value: 'NONE', label: '不問' },
  { value: 'N5', label: 'JLPT N5' },
  { value: 'N4', label: 'JLPT N4' },
  { value: 'N3', label: 'JLPT N3' },
  { value: 'N2', label: 'JLPT N2' },
  { value: 'N1', label: 'JLPT N1' },
  { value: 'BUSINESS', label: 'ビジネスレベル' },
  { value: 'NATIVE', label: 'ネイティブ' },
];

function NewJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCompanyId = searchParams.get('companyId') ?? '';

  const [step, setStep] = useState<'select-company' | 'fill-form'>(
    preselectedCompanyId ? 'fill-form' : 'select-company',
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState(preselectedCompanyId);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    jobType: 'FULL_TIME',
    workLocation: 'HYBRID',
    prefecture: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    japaneseLevel: 'NONE',
    visaSponsorship: false,
    minExperience: '',
    skills: [] as string[],
    description: '',
    requirements: '',
    benefits: '',
    publishNow: false,
  });

  const selectedCompany = MOCK_AGENT_COMPANIES.find(c => c.id === selectedCompanyId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm(f => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: redirect back to jobs list
    router.push('/agent/jobs');
  };

  // ── Step 1: Company selection ─────────────────────────────

  if (step === 'select-company') {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <Link href="/agent/jobs" className="mb-3 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            求人一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-900">求人を作成</h1>
          <p className="mt-1 text-sm text-gray-500">
            まず求人を掲載する企業を選択してください
          </p>
        </div>

        {/* Important note */}
        <div className="mb-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">求人は必ず企業に紐づけます</p>
            <p className="mt-0.5 text-xs text-blue-600">
              あなたが担当する企業の求人のみ作成できます。新しい企業を追加する場合は先に「担当企業」から登録してください。
            </p>
          </div>
        </div>

        {/* Company grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_AGENT_COMPANIES.filter(c => c.isActive).map((company) => (
            <button
              key={company.id}
              onClick={() => {
                setSelectedCompanyId(company.id);
                setStep('fill-form');
              }}
              className={cn(
                'group rounded-xl border-2 bg-white p-5 text-left transition-all hover:border-violet-400 hover:shadow-md',
                selectedCompanyId === company.id
                  ? 'border-violet-500'
                  : 'border-gray-200',
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white',
                  company.logoColor,
                )}>
                  {company.logoInitial}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-violet-700">{company.name}</p>
                  <p className="text-xs text-gray-400">{company.industry}</p>
                  <p className="text-xs text-gray-400">{company.prefecture} · {company.employeeCount}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>既存求人: {company.activeJobCount}件</span>
                {company.isVerified && (
                  <span className="text-green-600">✓ 認証済</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {MOCK_AGENT_COMPANIES.filter(c => c.isActive).length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-400">担当企業がありません</p>
            <Link href="/agent/companies" className="mt-2 inline-block text-sm font-medium text-violet-600 hover:underline">
              企業を追加する →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // ── Step 2: Job form ─────────────────────────────────────

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <button
          onClick={() => setStep('select-company')}
          className="mb-3 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          企業選択に戻る
        </button>
        <h1 className="text-xl font-bold text-gray-900">求人を作成</h1>
      </div>

      {/* Selected company banner */}
      {selectedCompany && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
          <div className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
            selectedCompany.logoColor,
          )}>
            {selectedCompany.logoInitial}
          </div>
          <div>
            <p className="text-sm font-semibold text-violet-900">{selectedCompany.name}</p>
            <p className="text-xs text-violet-600">{selectedCompany.industry} · {selectedCompany.prefecture}</p>
          </div>
          <button
            onClick={() => setStep('select-company')}
            className="ml-auto text-xs text-violet-500 underline hover:text-violet-700"
          >
            変更
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">求人タイトル *</label>
              <input name="title" required value={form.title} onChange={handleChange}
                placeholder="例: シニアフロントエンドエンジニア（React/TypeScript）"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">雇用形態 *</label>
                <select name="jobType" value={form.jobType} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none">
                  {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">勤務スタイル *</label>
                <select name="workLocation" value={form.workLocation} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none">
                  {WORK_LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">都道府県</label>
                <input name="prefecture" value={form.prefecture} onChange={handleChange}
                  placeholder="東京都"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">市区町村</label>
                <input name="city" value={form.city} onChange={handleChange}
                  placeholder="渋谷区"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Salary & Requirements */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">条件・要件</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">年収下限（万円）</label>
              <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                placeholder="500"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">年収上限（万円）</label>
              <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
                placeholder="900"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">日本語レベル</label>
              <select name="japaneseLevel" value={form.japaneseLevel} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none">
                {JAPANESE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">最低経験年数</label>
              <input type="number" name="minExperience" value={form.minExperience} onChange={handleChange}
                min={0} placeholder="3"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="visaSponsorship" name="visaSponsorship"
                checked={form.visaSponsorship} onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-violet-600" />
              <label htmlFor="visaSponsorship" className="text-sm text-gray-600">
                ビザサポートあり（外国籍候補者向けに表示されます）
              </label>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-gray-500">必要スキル</label>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="スキルを入力（例: React）"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none"
              />
              <button type="button" onClick={addSkill}
                className="rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-700">
                追加
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.skills.map(skill => (
                  <span key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-violet-50 pl-3 pr-2 py-1 text-sm font-medium text-violet-700">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}
                      className="text-violet-300 hover:text-violet-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">求人詳細</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">仕事内容 *</label>
              <textarea name="description" required value={form.description} onChange={handleChange}
                rows={6} placeholder="業務内容、チームの雰囲気、求める人物像など..."
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">応募要件</label>
              <textarea name="requirements" value={form.requirements} onChange={handleChange}
                rows={4} placeholder="必須要件・歓迎要件..."
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">待遇・福利厚生</label>
              <textarea name="benefits" value={form.benefits} onChange={handleChange}
                rows={3} placeholder="給与・休暇・リモートワーク制度など..."
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Publish option */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <label className="flex items-start gap-3">
            <input type="checkbox" name="publishNow" checked={form.publishNow} onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">作成後すぐに公開する</p>
              <p className="text-xs text-gray-400">チェックを外すと下書きとして保存されます</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/agent/jobs"
            className="flex-1 rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
            キャンセル
          </Link>
          <button type="submit"
            className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700">
            {form.publishNow ? '作成して公開する' : '下書きとして保存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewJobPage() {
  return (
    <Suspense>
      <NewJobForm />
    </Suspense>
  );
}
