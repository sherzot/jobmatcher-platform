'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_AGENT_COMPANIES, AgentCompany } from '@/lib/mock/agent';
import { cn, formatDate } from '@/lib/utils';

export default function AgentCompaniesPage() {
  const [companies, setCompanies] = useState<AgentCompany[]>(MOCK_AGENT_COMPANIES);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AgentCompany | null>(null);
  const [form, setForm] = useState({
    name: '', nameEn: '', industry: '', employeeCount: '',
    prefecture: '', city: '', websiteUrl: '', description: '',
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: '', nameEn: '', industry: '', employeeCount: '', prefecture: '', city: '', websiteUrl: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (company: AgentCompany) => {
    setEditTarget(company);
    setForm({
      name: company.name, nameEn: company.nameEn, industry: company.industry,
      employeeCount: company.employeeCount, prefecture: company.prefecture,
      city: company.city, websiteUrl: company.websiteUrl, description: company.description,
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTarget) {
      setCompanies(companies.map(c => c.id === editTarget.id ? { ...c, ...form } : c));
    } else {
      const newCompany: AgentCompany = {
        id: Date.now().toString(),
        code: `C000000${companies.length + 10}`,
        logoInitial: form.name.charAt(0),
        logoColor: ['bg-blue-600', 'bg-emerald-600', 'bg-orange-500', 'bg-violet-600', 'bg-pink-500'][companies.length % 5],
        isVerified: false,
        isActive: true,
        activeJobCount: 0,
        totalApplications: 0,
        createdAt: new Date().toISOString().split('T')[0],
        ...form,
      };
      setCompanies([...companies, newCompany]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">担当企業</h1>
          <p className="mt-0.5 text-sm text-gray-500">{companies.length}社管理中</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          企業を追加
        </button>
      </div>

      {/* Company cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className={cn(
            'rounded-xl border bg-white p-5 transition-all',
            company.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60',
          )}>
            {/* Company header */}
            <div className="flex items-start gap-3">
              <div className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white',
                company.logoColor,
              )}>
                {company.logoInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">{company.name}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    {company.isVerified ? (
                      <span className="rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-600">認証済</span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">審査中</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400">{company.nameEn}</p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {company.prefecture} {company.city}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
                {company.industry} · {company.employeeCount}
              </div>
            </div>

            <p className="mt-2 line-clamp-2 text-xs text-gray-400">{company.description}</p>

            {/* Stats */}
            <div className="mt-3 flex items-center gap-4 rounded-lg bg-gray-50 px-3 py-2 text-xs">
              <div>
                <span className="font-semibold text-violet-600">{company.activeJobCount}</span>
                <span className="ml-1 text-gray-400">求人</span>
              </div>
              <div>
                <span className="font-semibold text-violet-600">{company.totalApplications}</span>
                <span className="ml-1 text-gray-400">応募</span>
              </div>
              <div className="ml-auto text-gray-300">
                登録: {formatDate(company.createdAt)}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <Link
                href="/agent/jobs/new"
                className="flex-1 rounded-lg bg-violet-50 py-1.5 text-center text-xs font-medium text-violet-700 hover:bg-violet-100"
              >
                + 求人作成
              </Link>
              <button
                onClick={() => openEdit(company)}
                className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                編集
              </button>
              <button
                onClick={() => toggleActive(company.id)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  company.isActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100',
                )}
              >
                {company.isActive ? '停止' : '有効化'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editTarget ? '企業情報を編集' : '新しい企業を追加'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-500">会社名 *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="株式会社〇〇"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">英語社名</label>
                  <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                    placeholder="Company Inc."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">業界 *</label>
                  <input required value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    placeholder="IT・SaaS"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">従業員数</label>
                  <input value={form.employeeCount} onChange={e => setForm(f => ({ ...f, employeeCount: e.target.value }))}
                    placeholder="50〜100名"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">都道府県</label>
                  <input value={form.prefecture} onChange={e => setForm(f => ({ ...f, prefecture: e.target.value }))}
                    placeholder="東京都"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">市区町村</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="渋谷区"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-500">ウェブサイト</label>
                  <input type="url" value={form.websiteUrl} onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-500">会社概要</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="会社の特徴・魅力..."
                    className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  キャンセル
                </button>
                <button type="submit"
                  className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
                  {editTarget ? '更新する' : '追加する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
