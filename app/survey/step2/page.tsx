"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import WheelDatePicker from "@/components/ui/wheel-date-picker"

export default function SurveyStep2() {
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
    localStorage.setItem("survey_partnerName", name)
    localStorage.setItem("survey_partnerGender", gender)
    localStorage.setItem("survey_partnerBirthday", birthday)
    setFadeOut(true)
    setTimeout(() => router.push("/survey/step3"), 400)
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
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            사랑하는 분의<br/>이름이 어떻게 되세요?
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
              placeholder="상대방 이름을 입력해주세요"
              className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-partner-name"
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
                data-testid="button-partner-gender-female"
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
                data-testid="button-partner-gender-male"
              >
                남성
              </button>
            </div>
          </div>

          <div>
            <p className="text-[15px] text-[#8B95A1] mb-3">생년월일</p>
            <WheelDatePicker
              value={birthday}
              onChange={setBirthday}
              placeholder="생년월일을 선택해주세요"
              className="!h-14 !px-5 !bg-[#F3F5F7] !rounded-[16px] !text-[17px]"
              label="생년월일"
              maxYear={new Date().getFullYear()}
            />
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
