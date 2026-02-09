"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { usePremium } from "@/hooks/use-premium"
import {
  ArrowLeft, Sparkles, MapPin, Clock, Wallet, Lightbulb,
  Lock, Crown, Send, Loader2, Users
} from "lucide-react"

interface Recommendation {
  title: string
  description: string
  places: string[]
  estimatedCost: string
  duration: string
  ageGroup: string
  tip: string
}

const ACTIVITY_OPTIONS = ["야외 활동", "실내 활동", "체험/교육", "맛집 탐방", "문화/공연", "자연/캠핑"]
const CHILD_AGE_OPTIONS = ["영유아 (0-3세)", "유아 (4-6세)", "초등 저학년", "초등 고학년", "전연령"]

export default function AIFamilyRecommendPage() {
  const router = useRouter()
  const { canUseAI, isLoading: premiumLoading } = usePremium()
  const [location, setLocation] = useState("")
  const [activityType, setActivityType] = useState("")
  const [childAge, setChildAge] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai/family-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: location || undefined,
          activityType: activityType || undefined,
          childAge: childAge || undefined,
        }),
      })
      const data = await res.json()
      if (data.error) {
        alert(data.message || data.error)
        return
      }
      setRecommendations(data.recommendations || [])
      setHasGenerated(true)
    } catch {
      alert("추천 생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (premiumLoading) {
    return (
      <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D]">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
        <FamilyBottomNav />
      </main>
    )
  }

  if (!canUseAI) {
    return (
      <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D]">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
          <div className="flex items-center px-4 h-14 max-w-md mx-auto">
            <button onClick={() => router.back()} className="p-2" data-testid="button-back">
              <ArrowLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
            </button>
            <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">AI 가족 활동 추천</h1>
            <div className="w-9" />
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-8 pt-32 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-[22px] font-bold text-[#191F28] dark:text-white mb-2">프리미엄 전용 기능</h2>
          <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 mb-8 leading-relaxed">
            프리미엄 멤버십을 구독하면<br />AI가 맞춤 가족 활동을 추천해드려요
          </p>
          <button
            onClick={() => router.push("/family/profile")}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-[14px] flex items-center gap-2"
            data-testid="button-go-premium"
          >
            <Crown className="w-5 h-5" />
            프리미엄 구독하기
          </button>
        </div>
        <FamilyBottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-[#F7F8FA] dark:bg-[#0D0D0D] pb-24">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#E5E8EB] dark:border-gray-800">
        <div className="flex items-center px-4 h-14 max-w-md mx-auto">
          <button onClick={() => router.back()} className="p-2" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-[#191F28] dark:text-white" />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold text-[#191F28] dark:text-white">AI 가족 활동 추천</h1>
          <div className="w-9" />
        </div>
      </header>

      <div className="px-5 py-6 max-w-md mx-auto space-y-5">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[20px] p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-[15px] font-bold">AI 맞춤 가족 활동</span>
          </div>
          <p className="text-[13px] opacity-80">
            가족 구성과 취향에 맞는 활동과 나들이 코스를 추천받으세요
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-[16px] p-5 shadow-sm space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[#4E5968] dark:text-gray-300 mb-2 block">지역 (선택)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 서울, 경기, 제주도"
              className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-[#2a2a2a] rounded-[12px] text-[14px] text-[#191F28] dark:text-white outline-none focus:ring-2 focus:ring-green-500/30"
              data-testid="input-location"
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#4E5968] dark:text-gray-300 mb-2 block">활동 유형</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_OPTIONS.map(a => (
                <button
                  key={a}
                  onClick={() => setActivityType(activityType === a ? "" : a)}
                  className={`px-3 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    activityType === a
                      ? "bg-green-500 text-white"
                      : "bg-[#F2F4F6] dark:bg-[#2a2a2a] text-[#4E5968] dark:text-gray-300"
                  }`}
                  data-testid={`activity-${a}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#4E5968] dark:text-gray-300 mb-2 block">아이 나이</label>
            <div className="flex flex-wrap gap-2">
              {CHILD_AGE_OPTIONS.map(age => (
                <button
                  key={age}
                  onClick={() => setChildAge(childAge === age ? "" : age)}
                  className={`px-3 py-2 rounded-full text-[13px] font-medium transition-colors ${
                    childAge === age
                      ? "bg-green-500 text-white"
                      : "bg-[#F2F4F6] dark:bg-[#2a2a2a] text-[#4E5968] dark:text-gray-300"
                  }`}
                  data-testid={`age-${age}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-[14px] flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            data-testid="button-generate"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI가 추천 중...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                가족 활동 추천받기
              </>
            )}
          </button>
        </div>

        {hasGenerated && recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-[16px] font-bold text-[#191F28] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-green-500" />
              추천 가족 활동
            </h3>
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1A1A1A] rounded-[16px] p-5 shadow-sm"
                data-testid={`recommendation-${idx}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-[16px] font-bold text-[#191F28] dark:text-white">{rec.title}</h4>
                  {rec.ageGroup && (
                    <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[11px] font-medium rounded-full flex items-center gap-1">
                      <Users className="w-3 h-3" /> {rec.ageGroup}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#4E5968] dark:text-gray-300 mb-4 leading-relaxed">{rec.description}</p>
                <div className="space-y-2 mb-3">
                  {rec.places.map((place, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-[13px] text-[#191F28] dark:text-white">{place}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#8B95A1] dark:text-gray-400 border-t border-[#F2F4F6] dark:border-gray-800 pt-3">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> {rec.estimatedCost}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {rec.duration}
                  </span>
                </div>
                {rec.tip && (
                  <div className="flex items-start gap-2 mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-[10px]">
                    <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-green-700 dark:text-green-300">{rec.tip}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <FamilyBottomNav />
    </main>
  )
}
