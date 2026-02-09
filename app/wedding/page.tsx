"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WeddingDashboard } from "@/components/wedding/wedding-dashboard"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { WeddingWelcomeBanner } from "@/components/wedding-welcome-banner"

function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function WeddingHomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const weddingDate = localStorage.getItem("wedding_date")
    
    if (weddingDate) {
      const dday = calculateDday(weddingDate)
      if (dday < 0) {
        localStorage.setItem("selected_mode", "family")
        localStorage.setItem("family_transition_pending", "true")
        router.replace("/family")
        return
      }
    }
    
    setChecking(false)
  }, [router])

  if (checking) {
    return null
  }

  return (
    <>
      <WeddingWelcomeBanner />
      <WeddingDashboard />
      <WeddingBottomNav />
    </>
  )
}
