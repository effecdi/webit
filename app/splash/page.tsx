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

      const hasCompletedSurvey = localStorage.getItem("survey_myName")
      const selectedMode = localStorage.getItem("selected_mode")

      if (user?.firstName && !hasCompletedSurvey) {
        localStorage.setItem("survey_myName", user.firstName)
      }

      if (hasCompletedSurvey && selectedMode) {
        if (selectedMode === "dating") {
          router.push("/dating")
        } else if (selectedMode === "wedding") {
          router.push("/wedding")
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
        <h1 className="text-5xl font-bold text-blue-500 tracking-tight">
          WE:VE
        </h1>
        <p className="mt-3 text-[15px] text-[#8B95A1]">
          Our Every Moment Together
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </main>
  )
}
