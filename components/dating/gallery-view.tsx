"use client"

import { useState } from "react"
import { Plus, X, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { ImageIcon } from "lucide-react"
import Link from "next/link"

interface TravelGroup {
  id: string
  title: string
  thumbnail: string
  dday?: string
  count: number
}

interface Photo {
  id: string
  url: string
  date: string
}

const TRAVEL_GROUPS: TravelGroup[] = [
  {
    id: "1",
    title: "제주도 여행",
    thumbnail: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80",
    dday: "D-24",
    count: 0,
  },
  {
    id: "2",
    title: "2주년 기념일",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    dday: "D-10",
    count: 12,
  },
  {
    id: "3",
    title: "부산 여행",
    thumbnail: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80",
    count: 48,
  },
  {
    id: "4",
    title: "크리스마스",
    thumbnail: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&q=80",
    count: 23,
  },
]

const PHOTOS: Photo[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80", date: "2026.01.15" },
  { id: "2", url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80", date: "2026.01.14" },
  { id: "3", url: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80", date: "2026.01.13" },
  { id: "4", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80", date: "2026.01.12" },
  { id: "5", url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80", date: "2026.01.11" },
  { id: "6", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80", date: "2026.01.10" },
  { id: "7", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", date: "2026.01.09" },
  { id: "8", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80", date: "2026.01.08" },
  { id: "9", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", date: "2026.01.07" },
  { id: "10", url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80", date: "2026.01.06" },
]

export function GalleryView() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})
  const [showAddModal, setShowAddModal] = useState(false)

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < PHOTOS.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }

  const toggleLike = (id: string) => {
    setIsLiked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
  {/* Header */}
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
  <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
  <h1 className="text-[20px] font-bold text-[#191F28]">갤러리</h1>
  <div className="w-10" />
  </div>
  </header>

      <div className="px-5 py-5 max-w-md mx-auto">
        {/* Travel Groups - Horizontal Scroll */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">앨범</h3>
            <button className="text-[13px] text-[#8B95A1]">전체보기</button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {/* Add Album Button */}
            <button className="flex-shrink-0 w-28 h-36 bg-[#F2F4F6] rounded-[16px] flex flex-col items-center justify-center gap-2 hover:bg-[#E5E8EB] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#D1D6DB] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[12px] text-[#8B95A1]">앨범 추가</span>
            </button>
            
            {TRAVEL_GROUPS.map((group) => (
              <div
                key={group.id}
                className="flex-shrink-0 w-28 rounded-[16px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-24">
                  <img
                    src={group.thumbnail || "/placeholder.svg"}
                    alt={group.title}
                    className="w-full h-full object-cover"
                  />
                  {group.dday && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <span className="text-[10px] font-bold text-[#FF8A80]">{group.dday}</span>
                    </div>
                  )}
                </div>
                <div className="bg-white p-2">
                  <p className="text-[13px] font-medium text-[#191F28] truncate">{group.title}</p>
                  <p className="text-[11px] text-[#8B95A1]">{group.count}장</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">모든 사진</h3>
            <span className="text-[13px] text-[#8B95A1]">{PHOTOS.length}장</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {PHOTOS.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="relative aspect-square overflow-hidden rounded-[4px] group"
              >
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {isLiked[photo.id] && (
                  <div className="absolute top-1 right-1">
                    <Heart className="w-4 h-4 text-[#FF8A80] fill-[#FF8A80]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#FF8A80] hover:bg-[#FF6B6B] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Photo Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            <div className="px-5 pb-8">
              <h3 className="text-[19px] font-bold text-[#191F28] mb-5">사진 추가</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-3 p-6 bg-[#F2F4F6] rounded-[16px] hover:bg-[#E5E8EB] transition-colors">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-pink-500" />
                  </div>
                  <span className="text-[14px] font-medium text-[#333D4B]">갤러리에서 선택</span>
                </button>
                
                <button className="flex flex-col items-center gap-3 p-6 bg-[#F2F4F6] rounded-[16px] hover:bg-[#E5E8EB] transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-[14px] font-medium text-[#333D4B]">카메라로 촬영</span>
                </button>
              </div>
              
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-full mt-4 py-3.5 text-[#8B95A1] text-[15px] font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 bg-black/80">
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <span className="text-[15px] text-white/80">
              {selectedPhotoIndex + 1} / {PHOTOS.length}
            </span>
            <button 
              onClick={() => toggleLike(PHOTOS[selectedPhotoIndex].id)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Heart 
                className={`w-6 h-6 ${isLiked[PHOTOS[selectedPhotoIndex].id] ? "text-[#FF8A80] fill-[#FF8A80]" : "text-white"}`} 
              />
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={PHOTOS[selectedPhotoIndex].url || "/placeholder.svg"}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {selectedPhotoIndex > 0 && (
              <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {selectedPhotoIndex < PHOTOS.length - 1 && (
              <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 bg-black/80">
            <p className="text-[14px] text-white/60">{PHOTOS[selectedPhotoIndex].date}</p>
            <p className="text-[15px] text-white mt-1">함께한 순간</p>
          </div>
        </div>
      )}
    </>
  )
}
