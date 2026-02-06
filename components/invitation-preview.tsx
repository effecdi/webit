"use client"

import type { InvitationData } from "@/app/wedding/editor/page"
import { Heart, MapPin, Calendar, Navigation, Clock } from "lucide-react"

interface InvitationPreviewProps {
  data: InvitationData & { date?: string; time?: string }
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  const coverImage = data.coverImage || (data.mainPhotos && data.mainPhotos[0]) || ""

  return (
    <div className="w-full h-full overflow-y-auto bg-[#faf9f7]">
      <div className="max-w-[360px] mx-auto">
        
        {/* Cover Section */}
        <div className="relative">
          {coverImage ? (
            <img
              src={coverImage || "/placeholder.svg"}
              alt="Wedding Cover"
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-gradient-to-b from-[#f5ebe0] to-[#faf9f7] flex items-center justify-center">
              <p className="text-[14px] text-[#b0a090]">커버 사진을 추가해주세요</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#faf9f7]" />
          
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-[11px] tracking-[0.25em] text-[#8b7355] uppercase mb-2">Wedding Invitation</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-[28px] font-light text-[#3d3d3d] tracking-wide">{data.groomName || "신랑"}</span>
              <span className="text-[#c9a86c] text-xl">&</span>
              <span className="text-[28px] font-light text-[#3d3d3d] tracking-wide">{data.brideName || "신부"}</span>
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-[#faf9f7] px-8 py-10 text-center">
          <div className="inline-block mb-6">
            <div className="w-12 h-px bg-[#c9a86c] mx-auto mb-4" />
            <Calendar className="w-5 h-5 text-[#c9a86c] mx-auto" />
          </div>
          
          <p className="text-[22px] font-light text-[#3d3d3d] tracking-wide mb-2">
            {data.date || "날짜를 입력해주세요"}
          </p>
          <p className="text-[15px] text-[#8b7355]">
            {data.time || "시간을 입력해주세요"}
          </p>
          
          {data.venue && (
            <p className="text-[14px] text-[#8b7355] mt-2">{data.venue}{data.venueHall ? ` ${data.venueHall}` : ""}</p>
          )}
        </div>

        {/* Message Section */}
        <div className="bg-white px-8 py-10">
          <div className="text-center mb-6">
            <Heart className="w-5 h-5 text-[#e8b4b8] mx-auto mb-3" fill="#e8b4b8" />
            <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Invitation</p>
          </div>
          
          {data.invitationTitle && (
            <p className="text-[16px] text-[#3d3d3d] text-center font-medium mb-4">
              {data.invitationTitle}
            </p>
          )}
          
          <p className="text-[14px] text-[#5a5a5a] leading-[2] text-center whitespace-pre-line">
            {data.message || "인사말을 입력해주세요"}
          </p>
          
          {data.showNameAtBottom && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  {data.groomFather?.name && (
                    <p className="text-[12px] text-[#8b7355] mb-1">
                      {data.groomFather.deceased ? "故 " : ""}{data.groomFather.name}
                      {data.groomMother?.name ? ` · ${data.groomMother.deceased ? "故 " : ""}${data.groomMother.name}` : ""}
                      {data.groomFather.name || data.groomMother?.name ? "의 " : ""}
                      {data.groomRelation || "아들"}
                    </p>
                  )}
                  <p className="text-[15px] text-[#3d3d3d] font-medium">{data.groomName || "신랑"}</p>
                </div>
                <div className="w-px h-8 bg-[#e0d5c7]" />
                <div className="text-center">
                  {data.brideFather?.name && (
                    <p className="text-[12px] text-[#8b7355] mb-1">
                      {data.brideFather.deceased ? "故 " : ""}{data.brideFather.name}
                      {data.brideMother?.name ? ` · ${data.brideMother.deceased ? "故 " : ""}${data.brideMother.name}` : ""}
                      {data.brideFather.name || data.brideMother?.name ? "의 " : ""}
                      {data.brideRelation || "딸"}
                    </p>
                  )}
                  <p className="text-[15px] text-[#3d3d3d] font-medium">{data.brideName || "신부"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        {data.showGallery && data.galleryImages && data.galleryImages.length > 0 && (
          <div className="bg-white px-6 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Gallery</p>
            </div>
            
            {data.galleryStyle === "grid" ? (
              <div className="grid grid-cols-2 gap-2">
                {data.galleryImages.map((img, index) => (
                  <img
                    key={index}
                    src={img || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-sm"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-2">
                <div className="flex gap-2 px-2">
                  {data.galleryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img || "/placeholder.svg"}
                      alt={`Gallery ${index + 1}`}
                      className="w-[200px] h-[260px] object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mid Photo */}
        {data.showMidPhoto && data.midPhoto && (
          <div className="bg-[#faf9f7]">
            <img src={data.midPhoto} alt="Mid section" className="w-full object-cover" />
          </div>
        )}

        {/* Location Section */}
        <div className="bg-[#faf9f7] px-8 py-10">
          <div className="text-center mb-6">
            <MapPin className="w-5 h-5 text-[#c9a86c] mx-auto mb-3" />
            <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Location</p>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-[18px] text-[#3d3d3d] mb-1">{data.venue || "예식장"}</p>
            {data.venueHall && <p className="text-[14px] text-[#8b7355] mb-1">{data.venueHall}</p>}
            <p className="text-[13px] text-[#a09080]">{data.address || "주소를 입력해주세요"}</p>
            {data.venuePhone && (
              <p className="text-[13px] text-[#a09080] mt-1">Tel. {data.venuePhone}</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg h-32 flex items-center justify-center mb-4">
            <div className="text-center">
              <Navigation className="w-6 h-6 text-[#c9a86c] mx-auto mb-2" />
              <p className="text-[12px] text-[#8b7355]">지도 보기</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-white rounded-lg text-[12px] text-[#5a5a5a]">
              네이버 지도
            </button>
            <button className="flex-1 py-2.5 bg-white rounded-lg text-[12px] text-[#5a5a5a]">
              카카오 지도
            </button>
          </div>

          {/* Transport Info */}
          {data.transportItems && data.transportItems.some(t => t.type || t.detail) && (
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-[12px] text-[#8b7355] font-medium mb-2">교통 안내</p>
              {data.transportItems.filter(t => t.type || t.detail).map((item, i) => (
                <div key={i} className="mb-2">
                  {item.type && <p className="text-[12px] text-[#3d3d3d] font-medium">[{item.type}]</p>}
                  {item.detail && <p className="text-[12px] text-[#5a5a5a] whitespace-pre-line leading-relaxed">{item.detail}</p>}
                </div>
              ))}
            </div>
          )}
          
          {data.transportInfo && (
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-[12px] text-[#8b7355] font-medium mb-2">교통 안내</p>
              <p className="text-[12px] text-[#5a5a5a] whitespace-pre-line leading-relaxed">
                {data.transportInfo}
              </p>
            </div>
          )}
        </div>

        {/* Calendar / Countdown Section */}
        {(data.showCalendar || data.showCountdown) && data.weddingDate && (
          <div className="bg-white px-8 py-8 text-center">
            {data.showCalendar && (
              <div className="mb-4">
                <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase mb-3">Calendar</p>
                <p className="text-[14px] text-[#5a5a5a]">{data.date}</p>
              </div>
            )}
            {data.showCountdown && data.weddingDate && (
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase mb-2">D-Day</p>
                <p className="text-[28px] font-light text-[#c9a86c]">
                  D-{Math.max(0, Math.ceil((new Date(data.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Account Section */}
        {data.showAccount && (
          <div className="bg-white px-8 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Account</p>
              <p className="text-[13px] text-[#8b7355] mt-2">축하의 마음을 전해주세요</p>
            </div>
            
            <div className="space-y-4">
              {/* Groom Side Accounts */}
              {(data.groomFatherAccount?.account || data.groomMotherAccount?.account) && (
                <div className="bg-[#f8f9fa] rounded-lg p-4">
                  <p className="text-[11px] text-[#3182F6] font-medium mb-3">신랑측</p>
                  <div className="space-y-3">
                    {[data.groomFatherAccount, data.groomMotherAccount]
                      .filter(a => a?.account)
                      .map((acc, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <p className="text-[13px] text-[#3d3d3d]">{acc.bank} {acc.account}</p>
                            <p className="text-[12px] text-[#8b7355]">{acc.holder}</p>
                          </div>
                          <button className="px-3 py-1.5 bg-white rounded-md text-[11px] text-[#3182F6] font-medium">
                            복사
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Bride Side Accounts */}
              {(data.brideFatherAccount?.account || data.brideMotherAccount?.account) && (
                <div className="bg-[#fff5f5] rounded-lg p-4">
                  <p className="text-[11px] text-pink-500 font-medium mb-3">신부측</p>
                  <div className="space-y-3">
                    {[data.brideFatherAccount, data.brideMotherAccount]
                      .filter(a => a?.account)
                      .map((acc, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <p className="text-[13px] text-[#3d3d3d]">{acc.bank} {acc.account}</p>
                            <p className="text-[12px] text-[#8b7355]">{acc.holder}</p>
                          </div>
                          <button className="px-3 py-1.5 bg-white rounded-md text-[11px] text-pink-500 font-medium">
                            복사
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Legacy accounts support */}
              {data.groomAccounts?.some(a => a.account) && !data.groomFatherAccount?.account && (
                <div className="bg-[#f8f9fa] rounded-lg p-4">
                  <p className="text-[11px] text-[#3182F6] font-medium mb-3">신랑측</p>
                  <div className="space-y-3">
                    {data.groomAccounts.filter(a => a.account).map((acc, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-[13px] text-[#3d3d3d]">{acc.bank} {acc.account}</p>
                          <p className="text-[12px] text-[#8b7355]">{acc.holder}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-white rounded-md text-[11px] text-[#3182F6] font-medium">
                          복사
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.brideAccounts?.some(a => a.account) && !data.brideFatherAccount?.account && (
                <div className="bg-[#fff5f5] rounded-lg p-4">
                  <p className="text-[11px] text-pink-500 font-medium mb-3">신부측</p>
                  <div className="space-y-3">
                    {data.brideAccounts.filter(a => a.account).map((acc, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-[13px] text-[#3d3d3d]">{acc.bank} {acc.account}</p>
                          <p className="text-[12px] text-[#8b7355]">{acc.holder}</p>
                        </div>
                        <button className="px-3 py-1.5 bg-white rounded-md text-[11px] text-pink-500 font-medium">
                          복사
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Funding Section */}
        {data.showFunding && (
          <div className="bg-white px-8 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Funding</p>
            </div>
            {data.fundingMessage && (
              <p className="text-[14px] text-[#5a5a5a] leading-relaxed text-center whitespace-pre-line mb-4">
                {data.fundingMessage}
              </p>
            )}
            {data.fundingButtonName && (
              <button className="w-full py-3 bg-[#c9a86c] text-white rounded-lg text-[14px] font-medium">
                {data.fundingButtonName}
              </button>
            )}
          </div>
        )}

        {/* Gift Funding Section */}
        {data.showGiftFunding && (
          <div className="bg-[#faf9f7] px-8 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Gift</p>
            </div>
            {data.giftFundingMessage && (
              <p className="text-[14px] text-[#5a5a5a] leading-relaxed text-center whitespace-pre-line mb-4">
                {data.giftFundingMessage}
              </p>
            )}
            {data.giftFundingButtonName && (
              <button className="w-full py-3 bg-[#c9a86c] text-white rounded-lg text-[14px] font-medium">
                {data.giftFundingButtonName}
              </button>
            )}
          </div>
        )}

        {/* Baptismal Names */}
        {data.showBaptismalName && (
          <div className="bg-white px-8 py-8 text-center">
            <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase mb-4">Baptismal Name</p>
            <div className="flex justify-center gap-8">
              <div>
                {data.baptismalGroom && <p className="text-[13px] text-[#3d3d3d]">{data.baptismalGroom}</p>}
                {data.baptismalGroomFather && <p className="text-[12px] text-[#8b7355]">{data.baptismalGroomFather}</p>}
                {data.baptismalGroomMother && <p className="text-[12px] text-[#8b7355]">{data.baptismalGroomMother}</p>}
              </div>
              <div>
                {data.baptismalBride && <p className="text-[13px] text-[#3d3d3d]">{data.baptismalBride}</p>}
                {data.baptismalBrideFather && <p className="text-[12px] text-[#8b7355]">{data.baptismalBrideFather}</p>}
                {data.baptismalBrideMother && <p className="text-[12px] text-[#8b7355]">{data.baptismalBrideMother}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Guest Snap */}
        {data.showGuestSnap && (
          <div className="bg-[#faf9f7] px-8 py-8">
            <div className="text-center mb-4">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Guest Snap</p>
            </div>
            {data.guestSnapContent && (
              <p className="text-[13px] text-[#5a5a5a] text-center whitespace-pre-line leading-relaxed mb-4">
                {data.guestSnapContent}
              </p>
            )}
            <button className="w-full py-3 bg-white border border-[#c9a86c] text-[#c9a86c] rounded-lg text-[14px] font-medium">
              사진 업로드
            </button>
          </div>
        )}

        {/* Notice Section */}
        {data.showNotice && data.noticeTitle && (
          <div className="bg-[#faf9f7] px-8 py-8">
            <div className="text-center mb-4">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Notice</p>
            </div>
            <p className="text-[15px] text-[#3d3d3d] font-medium text-center mb-3">{data.noticeTitle}</p>
            {data.noticeItems?.filter(Boolean).map((item, i) => (
              <p key={i} className="text-[13px] text-[#5a5a5a] text-center mb-1">{item}</p>
            ))}
          </div>
        )}

        {/* Ending Message */}
        {data.showEndingMessage && (data.endingContent || data.endingPhoto) && (
          <div className="bg-white px-8 py-10">
            {data.endingPhoto && (
              <img src={data.endingPhoto} alt="Ending" className="w-full aspect-square object-cover rounded-lg mb-6" />
            )}
            {data.endingContent && (
              <p className="text-[14px] text-[#5a5a5a] leading-[2] text-center whitespace-pre-line">
                {data.endingContent}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#faf9f7] px-8 py-8 text-center">
          <div className="w-8 h-px bg-[#c9a86c] mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.15em] text-[#b0a090]">
            MADE WITH WE:VE
          </p>
        </div>
        
      </div>
    </div>
  )
}
