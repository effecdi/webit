"use client"

import { Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="px-4 py-6">
      <div className="relative border-3 border-secondary bg-card overflow-hidden">
        {/* Cover Image Area */}
        <div className="relative h-64 bg-gradient-to-br from-primary via-accent to-primary">
          {/* Magazine Style Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary border-4 border-primary mb-4">
                <Heart className="w-10 h-10 text-primary fill-primary" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-secondary tracking-tight text-balance">
                우리의 사랑
              </h2>
              <p className="text-secondary text-sm mt-2 font-sans uppercase tracking-widest">Our Love Story</p>
            </div>
          </div>
          
          {/* Corner Labels */}
          <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Vol. 365
          </div>
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-secondary">
            Special
          </div>
          
          {/* Bottom Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-secondary py-2 px-4 flex items-center justify-between">
            <span className="text-secondary-foreground text-xs uppercase tracking-wider font-bold">2026 February Edition</span>
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs font-bold">♥</span>
              <span className="text-secondary-foreground text-xs">We:Beat</span>
            </div>
          </div>
        </div>
        
        {/* Profile Section */}
        <div className="p-4 flex items-center gap-4 border-t-3 border-secondary">
          <div className="flex -space-x-4">
            <div className="w-14 h-14 rounded-full bg-primary border-3 border-secondary flex items-center justify-center text-secondary font-serif font-bold text-lg z-10">
              -
            </div>
            <div className="w-14 h-14 rounded-full bg-accent border-3 border-secondary flex items-center justify-center text-secondary font-serif font-bold text-lg">
              준호
            </div>
          </div>
          <div className="flex-1">
            <p className="font-serif text-lg font-bold text-foreground">We:Beat</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">D+365 함께한 날</p>
          </div>
          <button className="px-4 py-2 bg-primary border-2 border-secondary text-secondary font-bold text-sm uppercase tracking-wider hover:bg-accent transition-colors">
            Edit
          </button>
        </div>
      </div>
    </section>
  )
}
