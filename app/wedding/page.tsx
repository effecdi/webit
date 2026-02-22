"use client"

import { WeddingDashboard } from "@/components/wedding/wedding-dashboard"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { WeddingWelcomeBanner } from "@/components/wedding-welcome-banner"

export default function WeddingHomePage() {
  return (
    <>
      <WeddingWelcomeBanner />
      <WeddingDashboard />
      <WeddingBottomNav />
    </>
  )
}
