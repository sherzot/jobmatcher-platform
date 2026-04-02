'use client';

import { useState } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { JobCard } from '@/components/jobs/JobCard';
import { MOCK_JOBS, JOB_TYPE_LABELS, WORK_LOCATION_LABELS } from '@/lib/mock/jobs';

const PREFECTURES = ['すべて', '東京都', '大阪府', '神奈川県', '愛知県', '福岡県', 'リモート'];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('すべて');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [visaOnly, setVisaOnly] = useState(false);
  const [japaneseNotRequired, setJapaneseNotRequired] = useState(false);

  const filtered = MOCK_JOBS.filter((job) => {
    if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
        !job.company.name.includes(search) &&
        !job.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    if (selectedPrefecture !== 'すべて' && job.prefecture !== selectedPrefecture) return false;
    if (selectedType && job.jobType !== selectedType) return false;
    if (selectedLocation && job.workLocation !== selectedLocation) return false;
    if (visaOnly && !job.visaSponsorship) return false;
    if (japaneseNotRequired && job.japaneseLevel !== 'NONE') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      {/* Hero search */}
      <div className="bg-indigo-700 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="mb-2 text-center text-2xl font-bold text-white">
            日本・ウズベキスタンの求人を探す
          </h1>
          <p className="mb-6 text-center text-sm text-indigo-200">
            {MOCK_JOBS.length}件の求人が見つかりました
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="職種、スキル、会社名で検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-0 py-3.5 pl-5 pr-12 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">絞り込み</h2>

              {/* Prefecture */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-gray-500">勤務地</label>
                <div className="space-y-1.5">
                  {PREFECTURES.map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setSelectedPrefecture(pref)}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        selectedPrefecture === pref
                          ? 'bg-indigo-50 font-medium text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job type */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-gray-500">雇用形態</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedType('')}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      !selectedType ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    すべて
                  </button>
                  {Object.entries(JOB_TYPE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedType(key)}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        selectedType === key ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work location */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium text-gray-500">勤務スタイル</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedLocation('')}
                    className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                      !selectedLocation ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    すべて
                  </button>
                  {Object.entries(WORK_LOCATION_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedLocation(key)}
                      className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                        selectedLocation === key ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-600">ビザサポートあり</span>
                  <button
                    onClick={() => setVisaOnly(!visaOnly)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      visaOnly ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      visaOnly ? 'translate-x-4.5' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-sm text-gray-600">日本語不問</span>
                  <button
                    onClick={() => setJapaneseNotRequired(!japaneseNotRequired)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      japaneseNotRequired ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      japaneseNotRequired ? 'translate-x-4.5' : 'translate-x-1'
                    }`} />
                  </button>
                </label>
              </div>
            </div>
          </aside>

          {/* Job list */}
          <main className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{filtered.length}件</span>の求人
              </p>
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-600 focus:outline-none">
                <option>新着順</option>
                <option>年収高い順</option>
                <option>応募数順</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                <p className="text-gray-500">条件に合う求人が見つかりませんでした</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedPrefecture('すべて');
                    setSelectedType('');
                    setSelectedLocation('');
                    setVisaOnly(false);
                    setJapaneseNotRequired(false);
                  }}
                  className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
                >
                  検索条件をリセット
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
