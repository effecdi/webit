"use client"

import React from "react"

import { useState } from "react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { 
  ArrowLeft, 
  Settings, 
  LogOut,
  Heart,
  Camera,
  Crown,
  Gift,
  Calendar,
  X,
  Check,
  Star,
  ImageIcon,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"

// Calculate D-Day
const WEDDING_DATE = "2025-05-24"
const calculateDday = (date: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const wedding = new Date(date)
  wedding.setHours(0, 0, 0, 0)
  const diff = wedding.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function WeddingProfilePage() {
  const dday = calculateDday(WEDDING_DATE)
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState<"groom" | "bride" | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  const [groomProfile, setGroomProfile] = useState({
    name: "주호",
    photo: "",
  })
  
  const [brideProfile, setBrideProfile] = useState({
    name: "현정",
    photo: "",
  })

  const handlePhotoUpload = (type: "groom" | "bride", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (type === "groom") {
        setGroomProfile({ ...groomProfile, photo: url })
      } else {
        setBrideProfile({ ...brideProfile, photo: url })
      }
    }
    setShowPhotoModal(null)
  }

  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link 
              href="/wedding" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[17px] font-bold text-[#191F28]">프로필</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors">
            <Settings className="w-5 h-5 text-[#4E5968]" />
          </button>
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto space-y-4">
        
        {/* Couple Profile Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm">
          {/* Edit Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                isEditing 
                  ? "bg-[#FF8A80] text-white" 
                  : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
              }`}
            >
              {isEditing ? "완료" : "편집"}
            </button>
          </div>

          {/* Couple Avatars */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Groom */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border-3 border-[#3182F6]">
                  {groomProfile.photo ? (
                    <img src={groomProfile.photo || "/placeholder.svg"} alt="신랑" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#3182F6]">{groomProfile.name[0]}</span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">신랑</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowPhotoModal("groom")}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4E5968]" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={groomProfile.name}
                  onChange={(e) => setGroomProfile({ ...groomProfile, name: e.target.value })}
                  className="mt-2 w-16 text-center text-[15px] font-bold text-[#191F28] bg-transparent border-b-2 border-[#3182F6] focus:outline-none"
                />
              ) : (
                <span className="mt-2 text-[15px] font-bold text-[#191F28]">{groomProfile.name}</span>
              )}
            </div>

            {/* Heart */}
            <div className="flex flex-col items-center -mt-6">
              <Heart className="w-8 h-8 text-[#FF8A80]" fill="currentColor" />
            </div>

            {/* Bride */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden border-3 border-[#FF8A80]">
                  {brideProfile.photo ? (
                    <img src={brideProfile.photo || "/placeholder.svg"} alt="신부" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#FF8A80]">{brideProfile.name[0]}</span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF8A80] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">신부</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowPhotoModal("bride")}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4E5968]" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={brideProfile.name}
                  onChange={(e) => setBrideProfile({ ...brideProfile, name: e.target.value })}
                  className="mt-2 w-16 text-center text-[15px] font-bold text-[#191F28] bg-transparent border-b-2 border-[#FF8A80] focus:outline-none"
                />
              ) : (
                <span className="mt-2 text-[15px] font-bold text-[#191F28]">{brideProfile.name}</span>
              )}
            </div>
          </div>

          {/* Wedding Info */}
          <div className="bg-gradient-to-r from-blue-50 via-pink-50 to-pink-50 rounded-[16px] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FF8A80]" />
                <span className="text-[14px] text-[#4E5968]">결혼식</span>
              </div>
              <span className="text-[14px] font-bold text-[#191F28]">2025.05.24</span>
            </div>
            <div className="flex items-center justify-center mt-3">
              <div className="px-4 py-2 bg-white rounded-full shadow-sm">
                <span className="text-[18px] font-bold text-[#FF8A80]">D-{dday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Card */}
        <div className="bg-gradient-to-br from-[#FFE4EC] to-[#E4F0FF] rounded-[20px] p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-[15px] font-bold text-[#191F28]">프리미엄 멤버십</span>
          </div>
          <p className="text-[13px] text-[#4E5968] mb-4">
            무제한 청첩장 제작, 고급 템플릿, 광고 제거 등 다양한 혜택을 누려보세요
          </p>
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="w-full py-3 bg-white hover:bg-white/90 rounded-[12px] text-[14px] font-semibold text-[#191F28] transition-colors flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 text-amber-500" />
            멤버십 구독하기
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-[#3182F6]" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">12</p>
            <p className="text-[12px] text-[#8B95A1]">완료한 할일</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-[#FF8A80]" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">3</p>
            <p className="text-[12px] text-[#8B95A1]">청첩장</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">5</p>
            <p className="text-[12px] text-[#8B95A1]">예약 일정</p>
          </div>
        </div>

        {/* Settings Menu with ProfileSettingsSection */}
        <ProfileSettingsSection mode="wedding" />

        {/* Logout */}
        <button className="w-full flex items-center justify-center gap-2 py-4 text-[#FF6B6B] text-[15px] font-medium hover:bg-white rounded-[16px] transition-colors">
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
            <div className="bg-gradient-to-br from-[#FF8A80] to-[#FF6B6B] p-6 text-center relative">
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[24px] font-bold text-white">Wedding Premium</h3>
              <p className="text-white/80 text-[14px] mt-1">완벽한 결혼 준비를 위한 프리미엄</p>
            </div>
            
            {/* Price */}
            <div className="py-6 text-center border-b border-[#F2F4F6]">
              <span className="text-[36px] font-bold text-[#191F28]">9,900</span>
              <span className="text-[18px] text-[#8B95A1]">원/월</span>
            </div>
            
            {/* Benefits */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">무제한 청첩장 제작</p>
                  <p className="text-[12px] text-[#8B95A1]">프리미엄 템플릿 무제한 이용</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">무제한 사진 저장</p>
                  <p className="text-[12px] text-[#8B95A1]">고화질 사진 무제한 업로드</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">광고 제거</p>
                  <p className="text-[12px] text-[#8B95A1]">광고 없는 깔끔한 환경</p>
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
                className="w-full py-4 bg-gradient-to-r from-[#FF8A80] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#FF5252] text-white font-bold rounded-[14px] transition-all"
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
              <p className="text-[14px] text-[#8B95A1] mb-5">Wedding Premium 월 9,900원</p>
              
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

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={() => setShowPhotoModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            <h3 className="text-[17px] font-bold text-[#191F28] text-center mb-6">
              {showPhotoModal === "groom" ? "신랑" : "신부"} 사진 변경
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 py-4 bg-[#3182F6] text-white rounded-[14px] font-semibold cursor-pointer">
                <Camera className="w-5 h-5" />
                사진 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(showPhotoModal, e)}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowPhotoModal(null)}
                className="w-full py-4 bg-[#F2F4F6] text-[#4E5968] rounded-[14px] font-semibold"
              >
                취소
              </button>
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </main>
  )
}
