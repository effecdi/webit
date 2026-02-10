"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

const DoodleBorder = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 600">
      <path d="M8,8 Q200,2 392,8 Q398,300 392,592 Q200,598 8,592 Q2,300 8,8" fill="none" stroke="#C5BFB5" strokeWidth="1.5" strokeDasharray="6,4" />
    </svg>
    <div className="relative z-10 p-6">{children}</div>
  </div>
)

const HeartIcon = ({ size = 16, color = "#D4A59A" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const WineGlassIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#8B8578" strokeWidth="1.2">
    <path d="M12 5h6l-1 12c0 3-2 4-2 4v10" />
    <path d="M12 31h6" />
    <path d="M22 5h6l-1 12c0 3-2 4-2 4v10" />
    <path d="M22 31h6" />
    <path d="M17 8l8 4" strokeDasharray="2,2" />
  </svg>
)

const RingsIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#8B8578" strokeWidth="1.2">
    <circle cx="15" cy="20" r="8" />
    <circle cx="25" cy="20" r="8" />
    <circle cx="15" cy="20" r="5" strokeDasharray="2,2" />
    <circle cx="25" cy="20" r="5" strokeDasharray="2,2" />
  </svg>
)

const CutleryIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#8B8578" strokeWidth="1.2">
    <path d="M12 5v30" />
    <path d="M12 5c-4 0-5 6-1 8" />
    <path d="M12 5c4 0 5 6 1 8" />
    <path d="M28 5c0 8-3 10-3 14v16" />
    <path d="M28 5c0 4 3 6 3 10" />
  </svg>
)

const CakeIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="#8B8578" strokeWidth="1.2">
    <rect x="8" y="20" width="24" height="14" rx="2" />
    <rect x="12" y="14" width="16" height="6" rx="1" />
    <path d="M20 8v6" />
    <circle cx="20" cy="7" r="2" fill="#D4A59A" stroke="none" />
    <path d="M8 27h24" strokeDasharray="3,3" />
  </svg>
)

const ChandelierIcon = ({ size = 50 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" stroke="#C5BFB5" strokeWidth="1">
    <path d="M30 2v8" />
    <path d="M20 10h20" />
    <path d="M20 10c-3 5-5 12-5 18" />
    <path d="M40 10c3 5 5 12 5 18" />
    <path d="M30 10v15" />
    <circle cx="15" cy="30" r="3" />
    <circle cx="30" cy="27" r="3" />
    <circle cx="45" cy="30" r="3" />
    <path d="M12 33l-2 6M18 33l2 6" strokeDasharray="2,2" />
    <path d="M27 30l-2 6M33 30l2 6" strokeDasharray="2,2" />
    <path d="M42 33l-2 6M48 33l2 6" strokeDasharray="2,2" />
  </svg>
)

const HandHoldingIcon = ({ size = 60 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 40" fill="none" stroke="#8B8578" strokeWidth="1.2">
    <path d="M10 30c5-2 10-5 15-10 3-3 5-6 8-6s5 3 8 6c5 5 10 8 15 10" />
    <path d="M25 14c2-3 5-4 8-4" strokeDasharray="2,2" />
    <path d="M47 14c-2-3-5-4-8-4" strokeDasharray="2,2" />
  </svg>
)

const ScallopDivider = () => (
  <div className="w-full flex justify-center py-3">
    <svg width="200" height="12" viewBox="0 0 200 12" fill="none">
      <path d="M0,6 Q10,0 20,6 Q30,12 40,6 Q50,0 60,6 Q70,12 80,6 Q90,0 100,6 Q110,12 120,6 Q130,0 140,6 Q150,12 160,6 Q170,0 180,6 Q190,12 200,6" stroke="#C5BFB5" strokeWidth="1" fill="none" />
    </svg>
  </div>
)

export function PolaroidLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FDFCF9"
  const textPrimary = "#3D3830"
  const textSecondary = "#7A7468"
  const textTertiary = "#AAA49A"
  const accent = "#D4A59A"
  const buttonBg = "#3D3830"
  const buttonText = "#FDFCF9"
  const borderColor = "#C5BFB5"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "'Caveat', 'Dancing Script', cursive")
  const scriptFont = "'Caveat', 'Dancing Script', 'Great Vibes', cursive"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="text-center mb-6">
      <h2 className="text-[26px] leading-tight" style={{ color: textPrimary, fontFamily: scriptFont }}>
        {title}
      </h2>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO: Illustration style cover ===== */}
      <div className="relative text-center pt-10 pb-8 px-6" style={{ backgroundColor: pageBg }}>
        {/* Top decorative chandelier */}
        <div className="flex justify-center mb-4">
          <ChandelierIcon size={56} />
        </div>

        {/* Script heading */}
        <p className="text-[15px] leading-[2] whitespace-pre-line mb-4" style={{ color: textSecondary, fontFamily: scriptFont }}>
          {data.invitationTitle || "\uC774 \uC544\uC774\uB4E4\uC774\n\uACB0\uD63C\uD569\uB2C8\uB2E4"}
        </p>

        {/* Photo frames - tilted polaroid style */}
        {state.allPhotos.length > 0 && (
          <div className="flex justify-center items-start gap-4 my-6 px-2">
            <div className="p-2 bg-white shadow-md" style={{ transform: "rotate(-4deg)", border: `1px solid ${borderColor}` }}>
              <div className="w-[110px] h-[130px] overflow-hidden mb-2">
                <img src={state.allPhotos[0]} alt="Photo 1" className="w-full h-full object-cover" />
              </div>
              {/* Hand-drawn frame corners */}
              <svg className="absolute top-1 left-1 w-4 h-4" viewBox="0 0 16 16" fill="none" stroke={borderColor} strokeWidth="1">
                <path d="M1,8 L1,1 L8,1" />
              </svg>
              <svg className="absolute top-1 right-1 w-4 h-4" viewBox="0 0 16 16" fill="none" stroke={borderColor} strokeWidth="1">
                <path d="M8,1 L15,1 L15,8" />
              </svg>
            </div>
            {state.allPhotos.length > 1 && (
              <div className="p-2 bg-white shadow-md mt-3" style={{ transform: "rotate(3deg)", border: `1px solid ${borderColor}` }}>
                <div className="w-[110px] h-[130px] overflow-hidden mb-2">
                  <img src={state.allPhotos[1]} alt="Photo 2" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hand-drawn couple stick figures */}
        <div className="flex justify-center my-4">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" stroke={textSecondary} strokeWidth="1.2">
            {/* Groom */}
            <circle cx="35" cy="12" r="7" />
            <path d="M35 19v22" />
            <path d="M35 25l-12 12" />
            <path d="M35 25l12 12" />
            <path d="M35 41l-10 18" />
            <path d="M35 41l10 18" />
            <path d="M28 6l7-3l7 3" />
            {/* Bride */}
            <circle cx="85" cy="12" r="7" />
            <path d="M85 19v22" />
            <path d="M85 25l-12 12" />
            <path d="M85 25l12 12" />
            <path d="M75 41q10 18 20 0" />
            <path d="M75 41l-3 18" />
            <path d="M95 41l3 18" />
            <path d="M79 5q6 4 12 0" strokeDasharray="2,2" />
            {/* Holding hands */}
            <path d="M47 37l26 0" strokeDasharray="3,3" />
          </svg>
        </div>

        {/* Names with heart */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[28px]" style={{ color: textPrimary, fontFamily: scriptFont }}>
            {data.groomName || "\uC2E0\uB791"}
          </span>
          <span className="text-[22px]" style={{ color: accent, fontFamily: scriptFont }}>+</span>
          <span className="text-[28px]" style={{ color: textPrimary, fontFamily: scriptFont }}>
            {data.brideName || "\uC2E0\uBD80"}
          </span>
          <span className="mx-1">=</span>
          <HeartIcon size={20} color={accent} />
        </div>

        {/* Date */}
        <p className="text-[13px] mb-2" style={{ color: textSecondary }}>
          {helpers.formatWeddingDate()}{data.time ? ` ${data.time}` : ""}
        </p>

        <ScallopDivider />
      </div>

      {/* ===== INVITATION in doodle border ===== */}
      <div className="px-4 py-8" style={{ backgroundColor: pageBg }}>
        <DoodleBorder>
          <SectionTitle title={"\uCD08\uB300\uD569\uB2C8\uB2E4"} />

          {data.message && (
            <p className="text-[13px] leading-[2] whitespace-pre-line text-center mb-6" style={{ color: textSecondary, textAlign: data.messageAlign || "center" }}>
              {data.message}
            </p>
          )}

          {/* Wine glasses icon */}
          <div className="flex justify-center mb-4">
            <WineGlassIcon size={32} />
          </div>
        </DoodleBorder>
      </div>

      {/* ===== Parents info ===== */}
      {data.showNameAtBottom && (
        <div className="px-8 py-8 text-center" style={{ backgroundColor: pageBg }}>
          {(() => {
            const groomBlock = (
              <p className="text-[14px] leading-[2]" style={{ color: textPrimary }}>
                {data.groomFather?.name && (<><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>)}
                {data.groomMother?.name && (<> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>)}
                {(data.groomFather?.name || data.groomMother?.name) && (
                  <span className="text-[12px]" style={{ color: textTertiary }}> {data.groomRelation || "\uC544\uB4E4"} </span>
                )}
                <span className="font-bold">{data.groomName || "\uC2E0\uB791"}</span>
              </p>
            )
            const brideBlock = (
              <p className="text-[14px] leading-[2]" style={{ color: textPrimary }}>
                {data.brideFather?.name && (<><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>)}
                {data.brideMother?.name && (<> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>)}
                {(data.brideFather?.name || data.brideMother?.name) && (
                  <span className="text-[12px]" style={{ color: textTertiary }}> {data.brideRelation || "\uB538"} </span>
                )}
                <span className="font-bold">{data.brideName || "\uC2E0\uBD80"}</span>
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

          <div className="mt-6">
            <button data-testid="button-contact" onClick={() => state.setShowContact(true)}
              className="px-8 py-2.5 text-[13px]"
              style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent", borderRadius: "0" }}
            >
              연락하기
            </button>
          </div>
        </div>
      )}

      {/* ===== CALENDAR in doodle border ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-4 py-8" style={{ backgroundColor: pageBg }}>
            <DoodleBorder>
              <SectionTitle title={`${cal.year}\uB144 ${cal.month}\uC6D4`} />

              <p className="text-[13px] text-center mb-4" style={{ color: textSecondary }}>
                {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
              </p>

              {data.showCalendar && calStyle === "full" && (
                <div className="mb-4 mx-auto" style={{ maxWidth: "280px" }}>
                  <div className="grid grid-cols-7 gap-0 mb-1">
                    {cal.dayNames.map((d) => (
                      <div key={d} className="text-[10px] py-1.5 text-center" style={{ color: textTertiary }}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0">
                    {cal.days.map((day, i) => (
                      <div key={i} className="py-2 text-center">
                        {day !== null && (
                          day === cal.weddingDay ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-bold" style={{ backgroundColor: accent, color: "#FFF" }}>
                              {day}
                            </span>
                          ) : (
                            <span className="text-[13px]" style={{ color: i % 7 === 0 ? "#C88" : i % 7 === 6 ? "#88A" : textPrimary }}>
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
                <div className="text-center mb-4 py-3" style={{ borderTop: `1px dashed ${borderColor}`, borderBottom: `1px dashed ${borderColor}` }}>
                  <p className="text-[15px]" style={{ color: textPrimary }}>
                    {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
                </div>
              )}

              {data.showCountdown && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-3">
                    {[
                      { label: "\uC77C", value: state.countdown.days },
                      { label: "\uC2DC\uAC04", value: state.countdown.hours },
                      { label: "\uBD84", value: state.countdown.minutes },
                      { label: "\uCD08", value: state.countdown.seconds },
                    ].map((item, idx) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className="text-center w-12 py-2" style={{ border: `1px dashed ${borderColor}` }}>
                          <p className="text-[20px] font-bold leading-none" style={{ color: textPrimary }}>{String(item.value).padStart(2, "0")}</p>
                          <p className="text-[8px] mt-1" style={{ color: textTertiary }}>{item.label}</p>
                        </div>
                        {idx < 3 && <span className="text-[14px]" style={{ color: textTertiary }}>:</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DoodleBorder>
          </div>
        )
      })()}

      {/* ===== LOCATION in doodle border ===== */}
      <div className="px-4 py-8" style={{ backgroundColor: pageBg }}>
        <DoodleBorder>
          <SectionTitle title={"\uC624\uC2DC\uB294 \uAE38"} />

          <p className="text-[14px] text-center mb-1" style={{ color: textSecondary }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
          <p className="text-[18px] font-bold text-center mb-1" style={{ color: textPrimary, fontFamily: scriptFont }}>
            {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` \u00AB${data.venueHall}\u00BB` : ""}
          </p>
          {data.venuePhone && <p className="text-[12px] text-center mb-4" style={{ color: textTertiary }}>Tel. {data.venuePhone}</p>}

          <div className="my-4 overflow-hidden" style={{ border: `1px dashed ${borderColor}` }}>
            <MapEmbed address={data.address} height={160} borderColor={borderColor} bgColor={pageBg} />
          </div>

          <div className="text-center">
            <button className="px-8 py-2.5 text-[13px]"
              style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
              data-testid="button-directions" onClick={() => openNaverDirections(data.address)}>
              길찾기
            </button>
          </div>

          {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
            <div className="mt-6 space-y-3">
              {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
                <div key={i} className="pt-3" style={{ borderTop: `1px dashed ${borderColor}` }}>
                  {item.type && <p className="text-[12px] font-bold mb-1" style={{ color: textPrimary }}>{item.type}</p>}
                  {item.detail && <p className="text-[12px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
                </div>
              ))}
            </div>
          )}
          {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
            <div className="mt-4 pt-3" style={{ borderTop: `1px dashed ${borderColor}` }}>
              <p className="text-[12px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
            </div>
          )}
          {data.showTransportNotice && (
            <p className="text-[11px] leading-[1.8] mt-3 text-center" style={{ color: textTertiary }}>
              주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
            </p>
          )}
        </DoodleBorder>
      </div>

      {/* ===== MID PHOTO ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="px-8 py-4" style={{ backgroundColor: pageBg }}>
          <div className="p-2 bg-white shadow-sm mx-auto max-w-[300px]" style={{ border: `1px solid ${borderColor}`, transform: "rotate(-1deg)" }}>
            <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" style={{ maxHeight: "300px" }} />
          </div>
        </div>
      )}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-10" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="Gallery" />
          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="px-6 grid grid-cols-2 gap-3">
              {state.galleryImages.map((img, index) => (
                <div key={index} className="p-1.5 bg-white shadow-sm cursor-pointer"
                  style={{ border: `1px solid ${borderColor}`, transform: index % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)" }}
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pl-6">
              <div className="flex gap-3 pr-6">
                {state.galleryImages.map((img, index) => (
                  <div key={index} className="p-1.5 bg-white shadow-sm flex-shrink-0 cursor-pointer"
                    style={{ border: `1px solid ${borderColor}`, transform: index % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)" }}
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}>
                    <div className="w-[160px] h-[200px] overflow-hidden">
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
        <div className="px-4 py-8" style={{ backgroundColor: pageBg }}>
          <DoodleBorder>
            <SectionTitle title="R.S.V.P" />
            <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>
              {data.rsvpContent || "\uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC2DC\uBA74 \uAC10\uC0AC\uD558\uACA0\uC2B5\uB2C8\uB2E4"}
            </p>
            <div className="text-center">
              <button className="px-10 py-3 text-[13px]"
                style={{ backgroundColor: buttonBg, color: buttonText, border: "none" }}
                data-testid="button-rsvp" onClick={() => onRsvpClick?.()}>
                {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
              </button>
            </div>
          </DoodleBorder>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-6 py-10" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={"\uBC29\uBA85\uB85D"} />

          <div className="space-y-3 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-4 bg-white" style={{ border: `1px dashed ${borderColor}` }}>
                  <p className="text-[13px] leading-[1.8] whitespace-pre-line mb-2" style={{ color: textSecondary }}>{entry.message}</p>
                  <p className="text-[11px] text-right" style={{ color: textTertiary }}>- {entry.name} -</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center" style={{ border: `1px dashed ${borderColor}` }}>
                <p className="text-[13px]" style={{ color: textTertiary }}>축하 메시지를 남겨주세요</p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-4 mb-4" style={{ border: `1px dashed ${borderColor}` }}>
              <input type="text" value={state.guestbookName} onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름" className="w-full py-2 px-3 text-[13px] mb-2 outline-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-name" />
              <textarea value={state.guestbookMessage} onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요" rows={4}
                className="w-full py-2 px-3 text-[13px] mb-3 outline-none resize-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-message" />
              <div className="flex gap-2">
                <button onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2 text-[12px]"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                  data-testid="button-guestbook-cancel">취소</button>
                <button onClick={helpers.submitGuestbook}
                  className="flex-1 py-2 text-[12px]"
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid="button-guestbook-submit">등록</button>
              </div>
            </div>
          ) : (
            <button onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-2.5 text-[13px]"
              style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write">작성하기</button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-6 py-10 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={"\uCD95\uD558 \uD380\uB529"} />
          {data.fundingMessage && (
            <p className="text-[13px] leading-[1.8] whitespace-pre-line mb-6" style={{ color: textSecondary }}>{data.fundingMessage}</p>
          )}
          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-6">
              <div className="w-[180px] h-[180px] p-1.5 bg-white shadow-sm" style={{ border: `1px solid ${borderColor}`, transform: "rotate(-2deg)" }}>
                <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}
          <button className="px-10 py-3 text-[13px] mb-3"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding" onClick={() => openKakaoTransfer()}>
            {data.fundingButtonName || "\uC2E0\uD63C\uC5EC\uD589 \uCD95\uD558\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-6 py-10 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={"\uAE30\uD504\uD2B8 \uD380\uB529"} />
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary }}>{data.giftFundingMessage}</p>
          )}
          {data.giftFundingButtonName && (
            <button className="px-10 py-3 text-[13px]"
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
          <div className="space-y-3">
            {list.map((acc, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <div>
                  <p className="text-[13px]" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textTertiary }}>{acc!.holder}</p>
                </div>
                <button onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-3 py-1 text-[10px]"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                  data-testid={`button-copy-account-${i}`}>복사</button>
              </div>
            ))}
          </div>
        )
        return (
          <div className="px-4 py-8" style={{ backgroundColor: pageBg }}>
            <DoodleBorder>
              <SectionTitle title={"\uCD95\uC758\uAE08 \uC804\uB2EC"} />
              <div className="space-y-4">
                {groomAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div style={{ border: `1px dashed ${borderColor}` }}>
                      <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                        className="w-full flex items-center justify-between p-4" data-testid="accordion-groom">
                        <p className="text-[13px] font-bold" style={{ color: textPrimary }}>신랑측</p>
                        <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                          style={{ color: textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {state.expandedAccordion === "groom" && (
                        <div className="px-4 pb-4" style={{ borderTop: `1px dashed ${borderColor}` }}>{renderAccList(groomAccList)}</div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4" style={{ border: `1px dashed ${borderColor}` }}>
                      <p className="text-[11px] font-bold mb-3" style={{ color: accent }}>신랑측</p>
                      {renderAccList(groomAccList)}
                    </div>
                  )
                )}
                {brideAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div style={{ border: `1px dashed ${borderColor}` }}>
                      <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                        className="w-full flex items-center justify-between p-4" data-testid="accordion-bride">
                        <p className="text-[13px] font-bold" style={{ color: textPrimary }}>신부측</p>
                        <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                          style={{ color: textSecondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {state.expandedAccordion === "bride" && (
                        <div className="px-4 pb-4" style={{ borderTop: `1px dashed ${borderColor}` }}>{renderAccList(brideAccList)}</div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4" style={{ border: `1px dashed ${borderColor}` }}>
                      <p className="text-[11px] font-bold mb-3" style={{ color: accent }}>신부측</p>
                      {renderAccList(brideAccList)}
                    </div>
                  )
                )}
              </div>
            </DoodleBorder>
          </div>
        )
      })()}

      {/* ===== BAPTISMAL NAMES ===== */}
      {data.showBaptismalName && (
        <div className="px-8 py-8 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={"\uC138\uB840\uBA85"} />
          <div className="flex justify-center gap-14">
            <div className="space-y-1">
              {data.baptismalGroom && <p className="text-[13px] font-bold" style={{ color: textPrimary }}>{data.baptismalGroom}</p>}
              {data.baptismalGroomFather && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalGroomFather}</p>}
              {data.baptismalGroomMother && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalGroomMother}</p>}
            </div>
            <div className="space-y-1">
              {data.baptismalBride && <p className="text-[13px] font-bold" style={{ color: textPrimary }}>{data.baptismalBride}</p>}
              {data.baptismalBrideFather && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalBrideFather}</p>}
              {data.baptismalBrideMother && <p className="text-[12px]" style={{ color: textSecondary }}>{data.baptismalBrideMother}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-6 py-10 text-center" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={"\uAC8C\uC2A4\uD2B8 \uC2A4\uB0C5"} />
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>{data.guestSnapContent}</p>
          )}
          <button className="px-8 py-2.5 text-[13px]"
            style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
            data-testid="button-guest-snap">사진 업로드</button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-6 py-10" style={{ backgroundColor: pageBg }}>
          <SectionTitle title={data.noticeTitle} />
          <div className="text-center">
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-6 py-10 text-center" style={{ backgroundColor: pageBg }}>
            {data.endingPhoto && (
              <div className="mx-auto max-w-[260px] mb-6 p-1.5 bg-white shadow-sm" style={{ border: `1px solid ${borderColor}`, transform: "rotate(1deg)" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
              </div>
            )}
            {data.endingContent && (
              <p className="text-[13px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary }}>{data.endingContent}</p>
            )}

            <ScallopDivider />

            {/* Ending hand holding */}
            <div className="flex justify-center my-4">
              <HandHoldingIcon size={70} />
            </div>

            <p className="text-[24px] mb-2" style={{ color: textPrimary, fontFamily: scriptFont }}>
              {data.groomName || "\uC2E0\uB791"} + {data.brideName || "\uC2E0\uBD80"} = <span style={{ color: accent }}>&hearts;</span>
            </p>
          </div>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-6 pb-8 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <button onClick={helpers.copyLink}
          className="w-full py-3 text-[13px]"
          style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: "transparent" }}
          data-testid="button-copy-link">
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="pb-8 pt-2 text-center" style={{ backgroundColor: pageBg }}>
        <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: borderColor }} />
        <p className="text-[9px] tracking-[0.3em]" style={{ color: textTertiary }}>WE:BEAT</p>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="w-[300px] p-6 relative bg-white" style={{ border: `1px solid ${borderColor}` }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-3 right-3" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textTertiary }} />
            </button>
            <SectionTitle title="Contact" />
            <div className="space-y-4">
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
                    <p className="text-[10px]" style={{ color: textTertiary }}>{contact.label}</p>
                    <p className="text-[14px]" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-8 h-8 flex items-center justify-center"
                      style={{ border: `1px solid ${borderColor}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-3.5 h-3.5" style={{ color: textSecondary }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")}
                      className="w-8 h-8 flex items-center justify-center"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.9)" }}>
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-[13px] shadow-lg"
          style={{ backgroundColor: buttonBg, color: buttonText }}>
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
