"use client"

import { useState, useEffect } from "react"
import { Plus, X, ChevronLeft, ChevronRight, Heart, Upload } from "lucide-react"
import { ImageIcon } from "lucide-react"
import Link from "next/link"

interface Album {
  id: number
  title: string
  thumbnail: string | null
  eventDate: string | null
  photoCount: number
}

interface Photo {
  id: number
  url: string
  caption: string | null
  liked: boolean
  createdAt: string
}

export function GalleryView() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false)
  const [newAlbumTitle, setNewAlbumTitle] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [albumsRes, photosRes] = await Promise.all([
        fetch('/api/albums?userId=default&mode=dating'),
        fetch('/api/photos?userId=default&mode=dating')
      ])
      const albumsData = await albumsRes.json()
      const photosData = await photosRes.json()
      setAlbums(albumsData)
      setPhotos(photosData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }

  const toggleLike = async (id: number) => {
    const photo = photos.find(p => p.id === id)
    if (!photo) return
    
    try {
      await fetch('/api/photos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, liked: !photo.liked })
      })
      setPhotos(photos.map(p => p.id === id ? { ...p, liked: !p.liked } : p))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const createAlbum = async () => {
    if (!newAlbumTitle.trim()) return
    
    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default',
          title: newAlbumTitle,
          mode: 'dating'
        })
      })
      const newAlbum = await res.json()
      setAlbums([newAlbum, ...albums])
      setNewAlbumTitle("")
      setShowAddAlbumModal(false)
    } catch (error) {
      console.error('Error creating album:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
          <Link href="/dating" className="p-2 -ml-2 rounded-full hover:bg-[#F2F4F6]">
            <ChevronLeft className="w-6 h-6 text-[#191F28]" />
          </Link>
          <h1 className="text-[17px] font-bold text-[#191F28]">갤러리</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="px-5 py-5 max-w-md mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">앨범</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            <button 
              onClick={() => setShowAddAlbumModal(true)}
              className="flex-shrink-0 w-28 h-36 bg-[#F2F4F6] rounded-[16px] flex flex-col items-center justify-center gap-2 hover:bg-[#E5E8EB] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#D1D6DB] flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span className="text-[12px] text-[#8B95A1]">앨범 추가</span>
            </button>
            
            {isLoading ? (
              <div className="flex-shrink-0 w-28 h-36 bg-[#F2F4F6] rounded-[16px] animate-pulse" />
            ) : albums.length === 0 ? (
              <div className="flex-shrink-0 w-full py-4 text-center text-[#8B95A1] text-[13px]">
                앨범을 추가해보세요
              </div>
            ) : (
              albums.map((album) => (
                <div
                  key={album.id}
                  className="flex-shrink-0 w-28 rounded-[16px] overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="relative h-24 bg-gradient-to-br from-pink-100 to-purple-100">
                    {album.thumbnail ? (
                      <img
                        src={album.thumbnail}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-pink-300" />
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-2">
                    <p className="text-[13px] font-medium text-[#191F28] truncate">{album.title}</p>
                    <p className="text-[11px] text-[#8B95A1]">{album.photoCount}장</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[17px] font-bold text-[#191F28]">모든 사진</h3>
            <span className="text-[13px] text-[#8B95A1]">{photos.length}장</span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-[#F2F4F6] rounded-[4px] animate-pulse" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-pink-300" />
              </div>
              <p className="text-[#8B95A1] text-[14px]">아직 사진이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">사진을 추가해서 추억을 남겨보세요</p>
              <button className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-full text-[14px] font-medium flex items-center gap-2 mx-auto hover:bg-pink-600 transition-colors">
                <Upload className="w-4 h-4" />
                사진 추가하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="relative aspect-square overflow-hidden rounded-[4px] group"
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {photo.liked && (
                    <div className="absolute top-1 right-1">
                      <Heart className="w-4 h-4 text-pink-500" fill="#ec4899" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedPhotoIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {selectedPhotoIndex < photos.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          <img
            src={photos[selectedPhotoIndex].url}
            alt=""
            className="max-w-full max-h-full object-contain"
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <span className="text-white text-[13px]">
                {formatDate(photos[selectedPhotoIndex].createdAt)}
              </span>
              <button
                onClick={() => toggleLike(photos[selectedPhotoIndex].id)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <Heart
                  className={`w-6 h-6 ${photos[selectedPhotoIndex].liked ? "text-pink-500" : "text-white"}`}
                  fill={photos[selectedPhotoIndex].liked ? "#ec4899" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5" onClick={() => setShowAddAlbumModal(false)}>
          <div className="bg-white rounded-[24px] w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
            <h3 className="text-[17px] font-bold text-[#191F28] mb-4">새 앨범 만들기</h3>
            <input
              type="text"
              value={newAlbumTitle}
              onChange={e => setNewAlbumTitle(e.target.value)}
              placeholder="앨범 이름"
              className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] focus:outline-none focus:ring-2 focus:ring-pink-300 mb-4"
              data-testid="input-album-title"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddAlbumModal(false)}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px]"
              >
                취소
              </button>
              <button
                onClick={createAlbum}
                disabled={!newAlbumTitle.trim()}
                className="flex-1 py-3 bg-pink-500 disabled:bg-[#E5E8EB] text-white font-medium rounded-[12px]"
                data-testid="button-create-album"
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-20" />

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E8EB] pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-5">
          <Link href="/dating" className="flex flex-col items-center gap-1 text-[#8B95A1]">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <span className="text-[10px]">홈</span>
          </Link>
          <Link href="/dating/calendar" className="flex flex-col items-center gap-1 text-[#8B95A1]">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-[10px]">캘린더</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-pink-500">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <span className="text-[10px] font-medium">갤러리</span>
          </div>
          <Link href="/dating/profile" className="flex flex-col items-center gap-1 text-[#8B95A1]">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <circle cx="12" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              </svg>
            </div>
            <span className="text-[10px]">프로필</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
