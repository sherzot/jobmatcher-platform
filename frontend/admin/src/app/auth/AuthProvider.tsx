import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Role = "guest" | "user" | "agent" | "admin";
type User = { id: number; name: string; email: string };
type AuthState = { role: Role; token?: string | null; user?: User | null };

type AuthContextValue = {
  state: AuthState;
  login: (token: string, user: User, role?: Role) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem("jm_auth");
    return raw ? JSON.parse(raw) : { role: "guest" as Role };
  });

  const save = (s: AuthState) => {
    setState(s);
    localStorage.setItem("jm_auth", JSON.stringify(s));
  };

  const refreshMe = async () => {
    if (!state.token) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_AUTH}/api/v1/auth/me`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        }
      );
      if (!res.ok) throw new Error("unauth");
      const user = await res.json();
      save({ ...state, role: "user", user });
    } catch {
      // token eskirgan
      save({ role: "guest" });
    }
  };

  useEffect(() => {
    // App yuklanganda token bo'lsa ME tekshirilsin
    if (state.token && !state.user) {
      refreshMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string, user: User, role: Role = "user") => {
    save({ role, token, user });
  };

  const logout = () => save({ role: "guest" });

  const value = useMemo(() => ({ state, login, logout, refreshMe }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
