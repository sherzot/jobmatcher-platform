"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_COMPANY, MOCK_MESSAGES } from "@/lib/mock/company";
import { LogoutButton } from "@/components/layout/LogoutButton";

const NAV_ITEMS = [
  {
    href: "/company/dashboard",
    label: "ダッシュボード",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/company/jobs",
    label: "求人管理",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    href: "/company/messages",
    label: "エージェントと連絡",
    badge: MOCK_MESSAGES.filter((m) => !m.isRead && m.senderId === "agent")
      .length,
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    href: "/company/profile",
    label: "会社プロフィール",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
];

export function CompanySidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-[#10233f] text-white">
      {/* Logo */}
      <div className="flex h-[74px] items-center gap-2 border-b border-white/10 px-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-sm font-bold text-[#10233f]">
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#c9233f]" />
          J
        </div>
        <div>
          <span className="text-[19px] font-semibold tracking-[-0.03em] text-white">
            JobMatch
          </span>
          <span className="ml-1.5 rounded-full bg-[#1456d9] px-1.5 py-0.5 text-xs font-medium text-white">
            Company
          </span>
        </div>
      </div>

      {/* Company info */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0b429] text-base font-bold text-[#10233f]",
            )}
          >
            {MOCK_COMPANY.logoInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {MOCK_COMPANY.name}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs text-[#b7c7dc]">
                {MOCK_COMPANY.code}
              </p>
              {MOCK_COMPANY.isVerified && (
                <span className="shrink-0 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-xs text-emerald-300">
                  認証済
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#f0b429] bg-white/10 text-white"
                  : "border-transparent text-[#b7c7dc] hover:bg-white/10 hover:text-white",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={isActive ? "text-[#f0b429]" : "text-[#7f94b2]"}
                >
                  {item.icon}
                </span>
                {item.label}
              </div>
              {item.badge ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/jobs"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#b7c7dc] transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg
            className="h-5 w-5 text-[#7f94b2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          求人サイトを見る
        </Link>
        <LogoutButton className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#b7c7dc] transition-colors hover:bg-white/10 hover:text-white" />
      </div>
    </aside>
  );
}
