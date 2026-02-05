"use client"

import React from "react"

import { useState, useRef } from "react"
import { InvitationPreview } from "@/components/invitation-preview"
import { X, Share2, Link2, Check, MessageCircle, Plus, Trash2, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"

interface AccountInfo {
  bank: string
  account: string
  holder: string
}

interface TimelineItem {
  date: string
  title: string
  description: string
  image: string
}

export interface InvitationData {
  // Cover
  coverImage: string
  // Couple Info (부모님 이름 제거)
  groomName: string
  brideName: string
  // Date & Time
  weddingDate: string
  ampm: "오전" | "오후"
  hour: string
  minute: string
  // Venue
  venue: string
  venueHall: string
  address: string
  // Transportation - AI generated
  transportInfo: string
  // Message
  message: string
  // Gallery
  galleryImages: string[]
  // Timeline
  timeline: TimelineItem[]
  // Account - 신랑측/신부측 각각 본인 + 부모님
  showAccount: boolean
  groomAccounts: AccountInfo[]
  brideAccounts: AccountInfo[]
}

const initialData: InvitationData = {
  coverImage: "",
  groomName: "",
  brideName: "",
  weddingDate: "",
  ampm: "오후",
  hour: "2",
  minute: "00",
  venue: "",
  venueHall: "",
  address: "",
  transportInfo: "",
  message: "",
  galleryImages: [],
  timeline: [],
  showAccount: true,
  groomAccounts: [{ bank: "", account: "", holder: "" }],
  brideAccounts: [{ bank: "", account: "", holder: "" }],
}

const TOTAL_STEPS = 6

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
const minutes = ["00", "10", "20", "30", "40", "50"]

export default function InvitationEditorPage() {
  const [data, setData] = useState<InvitationData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isGeneratingTransport, setIsGeneratingTransport] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const updateField = <K extends keyof InvitationData>(field: K, value: InvitationData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.groomName.trim() !== "" && data.brideName.trim() !== ""
      case 2:
        return data.weddingDate.trim() !== "" && data.venue.trim() !== ""
      case 3:
        return true // Gallery is optional
      case 4:
        return true // Timeline is optional
      case 5:
        return data.address.trim() !== ""
      case 6:
        return true // Account is optional
      default:
        return true
    }
  }

  const goNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setShowPreview(true)
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/invitation/preview` : ""

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const generateAIMessage = () => {
    const templates = [
      "서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어가고자 합니다.\n\n저희 두 사람이 사랑의 이름으로\n지금부터 함께 하고자 합니다.\n\n오셔서 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.",
      "평생을 함께하고 싶은 사람을 만났습니다.\n\n함께 걸어온 날보다\n함께 걸어갈 날이 더 많기에\n설레는 마음으로 첫 발을 내딛습니다.\n\n저희의 새 출발을 축복해 주세요.",
      "사랑으로 만나 믿음으로 맺어진\n저희 두 사람이 이제 한 가정을 이루려 합니다.\n\n귀한 걸음 하시어\n저희의 앞날을 축복해 주시면\n큰 기쁨이 되겠습니다.",
    ]
    updateField("message", templates[Math.floor(Math.random() * templates.length)])
  }

  const generateTransportInfo = async () => {
    if (!data.address || !data.venue) {
      alert("주소와 예식장 이름을 먼저 입력해주세요.")
      return
    }
    
    setIsGeneratingTransport(true)
    
    // Simulate AI generation (in real app, call AI API)
    setTimeout(() => {
      const generatedInfo = `[지하철]\n2호선 삼성역 5번 출구 도보 10분\n9호선 봉은사역 1번 출구 도보 5분\n\n[버스]\n간선: 146, 341, 360, 740\n지선: 3412, 4318\n\n[주차]\n${data.venue} 지하주차장 이용 가능\n3시간 무료 주차 지원`
      updateField("transportInfo", generatedInfo)
      setIsGeneratingTransport(false)
    }, 1500)
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateField("coverImage", url)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      const totalImages = [...data.galleryImages, ...newImages].slice(0, 9)
      updateField("galleryImages", totalImages)
    }
  }

  const removeGalleryImage = (index: number) => {
    const newImages = data.galleryImages.filter((_, i) => i !== index)
    updateField("galleryImages", newImages)
  }

  const addGroomAccount = () => {
    if (data.groomAccounts.length < 3) {
      updateField("groomAccounts", [...data.groomAccounts, { bank: "", account: "", holder: "" }])
    }
  }

  const addBrideAccount = () => {
    if (data.brideAccounts.length < 3) {
      updateField("brideAccounts", [...data.brideAccounts, { bank: "", account: "", holder: "" }])
    }
  }

  const updateGroomAccount = (index: number, field: keyof AccountInfo, value: string) => {
    const newAccounts = [...data.groomAccounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    updateField("groomAccounts", newAccounts)
  }

  const updateBrideAccount = (index: number, field: keyof AccountInfo, value: string) => {
    const newAccounts = [...data.brideAccounts]
    newAccounts[index] = { ...newAccounts[index], [field]: value }
    updateField("brideAccounts", newAccounts)
  }

  const removeGroomAccount = (index: number) => {
    if (data.groomAccounts.length > 1) {
      updateField("groomAccounts", data.groomAccounts.filter((_, i) => i !== index))
    }
  }

  const removeBrideAccount = (index: number) => {
    if (data.brideAccounts.length > 1) {
      updateField("brideAccounts", data.brideAccounts.filter((_, i) => i !== index))
    }
  }

  const timelineInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const addTimelineItem = () => {
    updateField("timeline", [...data.timeline, { date: "", title: "", description: "", image: "" }])
  }

  const updateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
    const newTimeline = [...data.timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    updateField("timeline", newTimeline)
  }

  const removeTimelineItem = (index: number) => {
    updateField("timeline", data.timeline.filter((_, i) => i !== index))
  }

  const handleTimelineImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateTimelineItem(index, "image", url)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
                누가 결혼하나요?
              </h2>
              <p className="text-[14px] text-[#8B95A1]">신랑과 신부의 이름을 입력해주세요</p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">신랑</label>
                <input
                  type="text"
                  value={data.groomName}
                  onChange={(e) => updateField("groomName", e.target.value)}
                  placeholder="신랑 이름"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">신부</label>
                <input
                  type="text"
                  value={data.brideName}
                  onChange={(e) => updateField("brideName", e.target.value)}
                  placeholder="신부 이름"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] transition-all"
                />
              </div>
            </div>

            {/* Invitation Message with AI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#4E5968]">인사말</label>
                <button
                  onClick={generateAIMessage}
                  className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-[12px] font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  AI 추천
                </button>
              </div>
              <textarea
                value={data.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="인사말을 입력하거나 AI 추천을 받아보세요"
                rows={4}
                className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[14px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] resize-none leading-relaxed"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
                언제, 어디서 하나요?
              </h2>
              <p className="text-[14px] text-[#8B95A1]">예식 일시와 장소를 입력해주세요</p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">예식 날짜</label>
              <input
                type="date"
                value={data.weddingDate}
                onChange={(e) => updateField("weddingDate", e.target.value)}
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
              />
            </div>

            {/* Time with AM/PM Select */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">예식 시간</label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={data.ampm}
                    onChange={(e) => updateField("ampm", e.target.value as "오전" | "오후")}
                    className="appearance-none w-24 px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] pr-10"
                  >
                    <option value="오전">오전</option>
                    <option value="오후">오후</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A1] pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <select
                    value={data.hour}
                    onChange={(e) => updateField("hour", e.target.value)}
                    className="appearance-none w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] pr-10"
                  >
                    {hours.map(h => (
                      <option key={h} value={h}>{h}시</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A1] pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <select
                    value={data.minute}
                    onChange={(e) => updateField("minute", e.target.value)}
                    className="appearance-none w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] pr-10"
                  >
                    {minutes.map(m => (
                      <option key={m} value={m}>{m}분</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A1] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-3">
              <input
                type="text"
                value={data.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                placeholder="예식장 이름"
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
              />
              <input
                type="text"
                value={data.venueHall}
                onChange={(e) => updateField("venueHall", e.target.value)}
                placeholder="홀 정보 (예: 그랜드볼룸 5층)"
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
                사진을 추가해주세요
              </h2>
              <p className="text-[14px] text-[#8B95A1]">커버 사진과 갤러리 사진을 업로드하세요</p>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">커버 사진</label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
              {data.coverImage ? (
                <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden">
                  <img src={data.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => updateField("coverImage", "")}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full aspect-[4/3] bg-[#F2F4F6] rounded-[14px] border-2 border-dashed border-[#D1D6DB] flex flex-col items-center justify-center gap-2 hover:border-[#FF8A80] hover:bg-[#FFF5F5] transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Plus className="w-6 h-6 text-[#8B95A1]" />
                  </div>
                  <span className="text-[13px] text-[#8B95A1]">커버 사진 추가</span>
                </button>
              )}
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">
                갤러리 ({data.galleryImages.length}/9)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <div className="grid grid-cols-3 gap-2">
                {data.galleryImages.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <img 
                      src={img || "/placeholder.svg"} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                    <button 
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                
                {data.galleryImages.length < 9 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-[#F2F4F6] rounded-[10px] flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#D1D6DB] hover:border-[#FF8A80] hover:bg-[#FFF5F5] transition-all"
                  >
                    <Plus className="w-5 h-5 text-[#8B95A1]" />
                    <span className="text-[10px] text-[#8B95A1]">추가</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )

case 4:
  return (
  <div className="space-y-5">
  <div>
  <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
  우리의 이야기
  </h2>
  <p className="text-[14px] text-[#8B95A1]">함께한 소중한 순간들을 기록해주세요</p>
  </div>
  
  <div className="space-y-4">
  {data.timeline.map((item, index) => (
  <div key={index} className="bg-[#F8F9FA] rounded-[16px] p-4">
  <div className="flex items-start gap-3">
  {/* Image Upload */}
  <input
    ref={el => { timelineInputRefs.current[index] = el }}
    type="file"
    accept="image/*"
    onChange={(e) => handleTimelineImageUpload(index, e)}
    className="hidden"
  />
  {item.image ? (
    <div className="relative w-20 h-20 flex-shrink-0">
    <img src={item.image || "/placeholder.svg"} alt="Timeline" className="w-full h-full object-cover rounded-[10px]" />
    <button 
      onClick={() => updateTimelineItem(index, "image", "")}
      className="absolute -top-1 -right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
    >
      <X className="w-3 h-3 text-white" />
    </button>
    </div>
  ) : (
    <button
    onClick={() => timelineInputRefs.current[index]?.click()}
    className="w-20 h-20 flex-shrink-0 bg-white rounded-[10px] border-2 border-dashed border-[#D1D6DB] flex items-center justify-center hover:border-[#FF8A80] transition-colors"
    >
    <Plus className="w-5 h-5 text-[#B0B8C1]" />
    </button>
  )}
  
  {/* Content */}
  <div className="flex-1 space-y-2">
    <input
    type="text"
    value={item.date}
    onChange={(e) => updateTimelineItem(index, "date", e.target.value)}
    placeholder="20 / 08 / 26"
    className="w-full px-3 py-2 bg-white rounded-[8px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
    />
    <input
    type="text"
    value={item.title}
    onChange={(e) => updateTimelineItem(index, "title", e.target.value)}
    placeholder="제목 (예: 우리의 시작)"
    className="w-full px-3 py-2 bg-white rounded-[8px] text-[13px] font-medium text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
    />
    <input
    type="text"
    value={item.description}
    onChange={(e) => updateTimelineItem(index, "description", e.target.value)}
    placeholder="간략한 설명"
    className="w-full px-3 py-2 bg-white rounded-[8px] text-[12px] text-[#4E5968] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
    />
  </div>
  
  {/* Delete Button */}
  <button
    onClick={() => removeTimelineItem(index)}
    className="w-8 h-8 flex items-center justify-center text-[#B0B8C1] hover:text-[#FF6B6B] transition-colors"
  >
    <Trash2 className="w-4 h-4" />
  </button>
  </div>
  </div>
  ))}
  </div>
  
  <button
  onClick={addTimelineItem}
  className="w-full py-3 rounded-[12px] border-2 border-dashed border-[#D1D6DB] text-[14px] text-[#8B95A1] font-medium hover:border-[#FF8A80] hover:text-[#FF8A80] transition-all"
  >
  + 추억 추가
  </button>
  </div>
  )

      case 5:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
                오시는 길을 안내해주세요
              </h2>
              <p className="text-[14px] text-[#8B95A1]">하객분들을 위한 교통 정보를 입력하세요</p>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">예식장 주소</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="예식장 주소를 입력하세요"
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
              />
            </div>

            {/* Map Placeholder */}
            <div className="h-32 bg-[#E5E8EB] rounded-[14px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <svg className="w-5 h-5 text-[#FF8A80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-[12px] text-[#8B95A1]">지도 미리보기</p>
              </div>
            </div>

            {/* Transportation Info - AI Generated */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-medium text-[#4E5968]">교통 안내</label>
                <button
                  onClick={generateTransportInfo}
                  disabled={isGeneratingTransport}
                  className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-[12px] font-medium disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {isGeneratingTransport ? "생성 중..." : "AI 추천"}
                </button>
              </div>
              <textarea
                value={data.transportInfo}
                onChange={(e) => updateField("transportInfo", e.target.value)}
                placeholder="교통 정보를 입력하거나 AI 추천을 받아보세요"
                rows={5}
                className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[14px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] resize-none leading-relaxed"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-[22px] font-bold text-[#191F28] leading-tight mb-1">
                축의금 계좌 안내
              </h2>
              <p className="text-[14px] text-[#8B95A1]">계좌 정보를 입력해주세요</p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F2F4F6] rounded-[14px]">
              <span className="text-[14px] font-medium text-[#191F28]">계좌 정보 표시</span>
              <button
                onClick={() => updateField("showAccount", !data.showAccount)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  data.showAccount ? "bg-[#FF8A80]" : "bg-[#D1D6DB]"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  data.showAccount ? "left-5" : "left-0.5"
                }`} />
              </button>
            </div>

            {data.showAccount && (
              <div className="space-y-4">
                {/* Groom Side */}
                <div className="bg-[#F8F9FA] rounded-[14px] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-bold text-[#3182F6]">신랑측 계좌</p>
                    {data.groomAccounts.length < 3 && (
                      <button
                        onClick={addGroomAccount}
                        className="text-[12px] text-[#3182F6] font-medium"
                      >
                        + 계좌 추가
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {data.groomAccounts.map((acc, index) => (
                      <div key={index} className="space-y-2">
                        {index > 0 && <div className="h-px bg-[#E5E8EB] my-2" />}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={acc.bank}
                            onChange={(e) => updateGroomAccount(index, "bank", e.target.value)}
                            placeholder="은행"
                            className="w-20 px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                          />
                          <input
                            type="text"
                            value={acc.account}
                            onChange={(e) => updateGroomAccount(index, "account", e.target.value)}
                            placeholder="계좌번호"
                            className="flex-1 px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => removeGroomAccount(index)}
                              className="w-9 h-9 flex items-center justify-center text-[#B0B8C1] hover:text-[#FF6B6B]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={acc.holder}
                          onChange={(e) => updateGroomAccount(index, "holder", e.target.value)}
                          placeholder={index === 0 ? "예금주 (신랑 본인)" : "예금주 (부모님)"}
                          className="w-full px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bride Side */}
                <div className="bg-[#FFF5F5] rounded-[14px] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-bold text-pink-500">신부측 계좌</p>
                    {data.brideAccounts.length < 3 && (
                      <button
                        onClick={addBrideAccount}
                        className="text-[12px] text-pink-500 font-medium"
                      >
                        + 계좌 추가
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {data.brideAccounts.map((acc, index) => (
                      <div key={index} className="space-y-2">
                        {index > 0 && <div className="h-px bg-pink-100 my-2" />}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={acc.bank}
                            onChange={(e) => updateBrideAccount(index, "bank", e.target.value)}
                            placeholder="은행"
                            className="w-20 px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-400"
                          />
                          <input
                            type="text"
                            value={acc.account}
                            onChange={(e) => updateBrideAccount(index, "account", e.target.value)}
                            placeholder="계좌번호"
                            className="flex-1 px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-400"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => removeBrideAccount(index)}
                              className="w-9 h-9 flex items-center justify-center text-[#B0B8C1] hover:text-[#FF6B6B]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={acc.holder}
                          onChange={(e) => updateBrideAccount(index, "holder", e.target.value)}
                          placeholder={index === 0 ? "예금주 (신부 본인)" : "예금주 (부모님)"}
                          className="w-full px-3 py-2.5 bg-white rounded-[10px] text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Format time for preview
  const getFormattedTime = () => {
    return `${data.ampm} ${data.hour}시 ${data.minute !== "00" ? data.minute + "분" : ""}`
  }

  // Format date for preview
  const getFormattedDate = () => {
    if (!data.weddingDate) return ""
    const date = new Date(data.weddingDate)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
  }

  // Create preview data with formatted values
  const previewData = {
    ...data,
    date: getFormattedDate(),
    time: getFormattedTime(),
  }

  return (
    <main className="h-dvh flex flex-col bg-[#F2F4F6] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-2 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between">
          <Link
            href="/wedding"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
          >
            <X className="w-5 h-5 text-[#191F28]" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#8B95A1]">{currentStep}/{TOTAL_STEPS}</span>
            <div className="w-16 h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FF8A80] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button 
            onClick={() => setShowPreview(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF8A80] hover:bg-[#FF6B6B] transition-colors"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top 50% - Live Preview */}
        <div className="h-1/2 overflow-y-auto bg-[#faf9f7] border-b border-[#E5E8EB]">
          <div className="transform scale-[0.55] origin-top">
            <InvitationPreview data={previewData as any} />
          </div>
        </div>

        {/* Bottom 50% - Editor */}
        <div className="h-1/2 flex flex-col bg-white">
          {/* Editor Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {renderStepContent()}
          </div>

          {/* Footer - Next Button */}
          <div className="flex-shrink-0 px-5 pb-6 pt-3 bg-white border-t border-[#F2F4F6]">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={goPrev}
                  className="px-5 py-3.5 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] font-semibold text-[15px] transition-colors hover:bg-[#E5E8EB]"
                >
                  이전
                </button>
              )}
              
              {currentStep === TOTAL_STEPS ? (
                <button
                  onClick={handleComplete}
                  className={`flex-1 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all ${
                    isStepValid()
                      ? "bg-[#FF8A80] text-white hover:bg-[#FF6B6B]"
                      : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                  }`}
                  disabled={!isStepValid()}
                >
                  완료
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className={`flex-1 py-3.5 rounded-[14px] font-semibold text-[15px] transition-all ${
                    isStepValid()
                      ? "bg-[#FF8A80] text-white hover:bg-[#FF6B6B]"
                      : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                  }`}
                  disabled={!isStepValid()}
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md">
              <button
                onClick={() => {
                  setShowPreview(false)
                  setShowShareOptions(false)
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              >
                <X className="w-5 h-5 text-[#191F28]" />
              </button>
              <h2 className="text-[17px] font-bold text-[#191F28]">청첩장 미리보기</h2>
              <button
                onClick={() => setShowShareOptions(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8A80] hover:bg-[#FF6B6B] transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Premium Theme Banner */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center"
            >
              <p className="text-[14px] font-medium">프리미엄 테마를 구경해보세요</p>
              <p className="text-[12px] opacity-80">더 아름다운 청첩장 디자인 10종 추가</p>
            </button>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto bg-[#faf9f7]">
              <InvitationPreview data={previewData as any} />
            </div>
          </div>

          {/* Share Options Sheet */}
          {showShareOptions && (
            <div 
              className="fixed inset-0 z-60 flex items-end justify-center"
              onClick={() => setShowShareOptions(false)}
            >
              <div 
                className="w-full max-w-md bg-white rounded-t-[24px] p-6 pb-10 animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1 bg-[#E5E8EB] rounded-full mx-auto mb-6" />
                
                <h3 className="text-[18px] font-bold text-[#191F28] text-center mb-6">
                  청첩장 공유하기
                </h3>

                <div className="space-y-3">
                  {/* Kakao Share */}
                  <button
                    className="w-full flex items-center gap-4 px-4 py-4 bg-[#FEE500] rounded-[16px] hover:bg-[#F5DC00] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#3C1E1E] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#FEE500]" />
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-semibold text-[#3C1E1E]">카카오톡으로 공유</p>
                      <p className="text-[13px] text-[#3C1E1E]/70">친구에게 청첩장을 보내세요</p>
                    </div>
                  </button>

                  {/* URL Copy */}
                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center gap-4 px-4 py-4 bg-[#F2F4F6] rounded-[16px] hover:bg-[#E5E8EB] transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#3182F6] flex items-center justify-center">
                      {copied ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Link2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-semibold text-[#191F28]">
                        {copied ? "복사 완료!" : "URL 복사하기"}
                      </p>
                      <p className="text-[13px] text-[#8B95A1] truncate max-w-[220px]">{shareUrl}</p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setShowShareOptions(false)}
                  className="w-full mt-4 py-3.5 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] font-semibold text-[15px] hover:bg-[#E5E8EB] transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Premium Theme Modal */}
      {showPremiumModal && (
        <div 
          className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setShowPremiumModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-[24px] p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[20px] font-bold text-[#191F28] mb-2">프리미엄 테마</h3>
              <p className="text-[14px] text-[#8B95A1]">
                더 아름다운 청첩장을 만들어보세요
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-[#F2F4F6] rounded-[12px] flex items-center justify-center">
                  <span className="text-[12px] text-[#B0B8C1]">테마 {i}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-4 rounded-[14px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-[16px]">
              9,900원 결제하기
            </button>
            
            <button
              onClick={() => setShowPremiumModal(false)}
              className="w-full mt-3 py-3 text-[14px] text-[#8B95A1]"
            >
              다음에 할게요
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
