"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function MagazineLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FFFFFF"
  const sectionBg1 = "#FFFFFF"
  const sectionBg2 = "#F5F5F5"
  const textPrimary = "#191F28"
  const textSecondary = "#8B95A1"
  const accent = "#FF8A80"
  const buttonBg = "#FF8A80"
  const buttonText = "#FFFFFF"
  const borderColor = "#191F28"
  const dividerColor = "#191F28"
  const cardBg = "#F5F5F5"
  const fontFamily = getKoreanFont(data, "-apple-system, BlinkMacSystemFont, sans-serif")
  const englishFont = getEnglishFont(data, "-apple-system, BlinkMacSystemFont, sans-serif")

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-8">
      <div className="w-full h-[2px] mb-6" style={{ backgroundColor: dividerColor }} />
      <h2
        className="text-[13px] font-bold tracking-[0.3em] uppercase"
        style={{ color: textPrimary, fontFamily: englishFont }}
      >
        {title}
      </h2>
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="relative w-full overflow-hidden" style={{ height: "85vh", minHeight: "600px" }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" />
              </div>
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
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#191F28] flex items-center justify-center">
            <p className="text-[14px] text-white/40">사진을 추가해주세요</p>
          </div>
        )}

        <div className="absolute top-6 left-0 right-0 z-10 text-center">
          <p className="text-[18px] font-black tracking-[0.4em] text-white leading-none">WEVE</p>
          <p className="text-[10px] font-bold tracking-[0.4em] text-white/70 leading-none mt-1">WEDDING</p>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/60 mb-4 font-medium">
            We are getting married
          </p>
          <h1 className="text-[42px] font-black leading-[1.05] text-white text-center uppercase tracking-tight">
            WE ARE{"\n"}GETTING{"\n"}MARRIED
          </h1>
          <div className="w-12 h-[2px] mx-auto my-5" style={{ backgroundColor: accent }} />
          <p className="text-[20px] font-light text-white tracking-wide">
            {data.groomName || "신랑"} & {data.brideName || "신부"}
          </p>
        </div>

        <div className="absolute bottom-6 right-6 z-10 text-right">
          <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Issue No.</p>
          <p className="text-[24px] font-black text-white leading-none mt-1">
            {helpers.formatWeddingDate()?.replace(/\./g, "") || ""}
          </p>
          <p className="text-[11px] text-white/60 mt-1">
            {helpers.formatWeddingDate()}{data.time ? " | " + data.time : ""}
          </p>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
        <SectionTitle title="Invitation" />

        {data.invitationTitle && (
          <p className="text-[20px] font-bold mb-6" style={{ color: textPrimary }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p
            className="text-[14px] leading-[2.2] whitespace-pre-line mb-6"
            style={{ color: textSecondary, textAlign: data.messageAlign || "left" }}
          >
            {data.message}
          </p>
        )}

        <div className="w-full h-[1px] my-6" style={{ backgroundColor: "#E5E8EB" }} />

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
          className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.15em]"
          style={{ border: `2px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
        >
          연락하기
        </button>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="py-14" style={{ backgroundColor: sectionBg1 }}>
          <div className="px-8">
            <SectionTitle title="Gallery" />
          </div>

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-3 gap-0">
              {state.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer overflow-hidden relative"
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 p-2">
                    <span className="text-[10px] font-black text-white/70 tracking-wider">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-0">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[200px] h-[260px] flex-shrink-0 cursor-pointer overflow-hidden relative"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-2">
                      <span className="text-[10px] font-black text-white/70 tracking-wider">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
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
          <div className="px-8 py-14 text-center" style={{ backgroundColor: sectionBg1 }}>
            <SectionTitle title="Calendar" />
            <p className="text-[24px] font-bold mb-2" style={{ color: textPrimary }}>{helpers.formatWeddingDate()}</p>
            <p className="text-[14px] mb-8" style={{ color: textSecondary }}>
              {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
            </p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto max-w-[320px]">
                <div className="w-full h-[2px] mb-4" style={{ backgroundColor: dividerColor }} />
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[11px] py-2 text-center font-bold uppercase tracking-wider" style={{ color: textSecondary }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2.5 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-none text-[14px] font-black" style={{ backgroundColor: accent, color: buttonText }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[14px] font-medium" style={{ color: i % 7 === 0 ? accent : i % 7 === 6 ? "#3182F6" : textPrimary }}>
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full h-[2px] mt-4" style={{ backgroundColor: dividerColor }} />
              </div>
            )}

            {data.showCalendar && calStyle === "simple" && (
              <div className="mb-8 py-4" style={{ borderTop: `2px solid ${dividerColor}`, borderBottom: `2px solid ${dividerColor}` }}>
                <p className="text-[18px] font-bold" style={{ color: textPrimary }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[14px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="flex items-center justify-center gap-0 mt-4">
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-[0.2em] font-bold mb-1" style={{ color: textSecondary }}>DAYS</p>
                  <p className="text-[32px] font-black" style={{ color: textPrimary }}>{state.countdown.days}</p>
                </div>
                <span className="text-[24px] font-bold pb-1" style={{ color: dividerColor }}>:</span>
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-[0.2em] font-bold mb-1" style={{ color: textSecondary }}>HOUR</p>
                  <p className="text-[32px] font-black" style={{ color: textPrimary }}>{state.countdown.hours}</p>
                </div>
                <span className="text-[24px] font-bold pb-1" style={{ color: dividerColor }}>:</span>
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-[0.2em] font-bold mb-1" style={{ color: textSecondary }}>MIN</p>
                  <p className="text-[32px] font-black" style={{ color: textPrimary }}>{state.countdown.minutes}</p>
                </div>
                <span className="text-[24px] font-bold pb-1" style={{ color: dividerColor }}>:</span>
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-[0.2em] font-bold mb-1" style={{ color: textSecondary }}>SEC</p>
                  <p className="text-[32px] font-black" style={{ color: textPrimary }}>{state.countdown.seconds}</p>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
        <SectionTitle title="Location" />

        <div className="mb-6">
          <p className="text-[22px] font-black mb-2" style={{ color: textPrimary }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[14px]" style={{ color: textSecondary }}>{data.address || "주소를 입력해주세요"}</p>
          {data.venuePhone && (
            <p className="text-[13px] mt-1" style={{ color: textSecondary }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <MapEmbed address={data.address} height={200} borderColor={dividerColor} bgColor={sectionBg2 || sectionBg1 || "#F5F5F0"} />

        <button
          className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.15em] mb-6"
          style={{ border: `2px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-2 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `2px solid ${dividerColor}` }}>
                {item.type && <p className="text-[13px] font-black uppercase tracking-wider mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="pt-4" style={{ borderTop: `2px solid ${dividerColor}` }}>
            <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-6 p-4 rounded-none" style={{ backgroundColor: sectionBg2, border: `1px solid #E5E8EB` }}>
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
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="R.S.V.P" />

          <div className="p-8 mb-6" style={{ backgroundColor: accent }}>
            <p className="text-[24px] font-black text-white text-center uppercase tracking-wider mb-2">
              R.S.V.P
            </p>
            <p className="text-[14px] text-center font-medium text-white/80">
              {data.rsvpTitle || "참석 의사"}
            </p>
          </div>

          <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>
            {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
          </p>

          <button
            className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.1em] border-0"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-rsvp"
            onClick={() => onRsvpClick?.()}
          >
            {data.rsvpButtonName || "참석 의사 전달하기"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK SECTION ===== */}
      {data.showGuestbook && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="Guest Book" />

          <div className="space-y-4 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="p-5 relative rounded-none"
                  style={{ backgroundColor: sectionBg1, border: `1px solid #E5E8EB` }}
                >
                  <p className="text-[14px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <div className="w-full h-[1px] mb-2" style={{ backgroundColor: "#E5E8EB" }} />
                  <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color: textPrimary }}>{entry.name}</p>
                </div>
              ))
            ) : (
              <div
                className="p-6 text-center rounded-none"
                style={{ backgroundColor: sectionBg1, border: `1px solid #E5E8EB` }}
              >
                <p className="text-[14px] leading-[1.8]" style={{ color: textSecondary }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 rounded-none mb-4" style={{ backgroundColor: sectionBg1, border: `1px solid #E5E8EB` }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-3 rounded-none text-[14px] mb-3 outline-none"
                style={{ border: `1px solid #E5E8EB`, backgroundColor: sectionBg1, color: textPrimary }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-3 rounded-none text-[14px] mb-3 outline-none resize-none"
                style={{ border: `1px solid #E5E8EB`, backgroundColor: sectionBg1, color: textPrimary }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 rounded-none text-[13px] font-bold uppercase tracking-wider"
                  style={{ border: `2px solid ${dividerColor}`, color: textPrimary }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 rounded-none text-[13px] font-bold uppercase tracking-wider"
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
              className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.15em]"
              style={{ border: `2px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
              data-testid="button-guestbook-write"
            >
              작성하기
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING SECTION ===== */}
      {data.showFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Funding" />

          {data.fundingMessage && (
            <p className="text-[15px] font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary }}>
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
            className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.1em] mb-4"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[12px] leading-[1.6]" style={{ color: textSecondary }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다. 신랑·신부에게 직접 마음을 전하고 싶으신 분들을 위해 현금 펀딩을 준비했습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING SECTION ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="Gift Funding" />
          {data.giftFundingMessage && (
            <p className="text-[14px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.1em]"
              style={{ backgroundColor: buttonBg, color: buttonText }}
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
          <div className="divide-y" style={{ borderColor: "#E5E8EB" }}>
            {list.map((acc, i) => (
              <div key={i} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: textSecondary }}>{acc!.holder}</p>
                </div>
                <button
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "계좌번호가")}
                  className="px-3 py-1.5 rounded-none text-[11px] font-bold uppercase tracking-wider"
                  style={{ border: `1px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
            <SectionTitle title="Account" />
            <p className="text-[13px] mb-6" style={{ color: textSecondary }}>축하의 마음을 전해주세요</p>

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden rounded-none" style={{ border: `2px solid ${dividerColor}`, backgroundColor: sectionBg1 }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[13px] font-black uppercase tracking-wider" style={{ color: textPrimary }}>신랑측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: textPrimary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-5 pb-5" style={{ borderTop: `2px solid ${dividerColor}` }}>
                        {renderAccList(groomAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-none" style={{ border: `2px solid ${dividerColor}`, backgroundColor: sectionBg1 }}>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden rounded-none" style={{ border: `2px solid ${dividerColor}`, backgroundColor: sectionBg1 }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[13px] font-black uppercase tracking-wider" style={{ color: textPrimary }}>신부측 계좌번호</p>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: textPrimary }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-5 pb-5" style={{ borderTop: `2px solid ${dividerColor}` }}>
                        {renderAccList(brideAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 rounded-none" style={{ border: `2px solid ${dividerColor}`, backgroundColor: sectionBg1 }}>
                    <p className="text-[12px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: accent }}>신부측</p>
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
        <div className="px-8 py-10 text-center" style={{ backgroundColor: sectionBg2 }}>
          <SectionTitle title="Baptismal Name" />
          <div className="flex justify-center gap-12">
            <div className="space-y-1">
              {data.baptismalGroom && <p className="text-[14px] font-bold" style={{ color: textPrimary }}>{data.baptismalGroom}</p>}
              {data.baptismalGroomFather && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalGroomFather}</p>}
              {data.baptismalGroomMother && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalGroomMother}</p>}
            </div>
            <div className="space-y-1">
              {data.baptismalBride && <p className="text-[14px] font-bold" style={{ color: textPrimary }}>{data.baptismalBride}</p>}
              {data.baptismalBrideFather && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalBrideFather}</p>}
              {data.baptismalBrideMother && <p className="text-[13px]" style={{ color: textSecondary }}>{data.baptismalBrideMother}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ===== GUEST SNAP ===== */}
      {data.showGuestSnap && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Guest Snap" />
          {data.guestSnapContent && (
            <p className="text-[14px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3.5 rounded-none text-[13px] font-bold uppercase tracking-[0.15em]"
            style={{ border: `2px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE SECTION ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
          <SectionTitle title="Notice" />
          <p className="text-[16px] font-black uppercase tracking-wider mb-4" style={{ color: textPrimary }}>{data.noticeTitle}</p>
          {data.noticeItems?.filter(Boolean).map((item, i) => (
            <p key={i} className="text-[14px] leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
          ))}
        </div>
      )}

      {/* ===== ENDING SECTION ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-8 py-14" style={{ backgroundColor: sectionBg1 }}>
            <SectionTitle title="Thank You" />

            {eStyle === "card" && data.endingPhoto && (
              <div className="mx-auto max-w-[280px] mb-6 rounded-none overflow-hidden" style={{ border: `2px solid ${dividerColor}` }}>
                <img
                  src={data.endingPhoto}
                  alt="Thank you"
                  className="w-full aspect-[4/5] object-cover"
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
                        <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: endTextColor }} />
                        <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!data.endingPhoto && data.endingContent && (
                  <div className="text-center">
                    <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: dividerColor }} />
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
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
          className="w-full py-4 rounded-none text-[13px] font-bold uppercase tracking-[0.15em]"
          style={{ border: `2px solid ${dividerColor}`, color: textPrimary, backgroundColor: sectionBg1 }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-8 pb-10 pt-4 text-center" style={{ backgroundColor: sectionBg1 }}>
        <div className="w-full h-[1px] mx-auto mb-6" style={{ backgroundColor: "#E5E8EB" }} />
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase" style={{ color: textSecondary }}>
          MADE WITH WE:BEAT
        </p>
      </div>
    </>
  )
}
