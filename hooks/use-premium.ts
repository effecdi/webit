"use client";

import { useState, useEffect } from "react";

export type PlanType = "free" | "advanced" | "premium";

interface PremiumState {
  plan: PlanType;
  isLoading: boolean;
  isPremium: boolean;
  isAdvanced: boolean;
  isPaid: boolean;
  photoLimit: number;
  canUseAI: boolean;
  canUseStats: boolean;
  canUseHistoryBook: boolean;
  canUseAdvancedCalendar: boolean;
  canUsePremiumWidgets: boolean;
  refetch: () => Promise<void>;
}

const PHOTO_LIMITS: Record<PlanType, number> = {
  free: 50,
  advanced: 500,
  premium: Infinity,
};

export function usePremium(): PremiumState {
  const [plan, setPlan] = useState<PlanType>("free");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      const res = await fetch("/api/stripe/subscription");
      const data = await res.json();
      if (data.plan && ["free", "advanced", "premium"].includes(data.plan)) {
        setPlan(data.plan as PlanType);
      }
    } catch {
      setPlan("free");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const isPremium = plan === "premium";
  const isAdvanced = plan === "advanced";
  const isPaid = isPremium || isAdvanced;

  return {
    plan,
    isLoading,
    isPremium,
    isAdvanced,
    isPaid,
    photoLimit: PHOTO_LIMITS[plan],
    canUseAI: isPremium,
    canUseStats: isPaid,
    canUseHistoryBook: isPremium,
    canUseAdvancedCalendar: isPaid,
    canUsePremiumWidgets: isPaid,
    refetch: fetchPlan,
  };
}
