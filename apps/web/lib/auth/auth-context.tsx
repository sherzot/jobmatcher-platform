'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'ADMIN' | 'AGENT' | 'COMPANY' | 'USER';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo accounts — replace with real API call when backend is ready
const DEMO_ACCOUNTS: Record<string, AuthUser & { password: string }> = {
  'admin@jobmatch.com': {
    id: 1, email: 'admin@jobmatch.com', role: 'ADMIN', name: 'Admin User', password: 'admin123',
  },
  'agent@jobmatch.com': {
    id: 2, email: 'agent@jobmatch.com', role: 'AGENT', name: 'Demo Agent', password: 'agent123',
  },
  'company@jobmatch.com': {
    id: 3, email: 'company@jobmatch.com', role: 'COMPANY', name: 'Demo Company', password: 'company123',
  },
  'user@jobmatch.com': {
    id: 4, email: 'user@jobmatch.com', role: 'USER', name: 'Demo Candidate', password: 'user123',
  },
};

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  ADMIN: '/admin/dashboard',
  AGENT: '/agent/dashboard',
  COMPANY: '/company/dashboard',
  USER: '/dashboard',
};

const STORAGE_KEY = 'jobmatch_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // TODO: replace with real API call → POST /api/auth/login
    const account = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!account || account.password !== password) {
      return { success: false, error: 'メールアドレスまたはパスワードが間違っています' };
    }
    const { password: _, ...authUser } = account;
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
