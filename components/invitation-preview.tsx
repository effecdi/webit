"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { InvitationData } from "@/app/wedding/editor/page"
import { MUSIC_TRACKS } from "@/lib/music-tracks"
import { Phone, Copy, ChevronLeft, ChevronRight, X, Volume2, VolumeX, MessageCircle, Share2, Link2 } from "lucide-react"
import { usePreviewState } from "./invitation-layouts/use-preview-state"
import { CinematicLayout } from "./invitation-layouts/CinematicLayout"
import { ModernLayout } from "./invitation-layouts/ModernLayout"
import { ClassicLayout } from "./invitation-layouts/ClassicLayout"
import { MagazineLayout } from "./invitation-layouts/MagazineLayout"
import { PolaroidLayout } from "./invitation-layouts/PolaroidLayout"
import { ChatLayout } from "./invitation-layouts/ChatLayout"
import { TraditionalLayout } from "./invitation-layouts/TraditionalLayout"
import { GardenLayout } from "./invitation-layouts/GardenLayout"
import { PosterLayout } from "./invitation-layouts/PosterLayout"
import { BoardingPassLayout } from "./invitation-layouts/BoardingPassLayout"
import { CalligraphyLayout } from "./invitation-layouts/CalligraphyLayout"
import { BottomSheet } from "@/components/ui/bottom-sheet"

interface InvitationPreviewProps {
  data: InvitationData & { date?: string; time?: string }
  isShared?: boolean
  autoPlayMusic?: boolean
  showMusicControls?: boolean
  onTextScaleChange?: (scale: number) => void
  textScale?: number
  shareId?: string
}

function getLayoutPageBg(template: string): string {
  switch (template) {
    case "cinematic": return "#1E1B16"
    case "classic": return "#F5F5F0"
    case "magazine": return "#FFFFFF"
    case "polaroid": return "#FDFCF9"
    case "chat": return "#F7F4EF"
    case "traditional": return "#1e2a3a"
    case "garden": return "#FFFFFF"
    case "poster": return "#FDF8F0"
    case "boardingpass": return "#1E2D4A"
    case "calligraphy": return "#FBF8F4"
    case "modern":
    default: return "#FFFFFF"
  }
}

export function InvitationPreview({ data, isShared = false, autoPlayMusic = false, showMusicControls = false, onTextScaleChange, textScale: externalTextScale, shareId }: InvitationPreviewProps) {
  const { state, helpers, addGuestSnapPhoto } = usePreviewState(data)
  const guestSnapInputRef = useRef<HTMLInputElement>(null)
  const [openingDone, setOpeningDone] = useState(!data.showOpening)
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [internalTextScale, setInternalTextScale] = useState(1)
  const textScale = externalTextScale ?? internalTextScale
  const [showControls, setShowControls] = useState(true)
  const shouldAutoPlay = isShared || autoPlayMusic
  const shouldShowMusicControls = isShared || showMusicControls
  const musicStartedRef = useRef(false)

  const getMusicUrl = useCallback(() => {
    if (!data.showMusic || !data.musicTrack) return ""
    const track = MUSIC_TRACKS.find(t => t.name === data.musicTrack)
    return track ? track.file : ""
  }, [data.showMusic, data.musicTrack])

  const startMusic = useCallback(() => {
    const audio = audioRef.current
    const musicUrl = getMusicUrl()
    if (!musicUrl || !audio || musicStartedRef.current) return
    musicStartedRef.current = true
    if (!audio.src || !audio.src.includes(musicUrl.replace(/^\//, ""))) {
      audio.src = musicUrl
      audio.loop = true
      audio.volume = 0.5
    }
    audio.play().then(() => setIsMusicPlaying(true)).catch((err) => {
      console.error("Music autoplay failed:", err)
      setIsMusicPlaying(false)
      musicStartedRef.current = false
    })
  }, [getMusicUrl])

  useEffect(() => {
    const audio = audioRef.current
    const musicUrl = getMusicUrl()

    if (!musicUrl || !audio) {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
      setIsMusicPlaying(false)
      musicStartedRef.current = false
      return
    }

    audio.src = musicUrl
    audio.loop = true
    audio.volume = 0.5

    const handleEnded = () => setIsMusicPlaying(false)
    const handlePlay = () => setIsMusicPlaying(true)
    const handlePause = () => setIsMusicPlaying(false)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    if (shouldAutoPlay && !data.showOpening) {
      audio.play().then(() => {
        setIsMusicPlaying(true)
        musicStartedRef.current = true
      }).catch(() => {
        setIsMusicPlaying(false)
        musicStartedRef.current = false
      })
    }

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.pause()
    }
  }, [getMusicUrl, shouldAutoPlay, data.showOpening])

  useEffect(() => {
    if (!data.showOpening || openingDone) return
    const autoAdvance = setTimeout(() => setOpeningDone(true), 6000)
    return () => clearTimeout(autoAdvance)
  }, [data.showOpening, openingDone])

  useEffect(() => {
    if (isShared && showControls) {
      const timer = setTimeout(() => setShowControls(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [isShared, showControls])

  useEffect(() => {
    if (shouldShowMusicControls && !isShared) {
      setShowControls(true)
    }
  }, [shouldShowMusicControls, isShared])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isMusicPlaying) {
      audio.pause()
      setIsMusicPlaying(false)
    } else {
      const musicUrl = getMusicUrl()
      if (musicUrl) {
        if (!audio.src || !audio.src.includes(musicUrl.replace(/^\//, ""))) {
          audio.src = musicUrl
          audio.loop = true
          audio.volume = 0.5
        }
        audio.play().then(() => setIsMusicPlaying(true)).catch((err) => {
          console.error("Music play failed:", err)
          setIsMusicPlaying(false)
        })
      }
    }
  }

  const increaseTextSize = () => {
    const newScale = Math.min(textScale + 0.1, 1.5)
    setInternalTextScale(newScale)
    onTextScaleChange?.(newScale)
  }

  const decreaseTextSize = () => {
    const newScale = Math.max(textScale - 0.1, 0.7)
    setInternalTextScale(newScale)
    onTextScaleChange?.(newScale)
  }

  const pageBg = getLayoutPageBg(data.mainTemplate || "modern")

  const handleRsvpClick = () => {
    setShowRsvpModal(true)
  }

  const handleGuestSnapUpload = useCallback(() => {
    guestSnapInputRef.current?.click()
  }, [])

  const handleGuestSnapFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      addGuestSnapPhoto(url)
    })
    e.target.value = ""
  }, [addGuestSnapPhoto])

  const renderLayout = () => {
    const props = { data, state, helpers, onRsvpClick: handleRsvpClick, onGuestSnapUpload: handleGuestSnapUpload }
    switch (data.mainTemplate) {
      case "cinematic": return <CinematicLayout {...props} />
      case "classic": return <ClassicLayout {...props} />
      case "magazine": return <MagazineLayout {...props} />
      case "polaroid": return <PolaroidLayout {...props} />
      case "chat": return <ChatLayout {...props} />
      case "traditional": return <TraditionalLayout {...props} />
      case "garden": return <GardenLayout {...props} />
      case "poster": return <PosterLayout {...props} />
      case "boardingpass": return <BoardingPassLayout {...props} />
      case "calligraphy": return <CalligraphyLayout {...props} />
      case "modern":
      default: return <ModernLayout {...props} />
    }
  }

  const [shareCopied, setShareCopied] = useState(false)

  const currentShareUrl = typeof window !== "undefined" && shareId
    ? `${window.location.origin}/s/${shareId}`
    : typeof window !== "undefined"
    ? window.location.href
    : ""

  const handleCopyShareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [currentShareUrl])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.groomName || "신랑"} ♥ ${data.brideName || "신부"} 결혼합니다`,
          text: "저희 결혼식에 초대합니다.",
          url: currentShareUrl,
        })
      } catch {}
    } else {
      handleCopyShareUrl()
    }
  }, [data, currentShareUrl, handleCopyShareUrl])

  const handleFirstInteraction = useCallback(() => {
    if (shouldAutoPlay && !musicStartedRef.current && getMusicUrl()) {
      startMusic()
    }
  }, [shouldAutoPlay, getMusicUrl, startMusic])

  const resolvedFontKorean = data.fontKorean
    ? `'${data.fontKorean}', cursive`
    : undefined
  const resolvedFontEnglish = data.fontEnglish
    ? `'${data.fontEnglish}', cursive`
    : undefined

  const combinedFontFamily = (() => {
    if (resolvedFontEnglish && resolvedFontKorean) {
      return `${resolvedFontEnglish}, ${resolvedFontKorean}`
    }
    if (resolvedFontEnglish) return resolvedFontEnglish
    if (resolvedFontKorean) return resolvedFontKorean
    return undefined
  })()

  return (
    <div
      className="w-full h-full overflow-y-auto relative"
      style={{
        backgroundColor: pageBg,
        ...(combinedFontFamily ? { fontFamily: combinedFontFamily } : {}),
      }}
      data-testid="invitation-preview"
      data-font-korean={data.fontKorean || ""}
      data-font-english={data.fontEnglish || ""}
      onClick={() => {
        if (isShared || shouldShowMusicControls) setShowControls(true)
        handleFirstInteraction()
      }}
    >
      <audio ref={audioRef} preload="none" />
      <input
        ref={guestSnapInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGuestSnapFileChange}
        className="hidden"
      />

      {(shouldShowMusicControls || isShared) && (
        <div
          className={`${isShared ? "fixed" : "absolute"} top-4 right-4 z-50 flex flex-col gap-2 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ fontSize: "16px" }}
        >
          {shouldShowMusicControls && data.showMusic && data.musicTrack && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleMusic(); }}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
              data-testid="button-toggle-music"
            >
              {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}
          {isShared && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); increaseTextSize(); }}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
                data-testid="button-text-increase"
              >
                <span className="text-[13px] font-bold">A+</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); decreaseTextSize(); }}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
                data-testid="button-text-decrease"
              >
                <span className="text-[13px] font-bold">A-</span>
              </button>
            </>
          )}
        </div>
      )}

      <div
        className="max-w-[420px] mx-auto"
        style={isShared && textScale !== 1 ? { zoom: textScale } : undefined}
      >

        <AnimatePresence mode="wait">
          {data.showOpening && !openingDone && (
            <motion.div
              key="opening"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {(data.openingType === "type1" || (!data.openingType)) && (
                <div
                  className="relative w-full overflow-hidden bg-black"
                  style={{ minHeight: "100dvh" }}
                >
                  {(data.openingScenes?.[0] || data.coverImage) && (
                    <motion.img
                      src={data.openingScenes?.[0] || data.coverImage}
                      alt="Opening"
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.15 }}
                      transition={{ duration: 8, ease: "linear" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.p
                      className="text-white/90 text-[14px] tracking-[0.2em] uppercase"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {data.openingTexts?.[0] || "We are getting married"}
                    </motion.p>
                    <motion.p
                      className="text-white text-[40px] font-bold mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5, duration: 1 }}
                      style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
                    >
                      {data.openingTexts?.[1] || helpers.formatWeddingDate() || "2025.06.21"}
                    </motion.p>
                    <motion.p
                      className="text-white/80 text-[18px] tracking-[0.1em] mt-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.5, duration: 1 }}
                    >
                      {data.openingTexts?.[2] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 text-[13px] tracking-wider border border-white/30 px-6 py-2 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    onClick={() => { setOpeningDone(true); if (shouldAutoPlay) startMusic(); }}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}

              {data.openingType === "type2" && (
                <div
                  className="relative w-full overflow-hidden bg-white"
                  style={{ minHeight: "100dvh" }}
                >
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FFF5F4 50%, #FFE8E5 100%)" }} />
                  <div className="relative z-10 flex flex-col items-center justify-center px-8" style={{ minHeight: "100dvh" }}>
                    <motion.h1
                      className="text-[#191F28] text-[56px] font-bold leading-[1.1] text-center"
                      initial={{ opacity: 0, y: 80 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    >
                      {data.openingTexts?.[0] || "우리\n결혼합니다"}
                    </motion.h1>
                    <motion.p
                      className="text-[#8B95A1] text-[15px] mt-6 tracking-wide"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.6 }}
                    >
                      {data.openingTexts?.[1] || helpers.formatWeddingDate()}
                    </motion.p>
                    <motion.div
                      className="grid grid-cols-2 gap-2 mt-8 w-full max-w-[280px]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                    >
                      {[data.openingScenes?.[0] || data.coverImage, data.openingScenes?.[1], data.openingScenes?.[2]].filter(Boolean).slice(0, 4).map((img, i) => (
                        <div key={i} className={`${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"} rounded-[12px] overflow-hidden`}>
                          <img src={img!} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </motion.div>
                    <motion.p
                      className="text-[#4E5968] text-[14px] mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                    >
                      {data.openingTexts?.[2] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#4E5968] text-[13px] tracking-wider border border-[#E5E8EB] px-6 py-2 rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8 }}
                    onClick={() => { setOpeningDone(true); if (shouldAutoPlay) startMusic(); }}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}

              {data.openingType === "type3" && (
                <div
                  className="relative w-full overflow-hidden bg-[#F2F4F6]"
                  style={{ minHeight: "100dvh" }}
                >
                  <div className="flex flex-col items-center justify-center px-8" style={{ minHeight: "100dvh" }}>
                    <motion.div
                      className="w-[260px] bg-white rounded-[20px] shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={data.openingScenes?.[0] || data.coverImage || ""}
                          alt="Opening"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 text-center">
                        <p className="text-[#191F28] text-[18px] font-bold">
                          {data.openingTexts?.[0] || `${data.groomName || "신랑"} & ${data.brideName || "신부"}`}
                        </p>
                        <p className="text-[#8B95A1] text-[13px] mt-2">
                          {data.openingTexts?.[1] || helpers.formatWeddingDate()}
                        </p>
                      </div>
                    </motion.div>
                    <motion.p
                      className="text-[#8B95A1] text-[13px] mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {data.openingTexts?.[2] || data.venue || ""}
                    </motion.p>
                  </div>
                  <motion.button
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#4E5968] text-[13px] tracking-wider border border-[#E5E8EB] px-6 py-2 rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    onClick={() => { setOpeningDone(true); if (shouldAutoPlay) startMusic(); }}
                    data-testid="button-skip-opening"
                  >
                    초대장 보기
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {(openingDone || !data.showOpening) && renderLayout()}

        {isShared && (openingDone || !data.showOpening) && (
          <div className="max-w-[420px] mx-auto px-6 py-10">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={handleCopyShareUrl}
                className="flex flex-col items-center gap-2"
                data-testid="button-shared-copy-url"
              >
                <div className="w-14 h-14 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                  {shareCopied
                    ? <span className="text-[14px] font-bold text-[#3182F6]">OK</span>
                    : <Link2 className="w-7 h-7 text-[#4E5968]" />}
                </div>
                <span className="text-[12px] text-[#8B95A1]">{shareCopied ? "복사됨" : "링크 복사"}</span>
              </button>
              <button
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2"
                data-testid="button-shared-more"
              >
                <div className="w-14 h-14 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                  <Share2 className="w-7 h-7 text-[#4E5968]" />
                </div>
                <span className="text-[12px] text-[#8B95A1]">공유하기</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomSheet open={state.showContact} onOpenChange={state.setShowContact} className="bg-[#191F28] max-h-[80vh] overflow-y-auto max-w-[420px] mx-auto" showHandle={false}>
        <div className="flex justify-end p-4">
          <button
            onClick={() => state.setShowContact(false)}
            className="text-white/60"
            data-testid="button-close-contact"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

            <div className="px-8 pb-2">
              <div className="mb-8">
                <h3 className="text-[20px] font-bold text-white mb-2">Contact</h3>
                <div className="w-8 h-[3px] rounded-full bg-[#FF8A80]" />
              </div>
            </div>

            <div className="px-8 pb-8">
              <p className="text-[13px] text-[#8B95A1] mb-4">신랑측</p>
              <div className="space-y-0">
                <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                  <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑</span>
                  <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomName || "신랑"}</span>
                  <div className="flex gap-3">
                    {data.groomPhone && (
                      <a href={`tel:${data.groomPhone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>
                    )}
                    {data.groomPhone && (
                      <button onClick={() => helpers.copyToClipboard(data.groomPhone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>
                    )}
                  </div>
                </div>
                {data.groomFather?.name && (
                  <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑 아버지</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomFather.name}</span>
                    <div className="flex gap-3">
                      {data.groomFather.phone && <a href={`tel:${data.groomFather.phone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>}
                      {data.groomFather.phone && <button onClick={() => helpers.copyToClipboard(data.groomFather!.phone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>}
                    </div>
                  </div>
                )}
                {data.groomMother?.name && (
                  <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신랑 어머니</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.groomMother.name}</span>
                    <div className="flex gap-3">
                      {data.groomMother.phone && <a href={`tel:${data.groomMother.phone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>}
                      {data.groomMother.phone && <button onClick={() => helpers.copyToClipboard(data.groomMother!.phone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-[13px] text-[#8B95A1] mt-6 mb-4">신부측</p>
              <div className="space-y-0">
                <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                  <span className="text-[13px] text-[#8B95A1] w-[80px]">신부</span>
                  <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideName || "신부"}</span>
                  <div className="flex gap-3">
                    {data.bridePhone && <a href={`tel:${data.bridePhone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>}
                    {data.bridePhone && <button onClick={() => helpers.copyToClipboard(data.bridePhone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>}
                  </div>
                </div>
                {data.brideFather?.name && (
                  <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신부 아버지</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideFather.name}</span>
                    <div className="flex gap-3">
                      {data.brideFather.phone && <a href={`tel:${data.brideFather.phone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>}
                      {data.brideFather.phone && <button onClick={() => helpers.copyToClipboard(data.brideFather!.phone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>}
                    </div>
                  </div>
                )}
                {data.brideMother?.name && (
                  <div className="flex items-center justify-between gap-2 py-3.5 border-b border-[#333D4B]">
                    <span className="text-[13px] text-[#8B95A1] w-[80px]">신부 어머니</span>
                    <span className="text-[15px] text-[#e8e2d8] font-medium flex-1">{data.brideMother.name}</span>
                    <div className="flex gap-3">
                      {data.brideMother.phone && <a href={`tel:${data.brideMother.phone}`} className="text-[#8B95A1]"><Phone className="w-5 h-5" /></a>}
                      {data.brideMother.phone && <button onClick={() => helpers.copyToClipboard(data.brideMother!.phone!, "전화번호가")} className="text-[#8B95A1]"><Copy className="w-5 h-5" /></button>}
                    </div>
                  </div>
                )}
              </div>
            </div>
      </BottomSheet>

      {state.showPhotoViewer && state.galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div />
            <p className="text-white/80 text-[14px]">{state.viewerIndex + 1}/{state.galleryImages.length}</p>
            <button
              onClick={() => state.setShowPhotoViewer(false)}
              className="text-white/80"
              data-testid="button-close-viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={state.galleryImages[state.viewerIndex]}
              alt={`Photo ${state.viewerIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {state.viewerIndex > 0 && (
              <button
                onClick={() => state.setViewerIndex(state.viewerIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/70"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {state.viewerIndex < state.galleryImages.length - 1 && (
              <button
                onClick={() => state.setViewerIndex(state.viewerIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/70"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}

      {state.copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#191F28] text-white px-6 py-3 rounded-lg text-[14px] shadow-lg">
          {state.copiedToast}
        </div>
      )}

      {showRsvpModal && (
        <RsvpModal onClose={() => setShowRsvpModal(false)} />
      )}
    </div>
  )
}

function RsvpModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    attendance: "confirmed" as "confirmed" | "declined",
    mealType: "adult" as "adult" | "child" | "none",
    side: "groom" as "groom" | "bride",
    guestCount: 1,
    phone: "",
    memo: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("성함을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          side: formData.side,
          attendance: formData.attendance,
          mealType: formData.mealType,
          guestCount: formData.guestCount,
          phone: formData.phone.trim() || null,
          memo: formData.memo.trim() || null,
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("RSVP submission failed:", error)
      alert("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-[90%] max-w-[380px] max-h-[85vh] overflow-y-auto bg-white rounded-[24px] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-rsvp"
      >
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#191F28] mb-2">참석 의사가 전달되었어요</h3>
            <p className="text-[14px] text-[#8B95A1] leading-relaxed mb-6">
              소중한 시간 내어주셔서 감사합니다.
              <br />
              {formData.attendance === "confirmed" ? "예식일에 뵙겠습니다." : "마음은 잘 전달되었습니다."}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-[#191F28] text-white font-semibold rounded-[14px] text-[15px]"
              data-testid="button-rsvp-close"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#191F28]" data-testid="text-rsvp-modal-title">참석의사 전달하기</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F4F6]"
                data-testid="button-rsvp-modal-close"
              >
                <X className="w-4 h-4 text-[#4E5968]" />
              </button>
            </div>

            <p className="text-[13px] text-[#8B95A1] mb-5">
              축하하는 마음을 미리 전해주세요. 원활한 예식 진행에 큰 도움이 됩니다.
            </p>

            <div className="space-y-4">
              <div className="flex bg-[#F2F4F6] rounded-[12px] p-1">
                <button
                  onClick={() => setFormData({...formData, side: "groom"})}
                  className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-medium transition-all ${
                    formData.side === "groom" ? "bg-white text-blue-500 shadow-sm" : "text-[#8B95A1]"
                  }`}
                  data-testid="rsvp-modal-side-groom"
                >
                  신랑측 손님
                </button>
                <button
                  onClick={() => setFormData({...formData, side: "bride"})}
                  className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-medium transition-all ${
                    formData.side === "bride" ? "bg-white text-pink-500 shadow-sm" : "text-[#8B95A1]"
                  }`}
                  data-testid="rsvp-modal-side-bride"
                >
                  신부측 손님
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFormData({...formData, attendance: "confirmed"})}
                  className={`flex-1 py-3 rounded-[12px] border transition-all font-medium text-[14px] ${
                    formData.attendance === "confirmed"
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-[#E5E8EB] bg-white text-[#4E5968]"
                  }`}
                  data-testid="rsvp-modal-attend-yes"
                >
                  참석할게요
                </button>
                <button
                  onClick={() => setFormData({...formData, attendance: "declined"})}
                  className={`flex-1 py-3 rounded-[12px] border transition-all font-medium text-[14px] ${
                    formData.attendance === "declined"
                      ? "border-[#FF6B6B] bg-red-50 text-[#FF6B6B]"
                      : "border-[#E5E8EB] bg-white text-[#4E5968]"
                  }`}
                  data-testid="rsvp-modal-attend-no"
                >
                  마음만 보낼게요
                </button>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">성함</label>
                <input
                  type="text"
                  placeholder="성함을 입력해주세요"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c]"
                  data-testid="input-rsvp-modal-name"
                />
              </div>

              {formData.attendance === "confirmed" && (
                <>
                  <div>
                    <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">참석 인원</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFormData({...formData, guestCount: Math.max(1, formData.guestCount - 1)})}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F4F6] text-[#4E5968] text-[18px] font-medium"
                        data-testid="button-rsvp-count-minus"
                      >
                        -
                      </button>
                      <span className="text-[18px] font-bold text-[#191F28] w-8 text-center" data-testid="text-rsvp-guest-count">
                        {formData.guestCount}
                      </span>
                      <button
                        onClick={() => setFormData({...formData, guestCount: Math.min(10, formData.guestCount + 1)})}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F4F6] text-[#4E5968] text-[18px] font-medium"
                        data-testid="button-rsvp-count-plus"
                      >
                        +
                      </button>
                      <span className="text-[13px] text-[#8B95A1] ml-1">명</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">식사 여부</label>
                    <div className="flex gap-2">
                      {([
                        { value: "adult", label: "식사 (어른)" },
                        { value: "child", label: "식사 (아동)" },
                        { value: "none", label: "식사 안함" },
                      ] as const).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setFormData({...formData, mealType: opt.value})}
                          className={`flex-1 py-2.5 rounded-[10px] border text-[13px] font-medium transition-all ${
                            formData.mealType === opt.value
                              ? "border-[#c9a86c] bg-[#faf5eb] text-[#8b7355]"
                              : "border-[#E5E8EB] bg-white text-[#8B95A1]"
                          }`}
                          data-testid={`rsvp-modal-meal-${opt.value}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">연락처 (선택)</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c]"
                  data-testid="input-rsvp-modal-phone"
                />
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">축하 메시지 (선택)</label>
                <textarea
                  placeholder="신랑신부에게 전할 축하 메시지를 남겨주세요"
                  rows={2}
                  value={formData.memo}
                  onChange={(e) => setFormData({...formData, memo: e.target.value})}
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c] resize-none"
                  data-testid="input-rsvp-modal-memo"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#191F28] text-white font-bold rounded-[14px] text-[15px] mt-1 disabled:opacity-50"
                data-testid="button-rsvp-modal-submit"
              >
                {isSubmitting ? "전송 중..." : "참석 의사 전달하기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
