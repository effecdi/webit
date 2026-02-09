"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, CalendarDays, ImageIcon, MoreHorizontal } from "lucide-react"

const navItems = [
  { icon: Home, label: "홈", href: "/wedding" },
  { icon: FileText, label: "청첩장", href: "/wedding/editor" },
  { icon: CalendarDays, label: "캘린더", href: "/wedding/calendar" },
  { icon: ImageIcon, label: "갤러리", href: "/wedding/gallery" },
  { icon: MoreHorizontal, label: "전체", href: "/wedding/profile" },
]

export function WeveWeddingNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-[#F0F0F0] dark:border-[#2a2a2a]">
      <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
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
                  isActive ? "text-[#202020] dark:text-white" : "text-[#B8B8B8] dark:text-[#555]"
                }`}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span
                className={`text-[10px] ${
                  isActive ? "text-[#202020] dark:text-white font-medium" : "text-[#B8B8B8] dark:text-[#555]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
      <div className="safe-bottom bg-white dark:bg-[#111]" />
    </nav>
  )
}
