"use client"

import { CommunityPage } from "@/components/community/community-page"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"

export default function DatingCommunityPage() {
  return (
    <CommunityPage
      config={{
        mode: "dating",
        backHref: "/dating",
        title: "연애 커뮤니티",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500",
        accentLight: "bg-pink-50",
        gradient: "from-pink-400 to-rose-500",
        gradientColors: ["#F472B6", "#FB7185", "#F43F5E", "#EC4899", "#F472B6"],
        categories: ["고민상담", "데이트코스", "연애팁", "기념일", "선물추천", "자유"],
        bottomNav: <DatingBottomNav />,
      }}
    />
  )
}
