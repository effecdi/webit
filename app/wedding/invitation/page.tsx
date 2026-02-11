"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Play, Eye, Pencil, QrCode, Share2, Plus, Crown, Check, Trash2, Settings, List, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BottomSheet } from '@/components/ui/bottom-sheet'

interface Template {
  id: string
  name: string
  type: "basic" | "premium"
  badge?: "NEW" | "PREMIUM" | "FREE"
  description: string
}

interface SavedInvitation {
  id: number
  templateId: string
  title: string | null
  invitationData: any
  createdAt: string
  updatedAt: string
}

const FREE_LIMIT = 2

const TEMPLATES: Template[] = [
  { id: "cinematic", name: "시네마틱", type: "premium", badge: "PREMIUM", description: "감성적인 시네마틱 무드" },
  { id: "modern", name: "모던", type: "basic", badge: "FREE", description: "깔끔한 모던 디자인" },
  { id: "classic", name: "클래식", type: "basic", badge: "FREE", description: "격식있는 클래식 스타일" },
  { id: "magazine", name: "매거진", type: "premium", badge: "NEW", description: "트렌디한 매거진 레이아웃" },
  { id: "polaroid", name: "일러스트", type: "premium", badge: "PREMIUM", description: "빈티지 일러스트 감성" },
  { id: "chat", name: "편지지", type: "premium", badge: "PREMIUM", description: "클래식 편지지 스타일" },
  { id: "traditional", name: "전통", type: "premium", badge: "PREMIUM", description: "격조높은 전통 혼례" },
  { id: "garden", name: "가든", type: "premium", badge: "PREMIUM", description: "로맨틱 가든 웨딩" },
  { id: "poster", name: "포스터", type: "premium", badge: "NEW", description: "아트 포스터 스타일" },
  { id: "boardingpass", name: "보딩패스", type: "premium", badge: "NEW", description: "여행 컨셉 보딩패스" },
  { id: "calligraphy", name: "캘리그라피", type: "premium", badge: "PREMIUM", description: "우아한 캘리그라피" },
]

function GalleryPreview({ id }: { id: string }) {
  switch (id) {
    case "cinematic":
      return (
        <div className="w-full h-full relative" style={{ background: "linear-gradient(180deg, #2a2520 0%, #1a1510 100%)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[22px] text-[#C5A572]/70 italic" style={{ fontFamily: "Georgia, serif" }}>Save</div>
            <div className="text-[32px] text-[#C5A572] italic font-bold leading-tight" style={{ fontFamily: "Georgia, serif" }}>the Date</div>
            <div className="w-[80px] h-[100px] bg-[#3D3529] rounded-[4px] mt-5 mb-4 border border-[#C5A572]/20" />
            <div className="w-[60px] h-[2px] bg-[#C5A572]/30 rounded-full mb-2" />
            <div className="text-[11px] text-[#C5A572]/50 tracking-[0.3em]">2025.10.14</div>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
            <div className="w-[100px] h-[2px] bg-[#C5A572]/30 rounded-full mb-2" />
            <div className="text-[10px] text-white/30 tracking-wider">WEDDING INVITATION</div>
          </div>
        </div>
      )
    case "modern":
      return (
        <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-3 p-6">
          <div className="text-[14px] text-[#8B95A1] italic" style={{ fontFamily: "Georgia, serif" }}>Wedding</div>
          <div className="text-[11px] text-[#B0B8C1] tracking-[0.3em]">INVITATION</div>
          <div className="w-[120px] h-[150px] bg-[#F2F4F6] rounded-[8px] my-3" />
          <div className="text-[13px] text-[#4E5968] tracking-wide">Our New Beginning</div>
          <div className="w-[80px] h-[1.5px] bg-[#D1D6DB] rounded-full" />
          <div className="text-[11px] text-[#B0B8C1] mt-2">2025. 10. 14</div>
        </div>
      )
    case "classic":
      return (
        <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6">
          <div className="w-[80px] h-[1px] bg-[#D1D6DB] mb-4" />
          <div className="text-[28px] text-[#191F28] font-bold leading-none">DEC</div>
          <div className="text-[52px] text-[#191F28] font-bold leading-none">14</div>
          <div className="text-[12px] text-[#8B95A1] tracking-[0.2em] mt-1">SATURDAY</div>
          <div className="w-[80px] h-[1px] bg-[#D1D6DB] mt-4 mb-5" />
          <div className="w-[100px] h-[80px] bg-[#F2F4F6] rounded-[4px]" />
          <div className="text-[11px] text-[#B0B8C1] mt-3 tracking-wider">G & B</div>
        </div>
      )
    case "magazine":
      return (
        <div className="w-full h-full relative" style={{ background: "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 40%, #1A1A1A 100%)" }}>
          <div className="absolute top-5 left-5 z-10">
            <div className="text-[10px] text-white/30 tracking-[0.3em] font-light">VOL. 01</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[140px] h-[180px] bg-[#333333] rounded-[4px]" />
          </div>
          <div className="absolute bottom-6 left-5 z-10">
            <div className="text-[10px] text-white/40 leading-none mb-1" style={{ fontFamily: "Georgia, serif" }}>2025.10</div>
            <div className="text-[18px] text-white font-light italic leading-tight" style={{ fontFamily: "'Great Vibes', cursive" }}>G & B</div>
            <div className="text-[9px] text-white/30 tracking-[0.2em] mt-1">WEDDING MAGAZINE</div>
          </div>
        </div>
      )
    case "polaroid":
      return (
        <div className="w-full h-full relative flex flex-col items-center justify-center" style={{ backgroundColor: "#FAF8F5" }}>
          <svg className="absolute top-4 left-4 w-8 h-8" viewBox="0 0 16 16" fill="none" stroke="#C9A88C" strokeWidth="0.5">
            <path d="M1,8 L1,2 Q1,1 2,1 L8,1" />
          </svg>
          <svg className="absolute top-4 right-4 w-8 h-8" viewBox="0 0 16 16" fill="none" stroke="#C9A88C" strokeWidth="0.5">
            <path d="M8,1 L14,1 Q15,1 15,2 L15,8" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-8 h-8" viewBox="0 0 16 16" fill="none" stroke="#C9A88C" strokeWidth="0.5">
            <path d="M1,8 L1,14 Q1,15 2,15 L8,15" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-8 h-8" viewBox="0 0 16 16" fill="none" stroke="#C9A88C" strokeWidth="0.5">
            <path d="M8,15 L14,15 Q15,15 15,14 L15,8" />
          </svg>
          <div className="w-[100px] h-[120px] bg-[#EDE8DF] rounded-[4px] mb-3 border border-[#D4C5B0]" />
          <div className="text-[14px] tracking-[0.3em]" style={{ color: "#2C2720", fontFamily: "'Playfair Display', Georgia, serif" }}>G & B</div>
          <svg width="60" height="10" viewBox="0 0 60 10" fill="none" className="mt-2">
            <line x1="5" y1="5" x2="24" y2="5" stroke="#E8DDD3" strokeWidth="0.5" />
            <path d="M30 2L32 5L30 8L28 5L30 2Z" fill="#C9A88C" />
            <line x1="36" y1="5" x2="55" y2="5" stroke="#E8DDD3" strokeWidth="0.5" />
          </svg>
          <div className="text-[9px] text-[#A69882] mt-2 tracking-[0.2em]">WEDDING INVITATION</div>
        </div>
      )
    case "chat":
      return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: "#F7F4EF" }}>
          <div style={{ backgroundColor: "#5C6B4E" }}>
            <svg className="w-full" viewBox="0 0 280 60" preserveAspectRatio="none" style={{ display: "block" }}>
              <path d="M0,0 L140,55 L280,0 L280,0 L0,0 Z" fill="#4A5940" />
            </svg>
            <div className="text-center pb-4 -mt-1">
              <div className="text-[14px] text-white/90 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>G & B</div>
              <div className="text-[8px] text-white/50 tracking-[0.2em] mt-1">WEDDING</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
            <div className="w-[100px] h-[120px] border border-[#D4CEBD] bg-[#E8E2D6]" />
            <div className="w-[60px] h-[1px] mx-auto mt-4" style={{ backgroundColor: "#D4CEBD" }} />
            <div className="text-[9px] text-[#8B8070] mt-2 tracking-wider">2025. 10. 14</div>
          </div>
        </div>
      )
    case "traditional":
      return (
        <div className="w-full h-full relative" style={{ background: "#1e2a3a" }}>
          <div className="absolute inset-[8px] border-double border-2 border-[#C5A572]/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-[10px] text-[#C5A572]/50 tracking-[0.3em]">WEDDING</div>
            <div className="text-[28px] text-[#C5A572] font-bold" style={{ fontFamily: "Georgia, serif", writingMode: "vertical-rl" as any }}>결혼합니다</div>
            <div className="w-[60px] h-[1px] bg-[#C5A572]/30 mt-2" />
            <div className="text-[10px] text-[#C5A572]/40 tracking-wider mt-1">2025. 10. 14</div>
          </div>
        </div>
      )
    case "garden":
      return (
        <div className="w-full h-full bg-white relative flex flex-col items-center justify-center p-6">
          <div className="absolute top-3 left-3 w-[28px] h-[28px] rounded-full" style={{ background: "radial-gradient(circle, #F5B7C5 0%, #E8A5B8 40%, transparent 70%)" }} />
          <div className="absolute top-3 right-3 w-[20px] h-[20px] rounded-full" style={{ background: "radial-gradient(circle, #D4E4D4 0%, #B8D4B8 40%, transparent 70%)" }} />
          <div className="absolute bottom-3 left-3 w-[20px] h-[20px] rounded-full" style={{ background: "radial-gradient(circle, #D4E4D4 0%, #B8D4B8 40%, transparent 70%)" }} />
          <div className="absolute bottom-3 right-3 w-[28px] h-[28px] rounded-full" style={{ background: "radial-gradient(circle, #F5B7C5 0%, #E8A5B8 40%, transparent 70%)" }} />
          <div className="w-[80px] h-[80px] rounded-full bg-[#F0F4F0] border border-[#D4DFD4] mb-3" />
          <div className="text-[12px] text-[#5C7A5C]" style={{ fontFamily: "Georgia, serif" }}>Blooming</div>
          <div className="text-[20px] text-[#8B6F6F] font-medium" style={{ fontFamily: "Georgia, serif" }}>Garden</div>
          <div className="w-[60px] h-[1px] bg-[#D4DFD4] mt-3 mb-2" />
          <div className="text-[9px] text-[#A5B5A5] tracking-wider">2025. 10. 14</div>
        </div>
      )
    case "poster":
      return (
        <div className="w-full h-full relative" style={{ backgroundColor: "#FDF8F3" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none"><path d="M10 2C10 2 8 6 4 8C8 10 10 14 10 14C10 14 12 10 16 8C12 6 10 2 10 2Z" fill="#E8A87C" opacity="0.5"/></svg>
            <div className="text-[12px] mt-2" style={{ color: "#C5956B", fontFamily: "'Caveat', cursive" }}>The Wedding of</div>
            <div className="text-[22px] font-medium mt-1" style={{ color: "#8B6F5C" }}>G & B</div>
            <div className="w-[80px] h-[100px] bg-[#F0E8DC] rounded-[4px] mt-3 border border-[#E0D4C2]" />
            <svg width="24" height="14" viewBox="0 0 20 20" fill="none" className="mt-3"><circle cx="10" cy="10" r="4" fill="#D4A5A5" opacity="0.3"/><path d="M6 10C6 10 8 6 10 6C12 6 14 10 14 10" stroke="#C5956B" strokeWidth="0.8" fill="none"/></svg>
            <div className="text-[9px] text-[#B0A090] mt-2 tracking-wider">2025. 10. 14</div>
          </div>
          <svg className="absolute top-3 left-3" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="6" cy="8" r="4" fill="#F4C7AB" opacity="0.4"/></svg>
          <svg className="absolute bottom-3 right-3" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="#B5C7D3" opacity="0.3"/></svg>
        </div>
      )
    case "boardingpass":
      return (
        <div className="w-full h-full relative" style={{ backgroundColor: "#1E2D4A" }}>
          <div className="absolute inset-x-4 top-4 bottom-4 rounded-[8px] flex flex-col items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" className="mb-2">
              <circle cx="50" cy="50" r="40" stroke="#1E2D4A" strokeWidth="2" fill="none" opacity="0.2"/>
              <ellipse cx="50" cy="50" rx="16" ry="40" stroke="#1E2D4A" strokeWidth="1.5" fill="none" opacity="0.2"/>
              <path d="M10 50h80" stroke="#1E2D4A" strokeWidth="1.5" opacity="0.2"/>
            </svg>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-[24px] h-[0.5px]" style={{ backgroundColor: "#D4DCE6" }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#1E2D4A" fillOpacity="0.4"/>
              </svg>
              <div className="w-[24px] h-[0.5px]" style={{ backgroundColor: "#D4DCE6" }} />
            </div>
            <div className="text-[14px] font-bold tracking-[0.15em]" style={{ color: "#1E2D4A" }}>G & B</div>
            <div className="text-[8px] tracking-[0.3em] mt-1" style={{ color: "#6B7B8D" }}>WEDDING TICKET</div>
            <div className="absolute bottom-8 left-4 right-4 border-t border-dashed" style={{ borderColor: "#D4DCE6" }} />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="text-[7px] tracking-wider" style={{ color: "#9CAAB8" }}>2025. 10. 14</div>
            </div>
          </div>
        </div>
      )
    case "calligraphy":
      return (
        <div className="w-full h-full relative" style={{ background: "linear-gradient(180deg, #FBF8F4 0%, #F0E8DC 100%)" }}>
          <div className="absolute top-5 left-0 right-0 text-center">
            <div className="text-[9px] tracking-[0.3em]" style={{ color: "#7A6E62" }}>WEDDING INVITATION</div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-[90px] h-[110px] rounded-[4px] overflow-hidden border border-[#D4C5B0]">
              <div className="w-full h-full bg-[#E8DFD2]" />
            </div>
            <div className="mt-3 text-[22px] font-medium" style={{ color: "#3D3226", fontFamily: "Georgia, serif" }}>G & B</div>
            <div className="text-[9px] text-[#9C8B7A] mt-1 tracking-wider">2025. 10. 14</div>
          </div>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-2">
            <div className="w-[30px] h-[1px]" style={{ backgroundColor: "#D4C5B0" }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#9C7B5C" }} />
            <div className="w-[30px] h-[1px]" style={{ backgroundColor: "#D4C5B0" }} />
          </div>
        </div>
      )
    default:
      return <div className="w-full h-full bg-[#333D4B]" />
  }
}

export default function InvitationGalleryPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [savedInvitations, setSavedInvitations] = useState<SavedInvitation[]>([])
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showLimitPayment, setShowLimitPayment] = useState(false)

  const currentTemplate = TEMPLATES[currentIndex]

  useEffect(() => {
    const saved = localStorage.getItem("weve_premium_user")
    if (saved === "true") setIsPremiumUser(true)
  }, [])

  const fetchInvitations = async () => {
    setIsLoadingInvitations(true)
    try {
      const res = await fetch("/api/invitations")
      if (res.ok) {
        const data = await res.json()
        setSavedInvitations(data)
      }
    } catch (err) {
      console.error("Failed to load invitations:", err)
    } finally {
      setIsLoadingInvitations(false)
    }
  }

  const handleDeleteInvitation = async (id: number) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" })
      if (res.ok) {
        setSavedInvitations((prev) => prev.filter((inv) => inv.id !== id))
        showToastMessage("청첩장이 삭제되었습니다")
      }
    } catch (err) {
      console.error("Failed to delete invitation:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenManage = () => {
    fetchInvitations()
    setShowManageModal(true)
  }

  const goToIndex = (index: number) => {
    if (index < 0 || index >= TEMPLATES.length) return
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < TEMPLATES.length - 1) goToIndex(currentIndex + 1)
      else if (diff < 0 && currentIndex > 0) goToIndex(currentIndex - 1)
    }
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    const diff = startX - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < TEMPLATES.length - 1) goToIndex(currentIndex + 1)
      else if (diff < 0 && currentIndex > 0) goToIndex(currentIndex - 1)
    }
    setIsDragging(false)
  }

  const handleCreate = async () => {
    try {
      const countRes = await fetch("/api/invitations")
      if (countRes.ok) {
        const existing = await countRes.json()
        if (existing.length >= FREE_LIMIT) {
          setShowLimitPayment(true)
          return
        }
      }

      if (currentTemplate.type === "premium" && !isPremiumUser) {
        setShowPaymentModal(true)
        return
      }

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: currentTemplate.id }),
      })

      if (res.status === 403) {
        setShowLimitPayment(true)
        return
      }

      if (res.ok) {
        const created = await res.json()
        router.push(`/wedding/editor?id=${created.id}&template=${currentTemplate.id}`)
      }
    } catch (err) {
      console.error("Failed to create invitation:", err)
    }
  }

  const handlePayment = (method: string) => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      setIsPremiumUser(true)
      localStorage.setItem("weve_premium_user", "true")
      setTimeout(() => {
        setShowPaymentModal(false)
        setPaymentSuccess(false)
        showToastMessage("결제가 완료되었습니다!")
        setTimeout(() => router.push(`/wedding/editor?template=${currentTemplate.id}`), 1200)
      }, 1000)
    }, 2000)
  }

  const showToastMessage = (msg: string) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "PREMIUM":
        return "bg-gradient-to-r from-[#C5A572] to-[#E8D5A8] text-white"
      case "FREE":
        return "bg-[#E5E8EB] text-[#4E5968]"
      case "NEW":
        return "bg-[#3182F6] text-white"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-[#191F28] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#333D4B] flex items-center justify-center"
          data-testid="button-close-gallery"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Title */}
      <div className="text-center px-6 pt-2 pb-8">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#3182F6] mb-4">
          <span className="text-[12px] font-bold text-white tracking-wider">NEW</span>
        </div>
        <h1 className="text-[28px] font-bold text-white mb-3" data-testid="text-gallery-title">
          모바일 청첩장
        </h1>
        <p className="text-[15px] text-[#8B95A1] leading-relaxed">
          전문 디자이너가 만든 고퀄리티의 템플릿
          <br />
          추가금액 없는 100% 무료 청첩장
        </p>
      </div>

      {/* Template Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          ref={containerRef}
          className="relative w-full max-w-[400px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          data-testid="carousel-container"
        >
          <div className="relative h-[480px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {TEMPLATES.map((template, index) => {
                const offset = index - currentIndex
                if (Math.abs(offset) > 1) return null

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.85, x: offset > 0 ? 200 : -200 }}
                    animate={{
                      opacity: offset === 0 ? 1 : 0.5,
                      scale: offset === 0 ? 1 : 0.85,
                      x: offset * 240,
                      zIndex: offset === 0 ? 10 : 5,
                    }}
                    exit={{ opacity: 0, scale: 0.85, x: offset > 0 ? 200 : -200 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute cursor-pointer"
                    onClick={() => {
                      if (offset !== 0) goToIndex(index)
                    }}
                    data-testid={`template-card-${template.id}`}
                  >
                    <div className={`relative w-[280px] rounded-[24px] overflow-hidden shadow-2xl ${
                      offset === 0 ? "ring-2 ring-white/20" : ""
                    }`}>
                      {/* Badge */}
                      {template.badge && (
                        <div className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider ${getBadgeStyle(template.badge)}`}>
                          {template.badge}
                        </div>
                      )}

                      <div className="relative aspect-[9/16] bg-[#333D4B]">
                        <GalleryPreview id={template.id} />
                        {offset === 0 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        )}
                      </div>

                      {/* Card overlay actions for focused card */}
                      {offset === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {/* Management bar */}
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" data-testid="button-manage-list">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M4 6h16M4 12h16M4 18h7" />
                              </svg>
                            </button>
                            <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" data-testid="button-manage-delete">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenManage() }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
                              data-testid="button-manage-settings"
                            >
                              <Settings className="w-3.5 h-3.5 text-white" />
                              <span className="text-[12px] text-white font-medium">청첩장 관리</span>
                            </button>
                          </div>

                          {/* Action buttons row */}
                          <div className="flex items-center justify-center gap-6">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowPreview(true) }}
                              className="flex flex-col items-center gap-1"
                              data-testid="button-preview"
                            >
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Play className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-[11px] text-white/80">미리보기</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCreate() }}
                              className="flex flex-col items-center gap-1"
                              data-testid="button-edit-template"
                            >
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Pencil className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-[11px] text-white/80">편집</span>
                            </button>
                            <button className="flex flex-col items-center gap-1" data-testid="button-qrcode">
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <QrCode className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-[11px] text-white/80">QR코드</span>
                            </button>
                            <button className="flex flex-col items-center gap-1" data-testid="button-share">
                              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-[11px] text-white/80">공유하기</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {TEMPLATES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/30"
                }`}
                data-testid={`dot-indicator-${i}`}
              />
            ))}
          </div>
        </div>

        {/* Create Button */}
        <div className="w-full max-w-[400px] px-4 mt-8 mb-4">
          <button
            onClick={handleCreate}
            className="w-full py-4 bg-[#333D4B] rounded-[16px] text-[16px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            data-testid="button-create-invitation"
          >
            <Plus className="w-5 h-5" />
            청첩장 추가
          </button>
        </div>

        {/* Close button at bottom */}
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#333D4B] flex items-center justify-center mb-8"
          data-testid="button-close-bottom"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-[360px] rounded-[24px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[9/16]" data-testid="img-preview">
                <GalleryPreview id={currentTemplate.id} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-[18px] font-bold mb-1">{currentTemplate.name}</p>
                <p className="text-white/70 text-[14px] mb-4">{currentTemplate.description}</p>
                <button
                  onClick={() => { setShowPreview(false); handleCreate() }}
                  className="w-full py-3 bg-[#FF8A80] rounded-[12px] text-white text-[15px] font-semibold"
                  data-testid="button-create-from-preview"
                >
                  이 템플릿으로 만들기
                </button>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
                data-testid="button-close-preview"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Bottom Sheet */}
      <BottomSheet open={showPaymentModal} onOpenChange={(open) => !isProcessing && setShowPaymentModal(open)} className="bg-white max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                {paymentSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-[#4CAF50]" />
                    </div>
                    <p className="text-[20px] font-bold text-[#191F28] mb-2">결제 완료</p>
                    <p className="text-[14px] text-[#8B95A1]">프리미엄 템플릿이 활성화되었습니다</p>
                  </div>
                ) : (
                  <>
                    {/* Premium icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C5A572] to-[#E8D5A8] flex items-center justify-center">
                        <Crown className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <h2 className="text-[22px] font-bold text-[#191F28] text-center mb-2" data-testid="text-payment-title">
                      프리미엄 템플릿 잠금 해제
                    </h2>
                    <p className="text-[14px] text-[#8B95A1] text-center leading-relaxed mb-6">
                      7,900원에 평생 소장하세요.
                      <br />
                      모든 프리미엄 템플릿을 자유롭게 사용할 수 있습니다.
                    </p>

                    {/* Price */}
                    <div className="bg-[#F8F9FA] rounded-[16px] p-4 mb-6 text-center">
                      <p className="text-[12px] text-[#8B95A1] mb-1">일시불</p>
                      <p className="text-[32px] font-bold text-[#191F28]" data-testid="text-price">
                        &#8361;7,900
                      </p>
                      <p className="text-[12px] text-[#8B95A1]">평생 이용 가능</p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 mb-8">
                      {["모든 프리미엄 템플릿 사용", "고급 오프닝 애니메이션", "맞춤형 RSVP 관리"].map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#4CAF50]" />
                          <span className="text-[14px] text-[#4E5968]">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handlePayment("kakao")}
                        disabled={isProcessing}
                        className="w-full py-4 bg-[#FEE500] rounded-[12px] text-[15px] font-bold text-[#191F28] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
                        data-testid="button-pay-kakao"
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-[#191F28]/30 border-t-[#191F28] rounded-full animate-spin" />
                        ) : (
                          <>Kakao Pay로 결제</>
                        )}
                      </button>
                      <button
                        onClick={() => handlePayment("toss")}
                        disabled={isProcessing}
                        className="w-full py-4 bg-[#3182F6] rounded-[12px] text-[15px] font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
                        data-testid="button-pay-toss"
                      >
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Toss Pay로 결제</>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
      </BottomSheet>

      {/* Invitation Management Modal */}
      <BottomSheet open={showManageModal} onOpenChange={setShowManageModal} className="bg-white max-h-[80vh] overflow-hidden flex flex-col" data-testid="modal-manage-invitations">
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-bold text-[#191F28]" data-testid="text-manage-title">
                    청첩장 관리
                  </h2>
                  <button
                    onClick={() => setShowManageModal(false)}
                    className="w-8 h-8 rounded-full bg-[#F2F4F6] flex items-center justify-center"
                    data-testid="button-close-manage"
                  >
                    <X className="w-4 h-4 text-[#8B95A1]" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2.5 py-1 rounded-full bg-[#F2F4F6]">
                    <span className="text-[12px] font-medium text-[#4E5968]">
                      {savedInvitations.length} / {FREE_LIMIT} 무료
                    </span>
                  </div>
                  {savedInvitations.length >= FREE_LIMIT && (
                    <span className="text-[12px] text-[#FF6B6B]">
                      무료 한도에 도달했습니다
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {isLoadingInvitations ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#8B95A1] animate-spin" />
                  </div>
                ) : savedInvitations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#F2F4F6] flex items-center justify-center mx-auto mb-4">
                      <List className="w-7 h-7 text-[#B0B8C1]" />
                    </div>
                    <p className="text-[15px] text-[#8B95A1] mb-1">아직 만든 청첩장이 없습니다</p>
                    <p className="text-[13px] text-[#B0B8C1]">템플릿을 선택해서 청첩장을 만들어보세요</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedInvitations.map((inv) => {
                      const templateInfo = TEMPLATES.find((t) => t.id === inv.templateId)
                      const displayName = inv.invitationData?.groomName && inv.invitationData?.brideName
                        ? `${inv.invitationData.groomName} ♥ ${inv.invitationData.brideName}`
                        : inv.title || templateInfo?.name || inv.templateId
                      const updatedDate = new Date(inv.updatedAt || inv.createdAt).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })

                      return (
                        <div
                          key={inv.id}
                          className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[16px]"
                          data-testid={`card-invitation-${inv.id}`}
                        >
                          <div
                            className="w-14 h-20 rounded-[10px] bg-[#E5E8EB] overflow-hidden flex-shrink-0 cursor-pointer"
                            onClick={() => {
                              setShowManageModal(false)
                              router.push(`/wedding/editor?id=${inv.id}&template=${inv.templateId}`)
                            }}
                          >
                            {templateInfo ? (
                              <GalleryPreview id={templateInfo.id} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Pencil className="w-4 h-4 text-[#B0B8C1]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[14px] font-semibold text-[#191F28] truncate cursor-pointer"
                              onClick={() => {
                                setShowManageModal(false)
                                router.push(`/wedding/editor?id=${inv.id}&template=${inv.templateId}`)
                              }}
                              data-testid={`text-invitation-name-${inv.id}`}
                            >
                              {displayName}
                            </p>
                            <p className="text-[12px] text-[#8B95A1] mt-0.5">
                              {templateInfo?.name || inv.templateId} 템플릿
                            </p>
                            <p className="text-[11px] text-[#B0B8C1] mt-0.5">
                              {updatedDate} 수정
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteInvitation(inv.id)}
                            disabled={deletingId === inv.id}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors disabled:opacity-50"
                            data-testid={`button-delete-invitation-${inv.id}`}
                          >
                            {deletingId === inv.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
      </BottomSheet>

      {/* Limit Reached Payment Modal */}
      <BottomSheet open={showLimitPayment} onOpenChange={setShowLimitPayment} className="bg-white max-h-[80vh] overflow-y-auto" data-testid="modal-limit-payment">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFF0F0] flex items-center justify-center">
                    <Crown className="w-7 h-7 text-[#FF6B6B]" />
                  </div>
                </div>
                <h2 className="text-[22px] font-bold text-[#191F28] text-center mb-2" data-testid="text-limit-title">
                  무료 청첩장 한도 초과
                </h2>
                <p className="text-[14px] text-[#8B95A1] text-center leading-relaxed mb-6">
                  무료로 2개까지 만들 수 있습니다.
                  <br />
                  추가 청첩장을 만들려면 결제가 필요합니다.
                </p>

                <div className="bg-[#F8F9FA] rounded-[16px] p-4 mb-6 text-center">
                  <p className="text-[12px] text-[#8B95A1] mb-1">추가 청첩장</p>
                  <p className="text-[32px] font-bold text-[#191F28]" data-testid="text-additional-price">
                    &#8361;3,900
                  </p>
                  <p className="text-[12px] text-[#8B95A1]">청첩장 1개당</p>
                </div>

                <div className="space-y-2 mb-8">
                  {["기존 청첩장 유지", "추가 템플릿 사용 가능", "무제한 수정"].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4CAF50]" />
                      <span className="text-[14px] text-[#4E5968]">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLimitPayment(false)
                      showToastMessage("결제 기능이 곧 지원될 예정입니다")
                    }}
                    className="w-full py-4 bg-[#191F28] rounded-[12px] text-[15px] font-bold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    data-testid="button-pay-additional"
                  >
                    결제하기
                  </button>
                  <button
                    onClick={() => setShowLimitPayment(false)}
                    className="w-full py-3 text-[14px] text-[#8B95A1]"
                    data-testid="button-cancel-limit"
                  >
                    나중에 하기
                  </button>
                </div>
              </div>
      </BottomSheet>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-[#191F28] text-white px-6 py-3 rounded-full text-[14px] font-medium shadow-lg"
            data-testid="toast-message"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
