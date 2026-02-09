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
        accentColor: "text-[#3182F6]",
        accentBg: "bg-[#3182F6]",
        accentLight: "bg-blue-50",
        gradient: "from-[#3182F6] to-[#5BA8F7]",
        gradientColors: ["#3182F6", "#5BA8F7", "#2563EB", "#60A5FA", "#3182F6"],
        bottomNav: <WeddingBottomNav />,
      }}
    />
  )
}
