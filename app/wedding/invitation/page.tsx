"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Play, Eye, Pencil, QrCode, Share2, Plus, Crown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Template {
  id: string
  name: string
  type: "basic" | "premium"
  image: string
  badge?: "NEW" | "PREMIUM" | "FREE"
  description: string
}

const TEMPLATES: Template[] = [
  {
    id: "cinematic",
    name: "시네마틱",
    type: "premium",
    image: "/images/template-cinematic.png",
    badge: "PREMIUM",
    description: "감성적인 시네마틱 무드",
  },
  {
    id: "modern",
    name: "모던",
    type: "basic",
    image: "/images/template-modern.png",
    badge: "FREE",
    description: "깔끔한 모던 디자인",
  },
  {
    id: "classic",
    name: "클래식",
    type: "basic",
    image: "/images/template-classic.png",
    badge: "FREE",
    description: "격식있는 클래식 스타일",
  },
  {
    id: "magazine",
    name: "매거진",
    type: "premium",
    image: "/images/template-magazine.png",
    badge: "NEW",
    description: "트렌디한 매거진 레이아웃",
  },
  {
    id: "polaroid",
    name: "폴라로이드",
    type: "premium",
    image: "/images/template-polaroid.png",
    badge: "PREMIUM",
    description: "빈티지 폴라로이드 감성",
  },
  {
    id: "chat",
    name: "채팅",
    type: "premium",
    image: "/images/template-chat.png",
    badge: "PREMIUM",
    description: "재미있는 채팅 스타일",
  },
]

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

  const currentTemplate = TEMPLATES[currentIndex]

  useEffect(() => {
    const saved = localStorage.getItem("weve_premium_user")
    if (saved === "true") setIsPremiumUser(true)
  }, [])

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

  const handleCreate = () => {
    if (currentTemplate.type === "basic" || isPremiumUser) {
      router.push("/wedding/editor")
    } else {
      setShowPaymentModal(true)
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
        setTimeout(() => router.push("/wedding/editor"), 1200)
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

                      {/* Template Image */}
                      <div className="relative aspect-[9/16] bg-[#333D4B]">
                        <img
                          src={template.image}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay for focused card */}
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
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm" data-testid="button-manage-settings">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                              </svg>
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
              <img
                src={currentTemplate.image}
                alt={currentTemplate.name}
                className="w-full"
                data-testid="img-preview"
              />
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
      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => !isProcessing && setShowPaymentModal(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* Handle bar */}
                <div className="w-10 h-1 bg-[#E5E8EB] rounded-full mx-auto mb-6" />

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
                      {["모든 프리미엄 템플릿 사용", "고급 오프닝 애니메이션", "광고 없는 청첩장"].map((benefit) => (
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
