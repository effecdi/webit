"use client"

import { CommunityPage } from "@/components/community/community-page"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

export default function FamilyCommunityPage() {
  return (
    <CommunityPage
      config={{
        mode: "family",
        backHref: "/family",
        title: "가족 커뮤니티",
        accentColor: "text-green-600",
        accentBg: "bg-green-600",
        accentLight: "bg-green-50",
        gradient: "from-green-400 to-emerald-500",
        categories: ["육아", "가족생활", "교육", "가족여행", "살림/요리", "건강", "자유"],
        bottomNav: <FamilyBottomNav />,
      }}
    />
  )
}
