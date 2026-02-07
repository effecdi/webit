"use client"

import { MemoryArchive } from "@/components/family/memory-archive"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ArchivePage() {
  return (
    <main className="min-h-dvh bg-black pb-20">
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-center px-4 h-12 max-w-md mx-auto relative">
          <Link 
            href="/family" 
            className="absolute left-2 w-10 h-10 flex items-center justify-center"
            data-testid="link-back-family"
          >
            <ArrowLeft className="w-5 h-5 text-[#0A84FF]" />
          </Link>
          <h1 className="text-[17px] font-semibold text-white" data-testid="text-page-title">추억</h1>
        </div>
      </header>

      <MemoryArchive />
      <FamilyBottomNav />
    </main>
  )
}
