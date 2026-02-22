"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"
import { CoupleProfile } from "@/components/dating/couple-profile"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { Bell, LogOut, Crown, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.clear()
    window.location.href = "/api/logout"
  }

  return (
    <main className="min-h-dvh bg-[#F7F8FA] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
          <h1 className="text-[20px] font-bold text-[#191F28]">프로필</h1>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5 text-[#4E5968]" />
          </button>
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* Couple Profile */}
        <CoupleProfile />

        {/* Membership Card */}
        <div className="bg-gradient-to-r from-[#FFE4EC] to-[#E4F0FF] dark:from-[#3D1F2E] dark:to-[#1F2E3D] rounded-[20px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[15px] font-bold text-[#191F28]">프리미엄 멤버십</span>
            </div>
            <span className="px-2 py-1 bg-white/60 rounded-full text-[11px] font-medium text-[#8B95A1]">
              무료 체험 중
            </span>
          </div>
          <p className="text-[13px] text-[#4E5968] mb-4">
            사진 500장 저장, 커플 통계, 고급 캘린더 등 다양한 혜택을 누려보세요
          </p>
          <button 
            onClick={() => router.push("/dating/membership")}
            className="w-full py-3 bg-white hover:bg-white/90 rounded-[12px] text-[14px] font-semibold text-[#191F28] transition-colors flex items-center justify-center gap-2"
            data-testid="button-membership-subscribe"
          >
            <Star className="w-4 h-4 text-amber-500" />
            멤버십 구독
          </button>
        </div>

        {/* Settings Menu with ProfileSettingsSection */}
        <ProfileSettingsSection mode="dating" />

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-[13px] text-[#B0B8C1]">앱 버전 1.0.0</p>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full py-4 bg-white hover:bg-[#F8F9FA] rounded-[16px] shadow-sm text-[15px] font-medium text-red-500 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>


      <DatingBottomNav />
    </main>
  )
}
