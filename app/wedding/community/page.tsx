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
        accentColor: "text-[#FF8A80]",
        accentBg: "bg-[#FF8A80]",
        accentLight: "bg-red-50",
        gradient: "from-[#FF8A80] to-[#FF6B6B]",
        categories: ["결혼준비", "웨딩업체", "예산/비용", "스드메", "허니문", "고민상담", "자유"],
        bottomNav: <WeddingBottomNav />,
      }}
    />
  )
}
