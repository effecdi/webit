"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

const WaxSeal = ({ color = "#8B7355" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="16" fill={color} />
    <circle cx="20" cy="20" r="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
    <path d="M20 12L21.5 17H26.5L22.5 20L24 25L20 22L16 25L17.5 20L13.5 17H18.5L20 12Z" fill="rgba(255,255,255,0.25)" />
  </svg>
)

export function ChatLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#F5F1EB"
  const envelopeBg = "#4A5740"
  const envelopeDark = "#3D4A35"
  const textPrimary = "#2E2E28"
  const textSecondary = "#6B6B60"
  const textTertiary = "#9E9E90"
  const textOnGreen = "#F0EDE6"
  const accent = "#5C6B4E"
  const accentGold = "#B8A080"
  const buttonBg = "#4A5740"
  const buttonText = "#F5F1EB"
  const borderColor = "#D8D2C6"
  const cardBg = "#FEFDFB"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "'Caveat', 'Dancing Script', cursive")
  const serifFont = "'Playfair Display', 'Noto Serif KR', Georgia, serif"
  const scriptFont = `${englishFont}, 'Caveat', 'Dancing Script', 'Great Vibes', cursive`

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accentGold }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const SectionTitle = ({ title, subtitle, light }: { title: string; subtitle?: string; light?: boolean }) => (
    <div className="mb-8 text-center">
      {subtitle && (
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: light ? "rgba(240,237,230,0.5)" : accentGold, fontFamily: serifFont }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[22px] leading-tight tracking-wide" style={{ color: light ? textOnGreen : textPrimary, fontFamily: serifFont }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="h-px w-10" style={{ backgroundColor: light ? "rgba(240,237,230,0.2)" : borderColor }} />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3L4 0Z" fill={light ? "rgba(240,237,230,0.3)" : accentGold} />
        </svg>
        <div className="h-px w-10" style={{ backgroundColor: light ? "rgba(240,237,230,0.2)" : borderColor }} />
      </div>
    </div>
  )

  const ElegantDivider = () => (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="w-12 h-px" style={{ backgroundColor: borderColor }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1C5 4 2 6 2 9a6 6 0 0 0 12 0c0-3-3-5-6-8z" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="0.6" />
      </svg>
      <div className="w-12 h-px" style={{ backgroundColor: borderColor }} />
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== ENVELOPE HERO ===== */}
      <div className="relative" style={{ backgroundColor: envelopeBg }}>
        {/* Envelope flap */}
        <svg className="w-full" viewBox="0 0 400 110" preserveAspectRatio="none" style={{ display: "block" }}>
          <path d="M0,0 L200,95 L400,0 L400,0 L0,0 Z" fill={envelopeDark} />
          <path d="M0,0 L200,95 L400,0" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </svg>

        <div className="text-center pb-12 px-10 -mt-2">
          {/* Wax seal */}
          <div className="flex justify-center mb-5">
            <WaxSeal color={accentGold} />
          </div>

          {/* Names */}
          <div className="mb-6">
            <p className="text-[30px] leading-[1.4] tracking-wider" style={{ color: textOnGreen, fontFamily: serifFont }}>
              {data.groomName || "\uC2E0\uB791"}
            </p>
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="w-8 h-px" style={{ backgroundColor: "rgba(240,237,230,0.2)" }} />
              <p className="text-[14px] tracking-wider" style={{ color: "rgba(240,237,230,0.4)", fontFamily: serifFont }}>&amp;</p>
              <div className="w-8 h-px" style={{ backgroundColor: "rgba(240,237,230,0.2)" }} />
            </div>
            <p className="text-[30px] leading-[1.4] tracking-wider" style={{ color: textOnGreen, fontFamily: serifFont }}>
              {data.brideName || "\uC2E0\uBD80"}
            </p>
          </div>

          {/* Date */}
          <p className="text-[12px] tracking-[0.2em]" style={{ color: "rgba(240,237,230,0.6)", fontFamily: serifFont }}>
            {helpers.formatWeddingDate()}{data.time ? ` \u00B7 ${data.time}` : ""}
          </p>
        </div>

        {/* Bottom envelope edge */}
        <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
      </div>

      {/* ===== PHOTO ===== */}
      <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
        {state.allPhotos.length > 0 ? (
          <div className="relative mx-auto max-w-[340px]">
            <div className="p-3 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                {coverStyle === "static" ? (
                  <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" />
                ) : coverStyle === "slide" ? (
                  <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                    {state.allPhotos.map((photo, i) => (
                      <div key={i} className="w-full h-full flex-shrink-0">
                        <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  state.allPhotos.map((photo, i) => (
                    <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                      <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                )}
              </div>
            </div>
            {state.allPhotos.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {state.allPhotos.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ backgroundColor: state.currentSlide === i ? accent : borderColor }} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-[340px] aspect-[4/5] flex items-center justify-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <p className="text-[14px]" style={{ color: textTertiary }}>{"\uCEE4\uBC84 \uC0AC\uC9C4\uC744 \uCD94\uAC00\uD574\uC8FC\uC138\uC694"}</p>
          </div>
        )}
      </div>

      {/* ===== INVITATION ===== */}
      <div className="px-10 py-12" style={{ backgroundColor: pageBg }}>
        <SectionTitle title="초대합니다" subtitle="INVITATION" />

        {data.invitationTitle && (
          <p className="text-[14px] text-center font-medium mb-5 tracking-wide" style={{ color: textPrimary, fontFamily: fontFamily }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p className="text-[13.5px] leading-[2.2] whitespace-pre-line mb-8" style={{ color: textSecondary, textAlign: data.messageAlign || "center", fontFamily: fontFamily }}>
            {data.message}
          </p>
        )}

        <ElegantDivider />

        {data.showNameAtBottom && (() => {
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
            <div className="text-center mb-8">
              <div className="flex justify-center gap-14">
                <div className="space-y-1">{first}</div>
                <div className="space-y-1">{second}</div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 mb-8">{first}{second}</div>
          )
        })()}

        <div className="text-center">
          <button data-testid="button-contact" onClick={() => state.setShowContact(true)}
            className="px-10 py-3 text-[12px] tracking-[0.15em] transition-colors"
            style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}>
            연락하기
          </button>
        </div>
      </div>

      {/* ===== CALENDAR & COUNTDOWN ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-8 py-12 text-center" style={{ backgroundColor: pageBg }}>
            <SectionTitle title={`${cal.year}.${String(cal.month).padStart(2, '0')}`} subtitle="WEDDING DAY" />

            {/* Elegant date display */}
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.2em]" style={{ color: textTertiary, fontFamily: serifFont }}>{cal.weddingDayName}요일</p>
              </div>
              <div className="text-center px-5 py-2" style={{ borderLeft: `1px solid ${borderColor}`, borderRight: `1px solid ${borderColor}` }}>
                <p className="text-[38px] font-light leading-none" style={{ color: accent, fontFamily: serifFont }}>{cal.weddingDay}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] tracking-[0.2em]" style={{ color: textTertiary, fontFamily: serifFont }}>{helpers.formatWeddingTime()}</p>
              </div>
            </div>

            {data.showCountdown && (
              <div className="mb-8">
                <p className="text-[9px] tracking-[0.4em] mb-4" style={{ color: textTertiary }}>D-DAY</p>
                <div className="flex items-center justify-center gap-2">
                  {[
                    { label: "DAYS", value: state.countdown.days },
                    { label: "HRS", value: state.countdown.hours },
                    { label: "MIN", value: state.countdown.minutes },
                    { label: "SEC", value: state.countdown.seconds },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="text-center w-14 py-3" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                        <p className="text-[22px] font-light leading-none tracking-wide" style={{ color: textPrimary, fontFamily: serifFont }}>
                          {String(item.value).padStart(2, "0")}
                        </p>
                        <p className="text-[7px] mt-1.5 tracking-[0.2em]" style={{ color: textTertiary }}>{item.label}</p>
                      </div>
                      {idx < 3 && <span className="text-[10px]" style={{ color: borderColor }}>:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.showCalendar && calStyle === "full" && (
              <div className="mx-auto max-w-[300px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[10px] py-2 text-center font-medium tracking-wide" style={{ color: textTertiary }}>{d}</div>
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
                          <span className="text-[13px]" style={{ color: i % 7 === 0 ? "#C4887A" : i % 7 === 6 ? "#8A9AB5" : textPrimary }}>
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
              <div className="mb-4 py-4 mx-auto" style={{ maxWidth: "260px", borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                <p className="text-[15px] tracking-wide" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION ===== */}
      <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
        <SectionTitle title="오시는 길" subtitle="LOCATION" />

        <div className="text-center mb-6">
          <p className="text-[17px] font-semibold mb-1" style={{ color: textPrimary, fontFamily: fontFamily }}>
            {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[13px]" style={{ color: textSecondary }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
          {data.venuePhone && <p className="text-[12px] mt-1" style={{ color: textTertiary }}>Tel. {data.venuePhone}</p>}
        </div>

        <div className="my-6 overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
          <MapEmbed address={data.address} height={180} borderColor={borderColor} bgColor={pageBg} />
        </div>

        <div className="text-center mb-4">
          <button className="px-10 py-3 text-[12px] tracking-[0.15em] transition-colors"
            style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
            data-testid="button-directions" onClick={() => openNaverDirections(data.address)}>
            길찾기
          </button>
        </div>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-8 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                {item.type && <p className="text-[12px] font-semibold mb-1.5 tracking-wide" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
            <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <p className="text-[11px] leading-[1.8] mt-4 text-center" style={{ color: textTertiary }}>
            주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
          </p>
        )}
      </div>

      {/* ===== MID PHOTO ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="w-full">
          <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" style={{ maxHeight: "400px" }} />
        </div>
      )}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-12" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="Gallery" subtitle="OUR MOMENTS" />
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
              <div className="flex items-center justify-center gap-3 mt-5">
                <div className="h-px flex-1 max-w-[25px]" style={{ backgroundColor: borderColor }} />
                <p className="text-[9px] tracking-[0.3em]" style={{ color: textTertiary }}>{state.galleryImages.length} PHOTOS</p>
                <div className="h-px flex-1 max-w-[25px]" style={{ backgroundColor: borderColor }} />
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
        </div>
      )}

      {/* ===== RSVP ===== */}
      {data.showRsvp && (
        <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="참석 여부" subtitle="R.S.V.P" />

          <p className="text-[13px] text-center mb-8 leading-[1.9]" style={{ color: textSecondary, fontFamily: fontFamily }}>
            {data.rsvpContent || "\uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC2DC\uBA74 \uAC10\uC0AC\uD558\uACA0\uC2B5\uB2C8\uB2E4"}
          </p>

          <div className="text-center">
            <button className="px-12 py-3.5 text-[12px] tracking-[0.15em] transition-colors"
              style={{ backgroundColor: accent, color: "#FFF", border: "none" }}
              data-testid="button-rsvp" onClick={() => onRsvpClick?.()}>
              {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
            </button>
          </div>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="방명록" subtitle="GUESTBOOK" />

          <div className="space-y-3 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <p className="text-[11px] text-right tracking-wide" style={{ color: textTertiary }}>- {entry.name}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <p className="text-[13px]" style={{ color: textTertiary }}>축하 메시지를 남겨주세요</p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <input type="text" value={state.guestbookName} onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름" className="w-full py-2.5 px-4 text-[13px] mb-3 outline-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-name" />
              <textarea value={state.guestbookMessage} onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요" rows={4}
                className="w-full py-2.5 px-4 text-[13px] mb-4 outline-none resize-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-message" />
              <div className="flex gap-3">
                <button onClick={() => state.setShowGuestbookForm(false)} className="flex-1 py-2.5 text-[12px] tracking-wide"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }} data-testid="button-guestbook-cancel">취소</button>
                <button onClick={helpers.submitGuestbook} className="flex-1 py-2.5 text-[12px] tracking-wide"
                  style={{ backgroundColor: accent, color: "#FFF" }} data-testid="button-guestbook-submit">등록</button>
              </div>
            </div>
          ) : (
            <button onClick={() => state.setShowGuestbookForm(true)} className="w-full py-3 text-[12px] tracking-[0.15em]"
              style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write">작성하기</button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-8 py-4" style={{ backgroundColor: pageBg }}>
          <div className="py-10 px-8 text-center" style={{ backgroundColor: envelopeBg }}>
            <SectionTitle title="축하 펀딩" subtitle="WEDDING FUND" light />
            {data.fundingMessage && (
              <p className="text-[12.5px] leading-[1.9] whitespace-pre-line mb-8" style={{ color: "rgba(240,237,230,0.75)", fontFamily: fontFamily }}>{data.fundingMessage}</p>
            )}
            {data.fundingImageType === "custom" && data.fundingImage && (
              <div className="flex justify-center mb-8">
                <div className="w-[180px] h-[180px] p-2 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid rgba(255,255,255,0.1)` }}>
                  <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
                </div>
              </div>
            )}
            <button className="px-12 py-3 text-[12px] tracking-[0.15em] transition-colors"
              style={{ border: `1px solid rgba(240,237,230,0.4)`, color: textOnGreen, backgroundColor: "transparent" }}
              data-testid="button-funding" onClick={() => openKakaoTransfer()}>
              {data.fundingButtonName || "\uCD95\uC758\uAE08 \uBCF4\uB0B4\uAE30"}
            </button>
          </div>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-12 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="기프트 펀딩" subtitle="GIFT" />
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-8" style={{ color: textSecondary, fontFamily: fontFamily }}>{data.giftFundingMessage}</p>
          )}
          {data.giftFundingButtonName && (
            <button className="px-12 py-3.5 text-[12px] tracking-[0.15em]"
              style={{ backgroundColor: accent, color: "#FFF" }}
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
                  <p className="text-[13px]" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textTertiary }}>{acc!.holder}</p>
                </div>
                <button onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-4 py-1.5 text-[10px] tracking-wide"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                  data-testid={`button-copy-account-${i}`}>복사</button>
              </div>
            ))}
          </div>
        )
        return (
          <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
            <SectionTitle title="축의금 전달" subtitle="ACCOUNT" />
            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-groom">
                      <p className="text-[13px] font-semibold tracking-wide" style={{ color: textPrimary }}>신랑측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderColor}` }}>{renderAccList(groomAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <p className="text-[11px] font-semibold mb-4 tracking-[0.15em]" style={{ color: accent }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}
              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-bride">
                      <p className="text-[13px] font-semibold tracking-wide" style={{ color: textPrimary }}>신부측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textTertiary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderColor}` }}>{renderAccList(brideAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <p className="text-[11px] font-semibold mb-4 tracking-[0.15em]" style={{ color: accent }}>신부측</p>
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
        <div className="px-8 py-10 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="세례명" subtitle="BAPTISMAL NAME" />
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
        <div className="px-8 py-12 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="게스트 스냅" subtitle="GUEST SNAP" />
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.9] mb-8" style={{ color: textSecondary }}>{data.guestSnapContent}</p>
          )}
          <button className="px-10 py-3 text-[12px] tracking-[0.15em]"
            style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
            data-testid="button-guest-snap">사진 업로드</button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={data.noticeTitle} subtitle="NOTICE" />
          <div className="text-center">
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] leading-[1.9] mb-1" style={{ color: textSecondary }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        return (
          <div className="py-12" style={{ backgroundColor: pageBg }}>
            <div className="px-10 text-center mb-8">
              <p className="text-[10px] tracking-[0.4em] mb-6" style={{ color: textTertiary, fontFamily: serifFont }}>THANK YOU</p>
            </div>

            {data.endingContent && (
              <p className="text-[13px] leading-[2.2] text-center whitespace-pre-line mb-8 px-10" style={{ color: textSecondary, fontFamily: fontFamily }}>
                {data.endingContent}
              </p>
            )}

            {data.endingPhoto && (
              <div className="mx-auto max-w-[280px] px-8 mb-8">
                <div className="p-3 shadow-sm" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
                </div>
              </div>
            )}

            <ElegantDivider />

            <div className="px-10 text-center">
              <p className="text-[22px] tracking-wider" style={{ color: textPrimary, fontFamily: serifFont }}>
                {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
              </p>
            </div>
          </div>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-8 pb-8 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <button onClick={helpers.copyLink} className="w-full py-3.5 text-[12px] tracking-[0.15em]"
          style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
          data-testid="button-copy-link">
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="pb-10 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-10" style={{ backgroundColor: borderColor }} />
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M3 0C2 2 0 3 0 4a3 3 0 0 0 6 0c0-1-1-2-3-4z" fill={accent} fillOpacity="0.2" />
          </svg>
          <div className="h-px w-10" style={{ backgroundColor: borderColor }} />
        </div>
        <p className="text-[9px] tracking-[0.4em] mt-3" style={{ color: textTertiary }}>WE:BEAT</p>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-[320px] p-7 relative" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-4 right-4" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textTertiary }} />
            </button>
            <SectionTitle title="연락하기" subtitle="CONTACT" />
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
                    <p className="text-[10px] tracking-wide" style={{ color: textTertiary }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${borderColor}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-3.5 h-3.5" style={{ color: textSecondary }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")}
                      className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${borderColor}` }} data-testid={`button-copy-phone-${i}`}>
                      <Copy className="w-3.5 h-3.5" style={{ color: textSecondary }} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.92)" }}>
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[13px] shadow-lg"
          style={{ backgroundColor: buttonBg, color: buttonText }}>
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
