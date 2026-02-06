"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

export default function WeddingSurveyStep2() {
  const router = useRouter()
  const [venue, setVenue] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleNext = () => {
    if (venue) localStorage.setItem("wedding_venue", venue)
    setFadeOut(true)
    setTimeout(() => router.push("/survey/wedding-step3"), 400)
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
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            결혼식장은<br/>어디인가요?
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            아직 정하지 않았다면 건너뛰어도 돼요
          </p>
        </div>

        <div>
          <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">
            <MapPin className="w-4 h-4 inline mr-1.5 mb-0.5" />
            예식장 이름 또는 위치
          </label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="예) 더채플앳청담, 서울 강남구..."
            className="w-full px-5 py-4 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="input-wedding-venue"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleNext}
          className="flex-1 h-14 rounded-[16px] font-semibold text-[#4E5968] bg-[#F3F5F7] hover:bg-[#E5E8EB] active:scale-[0.98] transition-all"
          data-testid="button-skip"
        >
          건너뛰기
        </button>
        <button
          onClick={handleNext}
          className="flex-1 h-14 rounded-[16px] font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all"
          data-testid="button-next"
        >
          다음
        </button>
      </div>
    </main>
  )
}
