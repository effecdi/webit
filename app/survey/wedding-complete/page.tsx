"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Gem, Heart, PartyPopper } from "lucide-react"

export default function WeddingCompletePage() {
  const router = useRouter()
  const [fadeIn, setFadeIn] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setFadeIn(true)
    const timer = setTimeout(() => setShowButton(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    localStorage.setItem("selected_mode", "wedding")
    localStorage.setItem("wedding_onboarding_complete", "true")
    router.push("/wedding")
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-[#3182F6] to-[#1B64DA] flex flex-col items-center justify-center px-6">
      <div
        className={`text-center transition-all duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <PartyPopper className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div
              className="absolute -bottom-1 -left-2 w-9 h-9 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg"
              style={{ animationDelay: "0.15s" }}
            >
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-white leading-tight mb-3">
          결혼을 축하드려요! :)
        </h1>
        <p className="text-white/80 text-[17px] leading-relaxed">
          이제 우리의 결혼준비를<br/>시작해볼까요?
        </p>
      </div>

      <div
        className={`w-full max-w-sm mt-12 transition-all duration-500 ${
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={handleStart}
          className="w-full py-4 bg-white text-[#3182F6] font-bold text-[17px] rounded-[16px] hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg"
          data-testid="button-start-wedding"
        >
          결혼 준비 시작하기
        </button>
      </div>
    </main>
  )
}
