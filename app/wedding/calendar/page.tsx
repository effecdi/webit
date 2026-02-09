"use client"

import { WeddingCalendar } from "@/components/wedding/wedding-calendar"
import { WeddingNav } from "@/components/wedding-nav"
import { ModeSwitch } from "@/components/mode-switch"
import { Bell } from "lucide-react"

export default function WeddingCalendarPage() {
  return (
    <main className="min-h-dvh bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b-3 border-secondary">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="font-serif text-lg font-bold">캘린더</span>
          <div className="flex items-center gap-2">
            <ModeSwitch currentMode="wedding" />
            <button className="w-10 h-10 flex items-center justify-center border-2 border-secondary hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <WeddingCalendar />
      <WeddingNav />
    </main>
  )
}
