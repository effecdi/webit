"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { ModeSwitch } from "@/components/mode-switch"

const coupleData = {
  groomName: "",
  brideName: "",
  weddingDate: "",
  venue: "",
}

function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function WeddingHeader() {
  const [mounted, setMounted] = useState(false)
  const dday = calculateDday(coupleData.weddingDate)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="relative h-[45dvh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
          alt="Wedding"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <div className="bg-background/90 backdrop-blur-sm border-2 border-secondary px-3 py-1 shadow-brutalist-sm">
          <span className="font-serif text-lg font-bold tracking-tight">WE:BEAT</span>
        </div>
        <div className="flex items-center gap-2">
          <ModeSwitch currentMode="wedding" />
          <button className="w-10 h-10 flex items-center justify-center border-2 border-white/50 bg-black/20 backdrop-blur-sm">
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content Overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* D-Day Counter */}
        <div className="relative mb-4">
          <div className="border-3 border-white bg-black/30 backdrop-blur-sm px-8 py-4">
            <span className="font-serif text-6xl md:text-7xl font-black text-white tracking-tighter">
              D-{dday}
            </span>
          </div>
          {/* Brutalist Shadow */}
          <div className="absolute inset-0 border-3 border-[#D4AF37] translate-x-2 translate-y-2 -z-10" />
        </div>

        {/* Couple Names */}
        <div className="flex items-center gap-4 text-white">
          <span className="font-serif text-2xl md:text-3xl font-bold">{coupleData.groomName}</span>
          <span className="w-8 h-8 flex items-center justify-center border-2 border-[#D4AF37] rotate-45">
            <span className="-rotate-45 text-[#D4AF37] text-lg">&</span>
          </span>
          <span className="font-serif text-2xl md:text-3xl font-bold">{coupleData.brideName}</span>
        </div>

        {/* Venue & Date */}
        <p className="mt-3 text-sm text-white/80 tracking-wider uppercase">
          {coupleData.venue} | {coupleData.weddingDate.replace(/-/g, ".")}
        </p>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37]" />
    </header>
  )
}
