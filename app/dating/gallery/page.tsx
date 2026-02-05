"use client"

import { GalleryView } from "@/components/dating/gallery-view"
import { DatingBottomNav } from "@/components/dating/dating-bottom-nav"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      <GalleryView />
      <DatingBottomNav />
    </div>
  )
}
