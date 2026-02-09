"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckSquare, Mail, Wallet, User, Users, MessageSquare } from "lucide-react"

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F2F4F6] px-2 pb-6 pt-2 flex justify-around items-center z-50 max-w-md mx-auto">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 p-2 w-16 group"
          >
            <Icon
              className={`w-6 h-6 transition-colors ${
                isActive ? "text-[#191F28]" : "text-[#B0B8C1] group-hover:text-[#191F28]"
              }`}
              strokeWidth={isActive ? 2 : 1.5}
              fill={isActive && item.icon === Home ? "#191F28" : "none"}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${
                isActive ? "text-[#191F28]" : "text-[#B0B8C1] group-hover:text-[#191F28]"
              }`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
      {/* Safe area padding for iOS */}
      <div className="absolute bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  )
}
