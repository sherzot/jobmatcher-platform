import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Role = "guest" | "user" | "agent" | "admin";
type AuthState = {
  role: Role;
  token?: string | null;
  user?: { id: number; name: string } | null;
};

type AuthContextValue = {
  state: AuthState;
  login: (
    role: Exclude<Role, "guest">,
    token?: string,
    user?: AuthState["user"]
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const raw = localStorage.getItem("jm_auth");
    return raw ? JSON.parse(raw) : { role: "guest" as Role };
  });

  useEffect(() => {
    localStorage.setItem("jm_auth", JSON.stringify(state));
  }, [state]);

  const login = (
    role: Exclude<Role, "guest">,
    token?: string,
    user?: AuthState["user"]
  ) => {
    setState({ role, token: token ?? null, user: user ?? null });
  };

  const logout = () => setState({ role: "guest" });

  const value = useMemo(() => ({ state, login, logout }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
