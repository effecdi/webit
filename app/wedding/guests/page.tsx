"use client"

import { GuestManager } from "@/components/wedding/guest-manager"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"

export default function GuestsPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      <GuestManager />
      <WeddingBottomNav />
    </div>
  )
}
