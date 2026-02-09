"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface AccountItem {
  icon: string
  label: string
  sublabel: string
  href: string
  badge?: string
}

const accountItems: AccountItem[] = [
  {
    icon: "pink",
    label: "예산 관리",
    sublabel: "12,500,000원",
    href: "/wedding/budget",
    badge: "송금",
  },
  {
    icon: "coral",
    label: "청첩장",
    sublabel: "모바일 청첩장 만들기",
    href: "/wedding/invitation",
  },
]

const menuItems = [
  { label: "소비·수입 내역을 바로 볼 수 있어요", href: "/wedding/budget" },
]

export function WeveQuickActions() {
  return (
    <section className="bg-white border-t border-[#F5F5F5]">
      {/* Section Title */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h2 className="text-[17px] font-bold text-[#202020]">연결한 서비스</h2>
        <ChevronRight className="w-5 h-5 text-[#B0B0B0]" />
      </div>

      {/* Account List - WE:BEAT style */}
      <div className="px-5">
        {accountItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 py-4 border-b border-[#F5F5F5] last:border-0 group"
          >
            {/* Icon Circle */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.icon === "pink" ? "bg-[#FFF0ED]" : "bg-[#FFF0ED]"
            }`}>
              {item.icon === "pink" ? (
                <span className="text-[16px]">W</span>
              ) : (
                <span className="text-[16px]">E</span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-[#505050]">{item.label}</span>
              </div>
              <span className="text-[17px] font-semibold text-[#202020]">
                {item.sublabel}
              </span>
            </div>

            {/* Badge */}
            {item.badge && (
              <button className="px-3 py-1.5 bg-[#F5F5F5] rounded-lg text-[13px] font-medium text-[#505050] hover:bg-[#EBEBEB] transition-colors">
                {item.badge}
              </button>
            )}
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="px-5 pb-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 py-3 text-[14px] text-[#D4836B]"
          >
            <span>+</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
