"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Gem, Home } from "lucide-react"

const modes = [
  {
    id: "dating",
    label: "연애중이에요",
    icon: Heart,
    color: "bg-pink-50 text-pink-500 border-pink-200",
    activeColor: "bg-pink-500 text-white border-pink-500",
    iconColor: "text-pink-400",
    activeIconColor: "text-white",
  },
  {
    id: "wedding",
    label: "결혼준비중이에요",
    icon: Gem,
    color: "bg-[#F3E8FF] text-[#b455e0] border-[#E0C4F5]",
    activeColor: "bg-[#b455e0] text-white border-[#b455e0]",
    iconColor: "text-[#c77de6]",
    activeIconColor: "text-white",
  },
  {
    id: "family",
    label: "결혼했어요",
    icon: Home,
    color: "bg-green-50 text-green-600 border-green-200",
    activeColor: "bg-green-500 text-white border-green-500",
    iconColor: "text-green-400",
    activeIconColor: "text-white",
  },
]

export default function SurveyStep4() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [fadeIn, setFadeIn] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleSelect = (modeId: string) => {
    setSelectedMode(modeId)
  }

  const handleNext = () => {
    if (!selectedMode) return
    localStorage.setItem("selected_mode", selectedMode)
    setFadeOut(true)
    if (selectedMode === "wedding") {
      setTimeout(() => router.push("/survey/wedding-step1"), 400)
    } else {
      setTimeout(() => router.push("/survey/step5"), 400)
    }
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
            <div className="w-8 h-1.5 bg-[#b455e0] rounded-full" />
            <div className="w-8 h-1.5 bg-[#b455e0] rounded-full" />
            <div className="w-8 h-1.5 bg-[#b455e0] rounded-full" />
            <div className="w-8 h-1.5 bg-[#b455e0] rounded-full" />
            <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
          </div>
          <h1 className="text-[28px] font-bold text-[#191F28] leading-tight">
            현재 우리는<br/>어떤 상태인가요?
          </h1>
          <p className="text-[15px] text-[#8B95A1] mt-2">
            딱 맞는 기능을 준비해 드릴게요
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isActive = selectedMode === mode.id

            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                data-testid={`badge-mode-${mode.id}`}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                  isActive ? mode.activeColor : mode.color
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? mode.activeIconColor : mode.iconColor}`}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="text-[17px] font-semibold">{mode.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedMode}
        className={`w-full h-14 rounded-[16px] font-semibold text-white transition-all ${
          selectedMode
            ? "bg-[#b455e0] hover:bg-[#9240b8] active:scale-[0.98]"
            : "bg-[#B0B8C1]"
        }`}
        data-testid="button-next"
      >
        다음
      </button>
    </main>
  )
}
