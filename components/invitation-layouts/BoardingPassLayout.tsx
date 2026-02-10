"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function BoardingPassLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const mainBg = "#0B1929"
  const sectionBg1 = "#0F2137"
  const sectionBg2 = "#0B1929"
  const cardBg = "#132D4A"
  const textPrimary = "#E8F0FA"
  const textSecondary = "#7EA8CC"
  const accent = "#5CC8F0"
  const accentGold = "#C9A96E"
  const buttonBg = "#5CC8F0"
  const buttonText = "#0B1929"
  const borderColor = "#1E3A5A"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "'Pretendard', -apple-system, sans-serif")

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accentGold }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-8 text-center">
      <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: accent, fontFamily: englishFont }}>{title}</p>
      {subtitle && <p className="text-[20px] font-bold tracking-tight" style={{ color: textPrimary }}>{subtitle}</p>}
      <div className="w-10 h-[1px] mx-auto mt-3" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
    </div>
  )

  const DashedDivider = () => (
    <div className="flex items-center my-0">
      <div className="w-4 h-8 rounded-r-full" style={{ backgroundColor: mainBg, marginLeft: "-1px" }} />
      <div className="flex-1 border-t-2 border-dashed" style={{ borderColor }} />
      <div className="w-4 h-8 rounded-l-full" style={{ backgroundColor: mainBg, marginRight: "-1px" }} />
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO - BOARDING PASS HEADER ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "660px", background: `linear-gradient(180deg, ${sectionBg1} 0%, ${mainBg} 100%)` }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(92,200,240,0.08) 0%, transparent 60%)" }} />

        <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={accent} fillOpacity="0.8"/>
              </svg>
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold" style={{ color: accent }}>Boarding Pass</span>
            </div>
            <span className="text-[10px] tracking-wider" style={{ color: textSecondary }}>FIRST CLASS</span>
          </div>
          <div className="w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}40, transparent)` }} />
        </div>

        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "660px" }} />
              </div>
            ) : coverStyle === "slide" ? (
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                {state.allPhotos.map((photo, i) => (
                  <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "660px" }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "660px" }} />
                  </div>
                ))}
              </div>
            ) : (
              state.allPhotos.map((photo, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                  <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "660px" }} />
                </div>
              ))
            )}
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${mainBg}90 0%, ${mainBg}20 30%, ${mainBg}60 70%, ${mainBg} 100%)` }} />
          </>
        ) : (
          <div className="w-full flex items-center justify-center" style={{ minHeight: "660px" }}>
            <p className="text-[14px]" style={{ color: textSecondary }}>커버 사진을 추가해주세요</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8">
          <div className="rounded-[20px] p-6 relative overflow-hidden" style={{ backgroundColor: `${cardBg}CC`, backdropFilter: "blur(20px)", border: `1px solid ${borderColor}` }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase mb-0.5" style={{ color: textSecondary }}>From</p>
                <p className="text-[24px] font-bold tracking-tight" style={{ color: textPrimary }}>{data.groomName || "\uC2E0\uB791"}</p>
              </div>
              <div className="flex flex-col items-center px-3 pt-1">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4c-2 0-4 1-5.5 3S4 11 4 13c0 4.4 3.6 7 8 7s8-2.6 8-7c0-2-1-4-2.5-6S14 4 12 4z" fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1"/>
                  <path d="M12 7l1.5 3 3.5.5-2.5 2.5.6 3.5L12 15l-3.1 1.5.6-3.5L7 10.5l3.5-.5L12 7z" fill={accent} fillOpacity="0.3"/>
                </svg>
                <div className="w-px h-3 my-1" style={{ backgroundColor: accent, opacity: 0.3 }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={accent} fillOpacity="0.6"/>
                </svg>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.15em] uppercase mb-0.5" style={{ color: textSecondary }}>To</p>
                <p className="text-[24px] font-bold tracking-tight" style={{ color: textPrimary }}>{data.brideName || "\uC2E0\uBD80"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
              <span className="text-[10px] tracking-[0.2em]" style={{ color: accent }}>WEDDING DAY</span>
              <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}60)` }} />
            </div>

            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-[10px] tracking-wider uppercase" style={{ color: textSecondary }}>Date</p>
                <p className="text-[15px] font-medium mt-0.5" style={{ color: textPrimary }}>{helpers.formatWeddingDate()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-wider uppercase" style={{ color: textSecondary }}>Time</p>
                <p className="text-[15px] font-medium mt-0.5" style={{ color: textPrimary }}>{data.time || helpers.formatWeddingTime()}</p>
              </div>
            </div>

            <div className="mt-4 pt-3" style={{ borderTop: `1px dashed ${borderColor}` }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] tracking-wider uppercase" style={{ color: textSecondary }}>Gate</p>
                  <p className="text-[13px] font-medium" style={{ color: accent }}>{data.venueHall || "MAIN"}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] tracking-wider uppercase" style={{ color: textSecondary }}>Seat</p>
                  <p className="text-[13px] font-medium" style={{ color: accent }}>LOVE</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-wider uppercase" style={{ color: textSecondary }}>Status</p>
                  <p className="text-[13px] font-bold" style={{ color: accentGold }}>CONFIRMED</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" style={{ bottom: "180px" }}>
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? accent : `${accent}40` }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION SECTION (TICKET BODY) ===== */}
      <div className="px-5" style={{ backgroundColor: mainBg }}>
        <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
          <div className="px-7 pt-10 pb-6">
            <SectionTitle title="Invitation" subtitle="\uCD08\uB300\uD569\uB2C8\uB2E4" />
            {data.invitationTitle && (
              <p className="text-[18px] text-center font-medium mb-4" style={{ color: textPrimary }}>{data.invitationTitle}</p>
            )}
            {data.message && (
              <p
                className="text-[14px] leading-[2] whitespace-pre-line mb-6"
                style={{ color: textSecondary, textAlign: data.messageAlign || "center" }}
              >
                {data.message}
              </p>
            )}
          </div>

          <DashedDivider />

          <div className="px-7 py-6">
            {data.showNameAtBottom && (() => {
              const groomBlock = (
                <p className="text-[15px] font-medium leading-relaxed" style={{ color: textPrimary }}>
                  {data.groomFather?.name && (
                    <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
                  )}
                  {data.groomMother?.name && (
                    <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
                  )}
                  {(data.groomFather?.name || data.groomMother?.name) && (
                    <span className="text-[13px]" style={{ color: textSecondary }}> {data.groomRelation || "\uC544\uB4E4"} </span>
                  )}
                  <span className="font-bold" style={{ color: accent }}>{data.groomName || "\uC2E0\uB791"}</span>
                </p>
              )
              const brideBlock = (
                <p className="text-[15px] font-medium leading-relaxed" style={{ color: textPrimary }}>
                  {data.brideFather?.name && (
                    <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
                  )}
                  {data.brideMother?.name && (
                    <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
                  )}
                  {(data.brideFather?.name || data.brideMother?.name) && (
                    <span className="text-[13px]" style={{ color: textSecondary }}> {data.brideRelation || "\uB538"} </span>
                  )}
                  <span className="font-bold" style={{ color: accent }}>{data.brideName || "\uC2E0\uBD80"}</span>
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
                <div className="text-center space-y-3 mb-6">
                  {first}
                  {second}
                </div>
              )
            })()}

            <button
              data-testid="button-contact"
              onClick={() => state.setShowContact(true)}
              className="w-[200px] mx-auto block py-3 rounded-[12px] text-[14px] font-medium"
              style={{ border: `1px solid ${borderColor}`, color: accent, backgroundColor: `${cardBg}80` }}
            >
              연락하기
            </button>
          </div>
        </div>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Gallery" subtitle="\uC6E8\uB529 \uAC24\uB7EC\uB9AC" />

            {data.galleryStyle === "grid" || !data.galleryStyle ? (
              <div className="grid grid-cols-3 gap-1.5">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-square cursor-pointer overflow-hidden rounded-[8px]"
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
                      className="w-[160px] h-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[8px]"
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
        </div>
      )}

      {/* ===== CALENDAR & COUNTDOWN SECTION ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
            <div className="rounded-[20px] overflow-hidden py-10 px-6 text-center" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
              <SectionTitle title="Schedule" subtitle="\uC608\uC2DD \uC77C\uC815" />
              <p className="text-[13px] mb-6" style={{ color: textSecondary }}>
                {cal.weddingDayName}\uC694\uC77C {helpers.formatWeddingTime()}
              </p>

              {data.showCalendar && calStyle === "full" && (
                <div className="mb-8 mx-auto" style={{ maxWidth: "300px" }}>
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {cal.dayNames.map((d) => (
                      <div key={d} className="text-[12px] py-2 text-center" style={{ color: textSecondary }}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0">
                    {cal.days.map((day, i) => (
                      <div key={i} className="py-2.5 text-center">
                        {day !== null && (
                          day === cal.weddingDay ? (
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-bold" style={{ backgroundColor: accent, color: buttonText }}>
                              {day}
                            </span>
                          ) : (
                            <span className="text-[14px]" style={{ color: i % 7 === 0 ? "#F07070" : i % 7 === 6 ? accent : textPrimary }}>
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
                <div className="mb-8 py-4" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
                  <p className="text-[18px] font-medium" style={{ color: textPrimary }}>
                    {cal.year}\uB144 {cal.month}\uC6D4 {cal.weddingDay}\uC77C {cal.weddingDayName}\uC694\uC77C
                  </p>
                  <p className="text-[14px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
                </div>
              )}

              {data.showCountdown && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {[
                    { label: "DAYS", value: state.countdown.days },
                    { label: "HOUR", value: state.countdown.hours },
                    { label: "MIN", value: state.countdown.minutes },
                    { label: "SEC", value: state.countdown.seconds },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-[60px] rounded-[12px] py-3" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                        <p className="text-[24px] font-bold text-center" style={{ color: accent }}>{String(item.value).padStart(2, "0")}</p>
                        <p className="text-[8px] tracking-wider text-center mt-0.5" style={{ color: textSecondary }}>{item.label}</p>
                      </div>
                      {i < 3 && <span className="text-[20px] font-light" style={{ color: accent }}>:</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
        <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
          <SectionTitle title="Location" subtitle="\uC624\uC2DC\uB294 \uAE38" />

          <div className="text-center mb-6">
            <p className="text-[18px] font-bold mb-2" style={{ color: textPrimary }}>
              {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` ${data.venueHall}` : ""}
            </p>
            <p className="text-[14px]" style={{ color: textSecondary }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
            {data.venuePhone && (
              <p className="text-[13px] mt-1" style={{ color: textSecondary }}>Tel. {data.venuePhone}</p>
            )}
          </div>

          <div className="rounded-[12px] overflow-hidden mb-4" style={{ border: `1px solid ${borderColor}` }}>
            <MapEmbed address={data.address} height={200} borderColor={borderColor} bgColor={sectionBg1} />
          </div>

          <button
            className="w-full py-3.5 rounded-[12px] text-[14px] font-medium mb-4"
            style={{ backgroundColor: accent, color: buttonText }}
            data-testid="button-directions"
            onClick={() => openNaverDirections(data.address)}
          >
            길찾기
          </button>

          {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
            <div className="mt-2 space-y-4">
              {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
                <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                  {item.type && <p className="text-[15px] font-bold mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                  {item.detail && <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
                </div>
              ))}
            </div>
          )}
          {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
            <div className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
              <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
            </div>
          )}
          {data.showTransportNotice && (
            <div className="mt-6 p-4 rounded-[12px]" style={{ backgroundColor: cardBg }}>
              <p className="text-[13px] leading-[1.8]" style={{ color: textSecondary }}>
                주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== MID PHOTO ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
            <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" />
          </div>
        </div>
      )}

      {/* ===== RSVP SECTION ===== */}
      {data.showRsvp && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="R.S.V.P" subtitle="\uCC38\uC11D \uC758\uC0AC" />

            <div className="flex justify-center mb-6">
              <div className="relative w-[200px] h-[100px] rounded-[16px] overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}AA)` }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mb-1">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={buttonText} fillOpacity="0.8"/>
                  </svg>
                  <p className="text-[12px] font-bold tracking-[0.2em]" style={{ color: buttonText }}>BOARDING CONFIRMED</p>
                </div>
              </div>
            </div>

            <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>
              {data.rsvpContent || "\uC2E0\uB791\uC2E0\uBD80\uC5D0\uAC8C \uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC138\uC694"}
            </p>

            <button
              className="w-full py-3.5 rounded-[12px] text-[14px] font-bold border-0"
              style={{ backgroundColor: accent, color: buttonText }}
              data-testid="button-rsvp"
              onClick={() => onRsvpClick?.()}
            >
              {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
            </button>
          </div>
        </div>
      )}

      {/* ===== GUESTBOOK SECTION ===== */}
      {data.showGuestbook && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Guest Book" subtitle="\uBC29\uBA85\uB85D" />

            <div className="space-y-3 mb-6">
              {state.guestbookEntries.length > 0 ? (
                state.guestbookEntries.slice(0, 5).map((entry, i) => (
                  <div
                    key={i}
                    className="p-5 text-center rounded-[12px]"
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                  >
                    <p className="text-[14px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                    <p className="text-[12px]" style={{ color: accent }}>- {entry.name} -</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center rounded-[12px]" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <p className="text-[14px] leading-[1.8]" style={{ color: textSecondary }}>
                    아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                  </p>
                </div>
              )}
            </div>

            {state.showGuestbookForm ? (
              <div className="p-5 rounded-[12px] mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <input
                  type="text"
                  value={state.guestbookName}
                  onChange={(e) => state.setGuestbookName(e.target.value)}
                  placeholder="\uC774\uB984"
                  className="w-full py-2.5 px-3 rounded-[10px] text-[14px] mb-3 outline-none"
                  style={{ border: `1px solid ${borderColor}`, backgroundColor: sectionBg2, color: textPrimary }}
                  data-testid="input-guestbook-name"
                />
                <textarea
                  value={state.guestbookMessage}
                  onChange={(e) => state.setGuestbookMessage(e.target.value)}
                  placeholder="\uCD95\uD558 \uBA54\uC2DC\uC9C0\uB97C \uC791\uC131\uD574\uC8FC\uC138\uC694"
                  rows={4}
                  className="w-full py-2.5 px-3 rounded-[10px] text-[14px] mb-3 outline-none resize-none"
                  style={{ border: `1px solid ${borderColor}`, backgroundColor: sectionBg2, color: textPrimary }}
                  data-testid="input-guestbook-message"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => state.setShowGuestbookForm(false)}
                    className="flex-1 py-2.5 rounded-[10px] text-[13px]"
                    style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                    data-testid="button-guestbook-cancel"
                  >
                    취소
                  </button>
                  <button
                    onClick={helpers.submitGuestbook}
                    className="flex-1 py-2.5 rounded-[10px] text-[13px] font-medium"
                    style={{ backgroundColor: accent, color: buttonText }}
                    data-testid="button-guestbook-submit"
                  >
                    등록하기
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => state.setShowGuestbookForm(true)}
                className="w-full py-3.5 rounded-[12px] text-[14px] font-medium"
                style={{ border: `1px solid ${borderColor}`, color: accent, backgroundColor: cardBg }}
                data-testid="button-guestbook-write"
              >
                작성하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== FUNDING SECTION ===== */}
      {data.showFunding && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Wishlist & Funding" subtitle="\uCD95\uD558 \uD380\uB529" />

            {data.fundingMessage && (
              <p className="text-[15px] text-center font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary }}>
                {data.fundingMessage}
              </p>
            )}

            <div className="flex justify-center mb-6">
              {data.fundingImageType === "custom" && data.fundingImage ? (
                <div className="w-[200px] h-[200px] rounded-[12px] overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                  <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
                </div>
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <svg viewBox="0 0 200 200" width="180" height="180" fill="none">
                    <path d="M60 180c-5-5 0-20 15-35s30-20 40-15 15 20 5 35-25 20-35 15z" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <path d="M80 145l-5-80c0-5 3-10 8-12l20-8" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <rect x="70" y="50" width="18" height="26" rx="3" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <circle cx="80" cy="45" r="10" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <path d="M130 175c5-5 0-20-15-35s-30-20-40-15-15 20-5 35 25 20 35 15z" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <path d="M110 140l10-70c0-5-3-10-8-12l-15-5" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <path d="M105 55q15-5 20 5t-5 20" stroke={accent} strokeWidth="1.5" fill="none"/>
                    <circle cx="120" cy="45" r="10" stroke={accent} strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
              )}
            </div>

            <button
              className="w-full py-3.5 rounded-[12px] text-[14px] font-bold mb-4"
              style={{ backgroundColor: accent, color: buttonText }}
              data-testid="button-funding"
              onClick={() => openKakaoTransfer()}
            >
              {data.fundingButtonName || "\uC2E0\uD63C\uC5EC\uD589 \uCD95\uD558\uD558\uAE30"}
            </button>

            <p className="text-[12px] text-center leading-[1.6]" style={{ color: textSecondary }}>
              축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
            </p>
          </div>
        </div>
      )}

      {/* ===== GIFT FUNDING SECTION ===== */}
      {data.showGiftFunding && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Gift Funding" subtitle="\uAE30\uD504\uD2B8 \uD380\uB529" />
            {data.giftFundingMessage && (
              <p className="text-[14px] leading-[2] text-center whitespace-pre-line mb-6" style={{ color: textSecondary }}>
                {data.giftFundingMessage}
              </p>
            )}
            {data.giftFundingButtonName && (
              <button
                className="w-full py-3.5 rounded-[12px] text-[14px] font-bold"
                style={{ backgroundColor: accent, color: buttonText }}
                data-testid="button-gift-funding"
                onClick={() => openKakaoGift()}
              >
                {data.giftFundingButtonName}
              </button>
            )}
          </div>
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
                  <p className="text-[14px]" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: textSecondary }}>{acc!.holder}</p>
                </div>
                <button
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-3 py-1.5 rounded-[8px] text-[11px] font-medium"
                  style={{ backgroundColor: cardBg, color: accent, border: `1px solid ${borderColor}` }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
            <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
              <SectionTitle title="Account" subtitle="\uCD95\uC758\uAE08 \uC804\uB2EC" />

              <div className="space-y-4">
                {groomAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: cardBg }}>
                      <button
                        onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                        className="w-full flex items-center justify-between p-5"
                        data-testid="accordion-groom"
                      >
                        <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신랑측 계좌번호</p>
                        <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`} style={{ color: accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {state.expandedAccordion === "groom" && (
                        <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderColor}` }}>
                          {renderAccList(groomAccList)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[12px] p-5" style={{ backgroundColor: cardBg }}>
                      <p className="text-[12px] font-medium mb-4" style={{ color: accent }}>신랑측</p>
                      {renderAccList(groomAccList)}
                    </div>
                  )
                )}

                {brideAccList.length > 0 && (
                  accStyle === "accordion" ? (
                    <div className="rounded-[12px] overflow-hidden" style={{ backgroundColor: cardBg }}>
                      <button
                        onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                        className="w-full flex items-center justify-between p-5"
                        data-testid="accordion-bride"
                      >
                        <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신부측 계좌번호</p>
                        <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`} style={{ color: accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {state.expandedAccordion === "bride" && (
                        <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderColor}` }}>
                          {renderAccList(brideAccList)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[12px] p-5" style={{ backgroundColor: cardBg }}>
                      <p className="text-[12px] font-medium mb-4" style={{ color: accent }}>신부측</p>
                      {renderAccList(brideAccList)}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ===== BAPTISMAL NAMES ===== */}
      {data.showBaptismalName && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6 text-center" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Baptismal Name" />
            <div className="flex justify-center gap-12">
              <div className="space-y-1">
                {data.baptismalGroom && <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{data.baptismalGroom}</p>}
                {data.baptismalGroomFather && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalGroomFather}</p>}
                {data.baptismalGroomMother && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalGroomMother}</p>}
              </div>
              <div className="space-y-1">
                {data.baptismalBride && <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{data.baptismalBride}</p>}
                {data.baptismalBrideFather && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalBrideFather}</p>}
                {data.baptismalBrideMother && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalBrideMother}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Guest Snap" subtitle="\uAC8C\uC2A4\uD2B8 \uC2A4\uB0C5" />
            {data.guestSnapContent && (
              <p className="text-[14px] text-center whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
                {data.guestSnapContent}
              </p>
            )}
            <button
              className="w-full py-3.5 rounded-[12px] text-[14px] font-medium"
              style={{ border: `1px solid ${borderColor}`, color: accent, backgroundColor: cardBg }}
              data-testid="button-guest-snap"
            >
              사진 업로드
            </button>
          </div>
        </div>
      )}

      {/* ===== NOTICE SECTION ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
          <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <SectionTitle title="Notice" subtitle="\uC548\uB0B4\uC0AC\uD56D" />
            <p className="text-[16px] font-bold text-center mb-4" style={{ color: accentGold }}>{data.noticeTitle}</p>
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[14px] text-center leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING SECTION ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-5 pt-6" style={{ backgroundColor: mainBg }}>
            <div className="rounded-[20px] overflow-hidden py-10 px-6" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
              <SectionTitle title="Thank You" subtitle="\uAC10\uC0AC\uC758 \uB9D0\uC500" />

              {eStyle === "card" && data.endingPhoto && (
                <div className="mx-auto max-w-[280px] mb-6">
                  <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover rounded-[12px]" style={{ border: `1px solid ${borderColor}` }} />
                </div>
              )}
              {eStyle === "card" && data.endingContent && (
                <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                  {data.endingContent}
                </p>
              )}

              {eStyle === "full" && data.endingPhoto && (
                <div className="-mx-6 mb-6 relative">
                  <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "400px" }} />
                  <div className="absolute inset-0 bg-black/40" />
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
                <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
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
                          <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                            {data.endingContent}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {!data.endingPhoto && data.endingContent && (
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                      {data.endingContent}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })()}

      {/* ===== FOOTER ===== */}
      <div className="px-5 pt-6 pb-10" style={{ backgroundColor: mainBg }}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${borderColor})` }} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={accent} fillOpacity="0.4"/>
            </svg>
            <div className="flex-1 h-[1px] max-w-[60px]" style={{ background: `linear-gradient(90deg, ${borderColor}, transparent)` }} />
          </div>
          <p className="text-[10px] tracking-[0.15em]" style={{ color: textSecondary }}>
            {data.groomName || "\uC2E0\uB791"} & {data.brideName || "\uC2E0\uBD80"}
          </p>
          <p className="text-[9px] mt-1 tracking-wider" style={{ color: `${textSecondary}80` }}>Powered by WE:BEAT</p>
        </div>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-[320px] rounded-[20px] p-6 relative" style={{ backgroundColor: sectionBg1, border: `1px solid ${borderColor}` }}>
            <button
              onClick={() => state.setShowContact(false)}
              className="absolute top-4 right-4"
              data-testid="button-close-contact"
            >
              <X className="w-5 h-5" style={{ color: textSecondary }} />
            </button>
            <p className="text-[18px] font-bold text-center mb-6" style={{ color: textPrimary }}>연락처</p>
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
                    <p className="text-[12px]" style={{ color: textSecondary }}>{contact.label}</p>
                    <p className="text-[15px] font-medium" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${contact.phone}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                      data-testid={`button-call-${i}`}
                    >
                      <Phone className="w-4 h-4" style={{ color: accent }} />
                    </a>
                    <button
                      onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
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
          style={{ backgroundColor: accent, color: buttonText }}
        >
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
