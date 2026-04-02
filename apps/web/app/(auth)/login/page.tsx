'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth, ROLE_DASHBOARD } from '@/lib/auth/auth-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(form.email, form.password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? 'ログインに失敗しました');
      return;
    }

    // Read role from localStorage to determine redirect
    try {
      const stored = localStorage.getItem('jobmatch_user');
      if (stored) {
        const user = JSON.parse(stored);
        // Also set cookie for middleware
        document.cookie = `jobmatch_user=${JSON.stringify({ role: user.role })}; path=/; max-age=86400`;
        const destination = redirect ?? ROLE_DASHBOARD[user.role as keyof typeof ROLE_DASHBOARD];
        router.push(destination);
        return;
      }
    } catch {
      // fallback
    }
    router.push('/jobs');
  };

  const fillDemo = (email: string, password: string) => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">ログイン</h1>
        <p className="mt-1 text-sm text-gray-500">
          まだ登録していない方は{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline">
            無料会員登録
          </Link>
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              メールアドレス
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">パスワード</label>
              <Link href="#" className="text-xs text-indigo-600 hover:underline">
                パスワードを忘れた方
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-5">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-3">デモアカウント</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Admin', email: 'admin@jobmatch.com', password: 'admin123', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
              { label: 'Agent', email: 'agent@jobmatch.com', password: 'agent123', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Company', email: 'company@jobmatch.com', password: 'company123', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'Candidate', email: 'user@jobmatch.com', password: 'user123', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            ].map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() => fillDemo(account.email, account.password)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${account.color}`}
              >
                {account.label}でログイン
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
