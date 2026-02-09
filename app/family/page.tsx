"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { FamilyWeveDashboard } from "@/components/family/family-weve-dashboard"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { HistoryBookIntro } from "@/components/family/history-book-intro"
import { PartyPopper, Home, Heart, BookOpen, Calendar, X } from "lucide-react"

export default function FamilyHomePage() {
  const [showIntro, setShowIntro] = useState(false)
  const [showFamilyModal, setShowFamilyModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasSeenIntro = localStorage.getItem("weve-family-intro-seen")
    const transitionPending = localStorage.getItem("family_transition_pending")

    if (transitionPending === "true") {
      localStorage.removeItem("family_transition_pending")
      setShowFamilyModal(true)
    } else if (!hasSeenIntro) {
      setShowIntro(true)
    }
  }, [])

  const handleIntroComplete = () => {
    localStorage.setItem("weve-family-intro-seen", "true")
    setShowIntro(false)
  }

  const handleCloseModal = () => {
    setShowFamilyModal(false)
    const hasSeenIntro = localStorage.getItem("weve-family-intro-seen")
    if (!hasSeenIntro) {
      setShowIntro(true)
    }
  }

  if (showIntro && !showFamilyModal) {
    return <HistoryBookIntro onComplete={handleIntroComplete} />
  }

  return (
    <>
      <FamilyWeveDashboard />
      <FamilyBottomNav />

      {showFamilyModal && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/50 min-h-screen flex items-center justify-center p-5"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-[28px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-green-500 to-green-700 p-8 text-center">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                data-testid="button-close-family-modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <PartyPopper className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Home className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="absolute -bottom-1 -left-1 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-[26px] font-bold text-white leading-tight">
                가족이 된 것을
                <br />
                축하드립니다!
              </h2>
              <p className="text-white/90 text-[15px] mt-3 leading-relaxed">
                이제 가족모드에서
                <br />
                우리의 앞으로 미래를 그려나가요
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-[14px]">
                  <BookOpen className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-[#4E5968] leading-relaxed">
                    여태껏 쌓아온 추억들은 <span className="font-semibold text-green-600">추억 보관함</span>에 소중히 보관되어 있어요
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#F3E8FF] rounded-[14px]">
                  <Calendar className="w-5 h-5 text-[#d63bf2] mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-[#4E5968] leading-relaxed">
                    우리의 일정도 <span className="font-semibold text-[#d63bf2]">캘린더</span>에 그대로 남아있으니 앞으로도 여기에서 이용해주세요
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[14px] transition-all flex items-center justify-center gap-2"
                data-testid="button-start-family-mode"
              >
                <Home className="w-5 h-5" />
                가족 모드 시작하기
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
