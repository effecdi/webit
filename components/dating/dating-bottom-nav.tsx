"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, ImageIcon, User, MessageSquare } from "lucide-react"
import dynamic from "next/dynamic"

const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false })

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
    <div className="fixed bottom-4 left-3 right-3 z-50 max-w-md mx-auto">
      <LiquidGlass
        displacementScale={40}
        blurAmount={0.6}
        saturation={120}
        aberrationIntensity={1}
        elasticity={0.15}
        cornerRadius={24}
        overLight={false}
      >
        <nav
          className="relative flex justify-around items-center px-2 py-2"
          style={{
            background: "rgba(20, 20, 25, 0.75)",
            borderRadius: "24px",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/dating" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-dating-${item.label}`}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-300 relative"
                style={isActive ? {
                  background: "rgba(236, 72, 153, 0.2)",
                } : {}}
              >
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                    style={{ background: "linear-gradient(90deg, #EC4899, #F472B6)" }}
                  />
                )}
                <Icon
                  className="w-5 h-5 transition-all duration-300"
                  style={{
                    color: isActive ? "#EC4899" : "rgba(255,255,255,0.45)",
                  }}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className="text-[10px] font-medium transition-all duration-300"
                  style={{
                    color: isActive ? "#EC4899" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </LiquidGlass>
    </div>
  )
}
