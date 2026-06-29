import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/types';
import { login, fetchMe, logout, AuthUser } from '@/lib/api/auth';
import { getStoredToken } from '@/lib/api/client';
import { SUPERADMIN_CREDENTIALS } from '@/lib/api/config';
import { buildSessionFromProfile, type SuperadminSession } from '@/lib/superadminPersona';

export type { Persona, SuperadminSession } from '@/lib/superadminPersona';

/** Shared demo password for org/tenant quick sign-in accounts (matches API seed). */
export const DEMO_PASSWORD = 'DemoAdmin123!';

export interface DemoAccount {
  email: string;
  password: string;
  label: string;
  sub: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: SUPERADMIN_CREDENTIALS.email,
    password: SUPERADMIN_CREDENTIALS.password,
    label: 'Platform Super Admin',
    sub: 'All tenants · governance · audit',
  },
  {
    email: 'marcus.t@bucees.com',
    password: DEMO_PASSWORD,
    label: "Organization Admin — Buc-ee's",
    sub: 'Tenant-wide scope',
  },
  {
    email: 'a.kowalski@zabka.pl',
    password: DEMO_PASSWORD,
    label: 'Organization Admin — Żabka Group',
    sub: 'Tenant-wide scope',
  },
  {
    email: 'priya@smartstore.io',
    password: DEMO_PASSWORD,
    label: 'Organization Admin — SmartStore',
    sub: 'Tenant-wide scope',
  },
  {
    email: 'j.cole@bucees.com',
    password: DEMO_PASSWORD,
    label: "Tenant Admin — Buc-ee's · Texas",
    sub: 'Region-scoped users & roles',
  },
  {
    email: 'p.nowak@zabka.pl',
    password: DEMO_PASSWORD,
    label: 'Tenant Admin — Żabka · Warsaw + Kraków',
    sub: 'Region-scoped users & roles',
  },
];

type SignInResult =
  | { ok: true; session: SuperadminSession }
  | { ok: false; error: string };

interface SuperadminAuthContextValue {
  user: AuthUser | null;
  session: SuperadminSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
}

const SuperadminAuthContext = createContext<SuperadminAuthContextValue | null>(null);

export function SuperadminAuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  /** Holds login response until `/me` query key catches up — avoids redirect bounce. */
  const [bootstrappedUser, setBootstrappedUser] = useState<AuthUser | null>(null);

  const profileQuery = useQuery({
    queryKey: ['superadmin', 'auth', 'me', token],
    queryFn: fetchMe,
    enabled: !!token,
    retry: false,
  });

  const user = profileQuery.data ?? bootstrappedUser;
  const session = useMemo(
    () => (user ? buildSessionFromProfile(user) : null),
    [user],
  );

  useEffect(() => {
    if (profileQuery.data) {
      setBootstrappedUser(null);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    if (token && profileQuery.isError) {
      logout();
      setToken(null);
      setBootstrappedUser(null);
    }
  }, [token, profileQuery.isError]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      try {
        const data = await login(email.trim(), password);
        setBootstrappedUser(data.user);
        setToken(data.accessToken);
        queryClient.setQueryData(['superadmin', 'auth', 'me', data.accessToken], data.user);
        const nextSession = buildSessionFromProfile(data.user);
        return { ok: true, session: nextSession };
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Unable to sign in. Check your credentials.';
        return { ok: false, error: message };
      }
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    logout();
    setToken(null);
    setBootstrappedUser(null);
    queryClient.removeQueries({ queryKey: ['superadmin', 'auth'] });
  }, [queryClient]);

  const isAuthenticated = !!token && !!user;

  const value = useMemo<SuperadminAuthContextValue>(
    () => ({
      user: user ?? null,
      session,
      isLoading: !!token && !user && profileQuery.isLoading,
      isAuthenticated,
      signIn,
      signOut,
    }),
    [user, session, profileQuery.isLoading, isAuthenticated, signIn, signOut],
  );

  return (
    <SuperadminAuthContext.Provider value={value}>{children}</SuperadminAuthContext.Provider>
  );
}

export function useSuperadminAuth() {
  const ctx = useContext(SuperadminAuthContext);
  if (!ctx) throw new Error('useSuperadminAuth must be used within SuperadminAuthProvider');
  return ctx;
}
