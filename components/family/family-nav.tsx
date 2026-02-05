"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CalendarDays, ImageIcon, Book, User } from "lucide-react"

const navItems = [
  { icon: Home, label: "홈", href: "/family" },
  { icon: CalendarDays, label: "캘린더", href: "/family/calendar" },
  { icon: ImageIcon, label: "갤러리", href: "/family/gallery" },
  { icon: Book, label: "추억", href: "/family/archive" },
  { icon: User, label: "프로필", href: "/family/profile" },
]

export function FamilyNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-3 border-secondary z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all ${
                isActive ? "text-[#2D8B57]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-xs ${isActive ? "font-bold" : ""}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
