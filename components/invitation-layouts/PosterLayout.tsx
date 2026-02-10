"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

const FlowerDaisy = ({ color = "#F4C7AB", size = 24, opacity = 0.7, className = "" }: { color?: string; size?: number; opacity?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} style={{ opacity }}>
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(0 20 20)" />
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(60 20 20)" />
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(120 20 20)" />
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(180 20 20)" />
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(240 20 20)" />
    <ellipse cx="20" cy="10" rx="4" ry="8" fill={color} transform="rotate(300 20 20)" />
    <circle cx="20" cy="20" r="5" fill="#F5D88E" />
  </svg>
)

const FlowerTulip = ({ color = "#E8A87C", size = 28, opacity = 0.6, className = "" }: { color?: string; size?: number; opacity?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 40 50" fill="none" className={className} style={{ opacity }}>
    <path d="M20 18C16 10 10 8 10 14C10 20 16 24 20 24C24 24 30 20 30 14C30 8 24 10 20 18Z" fill={color} />
    <path d="M20 24V44" stroke="#7BAE6E" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 32C16 30 13 32 14 35" stroke="#7BAE6E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M20 36C24 34 27 36 26 39" stroke="#7BAE6E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
)

const FlowerSmall = ({ color = "#B5C7D3", size = 16, opacity = 0.6, className = "" }: { color?: string; size?: number; opacity?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ opacity }}>
    <circle cx="12" cy="8" r="3.5" fill={color} />
    <circle cx="8" cy="12" r="3.5" fill={color} />
    <circle cx="16" cy="12" r="3.5" fill={color} />
    <circle cx="10" cy="16" r="3.5" fill={color} />
    <circle cx="14" cy="16" r="3.5" fill={color} />
    <circle cx="12" cy="12" r="2.5" fill="#F5D88E" />
  </svg>
)

const FlowerLeaf = ({ size = 20, opacity = 0.5, className = "" }: { size?: number; opacity?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 30" fill="none" className={className} style={{ opacity }}>
    <path d="M12 4C8 8 4 14 6 20C8 26 12 26 12 26C12 26 16 26 18 20C20 14 16 8 12 4Z" fill="#A8C99A" />
    <path d="M12 8V24" stroke="#7BAE6E" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const FlowerStar = ({ color = "#F5D88E", size = 14, opacity = 0.5, className = "" }: { color?: string; size?: number; opacity?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} style={{ opacity }}>
    <path d="M10 2L11.5 8H18L12.5 11.5L14.5 18L10 14L5.5 18L7.5 11.5L2 8H8.5L10 2Z" fill={color} />
  </svg>
)

export function PosterLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FDF8F0"
  const sectionBg1 = "#FDF8F0"
  const sectionBg2 = "#FFFFFF"
  const textPrimary = "#4A3F35"
  const textSecondary = "#9B8E82"
  const accent = "#C5956B"
  const accentSoft = "#E8D5C0"
  const borderColor = "#E8DDD2"
  const cardBg = "#FFFFFF"
  const sansFont = getKoreanFont(data, "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif")
  const englishFont = getEnglishFont(data, "'Caveat', 'Georgia', serif")
  const serifFont = "'Georgia', 'Noto Serif KR', serif"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-8 relative">
      <FlowerStar color="#F5D88E" size={10} opacity={0.4} className="absolute -top-1 left-1/2 -translate-x-8" />
      <FlowerStar color="#E8A87C" size={8} opacity={0.3} className="absolute -top-2 left-1/2 translate-x-6" />
      {subtitle && (
        <p className="text-[10px] uppercase mb-1.5" style={{ color: accent, letterSpacing: "0.2em", fontFamily: englishFont, fontSize: "13px" }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[15px] font-medium" style={{ color: textPrimary, letterSpacing: "0.08em", fontFamily: sansFont }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: accentSoft }} />
        <FlowerSmall color="#F4C7AB" size={12} opacity={0.5} />
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: accentSoft }} />
      </div>
    </div>
  )

  const photo0 = state.allPhotos[0] || null

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="relative overflow-hidden" style={{ backgroundColor: pageBg }}>
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <FlowerDaisy color="#FFFFFF" size={32} opacity={0.6} className="absolute top-6 left-4" />
          <FlowerTulip color="#F4C7AB" size={30} opacity={0.5} className="absolute top-10 right-6" />
          <FlowerSmall color="#B5C7D3" size={18} opacity={0.5} className="absolute top-20 left-8" />
          <FlowerLeaf size={22} opacity={0.4} className="absolute top-4 right-16" />
          <FlowerStar color="#F5D88E" size={12} opacity={0.4} className="absolute top-16 left-20" />
          <FlowerDaisy color="#F4C7AB" size={20} opacity={0.4} className="absolute top-24 right-4" />
          <FlowerSmall color="#E8A87C" size={14} opacity={0.4} className="absolute bottom-32 left-6" />
          <FlowerTulip color="#D4A5A5" size={24} opacity={0.4} className="absolute bottom-20 right-8" />
          <FlowerLeaf size={18} opacity={0.35} className="absolute bottom-16 left-14" />
          <FlowerStar color="#C5956B" size={10} opacity={0.35} className="absolute bottom-28 right-16" />
        </div>

        <div className="relative z-10 px-8 pt-20 pb-6 text-center">
          <p
            className="text-[28px] leading-[1.3] mb-2"
            style={{ color: accent, fontFamily: "'Caveat', cursive", fontWeight: 400 }}
          >
            The Wedding of
          </p>
        </div>

        {photo0 ? (
          <div className="relative z-10 mx-8 mb-6">
            <div className="relative">
              <img
                src={photo0}
                alt="Cover"
                className="w-full object-cover"
                style={{ height: "460px", borderRadius: "0" }}
              />
              <div className="absolute inset-0 pointer-events-none">
                <FlowerDaisy color="#FFFFFF" size={28} opacity={0.7} className="absolute -top-3 -right-3" />
                <FlowerTulip color="#E8A87C" size={22} opacity={0.6} className="absolute -bottom-2 -left-2" />
                <FlowerSmall color="#B5C7D3" size={16} opacity={0.5} className="absolute top-8 -left-2" />
                <FlowerLeaf size={16} opacity={0.45} className="absolute -bottom-2 right-8" />
                <FlowerStar color="#F5D88E" size={10} opacity={0.5} className="absolute top-4 right-12" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mx-8 mb-6">
            <div
              className="w-full flex items-center justify-center"
              style={{ height: "460px", backgroundColor: accentSoft }}
            >
              <p className="text-[13px]" style={{ color: textSecondary, letterSpacing: "0.1em" }}>ADD PHOTOS</p>
            </div>
          </div>
        )}

        <div className="relative z-10 text-center pb-14 px-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px flex-1 max-w-[50px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
            <FlowerSmall color="#F4C7AB" size={16} opacity={0.5} />
            <div className="h-px flex-1 max-w-[50px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
          </div>
          <p
            className="text-[24px] font-medium mb-2"
            style={{ color: textPrimary, letterSpacing: "0.1em", fontFamily: serifFont }}
          >
            {data.groomName || "신랑"} <span className="text-[16px] font-normal mx-1" style={{ color: accent, fontFamily: "'Caveat', cursive" }}>&</span> {data.brideName || "신부"}
          </p>
          <p className="text-[12px]" style={{ color: textSecondary, letterSpacing: "0.08em", fontFamily: sansFont }}>
            {helpers.formatWeddingDate()}{data.time ? ` | ${data.time}` : ""}
          </p>
          <p className="text-[11px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>
            {data.venue || ""}
          </p>
        </div>
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
        <FlowerDaisy color="#F4C7AB" size={22} opacity={0.25} className="absolute top-6 right-6" />
        <FlowerLeaf size={18} opacity={0.2} className="absolute bottom-8 left-4" />

        <SectionTitle title="초대합니다" subtitle="Invitation" />

        {data.invitationTitle && (
          <p className="text-[15px] font-medium text-center mb-4" style={{ color: textPrimary, fontFamily: sansFont }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p
            className="text-[13px] leading-[2.2] whitespace-pre-line mb-8"
            style={{ color: textSecondary, textAlign: data.messageAlign || "center", fontFamily: sansFont }}
          >
            {data.message}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: borderColor }} />
          <FlowerSmall color="#E8A87C" size={14} opacity={0.4} />
          <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: borderColor }} />
        </div>

        {data.showNameAtBottom && (() => {
          const groomBlock = (
            <p className="text-[13px] leading-relaxed" style={{ color: textPrimary, fontFamily: sansFont }}>
              {data.groomFather?.name && (
                <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
              )}
              {data.groomMother?.name && (
                <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
              )}
              {(data.groomFather?.name || data.groomMother?.name) && (
                <span className="text-[12px]" style={{ color: textSecondary }}> {data.groomRelation || "아들"} </span>
              )}
              <span className="font-medium">{data.groomName || "신랑"}</span>
            </p>
          )
          const brideBlock = (
            <p className="text-[13px] leading-relaxed" style={{ color: textPrimary, fontFamily: sansFont }}>
              {data.brideFather?.name && (
                <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
              )}
              {data.brideMother?.name && (
                <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
              )}
              {(data.brideFather?.name || data.brideMother?.name) && (
                <span className="text-[12px]" style={{ color: textSecondary }}> {data.brideRelation || "딸"} </span>
              )}
              <span className="font-medium">{data.brideName || "신부"}</span>
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
          onClick={() => state.setShowContact(true)}
          className="w-full py-3.5 text-[12px] transition-colors"
          style={{
            border: `1px solid ${borderColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            borderRadius: "100px",
            letterSpacing: "0.08em",
            fontFamily: sansFont,
          }}
        >
          연락하기
        </button>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-10" style={{ backgroundColor: sectionBg1 }}>
          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-2 gap-[2px]">
              {state.galleryImages.map((img, index) => (
                <div key={index} className="aspect-square cursor-pointer overflow-hidden group"
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}>
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-[2px]">
                {state.galleryImages.map((img, index) => (
                  <div key={index} className="w-[200px] h-[260px] flex-shrink-0 cursor-pointer overflow-hidden group"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}>
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CALENDAR & COUNTDOWN SECTION ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
            <FlowerTulip color="#D4A5A5" size={22} opacity={0.2} className="absolute top-8 left-4" />
            <FlowerStar color="#F5D88E" size={12} opacity={0.25} className="absolute top-12 right-8" />

            <SectionTitle title="예식 일시" subtitle="Calendar" />

            <div className="text-center mb-6">
              <p className="text-[16px] font-medium" style={{ color: textPrimary, fontFamily: serifFont }}>{helpers.formatWeddingDate()}</p>
              <p className="text-[12px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>
                {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
              </p>
            </div>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto max-w-[300px] p-5" style={{ backgroundColor: pageBg, borderRadius: "12px" }}>
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[10px] py-1.5 text-center font-medium" style={{ color: accent, fontFamily: sansFont }}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-medium text-white" style={{ backgroundColor: accent }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[12px]" style={{ color: i % 7 === 0 ? "#D4836A" : i % 7 === 6 ? "#7BA4C5" : textPrimary, fontFamily: sansFont }}>
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
              <div className="mb-8 py-4 text-center" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                <p className="text-[15px]" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[12px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="flex items-center justify-center gap-3 mt-4">
                {[
                  { label: "Days", value: state.countdown.days },
                  { label: "Hours", value: state.countdown.hours },
                  { label: "Min", value: state.countdown.minutes },
                  { label: "Sec", value: state.countdown.seconds },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full mb-1" style={{ backgroundColor: pageBg }}>
                        <p className="text-[22px] font-light" style={{ color: accent, fontFamily: serifFont }}>{item.value}</p>
                      </div>
                      <p className="text-[9px] uppercase" style={{ color: textSecondary, letterSpacing: "0.1em", fontFamily: englishFont, fontSize: "11px" }}>{item.label}</p>
                    </div>
                    {i < 3 && <span className="text-[16px] font-light -mt-4" style={{ color: accentSoft }}>:</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg1 }}>
        <FlowerDaisy color="#FFFFFF" size={20} opacity={0.3} className="absolute top-6 right-8" />
        <FlowerSmall color="#B5C7D3" size={14} opacity={0.25} className="absolute bottom-10 left-6" />

        <SectionTitle title="오시는 길" subtitle="Location" />

        <div className="text-center mb-6">
          <p className="text-[15px] font-medium mb-1" style={{ color: textPrimary, fontFamily: sansFont }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[12px]" style={{ color: textSecondary, fontFamily: sansFont }}>
            {data.address || "주소를 입력해주세요"}
          </p>
          {data.venuePhone && (
            <p className="text-[11px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
          <MapEmbed address={data.address} height={200} borderColor={borderColor} bgColor={sectionBg2 || sectionBg1 || "#F5F5F0"} />
        </div>

        <button
          className="w-full py-3.5 text-[12px] mt-6"
          style={{
            border: `1px solid ${borderColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            borderRadius: "100px",
            letterSpacing: "0.08em",
            fontFamily: sansFont,
          }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-6 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="p-4" style={{ backgroundColor: sectionBg2, borderRadius: "8px" }}>
                {item.type && (
                  <p className="text-[12px] font-medium mb-2" style={{ color: textPrimary, fontFamily: sansFont }}>
                    {item.type}
                  </p>
                )}
                {item.detail && (
                  <p className="text-[12px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="mt-4 p-4" style={{ backgroundColor: sectionBg2, borderRadius: "8px" }}>
            <p className="text-[12px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.transportInfo}
            </p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-4 p-4" style={{ backgroundColor: sectionBg2, borderRadius: "8px" }}>
            <p className="text-[11px] leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
              주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
            </p>
          </div>
        )}
      </div>

      {/* ===== MID PHOTO ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="relative">
          <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" />
          <div className="absolute inset-0 pointer-events-none">
            <FlowerDaisy color="#FFFFFF" size={26} opacity={0.5} className="absolute top-4 right-4" />
            <FlowerSmall color="#F4C7AB" size={14} opacity={0.4} className="absolute bottom-4 left-4" />
          </div>
        </div>
      )}

      {/* ===== RSVP SECTION ===== */}
      {data.showRsvp && (
        <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
          <FlowerTulip color="#F4C7AB" size={20} opacity={0.2} className="absolute top-8 right-6" />

          <SectionTitle title="참석 여부" subtitle="R.S.V.P" />

          <p className="text-[13px] text-center mb-8 leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
            {data.rsvpContent || "참석 여부를 미리 알려주시면 감사하겠습니다"}
          </p>

          <button
            className="w-full py-3.5 text-[12px] text-white transition-colors"
            style={{
              backgroundColor: accent,
              border: "none",
              borderRadius: "100px",
              letterSpacing: "0.08em",
              fontFamily: sansFont,
            }}
            data-testid="button-rsvp"
            onClick={() => onRsvpClick?.()}
          >
            {data.rsvpButtonName || "참석 의사 전달하기"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK SECTION ===== */}
      {data.showGuestbook && (
        <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg1 }}>
          <FlowerSmall color="#E8A87C" size={16} opacity={0.2} className="absolute top-8 left-6" />
          <FlowerLeaf size={14} opacity={0.2} className="absolute bottom-6 right-8" />

          <SectionTitle title="방명록" subtitle="Guest Book" />

          <div className="space-y-3 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: cardBg, borderRadius: "10px", border: `1px solid ${borderColor}` }}>
                  <p className="text-[12px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary, fontFamily: sansFont }}>
                    {entry.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <FlowerStar color="#F5D88E" size={8} opacity={0.5} />
                    <p className="text-[11px] font-medium" style={{ color: textPrimary, fontFamily: sansFont }}>
                      {entry.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center" style={{ backgroundColor: cardBg, borderRadius: "10px", border: `1px solid ${borderColor}` }}>
                <FlowerDaisy color="#F4C7AB" size={28} opacity={0.3} className="mx-auto mb-3" />
                <p className="text-[12px] leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: cardBg, borderRadius: "10px", border: `1px solid ${borderColor}` }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-4 text-[12px] mb-3 outline-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary, fontFamily: sansFont, borderRadius: "8px" }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-4 text-[12px] mb-3 outline-none resize-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary, fontFamily: sansFont, borderRadius: "8px" }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 text-[12px]"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary, borderRadius: "100px", fontFamily: sansFont }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[12px] text-white"
                  style={{ backgroundColor: accent, border: "none", borderRadius: "100px", fontFamily: sansFont }}
                  data-testid="button-guestbook-submit"
                >
                  등록하기
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3.5 text-[12px]"
              style={{
                border: `1px solid ${borderColor}`,
                color: textPrimary,
                backgroundColor: "transparent",
                borderRadius: "100px",
                letterSpacing: "0.08em",
                fontFamily: sansFont,
              }}
              data-testid="button-guestbook-write"
            >
              작성하기
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING SECTION ===== */}
      {data.showFunding && (
        <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
          <FlowerDaisy color="#F4C7AB" size={18} opacity={0.2} className="absolute top-6 left-6" />

          <SectionTitle title="축하 전하기" subtitle="Celebration" />

          {data.fundingMessage && (
            <p className="text-[13px] leading-[1.8] whitespace-pre-line text-center mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.fundingMessage}
            </p>
          )}

          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-6">
              <div className="w-[200px] h-[200px] rounded-[12px] overflow-hidden">
                <img src={data.fundingImage} alt="펀딩" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}

          <button
            className="w-full py-3.5 text-[12px] text-white mb-4 border-0"
            style={{
              backgroundColor: accent,
              borderRadius: "100px",
              letterSpacing: "0.08em",
              fontFamily: sansFont,
            }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[11px] leading-[1.6] text-center" style={{ color: textSecondary, fontFamily: sansFont }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING SECTION ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="선물 펀딩" subtitle="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[12px] leading-[2] whitespace-pre-line text-center mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3.5 text-[12px] text-white border-0"
              style={{
                backgroundColor: accent,
                borderRadius: "100px",
                letterSpacing: "0.08em",
                fontFamily: sansFont,
              }}
              data-testid="button-gift-funding"
              onClick={() => openKakaoGift()}
            >
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
              <div key={i} className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <div>
                  <p className="text-[12px]" style={{ color: textPrimary, fontFamily: sansFont }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textSecondary, fontFamily: sansFont }}>{acc!.holder}</p>
                </div>
                <button
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                  className="px-4 py-1.5 text-[10px]"
                  style={{
                    border: `1px solid ${borderColor}`,
                    color: textPrimary,
                    backgroundColor: "transparent",
                    borderRadius: "100px",
                    fontFamily: sansFont,
                  }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
            <FlowerSmall color="#B5C7D3" size={14} opacity={0.2} className="absolute top-8 right-6" />

            <SectionTitle title="마음 전하실 곳" subtitle="Account" />

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div style={{ borderRadius: "10px", border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[12px] font-medium" style={{ color: textPrimary, fontFamily: sansFont }}>
                        신랑측 계좌번호
                      </p>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textSecondary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                        {renderAccList(groomAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4" style={{ borderRadius: "10px", border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <div className="flex items-center gap-2 mb-3">
                      <FlowerStar color="#C5956B" size={10} opacity={0.5} />
                      <p className="text-[11px] font-medium" style={{ color: accent, fontFamily: sansFont }}>신랑측</p>
                    </div>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div style={{ borderRadius: "10px", border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[12px] font-medium" style={{ color: textPrimary, fontFamily: sansFont }}>
                        신부측 계좌번호
                      </p>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textSecondary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                        {renderAccList(brideAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4" style={{ borderRadius: "10px", border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <div className="flex items-center gap-2 mb-3">
                      <FlowerStar color="#D4A5A5" size={10} opacity={0.5} />
                      <p className="text-[11px] font-medium" style={{ color: accent, fontFamily: sansFont }}>신부측</p>
                    </div>
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
        <div className="px-8 py-10" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="세례명" subtitle="Baptismal Name" />
          <div className="flex justify-center gap-12">
            <div className="space-y-1 text-center">
              {data.baptismalGroom && (
                <p className="text-[12px] font-medium" style={{ color: textPrimary, fontFamily: sansFont }}>{data.baptismalGroom}</p>
              )}
              {data.baptismalGroomFather && (
                <p className="text-[11px]" style={{ color: textSecondary, fontFamily: sansFont }}>{data.baptismalGroomFather}</p>
              )}
              {data.baptismalGroomMother && (
                <p className="text-[11px]" style={{ color: textSecondary, fontFamily: sansFont }}>{data.baptismalGroomMother}</p>
              )}
            </div>
            <div className="space-y-1 text-center">
              {data.baptismalBride && (
                <p className="text-[12px] font-medium" style={{ color: textPrimary, fontFamily: sansFont }}>{data.baptismalBride}</p>
              )}
              {data.baptismalBrideFather && (
                <p className="text-[11px]" style={{ color: textSecondary, fontFamily: sansFont }}>{data.baptismalBrideFather}</p>
              )}
              {data.baptismalBrideMother && (
                <p className="text-[11px]" style={{ color: textSecondary, fontFamily: sansFont }}>{data.baptismalBrideMother}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="게스트 스냅" subtitle="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[12px] whitespace-pre-line leading-[1.8] text-center mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3.5 text-[12px]"
            style={{
              border: `1px solid ${borderColor}`,
              color: textPrimary,
              backgroundColor: "transparent",
              borderRadius: "100px",
              letterSpacing: "0.08em",
              fontFamily: sansFont,
            }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE SECTION ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg1 }}>
          <FlowerLeaf size={16} opacity={0.2} className="absolute top-6 right-6" />

          <SectionTitle title={data.noticeTitle} subtitle="Notice" />

          <div className="p-5" style={{ backgroundColor: sectionBg2, borderRadius: "10px" }}>
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[12px] leading-[1.8] mb-1" style={{ color: textSecondary, fontFamily: sansFont }}>
                {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING SECTION ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-8 py-14 relative" style={{ backgroundColor: sectionBg2 }}>
            <FlowerDaisy color="#F4C7AB" size={20} opacity={0.2} className="absolute top-6 right-8" />
            <FlowerTulip color="#D4A5A5" size={18} opacity={0.2} className="absolute bottom-6 left-6" />

            <SectionTitle title="감사합니다" subtitle="Thank You" />

            {eStyle === "card" && data.endingPhoto && (
              <div className="mx-auto max-w-[260px] mb-6 overflow-hidden relative" style={{ borderRadius: "10px" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                  <FlowerSmall color="#FFFFFF" size={14} opacity={0.5} className="absolute top-2 right-2" />
                </div>
              </div>
            )}

            {eStyle === "card" && data.endingContent && (
              <p className="text-[12px] leading-[2] whitespace-pre-line text-center" style={{ color: textSecondary, fontFamily: sansFont }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "full" && data.endingPhoto && (
              <div className="-mx-8 mb-6 relative">
                <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "400px" }} />
                <div className="absolute inset-0 bg-black/30" />
                {data.endingContent && (
                  <div className="absolute inset-0 flex items-center justify-center px-8">
                    <p className="text-[12px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor, fontFamily: sansFont }}>
                      {data.endingContent}
                    </p>
                  </div>
                )}
              </div>
            )}

            {eStyle === "full" && !data.endingPhoto && data.endingContent && (
              <p className="text-[12px] leading-[2] whitespace-pre-line text-center" style={{ color: textSecondary, fontFamily: sansFont }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "simple" && (
              <>
                {data.endingPhoto && (
                  <div className="-mx-8 mb-0 relative">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "360px" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {data.endingContent && (
                      <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="h-px w-10" style={{ backgroundColor: endTextColor, opacity: 0.5 }} />
                          <FlowerSmall color="#FFFFFF" size={12} opacity={0.6} />
                          <div className="h-px w-10" style={{ backgroundColor: endTextColor, opacity: 0.5 }} />
                        </div>
                        <p className="text-[12px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor, fontFamily: sansFont }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!data.endingPhoto && data.endingContent && (
                  <div>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-px w-10" style={{ backgroundColor: borderColor }} />
                      <FlowerSmall color="#F4C7AB" size={12} opacity={0.4} />
                      <div className="h-px w-10" style={{ backgroundColor: borderColor }} />
                    </div>
                    <p className="text-[12px] leading-[2] whitespace-pre-line text-center" style={{ color: textSecondary, fontFamily: sansFont }}>
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
      <div className="px-8 pb-8 pt-4 relative" style={{ backgroundColor: sectionBg1 }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-3.5 text-[12px]"
          style={{
            border: `1px solid ${borderColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            borderRadius: "100px",
            letterSpacing: "0.08em",
            fontFamily: sansFont,
          }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-8 pb-12 pt-4 relative" style={{ backgroundColor: sectionBg1 }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <FlowerSmall color="#F4C7AB" size={12} opacity={0.3} />
          <FlowerStar color="#F5D88E" size={8} opacity={0.3} />
          <FlowerSmall color="#B5C7D3" size={10} opacity={0.3} />
        </div>
        <p className="text-[9px] text-center" style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}>
          MADE WITH WE:BEAT
        </p>
      </div>
    </>
  )
}
