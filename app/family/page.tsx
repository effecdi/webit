"use client"

import { useEffect, useState } from "react"
import { FamilyWeveDashboard } from "@/components/family/family-weve-dashboard"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { HistoryBookIntro } from "@/components/family/history-book-intro"

export default function FamilyHomePage() {
  const [showIntro, setShowIntro] = useState(false)

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("weve-family-intro-seen")
    if (!hasSeenIntro) {
      setShowIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem("weve-family-intro-seen", "true")
    setShowIntro(false)
  }

  if (showIntro) {
    return <HistoryBookIntro onComplete={handleIntroComplete} />
  }

  return (
    <>
      <FamilyWeveDashboard />
      <FamilyBottomNav />
    </>
  )
}
