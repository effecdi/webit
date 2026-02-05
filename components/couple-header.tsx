"use client"

import { Bell, Settings } from "lucide-react"

export function CoupleHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b-3 border-secondary">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary border-2 border-secondary flex items-center justify-center">
              <span className="font-serif text-secondary-foreground font-bold text-lg">L</span>
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-foreground">LOVEY</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Magazine for Couples</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="w-10 h-10 border-2 border-secondary bg-card flex items-center justify-center hover:bg-primary transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
            <button className="w-10 h-10 border-2 border-secondary bg-card flex items-center justify-center hover:bg-primary transition-colors">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
