"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock } from "lucide-react"

export default function WeddingSurveyStep1() {
  const router = useRouter()
  const [weddingDate, setWeddingDate] = useState("")
  const [weddingTime, setWeddingTime] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleNext = () => {
    if (!weddingDate) return
    localStorage.setItem("wedding_date", weddingDate)
    if (weddingTime) localStorage.setItem("wedding_time", weddingTime)
    setFadeOut(true)
    setTimeout(() => router.push("/survey/wedding-step2"), 400)
  }

  return (
    <main
      className={`min-h-dvh bg-white flex flex-col px-6 py-12 transition-opacity duration-400 ${
        fadeIn && !fadeOut ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-10">
          <div className="flex gap-1.5 mb-8">
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            결혼 예정일은<br/>언제인가요?
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            D-day를 계산하고 일정을 준비해 드릴게요
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">
              <Calendar className="w-4 h-4 inline mr-1.5 mb-0.5" />
              결혼 예정일
            </label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-5 py-4 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-wedding-date"
            />
          </div>
          <div>
            <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">
              <Clock className="w-4 h-4 inline mr-1.5 mb-0.5" />
              예식 시간
            </label>
            <input
              type="time"
              value={weddingTime}
              onChange={(e) => setWeddingTime(e.target.value)}
              className="w-full px-5 py-4 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-wedding-time"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!weddingDate}
        className={`w-full h-14 rounded-[16px] font-semibold text-white transition-all ${
          weddingDate
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
