"use client"

import { FamilyGallery } from "@/components/family/family-gallery"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FamilyGalleryPage() {
  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link 
              href="/family" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="link-back-family"
            >
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[17px] font-bold text-[#191F28]">갤러리</h1>
          </div>
        </div>
      </header>

      <FamilyGallery />
      <FamilyBottomNav />
    </main>
  )
}
