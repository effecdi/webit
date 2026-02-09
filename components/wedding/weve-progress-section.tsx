"use client"

import { ChevronRight, Check } from "lucide-react"
import Link from "next/link"

const progressData = {
  total: 24,
  completed: 8,
  categories: [
    { name: "예식장", status: "완료", icon: "check" },
    { name: "스드메", status: "진행중", progress: "2/4" },
    { name: "본식", status: "대기중", progress: "0/6" },
    { name: "허니문", status: "대기중", progress: "0/4" },
  ],
}

export function WeveProgressSection() {
  return (
    <section className="bg-white mt-2">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-[17px] font-bold text-[#202020]">준비 현황</h2>
        <Link href="/wedding/checklist" className="flex items-center gap-0.5 text-[13px] text-[#8B8B8B]">
          전체
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category List - WE:BEAT transaction style */}
      <div className="px-5 pb-4">
        {progressData.categories.map((category, index) => (
          <Link 
            key={category.name}
            href="/wedding/checklist"
            className="flex items-center gap-4 py-3.5 border-b border-[#F5F5F5] last:border-0"
          >
            {/* Status Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              category.status === "완료" 
                ? "bg-[#D4836B]" 
                : category.status === "진행중"
                ? "bg-[#FFF0ED]"
                : "bg-[#F5F5F5]"
            }`}>
              {category.status === "완료" ? (
                <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
              ) : (
                <span className={`text-[14px] font-semibold ${
                  category.status === "진행중" ? "text-[#D4836B]" : "text-[#B0B0B0]"
                }`}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span className="text-[15px] text-[#202020]">{category.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[13px] ${
                  category.status === "완료" 
                    ? "text-[#D4836B]" 
                    : category.status === "진행중"
                    ? "text-[#D4836B]"
                    : "text-[#B0B0B0]"
                }`}>
                  {category.status}
                </span>
                {category.progress && (
                  <span className="text-[13px] text-[#B0B0B0]">{category.progress}</span>
                )}
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#D0D0D0]" />
          </Link>
        ))}
      </div>
    </section>
  )
}
