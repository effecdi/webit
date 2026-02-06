"use client"

import { ChevronRight, CreditCard, Gift, Plane } from "lucide-react"
import Link from "next/link"

const recommendItems = [
  {
    icon: CreditCard,
    title: "웨딩카드 배송중",
    subtitle: "카드를 받았다면 등록하기",
    href: "/wedding/card",
    highlight: true,
  },
  {
    icon: Gift,
    title: "답례품 모아보기",
    subtitle: "인기 답례품 추천",
    href: "/wedding/gift",
  },
  {
    icon: Plane,
    title: "허니문 특가",
    subtitle: "발리·몰디브 최저가",
    href: "/wedding/honeymoon",
  },
]

export function WeveTipBanner() {
  return (
    <section className="bg-white mt-2 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-[17px] font-bold text-[#202020]">추천</h2>
      </div>

      {/* Recommend Items - WE:VE style */}
      <div className="px-5">
        {recommendItems.map((item) => {
          const Icon = item.icon
          return (
            <Link 
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 py-3.5 border-b border-[#F5F5F5] last:border-0 group"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.highlight ? "bg-[#2D2D3A]" : "bg-[#F5F5F5]"
              }`}>
                <Icon className={`w-5 h-5 ${
                  item.highlight ? "text-white" : "text-[#505050]"
                }`} strokeWidth={1.8} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="text-[15px] text-[#202020]">{item.title}</span>
                <p className="text-[13px] text-[#8B8B8B] mt-0.5">{item.subtitle}</p>
              </div>

              <ChevronRight className="w-5 h-5 text-[#D0D0D0] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
