"use client"

import { CoupleCalendar } from "@/components/dating/couple-calendar"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      <CoupleCalendar />
      <DatingBottomNav />
    </div>
  )
}
