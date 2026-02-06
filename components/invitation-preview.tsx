"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { InvitationData } from "@/app/wedding/editor/page"
import { Phone, Copy, ChevronLeft, ChevronRight, X } from "lucide-react"

interface InvitationPreviewProps {
  data: InvitationData & { date?: string; time?: string }
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[22px] font-bold text-[#191F28] tracking-tight">
        {title}
      </h2>
      <div className="w-8 h-[3px] bg-[#FF8A80] mt-2 rounded-full" />
    </div>
  )
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  const allPhotos = [
    data.coverImage,
    ...(data.mainPhotos || []),
  ].filter(Boolean) as string[]
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [showGuestbookForm, setShowGuestbookForm] = useState(false)
  const [guestbookName, setGuestbookName] = useState("")
  const [guestbookMessage, setGuestbookMessage] = useState("")
  const [guestbookEntries, setGuestbookEntries] = useState<Array<{ name: string; message: string; date: string }>>([])
  const [copiedToast, setCopiedToast] = useState("")
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)
  const [openingDone, setOpeningDone] = useState(!data.showOpening)
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!data.showOpening || openingDone) return
    const autoAdvance = setTimeout(() => setOpeningDone(true), 6000)
    return () => clearTimeout(autoAdvance)
  }, [data.showOpening, openingDone])

  const coverStyle = data.coverDisplayStyle || "slide"

  useEffect(() => {
    if (allPhotos.length <= 1 || coverStyle === "static") return
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allPhotos.length)
    }, 3000)
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [allPhotos.length, coverStyle])

  useEffect(() => {
    if (!data.weddingDate) return
    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(data.weddingDate!).getTime()
      const diff = Math.max(0, target - now)
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [data.weddingDate])

  useEffect(() => {
    const loadGuestbook = async () => {
      try {
        const res = await fetch("/api/invitation/guestbook?userId=default")
        if (res.ok) {
          const entries = await res.json()
          if (Array.isArray(entries)) setGuestbookEntries(entries)
        }
      } catch {}
    }
    loadGuestbook()
  }, [])

  useEffect(() => {
    if (data.mainTemplate === "polaroid") {
      const link = document.createElement("link")
      link.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap"
      link.rel = "stylesheet"
      if (!document.querySelector('link[href*="Caveat"]')) {
        document.head.appendChild(link)
      }
    }
  }, [data.mainTemplate])

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(`${label} 복사되었습니다.`)
      setTimeout(() => setCopiedToast(""), 2000)
    }).catch(() => {})
  }, [])

  const copyLink = useCallback(() => {
    const url = window.location.origin + "/invitation/preview"
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast("링크가 복사되었습니다.")
      setTimeout(() => setCopiedToast(""), 2000)
    }).catch(() => {})
  }, [])

  const submitGuestbook = useCallback(async () => {
    if (!guestbookName.trim() || !guestbookMessage.trim()) return
    const entry = {
      name: guestbookName.trim(),
      message: guestbookMessage.trim(),
      date: new Date().toISOString().split("T")[0],
    }
    try {
      await fetch("/api/invitation/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default", entry }),
      })
    } catch {}
    setGuestbookEntries((prev) => [entry, ...prev])
    setGuestbookName("")
    setGuestbookMessage("")
    setShowGuestbookForm(false)
  }, [guestbookName, guestbookMessage])

  const getCalendarData = () => {
    if (!data.weddingDate) return null
    const d = new Date(data.weddingDate)
    const year = d.getFullYear()
    const month = d.getMonth()
    const weddingDay = d.getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= lastDate; i++) days.push(i)
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    const weddingDayName = dayNames[d.getDay()]
    return { year, month: month + 1, weddingDay, days, weddingDayName, dayNames }
  }

  const formatWeddingDate = () => {
    if (!data.weddingDate) return ""
    const d = new Date(data.weddingDate)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
  }

  const formatWeddingTime = () => {
    if (!data.time) return ""
    return data.time
  }

  const galleryImages = data.galleryImages?.filter(Boolean) || []

  return (
    <div className="w-full h-full overflow-y-auto bg-[#F2F4F6]" data-testid="invitation-preview">
      <div className="max-w-[420px] mx-auto">

        {/* ===== OPENING SECTION ===== */}
        <AnimatePresence mode="wait">
          {data.showOpening && !openingDone && (
            <motion.div
              key="opening"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Type 1 - Cinematic Fade */}
              {(data.openingType === "type1" || (!data.openingType)) && (
                <div
                  className="relative w-full overflow-hidden bg-black"
                  style={{ minHeight: "100dvh" }}
                >
                  {(data.openingScenes?.[0] || data.coverImage) && (
                    <motion.img
                      src={data.openingScenes?.[0] || data.coverImage}
                      alt="Opening"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.15 }}
                      transition={{ duration: 8, ease: "linear" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.p
                      className="text-white/90 text-[14px] tracking-[0.2em] uppercase"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {data.openingTexts?.[0] || "We are getting married"}
                    </motion.p>
                    <motion.p
                      className="text-white text-[40px] font-bold mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 1 }}
                      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
                    >
                      {data.openingTexts?.[1] || formatWeddingDate() || "2025.06.21"}
                    </motion.p>
                    <motion.p
                      className="text-white/80 text-[18px] tracking-[0.1em] mt-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5, duration: 1 }}
                    >
                      {data.openingTexts?.[2] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 text-[13px] tracking-wider border border-white/30 px-6 py-2 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    onClick={() => setOpeningDone(true)}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}

              {/* Type 2 - Typographic Slide */}
              {data.openingType === "type2" && (
                <div
                  className="relative w-full overflow-hidden bg-white"
                  style={{ minHeight: "100dvh" }}
                >
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFF5F4 50%, #FFE8E5 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center justify-center px-8" style={{ minHeight: "100dvh" }}>
                    <motion.h1
                      className="text-[#191F28] text-[56px] font-bold leading-[1.1] text-center"
                      initial={{ opacity: 0, y: 80 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    >
                      {data.openingTexts?.[0] || "우리\n결혼합니다"}
                    </motion.h1>
                    <motion.p
                      className="text-[#8B95A1] text-[15px] mt-6 tracking-wide"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      {data.openingTexts?.[1] || formatWeddingDate()}
                    </motion.p>
                    <motion.div
                      className="grid grid-cols-2 gap-2 mt-8 w-full max-w-[280px]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                    >
                      {[data.openingScenes?.[0] || data.coverImage, data.openingScenes?.[1], data.openingScenes?.[2]].filter(Boolean).slice(0, 4).map((img, i) => (
                        <div key={i} className={`${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} rounded-[12px] overflow-hidden`}>
                          <img src={img!} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </motion.div>
                    <motion.p
                      className="text-[#4E5968] text-[14px] mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                    >
                      {data.openingTexts?.[2] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#4E5968] text-[13px] tracking-wider border border-[#E5E8EB] px-6 py-2 rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    onClick={() => setOpeningDone(true)}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}

              {/* Type 3 - Simple Card */}
              {data.openingType === "type3" && (
                <div
                  className="relative w-full overflow-hidden bg-[#F2F4F6]"
                  style={{ minHeight: "100dvh" }}
                >
                  <div className="flex flex-col items-center justify-center px-8" style={{ minHeight: "100dvh" }}>
                    <motion.div
                      className="w-[260px] bg-white rounded-[20px] shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={data.openingScenes?.[0] || data.coverImage || ""}
                          alt="Opening"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 text-center">
                        <p className="text-[#191F28] text-[18px] font-bold">
                          {data.openingTexts?.[0] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                        </p>
                        <p className="text-[#8B95A1] text-[13px] mt-2">
                          {data.openingTexts?.[1] || formatWeddingDate()}
                        </p>
                      </div>
                    </motion.div>
                    <motion.p
                      className="text-[#8B95A1] text-[13px] mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {data.openingTexts?.[2] || data.venue || ""}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#4E5968] text-[13px] tracking-wider border border-[#E5E8EB] px-6 py-2 rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    onClick={() => setOpeningDone(true)}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== MAIN CONTENT (after opening) ===== */}
        {(openingDone || !data.showOpening) && (
          <>
            {/* Poster Template */}
            {data.mainTemplate === "poster" && (
              <div className="relative w-full overflow-hidden" style={{ minHeight: "580px" }}>
                {allPhotos.length > 0 ? (
                  <>
                    {coverStyle === "static" ? (
                      <div className="absolute inset-0">
                        <img src={allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "580px" }} />
                      </div>
                    ) : coverStyle === "slide" ? (
                      <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {allPhotos.map((photo, i) => (
                          <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "580px" }}>
                            <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "580px" }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      allPhotos.map((photo, i) => (
                        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: currentSlide === i ? 1 : 0 }}>
                          <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "580px" }} />
                        </div>
                      ))
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center" style={{ minHeight: "580px", background: "linear-gradient(180deg, #7BA4C7 0%, #9BB8D3 50%, #C5D5E4 100%)" }}>
                    <p className="text-[14px] text-white/70">커버 사진을 추가해주세요</p>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-10">
                  <p className="text-white text-[40px] font-bold leading-[1.1]" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}>
                    {data.title || "Our Wedding Day"}
                  </p>
                  <p className="text-white/80 text-[14px] mt-3 tracking-wide">
                    {formatWeddingDate()}{data.weddingDate ? " | " : ""}{data.time || ""}{data.venue ? " | " + data.venue : ""}
                  </p>
                </div>
                {allPhotos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allPhotos.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: currentSlide === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Polaroid Template */}
            {data.mainTemplate === "polaroid" && (
              <div className="bg-[#F2F4F6] px-6 py-14">
                <div className="max-w-[320px] mx-auto">
                  <div className="bg-white p-3 pb-14 shadow-lg" style={{ transform: "rotate(-1.5deg)" }}>
                    <div className="aspect-[4/5] overflow-hidden">
                      <img src={allPhotos[0] || ""} alt="Polaroid" className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-[#4E5968] text-[20px]" style={{ fontFamily: "'Caveat', 'Nanum Pen Script', cursive" }}>
                        {formatWeddingDate() || "Our Special Day"}
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-8">
                    <p className="text-[#191F28] text-[24px] font-bold">
                      {data.groomName || "신랑"} & {data.brideName || "신부"}
                    </p>
                    <p className="text-[#8B95A1] text-[14px] mt-2">
                      {data.title || "우리의 날"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Magazine Template */}
            {data.mainTemplate === "magazine" && (
              <div className="bg-white">
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img src={allPhotos[0] || ""} alt="Magazine" className="w-full h-full object-cover" />
                </div>
                <div className="px-8 py-10 text-center">
                  <p className="text-[#191F28] text-[12px] tracking-[0.3em] uppercase mb-3 font-light">
                    The Wedding of
                  </p>
                  <p className="text-[#191F28] text-[36px] font-extralight leading-[1.2] tracking-tight">
                    {data.groomName || "신랑"} & {data.brideName || "신부"}
                  </p>
                  <div className="w-12 h-px bg-[#FF8A80] mx-auto my-5" />
                  <p className="text-[#8B95A1] text-[14px] tracking-wide">
                    {formatWeddingDate()}{data.time ? " | " + data.time : ""}
                  </p>
                  <p className="text-[#8B95A1] text-[13px] mt-1">
                    {data.venue || ""}
                  </p>
                </div>
              </div>
            )}

            {/* Chat Template */}
            {data.mainTemplate === "chat" && (
              <div className="bg-[#B2C7D9]" style={{ minHeight: "500px" }}>
                <div className="bg-[#93B5CF] text-white flex items-center justify-between px-4 py-2">
                  <span className="text-[12px] font-medium">12:00</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span>&#9679;&#9679;&#9679;</span>
                    <span>&#9608;</span>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[14px] font-bold text-[#4E5968]">
                      WE
                    </div>
                    <div>
                      <p className="text-[15px] text-[#191F28] font-bold">Wedding Invitation</p>
                      <p className="text-[12px] text-[#4E5968]">2 members</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="bg-[#8B95A1]/30 px-4 py-1.5 rounded-full">
                        <p className="text-[11px] text-white">{formatWeddingDate() || "2025.06.21"}</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[11px] font-bold text-[#4E5968] flex-shrink-0">
                        {(data.groomName || "신랑").charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] text-[#4E5968] mb-1 ml-1">{data.groomName || "신랑"}</p>
                        <div className="bg-white rounded-[16px] rounded-tl-[4px] p-4 max-w-[240px] shadow-sm">
                          <p className="text-[14px] text-[#191F28] leading-[1.6]">{data.message || "저희 결혼합니다! 축하해주러 오실 거죠?"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FF8A80]/30 flex items-center justify-center text-[11px] font-bold text-[#FF8A80] flex-shrink-0">
                        {(data.brideName || "신부").charAt(0)}
                      </div>
                      <div>
                        <p className="text-[11px] text-[#4E5968] mb-1 ml-1">{data.brideName || "신부"}</p>
                        {allPhotos[0] ? (
                          <div className="rounded-[16px] rounded-tl-[4px] overflow-hidden max-w-[200px] shadow-sm">
                            <img src={allPhotos[0]} alt="Wedding" className="w-full aspect-[3/4] object-cover" />
                          </div>
                        ) : (
                          <div className="bg-white rounded-[16px] rounded-tl-[4px] p-4 max-w-[200px] shadow-sm">
                            <p className="text-[14px] text-[#8B95A1]">사진을 추가해주세요</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end justify-end gap-1">
                      <span className="text-[10px] text-[#8B95A1] self-end mb-1">읽음 1</span>
                      <div className="bg-[#FFE08C] rounded-[16px] rounded-tr-[4px] p-4 max-w-[240px] shadow-sm">
                        <p className="text-[14px] text-[#191F28] leading-[1.6]">
                          {data.venue || "예식장"}{"\n"}
                          {formatWeddingDate()}{data.time ? " " + data.time : ""}{"\n"}
                          꼭 와주세요!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[11px] font-bold text-[#4E5968] flex-shrink-0">
                        WE
                      </div>
                      <div>
                        <p className="text-[11px] text-[#4E5968] mb-1 ml-1">WE:VE</p>
                        <div className="bg-white rounded-[16px] rounded-tl-[4px] overflow-hidden max-w-[240px] shadow-sm">
                          {allPhotos[0] && (
                            <div className="w-full h-[100px] overflow-hidden">
                              <img src={allPhotos[0]} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-4">
                            <p className="text-[14px] text-[#191F28] font-medium">{data.title || "우리의 날"}</p>
                            <p className="text-[12px] text-[#8B95A1] mt-1">{data.groomName || "신랑"} & {data.brideName || "신부"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modern Template */}
            {data.mainTemplate === "modern" && (
              <div className="bg-white py-16 px-8">
                <div className="flex flex-col items-center">
                  {allPhotos[0] ? (
                    <div className="max-w-[300px] w-full rounded-[24px] overflow-hidden aspect-[3/4]">
                      <img src={allPhotos[0]} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="max-w-[300px] w-full rounded-[24px] aspect-[3/4] bg-[#F2F4F6] flex items-center justify-center">
                      <p className="text-[14px] text-[#B0B8C1]">사진을 추가해주세요</p>
                    </div>
                  )}
                  <div className="w-12 h-[1px] bg-[#FF8A80] mt-8 mb-8" />
                  <p className="text-[28px] font-light tracking-[0.1em] text-[#191F28] text-center">
                    {data.title || "Our Wedding"}
                  </p>
                  <p className="text-[20px] font-medium text-[#191F28] mt-4 text-center">
                    {data.groomName || "신랑"} <span className="font-light text-[16px] text-[#8B95A1] mx-2">and</span> {data.brideName || "신부"}
                  </p>
                  <p className="text-[13px] text-[#8B95A1] mt-4 text-center">
                    {formatWeddingDate()}{data.time ? " | " + data.time : ""}
                  </p>
                  <p className="text-[13px] text-[#8B95A1] mt-1 text-center">
                    {data.venue || ""}
                  </p>
                </div>
              </div>
            )}

            {/* Classic Template */}
            {data.mainTemplate === "classic" && (
              <div className="bg-[#FBF8F1] py-12 px-6">
                <div className="border-double border-[#C5A572] border-[3px] p-8">
                  <div className="flex flex-col items-center">
                    <p className="text-[11px] tracking-[0.4em] text-[#C5A572] font-light uppercase">
                      Wedding Invitation
                    </p>
                    <div className="flex items-center gap-2 my-4">
                      <div className="w-8 h-[1px] bg-[#C5A572]/40" />
                      <div className="w-2 h-2 rotate-45 border border-[#C5A572]/60" />
                      <div className="w-8 h-[1px] bg-[#C5A572]/40" />
                    </div>
                    <p className="text-[30px] font-light text-[#3D3226] text-center" style={{ fontFamily: "Georgia, serif" }}>
                      {data.groomName || "신랑"} & {data.brideName || "신부"}
                    </p>
                    <p className="text-[13px] text-[#8B7B6B] mt-4 text-center">
                      {formatWeddingDate()}{data.time ? " | " + data.time : ""}
                    </p>
                    <p className="text-[13px] text-[#8B7B6B] mt-1 text-center">
                      {data.venue || ""}
                    </p>
                    {allPhotos[0] && (
                      <div className="mt-8 border-4 border-[#E8DFD0]">
                        <img src={allPhotos[0]} alt="Cover" className="w-full aspect-[3/4] object-cover max-w-[260px]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Default/Fallback Template (none, etc.) */}
            {data.mainTemplate !== "poster" && data.mainTemplate !== "polaroid" && data.mainTemplate !== "magazine" && data.mainTemplate !== "chat" && data.mainTemplate !== "modern" && data.mainTemplate !== "classic" && (
              <div className="relative w-full overflow-hidden" style={{ minHeight: "580px" }}>
                {allPhotos.length > 0 ? (
                  <>
                    {coverStyle === "static" ? (
                      <div className="absolute inset-0">
                        <img
                          src={allPhotos[0]}
                          alt="Cover"
                          className="w-full h-full object-cover"
                          style={{ minHeight: "580px" }}
                        />
                      </div>
                    ) : coverStyle === "slide" ? (
                      <div
                        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                      >
                        {allPhotos.map((photo, i) => (
                          <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "580px" }}>
                            <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "580px" }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      allPhotos.map((photo, i) => (
                        <div
                          key={i}
                          className="absolute inset-0 transition-opacity duration-1000"
                          style={{ opacity: currentSlide === i ? 1 : 0 }}
                        >
                          <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "580px" }} />
                        </div>
                      ))
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                  </>
                ) : (
                  <div
                    className="w-full flex items-center justify-center"
                    style={{
                      minHeight: "580px",
                      background: "linear-gradient(180deg, #7BA4C7 0%, #9BB8D3 50%, #C5D5E4 100%)",
                    }}
                  >
                    <p className="text-[14px] text-white/70">커버 사진을 추가해주세요</p>
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                  <div className="text-center px-8">
                    <p
                      className="text-white text-[48px] leading-[1.15] font-bold"
                      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.15)" }}
                    >
                      {data.title || "Our\nwedding\nday!"}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                  <p className="text-white/90 text-[14px] tracking-wide" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>
                    {data.venue || ""}
                  </p>
                  <p className="text-white/80 text-[13px] mt-1 tracking-wide" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>
                    {formatWeddingDate()}{data.weddingDate ? "  |  " : ""}
                    {data.weddingDate ? getCalendarData()?.weddingDayName + "요일" : ""}
                    {data.time ? "  |  " + data.time : ""}
                  </p>
                </div>
                {allPhotos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allPhotos.map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{ backgroundColor: currentSlide === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

        {/* ===== INVITATION MESSAGE SECTION ===== */}
        <div className="bg-white px-8 py-14">
          <SectionTitle title="Invitation" />

          {data.invitationTitle && (
            <p className="text-[20px] text-[#191F28] text-center font-medium mb-6">
              {data.invitationTitle}
            </p>
          )}

          <p className={`text-[14px] text-[#4E5968] leading-[2.2] whitespace-pre-line mb-10 ${(data.messageAlign || "center") === "center" ? "text-center" : "text-left"}`}>
            {data.message || "소중한 분들을 모시고\n새로운 출발을 함께하고자 합니다.\n저희 두 사람의 약속이\n사랑으로 더욱 빛날 수 있도록 오셔서\n따뜻한 격려와 축복을 부탁드립니다."}
          </p>

          {data.showNameAtBottom && (() => {
            const useFlower = data.deceasedFlower === true
            const DeceasedMark = ({ show }: { show: boolean }) => {
              if (!show) return null
              if (useFlower) {
                return <span className="inline-block text-[#8B95A1] mr-0.5" style={{ fontSize: "12px" }}>*</span>
              }
              return <span className="text-[#8B95A1] mr-0.5">故</span>
            }
            const groomBlock = (
              <p className="text-[15px] text-[#191F28] font-medium leading-relaxed">
                {data.groomFather?.name && (
                  <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
                )}
                {data.groomMother?.name && (
                  <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
                )}
                {(data.groomFather?.name || data.groomMother?.name) && (
                  <span className="text-[13px] text-[#8B95A1]"> {data.groomRelation || "아들"} </span>
                )}
                <span className="font-bold">{data.groomName || "신랑"}</span>
              </p>
            )
            const brideBlock = (
              <p className="text-[15px] text-[#191F28] font-medium leading-relaxed">
                {data.brideFather?.name && (
                  <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
                )}
                {data.brideMother?.name && (
                  <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
                )}
                {(data.brideFather?.name || data.brideMother?.name) && (
                  <span className="text-[13px] text-[#8B95A1]"> {data.brideRelation || "딸"} </span>
                )}
                <span className="font-bold">{data.brideName || "신부"}</span>
              </p>
            )
            const nameStyle = data.nameDisplayStyle || "horizontal"
            const first = data.brideFirst ? brideBlock : groomBlock
            const second = data.brideFirst ? groomBlock : brideBlock

            return nameStyle === "vertical" ? (
              <div className="text-center mb-8">
                <div className="flex justify-center gap-12">
                  <div className="space-y-1">{first}</div>
                  <div className="space-y-1">{second}</div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 mb-8">
                {first}
                {second}
              </div>
            )
          })()}

          <button
            data-testid="button-contact"
            onClick={() => setShowContact(true)}
            className="w-[200px] mx-auto block py-3 border border-[#E5E8EB] rounded-[16px] text-[14px] text-[#4E5968] bg-white"
          >
            연락하기
          </button>
        </div>

        {/* ===== GALLERY SECTION ===== */}
        {data.showGallery && galleryImages.length > 0 && (
          <div className="bg-[#F2F4F6] px-6 py-14">
            <SectionTitle title="Gallery" />
            <p className="text-[18px] text-[#191F28] text-center font-medium mb-6">웨딩 갤러리</p>

            {data.galleryStyle === "grid" || !data.galleryStyle ? (
              <div className="grid grid-cols-3 gap-1.5">
                {galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square cursor-pointer overflow-hidden"
                    onClick={() => { setViewerIndex(index); setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <div className="flex gap-2 px-2">
                  {galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className="w-[160px] h-[210px] flex-shrink-0 cursor-pointer overflow-hidden"
                      onClick={() => { setViewerIndex(index); setShowPhotoViewer(true) }}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.weddingDate && (
              <p className="text-[18px] text-[#191F28] text-center mt-8">{formatWeddingDate()}</p>
            )}
          </div>
        )}

        {/* ===== CALENDAR & COUNTDOWN SECTION ===== */}
        {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
          const cal = getCalendarData()
          if (!cal) return null
          const calStyle = data.calendarStyle || "full"
          return (
            <div className="bg-white px-8 py-14 text-center">
              <p className="text-[24px] text-[#191F28] font-light mb-2">{formatWeddingDate()}</p>
              <p className="text-[14px] text-[#8B95A1] mb-8">
                {cal.weddingDayName}요일 {formatWeddingTime()}
              </p>

              {data.showCalendar && calStyle === "full" && (
                <div className="mb-8">
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {cal.dayNames.map((d) => (
                      <div key={d} className="text-[12px] text-[#8B95A1] py-2 text-center">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0">
                    {cal.days.map((day, i) => (
                      <div
                        key={i}
                        className="py-2.5 text-center"
                      >
                        {day !== null && (
                          day === cal.weddingDay ? (
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#FF8A80] text-white text-[14px] font-medium">
                              {day}
                            </span>
                          ) : (
                            <span className={`text-[14px] ${i % 7 === 0 ? "text-[#FF8A80]" : i % 7 === 6 ? "text-[#3182F6]" : "text-[#4E5968]"}`}>
                              {day}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.showCalendar && calStyle === "simple" && (
                <div className="mb-8 py-4 border-t border-b border-[#E5E8EB]">
                  <p className="text-[18px] text-[#191F28] font-medium">
                    {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                  </p>
                  <p className="text-[14px] text-[#8B95A1] mt-1">{formatWeddingTime()}</p>
                </div>
              )}

              {data.showCountdown && (
                <div className="flex items-center justify-center gap-0 mt-4">
                  <div className="text-center w-16">
                    <p className="text-[10px] text-[#8B95A1] tracking-wider mb-1">DAYS</p>
                    <p className="text-[28px] text-[#191F28] font-light">{countdown.days}</p>
                  </div>
                  <span className="text-[24px] text-[#FF8A80] font-light pb-1">:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] text-[#8B95A1] tracking-wider mb-1">HOUR</p>
                    <p className="text-[28px] text-[#191F28] font-light">{countdown.hours}</p>
                  </div>
                  <span className="text-[24px] text-[#FF8A80] font-light pb-1">:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] text-[#8B95A1] tracking-wider mb-1">MIN</p>
                    <p className="text-[28px] text-[#191F28] font-light">{countdown.minutes}</p>
                  </div>
                  <span className="text-[24px] text-[#FF8A80] font-light pb-1">:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] text-[#8B95A1] tracking-wider mb-1">SEC</p>
                    <p className="text-[28px] text-[#191F28] font-light">{countdown.seconds}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* ===== LOCATION SECTION ===== */}
        <div className="bg-[#F2F4F6] px-8 py-14">
          <SectionTitle title="Location" />

          <div className="text-center mb-6">
            <p className="text-[20px] text-[#191F28] font-medium mb-2">
              {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
            </p>
            <p className="text-[14px] text-[#8B95A1]">{data.address || "주소를 입력해주세요"}</p>
            {data.venuePhone && (
              <p className="text-[13px] text-[#8B95A1] mt-1">Tel. {data.venuePhone}</p>
            )}
          </div>

          <div className="bg-[#F2F4F6] rounded-[16px] h-[200px] flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="text-center">
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" className="mx-auto mb-2">
                <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0zm0 22c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#FF8A80"/>
              </svg>
              <p className="text-[12px] text-[#8B95A1]">지도 영역</p>
            </div>
          </div>

          <button
            className="w-full py-3.5 border border-[#E5E8EB] rounded-[16px] text-[14px] text-[#4E5968] bg-white mb-6"
            data-testid="button-directions"
          >
            길찾기
          </button>

          {/* Transport Info */}
          {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
            <div className="mt-2 space-y-4">
              {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
                <div key={i} className="border-t border-[#E5E8EB] pt-4">
                  {item.type && <p className="text-[15px] text-[#191F28] font-bold mb-2">{item.type}</p>}
                  {item.detail && <p className="text-[14px] text-[#4E5968] whitespace-pre-line leading-[1.8]">{item.detail}</p>}
                </div>
              ))}
            </div>
          )}
          {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
            <div className="border-t border-[#E5E8EB] pt-4">
              <p className="text-[14px] text-[#4E5968] whitespace-pre-line leading-[1.8]">{data.transportInfo}</p>
            </div>
          )}
          {data.showTransportNotice && (
            <div className="mt-6 p-4 bg-white rounded-[16px]">
              <p className="text-[13px] text-[#8B95A1] leading-[1.8]">
                주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
              </p>
            </div>
          )}
        </div>

        {/* ===== MID PHOTO ===== */}
        {data.showMidPhoto && data.midPhoto && (
          <div>
            <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" />
          </div>
        )}

        {/* ===== RSVP SECTION ===== */}
        {data.showRsvp && (
          <div className="bg-white px-8 py-14">
            <SectionTitle title="RSVP" />
            <p className="text-[20px] text-[#191F28] text-center font-medium mb-6">{data.rsvpTitle || "참석 의사"}</p>

            <div className="flex justify-center mb-4">
              <div className="relative w-[220px] h-[150px]">
                <div className="absolute inset-0 bg-white rounded-[16px] shadow-sm" />
                <div
                  className="absolute inset-x-2 top-2 bottom-0 rounded-[16px] flex items-center justify-center"
                  style={{ backgroundColor: "#191F28" }}
                >
                  <div className="text-center">
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: 0, height: 0,
                        borderLeft: "80px solid transparent",
                        borderRight: "80px solid transparent",
                        borderTop: "35px solid #191F28",
                        transform: "translateX(-50%) rotate(180deg)",
                        top: "0",
                      }}
                    />
                    <p
                      className="text-white/80 text-[16px] tracking-[0.15em] font-semibold mt-4"
                    >
                      R.S.V.P
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-[#8B95A1] text-center mb-6">
              {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
            </p>

            <button
              className="w-full py-3.5 bg-[#FF8A80] rounded-[16px] text-[14px] text-white border-0"
              data-testid="button-rsvp"
            >
              {data.rsvpButtonName || "참석 의사 전달하기"}
            </button>
          </div>
        )}

        {/* ===== GUESTBOOK SECTION ===== */}
        {data.showGuestbook && (
          <div className="bg-[#F2F4F6] px-8 py-14">
            <SectionTitle title="Wedding Guest book" />
            <p className="text-[20px] text-[#191F28] text-center font-medium mb-6">방명록</p>

            <div className="space-y-4 mb-6">
              {guestbookEntries.length > 0 ? (
                guestbookEntries.slice(0, 5).map((entry, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 text-center relative rounded-[16px] shadow-sm"
                  >
                    <p className="text-[14px] text-[#4E5968] leading-[1.8] whitespace-pre-line mb-3">{entry.message}</p>
                    <p className="text-[12px] text-[#8B95A1]">- {entry.name} -</p>
                  </div>
                ))
              ) : (
                <div
                  className="bg-white p-6 text-center rounded-[16px] shadow-sm"
                >
                  <p className="text-[14px] text-[#8B95A1] leading-[1.8]">
                    아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                  </p>
                </div>
              )}
            </div>

            {showGuestbookForm ? (
              <div className="bg-white p-5 rounded-[16px] mb-4 shadow-sm">
                <input
                  type="text"
                  value={guestbookName}
                  onChange={(e) => setGuestbookName(e.target.value)}
                  placeholder="이름"
                  className="w-full py-2.5 px-3 border border-[#E5E8EB] rounded-[16px] text-[14px] mb-3 outline-none focus:border-[#FF8A80]"
                  data-testid="input-guestbook-name"
                />
                <textarea
                  value={guestbookMessage}
                  onChange={(e) => setGuestbookMessage(e.target.value)}
                  placeholder="축하 메시지를 작성해주세요"
                  rows={4}
                  className="w-full py-2.5 px-3 border border-[#E5E8EB] rounded-[16px] text-[14px] mb-3 outline-none focus:border-[#FF8A80] resize-none"
                  data-testid="input-guestbook-message"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowGuestbookForm(false)}
                    className="flex-1 py-2.5 border border-[#E5E8EB] rounded-[16px] text-[13px] text-[#4E5968]"
                  >
                    취소
                  </button>
                  <button
                    onClick={submitGuestbook}
                    className="flex-1 py-2.5 bg-[#191F28] rounded-[16px] text-[13px] text-white"
                    data-testid="button-guestbook-submit"
                  >
                    등록하기
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowGuestbookForm(true)}
                className="w-full py-3.5 border border-[#E5E8EB] rounded-[16px] text-[14px] text-[#4E5968] bg-white"
                data-testid="button-guestbook-write"
              >
                작성하기
              </button>
            )}
          </div>
        )}

        {/* ===== FUNDING / WISHLIST SECTION ===== */}
        {data.showFunding && (
          <div className="bg-white px-8 py-14">
            <SectionTitle title="Wishlist & Funding" />

            {data.fundingMessage && (
              <p className="text-[15px] text-[#191F28] text-center font-medium leading-[1.8] whitespace-pre-line mb-6">
                {data.fundingMessage}
              </p>
            )}

            <div className="flex justify-center mb-6">
              <div className="w-[200px] h-[240px] flex items-center justify-center">
                <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
                  <path d="M60 180c-5-5 0-20 15-35s30-20 40-15 15 20 5 35-25 20-35 15z" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <path d="M80 145l-5-80c0-5 3-10 8-12l20-8" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <rect x="70" y="50" width="18" height="26" rx="3" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <circle cx="80" cy="45" r="10" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <path d="M130 175c5-5 0-20-15-35s-30-20-40-15-15 20-5 35 25 20 35 15z" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <path d="M110 140l10-70c0-5-3-10-8-12l-15-5" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <path d="M105 55q15-5 20 5t-5 20" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                  <circle cx="120" cy="45" r="10" stroke="#4E5968" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>

            {data.fundingButtonName && (
              <button
                className="w-full py-3.5 bg-[#191F28] rounded-[16px] text-[14px] text-white font-medium mb-4"
                data-testid="button-funding"
              >
                {data.fundingButtonName}
              </button>
            )}

            {!data.fundingButtonName && (
              <button
                className="w-full py-3.5 bg-[#191F28] rounded-[16px] text-[14px] text-white font-medium mb-4"
                data-testid="button-funding-default"
              >
                신혼여행 축하하기
              </button>
            )}

            <p className="text-[12px] text-[#8B95A1] text-center leading-[1.6]">
              축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
            </p>
          </div>
        )}

        {/* ===== GIFT FUNDING SECTION ===== */}
        {data.showGiftFunding && (
          <div className="bg-[#F2F4F6] px-8 py-14">
            <SectionTitle title="Gift Funding" />
            {data.giftFundingMessage && (
              <p className="text-[14px] text-[#4E5968] leading-[2] text-center whitespace-pre-line mb-6">
                {data.giftFundingMessage}
              </p>
            )}
            {data.giftFundingButtonName && (
              <button className="w-full py-3.5 bg-[#191F28] rounded-[16px] text-[14px] text-white font-medium">
                {data.giftFundingButtonName}
              </button>
            )}
          </div>
        )}

        {/* ===== ACCOUNT SECTION ===== */}
        {data.showAccount && (() => {
          const accStyle = data.accountDisplayStyle || "expand"
          const groomAccList = (data.groomFatherAccount?.account || data.groomMotherAccount?.account)
            ? [data.groomFatherAccount, data.groomMotherAccount].filter(a => a?.account)
            : data.groomAccounts?.filter(a => a?.account) || []
          const brideAccList = (data.brideFatherAccount?.account || data.brideMotherAccount?.account)
            ? [data.brideFatherAccount, data.brideMotherAccount].filter(a => a?.account)
            : data.brideAccounts?.filter(a => a?.account) || []

          const renderAccList = (list: typeof groomAccList) => (
            <div className="space-y-3">
              {list.map((acc, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div>
                    <p className="text-[14px] text-[#191F28]">{acc!.bank} {acc!.account}</p>
                    <p className="text-[12px] text-[#8B95A1] mt-0.5">{acc!.holder}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                    className="px-3 py-1.5 bg-[#F2F4F6] rounded-[12px] text-[11px] text-[#4E5968] font-medium"
                  >
                    복사
                  </button>
                </div>
              ))}
            </div>
          )

          return (
            <div className="bg-white px-8 py-14">
              <SectionTitle title="Account" />
              <p className="text-[13px] text-[#8B95A1] text-center mb-6">축하의 마음을 전해주세요</p>

              <div className="space-y-4">
                {groomAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div className="bg-[#F2F4F6] rounded-[16px] overflow-hidden">
                      <button
                        onClick={() => setExpandedAccordion(expandedAccordion === "groom" ? null : "groom")}
                        className="w-full flex items-center justify-between p-5"
                        data-testid="accordion-groom"
                      >
                        <p className="text-[14px] text-[#191F28] font-medium">신랑측 계좌번호</p>
                        <svg
                          className={`w-4 h-4 text-[#8B95A1] transition-transform ${expandedAccordion === "groom" ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedAccordion === "groom" && (
                        <div className="px-5 pb-5 border-t border-[#E5E8EB]">
                          {renderAccList(groomAccList)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#F2F4F6] rounded-[16px] p-5">
                      <p className="text-[12px] text-[#3182F6] font-medium mb-4">신랑측</p>
                      {renderAccList(groomAccList)}
                    </div>
                  )
                )}

                {brideAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div className="bg-[#F2F4F6] rounded-[16px] overflow-hidden">
                      <button
                        onClick={() => setExpandedAccordion(expandedAccordion === "bride" ? null : "bride")}
                        className="w-full flex items-center justify-between p-5"
                        data-testid="accordion-bride"
                      >
                        <p className="text-[14px] text-[#191F28] font-medium">신부측 계좌번호</p>
                        <svg
                          className={`w-4 h-4 text-[#8B95A1] transition-transform ${expandedAccordion === "bride" ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedAccordion === "bride" && (
                        <div className="px-5 pb-5 border-t border-[#E5E8EB]">
                          {renderAccList(brideAccList)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#F2F4F6] rounded-[16px] p-5">
                      <p className="text-[12px] text-pink-500 font-medium mb-4">신부측</p>
                      {renderAccList(brideAccList)}
                    </div>
                  )
                )}
              </div>
            </div>
          )
        })()}

        {/* ===== BAPTISMAL NAMES ===== */}
        {data.showBaptismalName && (
          <div className="bg-[#F2F4F6] px-8 py-10 text-center">
            <SectionTitle title="Baptismal Name" />
            <div className="flex justify-center gap-12">
              <div className="space-y-1">
                {data.baptismalGroom && <p className="text-[14px] text-[#191F28] font-medium">{data.baptismalGroom}</p>}
                {data.baptismalGroomFather && <p className="text-[13px] text-[#8B95A1]">{data.baptismalGroomFather}</p>}
                {data.baptismalGroomMother && <p className="text-[13px] text-[#8B95A1]">{data.baptismalGroomMother}</p>}
              </div>
              <div className="space-y-1">
                {data.baptismalBride && <p className="text-[14px] text-[#191F28] font-medium">{data.baptismalBride}</p>}
                {data.baptismalBrideFather && <p className="text-[13px] text-[#8B95A1]">{data.baptismalBrideFather}</p>}
                {data.baptismalBrideMother && <p className="text-[13px] text-[#8B95A1]">{data.baptismalBrideMother}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ===== GUEST SNAP ===== */}
        {data.showGuestSnap && (
          <div className="bg-white px-8 py-14">
            <SectionTitle title="Guest Snap" />
            {data.guestSnapContent && (
              <p className="text-[14px] text-[#4E5968] text-center whitespace-pre-line leading-[1.8] mb-6">
                {data.guestSnapContent}
              </p>
            )}
            <button
              className="w-full py-3.5 border border-[#E5E8EB] rounded-[16px] text-[14px] text-[#4E5968] bg-white"
              data-testid="button-guest-snap"
            >
              사진 업로드
            </button>
          </div>
        )}

        {/* ===== NOTICE SECTION ===== */}
        {data.showNotice && data.noticeTitle && (
          <div className="bg-[#F2F4F6] px-8 py-14">
            <SectionTitle title="Notice" />
            <p className="text-[18px] text-[#191F28] font-medium text-center mb-4">{data.noticeTitle}</p>
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[14px] text-[#4E5968] text-center leading-[1.8] mb-1">{item}</p>
            ))}
          </div>
        )}

        {/* ===== ENDING / THANK YOU SECTION ===== */}
        {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
          const eStyle = data.endingStyle || "card"
          const endTextColor = data.endingTextColor || "#FFFFFF"
          return (
            <div className="bg-white px-8 py-14">
              <SectionTitle title="Thank you" />

              {eStyle === "card" && data.endingPhoto && (
                <div className="mx-auto max-w-[280px] mb-6">
                  <img
                    src={data.endingPhoto}
                    alt="Thank you"
                    className="w-full aspect-[4/5] object-cover rounded-[16px]"
                  />
                </div>
              )}

              {eStyle === "card" && data.endingContent && (
                <p className="text-[14px] text-[#4E5968] leading-[2] text-center whitespace-pre-line">
                  {data.endingContent}
                </p>
              )}

              {eStyle === "full" && data.endingPhoto && (
                <div className="-mx-8 mb-6 relative">
                  <img
                    src={data.endingPhoto}
                    alt="Thank you"
                    className="w-full object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  {data.endingContent && (
                    <div className="absolute inset-0 flex items-center justify-center px-8">
                      <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                        {data.endingContent}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {eStyle === "full" && !data.endingPhoto && data.endingContent && (
                <p className="text-[14px] text-[#4E5968] leading-[2] text-center whitespace-pre-line">
                  {data.endingContent}
                </p>
              )}

              {eStyle === "simple" && (
                <>
                  {data.endingPhoto && (
                    <div className="-mx-8 mb-0 relative">
                      <img
                        src={data.endingPhoto}
                        alt="Thank you"
                        className="w-full object-cover"
                        style={{ maxHeight: "360px" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {data.endingContent && (
                        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
                          <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: endTextColor }} />
                          <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                            {data.endingContent}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {!data.endingPhoto && data.endingContent && (
                    <div className="text-center">
                      <div className="w-8 h-px bg-[#FF8A80] mx-auto mb-4" />
                      <p className="text-[14px] text-[#4E5968] leading-[2] text-center whitespace-pre-line">
                        {data.endingContent}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })()}

        {/* ===== LINK COPY BUTTON ===== */}
        <div className="bg-[#F2F4F6] px-6 pb-10 pt-4">
          <button
            onClick={copyLink}
            className="w-full py-4 bg-[#F2F4F6] rounded-[16px] text-[14px] text-[#4E5968] border-0"
            data-testid="button-copy-link"
          >
            청첩장 링크 복사하기
          </button>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="bg-[#F2F4F6] px-8 pb-8 pt-4 text-center">
          <div className="w-8 h-px bg-[#FF8A80] mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.15em] text-[#8B95A1]">
            MADE WITH WE:VE
          </p>
        </div>
        </>
      )}
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {showContact && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setShowContact(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-[420px] bg-[#191F28] rounded-t-2xl overflow-y-auto"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowContact(false)}
                className="text-white/60"
                data-testid="button-close-contact"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-2">
              <div className="mb-8">
                <h3 className="text-[20px] font-bold text-white mb-2">Contact</h3>
                <div className="w-8 h-[3px] bg-[#FF8A80] rounded-full" />
              </div>
            </div>

            <div className="px-8 pb-8">
              {/* Groom Side */}
              <p className="text-[13px] text-[#8B95A1] mb-4">신랑측</p>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                  <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑</span>
                  <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomName || "신랑"}</span>
                  <div className="flex gap-3">
                    {data.groomPhone && (
                      <a href={`tel:${data.groomPhone}`} className="text-[#8B95A1]">
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                    {data.groomPhone && (
                      <button onClick={() => copyToClipboard(data.groomPhone!, "전화번호가")} className="text-[#8B95A1]">
                        <Copy className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {data.groomFather?.name && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑 아버지</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomFather.name}</span>
                    <div className="flex gap-3">
                      {data.groomFather.phone && (
                        <a href={`tel:${data.groomFather.phone}`} className="text-[#8B95A1]">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                      {data.groomFather.phone && (
                        <button onClick={() => copyToClipboard(data.groomFather!.phone!, "전화번호가")} className="text-[#8B95A1]">
                          <Copy className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {data.groomMother?.name && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑 어머니</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomMother.name}</span>
                    <div className="flex gap-3">
                      {data.groomMother.phone && (
                        <a href={`tel:${data.groomMother.phone}`} className="text-[#8B95A1]">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                      {data.groomMother.phone && (
                        <button onClick={() => copyToClipboard(data.groomMother!.phone!, "전화번호가")} className="text-[#8B95A1]">
                          <Copy className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bride Side */}
              <p className="text-[13px] text-[#8B95A1] mt-6 mb-4">신부측</p>
              <div className="space-y-0">
                <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                  <span className="text-[13px] text-[#8B95A1] w-[80px]">신부</span>
                  <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideName || "신부"}</span>
                  <div className="flex gap-3">
                    {data.bridePhone && (
                      <a href={`tel:${data.bridePhone}`} className="text-[#8B95A1]">
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                    {data.bridePhone && (
                      <button onClick={() => copyToClipboard(data.bridePhone!, "전화번호가")} className="text-[#8B95A1]">
                        <Copy className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {data.brideFather?.name && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신부 아버지</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideFather.name}</span>
                    <div className="flex gap-3">
                      {data.brideFather.phone && (
                        <a href={`tel:${data.brideFather.phone}`} className="text-[#8B95A1]">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                      {data.brideFather.phone && (
                        <button onClick={() => copyToClipboard(data.brideFather!.phone!, "전화번호가")} className="text-[#8B95A1]">
                          <Copy className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {data.brideMother?.name && (
                  <div className="flex items-center justify-between py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신부 어머니</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideMother.name}</span>
                    <div className="flex gap-3">
                      {data.brideMother.phone && (
                        <a href={`tel:${data.brideMother.phone}`} className="text-[#8B95A1]">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                      {data.brideMother.phone && (
                        <button onClick={() => copyToClipboard(data.brideMother!.phone!, "전화번호가")} className="text-[#8B95A1]">
                          <Copy className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PHOTO VIEWER MODAL ===== */}
      {showPhotoViewer && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div />
            <p className="text-white/80 text-[14px]">{viewerIndex + 1}/{galleryImages.length}</p>
            <button
              onClick={() => setShowPhotoViewer(false)}
              className="text-white/80"
              data-testid="button-close-viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={galleryImages[viewerIndex]}
              alt={`Photo ${viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {viewerIndex > 0 && (
              <button
                onClick={() => setViewerIndex((v) => v - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/70"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {viewerIndex < galleryImages.length - 1 && (
              <button
                onClick={() => setViewerIndex((v) => v + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/70"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== TOAST NOTIFICATION ===== */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#191F28] text-white px-6 py-3 rounded-lg text-[14px] shadow-lg">
          {copiedToast}
        </div>
      )}
    </div>
  )
}
