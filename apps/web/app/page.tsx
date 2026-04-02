'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { MOCK_JOBS } from '@/lib/mock/jobs';

const STATS = [
  { value: '5,200+', label: '公開求人数', sublabel: '毎週更新' },
  { value: '320+', label: '掲載企業', sublabel: '日本・ウズベキスタン' },
  { value: '12,800+', label: '登録者数', sublabel: '求職者・候補者' },
  { value: '94%', label: '内定率', sublabel: 'AI マッチング利用者' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: '無料登録',
    desc: 'メールアドレスだけで30秒で登録完了。履歴書は後から入力できます。',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    step: '02',
    title: 'プロフィール入力',
    desc: '学歴・職歴・スキルを入力。PDF履歴書のアップロードでAIが自動入力します。',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    step: '03',
    title: 'AIマッチング',
    desc: 'あなたの経験とスキルに合った求人をAIが自動でレコメンドします。',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    step: '04',
    title: 'エージェントと相談',
    desc: '専任エージェントがサポート。面接準備から内定まで一貫してサポートします。',
    color: 'bg-green-50 text-green-600',
  },
];

const TESTIMONIALS = [
  {
    name: 'Bobur Yusupov',
    role: 'ソフトウェアエンジニア',
    company: '東京 IT 企業',
    avatar: 'B',
    avatarColor: 'bg-indigo-500',
    text: 'ウズベキスタンから日本へ転職を考えていましたが、JobMatchのエージェントが全てサポートしてくれました。ビザの手続きから面接対策まで、本当に助かりました。',
  },
  {
    name: '田中 美咲',
    role: 'プロダクトマネージャー',
    company: '大阪スタートアップ',
    avatar: '田',
    avatarColor: 'bg-pink-500',
    text: 'AIマッチングの精度に驚きました。自分では気づかなかった求人を提案してくれて、希望年収より20%高いオファーをもらえました。',
  },
  {
    name: 'Kamol Rashidov',
    role: 'インフラエンジニア',
    company: 'リモートワーク',
    avatar: 'K',
    avatarColor: 'bg-emerald-500',
    text: '日本語ができなくても応募できる求人が多く、英語・ロシア語対応のエージェントが丁寧にサポートしてくれました。今はフルリモートで働いています。',
  },
];

const FEATURED_CATEGORIES = [
  { label: 'IT・エンジニア', count: 1240, icon: '💻' },
  { label: 'データサイエンス', count: 340, icon: '📊' },
  { label: 'デザイン', count: 280, icon: '🎨' },
  { label: 'マーケティング', count: 190, icon: '📣' },
  { label: '製造・工場', count: 870, icon: '🏭' },
  { label: '医療・介護', count: 560, icon: '🏥' },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  const newJobs = MOCK_JOBS.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 py-20">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            日本・ウズベキスタン ✕ AIマッチング
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            あなたのキャリアを、<br />
            <span className="text-indigo-200">AIが最適化する。</span>
          </h1>
          <p className="mb-8 text-lg text-indigo-200">
            日本とウズベキスタンをつなぐ求人プラットフォーム。<br />
            スキルと経験をもとに、あなたに合った仕事をAIが提案します。
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="flex overflow-hidden rounded-2xl bg-white shadow-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="職種、スキル、会社名で検索..."
                className="flex-1 px-5 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="m-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                検索する
              </button>
            </div>
            <p className="mt-3 text-sm text-indigo-300">
              人気タグ：
              {['React', 'Python', 'リモート', 'ビザサポート', '日本語不問'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/jobs?q=${tag}`)}
                  className="ml-2 rounded-full bg-white/10 px-2.5 py-0.5 text-indigo-100 transition-colors hover:bg-white/20"
                >
                  {tag}
                </button>
              ))}
            </p>
          </form>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-indigo-600">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/jobs?category=${encodeURIComponent(cat.label)}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-indigo-300 hover:shadow-sm"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-gray-800">{cat.label}</span>
                <span className="text-xs text-gray-400">{cat.count.toLocaleString()}件</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Jobs ── */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">新着求人</h2>
              <p className="mt-1 text-sm text-gray-500">最新の求人情報をお届けします</p>
            </div>
            <Link
              href="/jobs"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              すべて見る →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-base font-bold text-indigo-600">
                    {job.company.name.charAt(0)}
                  </div>
                  {job.visaSponsorship && (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      ビザサポート
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 line-clamp-2">
                  {job.title}
                </h3>
                <p className="mb-3 text-xs text-gray-500">{job.company.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{job.prefecture}</span>
                  {job.salaryMax && (
                    <span className="text-xs font-semibold text-indigo-600">
                      〜{(job.salaryMax / 10000).toFixed(0)}万円
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">ご利用の流れ</h2>
          <p className="mb-10 text-center text-sm text-gray-500">
            登録から内定まで、最短3分でスタートできます
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-xl bg-white p-6 shadow-sm">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="mb-2 text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">利用者の声</h2>
          <p className="mb-10 text-center text-sm text-gray-500">
            JobMatchで夢を実現した方々のストーリー
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${t.avatarColor}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role} · {t.company}</p>
                  </div>
                </div>
                <div className="mb-3 flex text-yellow-400">
                  {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                </div>
                <p className="text-xs leading-relaxed text-gray-600">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Companies ── */}
      <section className="border-t border-gray-100 bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
            <div className="flex flex-col items-center gap-8 p-8 sm:flex-row sm:p-10">
              <div className="flex-1 text-center sm:text-left">
                <span className="mb-3 inline-block rounded-full bg-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-100">
                  企業様向け
                </span>
                <h2 className="mb-3 text-2xl font-bold text-white">
                  優秀な人材を採用しませんか？
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-blue-200">
                  JobMatchでは、日本・ウズベキスタンの優秀な人材とつながることができます。
                  専任エージェントがサポートし、審査・マッチングから面接設定まで一括対応。
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                  <div className="flex items-center gap-1.5 text-xs text-blue-200">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    専任エージェントサポート
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-200">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AIマッチングで効率採用
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-blue-200">
                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    ビザ・外国人採用対応
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-3">
                <Link
                  href="/register/company"
                  className="w-full rounded-xl bg-white px-8 py-3.5 text-center text-sm font-bold text-blue-700 shadow-md transition-all hover:shadow-lg sm:w-auto"
                >
                  企業登録する（無料）
                </Link>
                <p className="text-xs text-blue-300">エージェントの審査後に採用活動開始</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            今すぐキャリアをスタートしよう
          </h2>
          <p className="mb-8 text-indigo-200">
            無料登録で、AIがあなたに合った求人を自動でマッチングします。
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:shadow-xl sm:w-auto"
            >
              無料で会員登録する
            </Link>
            <Link
              href="/jobs"
              className="w-full rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              求人を見る
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">J</div>
              <span className="text-sm font-bold text-gray-900">JobMatch Platform</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
              <Link href="#" className="hover:text-gray-700">利用規約</Link>
              <Link href="#" className="hover:text-gray-700">プライバシーポリシー</Link>
              <Link href="#" className="hover:text-gray-700">お問い合わせ</Link>
            </div>
            <p className="text-xs text-gray-400">© 2026 JobMatch Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
