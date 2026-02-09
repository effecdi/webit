"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, ImageIcon, User, MessageSquare } from "lucide-react"
import dynamic from "next/dynamic"

const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false })

const navItems = [
  { icon: Home, label: "홈", href: "/family" },
  { icon: Calendar, label: "캘린더", href: "/family/calendar" },
  { icon: MessageSquare, label: "커뮤니티", href: "/family/community" },
  { icon: ImageIcon, label: "갤러리", href: "/family/gallery" },
  { icon: User, label: "프로필", href: "/family/profile" },
]

export function FamilyBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-[calc(448px-24px)]">
      <LiquidGlass
        displacementScale={30}
        blurAmount={0.5}
        saturation={140}
        aberrationIntensity={1}
        elasticity={0.15}
        cornerRadius={22}
        overLight={true}
      >
        <div className="flex justify-around items-center px-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/family" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-family-${item.label}`}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200 relative"
              >
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                    style={{ background: "linear-gradient(90deg, #22C55E, #4ADE80)" }}
                  />
                )}
                <Icon
                  className="w-5 h-5 transition-colors duration-200"
                  style={{ color: isActive ? "#22C55E" : "#8B95A1" }}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className="text-[10px] font-medium transition-colors duration-200"
                  style={{ color: isActive ? "#22C55E" : "#8B95A1" }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </LiquidGlass>
    </nav>
  )
}
