"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WeddingDashboard } from "@/components/wedding/wedding-dashboard"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { WeddingWelcomeBanner } from "@/components/wedding-welcome-banner"

// 결혼식 날짜 (실제로는 서버에서 가져올 데이터)
const WEDDING_DATE = "2025-06-15"

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
  const dday = calculateDday(WEDDING_DATE)

  useEffect(() => {
    // D-day가 음수(결혼식 다음날 이후)이면 가족 모드로 자동 전환
    // 개발 중 주석 처리 - 결혼 모드 확인용
    // if (dday < 0) {
    //   router.replace("/family")
    // } else {
    //   setChecking(false)
    // }
    setChecking(false)
  }, [dday, router])

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
