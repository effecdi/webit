"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthContext, type AuthUser } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user");
      const data = await res.json();
      setUser(data.user || null);
    } catch (error) {
      console.error("Failed to fetch auth user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
