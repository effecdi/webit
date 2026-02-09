"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"
import { usePremium } from "@/hooks/use-premium"
import {
  ArrowLeft, Camera, CalendarDays, CheckCircle2, Plane, Album,
  TrendingUp, Heart, Lock, Crown, BarChart3, Wallet
} from "lucide-react"

interface Stats {
  photos: number
  events: number
  todos: number
  completedTodos: number
  albums: number
  travels: number
  totalExpense: number
  daysTogether: number
}

interface ExpenseCategory {
  category: string
  amount: number
}

export default function CoupleStatsPage() {
  const router = useRouter()
  const { isPaid, isLoading: premiumLoading } = usePremium()
  const [stats, setStats] = useState<Stats | null>(null)
  const [topExpenses, setTopExpenses] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (premiumLoading) return
    if (!isPaid) {
      setIsLoading(false)
      return
    }
    fetch("/api/couple-stats")
      .then(r => r.json())
      .then(data => {
        setStats(data.stats)
        setTopExpenses(data.topExpenseCategories || [])
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [isPaid, premiumLoading])

  if (premiumLoading || isLoading) {
    return (
      <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D]">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
          <div className="flex items-center px-4 h-14 max-w-md mx-auto">
            <button onClick={() => router.back()} className="p-2" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">커플 통계 리포트</h1>
            <div className="w-9" />
          </div>
        </header>
        <div className="px-5 py-8 max-w-md mx-auto space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-[#E5E8EB] dark:bg-[#2a2a2a] rounded-[16px] animate-pulse" />
          ))}
        </div>
        <DatingBottomNav />
      </main>
    )
  }

  if (!isPaid) {
    return (
      <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D]">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
          <div className="flex items-center px-4 h-14 max-w-md mx-auto">
            <button onClick={() => router.back()} className="p-2" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">커플 통계 리포트</h1>
            <div className="w-9" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-8 pt-32 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-[22px] font-bold text-[#191F28] dark:text-white mb-2">프리미엄 기능</h2>
          <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 mb-8 leading-relaxed">
            고급 또는 프리미엄 멤버십을 구독하면<br />커플 통계 리포트를 확인할 수 있어요
          </p>
          <button
            onClick={() => router.push("/dating/membership")}
            className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-[14px] flex items-center gap-2"
            data-testid="button-go-premium"
          >
            <Crown className="w-5 h-5" />
            멤버십 구독하기
          </button>
        </div>
        <DatingBottomNav />
      </main>
    )
  }

  const statCards = [
    { icon: Camera, label: "함께 찍은 사진", value: `${stats?.photos || 0}장`, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
    { icon: CalendarDays, label: "함께한 일정", value: `${stats?.events || 0}개`, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { icon: CheckCircle2, label: "완료한 할일", value: `${stats?.completedTodos || 0}/${stats?.todos || 0}`, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { icon: Album, label: "만든 앨범", value: `${stats?.albums || 0}개`, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { icon: Plane, label: "함께한 여행", value: `${stats?.travels || 0}회`, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
    { icon: Wallet, label: "총 지출", value: `${(stats?.totalExpense || 0).toLocaleString()}원`, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
  ]

  return (
    <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D] pb-24">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
        <div className="flex items-center px-4 h-14 max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">커플 통계 리포트</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="px-5 py-6 max-w-md mx-auto space-y-5">
        <div className="bg-gradient-to-br from-[#d63bf2] to-[#a855f7] rounded-[20px] p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-5 h-5" />
            <span className="text-[15px] font-semibold opacity-90">우리의 기록</span>
          </div>
          <p className="text-[42px] font-bold leading-none mb-1">
            {stats?.daysTogether || 0}
          </p>
          <p className="text-[14px] opacity-80">일째 함께하고 있어요</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {statCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1A1A1A] rounded-[16px] p-4 shadow-sm"
                data-testid={`stat-card-${idx}`}
              >
                <div className={`w-10 h-10 ${card.bg} rounded-full flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-[12px] text-[#8B95A1] dark:text-gray-400 mb-1">{card.label}</p>
                <p className="text-[20px] font-bold text-[#191F28] dark:text-white">{card.value}</p>
              </div>
            )
          })}
        </div>

        {topExpenses.length > 0 && (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-[16px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#d63bf2]" />
              <h3 className="text-[16px] font-bold text-[#191F28] dark:text-white">지출 카테고리 TOP</h3>
            </div>
            <div className="space-y-3">
              {topExpenses.map((cat, idx) => {
                const maxAmount = topExpenses[0]?.amount || 1
                const ratio = (cat.amount / maxAmount) * 100
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] text-[#4E5968] dark:text-gray-300">{cat.category}</span>
                      <span className="text-[13px] font-semibold text-[#191F28] dark:text-white">
                        {cat.amount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F2F4F6] dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d63bf2] to-[#a855f7] rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-[#1A1A1A] rounded-[16px] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h3 className="text-[16px] font-bold text-[#191F28] dark:text-white">할일 달성률</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F2F4F6" strokeWidth="3" className="dark:stroke-gray-800" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" stroke="#d63bf2" strokeWidth="3"
                  strokeDasharray={`${((stats?.completedTodos || 0) / Math.max(stats?.todos || 1, 1)) * 100} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[16px] font-bold text-[#191F28] dark:text-white">
                  {stats?.todos ? Math.round((stats.completedTodos / stats.todos) * 100) : 0}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-[14px] text-[#4E5968] dark:text-gray-300">
                전체 {stats?.todos || 0}개 중 {stats?.completedTodos || 0}개 완료
              </p>
              <p className="text-[12px] text-[#8B95A1] dark:text-gray-500 mt-1">
                {(stats?.completedTodos || 0) > (stats?.todos || 0) / 2 ? "잘하고 있어요! 계속 화이팅!" : "조금만 더 힘내봐요!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DatingBottomNav />
    </main>
  )
}
