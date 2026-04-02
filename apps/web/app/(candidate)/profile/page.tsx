'use client';

import { useState } from 'react';
import { MOCK_USER } from '@/lib/mock/user';

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

const VISA_STATUSES = [
  { value: 'NOT_REQUIRED', label: '不要' },
  { value: 'ALREADY_HAVE', label: 'ビザ取得済み' },
  { value: 'SPONSORED', label: 'スポンサー必要' },
  { value: 'SELF_SPONSORED', label: '自費スポンサー' },
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    lastName: MOCK_USER.lastName,
    firstName: MOCK_USER.firstName,
    lastNameKana: MOCK_USER.lastNameKana,
    firstNameKana: MOCK_USER.firstNameKana,
    prefecture: MOCK_USER.prefecture,
    city: MOCK_USER.city,
    japaneseLevel: MOCK_USER.japaneseLevel,
    visaStatus: MOCK_USER.visaStatus,
    yearsOfExperience: MOCK_USER.yearsOfExperience,
    desiredSalaryMin: MOCK_USER.desiredSalaryMin,
    desiredSalaryMax: MOCK_USER.desiredSalaryMax,
    isOpenToWork: MOCK_USER.isOpenToWork,
    motivation: '',
    approach: '',
    strengths: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">基本情報</h1>
          <p className="mt-0.5 text-sm text-gray-500">あなたの基本プロフィール情報</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            保存しました
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">氏名</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">姓 *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">名 *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">姓（フリガナ）</label>
              <input name="lastNameKana" value={form.lastNameKana} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">名（フリガナ）</label>
              <input name="firstNameKana" value={form.firstNameKana} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">居住地</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">都道府県</label>
              <input name="prefecture" value={form.prefecture} onChange={handleChange}
                placeholder="東京都"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">市区町村</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="渋谷区"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Language & Visa */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">言語・ビザ</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">日本語レベル</label>
              <select name="japaneseLevel" value={form.japaneseLevel} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none">
                {JAPANESE_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">ビザ状況</label>
              <select name="visaStatus" value={form.visaStatus} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none">
                {VISA_STATUSES.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Work preferences */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">希望条件</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">経験年数</label>
              <input type="number" name="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange}
                min={0} max={50}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">希望年収（最低）</label>
                <div className="relative">
                  <input type="number" name="desiredSalaryMin" value={form.desiredSalaryMin} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm focus:border-indigo-400 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">万円</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">希望年収（最高）</label>
                <div className="relative">
                  <input type="number" name="desiredSalaryMax" value={form.desiredSalaryMax} onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pr-10 text-sm focus:border-indigo-400 focus:outline-none" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">万円</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" id="openToWork" name="isOpenToWork"
              checked={form.isOpenToWork}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <label htmlFor="openToWork" className="text-sm text-gray-600">現在求職中（エージェントに表示される）</label>
          </div>
        </div>

        {/* Motivation */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">自己PR・志望動機</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">志望動機</label>
              <textarea name="motivation" value={form.motivation} onChange={handleChange} rows={3}
                placeholder="どのような理由でこの業界・職種を希望しているか..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">取り組み方・アプローチ</label>
              <textarea name="approach" value={form.approach} onChange={handleChange} rows={3}
                placeholder="仕事への取り組み方、考え方..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">強み</label>
              <textarea name="strengths" value={form.strengths} onChange={handleChange} rows={3}
                placeholder="あなたの強み・得意なこと..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
