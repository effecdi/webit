"use client"

import { Home, Camera, Heart, MessageCircle, User } from "lucide-react"
import { useState } from "react"

const navItems = [
  { icon: Home, label: "홈" },
  { icon: Camera, label: "앨범" },
  { icon: Heart, label: "하트" },
  { icon: MessageCircle, label: "편지" },
  { icon: User, label: "프로필" },
]

export function BottomNav() {
  const [active, setActive] = useState(0)
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t-3 border-secondary z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActive(index)}
              className={`
                flex-1 py-4 flex flex-col items-center gap-1 transition-colors
                ${active === index 
                  ? "bg-primary border-r-2 border-l-2 border-secondary" 
                  : "hover:bg-accent"
                }
              `}
            >
              <item.icon 
                className={`w-5 h-5 ${active === index ? "text-secondary" : "text-foreground"}`}
                fill={active === index && item.icon === Heart ? "currentColor" : "none"}
              />
              <span className={`text-[10px] uppercase tracking-wider font-bold ${active === index ? "text-secondary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
