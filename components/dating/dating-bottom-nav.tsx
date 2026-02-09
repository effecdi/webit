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
    <div className="fixed bottom-[30px] left-3 right-3 z-50 max-w-md mx-auto">
      <nav
        className="relative rounded-[50px] border border-gray-200/40 shadow-lg"
        style={{
          background: "rgba(249, 250, 251, 0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="flex items-end justify-around h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/dating" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-dating-${item.label}`}
                className="flex flex-col items-center justify-end pb-2 w-16 relative transition-transform duration-150 ease-out active:scale-[0.85]"
              >
                {isActive ? (
                  <div className="flex flex-col items-center -mt-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-0.5 transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #EC4899, #F472B6)",
                        boxShadow: "0 4px 16px rgba(236, 72, 153, 0.45)",
                      }}
                    >
                      <Icon className="w-[22px] h-[22px] text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: "#EC4899" }}>
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Icon className="w-[22px] h-[22px] mb-1" style={{ color: "#ADB5BD" }} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium" style={{ color: "#ADB5BD" }}>
                      {item.label}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom)" }} />
      </nav>
    </div>
  )
}
