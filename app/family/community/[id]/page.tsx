"use client"

import { use } from "react"
import { CommunityDetailPage } from "@/components/community/community-detail-page"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

export default function FamilyCommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <CommunityDetailPage
      config={{
        mode: "family",
        postId: id,
        backHref: "/family/community",
        accentColor: "text-green-600",
        accentBg: "bg-green-600",
        accentLight: "bg-green-50",
        gradient: "from-green-400 to-emerald-500",
        gradientColors: ["#4ADE80", "#34D399", "#10B981"],
        bottomNav: <FamilyBottomNav />,
      }}
    />
  )
}
