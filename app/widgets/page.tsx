"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { FloatingBackButton } from "@/components/shared/floating-back-button"
import { 
  ArrowLeft, Heart, Calendar, Sparkles, CheckSquare, 
  MessageCircle, Gift, Image as ImageIcon, Crown, Check, Lock, 
  Smartphone, X, Zap, Camera
} from "lucide-react"
import Image from "next/image"
import splashLogo from "@/attached_assets/webeat.logo_1770644808504.png"

type WidgetType = {
  id: string
  name: string
  description: string
  icon: React.ElementType
  isPremium: boolean
  category: "basic" | "premium"
  previewComponent: React.ReactNode
}

function PhoneMockup({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[200px] h-[420px] bg-[#1a1a2e] rounded-[36px] border-[3px] border-[#2a2a3e] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[28px] bg-[#1a1a2e] rounded-b-[14px] z-20" />
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[50px] h-[4px] bg-[#2a2a3e] rounded-full z-30" />
        
        <div className="absolute inset-[3px] rounded-[33px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] relative">
            <div className="absolute top-10 left-4 text-white/60 text-[11px] font-medium">9:41</div>
            <div className="absolute top-10 right-4 flex gap-1">
              <div className="w-4 h-2 bg-white/60 rounded-sm" />
            </div>
            <div className="pt-16 px-3">
              {children}
            </div>
          </div>
        </div>
      </div>
      {label && <p className="text-[12px] text-[#8B95A1] dark:text-gray-400 text-center font-medium">{label}</p>}
    </div>
  )
}

function DDayWidgetPreview() {
  const days = 365
  return (
    <div className="bg-gradient-to-br from-[#d63bf2]/90 to-[#a82cbf]/90 rounded-[20px] p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="text-white/80 text-[11px] font-medium">WE:BEAT</span>
      </div>
      <div className="text-white text-[32px] font-bold tracking-tight leading-none">D+{days}</div>
      <div className="text-white/60 text-[11px] mt-1 font-medium">우리가 함께한 날</div>
      <div className="flex items-center gap-2 mt-3">
        <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
          <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
        </div>
        <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
          <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
        </div>
        <span className="text-white/50 text-[10px] ml-1">함께하는 중</span>
      </div>
    </div>
  )
}

function CalendarWidgetPreview() {
  const today = new Date()
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
  return (
    <div className="bg-white/10 rounded-[20px] p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-[13px] font-bold">{today.getMonth() + 1}월</span>
        <span className="text-white/40 text-[10px]">WE:BEAT</span>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-white/40 text-[9px] text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 14 }, (_, i) => {
          const day = today.getDate() - 3 + i
          const isToday = i === 3
          const hasEvent = i === 5 || i === 8
          return (
            <div key={i} className={`relative w-full aspect-square rounded-full flex items-center justify-center text-[10px] ${
              isToday ? "bg-[#d63bf2] text-white font-bold" : "text-white/60"
            }`}>
              {day > 0 && day <= 31 ? day : ""}
              {hasEvent && <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-pink-400" />}
            </div>
          )
        })}
      </div>
      <div className="mt-3 bg-white/5 rounded-[10px] p-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#d63bf2] rounded-full" />
          <div>
            <p className="text-white text-[10px] font-medium">발렌타인 데이트</p>
            <p className="text-white/40 text-[9px]">14:00 카페</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MoodSyncWidgetPreview() {
  return (
    <div className="bg-gradient-to-br from-[#ff6b9d]/80 to-[#c44dff]/80 rounded-[20px] p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-[11px] font-bold">커플 무드</span>
        <Sparkles className="w-3.5 h-3.5 text-white/60" />
      </div>
      <div className="flex items-center justify-center gap-6 my-3">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[22px]">
            <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
          </div>
          <span className="text-white/60 text-[9px]">나</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
            <Zap className="w-3 h-3 text-yellow-300" />
          </div>
          <span className="text-yellow-300/80 text-[9px] mt-0.5">98%</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[22px]">
            <Heart className="w-6 h-6 text-red-300 fill-red-300" />
          </div>
          <span className="text-white/60 text-[9px]">상대</span>
        </div>
      </div>
      <div className="bg-white/10 rounded-[10px] p-2 text-center">
        <span className="text-white/80 text-[10px]">오늘 서로의 기분을 공유해요</span>
      </div>
    </div>
  )
}

function LoveLetterWidgetPreview() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] rounded-[20px] p-4 border border-[#d63bf2]/30">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-[#d63bf2]" />
        <span className="text-white/60 text-[10px]">오늘의 편지</span>
      </div>
      <p className="text-white text-[13px] font-medium leading-relaxed italic">
        &ldquo;매일 당신과 함께여서 행복해요&rdquo;
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[#d63bf2]/60 text-[9px]">2월 9일</span>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3 text-[#d63bf2] fill-[#d63bf2]" />
          <span className="text-[#d63bf2]/60 text-[9px]">from 상대</span>
        </div>
      </div>
    </div>
  )
}

function TodoWidgetPreview() {
  return (
    <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1b2838] rounded-[20px] p-4 border border-[#d63bf2]/20">
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare className="w-4 h-4 text-[#d63bf2]" />
        <span className="text-white/60 text-[10px]">커플 할 일</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-[#d63bf2] flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-[#d63bf2]" />
          </div>
          <span className="text-white/40 text-[10px] line-through">카페 예약하기</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-white/20" />
          <span className="text-white text-[10px]">선물 준비</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-white/20" />
          <span className="text-white text-[10px]">여행 계획 세우기</span>
        </div>
      </div>
      <div className="mt-3 bg-white/5 rounded-[8px] p-2 text-center">
        <span className="text-white/40 text-[9px]">완료 1/3</span>
      </div>
    </div>
  )
}

function AnniversaryWidgetPreview() {
  return (
    <div className="bg-gradient-to-br from-[#1e0533] to-[#0d001a] rounded-[20px] p-4 border border-[#d63bf2]/20">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="w-4 h-4 text-[#d63bf2]" />
        <span className="text-white/60 text-[10px]">기념일 리마인더</span>
      </div>
      <div className="space-y-2.5 mt-2">
        <div className="flex items-center justify-between bg-white/5 rounded-[10px] p-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#d63bf2]/30 flex items-center justify-center">
              <Heart className="w-3 h-3 text-[#d63bf2] fill-[#d63bf2]" />
            </div>
            <span className="text-white text-[10px] font-medium">200일</span>
          </div>
          <span className="text-[#d63bf2] text-[10px] font-bold">D-12</span>
        </div>
        <div className="flex items-center justify-between bg-white/5 rounded-[10px] p-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center">
              <Gift className="w-3 h-3 text-pink-400" />
            </div>
            <span className="text-white text-[10px] font-medium">생일</span>
          </div>
          <span className="text-pink-400 text-[10px] font-bold">D-28</span>
        </div>
        <div className="flex items-center justify-between bg-white/5 rounded-[10px] p-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-white text-[10px] font-medium">1주년</span>
          </div>
          <span className="text-amber-400 text-[10px] font-bold">D-45</span>
        </div>
      </div>
    </div>
  )
}

function PhotoSlideWidgetPreview() {
  return (
    <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1b2838] rounded-[20px] p-4 border border-[#d63bf2]/20">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-4 h-4 text-[#d63bf2]" />
        <span className="text-white/60 text-[10px]">포토 슬라이드</span>
      </div>
      <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-gradient-to-br from-[#d63bf2]/40 to-purple-900/60 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="flex items-center gap-2">
          <ImageIcon className="w-8 h-8 text-white/40" />
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-[10px] font-medium">우리의 소중한 순간들</p>
          <p className="text-white/40 text-[8px]">갤러리에서 자동 회전</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#d63bf2]" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>
    </div>
  )
}

const WIDGET_DATA: WidgetType[] = [
  {
    id: "dday",
    name: "D-Day 위젯",
    description: "커플 D-Day를 홈 화면에서 바로 확인",
    icon: Heart,
    isPremium: false,
    category: "basic",
    previewComponent: <DDayWidgetPreview />,
  },
  {
    id: "calendar",
    name: "캘린더 위젯",
    description: "다가오는 일정과 기념일을 한눈에",
    icon: Calendar,
    isPremium: false,
    category: "basic",
    previewComponent: <CalendarWidgetPreview />,
  },
  {
    id: "todo",
    name: "할 일 위젯",
    description: "커플 할 일 목록을 한눈에 확인",
    icon: CheckSquare,
    isPremium: false,
    category: "basic",
    previewComponent: <TodoWidgetPreview />,
  },
  {
    id: "mood_sync",
    name: "무드 싱크 위젯",
    description: "실시간 감정 공유 & 궁합도 표시",
    icon: Sparkles,
    isPremium: true,
    category: "premium",
    previewComponent: <MoodSyncWidgetPreview />,
  },
  {
    id: "love_letter",
    name: "러브레터 위젯",
    description: "매일 서로에게 한 줄 편지 전달",
    icon: MessageCircle,
    isPremium: true,
    category: "premium",
    previewComponent: <LoveLetterWidgetPreview />,
  },
  {
    id: "anniversary",
    name: "기념일 리마인더 위젯",
    description: "100일, 200일, 1주년 등 다가오는 기념일 자동 알림",
    icon: Gift,
    isPremium: true,
    category: "premium",
    previewComponent: <AnniversaryWidgetPreview />,
  },
  {
    id: "photo_slide",
    name: "포토 슬라이드 위젯",
    description: "커플 갤러리 사진을 자동으로 회전 감상",
    icon: Camera,
    isPremium: true,
    category: "premium",
    previewComponent: <PhotoSlideWidgetPreview />,
  },
]

export default function WidgetStorePage() {
  const router = useRouter()
  const [selectedWidget, setSelectedWidget] = useState<WidgetType | null>(null)
  const [enabledWidgets, setEnabledWidgets] = useState<string[]>(["dday"])
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [userPlan, setUserPlan] = useState<string>("free")

  useEffect(() => {
    fetch("/api/widgets")
      .then(r => r.json())
      .then(data => {
        if (data.widgets) {
          setEnabledWidgets(data.widgets.filter((w: any) => w.isEnabled).map((w: any) => w.type))
        }
      })
      .catch(() => {})

    fetch("/api/stripe/subscription")
      .then(r => r.json())
      .then(data => {
        if (data.plan) setUserPlan(data.plan)
      })
      .catch(() => {})
  }, [])

  const toggleWidget = useCallback(async (widgetId: string) => {
    const isEnabled = !enabledWidgets.includes(widgetId)
    setEnabledWidgets(prev => 
      isEnabled ? [...prev, widgetId] : prev.filter(id => id !== widgetId)
    )
    try {
      await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: widgetId, isEnabled }),
      })
    } catch {}
  }, [enabledWidgets])

  const handlePremiumSubscribe = async () => {
    setIsProcessingPayment(true)
    try {
      const productsRes = await fetch("/api/stripe/products")
      const { products } = await productsRes.json()
      const premiumProduct = products?.find((p: any) => 
        p.metadata?.tier === "premium" || p.name?.toLowerCase().includes("premium")
      )
      if (!premiumProduct?.prices?.length) {
        alert("구독 상품을 찾을 수 없습니다.")
        setIsProcessingPayment(false)
        return
      }
      const monthlyPrice = premiumProduct.prices.find((p: any) => p.recurring?.interval === "month")
      const targetPrice = monthlyPrice || premiumProduct.prices[0]
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: targetPrice.id }),
      })
      const { url, error } = await checkoutRes.json()
      if (error) { alert(error); setIsProcessingPayment(false); return }
      window.location.href = url
    } catch {
      alert("결제 처리 중 오류가 발생했습니다.")
      setIsProcessingPayment(false)
    }
  }

  const isPremiumUser = userPlan === "premium" || userPlan === "advanced"
  const basicWidgets = WIDGET_DATA.filter(w => w.category === "basic")
  const premiumWidgets = WIDGET_DATA.filter(w => w.category === "premium")

  return (
    <div className="min-h-dvh bg-[#F7F8FA] dark:bg-gray-950">
      <div className="sticky top-0 sticky-header-safe z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-[#F2F4F6] dark:border-gray-800">
        <div className="flex items-center px-4 h-14">
          <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">
            위젯 스토어
          </h1>
        </div>
      </div>

      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <div className="inline-flex items-center gap-2 bg-[#d63bf2]/10 dark:bg-[#d63bf2]/20 px-4 py-2 rounded-full mb-3">
            <Smartphone className="w-4 h-4 text-[#d63bf2]" />
            <span className="text-[13px] font-semibold text-[#d63bf2]">홈 화면 위젯</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#191F28] dark:text-white mb-1">
            폰을 켤 때마다 우리
          </h2>
          <p className="text-[14px] text-[#8B95A1] dark:text-gray-400">
            위젯을 활성화하면 홈 화면에서 바로 확인해요
          </p>
        </motion.div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#d63bf2]" />
          <h3 className="text-[16px] font-bold text-[#191F28] dark:text-white">기본 위젯</h3>
          <span className="text-[12px] text-[#8B95A1] dark:text-gray-400 ml-1">무료</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
          {basicWidgets.map((widget, idx) => {
            const isEnabled = enabledWidgets.includes(widget.id)
            return (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="snap-center flex-shrink-0"
              >
                <PhoneMockup>
                  <div className="space-y-3">
                    {widget.previewComponent}
                  </div>
                </PhoneMockup>
                <div className="mt-3 text-center">
                  <p className="text-[15px] font-bold text-[#191F28] dark:text-white mb-1">{widget.name}</p>
                  <p className="text-[12px] text-[#8B95A1] dark:text-gray-400 mb-3 px-2">{widget.description}</p>
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    data-testid={`button-toggle-widget-${widget.id}`}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                      isEnabled
                        ? "bg-[#d63bf2] text-white"
                        : "bg-[#F2F4F6] dark:bg-gray-800 text-[#4E5968] dark:text-gray-300 hover:bg-[#E5E8EB] dark:hover:bg-gray-700"
                    }`}
                  >
                    {isEnabled ? (
                      <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 활성화됨</span>
                    ) : "활성화"}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <h3 className="text-[16px] font-bold text-[#191F28] dark:text-white">프리미엄 위젯</h3>
        </div>
        <p className="text-[13px] text-[#8B95A1] dark:text-gray-400 mb-4">구독하면 잠금 해제되는 특별한 위젯</p>
        
        <div className="space-y-3">
          {premiumWidgets.map((widget, idx) => {
            const Icon = widget.icon
            const isEnabled = enabledWidgets.includes(widget.id)
            const canUse = isPremiumUser
            return (
              <motion.button
                key={widget.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => setSelectedWidget(widget)}
                data-testid={`button-premium-widget-${widget.id}`}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-[20px] shadow-sm border border-[#F2F4F6] dark:border-gray-800 text-left transition-all hover:shadow-md active:scale-[0.98]"
              >
                <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 ${
                  canUse && isEnabled 
                    ? "bg-[#d63bf2] text-white" 
                    : "bg-gradient-to-br from-[#F3E8FF] to-[#E8D5FF] dark:from-[#2a1a3a] dark:to-[#1a0f2e] text-[#d63bf2]"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[15px] font-bold text-[#191F28] dark:text-white">{widget.name}</p>
                    {!canUse && <Lock className="w-3.5 h-3.5 text-[#8B95A1]" />}
                  </div>
                  <p className="text-[12px] text-[#8B95A1] dark:text-gray-400 mt-0.5">{widget.description}</p>
                </div>
                {canUse && isEnabled && (
                  <div className="w-6 h-6 rounded-full bg-[#d63bf2] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {!isPremiumUser && (
        <div className="px-5 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#d63bf2] to-[#a82cbf] rounded-[24px] p-6"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-amber-300" />
                <span className="text-white/90 text-[14px] font-bold">프리미엄 구독</span>
              </div>
              <p className="text-white/70 text-[13px] mb-4 leading-relaxed">
                무드싱크, 러브레터, 기념일 리마인더, 포토 슬라이드 위젯을 모두 이용하세요
              </p>
              <button
                onClick={handlePremiumSubscribe}
                disabled={isProcessingPayment}
                data-testid="button-widget-premium-subscribe"
                className="w-full py-3 bg-white text-[#d63bf2] font-bold text-[14px] rounded-[14px] transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
              >
                {isProcessingPayment ? "처리 중..." : "프리미엄 구독하기"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="h-20" />

      <BottomSheet
        open={!!selectedWidget}
        onOpenChange={(open) => { if (!open) setSelectedWidget(null) }}
        className="bg-white dark:bg-gray-900 max-h-[90vh] overflow-hidden"
      >
        {selectedWidget && (
          <>
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <h3 className="text-[19px] font-bold text-[#191F28] dark:text-white">{selectedWidget.name}</h3>
                <button
                  onClick={() => setSelectedWidget(null)}
                  data-testid="button-close-widget-detail"
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>

              <div className="px-5 pb-6">
                <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 mb-5">{selectedWidget.description}</p>
                
                <div className="flex justify-center mb-6">
                  <PhoneMockup label="홈 화면 미리보기">
                    <div className="space-y-3">
                      {selectedWidget.previewComponent}
                    </div>
                  </PhoneMockup>
                </div>

                {selectedWidget.isPremium && !isPremiumUser ? (
                  <button
                    onClick={handlePremiumSubscribe}
                    disabled={isProcessingPayment}
                    data-testid="button-widget-detail-subscribe"
                    className="w-full py-3.5 bg-gradient-to-r from-[#d63bf2] to-[#a82cbf] text-white font-bold text-[15px] rounded-[14px] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                  >
                    {isProcessingPayment ? "처리 중..." : "프리미엄 구독하고 사용하기"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toggleWidget(selectedWidget.id)
                      setSelectedWidget(null)
                    }}
                    data-testid="button-widget-detail-toggle"
                    className={`w-full py-3.5 font-bold text-[15px] rounded-[14px] transition-all active:scale-[0.98] ${
                      enabledWidgets.includes(selectedWidget.id)
                        ? "bg-[#F2F4F6] dark:bg-gray-800 text-[#4E5968] dark:text-gray-300"
                        : "bg-[#d63bf2] text-white"
                    }`}
                  >
                    {enabledWidgets.includes(selectedWidget.id) ? "위젯 비활성화" : "위젯 활성화"}
                  </button>
                )}
              </div>
          </>
        )}
      </BottomSheet>
      <FloatingBackButton />
    </div>
  )
}
