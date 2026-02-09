"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, MessageSquare, Wallet, User } from "lucide-react"
import dynamic from "next/dynamic"

const LiquidGlass = dynamic(() => import("liquid-glass-react"), { ssr: false })

const navItems = [
  { icon: Home, label: "홈", href: "/wedding" },
  { icon: CheckSquare, label: "체크리스트", href: "/wedding/checklist" },
  { icon: MessageSquare, label: "커뮤니티", href: "/wedding/community" },
  { icon: Wallet, label: "예산", href: "/wedding/budget" },
  { icon: User, label: "마이", href: "/wedding/profile" },
]

export function WeddingBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-[calc(448px-24px)]">
      <LiquidGlass
        displacementScale={30}
        blurAmount={0.4}
        saturation={130}
        aberrationIntensity={0.8}
        elasticity={0.12}
        cornerRadius={22}
        overLight={true}
      >
        <nav
          className="relative flex justify-around items-center px-2 py-2"
          style={{
            background: "rgba(255, 255, 255, 0.72)",
            borderRadius: "22px",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/wedding" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-wedding-${item.label}`}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all duration-300 relative"
                style={isActive ? {
                  background: "rgba(232, 146, 124, 0.12)",
                } : {}}
              >
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full"
                    style={{ background: "linear-gradient(90deg, #E8927C, #F4845F)" }}
                  />
                )}
                <Icon
                  className="w-5 h-5 transition-all duration-300"
                  style={{
                    color: isActive ? "#E8927C" : "#8B95A1",
                  }}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className="text-[10px] font-medium transition-all duration-300"
                  style={{
                    color: isActive ? "#E8927C" : "#8B95A1",
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
