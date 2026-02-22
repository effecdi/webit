"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { BottomSheet } from '@/components/ui/bottom-sheet'
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
  ImageIcon,
  UserPlus,
  Link2,
  MessageCircle
} from "lucide-react"
import Link from "next/link"
import { ProfileSettingsSection } from "@/components/shared/profile-settings-section"
import { NotificationModal, type Notification } from "@/components/shared/notification-modal"
import { useAuth } from "@/hooks/use-auth"

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
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [weddingDate, setWeddingDate] = useState("")
  const [dday, setDday] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState<"groom" | "bride" | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [stats, setStats] = useState({ completedTodos: 0, invitations: 0, events: 0 })
  const [isCoupled, setIsCoupled] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoadingInvite, setIsLoadingInvite] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === "dark"

  const handleLogout = () => {
    setIsLoggingOut(true)
    localStorage.clear()
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
    
    fetch("/api/couple")
      .then(res => res.json())
      .then(data => {
        setIsCoupled(data.coupled === true)
        if (data.coupled && data.partner) {
          const pName = data.partner.firstName || partnerName
          setGroomProfile(prev => ({ ...prev, name: pName, photo: data.partner.profileImageUrl || "" }))
        }
        if (!data.coupled) {
          fetch("/api/couple-invite")
            .then(r => r.json())
            .then(invData => {
              if (invData.invites) {
                const pending = invData.invites.find((inv: any) => inv.mode === "wedding" && inv.status === "pending")
                if (pending) setInviteCode(pending.inviteCode)
              }
            })
            .catch(() => {})
        }
      })
      .catch(() => {})

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
      const notifArr = Array.isArray(data) ? data : []
      const formatted = notifArr.map((n: { id: number; type: string; title: string; message: string; createdAt: string }) => ({
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

  const inviteUrl = inviteCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteCode}`
    : ""

  const handleInviteClick = async () => {
    if (inviteCode) {
      setShowShareModal(true)
      return
    }
    setIsLoadingInvite(true)
    try {
      const myName = localStorage.getItem("survey_myName") || "나"
      const res = await fetch("/api/couple-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterName: myName, mode: "wedding" }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.invite) setInviteCode(data.invite.inviteCode)
        else if (data.inviteCode) setInviteCode(data.inviteCode)
        setShowShareModal(true)
      }
    } catch {}
    setIsLoadingInvite(false)
  }

  const handleCopyLink = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = inviteUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      <header className="sticky top-0 sticky-header-safe z-30 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <div className="flex items-center gap-3">
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#d63bf2] rounded-full" />
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
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm">
          <div
            className="relative px-6 pt-16 pb-6"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #2A1F3D 0%, #1F2A3D 50%, #1C2333 100%)"
                : "linear-gradient(135deg, #f8f0ff 0%, #f0e6ff 30%, #e8f4ff 70%, #f0f8ff 100%)"
            }}
          >
            <div className="absolute top-3 right-3 flex gap-2">
              {!isCoupled && !isEditing && (
                <button
                  onClick={handleInviteClick}
                  disabled={isLoadingInvite}
                  className="px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1 disabled:opacity-50"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(8px)",
                    color: isDark ? "#D4B8F0" : "#6B4C8A",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.6)",
                  }}
                  data-testid="button-invite-partner-wedding"
                >
                  <UserPlus className="w-3 h-3" />
                  {isLoadingInvite ? "..." : "초대"}
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                style={{
                  background: isEditing
                    ? (isDark ? "#8B6AAF" : "#6B4C8A")
                    : (isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"),
                  backdropFilter: isEditing ? undefined : "blur(8px)",
                  color: isEditing ? "#fff" : (isDark ? "#D4B8F0" : "#6B4C8A"),
                  border: isEditing ? "none" : (isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.6)"),
                }}
              >
                {isEditing ? "완료" : "편집"}
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mb-2">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className="w-[84px] h-[84px] rounded-full flex items-center justify-center overflow-hidden shadow-md"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, #3D2E5C 0%, #4A3670 100%)"
                        : "linear-gradient(135deg, #E8DEF8 0%, #D0BCFF 100%)",
                      border: isDark ? "3px solid rgba(255,255,255,0.15)" : "3px solid white",
                    }}
                  >
                    {groomProfile.photo ? (
                      <img src={groomProfile.photo || "/placeholder.svg"} alt="신랑" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[22px] font-bold" style={{ color: isDark ? "#D4B8F0" : "#6B4C8A" }}>{groomProfile.name[0]}</span>
                    )}
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full shadow-sm"
                    style={{ background: isDark ? "#8B6AAF" : "#6B4C8A" }}
                  >
                    <span className="text-[10px] font-bold text-white tracking-wide">GROOM</span>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setShowPhotoModal("groom")}
                      className="absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: isDark ? "#2C2C2E" : "white",
                        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E5E8EB",
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" style={{ color: isDark ? "#D4B8F0" : "#6B4C8A" }} />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={groomProfile.name}
                    onChange={(e) => setGroomProfile({ ...groomProfile, name: e.target.value })}
                    className="mt-4 w-16 text-center text-[15px] font-bold bg-transparent focus:outline-none"
                    style={{ color: isDark ? "#EBEBEB" : "#191F28", borderBottom: isDark ? "2px solid #8B6AAF" : "2px solid #6B4C8A" }}
                  />
                ) : (
                  <span className="mt-4 text-[15px] font-bold" style={{ color: isDark ? "#EBEBEB" : "#191F28" }}>{groomProfile.name}</span>
                )}
              </div>

              <div className="flex flex-col items-center -mt-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Heart className="w-5 h-5" style={{ color: isDark ? "#D96EF0" : "#C77DEF" }} fill="currentColor" />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className="w-[84px] h-[84px] rounded-full flex items-center justify-center overflow-hidden shadow-md"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, #3D1F3A 0%, #4A2248 100%)"
                        : "linear-gradient(135deg, #FFE0F0 0%, #F8BBD0 100%)",
                      border: isDark ? "3px solid rgba(255,255,255,0.15)" : "3px solid white",
                    }}
                  >
                    {brideProfile.photo ? (
                      <img src={brideProfile.photo || "/placeholder.svg"} alt="신부" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[22px] font-bold" style={{ color: isDark ? "#F0A8D8" : "#8E4585" }}>{brideProfile.name[0]}</span>
                    )}
                  </div>
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full shadow-sm"
                    style={{ background: isDark ? "#A85C9F" : "#8E4585" }}
                  >
                    <span className="text-[10px] font-bold text-white tracking-wide">BRIDE</span>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setShowPhotoModal("bride")}
                      className="absolute top-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: isDark ? "#2C2C2E" : "white",
                        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E5E8EB",
                      }}
                    >
                      <Camera className="w-3.5 h-3.5" style={{ color: isDark ? "#F0A8D8" : "#8E4585" }} />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={brideProfile.name}
                    onChange={(e) => setBrideProfile({ ...brideProfile, name: e.target.value })}
                    className="mt-4 w-16 text-center text-[15px] font-bold bg-transparent focus:outline-none"
                    style={{ color: isDark ? "#EBEBEB" : "#191F28", borderBottom: isDark ? "2px solid #A85C9F" : "2px solid #8E4585" }}
                  />
                ) : (
                  <span className="mt-4 text-[15px] font-bold" style={{ color: isDark ? "#EBEBEB" : "#191F28" }}>{brideProfile.name}</span>
                )}
              </div>
            </div>
          </div>

          {weddingDate && (
            <div
              className="px-6 py-4"
              style={{ borderTop: isDark ? "1px solid #2C2C2E" : "1px solid #F2F4F6" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: isDark ? "#888" : "#8B95A1" }} />
                  <span className="text-[14px]" style={{ color: isDark ? "#A0A0A0" : "#4E5968" }}>결혼식</span>
                </div>
                <span className="text-[14px] font-medium" style={{ color: isDark ? "#EBEBEB" : "#191F28" }}>{weddingDate}</span>
              </div>
              <div className="flex items-center justify-center mt-3">
                <div
                  className="px-5 py-1.5 rounded-full"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(139,106,175,0.25) 0%, rgba(168,92,159,0.25) 100%)"
                      : "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)"
                  }}
                >
                  <span className="text-[17px] font-bold" style={{ color: isDark ? "#D4B8F0" : "#6B4C8A" }}>
                    {dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : `D+${Math.abs(dday)}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ background: isDark ? "rgba(139,106,175,0.2)" : "linear-gradient(135deg, #f3e8ff, #ede5ff)" }}
            >
              <Check className="w-5 h-5" style={{ color: isDark ? "#C9A8F0" : "#6B4C8A" }} />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{stats.completedTodos}</p>
            <p className="text-[12px] text-[#8B95A1]">완료한 할일</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ background: isDark ? "rgba(168,92,159,0.2)" : "linear-gradient(135deg, #fce7f3, #fdf2f8)" }}
            >
              <Gift className="w-5 h-5" style={{ color: isDark ? "#F0A8D8" : "#8E4585" }} />
            </div>
            <p className="text-[20px] font-bold text-[#191F28]">{stats.invitations}</p>
            <p className="text-[12px] text-[#8B95A1]">청첩장</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ background: isDark ? "rgba(91,127,165,0.2)" : "linear-gradient(135deg, #e8f4ff, #f0f8ff)" }}
            >
              <Calendar className="w-5 h-5" style={{ color: isDark ? "#8BBDE0" : "#5B7FA5" }} />
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
          className="w-full flex items-center justify-center gap-2 py-4 text-[#E05252] text-[15px] font-medium hover:bg-white rounded-[16px] transition-colors disabled:opacity-50"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>

      {/* Photo Upload Modal */}
      <BottomSheet open={!!showPhotoModal} onOpenChange={(open) => { if (!open) setShowPhotoModal(null) }} className={`z-[60] w-full max-w-md mx-auto p-6 ${isDark ? "bg-[#1C1C1E]" : "bg-white"}`} overlayClassName="z-[60]">
            <h3 className="text-[17px] font-bold text-center mb-6" style={{ color: isDark ? "#EBEBEB" : "#191F28" }}>
              {showPhotoModal === "groom" ? "신랑" : "신부"} 사진 변경
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-center gap-2 py-4 bg-[#d63bf2] text-white rounded-[14px] font-semibold cursor-pointer">
                <Camera className="w-5 h-5" />
                사진 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => showPhotoModal && handlePhotoUpload(showPhotoModal, e)}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowPhotoModal(null)}
                className="w-full py-4 rounded-[14px] font-semibold"
                style={{
                  background: isDark ? "#2C2C2E" : "#F2F4F6",
                  color: isDark ? "#A0A0A0" : "#4E5968",
                }}
              >
                취소
              </button>
            </div>
            <div className="h-8" />
      </BottomSheet>

      <BottomSheet open={showShareModal} onOpenChange={setShowShareModal} className="bg-white dark:bg-gray-900 z-[60]" overlayClassName="z-[60]" showHandle={false}>
            <div className="px-5 pt-3 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-bold text-[#191F28] dark:text-gray-100">상대방 초대하기</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  data-testid="button-close-share-modal"
                >
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { handleCopyLink(); setTimeout(() => setShowShareModal(false), 800) }}
                  className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#F2F4F6] dark:bg-gray-800 hover:bg-[#E5E8EB] dark:hover:bg-gray-700 transition-colors"
                  data-testid="button-share-copy-link"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Link2 className="w-6 h-6 text-[#4E5968] dark:text-gray-300" />}
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">{copied ? "복사됨!" : "링크 복사"}</p>
                    <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">{copied ? "클립보드에 복사되었습니다" : "초대 링크를 클립보드에 복사합니다"}</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="h-10" />
      </BottomSheet>

      <WeddingBottomNav />
    </main>
  )
}
