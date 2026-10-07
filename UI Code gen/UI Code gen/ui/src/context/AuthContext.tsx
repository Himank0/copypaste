import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export interface AuthUser {
  displayName: string;
  initials: string;
  email: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const STORAGE_KEY = 'cmd-auth-user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Lightweight session-based auth context. Backed by `sessionStorage` so a
 * refresh doesn't immediately bounce an authenticated user back to Login.
 * This is a UI-only placeholder until a real authentication service/API
 * exists (see Login.tsx MOCK_DATA_TODO).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,
      user,
      login: (nextUser: AuthUser) => {
        setUser(nextUser);
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        } catch {
          // Ignore storage failures (e.g. private browsing mode).
        }
      },
      logout: () => {
        setUser(null);
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore storage failures.
        }
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
