"use client"

import { MemoryArchive } from "@/components/family/memory-archive"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { ArrowLeft, Crown } from "lucide-react"
import Link from "next/link"

export default function ArchivePage() {
  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link 
              href="/family" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <div>
              <h1 className="text-[17px] font-bold text-[#191F28]">추억 보관함</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[12px] font-semibold">
            <Crown className="w-3.5 h-3.5" />
            Premium
          </div>
        </div>
      </header>

      <MemoryArchive />
      <FamilyBottomNav />
    </main>
  )
}
