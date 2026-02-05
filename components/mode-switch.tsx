"use client"

import { useRouter } from "next/navigation"
import { Heart, Gem } from "lucide-react"

interface ModeSwitchProps {
  currentMode: "dating" | "wedding"
}

export function ModeSwitch({ currentMode }: ModeSwitchProps) {
  const router = useRouter()

  const handleWeddingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const isOnboardingComplete = localStorage.getItem("wedding_onboarding_complete")
    if (isOnboardingComplete === "true") {
      router.push("/wedding")
    } else {
      router.push("/wedding/onboarding")
    }
  }

  return (
    <div className="flex items-center bg-[#F2F4F6] rounded-full p-1">
      <button
        onClick={() => router.push("/dating")}
        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
          currentMode === "dating"
            ? "bg-white text-pink-500 shadow-sm"
            : "text-[#8B95A1] hover:text-[#4E5968]"
        }`}
        data-testid="button-mode-dating"
      >
        <Heart className="w-4 h-4" />
        <span>연애</span>
      </button>
      <button
        onClick={handleWeddingClick}
        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
          currentMode === "wedding"
            ? "bg-white text-[#3182F6] shadow-sm"
            : "text-[#8B95A1] hover:text-[#4E5968]"
        }`}
        data-testid="button-mode-wedding"
      >
        <Gem className="w-4 h-4" />
        <span>결혼</span>
      </button>
    </div>
  )
}
