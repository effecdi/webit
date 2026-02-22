"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function CinematicLayout({ data, state, helpers, onRsvpClick, onGuestSnapUpload }: LayoutProps) {
  const deepBlack = "#080808"
  const darkSurface = "#111111"
  const darkCard = "#171717"
  const champagne = "#D4B896"
  const champagneMuted = "rgba(212,184,150,0.15)"
  const champagneDim = "rgba(212,184,150,0.4)"
  const warmWhite = "#F0EBE3"
  const textMuted = "#7A7062"
  const textDim = "#4A4540"
  const borderDark = "#252220"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "Georgia, 'Times New Roman', serif")
  const serifFont = "'Playfair Display', Georgia, 'Times New Roman', serif"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: champagne }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const FilmStrip = () => (
    <div className="flex items-center justify-center gap-2 my-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="w-3 h-2" style={{ backgroundColor: champagneMuted }} />
      ))}
    </div>
  )

  const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-10">
      {subtitle && (
        <p className="text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: champagne, fontFamily: serifFont }}>
          {subtitle}
        </p>
      )}
      <h2 className="text-[24px] font-light tracking-[0.08em]" style={{ color: warmWhite, fontFamily: serifFont }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="h-px w-8" style={{ backgroundColor: champagneDim }} />
        <div className="w-1 h-1" style={{ backgroundColor: champagne }} />
        <div className="h-px w-8" style={{ backgroundColor: champagneDim }} />
      </div>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== FILM PREMIERE HEADER ===== */}
      <div style={{ backgroundColor: deepBlack }}>
        <FilmStrip />
        <div className="py-2 text-center">
          <p className="text-[7px] tracking-[0.8em] uppercase" style={{ color: champagne }}>A Wedding Film</p>
        </div>
        <FilmStrip />
      </div>

      {/* ===== HERO: Full cinematic cover ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "700px", backgroundColor: deepBlack }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "700px" }} />
              </div>
            ) : coverStyle === "slide" ? (
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                {state.allPhotos.map((photo, i) => (
                  <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "700px" }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "700px" }} />
                  </div>
                ))}
              </div>
            ) : (
              state.allPhotos.map((photo, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                  <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "700px" }} />
                </div>
              ))
            )}
            {/* Cinematic letterbox gradient */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0) 20%, rgba(8,8,8,0) 60%, rgba(8,8,8,0.8) 100%)" }} />
            {/* Subtle side vignette */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,8,8,0.4) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: deepBlack }}>
            <p className="text-[13px]" style={{ color: textDim }}>{"\uCEE4\uBC84 \uC0AC\uC9C4\uC744 \uCD94\uAC00\uD574\uC8FC\uC138\uC694"}</p>
          </div>
        )}

        {/* Top: premiere date */}
        <div className="absolute top-8 left-0 right-0 z-10 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase" style={{ color: champagneDim, fontFamily: serifFont }}>
            {helpers.formatWeddingDate()}{data.time ? ` \u00B7 ${data.time}` : ""}
          </p>
        </div>

        {/* Bottom: names */}
        <div className="absolute bottom-0 left-0 right-0 z-10 text-center pb-14 px-8">
          <div className="mb-5">
            <div className="w-px h-10 mx-auto mb-5" style={{ backgroundColor: champagneDim }} />
            <p className="text-[40px] font-light leading-[1.15] tracking-wider" style={{ color: warmWhite, fontFamily: serifFont }}>
              {data.groomName || "\uC2E0\uB791"}
            </p>
            <div className="flex items-center justify-center gap-4 my-3">
              <div className="w-6 h-px" style={{ backgroundColor: champagneDim }} />
              <p className="text-[14px]" style={{ color: champagneDim, fontFamily: serifFont }}>&amp;</p>
              <div className="w-6 h-px" style={{ backgroundColor: champagneDim }} />
            </div>
            <p className="text-[40px] font-light leading-[1.15] tracking-wider" style={{ color: warmWhite, fontFamily: serifFont }}>
              {data.brideName || "\uC2E0\uBD80"}
            </p>
          </div>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? champagne : champagneDim }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION ===== */}
      <div className="px-10 py-16" style={{ backgroundColor: darkSurface }}>
        <SectionHeading title="Invitation" subtitle="We Invite You" />

        {data.invitationTitle && (
          <p className="text-[15px] text-center font-medium mb-5" style={{ color: warmWhite, fontFamily: fontFamily }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p className="text-[13.5px] leading-[2.2] whitespace-pre-line mb-8" style={{ color: textMuted, textAlign: data.messageAlign || "center", fontFamily: fontFamily }}>
            {data.message}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px flex-1 max-w-[50px]" style={{ backgroundColor: borderDark }} />
          <div className="w-1 h-1" style={{ backgroundColor: champagne }} />
          <div className="h-px flex-1 max-w-[50px]" style={{ backgroundColor: borderDark }} />
        </div>

        {data.showNameAtBottom && (() => {
          const groomBlock = (
            <p className="text-[14px] leading-[2.2]" style={{ color: warmWhite, fontFamily: fontFamily }}>
              {data.groomFather?.name && (<><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>)}
              {data.groomMother?.name && (<> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>)}
              {(data.groomFather?.name || data.groomMother?.name) && (
                <span className="text-[11px] tracking-wide" style={{ color: textDim }}> {data.groomRelation || "\uC544\uB4E4"} </span>
              )}
              <span className="font-semibold">{data.groomName || "\uC2E0\uB791"}</span>
            </p>
          )
          const brideBlock = (
            <p className="text-[14px] leading-[2.2]" style={{ color: warmWhite, fontFamily: fontFamily }}>
              {data.brideFather?.name && (<><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>)}
              {data.brideMother?.name && (<> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>)}
              {(data.brideFather?.name || data.brideMother?.name) && (
                <span className="text-[11px] tracking-wide" style={{ color: textDim }}> {data.brideRelation || "\uB538"} </span>
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
            className="px-10 py-3 text-[11px] tracking-[0.2em] uppercase"
            style={{ border: `1px solid ${borderDark}`, color: textMuted, backgroundColor: "transparent" }}>
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
          <div className="px-10 py-16 text-center" style={{ backgroundColor: deepBlack }}>
            <SectionHeading title="Save the Date" subtitle="Wedding Day" />

            {/* Cinematic date display */}
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="text-right">
                <p className="text-[32px] font-light leading-none" style={{ color: champagne, fontFamily: serifFont }}>
                  {String(cal.month).padStart(2, '0')}
                </p>
                <p className="text-[9px] tracking-[0.3em] mt-1" style={{ color: textDim }}>MONTH</p>
              </div>
              <div className="w-px h-14" style={{ backgroundColor: borderDark }} />
              <div className="text-center">
                <p className="text-[52px] font-light leading-none" style={{ color: warmWhite, fontFamily: serifFont }}>
                  {String(cal.weddingDay).padStart(2, '0')}
                </p>
                <p className="text-[9px] tracking-[0.3em] mt-1" style={{ color: textDim }}>DAY</p>
              </div>
              <div className="w-px h-14" style={{ backgroundColor: borderDark }} />
              <div className="text-left">
                <p className="text-[32px] font-light leading-none" style={{ color: champagne, fontFamily: serifFont }}>
                  {String(cal.year).slice(2)}
                </p>
                <p className="text-[9px] tracking-[0.3em] mt-1" style={{ color: textDim }}>YEAR</p>
              </div>
            </div>

            <p className="text-[12px] tracking-[0.15em] mb-8" style={{ color: textMuted }}>
              {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
            </p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto p-6" style={{ maxWidth: "300px", backgroundColor: darkSurface, border: `1px solid ${borderDark}` }}>
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[10px] py-2 text-center tracking-wider" style={{ color: textDim }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 text-[13px] font-semibold" style={{ backgroundColor: champagne, color: deepBlack }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[13px]" style={{ color: i % 7 === 0 ? "#A67B5B" : i % 7 === 6 ? "#6B8CAE" : warmWhite }}>
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
              <div className="mb-8 py-4 mx-auto" style={{ maxWidth: "260px", borderTop: `1px solid ${borderDark}`, borderBottom: `1px solid ${borderDark}` }}>
                <p className="text-[15px] font-light tracking-wide" style={{ color: warmWhite, fontFamily: serifFont }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[12px] mt-1" style={{ color: textMuted }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="mt-4">
                <p className="text-[9px] tracking-[0.5em] uppercase mb-5" style={{ color: champagne }}>Countdown</p>
                <div className="flex items-center justify-center gap-2">
                  {[
                    { label: "DAYS", value: state.countdown.days },
                    { label: "HRS", value: state.countdown.hours },
                    { label: "MIN", value: state.countdown.minutes },
                    { label: "SEC", value: state.countdown.seconds },
                  ].map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="text-center w-14 py-3" style={{ backgroundColor: darkSurface, border: `1px solid ${borderDark}` }}>
                        <p className="text-[22px] font-light leading-none" style={{ color: warmWhite, fontFamily: serifFont }}>
                          {String(item.value).padStart(2, "0")}
                        </p>
                        <p className="text-[7px] tracking-[0.2em] mt-2" style={{ color: textDim }}>{item.label}</p>
                      </div>
                      {idx < 3 && <span className="text-[10px]" style={{ color: borderDark }}>:</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-10" style={{ backgroundColor: darkSurface }}>
          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-2 gap-[2px]">
              {state.galleryImages.map((img, index) => (
                <div key={index} className="aspect-square cursor-pointer overflow-hidden relative group"
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}>
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: "rgba(212,184,150,0.08)" }} />
                </div>
              ))}
            </div>
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

      {/* ===== LOCATION ===== */}
      <div className="px-10 py-16" style={{ backgroundColor: deepBlack }}>
        <SectionHeading title="Location" subtitle="Ceremony" />

        <div className="text-center mb-6">
          <p className="text-[18px] font-light tracking-wide mb-1" style={{ color: warmWhite, fontFamily: serifFont }}>
            {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[12px] mt-2" style={{ color: textMuted }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
          {data.venuePhone && <p className="text-[11px] mt-1" style={{ color: textDim }}>Tel. {data.venuePhone}</p>}
        </div>

        <div className="my-6 overflow-hidden" style={{ border: `1px solid ${borderDark}` }}>
          <MapEmbed address={data.address} height={180} borderColor={borderDark} bgColor={deepBlack} />
        </div>

        <div className="text-center mb-4">
          <button className="px-10 py-3 text-[11px] tracking-[0.2em] uppercase"
            style={{ border: `1px solid ${champagne}`, color: champagne, backgroundColor: "transparent" }}
            data-testid="button-directions" onClick={() => openNaverDirections(data.address)}>
            길찾기
          </button>
        </div>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-10 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderDark}` }}>
                {item.type && <p className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: warmWhite }}>{item.type}</p>}
                {item.detail && <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: textMuted }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="mt-8 pt-4" style={{ borderTop: `1px solid ${borderDark}` }}>
            <p className="text-[12px] whitespace-pre-line leading-[1.9]" style={{ color: textMuted }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <p className="text-[11px] leading-[1.8] mt-5 text-center" style={{ color: textDim }}>
            주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
          </p>
        )}
      </div>

      {/* ===== MID PHOTO ===== */}
      {data.showMidPhoto && data.midPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "300px" }}>
          <img src={data.midPhoto} alt="Mid section" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0) 30%, rgba(8,8,8,0) 70%, rgba(8,8,8,0.3) 100%)" }} />
        </div>
      )}

      {/* ===== RSVP ===== */}
      {data.showRsvp && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: darkSurface }}>
          <SectionHeading title="R.S.V.P" subtitle="Attendance" />

          <p className="text-[13px] leading-[1.9] mb-8 max-w-[280px] mx-auto" style={{ color: textMuted, fontFamily: fontFamily }}>
            {data.rsvpContent || "\uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC2DC\uBA74 \uAC10\uC0AC\uD558\uACA0\uC2B5\uB2C8\uB2E4"}
          </p>

          <button className="px-14 py-3.5 text-[11px] tracking-[0.2em] uppercase"
            style={{ backgroundColor: champagne, color: deepBlack, border: "none" }}
            data-testid="button-rsvp" onClick={() => onRsvpClick?.()}>
            {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-10 py-16" style={{ backgroundColor: deepBlack }}>
          <SectionHeading title="Guest Book" subtitle="Messages" />

          <div className="space-y-3 mb-8">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
                  <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-3" style={{ color: textMuted }}>{entry.message}</p>
                  <div className="w-full h-px mb-2" style={{ backgroundColor: borderDark }} />
                  <p className="text-[11px] tracking-wide" style={{ color: champagneDim }}>- {entry.name}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
                <p className="text-[13px]" style={{ color: textDim }}>축하 메시지를 남겨주세요</p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
              <input type="text" value={state.guestbookName} onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름" className="w-full py-2.5 px-4 text-[13px] mb-3 outline-none"
                style={{ border: `1px solid ${borderDark}`, backgroundColor: darkSurface, color: warmWhite }}
                data-testid="input-guestbook-name" />
              <textarea value={state.guestbookMessage} onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요" rows={4}
                className="w-full py-2.5 px-4 text-[13px] mb-4 outline-none resize-none"
                style={{ border: `1px solid ${borderDark}`, backgroundColor: darkSurface, color: warmWhite }}
                data-testid="input-guestbook-message" />
              <div className="flex gap-3">
                <button onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 text-[11px] tracking-wider uppercase"
                  style={{ border: `1px solid ${borderDark}`, color: textMuted }}
                  data-testid="button-guestbook-cancel">취소</button>
                <button onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[11px] tracking-wider uppercase"
                  style={{ backgroundColor: champagne, color: deepBlack }}
                  data-testid="button-guestbook-submit">등록</button>
              </div>
            </div>
          ) : (
            <button onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3 text-[11px] tracking-[0.2em] uppercase"
              style={{ border: `1px solid ${borderDark}`, color: textMuted, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write">작성하기</button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: darkSurface }}>
          <SectionHeading title="Wedding Fund" subtitle="Celebration" />

          {data.fundingMessage && (
            <p className="text-[13px] leading-[1.9] whitespace-pre-line mb-8 max-w-[280px] mx-auto" style={{ color: textMuted, fontFamily: fontFamily }}>
              {data.fundingMessage}
            </p>
          )}

          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-8">
              <div className="w-[200px] h-[200px] overflow-hidden" style={{ border: `1px solid ${borderDark}` }}>
                <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}

          <button className="px-14 py-3.5 text-[11px] tracking-[0.2em] uppercase"
            style={{ backgroundColor: champagne, color: deepBlack }}
            data-testid="button-funding" onClick={() => openKakaoTransfer()}>
            {data.fundingButtonName || "\uCD95\uC758\uAE08 \uBCF4\uB0B4\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: deepBlack }}>
          <SectionHeading title="Gift" subtitle="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-8" style={{ color: textMuted, fontFamily: fontFamily }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button className="px-14 py-3.5 text-[11px] tracking-[0.2em] uppercase"
              style={{ backgroundColor: champagne, color: deepBlack }}
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
                  <p className="text-[13px]" style={{ color: warmWhite }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textDim }}>{acc!.holder}</p>
                </div>
                <button onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-4 py-1.5 text-[10px] tracking-wider uppercase"
                  style={{ border: `1px solid ${borderDark}`, color: champagne }}
                  data-testid={`button-copy-account-${i}`}>복사</button>
              </div>
            ))}
          </div>
        )
        return (
          <div className="px-10 py-16" style={{ backgroundColor: darkSurface }}>
            <SectionHeading title="Account" subtitle="Send a Gift" />
            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1px solid ${borderDark}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-groom">
                      <p className="text-[12px] tracking-[0.1em] uppercase" style={{ color: warmWhite }}>신랑측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderDark}` }}>{renderAccList(groomAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
                    <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: champagne }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}
              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1px solid ${borderDark}` }}>
                    <button onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5" data-testid="accordion-bride">
                      <p className="text-[12px] tracking-[0.1em] uppercase" style={{ color: warmWhite }}>신부측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid ${borderDark}` }}>{renderAccList(brideAccList)}</div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
                    <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: champagne }}>신부측</p>
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
        <div className="px-10 py-12 text-center" style={{ backgroundColor: deepBlack }}>
          <SectionHeading title="Baptismal Name" />
          <div className="flex justify-center gap-14">
            <div className="space-y-1">
              {data.baptismalGroom && <p className="text-[13px] font-semibold" style={{ color: warmWhite }}>{data.baptismalGroom}</p>}
              {data.baptismalGroomFather && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalGroomFather}</p>}
              {data.baptismalGroomMother && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalGroomMother}</p>}
            </div>
            <div className="space-y-1">
              {data.baptismalBride && <p className="text-[13px] font-semibold" style={{ color: warmWhite }}>{data.baptismalBride}</p>}
              {data.baptismalBrideFather && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalBrideFather}</p>}
              {data.baptismalBrideMother && <p className="text-[12px]" style={{ color: textMuted }}>{data.baptismalBrideMother}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: darkSurface }}>
          <SectionHeading title="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.9] mb-8" style={{ color: textMuted }}>{data.guestSnapContent}</p>
          )}
          <button className="px-10 py-3 text-[11px] tracking-[0.2em] uppercase"
            style={{ border: `1px solid ${borderDark}`, color: textMuted, backgroundColor: "transparent" }}
            data-testid="button-guest-snap"
            onClick={onGuestSnapUpload}>사진 업로드</button>
          {state.guestSnapPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-6">
              {state.guestSnapPhotos.map((photo, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt={`Guest snap ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-10 py-16 text-center" style={{ backgroundColor: deepBlack }}>
          <SectionHeading title={data.noticeTitle} subtitle="Notice" />
          <div className="max-w-[280px] mx-auto">
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] leading-[1.9] mb-1" style={{ color: textMuted }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || warmWhite
        return (
          <>
            {(eStyle === "full" || eStyle === "simple") && data.endingPhoto ? (
              <div className="relative w-full overflow-hidden" style={{ minHeight: "440px" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: "440px" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.6) 100%)" }} />
                <div className="relative z-10 flex flex-col items-center justify-end px-10 pb-14" style={{ minHeight: "440px" }}>
                  {data.endingContent && (
                    <p className="text-[14px] leading-[2.2] text-center whitespace-pre-line mb-6" style={{ color: endTextColor, fontFamily: fontFamily }}>
                      {data.endingContent}
                    </p>
                  )}
                  <div className="w-px h-6 mb-4" style={{ backgroundColor: champagneDim }} />
                  <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: champagneDim }}>Thank You</p>
                  <p className="text-[28px] font-light" style={{ color: warmWhite, fontFamily: serifFont }}>
                    {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-10 py-16 text-center" style={{ backgroundColor: darkSurface }}>
                {data.endingPhoto && (
                  <div className="mx-auto max-w-[260px] mb-8 overflow-hidden" style={{ border: `1px solid ${borderDark}` }}>
                    <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
                  </div>
                )}
                {data.endingContent && (
                  <p className="text-[14px] leading-[2.2] whitespace-pre-line mb-8 max-w-[280px] mx-auto" style={{ color: textMuted, fontFamily: fontFamily }}>
                    {data.endingContent}
                  </p>
                )}
                <div className="w-px h-6 mx-auto mb-4" style={{ backgroundColor: champagneDim }} />
                <p className="text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: champagne }}>Thank You</p>
                <p className="text-[26px] font-light" style={{ color: warmWhite, fontFamily: serifFont }}>
                  {data.groomName || "\uC2E0\uB791"} &amp; {data.brideName || "\uC2E0\uBD80"}
                </p>
              </div>
            )}
          </>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-10 pb-8 pt-6 text-center" style={{ backgroundColor: deepBlack }}>
        <button onClick={helpers.copyLink}
          className="w-full py-3.5 text-[11px] tracking-[0.2em] uppercase"
          style={{ border: `1px solid ${borderDark}`, color: textMuted, backgroundColor: "transparent" }}
          data-testid="button-copy-link">
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ backgroundColor: deepBlack }}>
        <div className="pb-4 pt-2 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8" style={{ backgroundColor: borderDark }} />
            <div className="w-1 h-1" style={{ backgroundColor: champagne }} />
            <div className="h-px w-8" style={{ backgroundColor: borderDark }} />
          </div>
          <p className="text-[8px] tracking-[0.5em] uppercase mt-3" style={{ color: textDim }}>WE:BEAT</p>
        </div>
        <FilmStrip />
        <div className="h-4" />
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-[320px] p-7 relative" style={{ backgroundColor: darkCard, border: `1px solid ${borderDark}` }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-4 right-4" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textDim }} />
            </button>
            <div className="mb-6">
              <p className="text-[9px] tracking-[0.4em] uppercase mb-2" style={{ color: champagne }}>Get in Touch</p>
              <p className="text-[18px] font-light tracking-wide" style={{ color: warmWhite, fontFamily: serifFont }}>Contact</p>
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
                    <p className="text-[10px] tracking-wider uppercase" style={{ color: textDim }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: warmWhite }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${borderDark}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-3.5 h-3.5" style={{ color: textMuted }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")}
                      className="w-9 h-9 flex items-center justify-center"
                      style={{ border: `1px solid ${borderDark}` }} data-testid={`button-copy-phone-${i}`}>
                      <Copy className="w-3.5 h-3.5" style={{ color: textMuted }} />
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
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }} data-testid="button-close-viewer">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={state.galleryImages[state.viewerIndex]} alt={`Gallery ${state.viewerIndex + 1}`} className="max-w-full max-h-[80vh] object-contain" />
          {state.viewerIndex > 0 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }} data-testid="button-viewer-prev">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {state.viewerIndex < state.galleryImages.length - 1 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }} data-testid="button-viewer-next">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[13px] text-white/50">{state.viewerIndex + 1} / {state.galleryImages.length}</p>
          </div>
        </div>
      )}

      {/* ===== COPIED TOAST ===== */}
      {state.copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-[13px] font-medium shadow-lg"
          style={{ backgroundColor: champagne, color: deepBlack }}>
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
