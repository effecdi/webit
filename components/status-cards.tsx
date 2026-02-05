"use client"

import { Heart, Gem, Home, ChevronRight } from "lucide-react"
import Link from "next/link"

interface StatusCardsProps {
  selectedStatus: string | null
  onSelect: (status: string) => void
}

const statuses = [
  {
    id: "dating",
    label: "연애 중",
    icon: Heart,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    description: "설레는 우리의 시작",
    href: "/dating",
  },
  {
    id: "wedding",
    label: "결혼 준비",
    icon: Gem,
    iconBg: "bg-blue-100",
    iconColor: "text-[#3182F6]",
    description: "특별한 날을 향해",
    href: "/wedding",
  },
  {
    id: "family",
    label: "가족",
    icon: Home,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    description: "함께하는 일상",
    href: "/family",
  },
]

export function StatusCards({ selectedStatus, onSelect }: StatusCardsProps) {
  return (
    <section className="flex-1 px-5 py-8 bg-[#F2F4F6]">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-[#191F28]">
          지금 어떤 순간인가요?
        </h2>
        <p className="text-[14px] text-[#8B95A1] mt-1">
          상황에 맞는 기능을 제공해 드릴게요
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {statuses.map((status) => {
          const Icon = status.icon
          const isSelected = selectedStatus === status.id

          return (
            <Link
              key={status.id}
              href={status.href}
              onClick={() => onSelect(status.id)}
              className={`group relative overflow-hidden bg-white rounded-[20px] p-5 shadow-toss
                transition-all duration-200 ease-out
                hover:scale-[1.02] active:scale-[0.98]
                ${isSelected ? "ring-2 ring-[#3182F6]" : ""}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-full ${status.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${status.iconColor}`} />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-[#191F28]">
                    {status.label}
                  </h3>
                  <p className="text-[14px] text-[#8B95A1] mt-0.5">
                    {status.description}
                  </p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-[#B0B8C1] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom Tagline */}
      <p className="mt-8 text-center text-[13px] text-[#8B95A1]">
        WE:VE와 함께하는 모든 순간
      </p>
    </section>
  )
}
