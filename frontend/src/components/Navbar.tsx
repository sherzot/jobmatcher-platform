import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { Container, Button } from "../app/ui";
import { useAuth } from "../app/auth/AuthProvider.tsx";

const linkBase =
  "text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md";
const active = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${linkBase} bg-slate-100` : linkBase;

export default function Navbar() {
  const { state, logout } = useAuth();
  const role = state.role; // "guest" | "user" | "agent" | "admin"
  const isAuthed = role !== "guest";

  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-slate-200">
      <Container className="flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        {/* LEFT NAV */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={active}>
            ホーム
          </NavLink>
          <NavLink to="/jobs" className={active}>
            求人検索
          </NavLink>

          {/* Faqat login bo‘lgan ISH QIDIRUVCHI uchun ko‘rinadi */}
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

          {/* Agent/Admin menyulari asosiy navda ko‘rinmaydi (ish qidiruvchi uchun kerak emas) */}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {!isAuthed && (
            <>
              <Link to="/login">
                <Button variant="ghost">ログイン</Button>
              </Link>
              <Link to="/register">
                <Button>会員登録</Button>
              </Link>
            </>
          )}

          {isAuthed && (
            <>
              <span className="text-sm text-slate-600 hidden md:inline">
                {state.user?.name
                  ? `ようこそ、${state.user.name}さん`
                  : role === "agent"
                  ? "エージェント"
                  : role === "admin"
                  ? "管理者"
                  : "ユーザー"}
              </span>
              <Button variant="secondary" onClick={logout}>
                ログアウト
              </Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
