"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function MagazineLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FFFFFF"
  const darkBg = "#0A0A0A"
  const textPrimary = "#0A0A0A"
  const textSecondary = "#555555"
  const textTertiary = "#999999"
  const buttonBg = "#0A0A0A"
  const buttonText = "#FFFFFF"
  const borderLight = "#E0E0E0"
  const cardBg = "#F5F5F5"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "Georgia, 'Times New Roman', serif")
  const scriptFont = "'Great Vibes', 'Dancing Script', 'Caveat', cursive"

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: "#888" }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const BigHeading = ({ children }: { children: string }) => (
    <h2 className="text-[28px] font-black tracking-[0.12em] uppercase leading-tight text-center mb-8" style={{ color: textPrimary }}>
      {children}
    </h2>
  )

  const PhotoDivider = ({ photo, height = "320px" }: { photo?: string; height?: string }) => {
    if (!photo) return null
    return (
      <div className="w-full overflow-hidden relative" style={{ height }}>
        <img src={photo} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(30%)" }} />
      </div>
    )
  }

  const coverStyle = data.coverDisplayStyle || "slide"
  const secondPhoto = state.allPhotos.length > 1 ? state.allPhotos[1] : null
  const thirdPhoto = state.allPhotos.length > 2 ? state.allPhotos[2] : null

  return (
    <>
      {/* ===== COVER: Full dramatic photo ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "700px", backgroundColor: darkBg }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "700px", filter: "grayscale(20%) contrast(1.05)" }} />
              </div>
            ) : coverStyle === "slide" ? (
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                {state.allPhotos.map((photo, i) => (
                  <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "700px" }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "700px", filter: "grayscale(20%) contrast(1.05)" }} />
                  </div>
                ))}
              </div>
            ) : (
              state.allPhotos.map((photo, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                  <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "700px", filter: "grayscale(20%) contrast(1.05)" }} />
                </div>
              ))
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.5) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: darkBg }}>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.25)" }}>커버 사진을 추가해주세요</p>
          </div>
        )}

        {/* Brand at top center */}
        <div className="absolute top-5 left-0 right-0 z-10 text-center">
          <p className="text-[11px] tracking-[0.5em] uppercase text-white/50 font-light" style={{ fontFamily: englishFont }}>
            lxne
          </p>
        </div>

        {/* Date + names at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 text-center pb-10 px-6">
          <p className="text-[13px] tracking-[0.15em] text-white/70 mb-3" style={{ fontFamily: englishFont }}>
            {helpers.formatWeddingDate()}
          </p>
          <h1 className="text-[36px] leading-[1.15] text-white mb-2" style={{ fontFamily: scriptFont }}>
            {data.groomName || "\uC2E0\uB791"} <span className="text-[28px] text-white/60" style={{ fontFamily: scriptFont }}>&</span> {data.brideName || "\uC2E0\uBD80"}
          </h1>
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
      <div className="px-8 py-16 text-center" style={{ backgroundColor: pageBg }}>
        <BigHeading>{"\uC18C\uC911\uD55C \uBD84\uB4E4\uC744 \uCD08\uB300\uD569\uB2C8\uB2E4"}</BigHeading>

        {data.message && (
          <p
            className="text-[14px] leading-[2.2] whitespace-pre-line mb-8 max-w-[320px] mx-auto"
            style={{ color: textSecondary, textAlign: data.messageAlign || "center" }}
          >
            {data.message}
          </p>
        )}
      </div>

      {/* ===== Photo divider + overlaid large date ===== */}
      {secondPhoto && (
        <div className="relative w-full overflow-hidden" style={{ height: "380px" }}>
          <img src={secondPhoto} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(30%)" }} />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.15)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[60px] font-black text-white/20 tracking-tight leading-none" style={{ fontFamily: englishFont }}>
              {helpers.formatWeddingDate()?.replace(/\./g, ".") || ""}
            </p>
          </div>
        </div>
      )}

      {/* ===== PARENTS / NAMES ===== */}
      {data.showNameAtBottom && (
        <div className="px-8 py-14 text-center" style={{ backgroundColor: pageBg }}>
          {(() => {
            const groomBlock = (
              <p className="text-[14px] leading-[2]" style={{ color: textPrimary }}>
                {data.groomFather?.name && (
                  <><DeceasedMark show={data.groomFather.deceased} />{data.groomFather.name}</>
                )}
                {data.groomMother?.name && (
                  <> · <DeceasedMark show={data.groomMother.deceased} />{data.groomMother.name}</>
                )}
                {(data.groomFather?.name || data.groomMother?.name) && (
                  <span className="text-[12px]" style={{ color: textTertiary }}> {data.groomRelation || "\uC544\uB4E4"} </span>
                )}
                <span className="font-bold">{data.groomName || "\uC2E0\uB791"}</span>
              </p>
            )
            const brideBlock = (
              <p className="text-[14px] leading-[2]" style={{ color: textPrimary }}>
                {data.brideFather?.name && (
                  <><DeceasedMark show={data.brideFather.deceased} />{data.brideFather.name}</>
                )}
                {data.brideMother?.name && (
                  <> · <DeceasedMark show={data.brideMother.deceased} />{data.brideMother.name}</>
                )}
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
              <div className="space-y-2">
                {first}
                {second}
              </div>
            )
          })()}

          <div className="mt-8">
            <button
              data-testid="button-contact"
              onClick={() => state.setShowContact(true)}
              className="px-8 py-3 text-[12px] font-bold tracking-[0.2em] uppercase"
              style={{ border: `1.5px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}
            >
              연락하기
            </button>
          </div>
        </div>
      )}

      {/* ===== LOCATION ===== */}
      <div className="px-8 py-16 text-center" style={{ backgroundColor: cardBg }}>
        <BigHeading>{"\uC608\uC2DD \uC7A5\uC18C"}</BigHeading>

        <p className="text-[14px] mb-1" style={{ color: textSecondary }}>{data.address || "\uC8FC\uC18C\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"}</p>
        <p className="text-[20px] font-black tracking-[0.05em] mt-4 mb-2" style={{ color: textPrimary }}>
          {data.venue || "\uC608\uC2DD\uC7A5"}{data.venueHall ? ` \u00AB${data.venueHall}\u00BB` : ""}
        </p>
        {data.venuePhone && (
          <p className="text-[12px] mt-1" style={{ color: textTertiary }}>Tel. {data.venuePhone}</p>
        )}

        <div className="mt-6 mb-4 overflow-hidden" style={{ border: `1px solid ${borderLight}` }}>
          <MapEmbed address={data.address} height={180} borderColor={borderLight} bgColor={cardBg} />
        </div>

        <button
          className="px-8 py-3 text-[12px] font-bold tracking-[0.15em] uppercase"
          style={{ backgroundColor: buttonBg, color: buttonText }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          {"\uAE38\uCC3E\uAE30"}
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-8 text-left space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderLight}` }}>
                {item.type && <p className="text-[12px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="mt-6 text-left pt-4" style={{ borderTop: `1px solid ${borderLight}` }}>
            <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-4 p-4 text-left" style={{ backgroundColor: pageBg }}>
            <p className="text-[12px] leading-[1.8]" style={{ color: textSecondary }}>
              주차 공간이 협소하오니 대중교통을 이용해주시면 감사하겠습니다.
            </p>
          </div>
        )}
      </div>

      {/* ===== CALENDAR & COUNTDOWN ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-8 py-16 text-center" style={{ backgroundColor: pageBg }}>
            <BigHeading>{"\uC608\uC2DD \uC77C\uC2DC"}</BigHeading>

            <p className="text-[16px] font-bold mb-1" style={{ color: textPrimary }}>
              {helpers.formatWeddingDate()} {cal.weddingDayName}요일
            </p>
            <p className="text-[14px] mb-8" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto" style={{ maxWidth: "300px" }}>
                <div className="w-full h-px mb-4" style={{ backgroundColor: textPrimary }} />
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {cal.dayNames.map((d) => (
                    <div key={d} className="text-[10px] py-2 text-center font-bold tracking-wider uppercase" style={{ color: textTertiary }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {cal.days.map((day, i) => (
                    <div key={i} className="py-2.5 text-center">
                      {day !== null && (
                        day === cal.weddingDay ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 text-[13px] font-black text-white" style={{ backgroundColor: textPrimary }}>
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
              <div className="mb-8 py-4" style={{ borderTop: `1px solid ${textPrimary}`, borderBottom: `1px solid ${textPrimary}` }}>
                <p className="text-[16px] font-bold" style={{ color: textPrimary }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="mt-4">
                <p className="text-[11px] tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: textTertiary }}>Countdown</p>
                <div className="flex items-center justify-center gap-4">
                  {[
                    { label: "Days", value: state.countdown.days },
                    { label: "Hours", value: state.countdown.hours },
                    { label: "Min", value: state.countdown.minutes },
                    { label: "Sec", value: state.countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-[28px] font-black leading-none" style={{ color: textPrimary }}>{String(item.value).padStart(2, "0")}</p>
                      <p className="text-[9px] tracking-[0.15em] uppercase mt-2" style={{ color: textTertiary }}>{item.label}</p>
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
        <PhotoDivider photo={data.midPhoto} height="300px" />
      )}
      {!data.showMidPhoto && thirdPhoto && (
        <PhotoDivider photo={thirdPhoto} height="300px" />
      )}

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div style={{ backgroundColor: pageBg }}>
          <div className="px-8 pt-16 pb-6 text-center">
            <BigHeading>Gallery</BigHeading>
          </div>

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-2 gap-[2px]">
              {state.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] cursor-pointer overflow-hidden relative"
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}
                >
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pl-8">
              <div className="flex gap-[2px] pr-8">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[200px] h-[260px] flex-shrink-0 cursor-pointer overflow-hidden"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}
                  >
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="h-16" />
        </div>
      )}

      {/* ===== RSVP ===== */}
      {data.showRsvp && (
        <div className="px-8 py-16 text-center" style={{ backgroundColor: cardBg }}>
          <BigHeading>R.S.V.P</BigHeading>

          <p className="text-[14px] leading-[1.8] mb-8 max-w-[300px] mx-auto" style={{ color: textSecondary }}>
            {data.rsvpContent || "\uCC38\uC11D \uC5EC\uBD80\uB97C \uBBF8\uB9AC \uC54C\uB824\uC8FC\uC2DC\uBA74 \uAC10\uC0AC\uD558\uACA0\uC2B5\uB2C8\uB2E4"}
          </p>

          <button
            className="px-10 py-3.5 text-[12px] font-bold tracking-[0.15em] uppercase border-0"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-rsvp"
            onClick={() => onRsvpClick?.()}
          >
            {data.rsvpButtonName || "\uCC38\uC11D \uC758\uC0AC \uC804\uB2EC\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-8 py-16" style={{ backgroundColor: pageBg }}>
          <div className="text-center">
            <BigHeading>{"\uBC29\uBA85\uB85D"}</BigHeading>
          </div>

          <div className="space-y-3 mb-8">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: cardBg }}>
                  <p className="text-[13px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <div className="w-full h-px mb-2" style={{ backgroundColor: borderLight }} />
                  <p className="text-[11px] font-bold tracking-[0.1em]" style={{ color: textPrimary }}>{entry.name}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center" style={{ backgroundColor: cardBg }}>
                <p className="text-[13px]" style={{ color: textTertiary }}>축하 메시지를 남겨주세요</p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: cardBg }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-3 text-[13px] mb-2 outline-none"
                style={{ border: `1px solid ${borderLight}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-3 text-[13px] mb-3 outline-none resize-none"
                style={{ border: `1px solid ${borderLight}`, backgroundColor: pageBg, color: textPrimary }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 text-[12px] font-bold tracking-wider uppercase"
                  style={{ border: `1.5px solid ${textPrimary}`, color: textPrimary }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[12px] font-bold tracking-wider uppercase"
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid="button-guestbook-submit"
                >
                  등록
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => state.setShowGuestbookForm(true)}
              className="w-full py-3 text-[12px] font-bold tracking-[0.2em] uppercase"
              style={{ border: `1.5px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}
              data-testid="button-guestbook-write"
            >
              작성하기
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-8 py-16 text-center" style={{ backgroundColor: pageBg }}>
          <BigHeading>{"\uCD95\uD558 \uD380\uB529"}</BigHeading>

          {data.fundingMessage && (
            <p className="text-[14px] leading-[1.8] whitespace-pre-line mb-8 max-w-[300px] mx-auto" style={{ color: textSecondary }}>
              {data.fundingMessage}
            </p>
          )}

          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-6">
              <div className="w-[200px] h-[200px] overflow-hidden">
                <img src={data.fundingImage} alt="\uD380\uB529" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}

          <button
            className="px-10 py-3.5 text-[12px] font-bold tracking-[0.15em] uppercase mb-4"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "\uC2E0\uD63C\uC5EC\uD589 \uCD95\uD558\uD558\uAE30"}
          </button>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-8 py-16 text-center" style={{ backgroundColor: cardBg }}>
          <BigHeading>{"\uAE30\uD504\uD2B8 \uD380\uB529"}</BigHeading>
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="px-10 py-3.5 text-[12px] font-bold tracking-[0.15em] uppercase"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-gift-funding"
              onClick={() => openKakaoGift()}
            >
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
                  <p className="text-[13px] font-medium" style={{ color: textPrimary }}>{acc!.bank} {acc!.account}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: textTertiary }}>{acc!.holder}</p>
                </div>
                <button
                  onClick={() => helpers.copyToClipboard(`${acc!.bank} ${acc!.account}`, "\uACC4\uC88C\uBC88\uD638\uAC00")}
                  className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
                  style={{ border: `1px solid ${textPrimary}`, color: textPrimary }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-8 py-16" style={{ backgroundColor: pageBg }}>
            <div className="text-center">
              <BigHeading>{"\uCD95\uC758\uAE08 \uC804\uB2EC"}</BigHeading>
            </div>
            <p className="text-[13px] text-center mb-8" style={{ color: textSecondary }}>축하의 마음을 전해주세요</p>

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1.5px solid ${textPrimary}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[12px] font-bold tracking-[0.15em] uppercase" style={{ color: textPrimary }}>신랑측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`} style={{ color: textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "groom" && (
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${borderLight}` }}>
                        {renderAccList(groomAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: cardBg }}>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: textPrimary }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1.5px solid ${textPrimary}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[12px] font-bold tracking-[0.15em] uppercase" style={{ color: textPrimary }}>신부측</p>
                      <svg className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`} style={{ color: textPrimary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {state.expandedAccordion === "bride" && (
                      <div className="px-4 pb-4" style={{ borderTop: `1px solid ${borderLight}` }}>
                        {renderAccList(brideAccList)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5" style={{ backgroundColor: cardBg }}>
                    <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: textPrimary }}>신부측</p>
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
        <div className="px-8 py-12 text-center" style={{ backgroundColor: cardBg }}>
          <BigHeading>세례명</BigHeading>
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
        <div className="px-8 py-16 text-center" style={{ backgroundColor: pageBg }}>
          <BigHeading>{"\uAC8C\uC2A4\uD2B8 \uC2A4\uB0C5"}</BigHeading>
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="px-8 py-3 text-[12px] font-bold tracking-[0.2em] uppercase"
            style={{ border: `1.5px solid ${textPrimary}`, color: textPrimary, backgroundColor: "transparent" }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-8 py-16 text-center" style={{ backgroundColor: cardBg }}>
          <BigHeading>{data.noticeTitle}</BigHeading>
          <div className="text-left max-w-[300px] mx-auto">
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
            ))}
          </div>
        </div>
      )}

      {/* ===== ENDING: Big text + photo ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || "#FFFFFF"
        return (
          <>
            {(eStyle === "full" || eStyle === "simple") && data.endingPhoto ? (
              <div className="relative w-full overflow-hidden" style={{ minHeight: "400px" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full h-full object-cover absolute inset-0" style={{ minHeight: "400px", filter: "grayscale(30%)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)" }} />
                <div className="relative z-10 flex flex-col items-center justify-center px-8" style={{ minHeight: "400px" }}>
                  {data.endingContent && (
                    <p className="text-[14px] leading-[2] text-center whitespace-pre-line mb-6" style={{ color: endTextColor }}>
                      {data.endingContent}
                    </p>
                  )}
                  <p className="text-[32px] font-black tracking-[0.08em] uppercase" style={{ color: endTextColor, fontFamily: englishFont }}>
                    Thank You
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-8 py-16 text-center" style={{ backgroundColor: pageBg }}>
                {data.endingPhoto && (
                  <div className="mx-auto max-w-[280px] mb-8 overflow-hidden">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" style={{ filter: "grayscale(20%)" }} />
                  </div>
                )}
                {data.endingContent && (
                  <p className="text-[14px] leading-[2] whitespace-pre-line mb-6 max-w-[300px] mx-auto" style={{ color: textSecondary }}>
                    {data.endingContent}
                  </p>
                )}
                <p className="text-[28px] font-black tracking-[0.08em] uppercase" style={{ color: textPrimary, fontFamily: englishFont }}>
                  Thank You
                </p>
              </div>
            )}
          </>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-8 pb-10 pt-6 text-center" style={{ backgroundColor: pageBg }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-3.5 text-[12px] font-bold tracking-[0.2em] uppercase"
          style={{ border: `1.5px solid ${textPrimary}`, color: textPrimary }}
          data-testid="button-copy-link"
        >
          링크 복사
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-8 pb-10 pt-2 text-center" style={{ backgroundColor: pageBg }}>
        <div className="w-12 h-px mx-auto mb-4" style={{ backgroundColor: borderLight }} />
        <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: textTertiary }}>
          WE:BEAT
        </p>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-[320px] p-6 relative" style={{ backgroundColor: pageBg }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-4 right-4" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textSecondary }} />
            </button>
            <p className="text-[18px] font-black tracking-[0.1em] uppercase mb-6" style={{ color: textPrimary }}>Contact</p>
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
                    <p className="text-[10px] tracking-wider uppercase" style={{ color: textTertiary }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${textPrimary}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-4 h-4" style={{ color: textPrimary }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${textPrimary}` }} data-testid={`button-copy-phone-${i}`}>
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
          <button onClick={() => state.setShowPhotoViewer(false)} className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-close-viewer">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={state.galleryImages[state.viewerIndex]} alt={`Gallery ${state.viewerIndex + 1}`} className="max-w-full max-h-[80vh] object-contain" />
          {state.viewerIndex > 0 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-viewer-prev">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {state.viewerIndex < state.galleryImages.length - 1 && (
            <button onClick={() => state.setViewerIndex(state.viewerIndex + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} data-testid="button-viewer-next">
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
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 text-[13px] font-medium shadow-lg"
          style={{ backgroundColor: buttonBg, color: buttonText }}
        >
          {state.copiedToast}
        </div>
      )}
    </>
  )
}
