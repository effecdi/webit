"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, ImageIcon, User, MessageSquare } from "lucide-react"

const navItems = [
  { icon: Home, label: "홈", href: "/dating" },
  { icon: Calendar, label: "캘린더", href: "/dating/calendar" },
  { icon: MessageSquare, label: "커뮤니티", href: "/dating/community" },
  { icon: ImageIcon, label: "갤러리", href: "/dating/gallery" },
  { icon: User, label: "프로필", href: "/dating/profile" },
]

export function DatingBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E8EB]">
      <div className="flex items-center justify-around h-14 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-1.5 transition-colors"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-pink-500" : "text-[#B0B8C1]"
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={`text-[10px] ${
                  isActive ? "text-pink-500 font-medium" : "text-[#B0B8C1]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  )
}
