"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

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

        {/* ===== HERO / COVER SECTION ===== */}
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
            const groomBlock = (
              <p className="text-[15px] text-[#191F28] font-medium leading-relaxed">
                {data.groomFather?.name && (
                  <>{data.groomFather.deceased ? "故 " : ""}{data.groomFather.name}</>
                )}
                {data.groomMother?.name && (
                  <> · {data.groomMother.deceased ? "故 " : ""}{data.groomMother.name}</>
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
                  <>{data.brideFather.deceased ? "故 " : ""}{data.brideFather.name}</>
                )}
                {data.brideMother?.name && (
                  <> · {data.brideMother.deceased ? "故 " : ""}{data.brideMother.name}</>
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
            <p className="text-[20px] text-[#191F28] text-center font-medium mb-6">참석 의사</p>

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
              신랑신부에게 참석 여부를 미리 알려주세요
            </p>

            <button
              className="w-full py-3.5 bg-[#FF8A80] rounded-[16px] text-[14px] text-white border-0"
              data-testid="button-rsvp"
            >
              참석 의사 전달하기
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

              {eStyle === "full" && data.endingPhoto && (
                <div className="-mx-8 mb-6">
                  <img
                    src={data.endingPhoto}
                    alt="Thank you"
                    className="w-full object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              )}

              {data.endingContent && (
                <p className="text-[14px] text-[#4E5968] leading-[2] text-center whitespace-pre-line">
                  {data.endingContent}
                </p>
              )}

              {eStyle === "simple" && (
                <div className="mt-4 text-center">
                  <div className="w-8 h-px bg-[#FF8A80] mx-auto" />
                </div>
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
