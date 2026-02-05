"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Calendar, MapPin, DollarSign, ChevronRight, ArrowLeft } from "lucide-react"

type Step = 1 | 2 | 3

interface WeddingData {
  weddingDate: string
  venueName: string
  budget: string
}

export default function WeddingOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [fadeIn, setFadeIn] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [data, setData] = useState<WeddingData>({
    weddingDate: "",
    venueName: "",
    budget: ""
  })

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (step < 3) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStep((step + 1) as Step)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setStep((step - 1) as Step)
        setIsTransitioning(false)
      }, 300)
    } else {
      router.push("/onboarding")
    }
  }

  const handleComplete = () => {
    localStorage.setItem("wedding_date", data.weddingDate)
    localStorage.setItem("wedding_venue", data.venueName)
    localStorage.setItem("wedding_budget", data.budget)
    localStorage.setItem("wedding_onboarding_complete", "true")
    localStorage.setItem("selected_mode", "wedding")
    
    setIsTransitioning(true)
    setTimeout(() => router.push("/wedding"), 400)
  }

  const canProceedStep1 = data.weddingDate.trim() !== ""
  const canProceedStep2 = data.venueName.trim() !== ""
  const canComplete = true

  const formatBudget = (value: string) => {
    const num = value.replace(/[^\d]/g, "")
    if (!num) return ""
    return new Intl.NumberFormat("ko-KR").format(parseInt(num))
  }

  const handleBudgetChange = (value: string) => {
    const num = value.replace(/[^\d]/g, "")
    setData({ ...data, budget: num })
  }

  return (
    <main 
      className={`min-h-dvh bg-white flex flex-col transition-opacity duration-400 ${
        fadeIn && !isTransitioning ? "opacity-100" : "opacity-0"
      }`}
    >
      <header className="flex items-center px-4 py-3 border-b border-gray-100">
        <button 
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center -ml-2"
          data-testid="button-back"
        >
          <ArrowLeft className="w-6 h-6 text-[#191F28]" />
        </button>
        <div className="flex-1" />
      </header>

      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="mb-8">
          <div className="flex gap-1.5 mb-8">
            <div className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${step >= 1 ? "bg-[#3182F6]" : "bg-gray-200"}`} />
            <div className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${step >= 2 ? "bg-[#3182F6]" : "bg-gray-200"}`} />
            <div className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${step >= 3 ? "bg-[#3182F6]" : "bg-gray-200"}`} />
          </div>

          {step === 1 && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              <div className="w-16 h-16 bg-[#3182F6]/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-[#3182F6]" />
              </div>
              <h1 className="text-[28px] font-bold text-[#191F28] leading-tight mb-2">
                결혼식 날짜가<br/>언제인가요?
              </h1>
              <p className="text-[15px] text-[#8B95A1]">
                D-day 카운트와 일정 관리를 도와드릴게요
              </p>
            </div>
          )}

          {step === 2 && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-pink-500" />
              </div>
              <h1 className="text-[28px] font-bold text-[#191F28] leading-tight mb-2">
                예식장이<br/>어디인가요?
              </h1>
              <p className="text-[15px] text-[#8B95A1]">
                아직 정하지 않았다면 비워두셔도 돼요
              </p>
            </div>
          )}

          {step === 3 && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-amber-500" />
              </div>
              <h1 className="text-[28px] font-bold text-[#191F28] leading-tight mb-2">
                예산은<br/>얼마로 생각하세요?
              </h1>
              <p className="text-[15px] text-[#8B95A1]">
                예산 관리를 도와드릴게요
              </p>
            </div>
          )}
        </div>

        <div className={`flex-1 transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">결혼식 날짜</label>
                <input
                  type="date"
                  value={data.weddingDate}
                  onChange={(e) => setData({ ...data, weddingDate: e.target.value })}
                  className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] outline-none focus:ring-2 focus:ring-[#3182F6] [&::-webkit-calendar-picker-indicator]:opacity-100"
                  data-testid="input-wedding-date"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">예식장 이름</label>
                <input
                  type="text"
                  value={data.venueName}
                  onChange={(e) => setData({ ...data, venueName: e.target.value })}
                  placeholder="예: 더베일, 라비돌웨딩홀"
                  className="w-full h-14 px-5 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#3182F6]"
                  data-testid="input-venue-name"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-[14px] font-medium text-[#4E5968] mb-2 block">총 예산 (원)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatBudget(data.budget)}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    placeholder="예: 50,000,000"
                    className="w-full h-14 px-5 pr-12 bg-[#F3F5F7] rounded-[16px] text-[17px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#3182F6]"
                    data-testid="input-budget"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8B95A1]">원</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#F8F9FA] rounded-[16px]">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="text-[15px] font-semibold text-[#191F28]">입력하신 정보</span>
                </div>
                <div className="space-y-2 text-[14px] text-[#4E5968]">
                  <div className="flex justify-between">
                    <span>결혼식 날짜</span>
                    <span className="font-medium text-[#191F28]">
                      {data.weddingDate ? new Date(data.weddingDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>예식장</span>
                    <span className="font-medium text-[#191F28]">{data.venueName || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>예산</span>
                    <span className="font-medium text-[#191F28]">
                      {data.budget ? `${formatBudget(data.budget)}원` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-8">
        {step === 1 && (
          <button
            onClick={handleNext}
            disabled={!canProceedStep1}
            className={`w-full h-14 rounded-[16px] font-semibold text-white flex items-center justify-center gap-2 transition-all ${
              canProceedStep1 
                ? "bg-[#3182F6] hover:bg-[#1B64DA] active:scale-[0.98]" 
                : "bg-[#B0B8C1]"
            }`}
            data-testid="button-next-step1"
          >
            다음
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {step === 2 && (
          <div className="flex gap-3">
            <button
              onClick={handleNext}
              className="flex-1 h-14 rounded-[16px] font-semibold text-[#4E5968] bg-[#F3F5F7] active:bg-[#E5E8EB] transition-all"
              data-testid="button-skip-venue"
            >
              건너뛰기
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceedStep2}
              className={`flex-1 h-14 rounded-[16px] font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                canProceedStep2 
                  ? "bg-[#3182F6] hover:bg-[#1B64DA] active:scale-[0.98]" 
                  : "bg-[#B0B8C1]"
              }`}
              data-testid="button-next-step2"
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="w-full h-14 rounded-[16px] font-semibold text-white bg-[#3182F6] hover:bg-[#1B64DA] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            data-testid="button-complete"
          >
            시작하기
            <Heart className="w-5 h-5" />
          </button>
        )}
      </div>
    </main>
  )
}
