"use client"

import { useState } from "react"
import { Heart, Gem, Home, ImageIcon, ChevronRight, Lock, Crown } from "lucide-react"
import Link from "next/link"

const ARCHIVE_CHAPTERS = [
  {
    id: "dating-2024",
    year: "2024",
    title: "연애 시절",
    subtitle: "우리의 시작",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    lightBg: "bg-pink-50",
    photoCount: 234,
    period: "2024.03 - 2024.12",
    highlights: ["첫 만남", "100일", "첫 여행"],
    isPremium: false,
  },
  {
    id: "wedding-prep-2025",
    year: "2025",
    title: "결혼 준비",
    subtitle: "함께 준비한 날들",
    icon: Gem,
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    photoCount: 189,
    period: "2025.01 - 2025.12",
    highlights: ["프로포즈", "스드메", "결혼식"],
    isPremium: false,
  },
  {
    id: "honeymoon-2025",
    year: "2025",
    title: "신혼",
    subtitle: "새로운 시작",
    icon: Home,
    gradient: "from-green-500 to-emerald-500",
    lightBg: "bg-green-50",
    photoCount: 48,
    period: "2025.12 - 현재",
    highlights: ["신혼여행", "새 집"],
    isPremium: true,
  },
]

export function MemoryArchive() {
  const [isPremiumUser] = useState(true)

  return (
    <div className="px-5 py-5 max-w-md mx-auto space-y-5">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[16px] p-4">
        <p className="text-[14px] text-green-700 leading-relaxed">
          <strong>추억 보관함</strong>에는 연애, 결혼 준비 기간의 모든 기록이 연도별로 정리되어 있어요.
        </p>
      </div>

      {/* Archive Chapters */}
      <section className="space-y-4">
        {ARCHIVE_CHAPTERS.map((chapter) => {
          const Icon = chapter.icon
          const isLocked = chapter.isPremium && !isPremiumUser

          return (
            <Link
              key={chapter.id}
              href={isLocked ? "#" : `/family/archive/${chapter.id}`}
              className={`block relative overflow-hidden bg-white rounded-[20px] shadow-sm transition-all ${
                isLocked ? "opacity-60" : "hover:shadow-md"
              }`}
            >
              {/* Gradient Header */}
              <div className={`h-3 bg-gradient-to-r ${chapter.gradient}`} />
              
              {isLocked && (
                <div className="absolute top-5 right-4 flex items-center gap-1 px-2.5 py-1 bg-[#191F28] text-white text-[11px] font-medium rounded-full">
                  <Lock className="w-3 h-3" />
                  Premium
                </div>
              )}

              <div className="p-5">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-[14px] ${chapter.lightBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 bg-gradient-to-r ${chapter.gradient} bg-clip-text`} style={{ color: chapter.gradient.includes('pink') ? '#ec4899' : chapter.gradient.includes('amber') ? '#f59e0b' : '#22c55e' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#F2F4F6] text-[#4E5968] rounded-full">
                        {chapter.year}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-[#191F28] mb-0.5">{chapter.title}</h3>
                    <p className="text-[13px] text-[#8B95A1] mb-3">{chapter.period}</p>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {chapter.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className={`text-[11px] px-2.5 py-1 rounded-full ${chapter.lightBg}`}
                          style={{ color: chapter.gradient.includes('pink') ? '#ec4899' : chapter.gradient.includes('amber') ? '#f59e0b' : '#22c55e' }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Photo Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[13px] text-[#8B95A1]">
                        <ImageIcon className="w-4 h-4" />
                        <span>{chapter.photoCount}장의 사진</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      {/* Premium Upsell */}
      {!isPremiumUser && (
        <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-[20px] p-5 border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-amber-500" />
            <h3 className="text-[16px] font-bold text-[#191F28]">고화질 원본으로 평생 소장하세요</h3>
          </div>
          <p className="text-[13px] text-[#4E5968] mb-4 leading-relaxed">
            무료 플랜은 1년이 지난 사진이 저화질로 보관됩니다.
            Premium 멤버십으로 업그레이드하면 모든 추억을 원본 그대로 영구 보관할 수 있어요.
          </p>
          <button className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-[14px] text-[15px] hover:opacity-90 transition-opacity">
            Premium 멤버십 시작하기 - 월 1,900원
          </button>
        </section>
      )}
    </div>
  )
}
