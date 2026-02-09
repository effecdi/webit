"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Crown, ImageIcon, Heart, Calendar, Star, Sparkles, BookOpen, Palette, BarChart3, Zap } from "lucide-react"

interface MembershipPageProps {
  mode: "dating" | "family"
}

const featureCards = {
  advanced: [
    {
      icon: ImageIcon,
      title: "사진 500장 저장",
      description: "고화질 원본 사진을 안전하게 클라우드에 저장하세요. 소중한 추억을 잃어버리지 않도록 보관해드립니다.",
      gradient: "from-[#4A90D9] to-[#67B8E3]",
    },
    {
      icon: BarChart3,
      title: "커플 통계 리포트",
      description: "데이트 기록, 함께한 시간, 방문 장소 등 우리만의 통계를 한눈에 확인하세요.",
      gradient: "from-[#E8794A] to-[#F0A05C]",
    },
    {
      icon: Calendar,
      title: "고급 캘린더",
      description: "반복 일정, 스마트 알림, D-day 위젯으로 중요한 날을 놓치지 마세요.",
      gradient: "from-[#9B59B6] to-[#C471ED]",
    },
    {
      icon: Palette,
      title: "프리미엄 위젯 5종",
      description: "커스텀 디자인 위젯으로 홈 화면을 우리만의 스타일로 꾸며보세요.",
      gradient: "from-[#E74C8B] to-[#F472B6]",
    },
  ],
  premium: [
    {
      icon: Sparkles,
      title: "AI 데이트 코스 추천",
      description: "AI가 우리의 취향과 날씨, 위치를 분석해 완벽한 데이트 코스를 추천해드려요.",
      gradient: "from-[#4A90D9] to-[#67B8E3]",
    },
    {
      icon: ImageIcon,
      title: "무제한 사진 저장",
      description: "용량 걱정 없이 모든 사진을 원본 그대로 저장하세요. 추억은 무한하니까요.",
      gradient: "from-[#E8794A] to-[#F0A05C]",
    },
    {
      icon: BookOpen,
      title: "히스토리 북",
      description: "우리의 이야기를 예쁜 포토북으로 만들어보세요. 특별한 날의 선물로도 완벽해요.",
      gradient: "from-[#9B59B6] to-[#C471ED]",
    },
    {
      icon: Zap,
      title: "모든 프리미엄 기능",
      description: "고급 플랜의 모든 기능을 포함하고, 앞으로 추가되는 프리미엄 기능도 모두 이용할 수 있어요.",
      gradient: "from-[#E74C8B] to-[#F472B6]",
    },
  ],
}

const familyFeatureCards = {
  advanced: [
    {
      icon: ImageIcon,
      title: "가족 앨범 500장",
      description: "고화질 원본 가족 사진을 안전하게 클라우드에 저장하세요. 아이의 성장 기록도 간직해요.",
      gradient: "from-[#2ECC71] to-[#27AE60]",
    },
    {
      icon: Heart,
      title: "가족 성장 리포트",
      description: "아이 성장 기록과 가족 활동 통계를 한눈에 확인하세요.",
      gradient: "from-[#E8794A] to-[#F0A05C]",
    },
    {
      icon: Calendar,
      title: "가족 캘린더",
      description: "가족 일정 공유 및 스마트 리마인더로 중요한 날을 놓치지 마세요.",
      gradient: "from-[#3498DB] to-[#5DADE2]",
    },
    {
      icon: Palette,
      title: "가족 위젯 5종",
      description: "커스텀 디자인 위젯으로 홈 화면을 우리 가족 스타일로 꾸며보세요.",
      gradient: "from-[#9B59B6] to-[#C471ED]",
    },
  ],
  premium: [
    {
      icon: Sparkles,
      title: "AI 가족 활동 추천",
      description: "AI가 우리 가족의 취향과 날씨, 위치를 분석해 완벽한 가족 활동을 추천해드려요.",
      gradient: "from-[#2ECC71] to-[#27AE60]",
    },
    {
      icon: ImageIcon,
      title: "무제한 가족 앨범",
      description: "용량 걱정 없이 모든 사진을 원본 그대로 저장하세요.",
      gradient: "from-[#E8794A] to-[#F0A05C]",
    },
    {
      icon: BookOpen,
      title: "히스토리 북",
      description: "우리 가족의 이야기를 예쁜 포토북으로 만들어보세요. 특별한 날의 선물로도 완벽해요.",
      gradient: "from-[#3498DB] to-[#5DADE2]",
    },
    {
      icon: Zap,
      title: "모든 프리미엄 기능",
      description: "고급 플랜의 모든 기능을 포함하고, 앞으로 추가되는 프리미엄 기능도 모두 이용할 수 있어요.",
      gradient: "from-[#9B59B6] to-[#C471ED]",
    },
  ],
}

export function MembershipPage({ mode }: MembershipPageProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<"advanced" | "premium">("advanced")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const cards = mode === "family" ? familyFeatureCards : featureCards
  const currentCards = selectedPlan === "advanced" ? cards.advanced : cards.premium

  const modeColors = {
    dating: {
      accent: "text-[#d63bf2]",
      headerGradient: "from-[#d63bf2] to-[#a855f7]",
      tabActive: "text-[#d63bf2] border-[#d63bf2]",
      ctaGradient: "from-[#d63bf2] to-[#a855f7]",
      ctaBorder: "border-[#d63bf2] text-[#d63bf2]",
      ctaHover: "hover:bg-[#d63bf2]/10",
    },
    family: {
      accent: "text-green-500",
      headerGradient: "from-green-500 to-green-600",
      tabActive: "text-green-600 border-green-600",
      ctaGradient: "from-green-500 to-green-600",
      ctaBorder: "border-green-500 text-green-600",
      ctaHover: "hover:bg-green-50",
    },
  }

  const colors = modeColors[mode]

  const handleStripeCheckout = async (planType: "monthly" | "yearly") => {
    setIsProcessingPayment(true)
    try {
      const productsRes = await fetch("/api/stripe/products")
      const { products } = await productsRes.json()

      const targetProduct = products.find((p: any) => p.metadata?.tier === selectedPlan)
      if (!targetProduct || !targetProduct.prices?.length) {
        alert("구독 상품을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.")
        setIsProcessingPayment(false)
        return
      }

      const targetPrice = targetProduct.prices.find((p: any) => {
        const meta = p.metadata || {}
        if (planType === "monthly" && p.recurring?.interval === "month") {
          return !meta.mode || meta.mode === mode
        }
        if (planType === "yearly" && p.recurring?.interval === "year") {
          return !meta.mode || meta.mode === mode
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
        body: JSON.stringify({ priceId: targetPrice.id, mode }),
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

  return (
    <main className="min-h-dvh bg-[#0A0A0A]">
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md safe-area-top">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            data-testid="button-membership-back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[17px] font-bold text-white">Premium</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <span className="text-[15px] text-white/80 font-medium">프리미엄 구독</span>
          {selectedPlan === "advanced" ? (
            <button
              onClick={() => handleStripeCheckout("monthly")}
              disabled={isProcessingPayment}
              className={`px-5 py-2.5 bg-gradient-to-r ${colors.ctaGradient} text-white text-[13px] font-bold rounded-full transition-all disabled:opacity-50`}
              data-testid="button-top-subscribe"
            >
              {isProcessingPayment ? "처리 중..." : "구독 결제하기"}
            </button>
          ) : (
            <div className="px-5 py-2.5 bg-white/10 text-white/40 text-[13px] font-bold rounded-full cursor-not-allowed">
              곧 출시
            </div>
          )}
        </div>

        <div className="flex mx-5 mb-6 bg-white/10 rounded-full p-1">
          <button
            onClick={() => setSelectedPlan("advanced")}
            className={`flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all ${
              selectedPlan === "advanced"
                ? "bg-white text-[#0A0A0A]"
                : "text-white/60"
            }`}
            data-testid="tab-advanced"
          >
            고급
          </button>
          <button
            onClick={() => setSelectedPlan("premium")}
            className={`flex-1 py-2.5 text-[13px] font-semibold rounded-full transition-all ${
              selectedPlan === "premium"
                ? "bg-white text-[#0A0A0A]"
                : "text-white/60"
            }`}
            data-testid="tab-premium"
          >
            프리미엄
          </button>
        </div>

        {selectedPlan === "advanced" && (
          <div className="px-5 mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[16px] text-white/40 line-through">3,900원</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[11px] font-bold rounded-full">할인 중</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-[42px] font-bold text-white">1,900</span>
              <span className="text-[18px] text-white/50">원/월</span>
            </div>
            <p className="text-[13px] text-white/40 text-center mt-1">연간 결제 시 20% 할인 (월 1,520원)</p>
          </div>
        )}

        {selectedPlan === "premium" && (
          <div className="px-5 mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded-full">BEST</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-[42px] font-bold text-white">6,900</span>
              <span className="text-[18px] text-white/50">원/월</span>
            </div>
            <p className="text-[13px] text-white/40 text-center mt-1">연간 결제 시 20% 할인 (월 5,520원)</p>
          </div>
        )}

        <div className="px-5 space-y-5 pb-8">
          {currentCards.map((card, index) => (
            <div
              key={index}
              className={`rounded-[20px] overflow-hidden bg-gradient-to-br ${card.gradient}`}
              data-testid={`feature-card-${index}`}
            >
              <div className="p-6">
                <div className="bg-white/15 backdrop-blur-sm rounded-[16px] p-5 mb-5 flex items-center justify-center min-h-[140px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPlan === "premium" && index === 0 && (
                        <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full">AI</span>
                      )}
                    </div>
                  </div>
                </div>
                <h3 className="text-[20px] font-bold text-white mb-2">{card.title}</h3>
                <p className="text-[14px] text-white/80 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}

          {selectedPlan === "premium" && (
            <div className="rounded-[20px] bg-white/5 border border-white/10 p-6 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-[18px] font-bold text-white mb-2">곧 출시 예정</p>
              <p className="text-[14px] text-white/50 leading-relaxed">
                프리미엄 플랜은 현재 준비 중이에요.<br />
                더 강력한 기능으로 곧 찾아올게요!
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]/0 pt-8 pb-safe-area px-5">
          <div className="pb-6">
            {selectedPlan === "advanced" ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleStripeCheckout("monthly")}
                  disabled={isProcessingPayment}
                  className={`w-full py-4 bg-gradient-to-r ${colors.ctaGradient} text-white font-bold rounded-[14px] transition-all disabled:opacity-50 text-[15px]`}
                  data-testid="button-subscribe-monthly"
                >
                  {isProcessingPayment ? "처리 중..." : "고급 월간 구독하기 (1,900원/월)"}
                </button>
                <button
                  onClick={() => handleStripeCheckout("yearly")}
                  disabled={isProcessingPayment}
                  className={`w-full py-3.5 border-2 ${colors.ctaBorder} font-semibold rounded-[14px] ${colors.ctaHover} transition-all disabled:opacity-50 text-[14px]`}
                  data-testid="button-subscribe-yearly"
                >
                  {isProcessingPayment ? "처리 중..." : "연간 구독하기 (18,240원/년, 20% 할인)"}
                </button>
              </div>
            ) : (
              <div
                className="w-full py-4 bg-white/10 text-white/40 font-bold rounded-[14px] text-center cursor-not-allowed text-[15px]"
                data-testid="button-premium-coming-soon"
              >
                출시 알림 받기
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
