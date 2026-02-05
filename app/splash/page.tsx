"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashPage() {
  const router = useRouter()
  const [showLogo, setShowLogo] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 300)
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000)
    const navigateTimer = setTimeout(() => router.push("/login"), 2500)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(fadeTimer)
      clearTimeout(navigateTimer)
    }
  }, [router])

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
