"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

const ElegantDivider = ({ color = "#D4C5B9" }: { color?: string }) => (
  <div className="flex items-center justify-center gap-3 py-2">
    <div className="h-px w-12" style={{ backgroundColor: color }} />
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill={color} />
    </svg>
    <div className="h-px w-12" style={{ backgroundColor: color }} />
  </div>
)

const LeafDivider = ({ color = "#C5BFB5" }: { color?: string }) => (
  <div className="flex justify-center py-4">
    <svg width="140" height="24" viewBox="0 0 140 24" fill="none" stroke={color} strokeWidth="0.8">
      <path d="M0,12 Q35,12 50,8 Q55,7 60,8 Q65,5 70,12 Q75,5 80,8 Q85,7 90,8 Q105,12 140,12" />
      <path d="M55,8 Q58,2 65,5" />
      <path d="M75,5 Q82,2 85,8" />
      <path d="M60,8 Q63,4 70,6" fill={color} fillOpacity="0.15" />
      <path d="M70,6 Q77,4 80,8" fill={color} fillOpacity="0.15" />
      <circle cx="70" cy="12" r="1.5" fill={color} />
    </svg>
  </div>
)

export function PolaroidLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FAF8F5"
  const cardBg = "#FFFFFF"
  const textPrimary = "#2C2720"
  const textSecondary = "#6B6560"
  const textTertiary = "#A09A92"
  const accent = "#C9A88C"
  const accentLight = "#E8DDD3"
  const buttonBg = "#2C2720"
  const buttonText = "#FAF8F5"
  const borderColor = "#E5DFD8"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "'Caveat', 'Dancing Script', cursive")
  const scriptFont = `${englishFont}, 'Caveat', 'Dancing Script', 'Great Vibes', cursive`
  const serifFont = "'Playfair Display', 'Noto Serif KR', Georgia, serif"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-8">
      {subtitle && (
        <p className="text-[11px] tracking-[0.25em] uppercase mb-2" style={{ color: accent, fontFamily: serifFont }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[22px] leading-tight tracking-wide" style={{ color: textPrimary, fontFamily: serifFont }}>
        {title}
      </h2>
      <div className="mt-3">
        <ElegantDivider color={accentLight} />
      </div>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO: Illustration cover ===== */}
      <div className="relative text-center" style={{ backgroundColor: pageBg }}>
        {/* Top elegant border */}
        <div className="pt-10 pb-6 px-8">
          <div className="relative mx-auto" style={{ maxWidth: "340px" }}>
            {/* Ornamental corner frame */}
            <svg className="absolute -top-2 -left-2 w-10 h-10" viewBox="0 0 40 40" fill="none" stroke={accent} strokeWidth="0.8">
              <path d="M2,20 L2,4 Q2,2 4,2 L20,2" />
              <path d="M6,15 L6,6 L15,6" strokeWidth="0.5" />
            </svg>
            <svg className="absolute -top-2 -right-2 w-10 h-10" viewBox="0 0 40 40" fill="none" stroke={accent} strokeWidth="0.8">
              <path d="M20,2 L36,2 Q38,2 38,4 L38,20" />
              <path d="M25,6 L34,6 L34,15" strokeWidth="0.5" />
            </svg>

            {/* Script heading */}
            <p className="text-[13px] leading-[2.2] tracking-[0.1em] whitespace-pre-line mb-2" style={{ color: textSecondary, fontFamily: fontFamily }}>
              {data.invitationTitle || "소중한 분들을 초대합니다"}
            </p>

            {/* Illustration couple - hero size */}
            <div className="flex justify-center my-6">
              <img
                src="/illustration-couple.png"
                alt="Couple illustration"
                className="w-full h-auto object-contain"
                style={{ maxWidth: "340px", mixBlendMode: 'multiply' }}
              />
            </div>

            {/* Names */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[28px] tracking-wider" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {data.groomName || "\uC2E0\uB791"}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill={accent} />
                </svg>
                <span className="text-[28px] tracking-wider" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {data.brideName || "\uC2E0\uBD80"}
                </span>
              </div>
            </div>

            {/* Date */}
            <p className="text-[12px] tracking-[0.2em] mb-2" style={{ color: textSecondary, fontFamily: serifFont }}>
              {helpers.formatWeddingDate()}{data.time ? ` \u00B7 ${data.time}` : ""}
            </p>

            {/* Bottom ornamental corners */}
            <svg className="absolute -bottom-2 -left-2 w-10 h-10" viewBox="0 0 40 40" fill="none" stroke={accent} strokeWidth="0.8">
              <path d="M2,20 L2,36 Q2,38 4,38 L20,38" />
              <path d="M6,25 L6,34 L15,34" strokeWidth="0.5" />
            </svg>
            <svg className="absolute -bottom-2 -right-2 w-10 h-10" viewBox="0 0 40 40" fill="none" stroke={accent} strokeWidth="0.8">
              <path d="M20,38 L36,38 Q38,38 38,36 L38,20" />
              <path d="M25,34 L34,34 L34,25" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        <LeafDivider color={accentLight} />
      </div>

      {/* ===== PHOTOS ===== */}
      {state.allPhotos.length > 0 && (
        <div className="px-8 py-8" style={{ backgroundColor: pageBg }}>
          <div className="flex justify-center items-start gap-5">
            <div className="bg-white p-2.5 shadow-sm" style={{ transform: "rotate(-2deg)", border: `1px solid ${borderColor}` }}>
              <div className="w-[130px] h-[160px] overflow-hidden">
                <img src={state.allPhotos[0]} alt="Photo 1" className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] text-center mt-2 tracking-[0.15em]" style={{ color: textTertiary, fontFamily: scriptFont }}>our moment</p>
            </div>
            {state.allPhotos.length > 1 && (
              <div className="bg-white p-2.5 shadow-sm mt-4" style={{ transform: "rotate(2.5deg)", border: `1px solid ${borderColor}` }}>
                <div className="w-[130px] h-[160px] overflow-hidden">
                  <img src={state.allPhotos[1]} alt="Photo 2" className="w-full h-full object-cover" />
                </div>
                <p className="text-[9px] text-center mt-2 tracking-[0.15em]" style={{ color: textTertiary, fontFamily: scriptFont }}>forever</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== INVITATION MESSAGE ===== */}
      <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
        <SectionTitle title="초대합니다" subtitle="INVITATION" />

        {data.message && (
          <p className="text-[13.5px] leading-[2.2] whitespace-pre-line text-center mb-8" style={{ color: textSecondary, textAlign: data.messageAlign || "center", fontFamily: fontFamily }}>
            {data.message}
          </p>
        )}

        <LeafDivider color={accentLight} />
      </div>

      {/* ===== Parents info ===== */}
      {data.showNameAtBottom && (
        <div className="px-8 py-8 text-center" style={{ backgroundColor: pageBg }}>
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
              className="px-10 py-3 text-[12px] tracking-[0.15em] transition-colors"
              style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
            >
              연락하기
            </button>
          </div>
        </div>
      )}

      {/* ===== CALENDAR ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-8 py-12" style={{ backgroundColor: pageBg }}>
            <SectionTitle title={`${cal.year}.${String(cal.month).padStart(2, '0')}`} subtitle="WEDDING DAY" />

            <p className="text-[13px] text-center mb-6 tracking-wide" style={{ color: textSecondary, fontFamily: fontFamily }}>
              {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
            </p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-6 mx-auto p-5" style={{ maxWidth: "300px", backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
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
              <div className="text-center mb-6 py-4 mx-auto" style={{ maxWidth: "260px", borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                <p className="text-[15px] tracking-wide" style={{ color: textPrimary, fontFamily: serifFont }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="mt-6 flex items-center justify-center gap-2">
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
                    {idx < 3 && <span className="text-[10px]" style={{ color: accentLight }}>:</span>}
                  </div>
                ))}
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

        <div className="text-center">
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
        <div className="px-10 py-6" style={{ backgroundColor: pageBg }}>
          <div className="bg-white p-3 shadow-sm mx-auto max-w-[300px]" style={{ border: `1px solid ${borderColor}` }}>
            <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" style={{ maxHeight: "320px" }} />
          </div>
        </div>
      )}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-12" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="Gallery" subtitle="OUR MOMENTS" />
          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="px-8 grid grid-cols-2 gap-4">
              {state.galleryImages.map((img, index) => (
                <div key={index} className="bg-white p-2 shadow-sm cursor-pointer transition-transform"
                  style={{ border: `1px solid ${borderColor}` }}
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pl-8">
              <div className="flex gap-4 pr-8">
                {state.galleryImages.map((img, index) => (
                  <div key={index} className="bg-white p-2 shadow-sm flex-shrink-0 cursor-pointer"
                    style={{ border: `1px solid ${borderColor}` }}
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}>
                    <div className="w-[160px] h-[210px] overflow-hidden">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
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
          <p className="text-[13px] text-center mb-8 leading-[1.8]" style={{ color: textSecondary, fontFamily: fontFamily }}>
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
                <button onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 text-[12px] tracking-wide"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                  data-testid="button-guestbook-cancel">취소</button>
                <button onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[12px] tracking-wide"
                  style={{ backgroundColor: accent, color: "#FFF" }}
                  data-testid="button-guestbook-submit">등록</button>
              </div>
            </div>
          ) : (
            <button onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3 text-[12px] tracking-[0.15em]"
              style={{ border: `1px solid ${accent}`, color: accent, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write">작성하기</button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-8 py-12 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="축하 펀딩" subtitle="WEDDING FUND" />
          {data.fundingMessage && (
            <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-8" style={{ color: textSecondary, fontFamily: fontFamily }}>{data.fundingMessage}</p>
          )}
          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-8">
              <div className="w-[200px] h-[200px] bg-white p-2.5 shadow-sm" style={{ border: `1px solid ${borderColor}` }}>
                <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}
          <button className="px-12 py-3.5 text-[12px] tracking-[0.15em]"
            style={{ backgroundColor: accent, color: "#FFF" }}
            data-testid="button-funding" onClick={() => openKakaoTransfer()}>
            {data.fundingButtonName || "\uC2E0\uD63C\uC5EC\uD589 \uCD95\uD558\uD558\uAE30"}
          </button>
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
          <div className="px-8 py-12 text-center" style={{ backgroundColor: pageBg }}>
            {data.endingPhoto && (
              <div className="mx-auto max-w-[280px] mb-8 bg-white p-2.5 shadow-sm" style={{ border: `1px solid ${borderColor}` }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
              </div>
            )}
            {data.endingContent && (
              <p className="text-[13px] leading-[2.2] whitespace-pre-line mb-8" style={{ color: textSecondary, fontFamily: fontFamily }}>{data.endingContent}</p>
            )}

            <LeafDivider color={accentLight} />

            {/* Illustration couple again at ending */}
            <div className="flex justify-center my-6">
              <img
                src="/illustration-couple.png"
                alt="Couple illustration"
                className="w-[180px] h-auto object-contain"
                style={{ mixBlendMode: 'multiply', opacity: 0.5 }}
              />
            </div>

            <p className="text-[20px] tracking-wider" style={{ color: textPrimary, fontFamily: serifFont }}>
              {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
            </p>
          </div>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-8 pb-8 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <button onClick={helpers.copyLink}
          className="w-full py-3.5 text-[12px] tracking-[0.15em]"
          style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
          data-testid="button-copy-link">
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="pb-10 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <LeafDivider color={borderColor} />
        <p className="text-[9px] tracking-[0.4em] mt-2" style={{ color: textTertiary }}>WE:BEAT</p>
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
