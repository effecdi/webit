"use client"

import { useState, useEffect, useRef } from "react"
import { Play } from "lucide-react"
import Link from "next/link"

const MEMORY_CARDS = [
  {
    id: "dating-2024",
    title: "연애 시절",
    subtitle: "우리의 시작",
    date: "2024년 3월",
    photos: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
      "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80",
    ],
  },
  {
    id: "wedding-prep-2025",
    title: "결혼 준비",
    subtitle: "함께 준비한 날들",
    date: "2025년 1월",
    photos: [
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80",
    ],
  },
  {
    id: "honeymoon-2025",
    title: "신혼여행",
    subtitle: "몰디브에서",
    date: "2025년 12월 10일",
    photos: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    ],
  },
]

function MemoryCard({ card }: { card: typeof MEMORY_CARDS[0] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || card.photos.length <= 1) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % card.photos.length)
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isVisible, card.photos.length])

  return (
    <Link
      ref={cardRef}
      href={`/family/archive/${card.id}`}
      className="block relative rounded-[20px] overflow-hidden"
      style={{ aspectRatio: "4/5" }}
      data-testid={`card-memory-${card.id}`}
    >
      {card.photos.map((photo, idx) => (
        <div
          key={idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: idx === currentIndex ? 1 : 0,
            zIndex: idx === currentIndex ? 1 : 0,
          }}
        >
          <img
            src={photo}
            alt=""
            className="w-full h-full object-cover"
            style={{
              animation: idx === currentIndex && isVisible ? "kenBurns 8s ease-in-out infinite alternate" : "none",
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      <div className="absolute bottom-0 left-0 right-0 z-[3] p-5">
        <h2 className="text-[22px] font-bold text-white leading-tight" data-testid={`text-memory-title-${card.id}`}>
          {card.title}
        </h2>
        <p className="text-[14px] text-white/80 mt-1" data-testid={`text-memory-date-${card.id}`}>
          {card.date}
        </p>
      </div>

      <button
        className="absolute bottom-4 right-4 z-[3] w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        data-testid={`button-play-${card.id}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
      </button>
    </Link>
  )
}

export function MemoryArchive() {
  return (
    <div className="px-4 py-4 max-w-md mx-auto space-y-4">
      {MEMORY_CARDS.map((card) => (
        <MemoryCard key={card.id} card={card} />
      ))}

      <div className="pt-2 pb-4">
        <p className="text-center text-[13px] text-white/30">
          최근 하이라이트
        </p>
      </div>

      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.15) translate(-2%, -2%);
          }
        }
      `}</style>
    </div>
  )
}
