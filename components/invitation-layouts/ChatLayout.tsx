"use client"

import { Phone, Copy, X, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import type { LayoutProps } from "./types"
import { MapEmbed, openNaverDirections, openKakaoTransfer, openKakaoGift } from "./MapEmbed"

export function ChatLayout({ data, state, helpers, onRsvpClick }: LayoutProps) {
  const pageBg1 = "#FFF5F7"
  const pageBg2 = "#FFFFFF"
  const textPrimary = "#4A3040"
  const textSecondary = "#9B7B8E"
  const accent = "#E88BA7"
  const buttonBg = "#E88BA7"
  const buttonText = "#FFFFFF"
  const borderColor = "#F5D5DE"
  const cardBg = "#FFFFFF"

  const HeartIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
    <svg viewBox="0 0 24 24" fill={accent} width={size} height={size} className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )

  const HeartDivider = () => (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="w-10 h-[1px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
      <HeartIcon size={12} />
      <div className="w-10 h-[1px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
    </div>
  )

  const SectionTitle = ({ title }: { title: string }) => (
    <div className="mb-6 text-center">
      <div className="flex items-center justify-center gap-2">
        <HeartIcon size={14} />
        <h2 className="text-[20px] font-bold" style={{ color: textPrimary }}>{title}</h2>
        <HeartIcon size={14} />
      </div>
      <div className="w-8 h-[2px] mt-3 mx-auto rounded-full" style={{ backgroundColor: accent, opacity: 0.5 }} />
    </div>
  )

  const DeceasedMark = ({ show }: { show: boolean }) => {
    if (!show) return null
    return <span style={{ color: accent }}>{data.deceasedFlower ? " * " : " 故 "}</span>
  }

  const coverStyle = data.coverDisplayStyle || "slide"

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <div className="py-14 px-8 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF0F3 0%, #FFE4EC 100%)" }}>
        <div className="absolute top-6 left-6 opacity-30"><HeartIcon size={20} /></div>
        <div className="absolute top-16 right-8 opacity-20"><HeartIcon size={14} /></div>
        <div className="absolute bottom-20 left-10 opacity-15"><HeartIcon size={10} /></div>
        <div className="absolute top-32 right-4 opacity-25"><HeartIcon size={18} /></div>
        <div className="absolute bottom-10 right-12 opacity-20"><HeartIcon size={12} /></div>

        <div className="flex flex-col items-center relative z-[1]">
          <p className="text-[14px] tracking-[0.15em] mb-4" style={{ color: accent }}>
            Wedding Invitation
          </p>

          <p className="text-[26px] font-bold mb-6" style={{ color: textPrimary }}>
            결혼합니다
          </p>

          {state.allPhotos.length > 0 ? (
            <div className="relative">
              <div className="w-[260px] h-[260px] rounded-full overflow-hidden relative" style={{ border: `4px solid ${accent}`, boxShadow: `0 8px 30px rgba(232,139,167,0.25)` }}>
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
              <div className="absolute -top-2 -right-2"><HeartIcon size={22} /></div>
              <div className="absolute -bottom-1 -left-3 opacity-60"><HeartIcon size={16} /></div>
            </div>
          ) : (
            <div className="w-[260px] h-[260px] rounded-full flex items-center justify-center" style={{ backgroundColor: cardBg, border: `4px solid ${borderColor}` }}>
              <p className="text-[14px]" style={{ color: textSecondary }}>사진을 추가해주세요</p>
            </div>
          )}

          {state.allPhotos.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {state.allPhotos.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: state.currentSlide === i ? accent : borderColor }} />
              ))}
            </div>
          )}

          <HeartDivider />

          <p className="text-[22px] font-bold" style={{ color: textPrimary }}>
            {data.groomName || "신랑"} <span className="text-[16px] mx-2" style={{ color: accent }}>&</span> {data.brideName || "신부"}
          </p>

          <p className="text-[13px] mt-3" style={{ color: textSecondary }}>
            {helpers.formatWeddingDate()}{data.time ? " | " + data.time : ""}
          </p>
          <p className="text-[13px] mt-1" style={{ color: textSecondary }}>
            {data.venue || ""}
          </p>
        </div>
      </div>

      {/* ===== INVITATION SECTION ===== */}
      <div className="px-6 py-14" style={{ backgroundColor: pageBg1 }}>
        <div className="rounded-[20px] p-8" style={{ backgroundColor: cardBg, boxShadow: "0 4px 20px rgba(232,139,167,0.1)" }}>
          <SectionTitle title="초대합니다" />

          {data.invitationTitle && (
            <p className="text-[17px] text-center font-medium mb-5" style={{ color: textPrimary }}>
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

          <HeartDivider />

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
            className="w-[200px] mx-auto block py-3 rounded-full text-[14px] font-medium"
            style={{ backgroundColor: buttonBg, color: buttonText }}
          >
            연락하기
          </button>
        </div>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      {data.showGallery && state.galleryImages.length > 0 && (
        <div className="px-6 py-14" style={{ backgroundColor: pageBg2 }}>
          <SectionTitle title="갤러리" />

          {data.galleryStyle === "grid" || !data.galleryStyle ? (
            <div className="grid grid-cols-3 gap-2">
              {state.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer overflow-hidden rounded-[16px]"
                  style={{ border: `2px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(232,139,167,0.1)" }}
                  onClick={() => { state.setViewerIndex(index); state.setShowPhotoViewer(true) }}
                  data-testid={`gallery-photo-${index}`}
                >
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <div className="flex gap-3 px-2">
                {state.galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[160px] h-[210px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[16px]"
                    style={{ border: `2px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(232,139,167,0.1)" }}
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
      )}

      {/* ===== CALENDAR & COUNTDOWN SECTION ===== */}
      {(data.showCalendar || data.showCountdown) && data.weddingDate && (() => {
        const cal = helpers.getCalendarData()
        if (!cal) return null
        const calStyle = data.calendarStyle || "full"
        return (
          <div className="px-6 py-14 text-center" style={{ backgroundColor: pageBg1 }}>
            <SectionTitle title="날짜" />
            <p className="text-[18px] font-medium mb-2" style={{ color: textPrimary }}>{helpers.formatWeddingDate()}</p>
            <p className="text-[14px] mb-8" style={{ color: textSecondary }}>
              {cal.weddingDayName}요일 {helpers.formatWeddingTime()}
            </p>

            {data.showCalendar && calStyle === "full" && (
              <div className="mb-8 mx-auto max-w-[320px] p-5 rounded-[20px]" style={{ backgroundColor: cardBg, boxShadow: "0 4px 20px rgba(232,139,167,0.1)" }}>
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
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-bold" style={{ backgroundColor: accent, color: buttonText }}>
                            {day}
                          </span>
                        ) : (
                          <span className="text-[14px]" style={{ color: i % 7 === 0 ? accent : i % 7 === 6 ? "#7BA8D9" : textPrimary }}>
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
              <div className="mb-8 py-4 rounded-[20px] mx-4" style={{ backgroundColor: cardBg, boxShadow: "0 4px 20px rgba(232,139,167,0.1)" }}>
                <p className="text-[18px] font-medium" style={{ color: textPrimary }}>
                  {cal.year}년 {cal.month}월 {cal.weddingDay}일 {cal.weddingDayName}요일
                </p>
                <p className="text-[14px] mt-1" style={{ color: textSecondary }}>{helpers.formatWeddingTime()}</p>
              </div>
            )}

            {data.showCountdown && (
              <div className="flex items-center justify-center gap-0 mt-4">
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>DAYS</p>
                  <p className="text-[28px] font-bold" style={{ color: accent }}>{state.countdown.days}</p>
                </div>
                <HeartIcon size={12} />
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>HOUR</p>
                  <p className="text-[28px] font-bold" style={{ color: accent }}>{state.countdown.hours}</p>
                </div>
                <HeartIcon size={12} />
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>MIN</p>
                  <p className="text-[28px] font-bold" style={{ color: accent }}>{state.countdown.minutes}</p>
                </div>
                <HeartIcon size={12} />
                <div className="text-center w-16">
                  <p className="text-[10px] tracking-wider mb-1" style={{ color: textSecondary }}>SEC</p>
                  <p className="text-[28px] font-bold" style={{ color: accent }}>{state.countdown.seconds}</p>
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {/* ===== LOCATION SECTION ===== */}
      <div className="px-6 py-14" style={{ backgroundColor: pageBg2 }}>
        <SectionTitle title="오시는 길" />

        <div className="text-center mb-6">
          <p className="text-[17px] font-bold mb-2" style={{ color: textPrimary }}>
            {data.venue || "예식장"}{data.venueHall ? ` ${data.venueHall}` : ""}
          </p>
          <p className="text-[14px]" style={{ color: textSecondary }}>{data.address || "주소를 입력해주세요"}</p>
          {data.venuePhone && (
            <p className="text-[13px] mt-1" style={{ color: textSecondary }}>Tel. {data.venuePhone}</p>
          )}
        </div>

        <MapEmbed address={data.address} height={200} borderColor={borderColor} bgColor={pageBg1 || "#F5F5F0"} />

        <button
          className="w-full py-3.5 rounded-full text-[14px] font-medium mb-6"
          style={{ backgroundColor: buttonBg, color: buttonText }}
          data-testid="button-directions"
          onClick={() => openNaverDirections(data.address)}
        >
          길찾기
        </button>

        {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
          <div className="mt-2 space-y-4">
            {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
              <div key={i} className="p-4 rounded-[20px]" style={{ backgroundColor: pageBg1 }}>
                {item.type && <p className="text-[15px] font-bold mb-2" style={{ color: textPrimary }}>{item.type}</p>}
                {item.detail && <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{item.detail}</p>}
              </div>
            ))}
          </div>
        )}
        {data.transportInfo && !data.transportItems?.some(t => t.type || t.detail) && (
          <div className="p-4 rounded-[20px]" style={{ backgroundColor: pageBg1 }}>
            <p className="text-[14px] whitespace-pre-line leading-[1.8]" style={{ color: textSecondary }}>{data.transportInfo}</p>
          </div>
        )}
        {data.showTransportNotice && (
          <div className="mt-6 p-4 rounded-[20px]" style={{ backgroundColor: pageBg1, border: `1px solid ${borderColor}` }}>
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
        <div className="px-6 py-14" style={{ backgroundColor: pageBg2 }}>
          <SectionTitle title="참석 여부" />

          <div className="rounded-[20px] p-6" style={{ backgroundColor: pageBg1, boxShadow: "0 4px 20px rgba(232,139,167,0.08)" }}>
            <p className="text-[17px] text-center font-medium mb-4" style={{ color: textPrimary }}>
              {data.rsvpTitle || "참석 의사"}
            </p>

            <div className="flex justify-center mb-4">
              <HeartIcon size={24} />
            </div>

            <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>
              {data.rsvpContent || "신랑신부에게 참석 여부를 미리 알려주세요"}
            </p>

            <button
              className="w-full py-3.5 rounded-full text-[14px] font-medium"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-rsvp"
              onClick={() => onRsvpClick?.()}
            >
              {data.rsvpButtonName || "참석 의사 전달하기"}
            </button>
          </div>
        </div>
      )}

      {/* ===== GUESTBOOK SECTION ===== */}
      {data.showGuestbook && (
        <div className="px-6 py-14" style={{ backgroundColor: pageBg1 }}>
          <SectionTitle title="방명록" />

          <div className="space-y-4 mb-6">
            {state.guestbookEntries.length > 0 ? (
              state.guestbookEntries.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="p-5 relative rounded-[20px]"
                  style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, boxShadow: "0 2px 10px rgba(232,139,167,0.06)" }}
                >
                  <div className="absolute top-3 right-3 opacity-30"><HeartIcon size={10} /></div>
                  <p className="text-[14px] leading-[1.8] whitespace-pre-line mb-3" style={{ color: textSecondary }}>{entry.message}</p>
                  <p className="text-[12px]" style={{ color: accent }}>- {entry.name} -</p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center rounded-[20px]" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                <HeartIcon size={20} />
                <p className="text-[14px] leading-[1.8] mt-3" style={{ color: textSecondary }}>
                  아직 방명록이 없습니다.{"\n"}축하 메시지를 남겨주세요.
                </p>
              </div>
            )}
          </div>

          {state.showGuestbookForm ? (
            <div className="p-5 rounded-[20px] mb-4" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
              <input
                type="text"
                value={state.guestbookName}
                onChange={(e) => state.setGuestbookName(e.target.value)}
                placeholder="이름"
                className="w-full py-2.5 px-4 rounded-full text-[14px] mb-3 outline-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg1, color: textPrimary }}
                data-testid="input-guestbook-name"
              />
              <textarea
                value={state.guestbookMessage}
                onChange={(e) => state.setGuestbookMessage(e.target.value)}
                placeholder="축하 메시지를 작성해주세요"
                rows={4}
                className="w-full py-2.5 px-4 rounded-[16px] text-[14px] mb-3 outline-none resize-none"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: pageBg1, color: textPrimary }}
                data-testid="input-guestbook-message"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => state.setShowGuestbookForm(false)}
                  className="flex-1 py-2.5 rounded-full text-[13px]"
                  style={{ border: `1px solid ${borderColor}`, color: textSecondary, backgroundColor: cardBg }}
                  data-testid="button-guestbook-cancel"
                >
                  취소
                </button>
                <button
                  onClick={helpers.submitGuestbook}
                  className="flex-1 py-2.5 rounded-full text-[13px] font-medium"
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
              className="w-full py-3.5 rounded-full text-[14px] font-medium"
              style={{ backgroundColor: buttonBg, color: buttonText }}
              data-testid="button-guestbook-write"
            >
              작성하기
            </button>
          )}
        </div>
      )}

      {/* ===== FUNDING SECTION ===== */}
      {data.showFunding && (
        <div className="px-6 py-14" style={{ backgroundColor: pageBg2 }}>
          <SectionTitle title="축의금" />

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
              <div className="w-[160px] h-[160px] flex items-center justify-center">
                <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
                  <circle cx="55" cy="80" r="25" fill={accent} opacity="0.15"/>
                  <circle cx="105" cy="80" r="25" fill={accent} opacity="0.15"/>
                  <circle cx="55" cy="65" r="12" fill={accent} opacity="0.2"/>
                  <circle cx="105" cy="65" r="12" fill={accent} opacity="0.2"/>
                  <path d="M80 120l-2-1.8C66 107 58 100 58 92c0-5.5 4-10 9.5-10 2.1 0 4.1.6 5.5 1.6 1.4-1 3.4-1.6 5.5-1.6 5.5 0 9.5 4.5 9.5 10 0 8-8 15-20 26.2L80 120z" fill={accent} opacity="0.5"/>
                </svg>
              </div>
            )}
          </div>

          <button
            className="w-full py-3.5 rounded-full text-[14px] font-medium"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-funding"
            onClick={() => openKakaoTransfer()}
          >
            {data.fundingButtonName || "축의금 보내기"}
          </button>
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
                  style={{ backgroundColor: buttonBg, color: buttonText }}
                  data-testid={`button-copy-account-${i}`}
                >
                  복사
                </button>
              </div>
            ))}
          </div>
        )

        return (
          <div className="px-6 py-14" style={{ backgroundColor: pageBg1 }}>
            <SectionTitle title="마음 전하기" />
            <p className="text-[13px] text-center mb-6" style={{ color: textSecondary }}>축하의 마음을 전해주세요</p>

            <div className="space-y-4">
              {groomAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "groom" ? null : "groom")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-groom"
                    >
                      <div className="flex items-center gap-2">
                        <HeartIcon size={14} />
                        <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신랑측 계좌번호</p>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "groom" ? "rotate-180" : ""}`}
                        style={{ color: accent }}
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
                  <div className="rounded-[20px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="flex items-center gap-2 mb-4">
                      <HeartIcon size={12} />
                      <p className="text-[12px] font-medium" style={{ color: accent }}>신랑측</p>
                    </div>
                    {renderAccList(groomAccList)}
                  </div>
                )
              )}

              {brideAccList.length > 0 && (
                accStyle === "accordion" ? (
                  <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <button
                      onClick={() => state.setExpandedAccordion(state.expandedAccordion === "bride" ? null : "bride")}
                      className="w-full flex items-center justify-between p-5"
                      data-testid="accordion-bride"
                    >
                      <div className="flex items-center gap-2">
                        <HeartIcon size={14} />
                        <p className="text-[14px] font-medium" style={{ color: textPrimary }}>신부측 계좌번호</p>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${state.expandedAccordion === "bride" ? "rotate-180" : ""}`}
                        style={{ color: accent }}
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
                  <div className="rounded-[20px] p-5" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="flex items-center gap-2 mb-4">
                      <HeartIcon size={12} />
                      <p className="text-[12px] font-medium" style={{ color: accent }}>신부측</p>
                    </div>
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
        <div className="px-6 py-10 text-center" style={{ backgroundColor: pageBg2 }}>
          <SectionTitle title="세례명" />
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
        <div className="px-6 py-14" style={{ backgroundColor: pageBg1 }}>
          <SectionTitle title="게스트 스냅" />
          {data.guestSnapContent && (
            <p className="text-[14px] text-center whitespace-pre-line leading-[1.8] mb-6" style={{ color: textSecondary }}>
              {data.guestSnapContent}
            </p>
          )}
          <button
            className="w-full py-3.5 rounded-full text-[14px] font-medium"
            style={{ backgroundColor: buttonBg, color: buttonText }}
            data-testid="button-guest-snap"
          >
            사진 업로드
          </button>
        </div>
      )}

      {/* ===== NOTICE SECTION ===== */}
      {data.showNotice && data.noticeTitle && (
        <div className="px-6 py-14" style={{ backgroundColor: pageBg1 }}>
          <SectionTitle title="안내사항" />
          <div className="rounded-[20px] p-6" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <HeartIcon size={14} />
              <p className="text-[17px] font-medium" style={{ color: accent }}>{data.noticeTitle}</p>
              <HeartIcon size={14} />
            </div>
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
          <div className="px-6 py-14" style={{ backgroundColor: pageBg2 }}>
            <SectionTitle title="감사합니다" />

            {eStyle === "card" && data.endingPhoto && (
              <div className="mx-auto max-w-[260px] mb-6 rounded-[20px] overflow-hidden" style={{ border: `2px solid ${borderColor}`, boxShadow: "0 4px 20px rgba(232,139,167,0.1)" }}>
                <img src={data.endingPhoto} alt="Thank you" className="w-full aspect-[4/5] object-cover" />
              </div>
            )}

            {eStyle === "card" && data.endingContent && (
              <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: textSecondary }}>
                {data.endingContent}
              </p>
            )}

            {eStyle === "full" && data.endingPhoto && (
              <div className="-mx-6 mb-6 relative rounded-[20px] overflow-hidden mx-0">
                <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "400px" }} />
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
                  <div className="mb-0 relative rounded-[20px] overflow-hidden">
                    <img src={data.endingPhoto} alt="Thank you" className="w-full object-cover" style={{ maxHeight: "360px" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {data.endingContent && (
                      <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
                        <div className="flex justify-center mb-4"><HeartIcon size={14} /></div>
                        <p className="text-[14px] leading-[2] text-center whitespace-pre-line" style={{ color: endTextColor }}>
                          {data.endingContent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {!data.endingPhoto && data.endingContent && (
                  <div className="text-center">
                    <div className="flex justify-center mb-4"><HeartIcon size={14} /></div>
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
      <div className="px-6 pb-10 pt-4" style={{ backgroundColor: pageBg1 }}>
        <button
          onClick={helpers.copyLink}
          className="w-full py-4 rounded-full text-[14px] font-medium"
          style={{ backgroundColor: buttonBg, color: buttonText }}
          data-testid="button-copy-link"
        >
          청첩장 링크 복사하기
        </button>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="px-8 pb-8 pt-4 text-center" style={{ background: "linear-gradient(180deg, #FFF5F7 0%, #FFE4EC 100%)" }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-[1px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
          <HeartIcon size={10} />
          <div className="w-6 h-[1px]" style={{ backgroundColor: accent, opacity: 0.3 }} />
        </div>
        <p className="text-[10px] tracking-[0.15em] flex items-center justify-center gap-1" style={{ color: textSecondary }}>
          MADE WITH
          <HeartIcon size={8} />
          WE:VE
        </p>
      </div>
    </>
  )
}