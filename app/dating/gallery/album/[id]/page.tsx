"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, MoreHorizontal, X, Share2, Trash2, Check } from "lucide-react"
import { BottomSheet } from "@/components/ui/bottom-sheet"

interface Photo {
  id: number
  url: string
  title: string
  liked: boolean
  albumId: number | null
  createdAt: string
}

interface Album {
  id: number
  title: string
  thumbnail: string | null
  createdAt: string
  photoCount?: number
}

export default function AlbumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const albumId = parseInt(params.id as string)

  const [album, setAlbum] = useState<Album | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const fetchAlbumAndPhotos = useCallback(async () => {
    try {
      const [albumRes, photosRes] = await Promise.all([
        fetch(`/api/albums?id=${albumId}`),
        fetch(`/api/photos?albumId=${albumId}`)
      ])
      
      if (albumRes.ok) {
        const albumData = await albumRes.json()
        setAlbum(albumData)
      }
      
      if (photosRes.ok) {
        const photosData = await photosRes.json()
        setPhotos(photosData)
      }
    } catch (error) {
      console.error('Error fetching album:', error)
    } finally {
      setLoading(false)
    }
  }, [albumId])

  useEffect(() => {
    fetchAlbumAndPhotos()
  }, [fetchAlbumAndPhotos])

  function toggleSelectMode() {
    setIsSelectMode(!isSelectMode)
    setSelectedPhotos(new Set())
  }

  function togglePhotoSelection(photoId: number) {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId)
    } else {
      newSelected.add(photoId)
    }
    setSelectedPhotos(newSelected)
  }

  function selectAll() {
    if (selectedPhotos.size === photos.length) {
      setSelectedPhotos(new Set())
    } else {
      setSelectedPhotos(new Set(photos.map(p => p.id)))
    }
  }

  async function deleteSelectedPhotos() {
    if (selectedPhotos.size === 0) return
    
    if (!confirm(`${selectedPhotos.size}장의 사진을 삭제하시겠습니까?`)) return

    try {
      const photoIds = Array.from(selectedPhotos)
      await Promise.all(
        photoIds.map(photoId => 
          fetch(`/api/photos?id=${photoId}`, { method: 'DELETE' })
        )
      )
      await fetchAlbumAndPhotos()
      setSelectedPhotos(new Set())
      setIsSelectMode(false)
    } catch (error) {
      console.error('Error deleting photos:', error)
    }
  }

  async function removeFromAlbum() {
    if (selectedPhotos.size === 0) return
    
    if (!confirm(`${selectedPhotos.size}장의 사진을 앨범에서 제거하시겠습니까?`)) return

    try {
      const photoIds = Array.from(selectedPhotos)
      await Promise.all(
        photoIds.map(photoId =>
          fetch('/api/photos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: photoId, albumId: null })
          })
        )
      )
      await fetchAlbumAndPhotos()
      setSelectedPhotos(new Set())
      setIsSelectMode(false)
    } catch (error) {
      console.error('Error removing photos from album:', error)
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="px-5 py-4">
          <div className="h-6 w-32 bg-[#333] rounded-md animate-pulse mb-4" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#1a1a1a] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-lg mb-4">앨범을 찾을 수 없습니다</p>
        <Link href="/dating/gallery" className="text-pink-400" data-testid="link-back-gallery">갤러리로 돌아가기</Link>
      </div>
    )
  }

  const heroPhoto = photos.length > 0 ? photos[0] : null

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative aspect-[3/4] max-h-[50vh]">
        {heroPhoto ? (
          <img
            src={heroPhoto.url}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#2C2C2E] flex items-center justify-center">
            <p className="text-[#8B8B8D]">사진이 없습니다</p>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 pt-safe">
          <div className="flex items-center justify-between px-4 py-3">
            {isSelectMode ? (
              <>
                <button
                  onClick={selectAll}
                  className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[14px] font-medium"
                  data-testid="button-select-all"
                >
                  {selectedPhotos.size === photos.length ? '선택 해제' : '전체 선택'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMoreMenu(true)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                    data-testid="button-more-menu"
                  >
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={toggleSelectMode}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                    data-testid="button-close-select"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10" />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMoreMenu(true)}
                    className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center"
                    data-testid="button-album-options"
                  >
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={toggleSelectMode}
                    className="px-5 py-2.5 bg-pink-500 rounded-full text-white text-[14px] font-medium"
                    data-testid="button-select-mode"
                  >
                    선택
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Album Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-[28px] font-bold text-white mb-2" data-testid="text-album-title">{album.title}</h1>
          <div className="flex items-center gap-2 text-white/80 text-[14px]">
            <span className="flex items-center gap-1" data-testid="text-album-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {formatDate(album.createdAt)}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1" data-testid="text-photo-count">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              {photos.length}개
            </span>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="p-1 pb-24">
        {photos.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#8B8B8D] text-[15px]">아직 사진이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-0.5">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => isSelectMode ? togglePhotoSelection(photo.id) : null}
                className={`relative aspect-square ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                data-testid={`photo-item-${photo.id}`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                {isSelectMode && (
                  <div className={`absolute inset-0 ${selectedPhotos.has(photo.id) ? 'bg-black/30' : ''}`}>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedPhotos.has(photo.id) 
                        ? 'bg-pink-500 border-pink-500' 
                        : 'border-white/70 bg-black/30'}`}
                    >
                      {selectedPhotos.has(photo.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selection Mode Bottom Bar */}
      {isSelectMode && selectedPhotos.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] pb-safe z-40">
          <div className="flex justify-around items-center h-20 max-w-md mx-auto px-8">
            <button 
              onClick={() => alert('공유 기능은 준비 중입니다')}
              className="flex flex-col items-center gap-1 text-[#8B8B8D]"
              data-testid="button-share"
            >
              <Share2 className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-[14px] text-white" data-testid="text-selected-count">
                {selectedPhotos.size}장의 사진이 선택됨
              </span>
            </div>
            <button 
              onClick={deleteSelectedPhotos}
              className="flex flex-col items-center gap-1 text-white"
              data-testid="button-delete"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* More Menu Modal */}
      <BottomSheet
        open={showMoreMenu}
        onOpenChange={setShowMoreMenu}
        className="bg-[#2C2C2E] z-[60] overflow-hidden"
        overlayClassName="z-[60]"
      >
            <div className="py-2">
              {isSelectMode && selectedPhotos.size > 0 && (
                <button
                  onClick={() => {
                    setShowMoreMenu(false)
                    removeFromAlbum()
                  }}
                  className="w-full px-5 py-4 flex items-center gap-4"
                  data-testid="button-remove-from-album"
                >
                  <span className="text-[17px] text-white">앨범에서 제거</span>
                </button>
              )}
              <button
                onClick={() => alert('공유 기능은 준비 중입니다')}
                className="w-full px-5 py-4 flex items-center gap-4"
                data-testid="button-share-album"
              >
                <span className="text-[17px] text-[#8B8B8D]">공유하기 (준비중)</span>
              </button>
            </div>
            <button
              onClick={() => setShowMoreMenu(false)}
              className="w-full py-4 text-[17px] text-pink-500 border-t border-[#48484A]"
              data-testid="button-close-menu"
            >
              취소
            </button>
      </BottomSheet>
    </div>
  )
}
