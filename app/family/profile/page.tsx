"use client"

import { useState } from "react"
import { FamilyCoupleProfile } from "@/components/family/family-couple-profile"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { ArrowLeft, LogOut, Crown, Star, X, Heart, ImageIcon, Calendar, Home, Check } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function FamilyProfilePage() {
  const { user } = useAuth()
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"advanced" | "premium">("advanced")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handleStripeCheckout = async (planType: "monthly" | "yearly") => {
    setIsProcessingPayment(true)
    try {
      const productsRes = await fetch("/api/stripe/products")
      const { products } = await productsRes.json()

      const targetTier = selectedPlan
      const targetProduct = products.find((p: any) => p.metadata?.tier === targetTier)

      if (!targetProduct || !targetProduct.prices?.length) {
        alert("구독 상품을 찾을 수 없습니다.")
        setIsProcessingPayment(false)
        return
      }

      const targetPrice = targetProduct.prices.find((p: any) => {
        const meta = p.metadata || {}
        if (planType === "monthly" && p.recurring?.interval === "month") {
          return meta.mode === "family" || !meta.mode
        }
        if (planType === "yearly" && p.recurring?.interval === "year") {
          return meta.mode === "family" || !meta.mode
        }
        return false
      })

      if (!targetPrice) {
        alert("가격 정보를 찾을 수 없습니다.")
        setIsProcessingPayment(false)
        return
      }

      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: targetPrice.id, mode: "family" }),
      })

      const { url, error } = await checkoutRes.json()
      if (error) {
        alert(error)
        setIsProcessingPayment(false)
        return
      }
      window.location.href = url
    } catch (err) {
      console.error("Checkout error:", err)
      alert("결제 처리 중 오류가 발생했습니다.")
      setIsProcessingPayment(false)
    }
  }

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
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link 
              href="/family" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="link-back-family"
            >
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
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
            무제한 가족 앨범, 캘린더 공유, 위젯 커스터마이징 등 다양한 혜택을 누려보세요
          </p>
          <button 
            onClick={() => setShowPremiumModal(true)}
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

      {/* Premium Subscription Modal */}
      {showPremiumModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowPremiumModal(false)}
        >
          <div 
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-center relative">
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                data-testid="button-close-premium-modal"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[24px] font-bold text-white">Family Premium</h3>
              <p className="text-white/80 text-[14px] mt-1">더 행복한 가족 이야기</p>
            </div>

            {/* Plan Tabs */}
            <div className="flex border-b border-[#F2F4F6]">
              <button 
                onClick={() => setSelectedPlan("advanced")}
                className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${selectedPlan === "advanced" ? "text-green-600 border-b-2 border-green-600" : "text-[#8B95A1]"}`}
                data-testid="tab-advanced"
              >
                고급
              </button>
              <button 
                onClick={() => setSelectedPlan("premium")}
                className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${selectedPlan === "premium" ? "text-green-600 border-b-2 border-green-600" : "text-[#8B95A1]"}`}
                data-testid="tab-premium"
              >
                프리미엄
              </button>
            </div>

            {/* Advanced Plan */}
            {selectedPlan === "advanced" && (
              <>
                <div className="py-5 text-center border-b border-[#F2F4F6]">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[14px] text-[#8B95A1] line-through">3,000원/월</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[11px] font-bold rounded-full">첫 달 할인</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[36px] font-bold text-[#191F28]">1,900</span>
                    <span className="text-[18px] text-[#8B95A1]">원/월</span>
                  </div>
                  <p className="text-[12px] text-[#8B95A1] mt-1">첫 달 이후 3,000원/월</p>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">가족 앨범 500장</p>
                      <p className="text-[12px] text-[#8B95A1]">고화질 원본 사진 저장</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">광고 제거</p>
                      <p className="text-[12px] text-[#8B95A1]">방해 없이 가족 공간을 즐기세요</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#b455e0]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">가족 캘린더</p>
                      <p className="text-[12px] text-[#8B95A1]">가족 일정 공유 및 리마인더</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">가족 위젯</p>
                      <p className="text-[12px] text-[#8B95A1]">커스텀 위젯 디자인 5종</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Premium Plan */}
            {selectedPlan === "premium" && (
              <>
                <div className="py-5 text-center border-b border-[#F2F4F6]">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-bold rounded-full">BEST</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[36px] font-bold text-[#191F28]">6,900</span>
                    <span className="text-[18px] text-[#8B95A1]">원/월</span>
                  </div>
                  <p className="text-[12px] text-green-600 mt-1">연간 결제 시 20% 할인 (월 5,520원)</p>
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">무제한 가족 앨범</p>
                      <p className="text-[12px] text-[#8B95A1]">용량 걱정 없이 추억을 저장하세요</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">광고 제거</p>
                      <p className="text-[12px] text-[#8B95A1]">방해 없이 가족 공간을 즐기세요</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#b455e0]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">고급 캘린더 + 공유</p>
                      <p className="text-[12px] text-[#8B95A1]">가족 캘린더 실시간 공유 및 동기화</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">프리미엄 위젯 전체</p>
                      <p className="text-[12px] text-[#8B95A1]">모든 위젯 디자인 + 커스터마이징</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">고화질 원본 평생 보관</p>
                      <p className="text-[12px] text-[#8B95A1]">추억을 영원히 간직하세요</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#191F28]">히스토리 북 무제한</p>
                      <p className="text-[12px] text-[#8B95A1]">가족 히스토리 북 무제한 생성</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* CTA */}
            <div className="px-5 pb-6">
              <button 
                onClick={() => handleStripeCheckout("monthly")}
                disabled={isProcessingPayment}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-[14px] transition-all disabled:opacity-50"
                data-testid="button-subscribe-monthly"
              >
                {isProcessingPayment ? "처리 중..." : `${selectedPlan === "advanced" ? "고급" : "프리미엄"} 월간 구독하기`}
              </button>
              {selectedPlan === "premium" && (
                <button 
                  onClick={() => handleStripeCheckout("yearly")}
                  disabled={isProcessingPayment}
                  className="w-full py-3 mt-2 border-2 border-green-500 text-green-600 font-semibold rounded-[14px] hover:bg-green-50 transition-all disabled:opacity-50"
                  data-testid="button-subscribe-yearly"
                >
                  {isProcessingPayment ? "처리 중..." : "연간 구독하기 (20% 할인)"}
                </button>
              )}
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

      {/* Payment processing is now handled via Stripe Checkout redirect */}

      <FamilyBottomNav />
    </main>
  )
}
