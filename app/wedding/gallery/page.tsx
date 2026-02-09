"use client"

import { WeddingGallery } from "@/components/wedding/wedding-gallery"
import { WeddingNav } from "@/components/wedding-nav"
import { ModeSwitch } from "@/components/mode-switch"
import { Bell } from "lucide-react"

export default function WeddingGalleryPage() {
  return (
    <main className="min-h-dvh bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b-3 border-secondary">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="font-serif text-lg font-bold">갤러리</span>
          <div className="flex items-center gap-2">
            <ModeSwitch currentMode="wedding" />
            <button className="w-10 h-10 flex items-center justify-center border-2 border-secondary hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <WeddingGallery />
      <WeddingNav />
    </main>
  )
}
