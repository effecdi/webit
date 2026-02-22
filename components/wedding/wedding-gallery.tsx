"use client"

import { useState } from "react"
import { Plus, X, Heart, Camera, Sparkles } from "lucide-react"

interface Photo {
  id: string
  url: string
  category: string
  date: string
  caption?: string
  liked?: boolean
}

const CATEGORIES = [
  { id: "all", label: "전체", icon: Sparkles },
  { id: "engagement", label: "스드메", icon: Camera },
  { id: "studio", label: "스튜디오", icon: Camera },
  { id: "daily", label: "일상", icon: Heart },
]

const DUMMY_PHOTOS: Photo[] = []

export function WeddingGallery() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [photos, setPhotos] = useState<Photo[]>(DUMMY_PHOTOS)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory)

  const toggleLike = (id: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p))
    )
  }

  return (
    <div className="p-4">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 border-2 border-secondary whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#D4AF37] text-secondary shadow-brutalist-sm"
                  : "bg-card hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-bold">{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Photo Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{filteredPhotos.length}</span>장의 사진
        </p>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary border-2 border-secondary text-primary-foreground text-sm font-bold shadow-brutalist-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="masonry-item"
          >
            <button
              onClick={() => setSelectedPhoto(photo)}
              className="relative w-full border-3 border-secondary shadow-brutalist overflow-hidden group"
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={photo.caption || "Wedding photo"}
                className={`w-full object-cover ${
                  index % 3 === 0 ? "h-64" : index % 3 === 1 ? "h-48" : "h-56"
                }`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLike(photo.id)
                }}
                className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center border-2 border-secondary transition-all ${
                  photo.liked
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/80 text-foreground hover:bg-card"
                }`}
              >
                <Heart className="w-4 h-4" fill={photo.liked ? "currentColor" : "none"} />
              </button>

              {/* Caption */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-card/90 border-t-2 border-secondary px-2 py-1">
                  <p className="text-xs font-bold truncate">{photo.caption}</p>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-card border-2 border-secondary flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-card border-3 border-secondary shadow-brutalist-lg overflow-hidden">
              <img
                src={selectedPhoto.url || "/placeholder.svg"}
                alt={selectedPhoto.caption || "Wedding photo"}
                className="w-full max-h-[60vh] object-contain bg-muted"
              />
              <div className="p-4 border-t-3 border-secondary">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{selectedPhoto.date}</p>
                  <button
                    onClick={() => toggleLike(selectedPhoto.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 border-2 border-secondary transition-all ${
                      selectedPhoto.liked
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={selectedPhoto.liked ? "currentColor" : "none"} />
                    <span className="text-xs font-bold">좋아요</span>
                  </button>
                </div>
                {selectedPhoto.caption && (
                  <p className="font-bold">{selectedPhoto.caption}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
