"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

export default function SurveyStep1() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [gender, setGender] = useState<"male" | "female" | "">("")
  const [birthday, setBirthday] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const canProceed = name.trim() && gender && birthday

  const handleNext = () => {
    if (!canProceed) return
    localStorage.setItem("survey_myName", name)
    localStorage.setItem("survey_myGender", gender)
    localStorage.setItem("survey_myBirthday", birthday)
    setFadeOut(true)
    setTimeout(() => router.push("/survey/step2"), 400)
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
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            만나서 반가워요!<br/>이름이 어떻게 되세요?
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="이름을 입력해주세요"
              className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-my-name"
            />
          </div>

          <div>
            <p className="text-[15px] text-[#8B95A1] mb-3">성별</p>
            <div className="flex gap-3">
              <button
                onClick={() => setGender("female")}
                className={`flex-1 h-14 rounded-[16px] font-semibold transition-all ${
                  gender === "female"
                    ? "bg-blue-500 text-white"
                    : "bg-[#F3F5F7] text-[#4E5968] hover:bg-[#E5E8EB]"
                }`}
                data-testid="button-gender-female"
              >
                여성
              </button>
              <button
                onClick={() => setGender("male")}
                className={`flex-1 h-14 rounded-[16px] font-semibold transition-all ${
                  gender === "male"
                    ? "bg-blue-500 text-white"
                    : "bg-[#F3F5F7] text-[#4E5968] hover:bg-[#E5E8EB]"
                }`}
                data-testid="button-gender-male"
              >
                남성
              </button>
            </div>
          </div>

          <div>
            <p className="text-[15px] text-[#8B95A1] mb-3">생년월일</p>
            <div className="relative">
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-my-birthday"
              />
              <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1] pointer-events-none" />
            </div>
          </div>
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
