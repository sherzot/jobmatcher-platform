"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, ROLE_DASHBOARD } from "@/lib/auth/auth-context";

const NAV_LINKS = [
  { href: "/", label: "ホーム" },
  { href: "/jobs", label: "求人を探す" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    document.cookie = "jobmatch_user=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce3ed] bg-[#f7f8f6]/95 backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#10233f] text-sm font-bold text-white shadow-sm">
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#c9233f]" />
            J
          </div>
          <span className="text-[19px] font-semibold tracking-[-0.03em] text-[#10233f]">
            JobMatch
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-semibold transition-colors",
                pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-[#1456d9]"
                  : "text-[#52627a] hover:text-[#10233f]",
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
                className="rounded-full border border-[#cbd8ea] px-4 py-2 text-[13px] font-semibold text-[#1456d9] transition-colors hover:bg-[#eaf0fb]"
              >
                ダッシュボード
              </Link>
              <button
                onClick={handleLogout}
                className="text-[13px] font-semibold text-[#65748a] hover:text-[#10233f]"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-semibold text-[#52627a] hover:text-[#10233f]"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#1456d9] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(20,86,217,0.2)] transition-colors hover:bg-[#0f46b5]"
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
