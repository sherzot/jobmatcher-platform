'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth, ROLE_DASHBOARD } from '@/lib/auth/auth-context';

const NAV_LINKS = [
  { href: '/', label: 'ホーム' },
  { href: '/jobs', label: '求人を探す' },
];

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    document.cookie = 'jobmatch_user=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            J
          </div>
          <span className="text-lg font-bold text-gray-900">JobMatch</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={ROLE_DASHBOARD[user.role]}
                className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                ダッシュボード
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                無料登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
