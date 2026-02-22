"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AuthContext, type AuthUser, supabase } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const syncedRef = useRef(false);

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

  const syncServerSession = useCallback(async () => {
    if (!supabase || syncedRef.current) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        syncedRef.current = true;
        await fetch("/api/auth/sync-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: session.access_token }),
        });
      }
    } catch (err) {
      console.error("Failed to sync server session:", err);
    }
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
        if (data.user) {
          syncServerSession();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [mapUser, syncServerSession]);

  useEffect(() => {
    refetch();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
      if (session?.user) {
        syncedRef.current = false;
        syncServerSession();
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [mapUser, refetch, syncServerSession]);

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
