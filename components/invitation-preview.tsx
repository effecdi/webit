"use client"

import type { InvitationData } from "@/app/wedding/editor/page"
import { Heart, MapPin, Calendar, Navigation, Clock } from "lucide-react"

interface InvitationPreviewProps {
  data: InvitationData & { date?: string; time?: string }
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#faf9f7]">
      {/* Invitation Card - Vertical Scroll Layout */}
      <div className="max-w-[360px] mx-auto">
        
        {/* Cover Section */}
        <div className="relative">
          {data.coverImage ? (
            <img
              src={data.coverImage || "/placeholder.svg"}
              alt="Wedding Cover"
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-gradient-to-b from-[#f5ebe0] to-[#faf9f7] flex items-center justify-center">
              <p className="text-[14px] text-[#b0a090]">커버 사진을 추가해주세요</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#faf9f7]" />
          
          {/* Overlay Text */}
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
        </div>

        {/* Message Section */}
        <div className="bg-white px-8 py-10">
          <div className="text-center mb-6">
            <Heart className="w-5 h-5 text-[#e8b4b8] mx-auto mb-3" fill="#e8b4b8" />
            <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Invitation</p>
          </div>
          
          <p className="text-[14px] text-[#5a5a5a] leading-[2] text-center whitespace-pre-line">
            {data.message || "인사말을 입력해주세요"}
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <p className="text-[15px] text-[#3d3d3d] font-medium">{data.groomName || "신랑"}</p>
            </div>
            <div className="w-px h-8 bg-[#e0d5c7]" />
            <div className="text-center">
              <p className="text-[15px] text-[#3d3d3d] font-medium">{data.brideName || "신부"}</p>
            </div>
          </div>
        </div>

        {/* Timeline Section - Our Story */}
        {data.timeline && data.timeline.length > 0 && (
          <div className="bg-[#faf9f7] px-6 py-10">
            <div className="text-center mb-8">
              <p className="text-[18px] font-medium text-[#3d3d3d]">타임라인</p>
              <div className="w-full h-px bg-[#e0d5c7] mt-4 border-dashed" style={{ borderStyle: 'dashed' }} />
            </div>
            
            {/* Timeline with alternating layout */}
            <div className="relative">
              {/* Vertical center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#e8d5c4] -translate-x-1/2" />
              
              <div className="space-y-8">
                {data.timeline.map((item, index) => {
                  const isLeft = index % 2 === 0
                  return (
                    <div key={index} className="relative">
                      {/* Center dot */}
                      <div className="absolute left-1/2 top-6 w-3 h-3 rounded-full bg-[#e8b4b8] -translate-x-1/2 z-10" />
                      
                      <div className={`flex ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Image side */}
                        <div className={`w-[45%] ${isLeft ? 'pr-4' : 'pl-4'}`}>
                          {item.image ? (
                            <img 
                              src={item.image || "/placeholder.svg"} 
                              alt={item.title}
                              className="w-full aspect-[4/3] object-cover rounded-lg shadow-sm"
                            />
                          ) : (
                            <div className="w-full aspect-[4/3] bg-[#f0ebe3] rounded-lg" />
                          )}
                        </div>
                        
                        {/* Text side */}
                        <div className={`w-[45%] ${isLeft ? 'pl-4 text-left' : 'pr-4 text-right'} pt-2`}>
                          <p className="text-[12px] text-[#8b7355] mb-1">{item.date}</p>
                          <p className="text-[15px] font-medium text-[#3d3d3d] mb-1">{item.title}</p>
                          <p className="text-[12px] text-[#8b7355] leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {data.galleryImages && data.galleryImages.length > 0 && (
          <div className="bg-white px-6 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Gallery</p>
            </div>
            
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
          </div>
          
          {/* Map Placeholder */}
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

          {/* Transportation Info */}
          {data.transportInfo && (
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-[12px] text-[#8b7355] font-medium mb-2">교통 안내</p>
              <p className="text-[12px] text-[#5a5a5a] whitespace-pre-line leading-relaxed">
                {data.transportInfo}
              </p>
            </div>
          )}
        </div>

        {/* Account Section */}
        {data.showAccount && (data.groomAccounts?.some(a => a.account) || data.brideAccounts?.some(a => a.account)) && (
          <div className="bg-white px-8 py-10">
            <div className="text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] text-[#c9a86c] uppercase">Account</p>
              <p className="text-[13px] text-[#8b7355] mt-2">축하의 마음을 전해주세요</p>
            </div>
            
            <div className="space-y-4">
              {/* Groom Side */}
              {data.groomAccounts?.some(a => a.account) && (
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
              
              {/* Bride Side */}
              {data.brideAccounts?.some(a => a.account) && (
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
