"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthContext, type AuthUser, supabase } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mapUser = useCallback((supabaseUser: any | null): AuthUser | null => {
    if (!supabaseUser) return null;
    const metadata = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      firstName: metadata.first_name ?? metadata.given_name ?? null,
      lastName: metadata.last_name ?? metadata.family_name ?? null,
      profileImageUrl: metadata.avatar_url ?? null,
    };
  }, []);

  const refetch = useCallback(async () => {
    if (!supabase) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
      } else {
        setUser(mapUser(data.user));
      }
    } finally {
      setIsLoading(false);
    }
  }, [mapUser]);

  useEffect(() => {
    refetch();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(mapUser(session?.user ?? null));
      if (session?.access_token && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        fetch('/api/auth/session-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token }),
        }).catch(() => {});
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [mapUser, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
