"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Utensils } from "lucide-react"

export default function WeddingSurveyStep3() {
  const router = useRouter()
  const [groomGuests, setGroomGuests] = useState("")
  const [brideGuests, setBrideGuests] = useState("")
  const [mealCostAdult, setMealCostAdult] = useState("")
  const [mealCostChild, setMealCostChild] = useState("")
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleComplete = async () => {
    const weddingDate = localStorage.getItem("wedding_date") || ""
    const weddingTime = localStorage.getItem("wedding_time") || ""
    const venue = localStorage.getItem("wedding_venue") || ""
    const groom = parseInt(groomGuests) || 0
    const bride = parseInt(brideGuests) || 0

    try {
      await fetch("/api/wedding-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weddingDate,
          weddingTime,
          venue,
          expectedGuests: groom + bride,
          groomGuests: groom,
          brideGuests: bride,
          mealCostAdult: parseInt(mealCostAdult) || 0,
          mealCostChild: parseInt(mealCostChild) || 0,
        }),
      })
    } catch (error) {
      console.error("Error saving wedding info:", error)
    }

    localStorage.setItem("wedding_onboarding_complete", "true")
    setFadeOut(true)
    setTimeout(() => router.push("/survey/wedding-complete"), 400)
  }

  const formatNumber = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num ? Number(num).toLocaleString() : ""
  }

  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    const num = value.replace(/[^0-9]/g, "")
    setter(num)
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
            <div className="w-6 h-1.5 bg-blue-500 rounded-full" />
            <div className="w-6 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            하객과 식대 정보를<br/>알려주세요
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            건너뛰어도 괜찮아요. 결혼모드에서 추가할 수 있어요
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[14px] font-medium text-[#4E5968] mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              예상 하객 수
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[12px] text-[#8B95A1] mb-1.5">신랑측</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={groomGuests ? formatNumber(groomGuests) : ""}
                    onChange={(e) => handleNumberInput(e.target.value, setGroomGuests)}
                    placeholder="0"
                    className="w-full px-4 py-3.5 bg-[#F3F5F7] rounded-[14px] text-[16px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    data-testid="input-groom-guests"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B95A1]">명</span>
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#8B95A1] mb-1.5">신부측</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={brideGuests ? formatNumber(brideGuests) : ""}
                    onChange={(e) => handleNumberInput(e.target.value, setBrideGuests)}
                    placeholder="0"
                    className="w-full px-4 py-3.5 bg-[#F3F5F7] rounded-[14px] text-[16px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    data-testid="input-bride-guests"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B95A1]">명</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-medium text-[#4E5968] mb-3 flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
              식대 (1인당)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[12px] text-[#8B95A1] mb-1.5">어른</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={mealCostAdult ? formatNumber(mealCostAdult) : ""}
                    onChange={(e) => handleNumberInput(e.target.value, setMealCostAdult)}
                    placeholder="60,000"
                    className="w-full px-4 py-3.5 bg-[#F3F5F7] rounded-[14px] text-[16px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    data-testid="input-meal-cost-adult"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B95A1]">원</span>
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#8B95A1] mb-1.5">아이</p>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={mealCostChild ? formatNumber(mealCostChild) : ""}
                    onChange={(e) => handleNumberInput(e.target.value, setMealCostChild)}
                    placeholder="30,000"
                    className="w-full px-4 py-3.5 bg-[#F3F5F7] rounded-[14px] text-[16px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    data-testid="input-meal-cost-child"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B95A1]">원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleComplete}
          className="flex-1 h-14 rounded-[16px] font-semibold text-[#4E5968] bg-[#F3F5F7] hover:bg-[#E5E8EB] active:scale-[0.98] transition-all"
          data-testid="button-skip"
        >
          건너뛰기
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 h-14 rounded-[16px] font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all"
          data-testid="button-next"
        >
          완료
        </button>
      </div>
    </main>
  )
}
