"use client"

import { useState, useEffect } from "react"
import { Heart, Gem, Home, Book, Sparkles, ChevronRight } from "lucide-react"

interface HistoryBookIntroProps {
  onComplete: () => void
}

const MILESTONES = [
  { date: "2024.03.14", label: "첫 만남", icon: Heart, color: "text-pink-500" },
  { date: "2024.06.21", label: "100일", icon: Heart, color: "text-pink-500" },
  { date: "2024.12.25", label: "첫 크리스마스", icon: Sparkles, color: "text-amber-500" },
  { date: "2025.03.14", label: "1주년", icon: Heart, color: "text-pink-500" },
  { date: "2025.08.15", label: "프로포즈", icon: Gem, color: "text-[#3182F6]" },
  { date: "2025.12.20", label: "결혼식", icon: Home, color: "text-green-500" },
]

export function HistoryBookIntro({ onComplete }: HistoryBookIntroProps) {
  const [stage, setStage] = useState(0)
  const [visibleMilestones, setVisibleMilestones] = useState(0)

  useEffect(() => {
    if (stage === 1) {
      const interval = setInterval(() => {
        setVisibleMilestones((prev) => {
          if (prev >= MILESTONES.length) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 600)
      return () => clearInterval(interval)
    }
  }, [stage])

  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 2000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  return (
    <div className="fixed inset-0 z-50 bg-[#191F28] overflow-hidden">
      {/* Stage 0: Congratulations */}
      {stage === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <Home className="w-12 h-12 text-green-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            가족이 된 것을 축하합니다!
          </h1>
          <p className="text-white/60 text-center max-w-xs text-[15px]">
            현정 님과 주호 님, 이제 하나의 가족으로
            <br />
            새로운 이야기를 시작해보세요
          </p>
        </div>
      )}

      {/* Stage 1: Timeline */}
      {stage === 1 && (
        <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-[12px] tracking-[0.2em] text-white/40 uppercase mb-3">Our Journey</p>
            <h2 className="text-2xl font-bold text-white text-center mb-8 text-balance">
              연애부터 결혼까지
              <br />
              <span className="text-green-500">우리의 소중한 기록</span>
            </h2>

            {/* Timeline */}
            <div className="relative w-full max-w-xs space-y-3">
              {/* Vertical Line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10 rounded-full" />

              {MILESTONES.map((milestone, index) => {
                const Icon = milestone.icon
                const isVisible = index < visibleMilestones

                return (
                  <div
                    key={milestone.date}
                    className={`relative flex items-center gap-4 transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                  >
                    <div className="relative z-10 w-10 h-10 rounded-full bg-[#2D2D3A] flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${milestone.color}`} />
                    </div>
                    <div className="flex-1 py-2.5 px-4 bg-white/5 rounded-[14px]">
                      <p className="text-[11px] text-white/40">{milestone.date}</p>
                      <p className="text-[14px] font-medium text-white">{milestone.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {visibleMilestones >= MILESTONES.length && (
              <div className="mt-8 animate-fade-in">
                <button
                  onClick={() => setStage(2)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[14px] transition-colors"
                >
                  <span>추억 보관하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stage 2: Archive Confirmation */}
      {stage === 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <Book className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-3">
            추억이 히스토리 북에 저장되었어요
          </h2>
          <p className="text-white/50 text-center text-[14px] max-w-xs mb-8">
            연애부터 결혼까지의 모든 순간이
            <br />
            안전하게 보관되었어요. 언제든 꺼내볼 수 있어요.
          </p>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={onComplete}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[14px] transition-colors"
            >
              가족 모드 시작하기
            </button>
            <p className="text-center text-[12px] text-white/30">
              이제, 부부로서의 첫 페이지를 시작해 볼까요?
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
