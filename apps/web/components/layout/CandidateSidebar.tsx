"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/lib/mock/user";
import { LogoutButton } from "@/components/layout/LogoutButton";

const NAV_ITEMS = [
  {
    href: "/dashboard",
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
    href: "/applications",
    label: "応募履歴",
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "基本情報",
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    href: "/resume",
    label: "履歴書・職務経歴書",
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    href: "/jobs",
    label: "求人を探す",
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    href: "/messages",
    label: "メッセージ",
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
];

export function CandidateSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#dce3ed] bg-[#10233f] text-white">
      {/* Logo */}
      <div className="flex h-[74px] items-center gap-2 border-b border-white/10 px-6">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-sm font-bold text-[#10233f]">
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#c9233f]" />
          J
        </div>
        <span className="text-[19px] font-semibold tracking-[-0.03em] text-white">
          JobMatch
        </span>
      </div>

      {/* User info */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full bg-[#f0b429] text-sm font-bold text-[#10233f]",
            )}
          >
            {MOCK_USER.avatarInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {MOCK_USER.lastName} {MOCK_USER.firstName}
            </p>
            <p className="truncate text-xs text-[#b7c7dc]">{MOCK_USER.code}</p>
          </div>
        </div>

        {/* Profile completeness */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs text-[#b7c7dc]">
            <span>プロフィール完成度</span>
            <span className="font-medium text-[#f0b429]">
              {MOCK_USER.profileCompleteness}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-[#f0b429] transition-all"
              style={{ width: `${MOCK_USER.profileCompleteness}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#f0b429] bg-white/10 text-white"
                  : "border-transparent text-[#b7c7dc] hover:bg-white/10 hover:text-white",
              )}
            >
              <span className={isActive ? "text-[#f0b429]" : "text-[#7f94b2]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-4">
        <LogoutButton className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#b7c7dc] transition-colors hover:bg-white/10 hover:text-white" />
      </div>
    </aside>
  );
}
