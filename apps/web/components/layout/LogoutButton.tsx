'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Clear middleware cookie
    document.cookie = 'jobmatch_user=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className={className}>
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      ログアウト
    </button>
  );
}
