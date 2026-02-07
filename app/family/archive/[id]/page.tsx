"use client"

import { useState, useEffect, useRef, useCallback, use } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Play,
  MoreHorizontal,
  X,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

interface Memory {
  id: string
  date: string
  title: string
  location?: string
  photos: string[]
  description?: string
}

const ARCHIVE_DATA: Record<string, {
  title: string
  subtitle: string
  date: string
  memories: Memory[]
}> = {
  "dating-2024": {
    title: "연애 시절",
    subtitle: "우리의 시작",
    date: "2024년 3월",
    memories: [
      {
        id: "1",
        date: "2024.03.15",
        title: "첫 만남",
        location: "홍대 카페",
        photos: ["https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80"],
        description: "소개팅으로 처음 만난 날"
      },
      {
        id: "2",
        date: "2024.04.20",
        title: "첫 데이트",
        location: "경복궁",
        photos: [
          "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80",
          "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80"
        ],
        description: "한복 입고 경복궁 데이트"
      },
      {
        id: "3",
        date: "2024.06.23",
        title: "100일",
        location: "남산타워",
        photos: [
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
          "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80"
        ],
        description: "100일 기념"
      },
      {
        id: "4",
        date: "2024.08.10",
        title: "첫 여행",
        location: "부산",
        photos: [
          "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80",
          "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80"
        ],
        description: "1박 2일 부산 여행"
      },
      {
        id: "5",
        date: "2024.12.24",
        title: "크리스마스",
        location: "명동",
        photos: ["https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80"],
        description: "첫 크리스마스"
      }
    ]
  },
  "wedding-prep-2025": {
    title: "결혼 준비",
    subtitle: "함께 준비한 날들",
    date: "2025년 1월",
    memories: [
      {
        id: "1",
        date: "2025.01.14",
        title: "프로포즈",
        location: "한강",
        photos: [
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80"
        ],
        description: "한강에서 서프라이즈 프로포즈"
      },
      {
        id: "2",
        date: "2025.03.08",
        title: "웨딩홀 투어",
        location: "강남",
        photos: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80"],
        description: "웨딩홀 투어"
      },
      {
        id: "3",
        date: "2025.05.20",
        title: "스튜디오 촬영",
        location: "청담동",
        photos: [
          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
          "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80"
        ],
        description: "웨딩 촬영 완료"
      },
      {
        id: "4",
        date: "2025.08.15",
        title: "드레스 피팅",
        location: "이태원",
        photos: ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=800&q=80"],
        description: "드레스 최종 피팅"
      },
      {
        id: "5",
        date: "2025.12.07",
        title: "결혼식",
        location: "그랜드 하얏트",
        photos: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
          "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800&q=80"
        ],
        description: "우리의 결혼식"
      }
    ]
  },
  "honeymoon-2025": {
    title: "신혼여행",
    subtitle: "몰디브에서",
    date: "2025년 12월 10일",
    memories: [
      {
        id: "1",
        date: "2025.12.10",
        title: "출발",
        location: "인천공항",
        photos: ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"],
        description: "몰디브로 출발!"
      },
      {
        id: "2",
        date: "2025.12.11",
        title: "Day 1",
        location: "몰디브",
        photos: [
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
          "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80"
        ],
        description: "수상빌라에서의 첫날"
      },
      {
        id: "3",
        date: "2025.12.15",
        title: "스노클링",
        location: "몰디브",
        photos: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
          "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80"
        ],
        description: "바다거북이도 봤어요"
      },
      {
        id: "4",
        date: "2025.12.20",
        title: "새 집",
        location: "서울",
        photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"],
        description: "우리만의 보금자리"
      }
    ]
  }
}

type MusicTheme = "dating" | "wedding" | "family"

const MUSIC_SOURCES: Record<MusicTheme, string> = {
  dating: "/music/dating.mp3",
  wedding: "/music/wedding.mp3",
  family: "/music/family.mp3",
}

function SlideshowPlayer({
  photos,
  title,
  date,
  musicTheme,
  onClose,
}: {
  photos: string[]
  title: string
  date: string
  musicTheme: MusicTheme
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const SLIDE_DURATION = 4000

  useEffect(() => {
    const audio = new Audio(MUSIC_SOURCES[musicTheme])
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [musicTheme])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const startSlideshow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    setProgress(0)
    const startTime = Date.now()

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
    }, 50)

    intervalRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, SLIDE_DURATION)
  }, [photos.length])

  useEffect(() => {
    if (isPlaying) {
      startSlideshow()
    } else {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isPlaying, currentIndex, startSlideshow])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause()
      else audioRef.current.play().catch(() => {})
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black" data-testid="slideshow-player">
      {photos.map((photo, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{
            opacity: idx === currentIndex ? 1 : 0,
            transitionDuration: "1500ms",
          }}
        >
          <img
            src={photo}
            alt=""
            className="w-full h-full object-cover"
            style={{
              animation: idx === currentIndex ? "slideshowKenBurns 8s ease-in-out infinite alternate" : "none",
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-[2]" />

      <div className="absolute top-0 left-0 right-0 z-[3] safe-area-inset-top">
        <div className="flex gap-1 px-3 pt-14 mb-2">
          {photos.map((_, idx) => (
            <div key={idx} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%",
                  transition: idx === currentIndex ? "width 50ms linear" : "none",
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            data-testid="button-close-slideshow"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
              data-testid="button-toggle-mute"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[3] p-6 pb-12">
        <h2 className="text-[28px] font-bold text-white leading-tight" data-testid="text-slideshow-title">{title}</h2>
        <p className="text-[15px] text-white/70 mt-1">{date}</p>
      </div>

      <button
        onClick={togglePlay}
        className="absolute bottom-24 right-6 z-[3] w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        data-testid="button-toggle-playback"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white fill-white" />
        ) : (
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        )}
      </button>

      <style jsx>{`
        @keyframes slideshowKenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.2) translate(-3%, -2%); }
        }
      `}</style>
    </div>
  )
}

function PhotoViewer({
  photos,
  initialIndex,
  onClose,
}: {
  photos: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") setCurrentIndex((p) => Math.max(0, p - 1))
      if (e.key === "ArrowRight") setCurrentIndex((p) => Math.min(photos.length - 1, p + 1))
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [photos.length, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setTouchDelta(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return
    setTouchDelta(e.touches[0].clientX - touchStart)
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta) > 60) {
      if (touchDelta < 0 && currentIndex < photos.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else if (touchDelta > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      }
    }
    setTouchStart(null)
    setTouchDelta(0)
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black" data-testid="photo-viewer">
      <div
        className="w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[currentIndex]}
          alt=""
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ transform: touchStart !== null ? `translateX(${touchDelta}px)` : undefined }}
          data-testid="img-viewer-photo"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-14">
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
          data-testid="button-close-viewer"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <span className="text-[14px] text-white/70 font-medium" data-testid="text-photo-counter">
          {currentIndex + 1} / {photos.length}
        </span>
      </div>

      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"
          data-testid="button-photo-prev"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => setCurrentIndex(currentIndex + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"
          data-testid="button-photo-next"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  )
}

export default function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [showSlideshow, setShowSlideshow] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)

  const archive = ARCHIVE_DATA[id]

  if (!archive) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[17px] font-bold text-white mb-2">존재하지 않는 페이지입니다</p>
          <Link href="/family/archive" className="text-[#0A84FF]">돌아가기</Link>
        </div>
      </div>
    )
  }

  const allPhotos = archive.memories.flatMap((m) => m.photos)
  const totalPhotos = allPhotos.length
  const heroPhoto = allPhotos[0]
  const gridPhotos = allPhotos.slice(1)

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="relative">
        <div
          className="relative cursor-pointer"
          style={{ aspectRatio: "3/4" }}
          onClick={() => setViewerIndex(0)}
        >
          <img
            src={heroPhoto}
            alt={archive.title}
            className="w-full h-full object-cover"
            data-testid="img-hero-photo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-14">
          <Link
            href="/family/archive"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
            data-testid="link-back-archive"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
            <button className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-[14px] text-white font-medium">
              선택
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-5 pb-6">
          <h1 className="text-[28px] font-bold text-white leading-tight" data-testid="text-detail-title">
            {archive.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-[14px] text-white/70">
            <span data-testid="text-detail-date">{archive.date}</span>
            <span>·</span>
            <span data-testid="text-detail-count">{totalPhotos}개</span>
          </div>
        </div>

        <button
          onClick={() => setShowSlideshow(true)}
          className="absolute bottom-5 right-5 z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
          data-testid="button-play-slideshow"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </button>
      </div>

      <div className="px-0.5 pt-0.5">
        {(() => {
          const rows: string[][] = []
          let i = 0
          while (i < gridPhotos.length) {
            const remaining = gridPhotos.length - i
            if (remaining >= 3 && rows.length % 2 === 0) {
              rows.push(gridPhotos.slice(i, i + 3))
              i += 3
            } else if (remaining >= 2) {
              rows.push(gridPhotos.slice(i, i + 2))
              i += 2
            } else {
              rows.push(gridPhotos.slice(i, i + 1))
              i += 1
            }
          }

          return rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex gap-0.5 mb-0.5"
            >
              {row.map((photo, colIdx) => {
                const photoIndex = allPhotos.indexOf(photo)
                return (
                  <div
                    key={colIdx}
                    className="relative overflow-hidden cursor-pointer"
                    style={{
                      flex: row.length === 3
                        ? "1 1 33.333%"
                        : row.length === 2
                          ? colIdx === 0 ? "1 1 60%" : "1 1 40%"
                          : "1 1 100%",
                      aspectRatio: row.length === 3 ? "1/1" : row.length === 2 ? (colIdx === 0 ? "4/5" : "3/5") : "16/9",
                    }}
                    onClick={() => setViewerIndex(photoIndex)}
                    data-testid={`img-grid-photo-${rowIdx}-${colIdx}`}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          ))
        })()}
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={allPhotos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {showSlideshow && (
        <SlideshowPlayer
          photos={allPhotos}
          title={archive.title}
          date={archive.date}
          musicTheme={id.includes("dating") ? "dating" : id.includes("wedding") ? "wedding" : "family"}
          onClose={() => setShowSlideshow(false)}
        />
      )}

      <FamilyBottomNav />
    </div>
  )
}
