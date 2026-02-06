"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

export default function SurveyStep3() {
  const router = useRouter()
  const [date, setDate] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const canProceed = date.trim()

  const handleNext = () => {
    if (!canProceed) return
    localStorage.setItem("survey_firstMeetDate", date)
    setFadeOut(true)
    setTimeout(() => router.push("/survey/step4"), 400)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isComposing && canProceed) {
      handleNext()
    }
  }

  return (
    <main 
      className={`min-h-dvh bg-white flex flex-col px-6 py-12 transition-opacity duration-400 ${
        fadeIn && !fadeOut ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <div className="flex gap-1.5 mb-8">
            <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            두 분이 처음<br/>만난 날은 언제인가요?
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            함께한 시간을 계산해 드릴게요
          </p>
        </div>

        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="input-first-meet-date"
          />
          <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1] pointer-events-none" />
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!canProceed}
        className={`w-full h-14 rounded-[16px] font-semibold text-white transition-all ${
          canProceed 
            ? "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]" 
            : "bg-[#B0B8C1]"
        }`}
        data-testid="button-next"
      >
        다음
      </button>
    </main>
  )
}
