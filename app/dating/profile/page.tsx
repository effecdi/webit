"use client"

import { useState } from "react"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"
import { CoupleProfile } from "@/components/dating/couple-profile"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { Bell, LogOut, Crown, Star, X, Heart, ImageIcon, Calendar, Check } from "lucide-react"

export default function ProfilePage() {
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

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
        <div className="bg-gradient-to-r from-[#FFE4EC] to-[#E4F0FF] rounded-[20px] p-5 shadow-sm">
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
            무제한 사진 저장, 위젯 커스터마이징 등 다양한 혜택을 누려보세요
          </p>
          <button 
            onClick={() => setShowPremiumModal(true)}
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
          className="w-full py-4 bg-white hover:bg-[#F8F9FA] rounded-[16px] shadow-sm text-[15px] font-medium text-red-500 flex items-center justify-center gap-2 transition-colors"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>

      {/* Premium Subscription Modal */}
      {showPremiumModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowPremiumModal(false)}
        >
          <div 
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 text-center relative">
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[24px] font-bold text-white">WE:VE Premium</h3>
              <p className="text-white/80 text-[14px] mt-1">더 특별한 우리의 이야기</p>
            </div>
            
            {/* Price */}
            <div className="py-6 text-center border-b border-[#F2F4F6]">
              <span className="text-[36px] font-bold text-[#191F28]">4,900</span>
              <span className="text-[18px] text-[#8B95A1]">원/월</span>
            </div>
            
            {/* Benefits */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">무제한 사진 저장</p>
                  <p className="text-[12px] text-[#8B95A1]">용량 걱정 없이 추억을 저장하세요</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">광고 없는 환경</p>
                  <p className="text-[12px] text-[#8B95A1]">방해 없이 둘만의 공간을 즐기세요</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">고급 캘린더 기능</p>
                  <p className="text-[12px] text-[#8B95A1]">반복 일정, 알림 설정 등 추가 기능</p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="px-5 pb-6">
              <button 
                onClick={() => {
                  setShowPremiumModal(false)
                  setShowPaymentModal(true)
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-[14px] transition-all"
              >
                구독하기
              </button>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-3 text-[#8B95A1] text-[14px] mt-2"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowPaymentModal(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            <div className="px-5 pb-8">
              <h3 className="text-[19px] font-bold text-[#191F28] mb-2">결제 수단 선택</h3>
              <p className="text-[14px] text-[#8B95A1] mb-5">WE:VE Premium 월 4,900원</p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    alert("카카오페이로 결제를 진행합니다")
                    setShowPaymentModal(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-[#FEE500] rounded-[14px] hover:bg-[#FFEB3B] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#3C1E1E] rounded-[10px] flex items-center justify-center">
                    <span className="text-[#FEE500] font-bold text-[14px]">K</span>
                  </div>
                  <span className="text-[16px] font-semibold text-[#3C1E1E]">카카오페이로 결제</span>
                </button>

                <button 
                  onClick={() => {
                    alert("토스로 결제를 진행합니다")
                    setShowPaymentModal(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-[#0064FF] rounded-[14px] hover:bg-[#0052CC] transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center">
                    <span className="text-[#0064FF] font-bold text-[14px]">T</span>
                  </div>
                  <span className="text-[16px] font-semibold text-white">토스로 결제</span>
                </button>

                <button 
                  onClick={() => {
                    alert("신용카드로 결제를 진행합니다")
                    setShowPaymentModal(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-[#F2F4F6] rounded-[14px] hover:bg-[#E5E8EB] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#4E5968] rounded-[10px] flex items-center justify-center">
                    <span className="text-white font-bold text-[12px]">CARD</span>
                  </div>
                  <span className="text-[16px] font-semibold text-[#191F28]">신용/체크카드로 결제</span>
                </button>

                <button 
                  onClick={() => {
                    alert("네이버페이로 결제를 진행합니다")
                    setShowPaymentModal(false)
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-[#03C75A] rounded-[14px] hover:bg-[#02B350] transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center">
                    <span className="text-[#03C75A] font-bold text-[14px]">N</span>
                  </div>
                  <span className="text-[16px] font-semibold text-white">네이버페이로 결제</span>
                </button>
              </div>
              
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-3 text-[#8B95A1] text-[14px] mt-4"
              >
                취소
              </button>
            </div>
            
            <div className="h-6" />
          </div>
        </div>
      )}

      <DatingBottomNav />
    </main>
  )
}
