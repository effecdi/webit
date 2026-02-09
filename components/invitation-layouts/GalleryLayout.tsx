"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"

export function GalleryLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#F5F5F5"
  const sectionBg1 = "#F5F5F5"
  const sectionBg2 = "#FFFFFF"
  const textPrimary = "#333333"
  const textSecondary = "#777777"
  const accent = "#222222"
  const buttonText = "#333333"
  const borderColor = "#E0E0E0"
  const cardBg = "#FFFFFF"
  const dividerColor = "#333333"
  const sansFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-8">
      <div className="w-full h-px mb-4" style={{ backgroundColor: dividerColor }} />
      <h2
        className="text-[11px] font-normal uppercase"
        style={{ color: textPrimary, letterSpacing: "0.15em", fontFamily: sansFont }}
      >
        {title}
      </h2>
    </div>
  )

  const photo0 = state.allPhotos[0] || null
  const photo1 = state.allPhotos[1] || null
  const photo2 = state.allPhotos[2] || null

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="px-6 pt-16 pb-12" style={{ backgroundColor: sectionBg1 }}>
        <div className="mb-10">
          <p
            className="text-[10px] uppercase mb-1"
            style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}
          >
            Wedding Invitation
          </p>
        </div>

        {state.allPhotos.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-[2px]" style={{ minHeight: "380px" }}>
              <div className="row-span-2">
                <img
                  src={photo0!}
                  alt="Cover 1"
                  className="w-full h-full object-cover rounded-none"
                  style={{ minHeight: "380px" }}
                />
              </div>
              <div>
                {photo1 ? (
                  <img
                    src={photo1}
                    alt="Cover 2"
                    className="w-full h-full object-cover rounded-none"
                    style={{ height: "189px" }}
                  />
                ) : (
                  <div
                    className="w-full flex items-center justify-center rounded-none"
                    style={{ height: "189px", backgroundColor: "#EBEBEB" }}
                  >
                    <p className="text-[11px]" style={{ color: textSecondary, letterSpacing: "0.15em" }}>NO IMAGE</p>
                  </div>
                )}
              </div>
              <div>
                {photo2 ? (
                  <img
                    src={photo2}
                    alt="Cover 3"
                    className="w-full h-full object-cover rounded-none"
                    style={{ height: "189px" }}
                  />
                ) : (
                  <div
                    className="w-full flex items-center justify-center rounded-none"
                    style={{ height: "189px", backgroundColor: "#EBEBEB" }}
                  >
                    <p className="text-[11px]" style={{ color: textSecondary, letterSpacing: "0.15em" }}>NO IMAGE</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p
                className="text-[11px] uppercase"
                style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}
              >
                {helpers.formatWeddingDate()}{data.time ? " | " + data.time : ""}
              </p>
              <p
                className="text-[11px] mt-1"
                style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}
              >
                {data.venue || ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-[2px]" style={{ minHeight: "380px" }}>
              <div className="row-span-2 flex items-center justify-center" style={{ backgroundColor: "#EBEBEB", minHeight: "380px" }}>
                <p className="text-[11px]" style={{ color: textSecondary, letterSpacing: "0.15em" }}>ADD PHOTOS</p>
              </div>
              <div className="flex items-center justify-center" style={{ backgroundColor: "#EBEBEB", height: "189px" }}>
                <p className="text-[11px]" style={{ color: textSecondary, letterSpacing: "0.15em" }}>ADD PHOTOS</p>
              </div>
              <div className="flex items-center justify-center" style={{ backgroundColor: "#EBEBEB", height: "189px" }}>
                <p className="text-[11px]" style={{ color: textSecondary, letterSpacing: "0.15em" }}>ADD PHOTOS</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="w-full h-px mb-4" style={{ backgroundColor: dividerColor }} />
          <p
            className="text-[20px] font-light"
            style={{ color: textPrimary, letterSpacing: "0.05em", fontFamily: sansFont }}
          >
            {data.groomName || "신랑"}{" "}
            <span className="text-[13px] font-light mx-1" style={{ color: textSecondary }}>&</span>{" "}
            {data.brideName || "신부"}
          </p>
        </div>
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className="px-6 py-14" style={{ backgroundColor: sectionBg1 }}>
        <SectionTitle title="Invitation" />

        {data.invitationTitle && (
          <p
            className="text-[16px] font-normal mb-6"
            style={{ color: textPrimary, letterSpacing: "0.05em", fontFamily: sansFont }}
          >
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p
            className="text-[13px] leading-[2.2] whitespace-pre-line mb-8"
            style={{ color: textSecondary, textAlign: data.messageAlign || "left", fontFamily: sansFont }}
          >
            {data.message}
          </p>
        )}

        <div className="w-full h-px my-8" style={{ backgroundColor: borderColor }} />

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
          className="w-full py-3 rounded-none text-[11px] uppercase"
          style={{
            border: `1px solid ${dividerColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            letterSpacing: "0.15em",
            fontFamily: sansFont,
          }}
        >
          연락하기
        </button>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-14" style={{ backgroundColor: sectionBg1 }}>
          <div className="px-6">
            <SectionTitle title="Gallery" />
          </div>

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-3 gap-px px-6">
              {state.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer overflow-hidden rounded-none"
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
              <div className="flex gap-px px-6">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[180px] h-[240px] flex-shrink-0 cursor-pointer overflow-hidden rounded-none"
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

          <div className="px-6 mt-4">
            <p className="text-[10px] uppercase" style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}>
              {state.galleryImages.length} works
            </p>
          </div>
        </div>
      )}

      {/* ===== CALENDAR & COUNTDOWN SECTION ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
            <SectionTitle title="Calendar" />
            <p className="text-[16px] font-light mb-1" style={{ color: textPrimary, fontFamily: sansFont }}>{helpers.formatWeddingDate()}</p>
            <p className="text-[12px] mb-8" style={{ color: textSecondary, letterSpacing: "0.1em", fontFamily: sansFont }}>
              {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
            </p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto max-w-[320px]">
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {cal.dayNames.map((d) => (
                    <div
                      key={d}
                      className="text-[10px] py-2 text-center font-medium uppercase"
                      style={{ color: accent, letterSpacing: "0.1em", fontFamily: sansFont }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="w-full h-px mb-2" style={{ backgroundColor: dividerColor }} />
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2.5 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-medium"
                            style={{ backgroundColor: accent, color: "#FFFFFF" }}
                          >
                            {day}
                          </span>
                        ) : (
                          <span
                            className="text-[13px]"
                            style={{
                              color: i % 7 === 0 ? accent : i % 7 === 6 ? "#3182F6" : textPrimary,
                              fontFamily: sansFont,
                            }}
                          >
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
                <p className="text-[15px] font-light" style={{ color: textPrimary, fontFamily: sansFont }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[12px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="flex items-center justify-center gap-0 mt-4">
                <div className="text-center w-14">
                  <p className="text-[9px] uppercase mb-1" style={{ color: textSecondary, letterSpacing: "0.15em" }}>Days</p>
                  <p className="text-[26px] font-light" style={{ color: accent }}>{state.countdown.days}</p>
                </div>
                <span className="text-[20px] font-light pb-1" style={{ color: borderColor }}>:</span>
                <div className="text-center w-14">
                  <p className="text-[9px] uppercase mb-1" style={{ color: textSecondary, letterSpacing: "0.15em" }}>Hour</p>
                  <p className="text-[26px] font-light" style={{ color: accent }}>{state.countdown.hours}</p>
                </div>
                <span className="text-[20px] font-light pb-1" style={{ color: borderColor }}>:</span>
                <div className="text-center w-14">
                  <p className="text-[9px] uppercase mb-1" style={{ color: textSecondary, letterSpacing: "0.15em" }}>Min</p>
                  <p className="text-[26px] font-light" style={{ color: accent }}>{state.countdown.minutes}</p>
                </div>
                <span className="text-[20px] font-light pb-1" style={{ color: borderColor }}>:</span>
                <div className="text-center w-14">
                  <p className="text-[9px] uppercase mb-1" style={{ color: textSecondary, letterSpacing: "0.15em" }}>Sec</p>
                  <p className="text-[26px] font-light" style={{ color: accent }}>{state.countdown.seconds}</p>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className="px-6 py-14" style={{ backgroundColor: sectionBg1 }}>
        <SectionTitle title="Location" />

        <div className="mb-6">
          <p className="text-[16px] font-light mb-1" style={{ color: textPrimary, fontFamily: sansFont }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[12px]" style={{ color: textSecondary, letterSpacing: "0.05em", fontFamily: sansFont }}>
            {data.address || "주소를 입력해주세요"}
          </p>
          {data.venuePhone && (
            <p className="text-[11px] mt-1" style={{ color: textSecondary, fontFamily: sansFont }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <MapEmbed address={data.address} height={200} borderColor={borderColor} bgColor={sectionBg2 || sectionBg1 || "#F5F5F0"} />

        <button
          className="w-full py-3 rounded-none text-[11px] uppercase mb-6"
          style={{
            border: `1px solid ${dividerColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            letterSpacing: "0.15em",
            fontFamily: sansFont,
          }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-2 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
                {item.type && (
                  <p className="text-[12px] font-medium uppercase mb-2" style={{ color: textPrimary, letterSpacing: "0.1em", fontFamily: sansFont }}>
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
          <div className="pt-4" style={{ borderTop: `1px solid ${borderColor}` }}>
            <p className="text-[12px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.transportInfo}
            </p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-6 p-4 rounded-none" style={{ backgroundColor: sectionBg2, border: `1px solid ${borderColor}` }}>
            <p className="text-[11px] leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
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
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="R.S.V.P" />

          <p className="text-[14px] font-light mb-4" style={{ color: textPrimary, fontFamily: sansFont }}>
            {data.rsvpTitle || "참석 의사"}
          </p>

          <div className="mb-6 py-4" style={{ borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
            <p className="text-[11px] uppercase text-center" style={{ color: accent, letterSpacing: "0.15em", fontFamily: sansFont }}>
              R.S.V.P
            </p>
          </div>

          <p className="text-[12px] mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
            {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
          </p>

          <button
            className="w-full py-3 rounded-none text-[11px] uppercase border-0"
            style={{
              backgroundColor: accent,
              color: "#FFFFFF",
              letterSpacing: "0.15em",
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
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Guest Book" />

          <div className="space-y-3 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="p-5 rounded-none"
                  style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                >
                  <p className="text-[12px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary, fontFamily: sansFont }}>
                    {entry.message}
                  </p>
                  <div className="w-full h-px mb-2" style={{ backgroundColor: borderColor }} />
                  <p className="text-[10px] uppercase" style={{ color: textPrimary, letterSpacing: "0.1em", fontFamily: sansFont }}>
                    {entry.name}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="p-6 rounded-none"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
              >
                <p className="text-[12px] leading-[1.8]" style={{ color: textSecondary, fontFamily: sansFont }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 rounded-none mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-3 rounded-none text-[12px] mb-3 outline-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: sectionBg1, color: textPrimary, fontFamily: sansFont }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-3 rounded-none text-[12px] mb-3 outline-none resize-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: sectionBg1, color: textPrimary, fontFamily: sansFont }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 rounded-none text-[11px] uppercase"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary, letterSpacing: "0.1em", fontFamily: sansFont }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 rounded-none text-[11px] uppercase"
                  style={{ backgroundColor: accent, color: "#FFFFFF", letterSpacing: "0.1em", fontFamily: sansFont }}
                  data-testid="button-guestbook-submit"
                >
                  등록하기
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3 rounded-none text-[11px] uppercase"
              style={{
                border: `1px solid ${dividerColor}`,
                color: textPrimary,
                backgroundColor: "transparent",
                letterSpacing: "0.15em",
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
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="Funding" />

          {data.fundingMessage && (
            <p className="text-[13px] font-light leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary, fontFamily: sansFont }}>
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
            className="w-full py-3 rounded-none text-[11px] uppercase mb-4 border-0"
            style={{
              backgroundColor: accent,
              color: "#FFFFFF",
              letterSpacing: "0.15em",
              fontFamily: sansFont,
            }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[11px] leading-[1.6]" style={{ color: textSecondary, fontFamily: sansFont }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING SECTION ===== */}
      {data.showGiftFunding && (
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[12px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3 rounded-none text-[11px] uppercase border-0"
              style={{
                backgroundColor: accent,
                color: "#FFFFFF",
                letterSpacing: "0.15em",
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
                  className="px-3 py-1.5 rounded-none text-[10px] uppercase"
                  style={{
                    border: `1px solid ${dividerColor}`,
                    color: textPrimary,
                    backgroundColor: "transparent",
                    letterSpacing: "0.1em",
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
          <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
            <SectionTitle title="Account" />
            <p className="text-[11px] mb-6" style={{ color: textSecondary, letterSpacing: "0.1em", fontFamily: sansFont }}>
              축하의 마음을 전해주세요
            </p>

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-none" style={{ border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[11px] uppercase" style={{ color: textPrimary, letterSpacing: "0.1em", fontFamily: sansFont }}>
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
                  <div className="p-4 rounded-none" style={{ border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <p className="text-[10px] uppercase mb-3" style={{ color: accent, letterSpacing: "0.15em", fontFamily: sansFont }}>
                      신랑측
                    </p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-none" style={{ border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[11px] uppercase" style={{ color: textPrimary, letterSpacing: "0.1em", fontFamily: sansFont }}>
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
                  <div className="p-4 rounded-none" style={{ border: `1px solid ${borderColor}`, backgroundColor: cardBg }}>
                    <p className="text-[10px] uppercase mb-3" style={{ color: accent, letterSpacing: "0.15em", fontFamily: sansFont }}>
                      신부측
                    </p>
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
        <div className="px-6 py-10" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Baptismal Name" />
          <div className="flex justify-center gap-12">
            <div className="space-y-1">
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
            <div className="space-y-1">
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
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[12px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary, fontFamily: sansFont }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3 rounded-none text-[11px] uppercase"
            style={{
              border: `1px solid ${dividerColor}`,
              color: textPrimary,
              backgroundColor: "transparent",
              letterSpacing: "0.15em",
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
        <div className="px-6 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Notice" />
          <p className="text-[14px] font-light mb-4" style={{ color: textPrimary, fontFamily: sansFont }}>
            {data.noticeTitle}
          </p>
          {data.noticeItems?.filter(Boolean).map((item, i) => (
            <p key={i} className="text-[12px] leading-[1.8] mb-1" style={{ color: textSecondary, fontFamily: sansFont }}>
              {item}
            </p>
          ))}
        </div>
      )}

      {/* ===== ENDING SECTION ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-6 py-14" style={{ backgroundColor: sectionBg2 }}>
            <SectionTitle title="Thank You" />

            {eStyle === "card" && data.endingPhoto && (
              <div className="mx-auto max-w-[280px] mb-6 rounded-none overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                <img
                  src={data.endingPhoto}
                  alt="Thank you"
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            )}

            {eStyle === "card" && data.endingContent && (
              <p className="text-[12px] leading-[2] whitespace-pre-line" style={{ color: textSecondary, fontFamily: sansFont }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "full" && data.endingPhoto && (
              <div className="-mx-6 mb-6 relative">
                <img
                  src={data.endingPhoto}
                  alt="Thank you"
                  className="w-full object-cover"
                  style={{ maxHeight: "400px" }}
                />
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
              <p className="text-[12px] leading-[2] whitespace-pre-line" style={{ color: textSecondary, fontFamily: sansFont }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "simple" && (
              <>
                {data.endingPhoto && (
                  <div className="-mx-6 mb-0 relative">
                    <img
                      src={data.endingPhoto}
                      alt="Thank you"
                      className="w-full object-cover"
                      style={{ maxHeight: "360px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {data.endingContent && (
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
                        <div className="w-10 h-px mx-auto mb-4" style={{ backgroundColor: endTextColor }} />
                        <p className="text-[12px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor, fontFamily: sansFont }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!data.endingPhoto && data.endingContent && (
                  <div>
                    <div className="w-10 h-px mb-4" style={{ backgroundColor: borderColor }} />
                    <p className="text-[12px] leading-[2] whitespace-pre-line" style={{ color: textSecondary, fontFamily: sansFont }}>
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
      <div className="px-6 pb-10 pt-4" style={{ backgroundColor: sectionBg1 }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-3.5 rounded-none text-[11px] uppercase"
          style={{
            border: `1px solid ${dividerColor}`,
            color: textPrimary,
            backgroundColor: "transparent",
            letterSpacing: "0.15em",
            fontFamily: sansFont,
          }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-6 pb-10 pt-4" style={{ backgroundColor: sectionBg1 }}>
        <div className="w-full h-px mb-6" style={{ backgroundColor: borderColor }} />
        <p className="text-[9px] uppercase" style={{ color: textSecondary, letterSpacing: "0.15em", fontFamily: sansFont }}>
          MADE WITH WE:BEAT
        </p>
      </div>
    </>
  )
}
