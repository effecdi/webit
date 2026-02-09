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
import { ModeSwitch } from "@/components/mode-switch"

const QUICK_ACTIONS = [
  { icon: Calendar, label: "일정 추가", color: "bg-green-50 text-green-600", href: "/family/calendar" },
  { icon: Plane, label: "여행 계획", color: "bg-purple-50 text-purple-600", href: "/travel" },
  { icon: Book, label: "추억 보기", color: "bg-amber-50 text-amber-600", href: "/family/archive" },
]

interface TodayEvent {
  id: number
  time: string
  title: string
  category: string
}

interface Album {
  id: number
  title: string
  photoCount: number
  eventDate: string | null
}

interface Travel {
  id: number
  destination: string
  startDate: string
  endDate: string
}

export function FamilyWeveDashboard() {
  const [dDay, setDDay] = useState(0)
  const [greeting, setGreeting] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([])
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [photoCount, setPhotoCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [coupleNames, setCoupleNames] = useState({ my: "현정", partner: "주호" })
  const [daysTogether, setDaysTogether] = useState(0)

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "현정"
    const partnerName = localStorage.getItem("survey_partnerName") || "주호"
    const savedDate = localStorage.getItem("survey_firstMeetDate")
    
    setCoupleNames({ my: myName, partner: partnerName })
    
    if (savedDate) {
      const start = new Date(savedDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      setDaysTogether(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    } else {
      const weddingDate = new Date("2025-12-20")
      const today = new Date()
      const diffTime = today.getTime() - weddingDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setDDay(diffDays > 0 ? diffDays : 0)
    }

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("좋은 아침이에요")
    else if (hour < 18) setGreeting("좋은 오후예요")
    else setGreeting("좋은 저녁이에요")
    
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const [notificationsRes, eventsRes, albumsRes, travelsRes, photosRes] = await Promise.all([
        fetch('/api/notifications?mode=family'),
        fetch(`/api/events?mode=family&date=${today}`),
        fetch('/api/albums?mode=family'),
        fetch('/api/travels'),
        fetch('/api/photos?mode=family')
      ])
      
      const notificationsData = await notificationsRes.json()
      const eventsData = await eventsRes.json()
      const albumsData = await albumsRes.json()
      const travelsData = await travelsRes.json()
      const photosData = await photosRes.json()
      
      setNotifications(notificationsData.map((n: { id: number; type: string; title: string; message: string; createdAt: string }) => ({
        id: String(n.id),
        type: n.type,
        title: n.title,
        message: n.message,
        time: formatTimeAgo(n.createdAt)
      })))
      
      setTodayEvents(eventsData.map((e: { id: number; time: string; title: string; category: string }) => ({
        id: e.id,
        time: e.time || "00:00",
        title: e.title,
        category: e.category || "일정"
      })))
      
      setRecentAlbums(albumsData.slice(0, 3))
      setTravels(travelsData)
      setPhotoCount(photosData.length)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return "방금"
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  const upcomingTravel = travels.find(t => {
    const startDate = new Date(t.startDate)
    const today = new Date()
    return startDate >= today
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "함께": return "bg-green-100 text-green-600"
      case "데이트": return "bg-pink-100 text-pink-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-36">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <ModeSwitch currentMode="family" />
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
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-[13px] text-[#8B95A1] mb-1">{greeting}, {coupleNames.my}님</p>
            <h1 className="text-[26px] leading-[1.35] font-bold text-[#191F28]">
              {daysTogether > 0 || dDay > 0 ? (
                <>
                  함께한 지
                  <br />
                  <span className="text-green-600">D+{daysTogether > 0 ? daysTogether : dDay}</span>일
                </>
              ) : (
                <>
                  우리 가족의
                  <br />
                  <span className="text-green-600">일상</span>
                </>
              )}
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Home className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
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
              <p className="text-[17px] font-bold text-[#191F28]">{coupleNames.my} & {coupleNames.partner}</p>
              <p className="text-[13px] text-[#8B95A1]">함께하는 일상</p>
            </div>
            <Heart className="w-6 h-6 text-green-500" fill="#22c55e" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="bg-white rounded-[20px] p-4 shadow-weve flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[13px] font-medium text-[#333D4B]">{action.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 일정</h3>
            <Link href="/family/calendar" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-[#8B95A1]">로딩 중...</div>
          ) : todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F2F4F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-bold text-[#4E5968]">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#333D4B]">{event.title}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getCategoryColor(event.category)}`}>
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
              <Link 
                href="/family/calendar"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-[14px] font-bold rounded-[12px]"
              >
                <Plus className="w-4 h-4" />
                일정 추가하기
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-[19px] text-[#191F28]">추억 보관함</h3>
            </div>
            <Link href="/family/archive" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-4 text-center text-[#8B95A1]">로딩 중...</div>
          ) : recentAlbums.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
              {recentAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/family/archive/${album.id}`}
                  className="flex-shrink-0 w-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[16px] p-3 hover:scale-[1.02] transition-transform"
                >
                  <div className="w-full aspect-square bg-amber-200/50 rounded-[12px] mb-2 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="font-bold text-[14px] text-[#333D4B] truncate">{album.title}</p>
                  <p className="text-[12px] text-[#8B95A1]">{album.photoCount}장</p>
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
          ) : (
            <div className="py-6 text-center">
              <ImageIcon className="w-12 h-12 text-amber-200 mx-auto mb-2" />
              <p className="text-[#8B95A1] text-[14px]">아직 추억이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">사진을 추가해서 추억을 남겨보세요</p>
            </div>
          )}
        </div>

        {upcomingTravel && (
          <TravelEntryCard 
            mode="family" 
            trip={{
              id: String(upcomingTravel.id),
              destination: upcomingTravel.destination,
              startDate: upcomingTravel.startDate,
              endDate: upcomingTravel.endDate
            }}
          />
        )}

        <div className="bg-white rounded-[24px] overflow-hidden shadow-weve">
          <div 
            className="w-full h-32 bg-cover bg-center relative"
            style={{ backgroundImage: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">우리의 추억</p>
                <p className="text-white text-lg font-bold">
                  {photoCount > 0 ? "사진을 확인해보세요" : "사진을 추가해보세요"}
                </p>
              </div>
            </div>
          </div>
          <Link href="/family/archive" className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">추억 보기</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">
                {photoCount > 0 ? `${photoCount}장의 사진` : "아직 사진이 없어요"}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </Link>
        </div>
      </main>
    </div>
  )
}
