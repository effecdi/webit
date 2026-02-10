"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function CalligraphyLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const bg = "#FBF8F4"
  const cardBg = "#FFFFFF"
  const sectionBg = "#F5F0E8"
  const textPrimary = "#3D3226"
  const textSecondary = "#7A6E62"
  const accent = "#9C7B5C"
  const accentLight = "#D4C5B0"
  const borderColor = "#E8DFD2"
  const buttonBg = "#9C7B5C"
  const buttonText = "#FFFFFF"
  const fontFamily = getKoreanFont(data, "'MaruBuri', Georgia, serif")
  const englishFont = getEnglishFont(data, "'Great Vibes', 'Dancing Script', cursive")

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="text-center mb-8">
      <p
        className="text-[32px] leading-none"
        style={{ color: accent, fontFamily: englishFont }}
      >
        {title}
      </p>
      {subtitle && (
        <p className="text-[12px] mt-2 tracking-[0.15em]" style={{ color: textSecondary }}>
          {subtitle}
        </p>
      )}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="w-12 h-[1px]" style={{ backgroundColor: accentLight }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <div className="w-12 h-[1px]" style={{ backgroundColor: accentLight }} />
      </div>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "620px", background: `linear-gradient(180deg, ${bg} 0%, #F0E8DC 100%)` }}>
        <div className="absolute top-6 left-0 right-0 z-10 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase" style={{ color: textSecondary }}>
            Wedding Invitation
          </p>
        </div>
        {state.allPhotos.length > 0 ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center p-6 pt-12 pb-20">
              <div className="relative w-full max-w-[320px]" style={{ aspectRatio: "3/4" }}>
                <div
                  className="absolute inset-0 rounded-[2px]"
                  style={{ border: `1px solid ${accentLight}`, transform: "rotate(2deg)" }}
                />
                <div
                  className="absolute inset-0 rounded-[2px]"
                  style={{ border: `1px solid ${accentLight}`, transform: "rotate(-1deg)" }}
                />
                <div className="relative w-full h-full overflow-hidden rounded-[2px]" style={{ border: `1px solid ${accentLight}` }}>
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
            </div>
            {state.allPhotos.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {state.allPhotos.map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? accent : accentLight }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center" style={{ minHeight: "620px" }}>
            <p className="text-[14px]" style={{ color: textSecondary, opacity: 0.6 }}>커버 사진을 추가해주세요</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10 text-center pb-6">
          <p className="text-[28px]" style={{ color: textPrimary, fontFamily }}>
            {data.groomName || "신랑"} <span className="text-[16px] mx-1" style={{ color: accent, fontFamily: englishFont }}>&</span> {data.brideName || "신부"}
          </p>
          <p className="text-[12px] mt-2 tracking-wide" style={{ color: textSecondary }}>
            {helpers.formatWeddingDate()}
          </p>
        </div>
      </div>

      {/* ===== INVITATION TEXT ===== */}
      <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
        <SectionTitle title="Invitation" subtitle="소중한 분들을 초대합니다" />
        {data.invitationTitle && (
          <p className="text-center text-[15px] font-medium mb-4" style={{ color: textPrimary }}>
            {data.invitationTitle}
          </p>
        )}
        {data.message && (
          <p
            className="text-center text-[14px] leading-[2] whitespace-pre-line"
            style={{ color: textSecondary, textAlign: data.messageAlign || "center" }}
          >
            {data.message}
          </p>
        )}

        {data.showNameAtBottom && (() => {
          const groomBlock = (
            <p className="text-[14px] leading-[2.2]" style={{ color: textPrimary }}>
              {data.groomFather?.name && (
                <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
              )}
              {data.groomMother?.name && (
                <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
              )}
              {(data.groomFather?.name || data.groomMother?.name) && (
                <span className="text-[12px] ml-1" style={{ color: textSecondary }}> {data.groomRelation || "아들"} </span>
              )}
              <span style={{ color: accent }}>{data.groomName || "신랑"}</span>
            </p>
          )
          const brideBlock = (
            <p className="text-[14px] leading-[2.2]" style={{ color: textPrimary }}>
              {data.brideFather?.name && (
                <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
              )}
              {data.brideMother?.name && (
                <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
              )}
              {(data.brideFather?.name || data.brideMother?.name) && (
                <span className="text-[12px] ml-1" style={{ color: textSecondary }}> {data.brideRelation || "딸"} </span>
              )}
              <span style={{ color: accent }}>{data.brideName || "신부"}</span>
            </p>
          )
          const nameStyle = data.nameDisplayStyle || "horizontal"
          const first = data.brideFirst ? brideBlock : groomBlock
          const second = data.brideFirst ? groomBlock : brideBlock

          return (
            <div className="mt-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-[1px]" style={{ backgroundColor: accentLight }} />
                <span className="text-[11px] tracking-[0.2em]" style={{ color: textSecondary }}>혼주</span>
                <div className="w-8 h-[1px]" style={{ backgroundColor: accentLight }} />
              </div>
              {nameStyle === "vertical" ? (
                <div className="text-center mt-2">
                  <div className="flex justify-center gap-12">
                    <div className="space-y-1">{first}</div>
                    <div className="space-y-1">{second}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 mt-2">
                  {first}
                  {second}
                </div>
              )}
            </div>
          )
        })()}

        <button
          data-testid="button-contact"
          onClick={() => state.setShowContact(true)}
          className="w-[200px] mx-auto block py-3 rounded-[16px] text-[14px] mt-8"
          style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: cardBg }}
        >
          연락하기
        </button>
      </div>

      {/* ===== CALENDAR / D-DAY ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-8 py-14" style={{ backgroundColor: sectionBg, fontFamily }}>
            <SectionTitle title="Calendar" />
            <div className="text-center mb-4">
              <p className="text-[18px] font-medium" style={{ color: textPrimary }}>
                {helpers.formatWeddingDate()}
              </p>
              <p className="text-[14px] mt-1" style={{ color: textSecondary }}>
                {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
              </p>
            </div>

            {data.showCalendar && calStyle === "full" && (
              <div className="rounded-[16px] p-6 mb-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[12px] py-2 text-center" style={{ color: d === "일" ? "#C07070" : d === "토" ? "#5A8CB0" : textSecondary }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2.5 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-medium" style={{ backgroundColor: accent, color: "#fff" }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[14px]" style={{ color: i % 7 === 0 ? "#C07070" : i % 7 === 6 ? "#5A8CB0" : textPrimary }}>
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
                <p className="text-[18px] font-medium text-center" style={{ color: textPrimary }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[14px] mt-1 text-center" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="text-center mt-4">
                <p className="text-[13px]" style={{ color: textSecondary }}>
                  {data.groomName || "신랑"} <span style={{ color: accent }}>&</span> {data.brideName || "신부"}의 결혼식까지
                </p>
                <div className="flex items-center justify-center gap-0 mt-3">
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>DAYS</p>
                    <p className="text-[28px] font-light" style={{ color: accent, fontFamily: englishFont }}>{state.countdown.days}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>HOUR</p>
                    <p className="text-[28px] font-light" style={{ color: accent, fontFamily: englishFont }}>{state.countdown.hours}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>MIN</p>
                    <p className="text-[28px] font-light" style={{ color: accent, fontFamily: englishFont }}>{state.countdown.minutes}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>SEC</p>
                    <p className="text-[28px] font-light" style={{ color: accent, fontFamily: englishFont }}>{state.countdown.seconds}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
          <SectionTitle title="Gallery" subtitle="우리의 아름다운 순간들" />

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-2 gap-2">
              {state.galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-[4px] cursor-pointer"
                  style={{ border: `1px solid ${borderColor}` }}
                  onClick={() => { state.setViewerIndex(i); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-image-${i}`}
                >
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <div className="flex gap-2 px-2">
                {state.galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="w-[160px] h-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[4px]"
                    style={{ border: `1px solid ${borderColor}` }}
                    onClick={() => { state.setViewerIndex(i); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-image-${i}`}
                  >
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== LOCATION ===== */}
      <div className="px-8 py-14" style={{ backgroundColor: sectionBg, fontFamily }}>
        <SectionTitle title="Location" subtitle="오시는 길" />

        <div className="text-center mb-6">
          <p className="text-[18px] font-medium mb-2" style={{ color: textPrimary }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[14px]" style={{ color: textSecondary }}>{data.address || "주소를 입력해주세요"}</p>
          {data.venuePhone && (
            <p className="text-[13px] mt-1" style={{ color: textSecondary }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <MapEmbed address={data.address} height={200} borderColor={borderColor} bgColor={cardBg} />

        <button
          className="w-full py-3.5 rounded-[16px] text-[14px] mt-4 mb-4"
          style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: cardBg }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-2 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="rounded-[16px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                {item.type && <p className="text-[15px] font-bold mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="rounded-[16px] p-5 mt-2" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-4 rounded-[16px] p-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <p className="text-[13px] leading-[1.8]" style={{ color: textSecondary }}>
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

      {/* ===== RSVP ===== */}
      {data.showRsvp && (
        <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
          <SectionTitle title="RSVP" subtitle="참석 의사를 전해주세요" />
          <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>
            {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
          </p>
          <button
            onClick={() => onRsvpClick?.()}
            className="w-full py-4 rounded-[16px] text-[15px] font-medium"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-rsvp"
          >
            {data.rsvpButtonName || "참석 의사 전달하기"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg, fontFamily }}>
          <SectionTitle title="Guestbook" subtitle="축하 메시지를 남겨주세요" />
          <div className="space-y-3">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="rounded-[16px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium" style={{ color: textPrimary }}>{entry.name}</span>
                    <span className="text-[11px]" style={{ color: textSecondary }}>{entry.date}</span>
                  </div>
                  <p className="text-[13px] leading-[1.7]" style={{ color: textSecondary }}>{entry.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[16px] p-6 text-center" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <p className="text-[14px] leading-[1.8]" style={{ color: textSecondary }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>
          {!state.showGuestbookForm ? (
            <button
              onClick={() => state.setShowGuestbookForm(true)}
              className="w-full mt-4 py-3.5 rounded-[16px] text-[14px] font-medium"
              style={{ border: `1px solid ${borderColor}`, color: accent, backgroundColor: cardBg }}
              data-testid="button-write-guestbook"
            >
              축하 메시지 작성하기
            </button>
          ) : (
            <div className="mt-4 rounded-[16px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <input
                type="text"
                placeholder="이름"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                className="w-full px-4 py-3 rounded-[10px] text-[14px] mb-2 outline-none"
                style={{ backgroundColor: sectionBg, color: textPrimary, border: `1px solid ${borderColor}` }}
                data-testid="input-guestbook-name"
              />
              <textarea
                placeholder="축하 메시지를 남겨주세요"
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-[10px] text-[14px] mb-3 outline-none resize-none"
                style={{ backgroundColor: sectionBg, color: textPrimary, border: `1px solid ${borderColor}`, minHeight: "100px" }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-3 rounded-[10px] text-[13px]"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary }}
                  data-testid="button-cancel-guestbook"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-3 rounded-[10px] text-[13px] font-medium"
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid="button-submit-guestbook"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
          <SectionTitle title="Wishlist" subtitle="마음을 전해주세요" />

          {data.fundingMessage && (
            <p className="text-[15px] text-center font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary }}>
              {data.fundingMessage}
            </p>
          )}

          <div className="flex justify-center mb-6">
            {data.fundingImageType === "custom" && data.fundingImage ? (
              <div className="w-[200px] h-[200px] rounded-[12px] overflow-hidden">
                <img src={data.fundingImage} alt="펀딩" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            ) : (
              <div className="w-[200px] h-[240px] flex items-center justify-center">
                <svg viewBox="0 0 200 200" width="200" height="200" fill="none">
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
            className="w-full py-3.5 rounded-[16px] text-[14px] font-medium mb-4"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[12px] text-center leading-[1.6]" style={{ color: textSecondary }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg, fontFamily }}>
          <SectionTitle title="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[14px] leading-[2] text-center whitespace-pre-line mb-6" style={{ color: textSecondary }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3.5 rounded-[16px] text-[14px] font-medium"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-gift-funding"
              onClick={() => openKakaoGift()}
            >
              {data.giftFundingButtonName}
            </button>
          )}
        </div>
      )}

      {/* ===== ACCOUNT (축의금) ===== */}
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
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                  className="px-3 py-1.5 rounded-full text-[11px]"
                  style={{ backgroundColor: sectionBg, color: accent }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
            <SectionTitle title="Gift" subtitle="축하의 마음을 전해주세요" />

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신랑측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textSecondary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
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
                  <div className="rounded-[16px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <p className="text-[12px] font-medium mb-4" style={{ color: accent }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-[16px] overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신부측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textSecondary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
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
                  <div className="rounded-[16px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <p className="text-[12px] font-medium mb-4" style={{ color: accent }}>신부측</p>
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
        <div className="px-8 py-10 text-center" style={{ backgroundColor: sectionBg, fontFamily }}>
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
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-8 py-14" style={{ backgroundColor: bg, fontFamily }}>
          <SectionTitle title="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[14px] text-center whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3.5 rounded-[16px] text-[14px]"
            style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: cardBg }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg, fontFamily }}>
          <SectionTitle title="Notice" subtitle="알려드립니다" />
          <p className="text-[18px] font-medium text-center mb-4" style={{ color: accent }}>{data.noticeTitle}</p>
          {data.noticeItems?.filter(Boolean).map((item, i) => (
            <p key={i} className="text-[14px] text-center leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
          ))}
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textSecondary
        return (
          <div className="px-8 py-16" style={{ backgroundColor: bg, fontFamily }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-[1px]" style={{ backgroundColor: accentLight }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
              <div className="w-16 h-[1px]" style={{ backgroundColor: accentLight }} />
            </div>

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
              <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
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
              <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
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
                    <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: accent }} />
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                      {data.endingContent}
                    </p>
                  </div>
                )}
              </>
            )}

            <p className="text-[22px] mt-6 text-center" style={{ color: accent, fontFamily: englishFont }}>
              Thank You
            </p>
          </div>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-6 pb-10 pt-4" style={{ backgroundColor: bg }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-4 rounded-[16px] text-[14px]"
          style={{ backgroundColor: sectionBg, color: textSecondary }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-8 py-8 text-center" style={{ backgroundColor: bg }}>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-[1px]" style={{ backgroundColor: accentLight }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <div className="w-12 h-[1px]" style={{ backgroundColor: accentLight }} />
        </div>
        <p className="text-[10px] tracking-[0.15em]" style={{ color: accent }}>
          MADE WITH WE:BEAT
        </p>
      </div>

      {/* ===== PHOTO VIEWER ===== */}
      {state.showPhotoViewer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => state.setShowPhotoViewer(false)}>
          <button
            onClick={(e) => { e.stopPropagation(); state.setShowPhotoViewer(false) }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white z-10"
            data-testid="button-close-viewer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={state.galleryImages[state.viewerIndex]}
              alt={`Photo ${state.viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {state.galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); state.setViewerIndex((state.viewerIndex - 1 + state.galleryImages.length) % state.galleryImages.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                data-testid="button-viewer-prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); state.setViewerIndex((state.viewerIndex + 1) % state.galleryImages.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                data-testid="button-viewer-next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => state.setShowContact(false)}>
          <div
            className="w-full max-w-[420px] rounded-t-[24px] p-6 pb-8"
            style={{ backgroundColor: cardBg }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: borderColor }} />
            <p className="text-[16px] font-medium mb-4 text-center" style={{ color: textPrimary }}>연락하기</p>
            <div className="space-y-3">
              {data.groomPhone && (
                <a href={`tel:${data.groomPhone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }} data-testid="link-contact-groom">
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신랑 {data.groomName}</span>
                </a>
              )}
              {data.bridePhone && (
                <a href={`tel:${data.bridePhone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }} data-testid="link-contact-bride">
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신부 {data.brideName}</span>
                </a>
              )}
              {data.groomFather?.phone && (
                <a href={`tel:${data.groomFather.phone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }}>
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신랑 아버지 {data.groomFather.name}</span>
                </a>
              )}
              {data.groomMother?.phone && (
                <a href={`tel:${data.groomMother.phone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }}>
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신랑 어머니 {data.groomMother.name}</span>
                </a>
              )}
              {data.brideFather?.phone && (
                <a href={`tel:${data.brideFather.phone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }}>
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신부 아버지 {data.brideFather.name}</span>
                </a>
              )}
              {data.brideMother?.phone && (
                <a href={`tel:${data.brideMother.phone}`} className="flex items-center gap-3 p-4 rounded-[12px]" style={{ backgroundColor: sectionBg }}>
                  <Phone className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-[14px]" style={{ color: textPrimary }}>신부 어머니 {data.brideMother.name}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {state.copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-lg" style={{ backgroundColor: textPrimary }}>
          <p className="text-[13px]" style={{ color: bg }}>복사되었습니다</p>
        </div>
      )}
    </>
  )
}
