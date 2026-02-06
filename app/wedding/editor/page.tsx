"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { InvitationPreview } from "@/components/invitation-preview"
import { X, Share2, Link2, Check, MessageCircle, Plus, Trash2, Sparkles, ChevronLeft, Info, Play, Pause } from "lucide-react"
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

interface TransportItem {
  type: string
  detail: string
}

interface ParentInfo {
  name: string
  phone: string
  deceased: boolean
}

export interface InvitationData {
  title: string
  showOpening: boolean
  openingType: string
  openingScenes: string[]
  openingTexts: string[]
  mainTemplate: string
  mainPhotos: string[]
  textColor: "dark" | "light"
  groomName: string
  groomRelation: string
  groomPhone: string
  groomFather: ParentInfo
  groomMother: ParentInfo
  brideName: string
  brideRelation: string
  bridePhone: string
  brideFather: ParentInfo
  brideMother: ParentInfo
  brideFirst: boolean
  deceasedFlower: boolean
  invitationTitle: string
  message: string
  showNameAtBottom: boolean
  weddingDate: string
  weddingMonth: string
  weddingDay: string
  ampm: "오전" | "오후"
  hour: string
  minute: string
  venue: string
  venueHall: string
  address: string
  venuePhone: string
  showCalendar: boolean
  showCountdown: boolean
  showTransport: boolean
  transportItems: TransportItem[]
  showTransportNotice: boolean
  showFunding: boolean
  fundingMessage: string
  fundingImageType: "default" | "custom"
  fundingImage: string
  fundingButtonName: string
  fundingThanks: string
  showGiftFunding: boolean
  giftFundingMessage: string
  giftFundingButtonName: string
  showAccount: boolean
  groomFatherAccount: AccountInfo
  groomMotherAccount: AccountInfo
  brideFatherAccount: AccountInfo
  brideMotherAccount: AccountInfo
  showGallery: boolean
  galleryImages: string[]
  galleryStyle: "swipe" | "grid"
  showMidPhoto: boolean
  midPhoto: string
  showMusic: boolean
  musicTrack: string
  showBaptismalName: boolean
  baptismalGroom: string
  baptismalGroomFather: string
  baptismalGroomMother: string
  baptismalBride: string
  baptismalBrideFather: string
  baptismalBrideMother: string
  showRsvp: boolean
  rsvpTitle: string
  rsvpContent: string
  rsvpButtonName: string
  rsvpMeal: boolean
  rsvpBus: boolean
  rsvpGift: boolean
  rsvpPopup: boolean
  showGuestbook: boolean
  showGuestSnap: boolean
  guestSnapContent: string
  guestSnapPhotos: string[]
  showNotice: boolean
  noticeTitle: string
  noticeItems: string[]
  showEndingMessage: boolean
  endingPhoto: string
  endingContent: string
  showShareImage: boolean
  shareTitle: string
  shareContent: string
  sharePhoto: string
  invitationSlug: string
  coverImage: string
  timeline: TimelineItem[]
  transportInfo: string
  groomAccounts: AccountInfo[]
  brideAccounts: AccountInfo[]
  coverDisplayStyle: "slide" | "fade" | "static"
  messageAlign: "center" | "left"
  calendarStyle: "full" | "simple"
  accountDisplayStyle: "expand" | "accordion"
  endingStyle: "card" | "full" | "simple"
  nameDisplayStyle: "horizontal" | "vertical"
}

const initialData: InvitationData = {
  title: "우리의 날",
  showOpening: true,
  openingType: "type1",
  openingScenes: [],
  openingTexts: ["", "", ""],
  mainTemplate: "poster",
  mainPhotos: [],
  textColor: "dark",
  groomName: "",
  groomRelation: "아들",
  groomPhone: "",
  groomFather: { name: "", phone: "", deceased: false },
  groomMother: { name: "", phone: "", deceased: false },
  brideName: "",
  brideRelation: "딸",
  bridePhone: "",
  brideFather: { name: "", phone: "", deceased: false },
  brideMother: { name: "", phone: "", deceased: false },
  brideFirst: false,
  deceasedFlower: false,
  invitationTitle: "새로운 시작에 함께해주세요",
  message: "",
  showNameAtBottom: true,
  weddingDate: "",
  weddingMonth: "",
  weddingDay: "",
  ampm: "오후",
  hour: "2",
  minute: "00",
  venue: "",
  venueHall: "",
  address: "",
  venuePhone: "",
  showCalendar: false,
  showCountdown: false,
  showTransport: true,
  transportItems: [{ type: "", detail: "" }],
  showTransportNotice: false,
  showFunding: false,
  fundingMessage: "",
  fundingImageType: "default",
  fundingImage: "",
  fundingButtonName: "신혼여행 축하하기",
  fundingThanks: "",
  showGiftFunding: false,
  giftFundingMessage: "",
  giftFundingButtonName: "선물전하기",
  showAccount: true,
  groomFatherAccount: { bank: "", account: "", holder: "" },
  groomMotherAccount: { bank: "", account: "", holder: "" },
  brideFatherAccount: { bank: "", account: "", holder: "" },
  brideMotherAccount: { bank: "", account: "", holder: "" },
  showGallery: true,
  galleryImages: [],
  galleryStyle: "swipe",
  showMidPhoto: false,
  midPhoto: "",
  showMusic: false,
  musicTrack: "",
  showBaptismalName: false,
  baptismalGroom: "",
  baptismalGroomFather: "",
  baptismalGroomMother: "",
  baptismalBride: "",
  baptismalBrideFather: "",
  baptismalBrideMother: "",
  showRsvp: true,
  rsvpTitle: "참석 의사",
  rsvpContent: "신랑신부에게 참석 여부를 미리 알려주세요",
  rsvpButtonName: "참석 의사 전달하기",
  rsvpMeal: true,
  rsvpBus: false,
  rsvpGift: false,
  rsvpPopup: false,
  showGuestbook: true,
  showGuestSnap: false,
  guestSnapContent: "",
  guestSnapPhotos: [],
  showNotice: false,
  noticeTitle: "",
  noticeItems: [],
  showEndingMessage: false,
  endingPhoto: "",
  endingContent: "",
  showShareImage: false,
  shareTitle: "",
  shareContent: "",
  sharePhoto: "",
  invitationSlug: "",
  coverImage: "",
  timeline: [],
  transportInfo: "",
  groomAccounts: [{ bank: "", account: "", holder: "" }],
  brideAccounts: [{ bank: "", account: "", holder: "" }],
  coverDisplayStyle: "slide",
  messageAlign: "center",
  calendarStyle: "full",
  accountDisplayStyle: "expand",
  endingStyle: "card",
  nameDisplayStyle: "horizontal",
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
const minutes = ["00", "10", "20", "30", "40", "50"]

const MUSIC_TRACKS = [
  "Pure Morning Light",
  "Soft Promise",
  "First Snow Whisper",
  "Garden Walk",
  "Timeless Vow",
  "Blush Pink Moment",
  "Golden Hour Breeze",
  "Forever Whisper",
  "Eternal Bloom",
  "Dear My Love",
]

const MAIN_TEMPLATES = [
  { id: "poster", label: "포스터" },
  { id: "modern", label: "모던" },
  { id: "polaroid", label: "폴라로이드" },
  { id: "classic", label: "클래식" },
  { id: "linedrawing", label: "라인드로잉" },
  { id: "casual", label: "캐쥬얼" },
  { id: "basic", label: "베이직" },
  { id: "frame", label: "액자" },
  { id: "waxseal", label: "왁스실링" },
  { id: "cinema", label: "시네마" },
  { id: "none", label: "템플릿 없음" },
]

function SectionSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      data-testid="switch-toggle"
      onClick={() => onChange(!checked)}
      className={`relative w-[50px] h-[28px] rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[#c9a86c]" : "bg-[#D1D6DB]"
      }`}
    >
      <div
        className={`absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-transform ${
          checked ? "left-[25px]" : "left-[3px]"
        }`}
      />
    </button>
  )
}

function SectionHeader({
  title,
  showSwitch = false,
  checked = false,
  onChange,
  badge,
}: {
  title: string
  showSwitch?: boolean
  checked?: boolean
  onChange?: (v: boolean) => void
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-[16px] font-bold text-[#191F28]">{title}</h3>
        <Info className="w-4 h-4 text-[#B0B8C1]" />
        {badge && (
          <span className="text-[12px] font-bold text-red-500">{badge}</span>
        )}
      </div>
      {showSwitch && onChange && (
        <SectionSwitch checked={checked} onChange={onChange} />
      )}
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] transition-colors"
      />
    </div>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          checked ? "bg-[#c9a86c] border-[#c9a86c]" : "border-[#D1D6DB]"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="text-[14px] text-[#4E5968]">{label}</span>
    </label>
  )
}

function RadioField({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  label?: string
}) {
  return (
    <div className="space-y-2">
      {label && <label className="text-[14px] text-[#4E5968] block">{label}</label>}
      <div className="flex gap-3 flex-wrap">
        {options.map((opt) => (
          <button
            type="button"
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer"
            data-testid={`radio-${opt.value}`}
            onClick={() => onChange(opt.value)}
          >
            <div
              className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${
                value === opt.value ? "border-[#c9a86c]" : "border-[#D1D6DB]"
              }`}
            >
              {value === opt.value && (
                <div className="w-[10px] h-[10px] rounded-full bg-[#c9a86c]" />
              )}
            </div>
            <span className={`text-[14px] ${value === opt.value ? "text-[#191F28] font-medium" : "text-[#8B95A1]"}`}>
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ImageUploadBox({
  value,
  onUpload,
  onRemove,
  maxCount = 1,
  currentCount = 0,
}: {
  value?: string
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove?: () => void
  maxCount?: number
  currentCount?: number
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <input ref={ref} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      {value ? (
        <div className="relative w-[100px] h-[100px]">
          <img src={value} alt="" className="w-full h-full object-cover rounded-[10px]" />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute -top-1 -right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => ref.current?.click()}
          className="w-[100px] h-[100px] bg-white border-2 border-dashed border-[#D1D6DB] rounded-[10px] flex flex-col items-center justify-center gap-1 hover:border-[#c9a86c] transition-colors"
        >
          <Plus className="w-5 h-5 text-[#B0B8C1]" />
          <span className="text-[11px] text-[#B0B8C1]">
            {currentCount}/{maxCount}
          </span>
        </button>
      )}
    </>
  )
}

export default function InvitationEditorPage() {
  const [data, setData] = useState<InvitationData>(initialData)
  const [showPreview, setShowPreview] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const mainPhotoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const res = await fetch("/api/invitation?userId=default")
        if (res.ok) {
          const result = await res.json()
          if (result && typeof result === "object") {
            if (result.invitationData) {
              setData((prev) => ({ ...prev, ...result.invitationData }))
            } else if (result.groomName !== undefined || result.brideName !== undefined || result.title !== undefined) {
              setData((prev) => ({ ...prev, ...result }))
            }
          }
        }
      } catch (err) {
        console.error("Failed to load invitation:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadInvitation()
  }, [])

  const updateField = <K extends keyof InvitationData>(field: K, value: InvitationData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch("/api/invitation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default", invitationData: data }),
      })
    } catch (error) {
      console.error("Failed to save invitation:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/invitation/preview` : ""

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
      "소중한 분들을 모시고 저희 두 사람이 새로운 출발을 하려 합니다.\n오셔서 따뜻한 축복으로 함께해 주시면 감사하겠습니다.",
    ]
    updateField("message", templates[Math.floor(Math.random() * templates.length)])
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      const totalImages = [...data.galleryImages, ...newImages].slice(0, 20)
      updateField("galleryImages", totalImages)
    }
  }

  const handleMainPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      const totalImages = [...data.mainPhotos, ...newImages].slice(0, 5)
      updateField("mainPhotos", totalImages)
    }
  }

  const getFormattedTime = () => {
    return `${data.ampm} ${data.hour}시 ${data.minute !== "00" ? data.minute + "분" : ""}`
  }

  const getFormattedDate = () => {
    if (!data.weddingDate) return ""
    const date = new Date(data.weddingDate)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
  }

  const previewData = {
    ...data,
    date: getFormattedDate(),
    time: getFormattedTime(),
  }

  if (isLoading) {
    return (
      <main className="h-dvh flex items-center justify-center bg-[#FAF9F7]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a86c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[14px] text-[#8B95A1]">청첩장을 불러오는 중...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="h-dvh flex flex-col bg-[#F2F4F6] overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between">
          <Link
            href="/wedding"
            data-testid="button-back"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#191F28]" />
          </Link>
          <h1 className="text-[17px] font-bold text-[#191F28]">청첩장</h1>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F2F4F6] rounded-full">
            <svg className="w-3.5 h-3.5 text-[#8B95A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-[12px] text-[#8B95A1] font-medium">비공개</span>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-md mx-auto">
          {/* 청첩장 제목 */}
          <div className="bg-white mx-4 mt-4 rounded-[16px] p-5">
            <InputField
              label="청첩장 제목"
              value={data.title}
              onChange={(v) => updateField("title", v)}
              placeholder="우리의 날"
              required
            />
            <p className="text-[12px] text-[#8B95A1] mt-2 ml-[82px]">
              구분을 위한 제목으로, 하객에게는 노출되지 않아요
            </p>
          </div>

          {/* 오프닝 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="오프닝"
              showSwitch
              checked={data.showOpening}
              onChange={(v) => updateField("showOpening", v)}
            />
            {data.showOpening && (
              <div className="space-y-4">
                <div>
                  <label className="text-[14px] text-[#4E5968] mb-2 block">
                    타입 선택<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    {["type1", "type2"].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("openingType", type)}
                        className={`w-[120px] h-[160px] rounded-[12px] border-2 flex items-center justify-center ${
                          data.openingType === type
                            ? "border-[#c9a86c] bg-[#FAF9F7]"
                            : "border-[#E5E8EB] bg-[#F8F9FA]"
                        }`}
                      >
                        <span className="text-[12px] text-[#8B95A1]">
                          {type === "type1" ? "타입 1" : "타입 2"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="text-[14px] text-[#4E5968] w-[70px]">
                        장면 {num}<span className="text-red-500">*</span>
                      </label>
                      <ImageUploadBox
                        value={data.openingScenes[num - 1]}
                        onUpload={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const url = URL.createObjectURL(file)
                            const newScenes = [...data.openingScenes]
                            newScenes[num - 1] = url
                            updateField("openingScenes", newScenes)
                          }
                        }}
                        onRemove={() => {
                          const newScenes = [...data.openingScenes]
                          newScenes[num - 1] = ""
                          updateField("openingScenes", newScenes)
                        }}
                      />
                    </div>
                    <InputField
                      label={`문구 ${num}`}
                      value={data.openingTexts[num - 1] || ""}
                      onChange={(v) => {
                        const newTexts = [...data.openingTexts]
                        newTexts[num - 1] = v
                        updateField("openingTexts", newTexts)
                      }}
                      placeholder={
                        num === 1
                          ? "2000-00-00-SAT"
                          : num === 2
                            ? "저희의 첫걸음을"
                            : "함께해주세요."
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 메인 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader title="메인" />
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-1">
                <div className="flex gap-2 px-1" style={{ minWidth: "max-content" }}>
                  {MAIN_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      data-testid={`template-${t.id}`}
                      onClick={() => updateField("mainTemplate", t.id)}
                      className={`w-[80px] h-[110px] rounded-[10px] border-2 flex items-center justify-center flex-shrink-0 ${
                        data.mainTemplate === t.id
                          ? "border-[#c9a86c] bg-[#FAF9F7]"
                          : "border-[#E5E8EB] bg-[#F8F9FA]"
                      }`}
                    >
                      <span className="text-[11px] text-[#8B95A1]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[14px] text-[#4E5968] mb-2 block">사진</label>
                <input
                  ref={mainPhotoRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMainPhotoUpload}
                  className="hidden"
                />
                <div className="flex gap-2 flex-wrap">
                  {data.mainPhotos.map((img, i) => (
                    <div key={i} className="relative w-[80px] h-[80px]">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-[8px]" />
                      <button
                        onClick={() =>
                          updateField(
                            "mainPhotos",
                            data.mainPhotos.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute -top-1 -right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {data.mainPhotos.length < 5 && (
                    <button
                      onClick={() => mainPhotoRef.current?.click()}
                      className="w-[80px] h-[80px] bg-white border-2 border-dashed border-[#D1D6DB] rounded-[8px] flex flex-col items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4 text-[#B0B8C1]" />
                      <span className="text-[10px] text-[#B0B8C1]">
                        {data.mainPhotos.length}/5
                      </span>
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-[#8B95A1] mt-2">
                  사진은 원본 비율 그대로 보여지지만, 화면에 맞춰 일부가 가려질 수 있어요.
                  얼굴이나 중요한 요소는 여백이 있는 세로 사진을 추천해요.
                </p>
              </div>

              <div>
                <label className="text-[14px] text-[#4E5968] mb-2 block">텍스트 컬러</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateField("textColor", "dark")}
                    className={`w-10 h-10 rounded-full border-2 bg-[#191F28] ${
                      data.textColor === "dark" ? "border-[#c9a86c]" : "border-transparent"
                    }`}
                  />
                  <button
                    onClick={() => updateField("textColor", "light")}
                    className={`w-10 h-10 rounded-full border-2 bg-white ${
                      data.textColor === "light" ? "border-[#c9a86c]" : "border-[#E5E8EB]"
                    }`}
                  />
                </div>
              </div>

              <RadioField
                label="커버 표시 방식"
                options={[
                  { value: "slide", label: "슬라이드" },
                  { value: "fade", label: "페이드" },
                  { value: "static", label: "고정" },
                ]}
                value={data.coverDisplayStyle}
                onChange={(v) => updateField("coverDisplayStyle", v as any)}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader title="기본 정보" />
            <div className="space-y-4">
              {/* 신랑 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">
                  신랑<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.groomName}
                  onChange={(e) => updateField("groomName", e.target.value)}
                  placeholder="이름"
                  data-testid="input-groom-name"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <input
                  type="text"
                  value={data.groomRelation}
                  onChange={(e) => updateField("groomRelation", e.target.value)}
                  placeholder="아들"
                  className="w-[80px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>
              <InputField
                label="전화번호"
                value={data.groomPhone}
                onChange={(v) => updateField("groomPhone", v)}
                placeholder="전화번호"
              />
              {/* 신랑 아버지 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">아버지</label>
                <input
                  type="text"
                  value={data.groomFather.name}
                  onChange={(e) =>
                    updateField("groomFather", { ...data.groomFather, name: e.target.value })
                  }
                  placeholder="성함"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <CheckboxField
                  label="故"
                  checked={data.groomFather.deceased}
                  onChange={(v) =>
                    updateField("groomFather", { ...data.groomFather, deceased: v })
                  }
                />
              </div>
              <InputField
                label="전화번호"
                value={data.groomFather.phone}
                onChange={(v) =>
                  updateField("groomFather", { ...data.groomFather, phone: v })
                }
                placeholder="전화번호"
              />
              {/* 신랑 어머니 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">어머니</label>
                <input
                  type="text"
                  value={data.groomMother.name}
                  onChange={(e) =>
                    updateField("groomMother", { ...data.groomMother, name: e.target.value })
                  }
                  placeholder="성함"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <CheckboxField
                  label="故"
                  checked={data.groomMother.deceased}
                  onChange={(v) =>
                    updateField("groomMother", { ...data.groomMother, deceased: v })
                  }
                />
              </div>
              <InputField
                label="전화번호"
                value={data.groomMother.phone}
                onChange={(v) =>
                  updateField("groomMother", { ...data.groomMother, phone: v })
                }
                placeholder="전화번호"
              />

              <div className="h-px bg-[#E5E8EB]" />

              {/* 신부 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">
                  신부<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.brideName}
                  onChange={(e) => updateField("brideName", e.target.value)}
                  placeholder="이름"
                  data-testid="input-bride-name"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <input
                  type="text"
                  value={data.brideRelation}
                  onChange={(e) => updateField("brideRelation", e.target.value)}
                  placeholder="딸"
                  className="w-[80px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>
              <InputField
                label="전화번호"
                value={data.bridePhone}
                onChange={(v) => updateField("bridePhone", v)}
                placeholder="전화번호"
              />
              {/* 신부 아버지 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">아버지</label>
                <input
                  type="text"
                  value={data.brideFather.name}
                  onChange={(e) =>
                    updateField("brideFather", { ...data.brideFather, name: e.target.value })
                  }
                  placeholder="성함"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <CheckboxField
                  label="故"
                  checked={data.brideFather.deceased}
                  onChange={(v) =>
                    updateField("brideFather", { ...data.brideFather, deceased: v })
                  }
                />
              </div>
              <InputField
                label="전화번호"
                value={data.brideFather.phone}
                onChange={(v) =>
                  updateField("brideFather", { ...data.brideFather, phone: v })
                }
                placeholder="전화번호"
              />
              {/* 신부 어머니 */}
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">어머니</label>
                <input
                  type="text"
                  value={data.brideMother.name}
                  onChange={(e) =>
                    updateField("brideMother", { ...data.brideMother, name: e.target.value })
                  }
                  placeholder="성함"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <CheckboxField
                  label="故"
                  checked={data.brideMother.deceased}
                  onChange={(v) =>
                    updateField("brideMother", { ...data.brideMother, deceased: v })
                  }
                />
              </div>
              <InputField
                label="전화번호"
                value={data.brideMother.phone}
                onChange={(v) =>
                  updateField("brideMother", { ...data.brideMother, phone: v })
                }
                placeholder="전화번호"
              />

              <div className="h-px bg-[#E5E8EB]" />

              <CheckboxField
                label="신부측 먼저 표시"
                checked={data.brideFirst}
                onChange={(v) => updateField("brideFirst", v)}
              />
              <CheckboxField
                label="국화 꽃으로 표기"
                checked={data.deceasedFlower}
                onChange={(v) => updateField("deceasedFlower", v)}
              />
            </div>
          </div>

          {/* 초대 인사말 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader title="초대 인사말" />
            <div className="space-y-4">
              <InputField
                label="제목"
                value={data.invitationTitle}
                onChange={(v) => updateField("invitationTitle", v)}
                placeholder="새로운 시작에 함께해주세요"
              />
              <div className="flex gap-3">
                <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                  내용
                </label>
                <div className="flex-1">
                  <textarea
                    value={data.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="소중한 분들을 모시고 저희 두 사람이 새로운 출발을 하려 합니다.&#10;오셔서 따뜻한 축복으로 함께해 주시면 감사하겠습니다."
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none leading-relaxed"
                  />
                  <button
                    onClick={generateAIMessage}
                    className="mt-2 text-[13px] text-[#c9a86c] font-medium underline"
                  >
                    인사말 샘플
                  </button>
                </div>
              </div>
              <CheckboxField
                label="인사말 하단에 신랑 신부 & 혼주 성함 표시"
                checked={data.showNameAtBottom}
                onChange={(v) => updateField("showNameAtBottom", v)}
              />
              <RadioField
                label="인사말 정렬"
                options={[
                  { value: "center", label: "가운데 정렬" },
                  { value: "left", label: "왼쪽 정렬" },
                ]}
                value={data.messageAlign}
                onChange={(v) => updateField("messageAlign", v as any)}
              />
              <RadioField
                label="이름 표시 방식"
                options={[
                  { value: "horizontal", label: "가로 배열" },
                  { value: "vertical", label: "세로 배열" },
                ]}
                value={data.nameDisplayStyle}
                onChange={(v) => updateField("nameDisplayStyle", v as any)}
              />
            </div>
          </div>

          {/* 예식 정보 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader title="예식 정보" />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">예식일</label>
                <input
                  type="date"
                  value={data.weddingDate}
                  onChange={(e) => updateField("weddingDate", e.target.value)}
                  data-testid="input-wedding-date"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[70px]">예식 시간</label>
                <select
                  value={data.ampm}
                  onChange={(e) => updateField("ampm", e.target.value as "오전" | "오후")}
                  className="px-3 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] focus:outline-none focus:border-[#c9a86c]"
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  value={data.hour}
                  onChange={(e) => updateField("hour", e.target.value)}
                  className="px-3 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] focus:outline-none focus:border-[#c9a86c]"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}시
                    </option>
                  ))}
                </select>
                <select
                  value={data.minute}
                  onChange={(e) => updateField("minute", e.target.value)}
                  className="px-3 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] focus:outline-none focus:border-[#c9a86c]"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}분
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="웨딩홀"
                value={data.venue}
                onChange={(v) => updateField("venue", v)}
                placeholder="웨딩홀명을 입력해주세요."
              />
              <InputField
                label="층과 홀"
                value={data.venueHall}
                onChange={(v) => updateField("venueHall", v)}
                placeholder="층과 웨딩홀 이름을 입력해주세요."
              />
              <InputField
                label="주소"
                value={data.address}
                onChange={(v) => updateField("address", v)}
                placeholder="웨딩홀 주소를 검색해주세요."
              />
              <InputField
                label="전화번호"
                value={data.venuePhone}
                onChange={(v) => updateField("venuePhone", v)}
                placeholder="웨딩홀 연락처(02-1234-1234)"
              />
              <div className="space-y-2">
                <label className="text-[14px] text-[#4E5968]">표시</label>
                <CheckboxField
                  label="캘린더"
                  checked={data.showCalendar}
                  onChange={(v) => updateField("showCalendar", v)}
                />
                <CheckboxField
                  label="카운트다운"
                  checked={data.showCountdown}
                  onChange={(v) => updateField("showCountdown", v)}
                />
              </div>
              <RadioField
                label="캘린더 스타일"
                options={[
                  { value: "full", label: "전체 달력" },
                  { value: "simple", label: "심플 텍스트" },
                ]}
                value={data.calendarStyle}
                onChange={(v) => updateField("calendarStyle", v as any)}
              />
            </div>
          </div>

          {/* 교통 수단 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader title="교통 수단" />
            <div className="space-y-4">
              {data.transportItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[14px] text-[#4E5968] w-[80px]">
                      교통 수단 {index + 1}
                    </label>
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => {
                        const newItems = [...data.transportItems]
                        newItems[index] = { ...newItems[index], type: e.target.value }
                        updateField("transportItems", newItems)
                      }}
                      placeholder="교통수단(지하철,자가용,버스 등)"
                      className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                    />
                  </div>
                  <div className="ml-[92px]">
                    <textarea
                      value={item.detail}
                      onChange={(e) => {
                        const newItems = [...data.transportItems]
                        newItems[index] = { ...newItems[index], detail: e.target.value }
                        updateField("transportItems", newItems)
                      }}
                      placeholder="오시는 길 내용을 입력해주세요."
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  updateField("transportItems", [
                    ...data.transportItems,
                    { type: "", detail: "" },
                  ])
                }
                className="text-[13px] text-[#c9a86c] font-medium"
              >
                + 추가하기
              </button>
              <CheckboxField
                label="안내사항 표시"
                checked={data.showTransportNotice}
                onChange={(v) => updateField("showTransportNotice", v)}
              />
            </div>
          </div>

          {/* 펀딩 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="펀딩"
              showSwitch
              checked={data.showFunding}
              onChange={(v) => updateField("showFunding", v)}
            />
            {data.showFunding && (
              <div className="space-y-4">
                <div className="bg-[#EEF4FF] rounded-[10px] p-4">
                  <p className="text-[13px] text-[#3182F6] leading-relaxed">
                    모바일 청첩장을 받은 지인은 평범한 축의금 대신 의미있는 펀딩으로 마음을
                    전할 수 있어요. 펀딩은 카드 결제로 간편하게 참여할 수 있으며, 모인 금액은
                    수수료 없이 언제든 출금 가능합니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                    안내문구<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.fundingMessage}
                    onChange={(e) => updateField("fundingMessage", e.target.value)}
                    placeholder="평범한 축의금은 잊으세요.&#10;내가 고른 의미 있는 선물 한 조각이 모여&#10;두 사람의 특별한 순간을 만들어 주세요."
                    rows={4}
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                  />
                </div>
                <p className="text-[12px] text-[#8B95A1] ml-[82px]">
                  펀딩 영역 상단에 표시되는 안내 문구예요. 하객에게 목적이나 분위기를 간단히
                  알려주세요.
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px]">
                    이미지<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={data.fundingImageType === "default"}
                        onChange={() => updateField("fundingImageType", "default")}
                        className="accent-[#c9a86c]"
                      />
                      <span className="text-[14px] text-[#4E5968]">기본 이미지</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        checked={data.fundingImageType === "custom"}
                        onChange={() => updateField("fundingImageType", "custom")}
                        className="accent-[#c9a86c]"
                      />
                      <span className="text-[14px] text-[#4E5968]">내 이미지 추가</span>
                    </label>
                  </div>
                </div>
                <InputField
                  label="버튼명"
                  value={data.fundingButtonName}
                  onChange={(v) => updateField("fundingButtonName", v)}
                  placeholder="신혼여행 축하하기"
                  required
                />
                <div className="flex gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                    감사인사<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.fundingThanks}
                    onChange={(e) => updateField("fundingThanks", e.target.value)}
                    placeholder="정성껏 전해주신 마음, 오래 기억할게요.&#10;감사합니다."
                    rows={3}
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 선물 펀딩 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="선물 펀딩"
              showSwitch
              checked={data.showGiftFunding}
              onChange={(v) => updateField("showGiftFunding", v)}
            />
            {data.showGiftFunding && (
              <div className="space-y-4">
                <div className="bg-[#EEF4FF] rounded-[10px] p-4">
                  <p className="text-[13px] text-[#3182F6] leading-relaxed">
                    하객은 위시리스트에서 선물을 선택해 직접 선물하거나, 필요한 경우 금액을
                    보태 함께 선물할 수 있어요.
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                    안내문구<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.giftFundingMessage}
                    onChange={(e) => updateField("giftFundingMessage", e.target.value)}
                    placeholder="저희의 작은 취향들을 담은 선물 목록이에요.&#10;축하의 마음을 전하실 때 참고하실 수 있어요."
                    rows={3}
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                  />
                </div>
                <InputField
                  label="버튼명"
                  value={data.giftFundingButtonName}
                  onChange={(v) => updateField("giftFundingButtonName", v)}
                  placeholder="선물전하기"
                  required
                />
              </div>
            )}
          </div>

          {/* 혼주 계좌번호 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="혼주 계좌번호"
              showSwitch
              checked={data.showAccount}
              onChange={(v) => updateField("showAccount", v)}
            />
            {data.showAccount && (
              <div className="space-y-4">
                <RadioField
                  label="표시 방식"
                  options={[
                    { value: "expand", label: "펼침" },
                    { value: "accordion", label: "접기(아코디언)" },
                  ]}
                  value={data.accountDisplayStyle}
                  onChange={(v) => updateField("accountDisplayStyle", v as any)}
                />
                {/* 신랑 아버지 */}
                <InputField
                  label="신랑 아버지"
                  value={data.groomFatherAccount.holder}
                  onChange={(v) =>
                    updateField("groomFatherAccount", {
                      ...data.groomFatherAccount,
                      holder: v,
                    })
                  }
                  placeholder="예금주명"
                />
                <div className="flex items-center gap-2 ml-[82px]">
                  <input
                    type="text"
                    value={data.groomFatherAccount.bank}
                    onChange={(e) =>
                      updateField("groomFatherAccount", {
                        ...data.groomFatherAccount,
                        bank: e.target.value,
                      })
                    }
                    placeholder="은행"
                    className="w-[100px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <input
                    type="text"
                    value={data.groomFatherAccount.account}
                    onChange={(e) =>
                      updateField("groomFatherAccount", {
                        ...data.groomFatherAccount,
                        account: e.target.value,
                      })
                    }
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
                {/* 신랑 어머니 */}
                <InputField
                  label="신랑 어머니"
                  value={data.groomMotherAccount.holder}
                  onChange={(v) =>
                    updateField("groomMotherAccount", {
                      ...data.groomMotherAccount,
                      holder: v,
                    })
                  }
                  placeholder="예금주명"
                />
                <div className="flex items-center gap-2 ml-[82px]">
                  <input
                    type="text"
                    value={data.groomMotherAccount.bank}
                    onChange={(e) =>
                      updateField("groomMotherAccount", {
                        ...data.groomMotherAccount,
                        bank: e.target.value,
                      })
                    }
                    placeholder="은행"
                    className="w-[100px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <input
                    type="text"
                    value={data.groomMotherAccount.account}
                    onChange={(e) =>
                      updateField("groomMotherAccount", {
                        ...data.groomMotherAccount,
                        account: e.target.value,
                      })
                    }
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div className="h-px bg-[#E5E8EB]" />

                {/* 신부 아버지 */}
                <InputField
                  label="신부 아버지"
                  value={data.brideFatherAccount.holder}
                  onChange={(v) =>
                    updateField("brideFatherAccount", {
                      ...data.brideFatherAccount,
                      holder: v,
                    })
                  }
                  placeholder="예금주명"
                />
                <div className="flex items-center gap-2 ml-[82px]">
                  <input
                    type="text"
                    value={data.brideFatherAccount.bank}
                    onChange={(e) =>
                      updateField("brideFatherAccount", {
                        ...data.brideFatherAccount,
                        bank: e.target.value,
                      })
                    }
                    placeholder="은행"
                    className="w-[100px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <input
                    type="text"
                    value={data.brideFatherAccount.account}
                    onChange={(e) =>
                      updateField("brideFatherAccount", {
                        ...data.brideFatherAccount,
                        account: e.target.value,
                      })
                    }
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
                {/* 신부 어머니 */}
                <InputField
                  label="신부 어머니"
                  value={data.brideMotherAccount.holder}
                  onChange={(v) =>
                    updateField("brideMotherAccount", {
                      ...data.brideMotherAccount,
                      holder: v,
                    })
                  }
                  placeholder="예금주명"
                />
                <div className="flex items-center gap-2 ml-[82px]">
                  <input
                    type="text"
                    value={data.brideMotherAccount.bank}
                    onChange={(e) =>
                      updateField("brideMotherAccount", {
                        ...data.brideMotherAccount,
                        bank: e.target.value,
                      })
                    }
                    placeholder="은행"
                    className="w-[100px] px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <input
                    type="text"
                    value={data.brideMotherAccount.account}
                    onChange={(e) =>
                      updateField("brideMotherAccount", {
                        ...data.brideMotherAccount,
                        account: e.target.value,
                      })
                    }
                    placeholder="계좌번호"
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 갤러리 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="갤러리"
              showSwitch
              checked={data.showGallery}
              onChange={(v) => updateField("showGallery", v)}
            />
            {data.showGallery && (
              <div className="space-y-4">
                <div>
                  <label className="text-[14px] text-[#4E5968] mb-2 block">사진</label>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {data.galleryImages.map((img, i) => (
                      <div key={i} className="relative w-[60px] h-[60px]">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover rounded-[6px]"
                        />
                        <button
                          onClick={() =>
                            updateField(
                              "galleryImages",
                              data.galleryImages.filter((_, idx) => idx !== i)
                            )
                          }
                          className="absolute -top-1 -right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                    {data.galleryImages.length < 20 && (
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="w-[60px] h-[60px] bg-white border-2 border-dashed border-[#D1D6DB] rounded-[6px] flex flex-col items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-[#B0B8C1]" />
                        <span className="text-[9px] text-[#B0B8C1]">
                          {data.galleryImages.length}/20
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-[#8B95A1] mt-2">
                    -사진을 드래그하여 순서 변경 가능합니다.
                    <br />
                    -최대 20장까지 등록할 수 있습니다.
                  </p>
                </div>
                <RadioField
                  label="방식"
                  options={[
                    { value: "swipe", label: "스와이프" },
                    { value: "grid", label: "그리드" },
                  ]}
                  value={data.galleryStyle}
                  onChange={(v) => updateField("galleryStyle", v as any)}
                />
              </div>
            )}
          </div>

          {/* 중간사진 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="중간사진"
              showSwitch
              checked={data.showMidPhoto}
              onChange={(v) => updateField("showMidPhoto", v)}
            />
            {data.showMidPhoto && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-[14px] text-[#4E5968]">사진</label>
                  <ImageUploadBox
                    value={data.midPhoto}
                    onUpload={(e) => {
                      const file = e.target.files?.[0]
                      if (file) updateField("midPhoto", URL.createObjectURL(file))
                    }}
                    onRemove={() => updateField("midPhoto", "")}
                  />
                </div>
                <p className="text-[12px] text-[#8B95A1]">
                  사진은 원본 비율 그대로 보여지지만, 화면에 맞춰 일부가 가려질 수 있어요.
                </p>
              </div>
            )}
          </div>

          {/* 배경음악 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="배경음악"
              showSwitch
              checked={data.showMusic}
              onChange={(v) => updateField("showMusic", v)}
              badge="NEW"
            />
            {data.showMusic && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {MUSIC_TRACKS.map((track) => (
                    <button
                      key={track}
                      onClick={() => updateField("musicTrack", track)}
                      className={`px-4 py-2 rounded-full text-[13px] border ${
                        data.musicTrack === track
                          ? "border-[#c9a86c] text-[#c9a86c] bg-[#FAF9F7]"
                          : "border-[#E5E8EB] text-[#8B95A1]"
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
                {data.musicTrack && (
                  <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-[10px] p-3">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Play className="w-4 h-4 text-[#191F28] ml-0.5" />
                    </button>
                    <span className="text-[13px] text-[#4E5968]">0:00 / 1:31</span>
                    <div className="flex-1 h-1 bg-[#E5E8EB] rounded-full">
                      <div className="w-0 h-full bg-[#c9a86c] rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 세례명 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="세례명"
              showSwitch
              checked={data.showBaptismalName}
              onChange={(v) => updateField("showBaptismalName", v)}
            />
            {data.showBaptismalName && (
              <div className="space-y-3">
                <InputField
                  label="신랑"
                  value={data.baptismalGroom}
                  onChange={(v) => updateField("baptismalGroom", v)}
                  placeholder="신랑 세례명을 입력해주세요."
                />
                <InputField
                  label="아버지"
                  value={data.baptismalGroomFather}
                  onChange={(v) => updateField("baptismalGroomFather", v)}
                  placeholder="신랑 아버지 세례명을 입력해주세요."
                />
                <InputField
                  label="어머니"
                  value={data.baptismalGroomMother}
                  onChange={(v) => updateField("baptismalGroomMother", v)}
                  placeholder="신랑 어머니 세례명을 입력해주세요."
                />
                <div className="h-px bg-[#E5E8EB]" />
                <InputField
                  label="신부"
                  value={data.baptismalBride}
                  onChange={(v) => updateField("baptismalBride", v)}
                  placeholder="신부 세례명을 입력해주세요."
                />
                <InputField
                  label="아버지"
                  value={data.baptismalBrideFather}
                  onChange={(v) => updateField("baptismalBrideFather", v)}
                  placeholder="신부 아버지 세례명을 입력해주세요."
                />
                <InputField
                  label="어머니"
                  value={data.baptismalBrideMother}
                  onChange={(v) => updateField("baptismalBrideMother", v)}
                  placeholder="신부 어머니 세례명을 입력해주세요."
                />
              </div>
            )}
          </div>

          {/* 참석여부 RSVP */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="참석여부 RSVP"
              showSwitch
              checked={data.showRsvp}
              onChange={(v) => updateField("showRsvp", v)}
            />
            {data.showRsvp && (
              <div className="space-y-4">
                <InputField
                  label="제목"
                  value={data.rsvpTitle}
                  onChange={(v) => updateField("rsvpTitle", v)}
                  placeholder="참석 의사"
                  required
                />
                <InputField
                  label="내용"
                  value={data.rsvpContent}
                  onChange={(v) => updateField("rsvpContent", v)}
                  placeholder="신랑신부에게 참석 여부를 미리 알려주세요"
                  required
                />
                <InputField
                  label="버튼명"
                  value={data.rsvpButtonName}
                  onChange={(v) => updateField("rsvpButtonName", v)}
                  placeholder="참석 의사 전달하기"
                  required
                />
                <div className="space-y-2">
                  <label className="text-[14px] text-[#4E5968]">항목 선택</label>
                  <CheckboxField
                    label="식사 여부"
                    checked={data.rsvpMeal}
                    onChange={(v) => updateField("rsvpMeal", v)}
                  />
                  <CheckboxField
                    label="버스 탑승 여부"
                    checked={data.rsvpBus}
                    onChange={(v) => updateField("rsvpBus", v)}
                  />
                  <CheckboxField
                    label="답례품 수령 여부"
                    checked={data.rsvpGift}
                    onChange={(v) => updateField("rsvpGift", v)}
                  />
                </div>
                <CheckboxField
                  label="청첩장 진입 시 팝업 노출 여부 설정"
                  checked={data.rsvpPopup}
                  onChange={(v) => updateField("rsvpPopup", v)}
                />
                <p className="text-[12px] text-[#8B95A1]">
                  ※ RSVP 응답 내역은 청첩장 관리 메뉴에서 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>

          {/* 방명록 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="방명록"
              showSwitch
              checked={data.showGuestbook}
              onChange={(v) => updateField("showGuestbook", v)}
            />
          </div>

          {/* 하객스냅 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="하객스냅"
              showSwitch
              checked={data.showGuestSnap}
              onChange={(v) => updateField("showGuestSnap", v)}
              badge="NEW"
            />
            {data.showGuestSnap && (
              <div className="space-y-4">
                <div className="bg-[#EEF4FF] rounded-[10px] p-4">
                  <p className="text-[13px] text-[#3182F6] leading-relaxed">
                    신랑, 신부가 하객 스냅 기능을 ON 하면, 하객이 예식 후 청첩장에서 직접
                    사진을 업로드할 수 있어요. 올라온 사진은 하객 전용 웨딩북 폴더에
                    저장되며, 언제든 다운로드할 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                    내용<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={data.guestSnapContent}
                    onChange={(e) => updateField("guestSnapContent", e.target.value)}
                    placeholder="신랑, 신부의 행복한 순간을 담아주세요. 예식 당일, 아래 버튼을 눌러 사진을 올려주세요. 많은 참여 부탁드려요!"
                    rows={4}
                    className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 공지사항 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="공지사항"
              showSwitch
              checked={data.showNotice}
              onChange={(v) => updateField("showNotice", v)}
            />
            {data.showNotice && (
              <div className="space-y-3">
                <InputField
                  label="메인 제목"
                  value={data.noticeTitle}
                  onChange={(v) => updateField("noticeTitle", v)}
                  placeholder="메인 제목을 입력해주세요."
                  required
                />
                <button
                  onClick={() =>
                    updateField("noticeItems", [...data.noticeItems, ""])
                  }
                  className="text-[13px] text-[#c9a86c] font-medium"
                >
                  + 추가하기
                </button>
                {data.noticeItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...data.noticeItems]
                        newItems[i] = e.target.value
                        updateField("noticeItems", newItems)
                      }}
                      placeholder={`공지사항 ${i + 1}`}
                      className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                    />
                    <button
                      onClick={() =>
                        updateField(
                          "noticeItems",
                          data.noticeItems.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-[#B0B8C1] hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 엔딩 메시지 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="엔딩 메시지"
              showSwitch
              checked={data.showEndingMessage}
              onChange={(v) => updateField("showEndingMessage", v)}
            />
            {data.showEndingMessage && (
              <div className="space-y-4">
                <RadioField
                  label="엔딩 스타일"
                  options={[
                    { value: "card", label: "카드" },
                    { value: "full", label: "전체" },
                    { value: "simple", label: "심플" },
                  ]}
                  value={data.endingStyle}
                  onChange={(v) => updateField("endingStyle", v as any)}
                />
                <div className="flex items-center gap-3">
                  <label className="text-[14px] text-[#4E5968]">사진</label>
                  <ImageUploadBox
                    value={data.endingPhoto}
                    onUpload={(e) => {
                      const file = e.target.files?.[0]
                      if (file) updateField("endingPhoto", URL.createObjectURL(file))
                    }}
                    onRemove={() => updateField("endingPhoto", "")}
                  />
                </div>
                <div className="flex gap-3">
                  <label className="text-[14px] text-[#4E5968] w-[70px] flex-shrink-0 pt-3">
                    내용
                  </label>
                  <div className="flex-1">
                    <textarea
                      value={data.endingContent}
                      onChange={(e) => updateField("endingContent", e.target.value)}
                      placeholder="소중한 분들의 축복 속에서 두 사람이 하나 되어&#10;새로운 출발을 합니다.&#10;따뜻한 마음으로 지켜봐 주세요."
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c] resize-none"
                    />
                    <button className="mt-2 text-[13px] text-[#c9a86c] font-medium underline">
                      엔딩 메시지 샘플
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 공유 이미지 */}
          <div className="bg-white mx-4 mt-3 rounded-[16px] p-5">
            <SectionHeader
              title="공유 이미지"
              showSwitch
              checked={data.showShareImage}
              onChange={(v) => updateField("showShareImage", v)}
            />
            {data.showShareImage && (
              <div className="space-y-4">
                <InputField
                  label="제목"
                  value={data.shareTitle}
                  onChange={(v) => updateField("shareTitle", v)}
                  placeholder="예)김신랑 이신부 결혼식에 초대합니다"
                />
                <InputField
                  label="내용"
                  value={data.shareContent}
                  onChange={(v) => updateField("shareContent", v)}
                  placeholder="예)2025년 5월 24일 토 오후 2시, 라움웨딩홀"
                />
                <div className="flex items-center gap-3">
                  <label className="text-[14px] text-[#4E5968]">사진</label>
                  <ImageUploadBox
                    value={data.sharePhoto}
                    onUpload={(e) => {
                      const file = e.target.files?.[0]
                      if (file) updateField("sharePhoto", URL.createObjectURL(file))
                    }}
                    onRemove={() => updateField("sharePhoto", "")}
                  />
                </div>
                <p className="text-[12px] text-[#8B95A1]">
                  예식 분위기에 맞는 사진과 문구를 입력하면, 링크 미리보기가 더 예쁘게
                  보여요. 별도로 설정하지 않으시면 대표이미지와 동일하게 노출됩니다.
                </p>
              </div>
            )}
          </div>

          {/* 청첩장 링크 */}
          <div className="bg-white mx-4 mt-3 mb-4 rounded-[16px] p-5">
            <SectionHeader title="청첩장 링크" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-[14px] text-[#4E5968] w-[80px]">청첩장 주소</label>
                <input
                  type="text"
                  value={data.invitationSlug}
                  onChange={(e) => updateField("invitationSlug", e.target.value)}
                  placeholder="예)yssn122, 20251121ys"
                  className="flex-1 px-4 py-3 bg-white border border-[#E5E8EB] rounded-[10px] text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:border-[#c9a86c]"
                />
                <button className="px-4 py-3 bg-[#F2F4F6] rounded-[10px] text-[13px] text-[#4E5968] font-medium hover:bg-[#E5E8EB] transition-colors">
                  확인
                </button>
              </div>
              <ul className="text-[12px] text-[#8B95A1] space-y-1 ml-[92px]">
                <li>
                  주소 뒤에 들어갈 문자만 입력해주세요. 영문 소문자, 숫자만 사용 가능하며,
                  3~20자까지 설정할 수 있어요.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="flex-shrink-0 px-4 py-4 bg-white border-t border-[#E5E8EB] shadow-lg">
        <div className="flex gap-3 max-w-md mx-auto">
          <button
            onClick={() => setShowPreview(true)}
            data-testid="button-preview"
            className="flex-1 py-4 rounded-[14px] bg-white border border-[#E5E8EB] text-[#191F28] font-semibold text-[15px] hover:bg-[#F8F9FA] transition-colors"
          >
            미리보기
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            data-testid="button-save"
            className="flex-1 py-4 rounded-[14px] bg-[#191F28] text-white font-semibold text-[15px] hover:bg-[#333D4B] transition-colors disabled:opacity-50"
          >
            {isSaving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md">
              <button
                onClick={() => {
                  setShowPreview(false)
                  setShowShareOptions(false)
                }}
                data-testid="button-close-preview"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              >
                <X className="w-5 h-5 text-[#191F28]" />
              </button>
              <h2 className="text-[17px] font-bold text-[#191F28]">청첩장 미리보기</h2>
              <button
                onClick={() => setShowShareOptions(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#c9a86c] hover:bg-[#b89755] transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#faf9f7]">
              <InvitationPreview data={previewData as any} />
            </div>
          </div>

          {showShareOptions && (
            <div
              className="fixed inset-0 z-[65] flex items-end justify-center"
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
                  <button className="w-full flex items-center gap-4 px-4 py-4 bg-[#FEE500] rounded-[16px] hover:bg-[#F5DC00] transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#3C1E1E] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#FEE500]" />
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-semibold text-[#3C1E1E]">
                        카카오톡으로 공유
                      </p>
                      <p className="text-[13px] text-[#3C1E1E]/70">
                        친구에게 청첩장을 보내세요
                      </p>
                    </div>
                  </button>

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
                      <p className="text-[13px] text-[#8B95A1] truncate max-w-[220px]">
                        {shareUrl}
                      </p>
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
    </main>
  )
}
