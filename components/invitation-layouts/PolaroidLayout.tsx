"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"

export function PolaroidLayout({ data, state, helpers }: LayoutProps) {
  const pageBg = "#F0F0F0"
  const textPrimary = "#191F28"
  const textSecondary = "#6B7280"
  const accent = "#8B6F5C"
  const buttonBg = "#8B6F5C"
  const buttonText = "#FFFFFF"

  const frosted = "backdrop-blur-xl"
  const frostedBg = "rgba(255,255,255,0.7)"
  const semiBg = "rgba(255,255,255,0.8)"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-6 text-center">
      <h2
        className="text-[20px] tracking-wide font-light"
        style={{ color: textPrimary }}
      >
        {title}
      </h2>
      <div
        className="w-8 h-[2px] mt-3 mx-auto rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "100dvh" }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <img src={state.allPhotos[0]} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: pageBg }}>
            <p className="text-[14px]" style={{ color: textSecondary }}>커버 사진을 추가해주세요</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-8">
          <div className={`${frosted} rounded-2xl p-6 text-center`} style={{ backgroundColor: frostedBg }}>
            <p className="text-[22px] font-medium" style={{ color: textPrimary }}>
              {data.groomName || "신랑"} <span className="font-light text-[16px] mx-2" style={{ color: textSecondary }}>&</span> {data.brideName || "신부"}
            </p>
            <div className="w-8 h-[1px] mx-auto my-3" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <p className="text-[13px]" style={{ color: textSecondary }}>
              {helpers.formatWeddingDate()}{data.time ? " | " + data.time : ""}
            </p>
            <p className="text-[12px] mt-1" style={{ color: textSecondary }}>
              {data.venue || ""}
            </p>
          </div>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" style={{ bottom: "4px" }}>
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
        <SectionTitle title="Invitation" />

        {data.invitationTitle && (
          <p className="text-[18px] text-center font-medium mb-6" style={{ color: textPrimary }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p
            className="text-[14px] leading-[2.2] whitespace-pre-line mb-6"
            style={{ color: textSecondary, textAlign: data.messageAlign || "center" }}
          >
            {data.message}
          </p>
        )}

        <div className="w-10 h-[1px] mx-auto my-6" style={{ backgroundColor: accent, opacity: 0.3 }} />

        {data.showNameAtBottom && (() => {
          const groomBlock = (
            <p className="text-[15px] leading-relaxed" style={{ color: textPrimary }}>
              {data.groomFather?.name && (
                <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
              )}
              {data.groomMother?.name && (
                <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
              )}
              {(data.groomFather?.name || data.groomMother?.name) && (
                <span className="text-[13px]" style={{ color: textSecondary }}> {data.groomRelation || "아들"} </span>
              )}
              <span className="font-bold">{data.groomName || "신랑"}</span>
            </p>
          )
          const brideBlock = (
            <p className="text-[15px] leading-relaxed" style={{ color: textPrimary }}>
              {data.brideFather?.name && (
                <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
              )}
              {data.brideMother?.name && (
                <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
              )}
              {(data.brideFather?.name || data.brideMother?.name) && (
                <span className="text-[13px]" style={{ color: textSecondary }}> {data.brideRelation || "딸"} </span>
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
          onClick={() => state.setShowContact(true)}
          className={`w-[200px] mx-auto block py-3 rounded-full text-[14px] ${frosted}`}
          style={{ backgroundColor: frostedBg, color: textSecondary, border: "none" }}
        >
          연락하기
        </button>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div style={{ backgroundColor: "transparent" }}>
          <div className="px-8 py-6">
            <SectionTitle title="Gallery" />
          </div>

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-3 gap-0">
              {state.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer overflow-hidden"
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
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
            <div className="overflow-x-auto">
              <div className="flex gap-0">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[75vw] max-w-[320px] h-[400px] flex-shrink-0 cursor-pointer overflow-hidden"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
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
          <div className="px-6 py-14 text-center" style={{ backgroundColor: pageBg }}>
            <SectionTitle title="Calendar" />

            <div className={`${frosted} rounded-2xl p-6 mx-auto max-w-[360px]`} style={{ backgroundColor: frostedBg }}>
              <p className="text-[20px] font-light mb-2" style={{ color: textPrimary }}>{helpers.formatWeddingDate()}</p>
              <p className="text-[14px] mb-6" style={{ color: textSecondary }}>
                {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
              </p>

              {data.showCalendar && calStyle === "full" && (
                <div className="mb-4">
                  <div className="grid grid-cols-7 gap-0 mb-2">
                    {cal.dayNames.map((d) => (
                      <div key={d} className="text-[12px] py-2 text-center font-medium" style={{ color: textSecondary }}>{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0">
                    {cal.days.map((day, i) => (
                      <div key={i} className="py-2.5 text-center">
                        {day !== null && (
                          day === cal.weddingDay ? (
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-medium" style={{ backgroundColor: accent, color: buttonText }}>
                              {day}
                            </span>
                          ) : (
                            <span className="text-[14px]" style={{ color: i % 7 === 0 ? accent : i % 7 === 6 ? "#3182F6" : textPrimary }}>
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
                <div className="mb-4 py-4" style={{ borderTop: `1px solid rgba(139,111,92,0.2)`, borderBottom: `1px solid rgba(139,111,92,0.2)` }}>
                  <p className="text-[18px] font-medium" style={{ color: textPrimary }}>
                    {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                  </p>
                  <p className="text-[14px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
                </div>
              )}

              {data.showCountdown && (
                <div className="flex items-center justify-center gap-0 mt-2">
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>DAYS</p>
                    <p className="text-[28px] font-light" style={{ color: accent }}>{state.countdown.days}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>HOUR</p>
                    <p className="text-[28px] font-light" style={{ color: accent }}>{state.countdown.hours}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>MIN</p>
                    <p className="text-[28px] font-light" style={{ color: accent }}>{state.countdown.minutes}</p>
                  </div>
                  <span className="text-[24px] font-light pb-1" style={{ color: accent }}>:</span>
                  <div className="text-center w-16">
                    <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>SEC</p>
                    <p className="text-[28px] font-light" style={{ color: accent }}>{state.countdown.seconds}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
        <SectionTitle title="Location" />

        <div className="text-center mb-6">
          <p className="text-[18px] font-medium mb-2" style={{ color: textPrimary }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[14px]" style={{ color: textSecondary }}>{data.address || "주소를 입력해주세요"}</p>
          {data.venuePhone && (
            <p className="text-[13px] mt-1" style={{ color: textSecondary }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <div className={`${frosted} rounded-2xl h-[200px] flex items-center justify-center mb-4 relative overflow-hidden`} style={{ backgroundColor: frostedBg }}>
          <div className="text-center">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" className="mx-auto mb-2">
              <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0zm0 22c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill={accent}/>
            </svg>
            <p className="text-[12px]" style={{ color: textSecondary }}>지도 영역</p>
          </div>
        </div>

        <button
          className={`w-full py-3.5 rounded-full text-[14px] mb-6 ${frosted}`}
          style={{ backgroundColor: frostedBg, color: textPrimary, border: "none" }}
          data-testid="button-directions"
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-2 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid rgba(139,111,92,0.2)` }}>
                {item.type && <p className="text-[15px] font-bold mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="pt-4" style={{ borderTop: `1px solid rgba(139,111,92,0.2)` }}>
            <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className={`mt-6 p-4 rounded-2xl ${frosted}`} style={{ backgroundColor: frostedBg }}>
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

      {/* ===== RSVP SECTION ===== */}
      {data.showRsvp && (
        <div className="px-6 py-14" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="R.S.V.P" />

          <div className={`${frosted} rounded-2xl p-8 text-center mx-auto max-w-[360px]`} style={{ backgroundColor: frostedBg }}>
            <p className="text-[18px] font-medium mb-4" style={{ color: textPrimary }}>{data.rsvpTitle || "참석 의사"}</p>

            <div className="flex justify-center mb-4">
              <div className="py-4 px-8 rounded-xl" style={{ backgroundColor: "rgba(139,111,92,0.08)" }}>
                <p className="text-[14px] tracking-[0.15em] font-semibold" style={{ color: accent }}>
                  R.S.V.P
                </p>
              </div>
            </div>

            <p className="text-[13px] mb-6" style={{ color: textSecondary }}>
              {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
            </p>

            <button
              className="w-full py-3.5 rounded-full text-[14px] border-0"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-rsvp"
            >
              {data.rsvpButtonName || "참석 의사 전달하기"}
            </button>
          </div>
        </div>
      )}

      {/* ===== GUESTBOOK SECTION ===== */}
      {data.showGuestbook && (
        <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
          <SectionTitle title="Guest Book" />

          <div className="space-y-4 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className={`p-5 text-center relative rounded-2xl ${frosted}`}
                  style={{ backgroundColor: frostedBg }}
                >
                  <p className="text-[14px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <p className="text-[12px]" style={{ color: textSecondary }}>- {entry.name} -</p>
                </div>
              ))
            ) : (
              <div
                className={`p-6 text-center rounded-2xl ${frosted}`}
                style={{ backgroundColor: frostedBg }}
              >
                <p className="text-[14px] leading-[1.8]" style={{ color: textSecondary }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className={`p-5 rounded-2xl mb-4 ${frosted}`} style={{ backgroundColor: frostedBg }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-3 rounded-lg text-[14px] mb-3 outline-none"
                style={{ border: `1px solid rgba(139,111,92,0.2)`, backgroundColor: "rgba(255,255,255,0.6)", color: textPrimary }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-3 rounded-lg text-[14px] mb-3 outline-none resize-none"
                style={{ border: `1px solid rgba(139,111,92,0.2)`, backgroundColor: "rgba(255,255,255,0.6)", color: textPrimary }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 rounded-full text-[13px]"
                  style={{ backgroundColor: "rgba(255,255,255,0.5)", color: textSecondary, border: "none" }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 rounded-full text-[13px]"
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid="button-guestbook-submit"
                >
                  등록하기
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => state.setShowGuestbookForm(true)}
              className={`w-full py-3.5 rounded-full text-[14px] ${frosted}`}
              style={{ backgroundColor: frostedBg, color: textSecondary, border: "none" }}
              data-testid="button-guestbook-write"
            >
              작성하기
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING SECTION ===== */}
      {data.showFunding && (
        <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
          <SectionTitle title="Funding" />

          {data.fundingMessage && (
            <p className="text-[15px] text-center font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary }}>
              {data.fundingMessage}
            </p>
          )}

          <div className="flex justify-center mb-6">
            <div className="w-[200px] h-[200px] flex items-center justify-center">
              <svg viewBox="0 0 200 200" width="160" height="160" fill="none">
                <path d="M60 180c-5-5 0-20 15-35s30-20 40-15 15 20 5 35-25 20-35 15z" stroke={accent} strokeWidth="1" fill="none"/>
                <path d="M80 145l-5-80c0-5 3-10 8-12l20-8" stroke={accent} strokeWidth="1" fill="none"/>
                <rect x="70" y="50" width="18" height="26" rx="3" stroke={accent} strokeWidth="1" fill="none"/>
                <circle cx="80" cy="45" r="10" stroke={accent} strokeWidth="1" fill="none"/>
                <path d="M130 175c5-5 0-20-15-35s-30-20-40-15-15 20-5 35 25 20 35 15z" stroke={accent} strokeWidth="1" fill="none"/>
                <path d="M110 140l10-70c0-5-3-10-8-12l-15-5" stroke={accent} strokeWidth="1" fill="none"/>
                <path d="M105 55q15-5 20 5t-5 20" stroke={accent} strokeWidth="1" fill="none"/>
                <circle cx="120" cy="45" r="10" stroke={accent} strokeWidth="1" fill="none"/>
              </svg>
            </div>
          </div>

          <button
            className="w-full py-3.5 rounded-full text-[14px] font-medium mb-4"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[12px] text-center leading-[1.6]" style={{ color: textSecondary }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING SECTION ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: pageBg }}>
          <SectionTitle title="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[14px] leading-[2] text-center whitespace-pre-line mb-6" style={{ color: textSecondary }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3.5 rounded-full text-[14px] font-medium"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-gift-funding"
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
              <div key={i} className="flex justify-between items-center py-1">
                <div>
                  <p className="text-[14px]" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: textSecondary }}>{acc!.holder}</p>
                </div>
                <button
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: "rgba(139,111,92,0.1)", color: accent, border: "none" }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
            <SectionTitle title="Account" />
            <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>축하의 마음을 전해주세요</p>

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className={`rounded-2xl overflow-hidden ${frosted}`} style={{ backgroundColor: frostedBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신랑측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: accent }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid rgba(139,111,92,0.15)` }}>
                        {renderAccList(groomAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-5 ${frosted}`} style={{ backgroundColor: frostedBg }}>
                    <p className="text-[12px] font-medium mb-4" style={{ color: accent }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className={`rounded-2xl overflow-hidden ${frosted}`} style={{ backgroundColor: frostedBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신부측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: accent }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-5 pb-5" style={{ borderTop: `1px solid rgba(139,111,92,0.15)` }}>
                        {renderAccList(brideAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-2xl p-5 ${frosted}`} style={{ backgroundColor: frostedBg }}>
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
        <div className="px-8 py-10 text-center" style={{ backgroundColor: pageBg }}>
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
        <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
          <SectionTitle title="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[14px] text-center whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className={`w-full py-3.5 rounded-full text-[14px] ${frosted}`}
            style={{ backgroundColor: frostedBg, color: textSecondary, border: "none" }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE SECTION ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className={`px-8 py-14 ${frosted}`} style={{ backgroundColor: semiBg }}>
          <SectionTitle title="Notice" />
          <p className="text-[16px] font-medium text-center mb-4" style={{ color: textPrimary }}>{data.noticeTitle}</p>
          {data.noticeItems?.filter(Boolean).map((item, i) => (
            <p key={i} className="text-[14px] text-center leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
          ))}
        </div>
      )}

      {/* ===== ENDING SECTION ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || "#FFFFFF"
        return (
          <>
            {eStyle === "card" && (
              <div className="px-8 py-14" style={{ backgroundColor: pageBg }}>
                <SectionTitle title="Thank you" />
                {data.endingPhoto && (
                  <div className="mx-auto max-w-[280px] mb-6 rounded-2xl overflow-hidden">
                    <img
                      src={data.endingPhoto}
                      alt="Thank you"
                      className="w-full aspect-[4/5] object-cover"
                    />
                  </div>
                )}
                {data.endingContent && (
                  <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                    {data.endingContent}
                  </p>
                )}
              </div>
            )}

            {eStyle === "full" && data.endingPhoto && (
              <div className="relative">
                <img
                  src={data.endingPhoto}
                  alt="Thank you"
                  className="w-full object-cover"
                  style={{ maxHeight: "500px" }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-end justify-center pb-10 px-8">
                  <div className={`${frosted} rounded-2xl p-6 text-center w-full max-w-[340px]`} style={{ backgroundColor: frostedBg }}>
                    {data.endingContent && (
                      <p className="text-[14px] leading-[2] whitespace-pre-line" style={{ color: textPrimary }}>
                        {data.endingContent}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {eStyle === "full" && !data.endingPhoto && data.endingContent && (
              <div className="px-8 py-14" style={{ backgroundColor: pageBg }}>
                <SectionTitle title="Thank you" />
                <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                  {data.endingContent}
                </p>
              </div>
            )}

            {eStyle === "simple" && (
              <>
                {data.endingPhoto && (
                  <div className="relative">
                    <img
                      src={data.endingPhoto}
                      alt="Thank you"
                      className="w-full object-cover"
                      style={{ maxHeight: "400px" }}
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
                  <div className="px-8 py-14 text-center" style={{ backgroundColor: pageBg }}>
                    <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: accent, opacity: 0.4 }} />
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                      {data.endingContent}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )
      })()}

      {/* ===== LINK COPY BUTTON ===== */}
      <div className="px-6 pb-10 pt-4" style={{ backgroundColor: pageBg }}>
        <button
          onClick={helpers.copyLink}
          className={`w-full py-4 rounded-full text-[14px] ${frosted}`}
          style={{ backgroundColor: frostedBg, color: textSecondary, border: "none" }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className={`px-8 pb-8 pt-4 text-center ${frosted}`} style={{ backgroundColor: "rgba(255,255,255,0.5)" }}>
        <div className="w-8 h-px mx-auto mb-4" style={{ backgroundColor: accent, opacity: 0.2 }} />
        <p className="text-[10px] tracking-[0.15em]" style={{ color: "#B0B0B0" }}>
          MADE WITH WE:VE
        </p>
      </div>
    </>
  )
}
