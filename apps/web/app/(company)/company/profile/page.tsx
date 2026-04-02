'use client';

import { useState } from 'react';
import { MOCK_COMPANY } from '@/lib/mock/company';

const INDUSTRIES = [
  'IT・SaaS', 'IT・インターネット', 'ゲーム・エンタメ', 'フィンテック',
  'デジタルマーケティング', 'HR Tech', 'EdTech', 'AgriTech',
  'メーカー', '商社', '金融・保険', 'コンサルティング', 'その他',
];

const EMPLOYEE_COUNTS = [
  '1〜10名', '10〜50名', '50〜100名', '100〜300名',
  '300〜1,000名', '1,000〜5,000名', '5,000名以上',
];

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: MOCK_COMPANY.name,
    nameEn: MOCK_COMPANY.nameEn,
    industry: MOCK_COMPANY.industry,
    employeeCount: MOCK_COMPANY.employeeCount,
    founded: String(MOCK_COMPANY.founded),
    prefecture: MOCK_COMPANY.prefecture,
    city: MOCK_COMPANY.city,
    address: MOCK_COMPANY.address,
    websiteUrl: MOCK_COMPANY.websiteUrl,
    description: MOCK_COMPANY.description,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
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
          <h1 className="text-xl font-bold text-gray-900">会社プロフィール</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {MOCK_COMPANY.isVerified
              ? '✓ 認証済み — 求人に会社情報が表示されます'
              : '審査中 — エージェントが内容を確認しています'}
          </p>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">基本情報</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">会社名（日本語）*</label>
              <input name="name" required value={form.name} onChange={handleChange}
                placeholder="株式会社〇〇"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">会社名（英語）</label>
              <input name="nameEn" value={form.nameEn} onChange={handleChange}
                placeholder="Company Inc."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">業界 *</label>
              <select name="industry" value={form.industry} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none">
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">従業員数</label>
              <select name="employeeCount" value={form.employeeCount} onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none">
                {EMPLOYEE_COUNTS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">設立年</label>
              <input type="number" name="founded" value={form.founded} onChange={handleChange}
                min={1900} max={2030} placeholder="2018"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">ウェブサイト</label>
              <input type="url" name="websiteUrl" value={form.websiteUrl} onChange={handleChange}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">所在地</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">都道府県</label>
              <input name="prefecture" value={form.prefecture} onChange={handleChange}
                placeholder="東京都"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">市区町村</label>
              <input name="city" value={form.city} onChange={handleChange}
                placeholder="渋谷区"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-500">住所</label>
              <input name="address" value={form.address} onChange={handleChange}
                placeholder="東京都渋谷区〇〇1-2-3"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">会社概要</h2>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              会社の特徴・魅力 *
              <span className="ml-1 text-gray-400">（求人ページに表示されます）</span>
            </label>
            <textarea name="description" required value={form.description} onChange={handleChange}
              rows={5}
              placeholder="会社のミッション、プロダクトの特徴、働く環境の魅力など..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
            <p className="mt-1 text-right text-xs text-gray-400">{form.description.length}文字</p>
          </div>
        </div>

        {/* Verification notice */}
        {!MOCK_COMPANY.isVerified && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">会社認証が必要です</p>
                <p className="mt-0.5 text-xs text-amber-600">
                  担当エージェント（田中 健太）が会社情報を確認しています。認証完了後、求人が公開されます。
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
