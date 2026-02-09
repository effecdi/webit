"use client"

import { CommunityPage } from "@/components/community/community-page"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"

export default function WeddingCommunityPage() {
  return (
    <CommunityPage
      config={{
        mode: "wedding",
        backHref: "/wedding",
        title: "웨딩 커뮤니티",
        accentColor: "text-[#3182F6]",
        accentBg: "bg-[#3182F6]",
        accentLight: "bg-blue-50",
        gradient: "from-[#3182F6] to-[#5BA8F7]",
        gradientColors: ["#3182F6", "#5BA8F7", "#2563EB", "#60A5FA", "#3182F6"],
        categories: ["결혼준비", "웨딩업체", "예산/비용", "스드메", "허니문", "고민상담", "자유"],
        bottomNav: <WeddingBottomNav />,
      }}
    />
  )
}
