"use client"

import { use } from "react"
import { CommunityDetailPage } from "@/components/community/community-detail-page"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"

export default function WeddingCommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <CommunityDetailPage
      config={{
        mode: "wedding",
        postId: id,
        backHref: "/wedding/community",
        accentColor: "text-[#FF8A80]",
        accentBg: "bg-[#FF8A80]",
        accentLight: "bg-red-50",
        gradient: "from-[#FF8A80] to-[#FF6B6B]",
        gradientColors: ["#FF8A80", "#FF6B6B", "#FF5252"],
        bottomNav: <WeddingBottomNav />,
      }}
    />
  )
}
