"use client"

import { use } from "react"
import { CommunityDetailPage } from "@/components/community/community-detail-page"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"

export default function DatingCommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <CommunityDetailPage
      config={{
        mode: "dating",
        postId: id,
        backHref: "/dating/community",
        accentColor: "text-pink-500",
        accentBg: "bg-pink-500",
        accentLight: "bg-pink-50",
        gradient: "from-pink-400 to-rose-500",
        gradientColors: ["#F472B6", "#FB7185", "#F43F5E"],
        bottomNav: <DatingBottomNav />,
      }}
    />
  )
}
