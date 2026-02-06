"use client"

import Link from "next/link"
import { Plane, ChevronRight } from "lucide-react"

interface TravelEntryCardProps {
  mode?: "dating" | "wedding" | "family"
  trip?: {
    id: string
    destination: string
    startDate: string
    endDate: string
  } | null
}

function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function TravelEntryCard({ mode = "dating", trip }: TravelEntryCardProps) {
  if (!trip) return null
  
  const dday = calculateDday(trip.startDate)
  
  if (dday < 0) return null
  
  const modeColors = {
    dating: "from-pink-500 to-pink-400",
    wedding: "from-[#3182F6] to-blue-400",
    family: "from-green-500 to-green-400"
  }

  return (
    <Link 
      href="/travel"
      className="block"
      data-testid="card-travel-entry"
    >
      <div className="bg-white rounded-[20px] shadow-weve overflow-hidden hover:scale-[1.01] active:scale-[0.99] transition-transform">
        <div className="relative">
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${modeColors[mode]}`} />
          
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[16px] bg-[#3B82F6]/10 flex items-center justify-center">
                  <Plane className="w-7 h-7 text-[#3B82F6]" />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-[#8B95A1] mb-0.5">다음 여행</span>
                  <span className="text-[19px] font-bold text-[#191F28]">{trip.destination}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-0.5 rounded-full">
                      D-{dday}
                    </span>
                    <span className="text-[12px] text-[#8B95A1]">
                      {new Date(trip.startDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
            </div>
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#F2F4F6] rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-[#F2F4F6] rounded-full" />
          <div className="absolute bottom-0 left-6 right-6 border-t border-dashed border-[#E5E8EB]" />
        </div>
        
        <div className="px-5 py-3 bg-[#FAFBFC]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#8B95A1]">여행 일정 보러가기</span>
            <div className="flex items-center gap-1 text-[#3B82F6]">
              <span className="text-[12px] font-medium">바로가기</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
