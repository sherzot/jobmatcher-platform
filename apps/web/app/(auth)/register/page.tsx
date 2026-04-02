'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromJob = searchParams.get('from');
  const isApply = searchParams.get('apply') === '1';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    phone: '',
    agreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: candidates always go to /dashboard after registration
    // TODO: replace with real API call → POST /api/auth/register
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-6 text-center">
        {isApply && (
          <div className="mb-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            応募するには無料会員登録が必要です
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900">無料会員登録</h1>
        <p className="mt-1 text-sm text-gray-500">
          すでに登録済みの方は{' '}
          <Link
            href={fromJob ? `/login?from=${fromJob}&apply=${isApply ? 1 : 0}` : '/login'}
            className="font-medium text-indigo-600 hover:underline"
          >
            ログイン
          </Link>
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            <span className={`text-xs ${step === s ? 'font-medium text-indigo-700' : 'text-gray-400'}`}>
              {s === 1 ? 'アカウント' : '基本情報'}
            </span>
            {s < 2 && <div className="h-0.5 w-8 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="8文字以上"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-xs text-gray-400">英字・数字を含む8文字以上</p>
            </div>
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                name="agreed"
                id="agreed"
                checked={form.agreed}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <label htmlFor="agreed" className="text-xs text-gray-500">
                <Link href="#" className="text-indigo-600 hover:underline">利用規約</Link>および
                <Link href="#" className="text-indigo-600 hover:underline">プライバシーポリシー</Link>
                に同意します
              </label>
            </div>
            <button
              type="submit"
              disabled={!form.agreed || !form.email || !form.password}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              次へ → 基本情報入力
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  姓 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="山田"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="太郎"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">姓（フリガナ）</label>
                <input
                  type="text"
                  name="lastNameKana"
                  value={form.lastNameKana}
                  onChange={handleChange}
                  placeholder="ヤマダ"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">名（フリガナ）</label>
                <input
                  type="text"
                  name="firstNameKana"
                  value={form.firstNameKana}
                  onChange={handleChange}
                  placeholder="タロウ"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">電話番号</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="090-0000-0000"
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                戻る
              </button>
              <button
                type="submit"
                disabled={!form.lastName || !form.firstName}
                className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                登録して応募する
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
