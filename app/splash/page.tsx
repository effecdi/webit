"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function SplashPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [showLogo, setShowLogo] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 300)
    return () => clearTimeout(logoTimer)
  }, [])

  useEffect(() => {
    if (isLoading) return

    const fadeTimer = setTimeout(() => setFadeOut(true), 1500)
    
    const navigateTimer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      const inviteCookieMatch = document.cookie.match(/(?:^|;\s*)pending_invite_code=([^;]*)/)
      if (inviteCookieMatch) {
        const inviteCode = decodeURIComponent(inviteCookieMatch[1])
        router.push(`/invite-welcome?code=${inviteCode}`)
        return
      }

      const hasCompletedSurvey = localStorage.getItem("survey_myName")
      const selectedMode = localStorage.getItem("selected_mode")

      if (user?.firstName && !hasCompletedSurvey) {
        localStorage.setItem("survey_myName", user.firstName)
      }

      if (hasCompletedSurvey && selectedMode) {
        if (selectedMode === "wedding") {
          const weddingDate = localStorage.getItem("wedding_date")
          if (weddingDate) {
            const target = new Date(weddingDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            target.setHours(0, 0, 0, 0)
            const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            if (diff < 0) {
              localStorage.setItem("selected_mode", "family")
              localStorage.setItem("family_transition_pending", "true")
              router.push("/family")
              return
            }
          }
          router.push("/wedding")
        } else if (selectedMode === "dating") {
          router.push("/dating")
        } else if (selectedMode === "family") {
          router.push("/family")
        } else {
          router.push("/dating")
        }
      } else if (hasCompletedSurvey) {
        router.push("/dating")
      } else {
        router.push("/survey/step1")
      }
    }, 2000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(navigateTimer)
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <main 
      className={`min-h-dvh bg-white flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div 
        className={`text-center transition-all duration-1000 ${
          showLogo ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <h1 className="text-5xl font-bold text-[#b455e0] tracking-tight">
          WE:VE
        </h1>
        <p className="mt-3 text-[15px] text-[#8B95A1]">
          Our Every Moment Together
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-3 border-[#b455e0] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </main>
  )
}
