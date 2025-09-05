import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import { Container, Button } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider.tsx";

const linkBase =
  "text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md transition-colors";
const active = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${linkBase} bg-slate-100` : linkBase;

const mobileLinkBase =
  "block text-base font-medium text-slate-600 hover:text-slate-900 px-4 py-3 rounded-md transition-colors";
const mobileActive = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${mobileLinkBase} bg-slate-100` : mobileLinkBase;

export default function Navbar() {
  const { state, logout } = useAuth();
  const role = state.role; // "guest" | "user" | "agent" | "admin"
  const isAuthed = role !== "guest";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
      <Container className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/" className={active}>
            ホーム
          </NavLink>
          <NavLink to="/jobs" className={active}>
            求人検索
          </NavLink>

          {/* Faqat login bo'lgan ISH QIDIRUVCHI uchun ko'rinadi */}
          {role === "user" && (
            <>
              <NavLink to="/resume" className={active}>
                履歴書・職務経歴書作成
              </NavLink>
              <NavLink to="/mypage" className={active}>
                マイページ
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {!isAuthed && (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-sm px-3 py-2">
                  ログイン
                </Button>
              </Link>
              <Link to="/register">
                <Button className="text-sm px-4 py-2">会員登録</Button>
              </Link>
            </>
          )}

          {isAuthed && (
            <>
              <span className="text-sm text-slate-600">
                {state.user?.name
                  ? `ようこそ、${state.user.name}さん`
                  : role === "agent"
                  ? "エージェント"
                  : role === "admin"
                  ? "管理者"
                  : "ユーザー"}
              </span>
              <Button
                variant="secondary"
                onClick={logout}
                className="text-sm px-3 py-2"
              >
                ログアウト
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          {!isAuthed && (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2"
                >
                  ログイン
                </Button>
              </Link>
              <Link to="/register">
                <Button className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2">
                  会員登録
                </Button>
              </Link>
            </>
          )}

          {isAuthed && (
            <Button
              variant="secondary"
              onClick={logout}
              className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2"
            >
              ログアウト
            </Button>
          )}

          <button
            onClick={toggleMobileMenu}
            className="ml-2 p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-2 space-y-1">
            <NavLink
              to="/"
              className={mobileActive}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ホーム
            </NavLink>
            <NavLink
              to="/jobs"
              className={mobileActive}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              求人検索
            </NavLink>

            {/* Faqat login bo'lgan ISH QIDIRUVCHI uchun ko'rinadi */}
            {role === "user" && (
              <>
                <NavLink
                  to="/resume"
                  className={mobileActive}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  履歴書・職務経歴書作成
                </NavLink>
                <NavLink
                  to="/mypage"
                  className={mobileActive}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  マイページ
                </NavLink>
              </>
            )}

            {/* Mobile User Info */}
            {isAuthed && (
              <div className="px-4 py-3 border-t border-slate-200 mt-2">
                <span className="text-sm text-slate-600">
                  {state.user?.name
                    ? `ようこそ、${state.user.name}さん`
                    : role === "agent"
                    ? "エージェント"
                    : role === "admin"
                    ? "管理者"
                    : "ユーザー"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
