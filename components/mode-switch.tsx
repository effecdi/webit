"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Gem, PartyPopper, X } from "lucide-react"

interface ModeSwitchProps {
  currentMode: "dating" | "wedding"
}

export function ModeSwitch({ currentMode }: ModeSwitchProps) {
  const router = useRouter()
  const [showCongratulations, setShowCongratulations] = useState(false)

  const handleWeddingClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const isOnboardingComplete = localStorage.getItem("wedding_onboarding_complete")
    
    if (isOnboardingComplete === "true") {
      localStorage.setItem("selected_mode", "wedding")
      router.push("/wedding")
    } else {
      setShowCongratulations(true)
    }
  }

  const handleDatingClick = () => {
    localStorage.setItem("selected_mode", "dating")
    router.push("/dating")
  }

  const handleContinueToOnboarding = () => {
    setShowCongratulations(false)
    localStorage.setItem("selected_mode", "wedding")
    router.push("/wedding/onboarding")
  }

  return (
    <>
      <div className="flex items-center bg-[#F2F4F6] rounded-full p-1">
        <button
          onClick={handleDatingClick}
          className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
            currentMode === "dating"
              ? "bg-white text-pink-500 shadow-sm"
              : "text-[#8B95A1] hover:text-[#4E5968]"
          }`}
          data-testid="button-mode-dating"
        >
          <Heart className="w-4 h-4" />
          <span>연애</span>
        </button>
        <button
          onClick={handleWeddingClick}
          className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full transition-all ${
            currentMode === "wedding"
              ? "bg-white text-[#3182F6] shadow-sm"
              : "text-[#8B95A1] hover:text-[#4E5968]"
          }`}
          data-testid="button-mode-wedding"
        >
          <Gem className="w-4 h-4" />
          <span>결혼</span>
        </button>
      </div>

      {showCongratulations && (
        <div 
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowCongratulations(false)}
        >
          <div 
            className="bg-white rounded-[28px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-[#3182F6] to-[#1B64DA] p-8 text-center">
              <button 
                onClick={() => setShowCongratulations(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                data-testid="button-close-congratulations"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                    <PartyPopper className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Gem className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '0.1s' }}>
                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-[28px] font-bold text-white leading-tight">
                결혼을 축하합니다!
              </h2>
              <p className="text-white/80 text-[15px] mt-2">
                이제 특별한 날을 함께 준비해요
              </p>
            </div>
            
            <div className="p-6">
              <p className="text-center text-[15px] text-[#4E5968] mb-6">
                결혼 준비에 필요한 정보를 입력하시면<br/>
                더 맞춤화된 서비스를 제공해 드려요
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleContinueToOnboarding}
                  className="w-full py-4 bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold rounded-[14px] transition-all flex items-center justify-center gap-2"
                  data-testid="button-start-wedding-onboarding"
                >
                  <Gem className="w-5 h-5" />
                  결혼 준비 시작하기
                </button>
                
                <button
                  onClick={() => setShowCongratulations(false)}
                  className="w-full py-3 text-[#8B95A1] text-[14px]"
                  data-testid="button-close-later"
                >
                  나중에 할게요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
