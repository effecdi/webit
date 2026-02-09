"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, MessageSquare, Wallet, User } from "lucide-react"

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
          const isActive = pathname === item.href || (item.href !== "/wedding" && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-wedding-${item.label}`}
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
                  background: "linear-gradient(135deg, #E8927C, #F4845F)",
                  boxShadow: "0 4px 14px rgba(232, 146, 124, 0.4)",
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
                style={{ color: isActive ? "#E8927C" : "#8B95A1" }}
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
