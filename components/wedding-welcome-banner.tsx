"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Gift, X, Sparkles } from "lucide-react"

export function WeddingWelcomeBanner() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenBanner, setHasSeenBanner] = useState(true)

  useEffect(() => {
    // 클라이언트에서만 localStorage 체크
    const seen = localStorage.getItem("weve-wedding-welcome-seen")
    if (!seen) {
      setHasSeenBanner(false)
      // 약간의 딜레이 후 배너 표시 (애니메이션 효과)
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      localStorage.setItem("weve-wedding-welcome-seen", "true")
      setHasSeenBanner(true)
    }, 300)
  }

  const handleNavigateToInvitation = () => {
    localStorage.setItem("weve-wedding-welcome-seen", "true")
    setHasSeenBanner(true)
    router.push("/wedding/invitation")
  }

  if (hasSeenBanner) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center transition-all duration-300 ${
        isVisible ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0 pointer-events-none"
      }`}
      onClick={handleDismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl transition-all duration-500 ${
          isVisible ? "translate-y-0" : "translate-y-full sm:translate-y-8 sm:scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-[#B0B0B0]" />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-10 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full bg-[#E8F3FF] flex items-center justify-center">
              <Gift className="w-10 h-10 text-[#3182F6]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h2 className="text-[22px] font-bold text-[#191F28] mb-2">
            결혼을 축하드려요!
          </h2>
          <p className="text-[15px] text-[#8B95A1] mb-8 leading-relaxed">
            특별한 날을 위한 모바일 청첩장을
            <br />
            무료로 만들어 드릴게요
          </p>

          <button
            onClick={handleNavigateToInvitation}
            className="block w-full bg-[#3182F6] rounded-[16px] py-4 px-6 text-[17px] font-semibold text-white hover:bg-[#1B64DA] active:scale-[0.98] transition-all"
          >
            청첩장 만들기
          </button>

          <button
            onClick={handleDismiss}
            className="mt-4 text-[14px] text-[#B0B8C1] hover:text-[#8B95A1] transition-colors"
          >
            나중에 할게요
          </button>
        </div>

        {/* Handle bar for mobile */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#E0E0E0] sm:hidden" />
      </div>
    </div>
  )
}
