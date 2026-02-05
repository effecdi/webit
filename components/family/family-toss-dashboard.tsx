"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Bell, 
  Heart, 
  ChevronRight, 
  Calendar,
  ImageIcon,
  Book,
  Plus,
  Home,
  Plane
} from "lucide-react"
import { TravelEntryCard } from "@/components/travel/travel-entry-card"
import { NotificationModal, type Notification } from "@/components/shared/notification-modal"

const QUICK_ACTIONS = [
  { icon: Calendar, label: "일정 추가", color: "bg-green-50 text-green-600", href: "/family/calendar" },
  { icon: Plane, label: "여행 계획", color: "bg-purple-50 text-purple-600", href: "/travel" },
  { icon: Book, label: "추억 보기", color: "bg-amber-50 text-amber-600", href: "/family/archive" },
]

const TODAY_EVENTS = [
  { time: "09:00", title: "부동산 계약 상담", category: "함께", color: "bg-green-100 text-green-600" },
  { time: "18:30", title: "저녁 외식 - 이탈리안", category: "데이트", color: "bg-pink-100 text-pink-600" },
]

const RECENT_MEMORIES = [
  { id: 1, title: "신혼여행", date: "2025.12.25", count: 48 },
  { id: 2, title: "결혼식", date: "2025.12.20", count: 156 },
]

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "schedule", title: "새 일정 등록", message: "부동산 계약 상담이 등록되었어요", time: "3시간 전" },
  { id: "2", type: "photo", title: "사진 추가됨", message: "신혼여행 사진 48장이 추가되었어요", time: "어제" },
]

export function FamilyTossDashboard() {
  const [dDay, setDDay] = useState(0)
  const [greeting, setGreeting] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  useEffect(() => {
    const weddingDate = new Date("2025-12-20")
    const today = new Date()
    const diffTime = today.getTime() - weddingDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setDDay(diffDays > 0 ? diffDays : 0)

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("좋은 아침이에요")
    else if (hour < 18) setGreeting("좋은 오후예요")
    else setGreeting("좋은 저녁이에요")
  }, [])

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-24">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
            <Home className="w-4 h-4 text-green-600" />
            <span className="text-[13px] font-semibold text-green-600">가족</span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-6 h-6 text-[#4E5968]" strokeWidth={1.8} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </button>
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              mode="family"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 px-5 space-y-4 max-w-md mx-auto">
        {/* Hero Section */}
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-[13px] text-[#8B95A1] mb-1">{greeting}, 현정님</p>
            <h1 className="text-[26px] leading-[1.35] font-bold text-[#191F28]">
              결혼한 지
              <br />
              <span className="text-green-600">D+{dDay}</span>일
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Home className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Couple Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white">
                <span className="text-2xl">👩</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white">
                <span className="text-2xl">👨</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-[#191F28]">현정 & 주호</p>
              <p className="text-[13px] text-[#8B95A1]">2025.12.20 결혼</p>
            </div>
            <Heart className="w-6 h-6 text-green-500" fill="#22c55e" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="bg-white rounded-[20px] p-4 shadow-toss flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[13px] font-medium text-[#333D4B]">{action.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Today's Schedule Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 일정</h3>
            <Link href="/family/calendar" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {TODAY_EVENTS.length > 0 ? (
            <div className="space-y-2">
              {TODAY_EVENTS.map((event, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F2F4F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-bold text-[#4E5968]">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#333D4B]">{event.title}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${event.color}`}>
                      {event.category}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[15px] mb-3">오늘 일정이 없어요</p>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-[14px] font-bold rounded-[12px]">
                <Plus className="w-4 h-4" />
                일정 추가하기
              </button>
            </div>
          )}
        </div>

        {/* Memory Archive Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-[19px] text-[#191F28]">추억 보관함</h3>
            </div>
            <Link href="/family/archive" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
            {RECENT_MEMORIES.map((memory) => (
              <Link
                key={memory.id}
                href={`/family/archive/${memory.id}`}
                className="flex-shrink-0 w-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[16px] p-3 hover:scale-[1.02] transition-transform"
              >
                <div className="w-full aspect-square bg-amber-200/50 rounded-[12px] mb-2 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-amber-400" />
                </div>
                <p className="font-bold text-[14px] text-[#333D4B] truncate">{memory.title}</p>
                <p className="text-[12px] text-[#8B95A1]">{memory.date} · {memory.count}장</p>
              </Link>
            ))}
            
            <Link
              href="/family/archive"
              className="flex-shrink-0 w-36 bg-[#F2F4F6] rounded-[16px] p-3 flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-[#8B95A1]" />
              </div>
              <p className="text-[13px] text-[#8B95A1] text-center">더 많은 추억</p>
            </Link>
          </div>
        </div>

        {/* Travel Entry Card - only shows when there's an upcoming trip */}
        <TravelEntryCard 
          mode="family" 
          trip={{
            id: "1",
            destination: "제주도",
            startDate: "2026-02-20",
            endDate: "2026-02-23"
          }}
        />

        {/* This Day Memory */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-toss">
          <div 
            className="w-full h-32 bg-cover bg-center relative"
            style={{ 
              backgroundImage: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">1개월 전 오늘</p>
                <p className="text-white text-lg font-bold">신혼여행을 다녀왔어요</p>
              </div>
            </div>
          </div>
          <Link href="/family/archive" className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">추억 보기</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">48장의 사진</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </Link>
        </div>
      </main>
    </div>
  )
}
