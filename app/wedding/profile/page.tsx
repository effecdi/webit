"use client"

import React from "react"

import { useState, useEffect } from "react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { 
  ArrowLeft, 
  Bell, 
  LogOut,
  Heart,
  Camera,
  Gift,
  Calendar,
  X,
  Check,
  ImageIcon
} from "lucide-react"
import Link from "next/link"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { NotificationModal, type Notification } from "@/components/shared/notification-modal"
import { useAuth } from "@/hooks/use-auth"
import { PartnerInviteSection } from "@/components/shared/partner-invite-section"

const calculateDday = (date: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const wedding = new Date(date)
  wedding.setHours(0, 0, 0, 0)
  const diff = wedding.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function WeddingProfilePage() {
  const { user } = useAuth()
  const [weddingDate, setWeddingDate] = useState("")
  const [dday, setDday] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState<"groom" | "bride" | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [stats, setStats] = useState({ completedTodos: 0, invitations: 0, events: 0 })

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.removeItem("survey_myName")
    localStorage.removeItem("survey_partnerName")
    localStorage.removeItem("survey_firstMeetDate")
    localStorage.removeItem("survey_myBirthday")
    localStorage.removeItem("survey_partnerBirthday")
    localStorage.removeItem("selected_mode")
    localStorage.removeItem("wedding_onboarding_complete")
    window.location.href = "/api/logout"
  }
  
  const [groomProfile, setGroomProfile] = useState({
    name: "",
    photo: "",
  })
  
  const [brideProfile, setBrideProfile] = useState({
    name: "",
    photo: "",
  })

  useEffect(() => {
    const savedWeddingDate = localStorage.getItem("wedding_date")
    const myName = localStorage.getItem("survey_myName") || ""
    const partnerName = localStorage.getItem("survey_partnerName") || ""
    
    if (savedWeddingDate) {
      setWeddingDate(savedWeddingDate)
      setDday(calculateDday(savedWeddingDate))
    }
    
    setBrideProfile({ name: myName, photo: "" })
    setGroomProfile({ name: partnerName, photo: "" })
    
    fetchNotifications()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [checklistRes, invitationsRes, eventsRes] = await Promise.all([
        fetch('/api/checklist?mode=wedding').then(r => r.ok ? r.json() : []),
        fetch('/api/invitations').then(r => r.ok ? r.json() : []),
        fetch('/api/events?mode=wedding').then(r => r.ok ? r.json() : []),
      ])
      setStats({
        completedTodos: Array.isArray(checklistRes) ? checklistRes.filter((item: { completed?: boolean }) => item.completed).length : 0,
        invitations: Array.isArray(invitationsRes) ? invitationsRes.length : 0,
        events: Array.isArray(eventsRes) ? eventsRes.length : 0,
      })
    } catch {
      setStats({ completedTodos: 0, invitations: 0, events: 0 })
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?mode=wedding')
      const data = await res.json()
      const formatted = data.map((n: { id: number; type: string; title: string; message: string; createdAt: string }) => ({
        id: String(n.id),
        type: n.type as "schedule" | "photo" | "travel" | "todo" | "general",
        title: n.title,
        message: n.message,
        time: formatTimeAgo(n.createdAt),
      }))
      setNotifications(formatted)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  const handlePhotoUpload = (type: "groom" | "bride", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (type === "groom") {
        setGroomProfile({ ...groomProfile, photo: url })
      } else {
        setBrideProfile({ ...brideProfile, photo: url })
      }
    }
    setShowPhotoModal(null)
  }

  return (
    <main className="min-h-dvh bg-[#F2F4F6] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link 
              href="/wedding" 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="link-back-wedding"
            >
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[17px] font-bold text-[#191F28]">프로필</h1>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5 text-[#4E5968]" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3182F6] rounded-full" />
              )}
            </button>
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              mode="wedding"
            />
          </div>
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto space-y-4">
        
        {/* Couple Profile Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm">
          {/* Edit Button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                isEditing 
                  ? "bg-[#FF8A80] text-white" 
                  : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
              }`}
            >
              {isEditing ? "완료" : "편집"}
            </button>
          </div>

          {/* Couple Avatars */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Groom */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden border-3 border-[#3182F6]">
                  {groomProfile.photo ? (
                    <img src={groomProfile.photo || "/placeholder.svg"} alt="신랑" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#3182F6]">{groomProfile.name[0]}</span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#3182F6] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">신랑</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowPhotoModal("groom")}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4E5968]" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={groomProfile.name}
                  onChange={(e) => setGroomProfile({ ...groomProfile, name: e.target.value })}
                  className="mt-2 w-16 text-center text-[15px] font-bold text-[#191F28] bg-transparent border-b-2 border-[#3182F6] focus:outline-none"
                />
              ) : (
                <span className="mt-2 text-[15px] font-bold text-[#191F28]">{groomProfile.name}</span>
              )}
            </div>

            {/* Heart */}
            <div className="flex flex-col items-center -mt-6">
              <Heart className="w-8 h-8 text-[#FF8A80]" fill="currentColor" />
            </div>

            {/* Bride */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden border-3 border-[#FF8A80]">
                  {brideProfile.photo ? (
                    <img src={brideProfile.photo || "/placeholder.svg"} alt="신부" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#FF8A80]">{brideProfile.name[0]}</span>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF8A80] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">신부</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowPhotoModal("bride")}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#E5E8EB] flex items-center justify-center shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#4E5968]" />
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={brideProfile.name}
                  onChange={(e) => setBrideProfile({ ...brideProfile, name: e.target.value })}
                  className="mt-2 w-16 text-center text-[15px] font-bold text-[#191F28] bg-transparent border-b-2 border-[#FF8A80] focus:outline-none"
                />
              ) : (
                <span className="mt-2 text-[15px] font-bold text-[#191F28]">{brideProfile.name}</span>
              )}
            </div>
          </div>

          {/* Wedding Info */}
          {weddingDate && (
            <div className="bg-gradient-to-r from-blue-50 via-pink-50 to-pink-50 rounded-[16px] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF8A80]" />
                  <span className="text-[14px] text-[#4E5968]">결혼식</span>
                </div>
                <span className="text-[14px] font-bold text-[#191F28]">{weddingDate}</span>
              </div>
              <div className="flex items-center justify-center mt-3">
                <div className="px-4 py-2 bg-white rounded-full shadow-sm">
                  <span className="text-[18px] font-bold text-[#FF8A80]">
                    {dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : `D+${Math.abs(dday)}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Partner Invite */}
        <PartnerInviteSection mode="wedding" />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
              <Check className="w-5 h-5 text-[#3182F6]" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{stats.completedTodos}</p>
            <p className="text-[12px] text-[#8B95A1]">완료한 할일</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-[#FF8A80]" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{stats.invitations}</p>
            <p className="text-[12px] text-[#8B95A1]">청첩장</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{stats.events}</p>
            <p className="text-[12px] text-[#8B95A1]">예약 일정</p>
          </div>
        </div>

        {/* Settings Menu with ProfileSettingsSection */}
        <ProfileSettingsSection mode="wedding" />

        {/* Logout */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-4 text-[#FF6B6B] text-[15px] font-medium hover:bg-white rounded-[16px] transition-colors disabled:opacity-50"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 flex items-end justify-center"
          onClick={() => setShowPhotoModal(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-t-[24px] p-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            <h3 className="text-[17px] font-bold text-[#191F28] text-center mb-6">
              {showPhotoModal === "groom" ? "신랑" : "신부"} 사진 변경
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 py-4 bg-[#3182F6] text-white rounded-[14px] font-semibold cursor-pointer">
                <Camera className="w-5 h-5" />
                사진 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(showPhotoModal, e)}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowPhotoModal(null)}
                className="w-full py-4 bg-[#F2F4F6] text-[#4E5968] rounded-[14px] font-semibold"
              >
                취소
              </button>
            </div>
            <div className="h-8" />
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </main>
  )
}
