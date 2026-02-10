"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

const PlaneIcon = ({ size = 16, color = "#1E2D4A", rotate = 0, opacity = 1 }: { size?: number; color?: string; rotate?: number; opacity?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotate}deg)`, opacity }}>
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={color}/>
  </svg>
)

const GlobeIcon = ({ size = 60, color = "#1E2D4A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" fill="none"/>
    <ellipse cx="50" cy="50" rx="20" ry="45" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M5 50h90" stroke={color} strokeWidth="1.5"/>
    <path d="M10 30h80" stroke={color} strokeWidth="1"/>
    <path d="M10 70h80" stroke={color} strokeWidth="1"/>
    <path d="M50 5v90" stroke={color} strokeWidth="1"/>
  </svg>
)

export function BoardingPassLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const navyBg = "#1E2D4A"
  const navyDark = "#152238"
  const ticketBg = "#FFFFFF"
  const ticketBgAlt = "#F8F9FC"
  const textNavy = "#1E2D4A"
  const textMuted = "#6B7B8D"
  const accent = "#1E2D4A"
  const accentLight = "#3A5A7C"
  const borderColor = "#D4DCE6"
  const stampColor = "#1E2D4A"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "Georgia, 'Times New Roman', serif")

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: textMuted }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const ScallopTop = () => (
    <div className="relative w-full h-4 overflow-hidden" style={{ marginBottom: "-1px" }}>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <svg width="100%" height="16" preserveAspectRatio="none" viewBox="0 0 400 16">
          <path d={Array.from({ length: 26 }, (_, i) => {
            const x = i * 16
            return `M${x},16 Q${x + 8},0 ${x + 16},16`
          }).join(" ")} fill={ticketBg} />
        </svg>
      </div>
    </div>
  )

  const ScallopBottom = () => (
    <div className="relative w-full h-4 overflow-hidden" style={{ marginTop: "-1px" }}>
      <div className="absolute inset-x-0 top-0 flex justify-center">
        <svg width="100%" height="16" preserveAspectRatio="none" viewBox="0 0 400 16">
          <path d={Array.from({ length: 26 }, (_, i) => {
            const x = i * 16
            return `M${x},0 Q${x + 8},16 ${x + 16},0`
          }).join(" ")} fill={ticketBg} />
        </svg>
      </div>
    </div>
  )

  const DashedDivider = () => (
    <div className="flex items-center my-0 px-4">
      <div className="w-3 h-6 rounded-r-full" style={{ backgroundColor: navyBg, marginLeft: "-17px", zIndex: 2 }} />
      <div className="flex-1 border-t-2 border-dashed mx-1" style={{ borderColor: borderColor }} />
      <div className="w-3 h-6 rounded-l-full" style={{ backgroundColor: navyBg, marginRight: "-17px", zIndex: 2 }} />
    </div>
  )

  const PlaneDivider = ({ label }: { label?: string }) => (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="flex-1 h-px" style={{ backgroundColor: borderColor }} />
      {label ? (
        <div className="flex items-center gap-2">
          <PlaneIcon size={14} color={accentLight} rotate={90} />
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: textMuted }}>{label}</span>
        </div>
      ) : (
        <PlaneIcon size={14} color={accentLight} rotate={90} />
      )}
      <div className="flex-1 h-px" style={{ backgroundColor: borderColor }} />
    </div>
  )

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-1">
        <div className="w-6 h-px" style={{ backgroundColor: borderColor }} />
        <PlaneIcon size={12} color={accentLight} rotate={90} />
        <div className="w-6 h-px" style={{ backgroundColor: borderColor }} />
      </div>
      {subtitle && <p className="text-[20px] font-bold tracking-tight" style={{ color: textNavy, fontFamily: englishFont }}>{subtitle}</p>}
      {title && <p className="text-[12px] tracking-[0.15em] mt-1" style={{ color: textMuted }}>{title}</p>}
    </div>
  )

  const StampDecoration = ({ text, size = 60 }: { text: string; size?: number }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          border: `2px solid ${stampColor}30`,
          transform: "rotate(-15deg)",
        }}
      >
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            width: size - 8,
            height: size - 8,
            border: `1.5px dashed ${stampColor}25`,
          }}
        >
          <span className="text-[7px] font-bold tracking-[0.1em] text-center leading-tight" style={{ color: `${stampColor}35` }}>{text}</span>
        </div>
      </div>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO - FULL PHOTO BACKGROUND ===== */}
      <div style={{ backgroundColor: navyBg, fontFamily }}>
        <div className="relative w-full overflow-hidden" style={{ minHeight: "620px" }}>
          {/* Background photo */}
          {state.allPhotos.length > 0 ? (
            <>
              {coverStyle === "static" ? (
                <div className="absolute inset-0">
                  <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "620px" }} />
                </div>
              ) : coverStyle === "slide" ? (
                <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                  {state.allPhotos.map((photo, i) => (
                    <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "620px" }}>
                      <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "620px" }} />
                    </div>
                  ))}
                </div>
              ) : (
                state.allPhotos.map((photo, i) => (
                  <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "620px" }} />
                  </div>
                ))
              )}
              {/* Dark wash gradient for readability */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navyBg}CC 0%, ${navyBg}60 35%, ${navyBg}60 65%, ${navyBg}DD 100%)` }} />
            </>
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${navyDark} 0%, ${navyBg} 100%)` }} />
          )}

          {/* Slide dots */}
          {state.allPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {state.allPhotos.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.35)" }} />
              ))}
            </div>
          )}

          {/* Overlaid ticket content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6" style={{ minHeight: "620px" }}>
            {/* Top label */}
            <div className="flex items-center gap-2 mb-3">
              <PlaneIcon size={14} color="rgba(255,255,255,0.6)" rotate={90} />
              <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                Wedding Ticket
              </p>
            </div>

            {/* Globe icon */}
            <div className="flex justify-center mb-4">
              <GlobeIcon size={65} color="rgba(255,255,255,0.2)" />
            </div>

            {/* Plane path divider */}
            <div className="flex items-center justify-center gap-2 mb-5 w-full max-w-[260px]">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3))" }} />
              <PlaneIcon size={16} color="rgba(255,255,255,0.7)" rotate={90} />
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.3), transparent)" }} />
            </div>

            {/* Names */}
            <p className="text-[28px] font-bold tracking-tight text-center mb-6" style={{ color: "#FFFFFF", fontFamily: englishFont, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
              {data.groomName || "\uC2E0\uB791"} <span className="text-[22px] font-normal" style={{ color: "rgba(255,255,255,0.7)" }}>&</span> {data.brideName || "\uC2E0\uBD80"}
            </p>

            {/* Info box - glass effect */}
            <div className="w-full max-w-[300px] rounded-[10px] p-4" style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="flex">
                <div className="flex-1 pr-3" style={{ borderRight: "1px solid rgba(255,255,255,0.15)" }}>
                  <p className="text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>날짜</p>
                  <p className="text-[14px] font-medium" style={{ color: "#FFFFFF" }}>{helpers.formatWeddingDate()}</p>
                </div>
                <div className="flex-1 pl-3">
                  <p className="text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>시간</p>
                  <p className="text-[14px] font-medium" style={{ color: "#FFFFFF" }}>{data.time || helpers.formatWeddingTime()}</p>
                </div>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: "1px dashed rgba(255,255,255,0.2)" }}>
                <p className="text-[9px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>장소</p>
                <p className="text-[14px] font-medium" style={{ color: "#FFFFFF" }}>
                  {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
                </p>
              </div>
            </div>

            {/* Stamp */}
            <div className="absolute top-8 right-5 opacity-30">
              <div className="rounded-full flex items-center justify-center" style={{ width: 50, height: 50, border: "2px solid rgba(255,255,255,0.4)", transform: "rotate(-15deg)" }}>
                <div className="rounded-full flex items-center justify-center" style={{ width: 42, height: 42, border: "1.5px dashed rgba(255,255,255,0.3)" }}>
                  <span className="text-[7px] font-bold tracking-[0.1em] text-center leading-tight" style={{ color: "rgba(255,255,255,0.5)" }}>{"FIRST\nCLASS"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket stub below hero */}
        <div className="px-4 pb-0">
          <ScallopTop />
          <div className="relative overflow-hidden" style={{ backgroundColor: ticketBg }}>
            <DashedDivider />
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: textMuted }}>Gate</p>
                <p className="text-[15px] font-bold" style={{ color: textNavy }}>{data.venueHall || "MAIN"}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: textMuted }}>Seat</p>
                <p className="text-[15px] font-bold" style={{ color: textNavy }}>LOVE</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: textMuted }}>Status</p>
                <p className="text-[15px] font-bold" style={{ color: accent }}>CONFIRMED</p>
              </div>
            </div>
            <div className="px-6 pb-4 text-center">
              <p className="text-[9px] tracking-[0.2em] uppercase" style={{ color: textMuted }}>Wedding Ticket</p>
            </div>
          </div>
          <ScallopBottom />
        </div>

        {/* ===== INVITATION SECTION ===== */}
        <div className="px-4 pt-6">
          <ScallopTop />
          <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
            <SectionTitle subtitle="Invitation" title="소중한 분들을 초대합니다" />

            {data.invitationTitle && (
              <p className="text-[16px] text-center font-medium mb-4" style={{ color: textNavy }}>{data.invitationTitle}</p>
            )}
            {data.message && (
              <p
                className="text-[14px] leading-[2] whitespace-pre-line mb-6"
                style={{ color: textMuted, textAlign: data.messageAlign || "center" }}
              >
                {data.message}
              </p>
            )}

            <PlaneDivider />

            {/* Parents info */}
            {data.showNameAtBottom && (() => {
              const groomBlock = (
                <p className="text-[14px] leading-relaxed" style={{ color: textNavy }}>
                  {data.groomFather?.name && (
                    <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
                  )}
                  {data.groomMother?.name && (
                    <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
                  )}
                  {(data.groomFather?.name || data.groomMother?.name) && (
                    <span className="text-[12px]" style={{ color: textMuted }}> {data.groomRelation || "\uC544\uB4E4"} </span>
                  )}
                  <span className="font-bold">{data.groomName || "\uC2E0\uB791"}</span>
                </p>
              )
              const brideBlock = (
                <p className="text-[14px] leading-relaxed" style={{ color: textNavy }}>
                  {data.brideFather?.name && (
                    <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
                  )}
                  {data.brideMother?.name && (
                    <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
                  )}
                  {(data.brideFather?.name || data.brideMother?.name) && (
                    <span className="text-[12px]" style={{ color: textMuted }}> {data.brideRelation || "\uB538"} </span>
                  )}
                  <span className="font-bold">{data.brideName || "\uC2E0\uBD80"}</span>
                </p>
              )
              const nameStyle = data.nameDisplayStyle || "horizontal"
              const first = data.brideFirst ? brideBlock : groomBlock
              const second = data.brideFirst ? groomBlock : brideBlock

              return nameStyle === "vertical" ? (
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-12">
                    <div className="space-y-1">{first}</div>
                    <div className="space-y-1">{second}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 mb-6">
                  {first}
                  {second}
                </div>
              )
            })()}

            <button
              data-testid="button-contact"
              onClick={() => state.setShowContact(true)}
              className="w-[180px] mx-auto block py-3 rounded-[8px] text-[13px] font-medium"
              style={{ border: `1.5px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
            >
              연락하기
            </button>
          </div>
          <ScallopBottom />
        </div>

        {/* ===== CALENDAR & COUNTDOWN ===== */}
        {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
          const cal = helpers.getCalendarData()
          if (!cal) return null
          const calStyle = data.calendarStyle || "full"
          return (
            <div className="px-4 pt-6">
              <ScallopTop />
              <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
                <SectionTitle subtitle="Calendar" title="예식 일정" />

                {data.showCalendar && calStyle === "full" && (
                  <div className="mb-6 mx-auto" style={{ maxWidth: "300px" }}>
                    <div className="rounded-[8px] p-4 mb-4" style={{ backgroundColor: accent }}>
                      <p className="text-[16px] font-bold text-white">{cal.year}년 {cal.month}월</p>
                    </div>
                    <div className="grid grid-cols-7 gap-0 mb-2">
                      {cal.dayNames.map((d) => (
                        <div key={d} className="text-[11px] py-2 text-center font-medium" style={{ color: textMuted }}>{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0">
                      {cal.days.map((day, i) => (
                        <div key={i} className="py-2 text-center">
                          {day !== null && (
                            day === cal.weddingDay ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-bold text-white" style={{ backgroundColor: accent }}>
                                {day}
                              </span>
                            ) : (
                              <span className="text-[13px]" style={{ color: i % 7 === 0 ? "#C07070" : i % 7 === 6 ? "#5A8CB0" : textNavy }}>
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
                  <div className="mb-6 py-4" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                    <p className="text-[16px] font-medium" style={{ color: textNavy }}>
                      {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                    </p>
                    <p className="text-[13px] mt-1" style={{ color: textMuted }}>{helpers.formatWeddingTime()}</p>
                  </div>
                )}

                {data.showCountdown && (
                  <div className="mt-2">
                    <p className="text-[24px] font-bold mb-2" style={{ color: accent }}>
                      {helpers.formatWeddingDate()}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      {[
                        { label: "DAYS", value: state.countdown.days },
                        { label: "HOUR", value: state.countdown.hours },
                        { label: "MIN", value: state.countdown.minutes },
                        { label: "SEC", value: state.countdown.seconds },
                      ].map((item, idx) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className="w-[56px]">
                            <p className="text-[22px] font-bold" style={{ color: accent }}>{String(item.value).padStart(2, "0")}</p>
                            <p className="text-[8px] tracking-wider" style={{ color: textMuted }}>{item.label}</p>
                          </div>
                          {idx < 3 && <span className="text-[18px]" style={{ color: borderColor }}>:</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <ScallopBottom />
            </div>
          )
        })()}

        {/* ===== GALLERY ===== */}
        {data.showGallery && state.galleryImages.length > 0 && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
              <SectionTitle subtitle="Gallery" title="우리의 순간들" />

              {data.galleryStyle === "grid" || !data.galleryStyle ? (
                <div className="grid grid-cols-2 gap-2">
                  {state.galleryImages.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square cursor-pointer overflow-hidden rounded-[4px]"
                      style={{ border: `1px solid ${borderColor}` }}
                      onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                      data-testid={`gallery-photo-${index}`}
                    >
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-2">
                  <div className="flex gap-2 px-2">
                    {state.galleryImages.map((img, index) => (
                      <div
                        key={index}
                        className="w-[160px] h-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[4px]"
                        style={{ border: `1px solid ${borderColor}` }}
                        onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                        data-testid={`gallery-photo-${index}`}
                      >
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== LOCATION ===== */}
        <div className="px-4 pt-6">
          <ScallopTop />
          <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
            <SectionTitle subtitle="Location" title="오시는 길" />

            <div className="text-center mb-6">
              <p className="text-[16px] font-bold mb-1" style={{ color: textNavy }}>
                {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
              </p>
              <p className="text-[13px]" style={{ color: textMuted }}>{data.address || "주소를 입력해주세요"}</p>
              {data.venuePhone && (
                <p className="text-[12px] mt-1" style={{ color: textMuted }}>Tel. {data.venuePhone}</p>
              )}
            </div>

            <div className="rounded-[8px] overflow-hidden mb-4" style={{ border: `1px solid ${borderColor}` }}>
              <MapEmbed address={data.address} height={180} borderColor={borderColor} bgColor={ticketBgAlt} />
            </div>

            <button
              className="w-full py-3 rounded-[8px] text-[13px] font-medium"
              style={{ backgroundColor: accent, color: "#fff" }}
              data-testid="button-directions"
              onClick={() => openNaverDirections(data.address)}
            >
              길찾기
            </button>

            {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
              <div className="mt-6 space-y-4">
                {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
                  <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                    {item.type && <p className="text-[14px] font-bold mb-2" style={{ color: textNavy }}>{item.type}</p>}
                    {item.detail && <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textMuted }}>{item.detail}</p>}
                  </div>
                ))}
              </div>
            )}
            {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
              <div className="pt-4 mt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textMuted }}>{data.transportInfo}</p>
              </div>
            )}
            {data.showTransportNotice && (
              <div className="mt-4 p-3 rounded-[8px]" style={{ backgroundColor: ticketBgAlt }}>
                <p className="text-[12px] leading-[1.8]" style={{ color: textMuted }}>
                  주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
                </p>
              </div>
            )}
          </div>
          <ScallopBottom />
        </div>

        {/* ===== MID PHOTO ===== */}
        {data.showMidPhoto && data.midPhoto && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-0">
              <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" />
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== RSVP ===== */}
        {data.showRsvp && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="R.S.V.P" title="참석 의사 전달" />

              <p className="text-[13px] mb-6" style={{ color: textMuted }}>
                {data.rsvpContent || "참석 여부를 미리 알려주시면 감사하겠습니다"}
              </p>

              <button
                className="w-full py-3.5 rounded-[8px] text-[14px] font-bold"
                style={{ backgroundColor: accent, color: "#fff" }}
                data-testid="button-rsvp"
                onClick={() => onRsvpClick?.()}
              >
                {data.rsvpButtonName || "참석 의사 전달하기"}
              </button>
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== GUESTBOOK ===== */}
        {data.showGuestbook && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
              <SectionTitle subtitle="Guest Book" title="방명록" />

              <div className="space-y-3 mb-6">
                {state.guestbookEntries.length > 0 ? (
                  state.guestbookEntries.slice(0, 5).map((entry, i) => (
                    <div key={i} className="p-4 rounded-[8px]" style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}>
                      <p className="text-[13px] leading-[1.8] whitespace-pre-line mb-2" style={{ color: textMuted }}>{entry.message}</p>
                      <p className="text-[11px] font-medium" style={{ color: textNavy }}>- {entry.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-[8px]" style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}>
                    <p className="text-[13px]" style={{ color: textMuted }}>
                      축하 메시지를 남겨주세요
                    </p>
                  </div>
                )}
              </div>

              {state.showGuestbookForm ? (
                <div className="p-4 rounded-[8px] mb-4" style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}>
                  <input
                    type="text"
                    value={state.guestbookName}
                    onChange={(e) => state.setGuestbookName(e.target.value)}
                    placeholder="이름"
                    className="w-full py-2.5 px-3 rounded-[6px] text-[13px] mb-2 outline-none"
                    style={{ border: `1px solid ${borderColor}`, backgroundColor: ticketBg, color: textNavy }}
                    data-testid="input-guestbook-name"
                  />
                  <textarea
                    value={state.guestbookMessage}
                    onChange={(e) => state.setGuestbookMessage(e.target.value)}
                    placeholder="축하 메시지를 작성해주세요"
                    rows={4}
                    className="w-full py-2.5 px-3 rounded-[6px] text-[13px] mb-3 outline-none resize-none"
                    style={{ border: `1px solid ${borderColor}`, backgroundColor: ticketBg, color: textNavy }}
                    data-testid="input-guestbook-message"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => state.setShowGuestbookForm(false)}
                      className="flex-1 py-2.5 rounded-[6px] text-[12px]"
                      style={{ border: `1px solid ${borderColor}`, color: textMuted }}
                      data-testid="button-guestbook-cancel"
                    >
                      취소
                    </button>
                    <button
                      onClick={helpers.submitGuestbook}
                      className="flex-1 py-2.5 rounded-[6px] text-[12px] font-medium"
                      style={{ backgroundColor: accent, color: "#fff" }}
                      data-testid="button-guestbook-submit"
                    >
                      등록하기
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => state.setShowGuestbookForm(true)}
                  className="w-full py-3 rounded-[8px] text-[13px] font-medium"
                  style={{ border: `1.5px solid ${accent}`, color: accent }}
                  data-testid="button-guestbook-write"
                >
                  작성하기
                </button>
              )}
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== FUNDING ===== */}
        {data.showFunding && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="Funding" title="축하 펀딩" />

              {data.fundingMessage && (
                <p className="text-[14px] font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textNavy }}>
                  {data.fundingMessage}
                </p>
              )}

              <div className="flex justify-center mb-6">
                {data.fundingImageType === "custom" && data.fundingImage ? (
                  <div className="w-[180px] h-[180px] rounded-[8px] overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                    <img src={data.fundingImage} alt="펀딩" className="w-full h-full object-cover" data-testid="img-funding-custom" />
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] flex items-center justify-center">
                    <PlaneIcon size={60} color={`${accent}20`} rotate={45} />
                  </div>
                )}
              </div>

              <button
                className="w-full py-3.5 rounded-[8px] text-[14px] font-bold"
                style={{ backgroundColor: accent, color: "#fff" }}
                data-testid="button-funding"
                onClick={() => openKakaoTransfer()}
              >
                {data.fundingButtonName || "신혼여행 축하하기"}
              </button>
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== GIFT FUNDING ===== */}
        {data.showGiftFunding && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="Gift" title="기프트 펀딩" />
              {data.giftFundingMessage && (
                <p className="text-[13px] leading-[2] whitespace-pre-line mb-6" style={{ color: textMuted }}>
                  {data.giftFundingMessage}
                </p>
              )}
              {data.giftFundingButtonName && (
                <button
                  className="w-full py-3.5 rounded-[8px] text-[14px] font-bold"
                  style={{ backgroundColor: accent, color: "#fff" }}
                  data-testid="button-gift-funding"
                  onClick={() => openKakaoGift()}
                >
                  {data.giftFundingButtonName}
                </button>
              )}
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== ACCOUNT ===== */}
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
                    <p className="text-[13px]" style={{ color: textNavy }}>{acc!.bank} {acc!.account}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>{acc!.holder}</p>
                  </div>
                  <button
                    onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                    className="px-3 py-1.5 rounded-[6px] text-[11px] font-medium"
                    style={{ backgroundColor: ticketBgAlt, color: accent, border: `1px solid ${borderColor}` }}
                    data-testid={`button-copy-account-${i}`}
                  >
                    복사
                  </button>
                </div>
              ))}
            </div>
          )

          return (
            <div className="px-4 pt-6">
              <ScallopTop />
              <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
                <SectionTitle subtitle="Account" title="축의금 전달" />

                <div className="space-y-4">
                  {groomAccList.length > 0 && (
                    accStyle === "accordion" ? (
                      <div className="rounded-[8px] overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                        <button
                          onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                          className="w-full flex items-center justify-between p-4"
                          style={{ backgroundColor: ticketBgAlt }}
                          data-testid="accordion-groom"
                        >
                          <p className="text-[13px] font-medium" style={{ color: textNavy }}>신랑측 계좌번호</p>
                          <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`} style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {state.expandedAccordion === "groom" && (
                          <div className="p-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                            {renderAccList(groomAccList)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-[8px] p-4" style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}>
                        <p className="text-[11px] tracking-[0.1em] font-medium mb-3" style={{ color: accent }}>신랑측</p>
                        {renderAccList(groomAccList)}
                      </div>
                    )
                  )}

                  {brideAccList.length > 0 && (
                    accStyle === "accordion" ? (
                      <div className="rounded-[8px] overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                        <button
                          onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                          className="w-full flex items-center justify-between p-4"
                          style={{ backgroundColor: ticketBgAlt }}
                          data-testid="accordion-bride"
                        >
                          <p className="text-[13px] font-medium" style={{ color: textNavy }}>신부측 계좌번호</p>
                          <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`} style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {state.expandedAccordion === "bride" && (
                          <div className="p-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                            {renderAccList(brideAccList)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-[8px] p-4" style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}>
                        <p className="text-[11px] tracking-[0.1em] font-medium mb-3" style={{ color: accent }}>신부측</p>
                        {renderAccList(brideAccList)}
                      </div>
                    )
                  )}
                </div>
              </div>
              <ScallopBottom />
            </div>
          )
        })()}

        {/* ===== BAPTISMAL NAMES ===== */}
        {data.showBaptismalName && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="Baptismal Name" title="" />
              <div className="flex justify-center gap-12">
                <div className="space-y-1">
                  {data.baptismalGroom && <p className="text-[13px] font-medium" style={{ color: textNavy }}>{data.baptismalGroom}</p>}
                  {data.baptismalGroomFather && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalGroomFather}</p>}
                  {data.baptismalGroomMother && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalGroomMother}</p>}
                </div>
                <div className="space-y-1">
                  {data.baptismalBride && <p className="text-[13px] font-medium" style={{ color: textNavy }}>{data.baptismalBride}</p>}
                  {data.baptismalBrideFather && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalBrideFather}</p>}
                  {data.baptismalBrideMother && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalBrideMother}</p>}
                </div>
              </div>
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== GUEST SNAP ===== */}
        {data.showGuestSnap && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="Guest Snap" title="게스트 스냅" />
              {data.guestSnapContent && (
                <p className="text-[13px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textMuted }}>
                  {data.guestSnapContent}
                </p>
              )}
              <button
                className="w-full py-3 rounded-[8px] text-[13px] font-medium"
                style={{ border: `1.5px solid ${accent}`, color: accent }}
                data-testid="button-guest-snap"
              >
                사진 업로드
              </button>
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== NOTICE ===== */}
        {data.showNotice && data.noticeTitle && (
          <div className="px-4 pt-6">
            <ScallopTop />
            <div style={{ backgroundColor: ticketBg }} className="px-6 py-10 text-center">
              <SectionTitle subtitle="Notice" title="안내사항" />
              <p className="text-[15px] font-bold mb-4" style={{ color: textNavy }}>{data.noticeTitle}</p>
              {data.noticeItems?.filter(Boolean).map((item, i) => (
                <p key={i} className="text-[13px] leading-[1.8] mb-1" style={{ color: textMuted }}>{item}</p>
              ))}
            </div>
            <ScallopBottom />
          </div>
        )}

        {/* ===== ENDING ===== */}
        {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
          const eStyle = data.endingStyle || "card"
          const endTextColor = data.endingTextColor || textNavy
          return (
            <div className="px-4 pt-6">
              <ScallopTop />
              <div style={{ backgroundColor: ticketBg }} className="px-6 py-10">
                <SectionTitle subtitle="Thank You" title="감사의 말씀" />

                {eStyle === "card" && data.endingPhoto && (
                  <div className="mx-auto max-w-[260px] mb-6">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover rounded-[4px]" style={{ border: `1px solid ${borderColor}` }} />
                  </div>
                )}
                {eStyle === "card" && data.endingContent && (
                  <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textMuted }}>
                    {data.endingContent}
                  </p>
                )}

                {eStyle === "full" && data.endingPhoto && (
                  <div className="-mx-6 mb-6 relative">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "400px" }} />
                    <div className="absolute inset-0 bg-black/40" />
                    {data.endingContent && (
                      <div className="absolute inset-0 flex items-center justify-center px-8">
                        <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {eStyle === "full" && !data.endingPhoto && data.endingContent && (
                  <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textMuted }}>
                    {data.endingContent}
                  </p>
                )}

                {eStyle === "simple" && (
                  <>
                    {data.endingPhoto && (
                      <div className="-mx-6 mb-0 relative">
                        <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "360px" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {data.endingContent && (
                          <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
                            <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: endTextColor }} />
                            <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                              {data.endingContent}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {!data.endingPhoto && data.endingContent && (
                      <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textMuted }}>
                        {data.endingContent}
                      </p>
                    )}
                  </>
                )}
              </div>
              <ScallopBottom />
            </div>
          )
        })()}

        {/* ===== FOOTER ===== */}
        <div className="px-4 pt-6 pb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex-1 h-px max-w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${accentLight}40)` }} />
            <PlaneIcon size={16} color={`${ticketBg}60`} rotate={90} />
            <div className="flex-1 h-px max-w-[60px]" style={{ background: `linear-gradient(90deg, ${accentLight}40, transparent)` }} />
          </div>
          <p className="text-[10px] tracking-[0.15em]" style={{ color: `${ticketBg}80` }}>
            {data.groomName || "신랑"} & {data.brideName || "신부"}
          </p>
          <p className="text-[9px] mt-1 tracking-wider" style={{ color: `${ticketBg}40` }}>Powered by WE:BEAT</p>
        </div>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-[320px] rounded-[16px] p-6 relative" style={{ backgroundColor: ticketBg }}>
            <button
              onClick={() => state.setShowContact(false)}
              className="absolute top-4 right-4"
              data-testid="button-close-contact"
            >
              <X className="w-5 h-5" style={{ color: textMuted }} />
            </button>
            <p className="text-[16px] font-bold text-center mb-6" style={{ color: textNavy }}>연락처</p>
            <div className="space-y-4">
              {[
                { label: "신랑", phone: data.groomPhone, name: data.groomName || "신랑" },
                { label: "신부", phone: data.bridePhone, name: data.brideName || "신부" },
                ...(data.groomFather?.phone ? [{ label: "신랑측 아버지", phone: data.groomFather.phone, name: data.groomFather.name }] : []),
                ...(data.groomMother?.phone ? [{ label: "신랑측 어머니", phone: data.groomMother.phone, name: data.groomMother.name }] : []),
                ...(data.brideFather?.phone ? [{ label: "신부측 아버지", phone: data.brideFather.phone, name: data.brideFather.name }] : []),
                ...(data.brideMother?.phone ? [{ label: "신부측 어머니", phone: data.brideMother.phone, name: data.brideMother.name }] : []),
              ].filter(c => c.phone).map((contact, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px]" style={{ color: textMuted }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: textNavy }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}
                      data-testid={`button-call-${i}`}
                    >
                      <Phone className="w-4 h-4" style={{ color: accent }} />
                    </a>
                    <button
                      onClick={() => helpers.copyToClipboard(contact.phone!, "전화번호가")}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: ticketBgAlt, border: `1px solid ${borderColor}` }}
                      data-testid={`button-copy-phone-${i}`}
                    >
                      <Copy className="w-4 h-4" style={{ color: accent }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== PHOTO VIEWER ===== */}
      {state.showPhotoViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
          <button
            onClick={() => state.setShowPhotoViewer(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            data-testid="button-close-viewer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={state.galleryImages[state.viewerIndex]}
            alt={`Gallery ${state.viewerIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />
          {state.viewerIndex > 0 && (
            <button
              onClick={() => state.setViewerIndex(state.viewerIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              data-testid="button-viewer-prev"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {state.viewerIndex < state.galleryImages.length - 1 && (
            <button
              onClick={() => state.setViewerIndex(state.viewerIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              data-testid="button-viewer-next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[13px] text-white/60">{state.viewerIndex + 1} / {state.galleryImages.length}</p>
          </div>
        </div>
      )}

      {/* ===== COPIED TOAST ===== */}
      {state.copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-[13px] font-medium shadow-lg"
          style={{ backgroundColor: accent, color: "#fff" }}
        >
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
