"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

export function OnboardingHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="pt-6 pb-8 px-5 bg-white">
      {/* Header Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#d63bf2] tracking-tight">
          WE:BEAT
        </h1>
      </div>

      {/* Profile Frame with Badges */}
      <div 
        className={`relative mx-auto w-48 h-48 transition-all duration-700 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Main Photo Frame */}
        <div className="w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          <img
            src="/placeholder.svg"
            alt="Couple"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Heart Badge - Top Right */}
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#d63bf2] rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-5 h-5 text-white fill-white" />
        </div>

        {/* Small Badge - Bottom Left */}
        <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-[#d63bf2] rounded-full flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>
      </div>

      {/* Text Content */}
      <div 
        className={`mt-8 text-center transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-[28px] font-extrabold text-[#191F28] leading-tight whitespace-pre-line">
          {"반가워요!\n어떤 단계인가요?"}
        </h2>
        <p className="mt-3 text-[15px] text-[#8B95A1] font-light">
          우리 커플에게 딱 맞는 정보를 드릴게요
        </p>
      </div>
    </section>
  )
}
