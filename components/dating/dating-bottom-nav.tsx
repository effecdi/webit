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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto border-t border-white/30"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
      }}
    >
      <div className="flex justify-around items-end px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dating" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-dating-${item.label}`}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-14 relative
                transition-transform duration-200 ease-out
                active:scale-90
                ${isActive ? "-translate-y-1" : ""}
              `}
            >
              <div
                className={`
                  flex items-center justify-center rounded-full transition-all duration-300 ease-out
                  ${isActive ? "w-11 h-11" : "w-9 h-9"}
                `}
                style={isActive ? {
                  background: "linear-gradient(135deg, #EC4899, #F472B6)",
                  boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
                } : {}}
              >
                <Icon
                  className={`transition-all duration-300 ${isActive ? "w-5 h-5" : "w-[22px] h-[22px]"}`}
                  style={{ color: isActive ? "#fff" : "#8B95A1" }}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              </div>
              <span
                className="text-[10px] font-semibold transition-colors duration-300"
                style={{ color: isActive ? "#EC4899" : "#8B95A1" }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
