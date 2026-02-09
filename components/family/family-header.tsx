"use client"

import { useEffect, useState } from "react"
import { Bell, Home } from "lucide-react"
import { ModeSwitch } from "@/components/mode-switch"

export function FamilyHeader() {
  const [dDay, setDDay] = useState(0)

  useEffect(() => {
    const weddingDate = new Date("2025-12-20")
    const today = new Date()
    const diffTime = today.getTime() - weddingDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setDDay(diffDays)
  }, [])

  return (
    <header className="relative">
      {/* Hero Image */}
      <div className="relative h-64 bg-gradient-to-br from-[#2D8B57]/20 to-[#1a5235]/30 overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-20 h-20 border-2 border-[#2D8B57]" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-[#2D8B57] rotate-12" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#2D8B57] rotate-45" />
        </div>

        {/* Top Navigation */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <div className="bg-background/90 backdrop-blur-sm border-2 border-secondary px-3 py-1 shadow-brutalist-sm">
            <span className="font-serif text-lg font-bold tracking-tight">WE:BEAT</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeSwitch currentMode="family" />
            <button className="w-10 h-10 flex items-center justify-center border-2 border-[#2D8B57]/50 bg-[#2D8B57]/20 backdrop-blur-sm">
              <Bell className="w-5 h-5 text-[#2D8B57]" />
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-3 border-[#2D8B57] flex items-center justify-center bg-background/80 backdrop-blur-sm mb-4 shadow-brutalist-sm">
            <Home className="w-8 h-8 text-[#2D8B57]" />
          </div>
          <p className="text-xs tracking-[0.2em] text-[#2D8B57] uppercase mb-1">Family Mode</p>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            현정 & 주호의 가족
          </h1>
        </div>

        {/* D-Day Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="bg-[#2D8B57] text-white px-6 py-2 border-2 border-secondary shadow-brutalist-sm">
            <p className="text-xs opacity-80 text-center">결혼한 지</p>
            <p className="font-serif text-xl font-bold text-center">D+{dDay}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
