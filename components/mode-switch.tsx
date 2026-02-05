"use client"

import Link from "next/link"
import { Heart, Gem } from "lucide-react"

interface ModeSwitchProps {
  currentMode: "dating" | "wedding"
}

export function ModeSwitch({ currentMode }: ModeSwitchProps) {
  return (
    <div className="flex items-center bg-[#F2F4F6] rounded-full p-1">
      <Link
        href="/dating"
        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
          currentMode === "dating"
            ? "bg-white text-pink-500 shadow-sm"
            : "text-[#8B95A1] hover:text-[#4E5968]"
        }`}
      >
        <Heart className="w-4 h-4" />
        <span>연애</span>
      </Link>
      <Link
        href="/wedding"
        className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
          currentMode === "wedding"
            ? "bg-white text-[#3182F6] shadow-sm"
            : "text-[#8B95A1] hover:text-[#4E5968]"
        }`}
      >
        <Gem className="w-4 h-4" />
        <span>결혼</span>
      </Link>
    </div>
  )
}
