"use client"

import { FamilyCalendar } from "@/components/family/family-calendar"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

export default function FamilyCalendarPage() {
  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center px-5 h-14 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">캘린더</h1>
        </div>
      </header>

      <FamilyCalendar />
      <FamilyBottomNav />
    </main>
  )
}
