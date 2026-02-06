"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const [myName, setMyName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [daysTogether, setDaysTogether] = useState(0)

  useEffect(() => {
    const savedMyName = localStorage.getItem("survey_myName") || "나"
    const savedPartnerName = localStorage.getItem("survey_partnerName") || "상대방"
    const savedDate = localStorage.getItem("survey_firstMeetDate")
    
    setMyName(savedMyName)
    setPartnerName(savedPartnerName)
    
    if (savedDate) {
      const start = new Date(savedDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysTogether(diffDays)
      localStorage.setItem("survey_daysTogether", String(diffDays))
    }

    setFadeIn(true)
  }, [])

  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => {
        setFadeIn(false)
        setTimeout(() => {
          setStep(prev => prev + 1)
          setFadeIn(true)
        }, 500)
      }, 5000)
      return () => clearTimeout(timer)
    } else if (step === 3) {
      const timer = setTimeout(() => {
        setFadeIn(false)
        setTimeout(() => {
          const selectedMode = localStorage.getItem("selected_mode")
          if (selectedMode === "wedding") {
            router.push("/wedding")
          } else if (selectedMode === "family") {
            router.push("/family")
          } else {
            router.push("/dating")
          }
        }, 500)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, router])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <p className="text-[32px] font-bold text-[#191F28] leading-tight">
              반가워요.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-[32px] font-bold text-blue-500">{myName}</span>
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
              <span className="text-[32px] font-bold text-pink-500">{partnerName}</span>
              <span className="text-[32px] font-bold text-[#191F28]">님 :)</span>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="text-center">
            <p className="text-[28px] font-bold text-[#191F28] leading-relaxed">
              우리의 시간이 벌써
            </p>
            <p className="text-[48px] font-extrabold text-blue-500 my-4">
              {formatNumber(daysTogether)}일
            </p>
            <p className="text-[28px] font-bold text-[#191F28]">
              이 되었네요!
            </p>
          </div>
        )
      case 2:
        return (
          <div className="text-center px-4">
            <p className="text-[24px] font-bold text-[#191F28] leading-relaxed">
              이제 우리의 시간을<br/>
              아름답게<br/>
              행복한 날로<br/>
              만들어갈까요?
            </p>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <p className="text-[32px] font-bold text-[#191F28]">
              시작할게요 :)
            </p>
            <div className="mt-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Heart className="w-8 h-8 text-blue-500 fill-blue-500" />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <main className="min-h-dvh bg-white flex items-center justify-center px-6">
      <div 
        className={`transition-opacity duration-500 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {renderContent()}
      </div>
    </main>
  )
}
