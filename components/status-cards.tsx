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
    description: "설레는 우리의 시작",
    href: "/dating",
  },
  {
    id: "wedding",
    label: "결혼 준비",
    icon: Gem,
    description: "특별한 날을 향해",
    href: "/wedding",
  },
  {
    id: "family",
    label: "부부 · 가족",
    icon: Home,
    description: "함께하는 일상",
    href: "/family",
  },
]

export function StatusCards({ selectedStatus, onSelect }: StatusCardsProps) {
  return (
    <section className="flex-1 px-5 py-6 bg-white">
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
              data-testid={`card-status-${status.id}`}
              className={`group relative bg-[#F3F5F7] rounded-[32px] p-6
                transition-all duration-200 ease-out
                hover:bg-[#EBEEF1] active:scale-[0.98]
                ${isSelected ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon Container - White circle with blue icon */}
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Icon className="w-7 h-7 text-blue-500" />
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
    </section>
  )
}
