"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FamilyCoupleProfile } from "@/components/family/family-couple-profile"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { LogOut, Crown, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function FamilyProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.removeItem("survey_myName")
    localStorage.removeItem("survey_partnerName")
    localStorage.removeItem("survey_firstMeetDate")
    localStorage.removeItem("survey_myBirthday")
    localStorage.removeItem("survey_partnerBirthday")
    localStorage.removeItem("selected_mode")
    localStorage.removeItem("wedding_onboarding_complete")
    window.location.href = "/api/logout"
  }

  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 sticky-header-safe z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-[17px] font-bold text-[#191F28]">프로필</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto space-y-4">
        <FamilyCoupleProfile />

        {/* Membership Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[20px] p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold">Family Premium</span>
          </div>
          <p className="text-[13px] opacity-80 mb-4">
            가족 앨범 500장, 성장 리포트, 스마트 알림 등 다양한 혜택을 누려보세요
          </p>
          <button 
            onClick={() => router.push("/family/membership")}
            className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-[12px] text-[14px] font-semibold text-white transition-colors flex items-center justify-center gap-2"
            data-testid="button-membership-subscribe"
          >
            <Star className="w-4 h-4" />
            멤버십 구독
          </button>
        </div>

        {/* Settings Menu with ProfileSettingsSection */}
        <ProfileSettingsSection mode="family" />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-4 text-[#FF6B6B] text-[15px] font-medium hover:bg-white rounded-[16px] transition-colors disabled:opacity-50"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>


      <FamilyBottomNav />
    </main>
  )
}
