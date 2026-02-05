"use client"

import { useState } from "react"
import { OnboardingHero } from "@/components/onboarding-hero"
import { StatusCards } from "@/components/status-cards"

export default function OnboardingPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <OnboardingHero />
      <StatusCards 
        selectedStatus={selectedStatus} 
        onSelect={setSelectedStatus} 
      />
    </main>
  )
}
