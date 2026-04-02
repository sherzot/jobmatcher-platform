'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/jobs" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            J
          </div>
          <span className="text-lg font-bold text-gray-900">JobMatch</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/jobs"
            className={cn(
              'text-sm font-medium transition-colors',
              pathname.startsWith('/jobs')
                ? 'text-indigo-600'
                : 'text-gray-600 hover:text-gray-900',
            )}
          >
            求人を探す
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            無料登録
          </Link>
        </div>
      </div>
    </header>
  );
}
