"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Home, Calendar, ImageIcon, User, MessageSquare, ArrowLeft } from "lucide-react"

const navItems = [
  { icon: Home, label: "홈", href: "/family" },
  { icon: Calendar, label: "캘린더", href: "/family/calendar" },
  { icon: MessageSquare, label: "커뮤니티", href: "/family/community" },
  { icon: ImageIcon, label: "갤러리", href: "/family/gallery" },
  { icon: User, label: "프로필", href: "/family/profile" },
]

export function FamilyBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === "dark"
  const isSubPage = !navItems.some(item => pathname === item.href)

  return (
    <div className="fixed fixed-bottom-nav left-3 right-3 z-50 max-w-md mx-auto flex items-end gap-2">
      {isSubPage && (
        <button
          onClick={() => router.back()}
          data-testid="button-back-nav"
          className="w-[66px] h-[66px] rounded-full shadow-lg flex items-center justify-center flex-shrink-0 transition-transform duration-150 ease-out active:scale-[0.9]"
          style={{
            background: isDark ? "rgba(28, 28, 30, 0.88)" : "rgba(249, 250, 251, 0.82)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderWidth: 1,
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(209,213,219,0.4)",
          }}
        >
          <ArrowLeft className="w-[22px] h-[22px]" style={{ color: isDark ? "#d1d5db" : "#191F28" }} />
        </button>
      )}
      <nav
        className="relative rounded-[50px] shadow-lg flex-1"
        style={{
          background: isDark ? "rgba(28, 28, 30, 0.88)" : "rgba(249, 250, 251, 0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderWidth: 1,
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(209,213,219,0.4)",
        }}
      >
        <div className="flex items-end justify-around h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/family" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-family-${item.label}`}
                className="flex flex-col items-center justify-center h-full flex-1 w-auto relative transition-transform duration-150 ease-out active:scale-[0.85]"
              >
                {isActive ? (
                  <div className="flex flex-col items-center -mt-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-0.5 transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #22C55E, #4ADE80)",
                        boxShadow: "0 4px 16px rgba(34, 197, 94, 0.45)",
                      }}
                    >
                      <Icon className="w-[22px] h-[22px] text-white" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: "#22C55E" }}>
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Icon className="w-[22px] h-[22px] mb-1" style={{ color: isDark ? "#666666" : "#ADB5BD" }} strokeWidth={1.5} />
                    <span className="text-[10px] font-medium" style={{ color: isDark ? "#666666" : "#ADB5BD" }}>
                      {item.label}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
