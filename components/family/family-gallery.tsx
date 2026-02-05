"use client"

import { useState } from "react"
import { Heart, Book, ChevronRight, ImageIcon, Plus, X, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const SAMPLE_PHOTOS = [
  { id: 1, src: "/placeholder.svg?height=300&width=300", date: "2026.02.01", liked: true },
  { id: 2, src: "/placeholder.svg?height=400&width=300", date: "2026.01.28", liked: false },
  { id: 3, src: "/placeholder.svg?height=250&width=300", date: "2026.01.25", liked: true },
  { id: 4, src: "/placeholder.svg?height=350&width=300", date: "2026.01.20", liked: false },
  { id: 5, src: "/placeholder.svg?height=300&width=300", date: "2026.01.15", liked: false },
  { id: 6, src: "/placeholder.svg?height=280&width=300", date: "2026.01.10", liked: true },
]

export function FamilyGallery() {
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS)
  const [showAddModal, setShowAddModal] = useState(false)

  const toggleLike = (id: number) => {
    setPhotos(photos.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)))
  }

  return (
    <>
      <div className="px-5 py-5 max-w-md mx-auto">
        {/* Archive Link Banner */}
        <Link
          href="/family/archive"
          className="flex items-center justify-between p-4 mb-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-[16px] hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-100 rounded-[12px] flex items-center justify-center">
              <Book className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#191F28]">지난 추억 보러가기</p>
              <p className="text-[12px] text-[#8B95A1]">연애/결혼 시절 사진 모아보기</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-bold text-amber-600">471장</span>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </div>
        </Link>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <p className="text-[22px] font-bold text-green-500">156</p>
            <p className="text-[12px] text-[#8B95A1]">올해 사진</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <p className="text-[22px] font-bold text-pink-500">42</p>
            <p className="text-[12px] text-[#8B95A1]">좋아요</p>
          </div>
          <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
            <p className="text-[22px] font-bold text-[#191F28]">627</p>
            <p className="text-[12px] text-[#8B95A1]">전체</p>
          </div>
        </div>

        {/* Current Section Title */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] tracking-widest text-[#8B95A1] uppercase mb-0.5">Recent</p>
            <h2 className="text-[17px] font-bold text-[#191F28]">최근 사진</h2>
          </div>
          <button className="flex items-center gap-1 text-[13px] text-[#8B95A1] hover:text-[#4E5968] transition-colors">
            <ImageIcon className="w-4 h-4" />
            전체보기
          </button>
        </div>

        {/* Photo Grid - 3 columns */}
        <div className="grid grid-cols-3 gap-1 rounded-[16px] overflow-hidden">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square group">
              <Image
                src={photo.src || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Like Button */}
              <button
                onClick={() => toggleLike(photo.id)}
                className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  photo.liked
                    ? "bg-pink-500 text-white"
                    : "bg-white/80 text-[#8B95A1] opacity-0 group-hover:opacity-100"
                }`}
              >
                <Heart className="w-4 h-4" fill={photo.liked ? "currentColor" : "none"} />
              </button>

              {/* Date - Bottom */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] text-white bg-black/50 px-2 py-0.5 rounded-full">{photo.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-5 text-center">
          <button className="px-6 py-3 bg-white rounded-[14px] text-[14px] font-semibold text-[#4E5968] shadow-sm hover:shadow-md transition-all">
            더 불러오기
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
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
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-[14px] font-medium text-[#333D4B]">갤러리에서 선택</span>
                </button>
                
                <button className="flex flex-col items-center gap-3 p-6 bg-[#F2F4F6] rounded-[16px] hover:bg-[#E5E8EB] transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-blue-500" />
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
    </>
  )
}
