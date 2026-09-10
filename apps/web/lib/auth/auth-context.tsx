"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/lib/api/client";

export type UserRole = "ADMIN" | "AGENT" | "COMPANY" | "USER";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  ADMIN: "/admin/dashboard",
  AGENT: "/agent/dashboard",
  COMPANY: "/company/dashboard",
  USER: "/dashboard",
};

const STORAGE_KEY = "jobmatch_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback(
    (apiUser: Awaited<ReturnType<typeof api.login>>) => {
      const role = apiUser.role === "CANDIDATE" ? "USER" : apiUser.role;
      const authUser: AuthUser = {
        id: apiUser.id,
        email: apiUser.email,
        role,
        name: apiUser.email,
      };
      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify({ role }))}; path=/; max-age=86400; SameSite=Lax`;
    },
    [],
  );

  useEffect(() => {
    void api
      .me()
      .then((current) => persistUser(current))
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [persistUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        persistUser(await api.login(email, password));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "ログインに失敗しました",
        };
      }
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    void api.logout().catch(() => undefined);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
