"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: async () => {},
});

let supabase: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  if (typeof window !== "undefined") {
    console.warn("Supabase env vars are not set; auth features will be disabled.");
  }
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export { AuthContext, supabase };
export type { AuthUser, AuthState };
