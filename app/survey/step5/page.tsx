"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"

export default function SurveyStep5() {
  const router = useRouter()
  const [intro, setIntro] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleNext = () => {
    localStorage.setItem("survey_coupleIntro", intro)
    setFadeOut(true)
    setTimeout(() => router.push("/welcome"), 400)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
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
            <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            우리 커플을<br/>소개해주세요
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            선택사항이에요. 건너뛰어도 괜찮아요!
          </p>
        </div>

        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="예) 같은 회사에서 만났어요, 대학교 동기예요..."
          rows={4}
          className="w-full p-5 rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none border border-[#E5E8EB] focus:ring-2 focus:ring-blue-500 resize-none"
          data-testid="input-couple-intro"
        />
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
          완료
        </button>
      </div>
    </main>
  )
}
