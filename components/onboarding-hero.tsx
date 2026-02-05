"use client"

import { useEffect, useState } from "react"

export function OnboardingHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative h-[50dvh] overflow-hidden rounded-b-[32px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80"
          alt="Couple holding hands"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
      </div>

      {/* Logo & Tagline */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Main Logo */}
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight text-center">
            WE<span className="text-[#3182F6]">:</span>VE
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-center text-white/80 text-[15px]">
            Our Every Moment Together
          </p>
        </div>
      </div>
    </section>
  )
}
