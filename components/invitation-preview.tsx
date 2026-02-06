"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { InvitationData } from "@/app/wedding/editor/page"
import { Phone, Copy, ChevronLeft, ChevronRight, X } from "lucide-react"
import { usePreviewState } from "./invitation-layouts/use-preview-state"
import { CinematicLayout } from "./invitation-layouts/CinematicLayout"
import { ModernLayout } from "./invitation-layouts/ModernLayout"
import { ClassicLayout } from "./invitation-layouts/ClassicLayout"
import { MagazineLayout } from "./invitation-layouts/MagazineLayout"
import { PolaroidLayout } from "./invitation-layouts/PolaroidLayout"
import { ChatLayout } from "./invitation-layouts/ChatLayout"
import { TraditionalLayout } from "./invitation-layouts/TraditionalLayout"
import { GardenLayout } from "./invitation-layouts/GardenLayout"
import { GalleryLayout } from "./invitation-layouts/GalleryLayout"

interface InvitationPreviewProps {
  data: InvitationData & { date?: string; time?: string }
}

function getLayoutPageBg(template: string): string {
  switch (template) {
    case "cinematic": return "#1E1B16"
    case "classic": return "#F5F5F0"
    case "magazine": return "#FFFFFF"
    case "polaroid": return "#F0F0F0"
    case "chat": return "#FFF0F3"
    case "traditional": return "#1e2a3a"
    case "garden": return "#FFFFFF"
    case "gallery": return "#F5F5F5"
    case "modern":
    default: return "#FFFFFF"
  }
}

export function InvitationPreview({ data }: InvitationPreviewProps) {
  const { state, helpers } = usePreviewState(data)
  const [openingDone, setOpeningDone] = useState(!data.showOpening)

  useEffect(() => {
    if (!data.showOpening || openingDone) return
    const autoAdvance = setTimeout(() => setOpeningDone(true), 6000)
    return () => clearTimeout(autoAdvance)
  }, [data.showOpening, openingDone])

  const pageBg = getLayoutPageBg(data.mainTemplate || "modern")

  const renderLayout = () => {
    const props = { data, state, helpers }
    switch (data.mainTemplate) {
      case "cinematic": return <CinematicLayout {...props} />
      case "classic": return <ClassicLayout {...props} />
      case "magazine": return <MagazineLayout {...props} />
      case "polaroid": return <PolaroidLayout {...props} />
      case "chat": return <ChatLayout {...props} />
      case "traditional": return <TraditionalLayout {...props} />
      case "garden": return <GardenLayout {...props} />
      case "gallery": return <GalleryLayout {...props} />
      case "modern":
      default: return <ModernLayout {...props} />
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: pageBg }} data-testid="invitation-preview">
      <div className="max-w-[420px] mx-auto">

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
                    onClick={() => setOpeningDone(true)}
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
                    onClick={() => setOpeningDone(true)}
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
                    onClick={() => setOpeningDone(true)}
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
      </div>

      {state.showContact && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => state.setShowContact(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-[420px] bg-[#191F28] rounded-t-2xl overflow-y-auto"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
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
          </div>
        </div>
      )}

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
    </div>
  )
}
