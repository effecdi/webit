"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function MagazineLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FAFAFA"
  const darkBg = "#0C0C0C"
  const darkSurface = "#1A1A1A"
  const textPrimary = "#0C0C0C"
  const textSecondary = "#505050"
  const textTertiary = "#9A9A9A"
  const accentGold = "#C5A572"
  const buttonBg = "#0C0C0C"
  const buttonText = "#FAFAFA"
  const borderLight = "#E5E5E5"
  const cardBg = "#F0F0F0"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "Georgia, 'Times New Roman', serif")
  const condensedFont = "'Pretendard', -apple-system, sans-serif"
  const serifFont = "'Playfair Display', Georgia, 'Times New Roman', serif"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: textTertiary }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const EditorialHeading = ({ children, subtitle }: { children: string; subtitle?: string }) => (
    <div className="text-center mb-10">
      {subtitle && (
        <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: accentGold, fontFamily: serifFont }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[26px] font-bold tracking-[0.06em] uppercase leading-tight" style={{ color: textPrimary, fontFamily: condensedFont }}>
        {children}
      </h2>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: textPrimary }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: accentGold }} />
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: textPrimary }} />
      </div>
    </div>
  )

  const DarkEditorialHeading = ({ children, subtitle }: { children: string; subtitle?: string }) => (
    <div className="text-center mb-10">
      {subtitle && (
        <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: accentGold }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[26px] font-bold tracking-[0.06em] uppercase leading-tight text-white" style={{ fontFamily: condensedFont }}>
        {children}
      </h2>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: accentGold }} />
        <div className="h-px flex-1 max-w-[40px]" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
      </div>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"
  const secondPhoto = state.allPhotos.length > 1 ? state.allPhotos[1] : null
  const thirdPhoto = state.allPhotos.length > 2 ? state.allPhotos[2] : null

  return (
    <>
      {/* ===== MASTHEAD ===== */}
      <div className="py-3 text-center" style={{ backgroundColor: darkBg }}>
        <p className="text-[8px] tracking-[0.6em] uppercase" style={{ color: accentGold }}>Wedding Magazine</p>
      </div>

      {/* ===== COVER: Full dramatic photo ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "720px", backgroundColor: darkBg }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "720px" }} />
              </div>
            ) : coverStyle === "slide" ? (
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                {state.allPhotos.map((photo, i) => (
                  <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "720px" }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "720px" }} />
                  </div>
                ))}
              </div>
            ) : (
              state.allPhotos.map((photo, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                  <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "720px" }} />
                </div>
              ))
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: darkBg }}>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.2)" }}>{"\uCEE4\uBC84 \uC0AC\uC9C4\uC744 \uCD94\uAC00\uD574\uC8FC\uC138\uC694"}</p>
          </div>
        )}

        {/* Top overlay: issue/date badge */}
        <div className="absolute top-6 left-0 right-0 z-10 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/50" style={{ fontFamily: serifFont }}>
            {helpers.formatWeddingDate()}
          </p>
        </div>

        {/* Bottom overlay: Names */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 px-8 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-white/50 mb-4" style={{ fontFamily: serifFont }}>The Wedding of</p>
          <h1 className="text-[44px] leading-[1.1] text-white font-light mb-3" style={{ fontFamily: serifFont }}>
            {data.groomName || "\uC2E0\uB791"}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
            <p className="text-[16px] text-white/40" style={{ fontFamily: serifFont }}>&amp;</p>
            <div className="w-10 h-px" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
          </div>
          <h1 className="text-[44px] leading-[1.1] text-white font-light" style={{ fontFamily: serifFont }}>
            {data.brideName || "\uC2E0\uBD80"}
          </h1>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className="px-10 py-16 text-center" style={{ backgroundColor: pageBg }}>
        <EditorialHeading subtitle="Invitation">{"\uC18C\uC911\uD55C \uBD84\uB4E4\uC744 \uCD08\uB300\uD569\uB2C8\uB2E4"}</EditorialHeading>

        {data.message && (
          <p className="text-[14px] leading-[2.2] whitespace-pre-line mb-8 max-w-[300px] mx-auto" style={{ color: textSecondary, textAlign: data.messageAlign || "center", fontFamily: fontFamily }}>
            {data.message}
          </p>
        )}
      </div>

      {/* ===== EDITORIAL PHOTO SPREAD ===== */}
      {secondPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "420px" }}>
          <img src={secondPhoto} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-white/40 mb-2">Wedding Date</p>
                <p className="text-[48px] font-light leading-none text-white" style={{ fontFamily: serifFont }}>
                  {(() => {
                    const cal = helpers.getCalendarData()
                    return cal ? String(cal.weddingDay).padStart(2, '0') : ""
                  })()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] tracking-[0.15em] text-white/60" style={{ fontFamily: serifFont }}>
                  {helpers.formatWeddingDate()}
                </p>
                <p className="text-[12px] text-white/40 mt-1">{data.time || ""}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PARENTS / NAMES ===== */}
      {data.showNameAtBottom && (
        <div className="px-10 py-14 text-center" style={{ backgroundColor: pageBg }}>
          {(() => {
            const groomBlock = (
              <p className="text-[14px] leading-[2.2]" style={{ color: textPrimary, fontFamily: fontFamily }}>
                {data.groomFather?.name && (<><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>)}
                {data.groomMother?.name && (<> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>)}
                {(data.groomFather?.name || data.groomMother?.name) && (
                  <span className="text-[11px] tracking-wide" style={{ color: textTertiary }}> {data.groomRelation || "\uC544\uB4E4"} </span>
                )}
                <span className="font-semibold">{data.groomName || "\uC2E0\uB791"}</span>
              </p>
            )
            const brideBlock = (
              <p className="text-[14px] leading-[2.2]" style={{ color: textPrimary, fontFamily: fontFamily }}>
                {data.brideFather?.name && (<><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>)}
                {data.brideMother?.name && (<> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>)}
                {(data.brideFather?.name || data.brideMother?.name) && (
                  <span className="text-[11px] tracking-wide" style={{ color: textTertiary }}> {data.brideRelation || "\uB538"} </span>
                )}
                <span className="font-semibold">{data.brideName || "\uC2E0\uBD80"}</span>
              </p>
            )
            const nameStyle = data.nameDisplayStyle || "horizontal"
            const first = data.brideFirst ? brideBlock : groomBlock
            const second = data.brideFirst ? groomBlock : brideBlock
            return nameStyle === "vertical" ? (
              <div className="flex justify-center gap-14">
                <div className="space-y-1">{first}</div>
                <div className="space-y-1">{second}</div>
              </div>
            ) : (
              <div className="space-y-2">{first}{second}</div>
            )
          })()}

          <div className="mt-8">
            <button data-testid="button-contact" onClick={() => state.setShowContact(true)}
              className="px-10 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ border: `1px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}>
              연락하기
            </button>
          </div>
        </div>
      )}

      {/* ===== LOCATION - DARK SECTION ===== */}
      <div className="px-10 py-16 text-center" style={{ backgroundColor: darkBg }}>
        <DarkEditorialHeading subtitle="Location">{"\uC608\uC2DD \uC7A5\uC18C"}</DarkEditorialHeading>

        <p className="text-[13px] mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
        <p className="text-[20px] font-semibold tracking-wide mt-3 mb-1 text-white" style={{ fontFamily: fontFamily }}>
          {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` ${data.venueHall}` : ""}
        </p>
        {data.venuePhone && (
          <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>Tel. {data.venuePhone}</p>
        )}

        <div className="mt-8 mb-6 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <MapEmbed address={data.address} height={180} borderColor="rgba(255,255,255,0.1)" bgColor={darkBg} />
        </div>

        <button className="px-10 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ border: `1px solid ${accentGold}`, color: accentGold, backgroundColor: "transparent" }}
          data-testid="button-directions" onClick={() => openNaverDirections(data.address)}>
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-10 text-left space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {item.type && <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-2 text-white">{item.type}</p>}
                {item.detail && <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: "rgba(255,255,255,0.5)" }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="mt-8 text-left pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: "rgba(255,255,255,0.5)" }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <p className="text-[11px] leading-[1.8] mt-5 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
            주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
          </p>
        )}
      </div>

      {/* ===== CALENDAR & COUNTDOWN ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-10 py-16 text-center" style={{ backgroundColor: pageBg }}>
            <EditorialHeading subtitle="Save the Date">{"\uC608\uC2DD \uC77C\uC2DC"}</EditorialHeading>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-right">
                <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: textTertiary }}>{cal.year}</p>
                <p className="text-[11px] tracking-[0.15em]" style={{ color: textTertiary }}>{cal.month}월</p>
              </div>
              <div className="px-6 py-3" style={{ border: `2px solid ${textPrimary}` }}>
                <p className="text-[42px] font-bold leading-none" style={{ color: textPrimary, fontFamily: serifFont }}>{String(cal.weddingDay).padStart(2, '0')}</p>
              </div>
              <div className="text-left">
                <p className="text-[11px] tracking-[0.15em] uppercase" style={{ color: textTertiary }}>{cal.weddingDayName}요일</p>
                <p className="text-[11px] tracking-[0.15em]" style={{ color: textTertiary }}>{helpers.formatWeddingTime()}</p>
              </div>
            </div>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto" style={{ maxWidth: "300px" }}>
                <div className="w-full h-px mb-4" style={{ backgroundColor: textPrimary }} />
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[10px] py-2 text-center font-semibold tracking-wider uppercase" style={{ color: textTertiary }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2.5 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 text-[13px] font-bold text-white" style={{ backgroundColor: textPrimary }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[13px]" style={{ color: i % 7 === 0 ? "#C44" : i % 7 === 6 ? "#4A7FB5" : textPrimary }}>
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full h-px mt-4" style={{ backgroundColor: textPrimary }} />
              </div>
            )}

            {data.showCalendar && calStyle === "simple" && (
              <div className="mb-8 py-4" style={{ borderTop: `2px solid ${textPrimary}`, borderBottom: `2px solid ${textPrimary}` }}>
                <p className="text-[16px] font-semibold tracking-wide" style={{ color: textPrimary, fontFamily: fontFamily }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="mt-6">
                <p className="text-[9px] tracking-[0.5em] uppercase mb-5" style={{ color: accentGold }}>Countdown</p>
                <div className="flex items-center justify-center gap-3">
                  {[
                    { label: "DAYS", value: state.countdown.days },
                    { label: "HRS", value: state.countdown.hours },
                    { label: "MIN", value: state.countdown.minutes },
                    { label: "SEC", value: state.countdown.seconds },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="text-center w-14 py-3" style={{ border: `1px solid ${borderLight}` }}>
                        <p className="text-[24px] font-light leading-none" style={{ color: textPrimary, fontFamily: serifFont }}>
                          {String(item.value).padStart(2, "0")}
                        </p>
                        <p className="text-[7px] tracking-[0.2em] mt-2" style={{ color: textTertiary }}>{item.label}</p>
                      </div>
                      {idx < 3 && <span className="text-[10px]" style={{ color: borderLight }}>:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== Mid photo divider ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
          <img src={data.midPhoto} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {!data.showMidPhoto && thirdPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "320px" }}>
          <img src={thirdPhoto} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div style={{ backgroundColor: pageBg }}>
          <div className="px-10 pt-16 pb-6 text-center">
            <EditorialHeading subtitle="Photo Story">Gallery</EditorialHeading>
          </div>

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <>
              <div className="grid grid-cols-2 gap-[2px]">
                {state.galleryImages.map((img, index) => (
                  <div key={index} className="aspect-square cursor-pointer overflow-hidden relative group"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}>
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px flex-1 max-w-[30px]" style={{ backgroundColor: borderLight }} />
                <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: textTertiary }}>{state.galleryImages.length} Photos</p>
                <div className="h-px flex-1 max-w-[30px]" style={{ backgroundColor: borderLight }} />
              </div>
            </>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-[2px]">
                {state.galleryImages.map((img, index) => (
                  <div key={index} className="w-[200px] h-[260px] flex-shrink-0 cursor-pointer overflow-hidden relative group"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}>
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="h-12" />
        </div>
      )}

      {/* ===== RSVP - DARK ===== */}
      {data.showRsvp && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: darkBg }}>
          <DarkEditorialHeading subtitle="Attendance">R.S.V.P</DarkEditorialHeading>

          <p className="text-[13px] leading-[1.9] mb-8 max-w-[280px] mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: fontFamily }}>
            {data.rsvpContent || "\uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC2DC\uBA74 \uAC10\uC0AC\uD558\uACA0\uC2B5\uB2C8\uB2E4"}
          </p>

          <button className="px-12 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ backgroundColor: accentGold, color: darkBg, border: "none" }}
            data-testid="button-rsvp" onClick={() => onRsvpClick?.()}>
            {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-10 py-16" style={{ backgroundColor: pageBg }}>
          <EditorialHeading subtitle="Messages">{"\uBC29\uBA85\uB85D"}</EditorialHeading>

          <div className="space-y-3 mb-8">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: "#FFF", border: `1px solid ${borderLight}` }}>
                  <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <div className="w-full h-px mb-2" style={{ backgroundColor: borderLight }} />
                  <p className="text-[11px] font-semibold tracking-[0.1em]" style={{ color: textPrimary }}>{entry.name}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center" style={{ backgroundColor: "#FFF", border: `1px solid ${borderLight}` }}>
                <p className="text-[13px]" style={{ color: textTertiary }}>축하 메시지를 남겨주세요</p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: "#FFF", border: `1px solid ${borderLight}` }}>
              <input type="text" value={state.guestbookName} onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름" className="w-full py-2.5 px-4 text-[13px] mb-3 outline-none"
                style={{ border: `1px solid ${borderLight}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-name" />
              <textarea value={state.guestbookMessage} onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요" rows={4}
                className="w-full py-2.5 px-4 text-[13px] mb-4 outline-none resize-none"
                style={{ border: `1px solid ${borderLight}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-message" />
              <div className="flex gap-3">
                <button onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 text-[11px] font-semibold tracking-wider uppercase"
                  style={{ border: `1px solid ${textPrimary}`, color: textPrimary }}
                  data-testid="button-guestbook-cancel">취소</button>
                <button onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[11px] font-semibold tracking-wider uppercase"
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid="button-guestbook-submit">등록</button>
              </div>
            </div>
          ) : (
            <button onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3 text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ border: `1px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write">작성하기</button>
          )}
        </div>
      )}

      {/* ===== FUNDING - DARK ===== */}
      {data.showFunding && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: darkSurface }}>
          <DarkEditorialHeading subtitle="Wedding Fund">{"\uCD95\uD558 \uD380\uB529"}</DarkEditorialHeading>

          {data.fundingMessage && (
            <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-8 max-w-[280px] mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: fontFamily }}>
              {data.fundingMessage}
            </p>
          )}

          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-8">
              <div className="w-[200px] h-[200px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}

          <button className="px-12 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ backgroundColor: accentGold, color: darkBg }}
            data-testid="button-funding" onClick={() => openKakaoTransfer()}>
            {data.fundingButtonName || "\uC2E0\uD63C\uC5EC\uD589 \uCD95\uD558\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: pageBg }}>
          <EditorialHeading subtitle="Gift">{"\uAE30\uD504\uD2B8 \uD380\uB529"}</EditorialHeading>
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-8" style={{ color: textSecondary, fontFamily: fontFamily }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button className="px-12 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-gift-funding" onClick={() => openKakaoGift()}>
              {data.giftFundingButtonName}
            </button>
          )}
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
          <div className="space-y-4">
            {list.map((acc, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div>
                  <p className="text-[13px] font-medium" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textTertiary }}>{acc!.holder}</p>
                </div>
                <button onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase"
                  style={{ border: `1px solid ${textPrimary}`, color: textPrimary }}
                  data-testid={`button-copy-account-${i}`}>복사</button>
              </div>
            ))}
          </div>
        )
        return (
          <div className="px-10 py-16" style={{ backgroundColor: pageBg }}>
            <EditorialHeading subtitle="Account">{"\uCD95\uC758\uAE08 \uC804\uB2EC"}</EditorialHeading>
            <p className="text-[13px] text-center mb-8" style={{ color: textSecondary }}>축하의 마음을 전해주세요</p>
            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1px solid ${textPrimary}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-groom">
                      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: textPrimary }}>신랑측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderLight}` }}>{renderAccList(groomAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: "#FFF", border: `1px solid ${borderLight}` }}>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accentGold }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}
              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1px solid ${textPrimary}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-bride">
                      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: textPrimary }}>신부측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderLight}` }}>{renderAccList(brideAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: "#FFF", border: `1px solid ${borderLight}` }}>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: accentGold }}>신부측</p>
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
        <div className="px-10 py-12 text-center" style={{ backgroundColor: cardBg }}>
          <EditorialHeading subtitle="Baptismal Name">세례명</EditorialHeading>
          <div className="flex justify-center gap-14">
            <div className="space-y-1">
              {data.baptismalGroom && <p className="text-[13px] font-semibold" style={{ color: textPrimary }}>{data.baptismalGroom}</p>}
              {data.baptismalGroomFather && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalGroomFather}</p>}
              {data.baptismalGroomMother && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalGroomMother}</p>}
            </div>
            <div className="space-y-1">
              {data.baptismalBride && <p className="text-[13px] font-semibold" style={{ color: textPrimary }}>{data.baptismalBride}</p>}
              {data.baptismalBrideFather && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalBrideFather}</p>}
              {data.baptismalBrideMother && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalBrideMother}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: pageBg }}>
          <EditorialHeading subtitle="Guest Snap">{"\uAC8C\uC2A4\uD2B8 \uC2A4\uB0C5"}</EditorialHeading>
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.9] mb-8" style={{ color: textSecondary }}>{data.guestSnapContent}</p>
          )}
          <button className="px-10 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase"
            style={{ border: `1px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}
            data-testid="button-guest-snap">사진 업로드</button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: cardBg }}>
          <EditorialHeading subtitle="Notice">{data.noticeTitle}</EditorialHeading>
          <div className="max-w-[280px] mx-auto">
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] leading-[1.9] mb-1" style={{ color: textSecondary }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || "#FFFFFF"
        return (
          <>
            {(eStyle === "full" || eStyle === "simple") && data.endingPhoto ? (
              <div className="relative w-full overflow-hidden" style={{ minHeight: "440px" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: "440px" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }} />
                <div className="relative z-10 flex flex-col items-center justify-end px-10 pb-12" style={{ minHeight: "440px" }}>
                  {data.endingContent && (
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line mb-6" style={{ color: endTextColor, fontFamily: fontFamily }}>
                      {data.endingContent}
                    </p>
                  )}
                  <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Thank You</p>
                  <p className="text-[30px] font-light text-white" style={{ fontFamily: serifFont }}>
                    {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-10 py-16 text-center" style={{ backgroundColor: pageBg }}>
                {data.endingPhoto && (
                  <div className="mx-auto max-w-[280px] mb-8 overflow-hidden">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
                  </div>
                )}
                {data.endingContent && (
                  <p className="text-[14px] leading-[2.2] whitespace-pre-line mb-8 max-w-[280px] mx-auto" style={{ color: textSecondary, fontFamily: fontFamily }}>
                    {data.endingContent}
                  </p>
                )}
                <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: accentGold }}>Thank You</p>
                <p className="text-[28px] font-light" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
                </p>
              </div>
            )}
          </>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-10 pb-10 pt-6 text-center" style={{ backgroundColor: pageBg }}>
        <button onClick={helpers.copyLink}
          className="w-full py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ border: `1px solid ${borderLight}`, color: textSecondary }}
          data-testid="button-copy-link">
          링크 복사
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-10 pb-10 pt-2 text-center" style={{ backgroundColor: pageBg }}>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[30px]" style={{ backgroundColor: borderLight }} />
          <div className="w-1 h-1 rotate-45" style={{ backgroundColor: accentGold }} />
          <div className="h-px flex-1 max-w-[30px]" style={{ backgroundColor: borderLight }} />
        </div>
        <p className="text-[9px] tracking-[0.5em] uppercase mt-4" style={{ color: textTertiary }}>WE:BEAT</p>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-[320px] p-7 relative" style={{ backgroundColor: "#FFF" }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-4 right-4" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textTertiary }} />
            </button>
            <div className="mb-6">
              <p className="text-[9px] tracking-[0.4em] uppercase mb-2" style={{ color: accentGold }}>Get in Touch</p>
              <p className="text-[18px] font-bold tracking-[0.1em] uppercase" style={{ color: textPrimary }}>Contact</p>
            </div>
            <div className="space-y-5">
              {[
                { label: "\uC2E0\uB791", phone: data.groomPhone, name: data.groomName || "\uC2E0\uB791" },
                { label: "\uC2E0\uBD80", phone: data.bridePhone, name: data.brideName || "\uC2E0\uBD80" },
                ...(data.groomFather?.phone ? [{ label: "\uC2E0\uB791\uCE21 \uC544\uBC84\uC9C0", phone: data.groomFather.phone, name: data.groomFather.name }] : []),
                ...(data.groomMother?.phone ? [{ label: "\uC2E0\uB791\uCE21 \uC5B4\uBA38\uB2C8", phone: data.groomMother.phone, name: data.groomMother.name }] : []),
                ...(data.brideFather?.phone ? [{ label: "\uC2E0\uBD80\uCE21 \uC544\uBC84\uC9C0", phone: data.brideFather.phone, name: data.brideFather.name }] : []),
                ...(data.brideMother?.phone ? [{ label: "\uC2E0\uBD80\uCE21 \uC5B4\uBA38\uB2C8", phone: data.brideMother.phone, name: data.brideMother.name }] : []),
              ].filter(c => c.phone).map((contact, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-wider uppercase" style={{ color: textTertiary }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${textPrimary}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-4 h-4" style={{ color: textPrimary }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")}
                      className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${textPrimary}` }} data-testid={`button-copy-phone-${i}`}>
                      <Copy className="w-4 h-4" style={{ color: textPrimary }} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.95)" }}>
          <button onClick={() => state.setShowPhotoViewer(false)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-close-viewer">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={state.galleryImages[state.viewerIndex]} alt={`Gallery ${state.viewerIndex + 1}`} className="max-w-full max-h-[80vh] object-contain" />
          {state.viewerIndex > 0 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-viewer-prev">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {state.viewerIndex < state.galleryImages.length - 1 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-viewer-next">
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[13px] font-medium shadow-lg"
          style={{ backgroundColor: buttonBg, color: buttonText }}>
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
