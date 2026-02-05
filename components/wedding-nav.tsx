"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, CalendarDays, ImageIcon, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "홈", href: "/wedding" },
  { icon: FileText, label: "청첩장", href: "/wedding/editor" },
  { icon: CalendarDays, label: "캘린더", href: "/wedding/calendar" },
  { icon: ImageIcon, label: "갤러리", href: "/wedding/gallery" },
  { icon: User, label: "프로필", href: "/wedding/profile" },
]

export function WeddingNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t-3 border-secondary">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
                isActive ? "text-[#D4AF37]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`relative ${isActive ? "scale-110" : ""} transition-transform duration-200`}>
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rotate-45" />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
