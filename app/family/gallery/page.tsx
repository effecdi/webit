"use client"

import { FamilyGallery } from "@/components/family/family-gallery"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

export default function FamilyGalleryPage() {
  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 sticky-header-safe z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center px-5 h-14 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">갤러리</h1>
        </div>
      </header>

      <FamilyGallery />
      <FamilyBottomNav />
    </main>
  )
}
