"use client"

import { MemoryArchive } from "@/components/family/memory-archive"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

export default function ArchivePage() {
  return (
    <main className="min-h-dvh bg-black pb-20">
      <header className="sticky top-0 sticky-header-safe z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-center px-4 h-12 max-w-md mx-auto">
          <h1 className="text-[17px] font-semibold text-white" data-testid="text-page-title">추억</h1>
        </div>
      </header>

      <MemoryArchive />
      <FamilyBottomNav />
    </main>
  )
}
