"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"
import { getKoreanFont, getEnglishFont } from "./font-utils"

export function MagazineLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg = "#FFFFFF"
  const darkBg = "#1A1A1A"
  const textPrimary = "#1A1A1A"
  const textSecondary = "#6B6B6B"
  const textTertiary = "#999999"
  const accent = "#C8102E"
  const buttonBg = "#1A1A1A"
  const buttonText = "#FFFFFF"
  const borderLight = "#E8E8E8"
  const borderDark = "#1A1A1A"
  const cardBg = "#F7F7F5"
  const fontFamily = getKoreanFont(data, "'Pretendard', -apple-system, sans-serif")
  const englishFont = getEnglishFont(data, "Georgia, 'Times New Roman', serif")

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " \u6545 "}</span>
  }

  const SectionDivider = () => (
    <div className="w-full h-px" style={{ backgroundColor: borderLight }} />
  )

  const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="mb-8">
      <p className="text-[11px] font-bold tracking-[0.35em] uppercase mb-1" style={{ color: textTertiary, fontFamily: englishFont }}>{title}</p>
      {subtitle && <p className="text-[22px] font-black tracking-tight leading-tight" style={{ color: textPrimary }}>{subtitle}</p>}
      <div className="w-8 h-[2px] mt-3" style={{ backgroundColor: accent }} />
    </div>
  )

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== MAGAZINE COVER ===== */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "680px", backgroundColor: darkBg }}>
        {state.allPhotos.length > 0 ? (
          <>
            {coverStyle === "static" ? (
              <div className="absolute inset-0">
                <img src={state.allPhotos[0]} alt="Cover" className="w-full h-full object-cover" style={{ minHeight: "680px" }} />
              </div>
            ) : coverStyle === "slide" ? (
              <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${state.currentSlide * 100}%)` }}>
                {state.allPhotos.map((photo, i) => (
                  <div key={i} className="w-full flex-shrink-0" style={{ minHeight: "680px" }}>
                    <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "680px" }} />
                  </div>
                ))}
              </div>
            ) : (
              state.allPhotos.map((photo, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: state.currentSlide === i ? 1 : 0 }}>
                  <img src={photo} alt={`Cover ${i + 1}`} className="w-full h-full object-cover" style={{ minHeight: "680px" }} />
                </div>
              ))
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.55) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: darkBg }}>
            <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>커버 사진을 추가해주세요</p>
          </div>
        )}

        {/* Magazine masthead */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[28px] font-black tracking-[0.08em] text-white leading-none" style={{ fontFamily: englishFont }}>W</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] tracking-[0.3em] uppercase text-white/50 font-medium">Issue No.</p>
              <p className="text-[11px] text-white/70 font-medium mt-0.5">{helpers.formatWeddingDate()}</p>
            </div>
          </div>
          <div className="w-full h-px mt-3" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Cover content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-10" style={{ minHeight: "680px" }}>
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/50 mb-3 font-medium" style={{ fontFamily: englishFont }}>
            Wedding Invitation
          </p>
          <h1 className="text-[38px] font-black leading-[1.0] text-white tracking-[-0.02em] mb-4" style={{ fontFamily: englishFont }}>
            {data.groomName || "\uC2E0\uB791"}<br />
            <span className="font-light italic text-[28px] text-white/70">&</span><br />
            {data.brideName || "\uC2E0\uBD80"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px]" style={{ backgroundColor: accent }} />
            <p className="text-[12px] text-white/60" style={{ fontFamily: englishFont }}>
              {helpers.formatWeddingDate()}{data.time ? ` \u00B7 ${data.time}` : ""}
            </p>
          </div>
        </div>

        {state.allPhotos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {state.allPhotos.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? "#FFFFFF" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        )}
      </div>

      {/* ===== INVITATION ===== */}
      <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
        <SectionHeader title="Invitation" subtitle="초대합니다" />

        {data.invitationTitle && (
          <p className="text-[18px] font-bold mb-4 leading-snug" style={{ color: textPrimary }}>
            {data.invitationTitle}
          </p>
        )}

        {data.message && (
          <p
            className="text-[14px] leading-[2] whitespace-pre-line mb-8"
            style={{ color: textSecondary, textAlign: data.messageAlign || "left" }}
          >
            {data.message}
          </p>
        )}

        <SectionDivider />

        <div className="pt-6">
          {data.showNameAtBottom && (() => {
            const groomBlock = (
              <p className="text-[14px] leading-relaxed" style={{ color: textPrimary }}>
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
              <p className="text-[14px] leading-relaxed" style={{ color: textPrimary }}>
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
              <div className="text-center mb-6">
                <div className="flex justify-center gap-12">
                  <div className="space-y-1">{first}</div>
                  <div className="space-y-1">{second}</div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 mb-6">
                {first}
                {second}
              </div>
            )
          })()}

          <button
            data-testid="button-contact"
            onClick={() => state.setShowContact(true)}
            className="w-full py-3 text-[12px] font-bold uppercase tracking-[0.2em]"
            style={{ border: `1.5px solid ${borderDark}`, color: textPrimary, backgroundColor: "transparent" }}
          >
            Contact
          </button>
        </div>
      </div>

      {/* ===== GALLERY ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div style={{ backgroundColor: pageBg }}>
          <div className="px-7 pt-14 pb-6">
            <SectionHeader title="Gallery" subtitle="우리의 이야기" />
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
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[9px] font-bold text-white/60 tracking-wider" style={{ fontFamily: englishFont }}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pl-7">
              <div className="flex gap-[2px] pr-7">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[180px] h-[240px] flex-shrink-0 cursor-pointer overflow-hidden relative"
                    onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                    data-testid={`gallery-photo-${index}`}
                  >
                    <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[9px] font-bold text-white/60 tracking-wider" style={{ fontFamily: englishFont }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="h-14" />
        </div>
      )}

      {/* ===== CALENDAR & COUNTDOWN ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-7 py-14" style={{ backgroundColor: cardBg }}>
            <SectionHeader title="Schedule" subtitle="예식 일정" />

            <div className="text-center mb-8">
              <p className="text-[13px]" style={{ color: textSecondary }}>
                {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
              </p>
            </div>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto" style={{ maxWidth: "300px" }}>
                <div className="text-center mb-4">
                  <p className="text-[13px] font-bold tracking-[0.15em] uppercase" style={{ color: textPrimary, fontFamily: englishFont }}>
                    {cal.year}.{String(cal.month).padStart(2, "0")}
                  </p>
                </div>
                <div className="w-full h-px mb-3" style={{ backgroundColor: borderDark }} />
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
                          <span className="inline-flex items-center justify-center w-8 h-8 text-[13px] font-black text-white" style={{ backgroundColor: accent }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[13px]" style={{ color: i % 7 === 0 ? accent : i % 7 === 6 ? "#4A7FB5" : textPrimary }}>
                            {day}
                          </span>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="w-full h-px mt-3" style={{ backgroundColor: borderDark }} />
              </div>
            )}

            {data.showCalendar && calStyle === "simple" && (
              <div className="text-center mb-8 py-4" style={{ borderTop: `1px solid ${borderDark}`, borderBottom: `1px solid ${borderDark}` }}>
                <p className="text-[16px] font-bold" style={{ color: textPrimary }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[13px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="flex items-center justify-center gap-1 mt-4">
                {[
                  { label: "DAYS", value: state.countdown.days },
                  { label: "HRS", value: state.countdown.hours },
                  { label: "MIN", value: state.countdown.minutes },
                  { label: "SEC", value: state.countdown.seconds },
                ].map((item, idx) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div className="w-[58px] py-3 text-center" style={{ backgroundColor: "#FFFFFF" }}>
                      <p className="text-[24px] font-black leading-none" style={{ color: textPrimary }}>{String(item.value).padStart(2, "0")}</p>
                      <p className="text-[8px] tracking-[0.15em] font-bold mt-1.5" style={{ color: textTertiary }}>{item.label}</p>
                    </div>
                    {idx < 3 && <span className="text-[16px] font-light" style={{ color: textTertiary }}>:</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION ===== */}
      <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
        <SectionHeader title="Location" subtitle="오시는 길" />

        <div className="mb-6">
          <p className="text-[18px] font-black mb-1" style={{ color: textPrimary }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[13px]" style={{ color: textSecondary }}>{data.address || "주소를 입력해주세요"}</p>
          {data.venuePhone && (
            <p className="text-[12px] mt-1" style={{ color: textTertiary }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <div className="mb-4 overflow-hidden" style={{ border: `1px solid ${borderLight}` }}>
          <MapEmbed address={data.address} height={180} borderColor={borderLight} bgColor={cardBg} />
        </div>

        <button
          className="w-full py-3 text-[12px] font-bold uppercase tracking-[0.2em] mb-6"
          style={{ backgroundColor: buttonBg, color: buttonText }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          Directions
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="pt-4" style={{ borderTop: `1px solid ${borderLight}` }}>
                {item.type && <p className="text-[12px] font-bold tracking-[0.1em] uppercase mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="pt-4" style={{ borderTop: `1px solid ${borderLight}` }}>
            <p className="text-[13px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-4 p-4" style={{ backgroundColor: cardBg }}>
            <p className="text-[12px] leading-[1.8]" style={{ color: textSecondary }}>
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
        <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
          <SectionHeader title="R.S.V.P" subtitle="참석 의사" />

          <p className="text-[13px] mb-6" style={{ color: textSecondary }}>
            {data.rsvpContent || "참석 여부를 미리 알려주시면 감사하겠습니다"}
          </p>

          <button
            className="w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] border-0"
            style={{ backgroundColor: accent, color: "#FFFFFF" }}
            data-testid="button-rsvp"
            onClick={() => onRsvpClick?.()}
          >
            {data.rsvpButtonName || "참석 의사 전달하기"}
          </button>
        </div>
      )}

      {/* ===== GUESTBOOK ===== */}
      {data.showGuestbook && (
        <div className="px-7 py-14" style={{ backgroundColor: cardBg }}>
          <SectionHeader title="Guest Book" subtitle="방명록" />

          <div className="space-y-3 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="p-5" style={{ backgroundColor: pageBg }}>
                  <p className="text-[13px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <div className="w-full h-px mb-2" style={{ backgroundColor: borderLight }} />
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: textPrimary }}>{entry.name}</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center" style={{ backgroundColor: pageBg }}>
                <p className="text-[13px]" style={{ color: textSecondary }}>
                  축하 메시지를 남겨주세요
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 mb-4" style={{ backgroundColor: pageBg }}>
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
                  className="flex-1 py-2.5 text-[12px] font-bold uppercase tracking-wider"
                  style={{ border: `1.5px solid ${borderDark}`, color: textPrimary }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 text-[12px] font-bold uppercase tracking-wider"
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
              className="w-full py-3 text-[12px] font-bold uppercase tracking-[0.2em]"
              style={{ border: `1.5px solid ${borderDark}`, color: textPrimary, backgroundColor: pageBg }}
              data-testid="button-guestbook-write"
            >
              Write
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING ===== */}
      {data.showFunding && (
        <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
          <SectionHeader title="Funding" subtitle="축하 펀딩" />

          {data.fundingMessage && (
            <p className="text-[14px] font-medium leading-[1.8] whitespace-pre-line mb-6" style={{ color: textPrimary }}>
              {data.fundingMessage}
            </p>
          )}

          {data.fundingImageType === "custom" && data.fundingImage && (
            <div className="flex justify-center mb-6">
              <div className="w-[200px] h-[200px] overflow-hidden">
                <img src={data.fundingImage} alt="펀딩" className="w-full h-full object-cover" data-testid="img-funding-custom" />
              </div>
            </div>
          )}

          <button
            className="w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "신혼여행 축하하기"}
          </button>

          <p className="text-[11px] leading-[1.6]" style={{ color: textTertiary }}>
            축하의 마음을 전하는 방법에는 여러 가지가 있습니다.
          </p>
        </div>
      )}

      {/* ===== GIFT FUNDING ===== */}
      {data.showGiftFunding && (
        <div className="px-7 py-14" style={{ backgroundColor: cardBg }}>
          <SectionHeader title="Gift" subtitle="기프트 펀딩" />
          {data.giftFundingMessage && (
            <p className="text-[13px] leading-[2] whitespace-pre-line mb-6" style={{ color: textSecondary }}>
              {data.giftFundingMessage}
            </p>
          )}
          {data.giftFundingButtonName && (
            <button
              className="w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.2em]"
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
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ border: `1px solid ${borderDark}`, color: textPrimary }}
                  data-testid={`button-copy-account-${i}`}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
            <SectionHeader title="Account" subtitle="축의금 전달" />

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1.5px solid ${borderDark}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-groom"
                    >
                      <p className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: textPrimary }}>신랑측</p>
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
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>신랑측</p>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="overflow-hidden" style={{ border: `1.5px solid ${borderDark}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-4"
                      data-testid="accordion-bride"
                    >
                      <p className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: textPrimary }}>신부측</p>
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
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: accent }}>신부측</p>
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
        <div className="px-7 py-10 text-center" style={{ backgroundColor: cardBg }}>
          <SectionHeader title="Baptismal Name" />
          <div className="flex justify-center gap-12">
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
        <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
          <SectionHeader title="Guest Snap" subtitle="게스트 스냅" />
          {data.guestSnapContent && (
            <p className="text-[13px] whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3 text-[12px] font-bold uppercase tracking-[0.2em]"
            style={{ border: `1.5px solid ${borderDark}`, color: textPrimary }}
            data-testid="button-guest-snap"
          >
            Upload
          </button>
        </div>
      )}

      {/* ===== NOTICE ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
          <SectionHeader title="Notice" subtitle="안내사항" />
          <p className="text-[15px] font-bold mb-4" style={{ color: textPrimary }}>{data.noticeTitle}</p>
          {data.noticeItems?.filter(Boolean).map((item, i) => (
            <p key={i} className="text-[13px] leading-[1.8] mb-1" style={{ color: textSecondary }}>{item}</p>
          ))}
        </div>
      )}

      {/* ===== ENDING ===== */}
      {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (() => {
        const eStyle = data.endingStyle || "card"
        const endTextColor = data.endingTextColor || textPrimary
        return (
          <div className="px-7 py-14" style={{ backgroundColor: pageBg }}>
            <SectionHeader title="Thank You" subtitle="감사의 말씀" />

            {eStyle === "card" && data.endingPhoto && (
              <div className="mx-auto max-w-[280px] mb-6 overflow-hidden">
                <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
              </div>
            )}
            {eStyle === "card" && data.endingContent && (
              <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "full" && data.endingPhoto && (
              <div className="-mx-7 mb-6 relative">
                <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "400px" }} />
                <div className="absolute inset-0 bg-black/30" />
                {data.endingContent && (
                  <div className="absolute inset-0 flex items-center justify-center px-8">
                    <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                      {data.endingContent}
                    </p>
                  </div>
                )}
              </div>
            )}
            {eStyle === "full" && !data.endingPhoto && data.endingContent && (
              <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "simple" && (
              <>
                {data.endingPhoto && (
                  <div className="-mx-7 mb-0 relative">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "360px" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {data.endingContent && (
                      <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
                        <div className="w-8 h-[2px] mx-auto mb-4" style={{ backgroundColor: endTextColor }} />
                        <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!data.endingPhoto && data.endingContent && (
                  <p className="text-[13px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                    {data.endingContent}
                  </p>
                )}
              </>
            )}
          </div>
        )
      })()}

      {/* ===== LINK COPY ===== */}
      <div className="px-7 pb-10 pt-4" style={{ backgroundColor: pageBg }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-3.5 text-[12px] font-bold uppercase tracking-[0.2em]"
          style={{ border: `1.5px solid ${borderDark}`, color: textPrimary }}
          data-testid="button-copy-link"
        >
          Share Link
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-7 pb-10 pt-4 text-center" style={{ backgroundColor: pageBg }}>
        <div className="w-full h-px mx-auto mb-4" style={{ backgroundColor: borderLight }} />
        <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: textTertiary }}>
          Powered by WE:BEAT
        </p>
      </div>

      {/* ===== CONTACT MODAL ===== */}
      {state.showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="w-[320px] p-6 relative" style={{ backgroundColor: pageBg }}>
            <button onClick={() => state.setShowContact(false)} className="absolute top-4 right-4" data-testid="button-close-contact">
              <X className="w-5 h-5" style={{ color: textSecondary }} />
            </button>
            <p className="text-[14px] font-black uppercase tracking-[0.15em] mb-6" style={{ color: textPrimary }}>Contact</p>
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
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: textTertiary }}>{contact.label}</p>
                    <p className="text-[14px] font-medium" style={{ color: textPrimary }}>{contact.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${contact.phone}`} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${borderDark}` }} data-testid={`button-call-${i}`}>
                      <Phone className="w-4 h-4" style={{ color: textPrimary }} />
                    </a>
                    <button onClick={() => helpers.copyToClipboard(contact.phone!, "\uC804\uD654\uBC88\uD638\uAC00")} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${borderDark}` }} data-testid={`button-copy-phone-${i}`}>
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
