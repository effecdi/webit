"use client"

import React from "react"

import { useState } from "react"
import { Check, Camera, Music, Utensils, Shirt, Sparkles } from "lucide-react"
import Link from "next/link"

interface ChecklistItem {
  id: string
  icon: React.ElementType
  title: string
  description: string
  dueDate: string
  completed: boolean
  isAd?: boolean
  adLabel?: string
  href?: string
}

// Dummy Data
const checklistItems: ChecklistItem[] = [
  {
    id: "1",
    icon: Camera,
    title: "스냅 촬영 계약",
    description: "본식 스냅 및 DVD 촬영 업체 선정",
    dueDate: "D-90",
    completed: true,
  },
  {
    id: "ad1",
    icon: Sparkles,
    title: "스냅사진 얼리버드 30% 할인",
    description: "WE:VE 회원 전용 특가 - 더스튜디오",
    dueDate: "한정 혜택",
    completed: false,
    isAd: true,
    adLabel: "추천",
    href: "#",
  },
  {
    id: "2",
    icon: Shirt,
    title: "드레스 피팅",
    description: "2차 드레스 피팅 예약",
    dueDate: "D-60",
    completed: false,
  },
  {
    id: "3",
    icon: Music,
    title: "축가 섭외",
    description: "축가 가수 또는 지인 섭외",
    dueDate: "D-45",
    completed: false,
  },
  {
    id: "ad2",
    icon: Utensils,
    title: "본식 케이터링 10% 할인",
    description: "프리미엄 뷔페 - 더테이블",
    dueDate: "한정 혜택",
    completed: false,
    isAd: true,
    adLabel: "Sponsored",
    href: "#",
  },
  {
    id: "4",
    icon: Utensils,
    title: "식사 메뉴 결정",
    description: "하객 식사 메뉴 및 테이블 배치",
    dueDate: "D-30",
    completed: false,
  },
]

export function WeddingChecklist() {
  const [items, setItems] = useState(checklistItems)

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  return (
    <section className="px-5 py-8">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase mb-1">
            Wedding Checklist
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            준비 현황
          </h2>
        </div>
        <Link
          href="/wedding/editor"
          className="text-sm font-medium text-[#D4AF37] border-b-2 border-[#D4AF37] pb-0.5 hover:opacity-70 transition-opacity"
        >
          청첩장 만들기
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        {/* Items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => {
            const Icon = item.icon

            if (item.isAd) {
              return (
                <Link
                  key={item.id}
                  href={item.href || "#"}
                  className="relative ml-12 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[38px] top-4 w-4 h-4 border-2 border-[#D4AF37] bg-[#D4AF37] rotate-45" />

                  {/* Ad Card */}
                  <div className="border-3 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/5 to-transparent p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#D4AF37]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center border-2 border-[#D4AF37] bg-[#D4AF37]/10">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold tracking-wider text-[#D4AF37] border border-[#D4AF37] px-1.5 py-0.5">
                            {item.adLabel}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-foreground mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            }

            return (
              <div key={item.id} className="relative ml-12">
                {/* Timeline Dot */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`absolute -left-[38px] top-4 w-4 h-4 border-2 border-secondary transition-all duration-300 ${
                    item.completed ? "bg-secondary rotate-0" : "bg-card rotate-45"
                  }`}
                >
                  {item.completed && (
                    <Check className="w-2.5 h-2.5 text-secondary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={3} />
                  )}
                </button>

                {/* Card */}
                <div
                  className={`border-3 border-secondary p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center border-2 border-secondary">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-serif text-base font-bold ${
                            item.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </h3>
                        <span className="text-xs font-medium text-muted-foreground">
                          {item.dueDate}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
