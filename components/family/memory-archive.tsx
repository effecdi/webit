"use client"

import { useState, useEffect, useRef } from "react"
import { Play } from "lucide-react"
import Link from "next/link"

const MEMORY_CARDS: { id: string; title: string; subtitle: string; date: string; photos: string[] }[] = []

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
