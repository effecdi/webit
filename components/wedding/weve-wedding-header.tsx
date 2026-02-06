"use client"

import { useEffect, useState } from "react"
import { Bell, Settings, Heart, ChevronRight } from "lucide-react"
import Link from "next/link"

const coupleData = {
  userName: "현정",
  partnerName: "민준",
  weddingDate: "2025-06-15",
}

function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function WeveWeddingHeader() {
  const [mounted, setMounted] = useState(false)
  const dday = calculateDday(coupleData.weddingDate)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <Link href="/" className="text-[18px] font-bold tracking-tight text-[#202020]">
          WE:VE
        </Link>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Bell className="w-[22px] h-[22px] text-[#202020]" strokeWidth={1.8} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
            <Settings className="w-[22px] h-[22px] text-[#202020]" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Promo Banner - WE:VE style */}
      <div className="px-5 pb-4">
        <Link 
          href="/wedding/tips"
          className="flex items-center gap-3 bg-[#2D2D3A] rounded-2xl px-4 py-3.5 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#D4836B] flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-white/90">
              결혼 준비가 처음이시라면
            </p>
            <p className="text-[13px] text-[#D4836B] font-medium">
              체크리스트 미리 확인하기
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* D-day Card - Main emphasis like WE:VE balance */}
      <div 
        className={`px-5 pb-6 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0ED] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#D4836B]" />
            </div>
            <div>
              <p className="text-[13px] text-[#8B8B8B]">{coupleData.userName} & {coupleData.partnerName}</p>
              <p className="text-[12px] text-[#B0B0B0]">2025. 6. 15 토요일</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-1">
            <span className="text-[42px] font-bold text-[#202020] tracking-tight leading-none">
              D-{dday}
            </span>
            <span className="text-[18px] font-medium text-[#8B8B8B] ml-1">일</span>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Link
              href="/wedding/calendar"
              className="flex-1 bg-[#F5F5F5] hover:bg-[#EBEBEB] rounded-xl py-3 text-center text-[14px] font-medium text-[#505050] transition-colors"
            >
              일정 확인
            </Link>
            <Link
              href="/wedding/editor"
              className="flex-1 bg-[#D4836B] hover:bg-[#C4735B] rounded-xl py-3 text-center text-[14px] font-medium text-white transition-colors"
            >
              청첩장 보내기
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
