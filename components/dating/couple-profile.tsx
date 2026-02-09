"use client"

import { useState, useEffect } from "react"
import { Heart, Camera, Edit2, Check, Calendar, X, UserPlus, Link2, Copy } from "lucide-react"
import WheelDatePicker from "@/components/ui/wheel-date-picker"

interface ProfileData {
  name: string
  birthday: string
  photo: string | null
}

interface CoupleInfo {
  coupled: boolean
  partnerId?: string
  partner?: {
    id: string
    firstName: string
    lastName: string
    profileImageUrl: string | null
    mood: string
  }
}

const formatBirthdayDisplay = (dateStr: string): string => {
  if (!dateStr) return ""
  const parts = dateStr.split("-")
  if (parts.length !== 3) return dateStr
  return `${parts[0]}.${parts[1]}.${parts[2]}`
}

export function CoupleProfile() {
  const [myProfile, setMyProfile] = useState<ProfileData>({
    name: "",
    birthday: "",
    photo: null,
  })

  const [partnerProfile, setPartnerProfile] = useState<ProfileData>({
    name: "",
    birthday: "",
    photo: null,
  })

  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null)
  const [startDate, setStartDate] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editMyName, setEditMyName] = useState("")
  const [editPartnerName, setEditPartnerName] = useState("")
  const [editMyBirthday, setEditMyBirthday] = useState("")
  const [editPartnerBirthday, setEditPartnerBirthday] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [diffDays, setDiffDays] = useState(0)
  const [inviteCode, setInviteCode] = useState("")
  const [showInvite, setShowInvite] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "나"
    const partnerName = localStorage.getItem("survey_partnerName") || "상대"
    const myBirthday = localStorage.getItem("survey_myBirthday") || ""
    const partnerBirthday = localStorage.getItem("survey_partnerBirthday") || ""
    const savedStartDate = localStorage.getItem("survey_firstMeetDate") || ""

    setMyProfile({ name: myName, birthday: myBirthday, photo: null })
    setPartnerProfile({ name: partnerName, birthday: partnerBirthday, photo: null })
    setStartDate(savedStartDate)
    setEditMyName(myName)
    setEditPartnerName(partnerName)
    setEditMyBirthday(myBirthday)
    setEditPartnerBirthday(partnerBirthday)
    setEditStartDate(savedStartDate)

    if (savedStartDate) {
      const start = new Date(savedStartDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    fetch("/api/couple")
      .then(res => res.json())
      .then(data => {
        setCoupleInfo(data)
        if (data.coupled && data.partner) {
          const pName = data.partner.firstName || partnerName
          setPartnerProfile(prev => ({
            ...prev,
            name: pName,
            photo: data.partner.profileImageUrl || null,
          }))
          setEditPartnerName(pName)
          localStorage.setItem("survey_partnerName", pName)
        }
      })
      .catch(() => {})
  }, [])

  const handleCreateInvite = async () => {
    try {
      const myName = localStorage.getItem("survey_myName") || "나"
      const res = await fetch("/api/couple-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterName: myName, mode: "dating" }),
      })
      if (res.ok) {
        const data = await res.json()
        setInviteCode(data.inviteCode)
        setShowInvite(true)
      }
    } catch {}
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/invite/${inviteCode}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSave = () => {
    localStorage.setItem("survey_myName", editMyName)
    localStorage.setItem("survey_partnerName", editPartnerName)
    localStorage.setItem("survey_myBirthday", editMyBirthday)
    localStorage.setItem("survey_partnerBirthday", editPartnerBirthday)
    localStorage.setItem("survey_firstMeetDate", editStartDate)

    setMyProfile({ ...myProfile, name: editMyName, birthday: editMyBirthday })
    setPartnerProfile({ ...partnerProfile, name: editPartnerName, birthday: editPartnerBirthday })
    setStartDate(editStartDate)

    if (editStartDate) {
      const start = new Date(editStartDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }

    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditMyName(myProfile.name)
    setEditPartnerName(partnerProfile.name)
    setEditMyBirthday(myProfile.birthday)
    setEditPartnerBirthday(partnerProfile.birthday)
    setEditStartDate(startDate)
    setIsEditing(false)
  }

  const isCoupled = coupleInfo?.coupled === true

  return (
    <section className="bg-white rounded-[20px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        <div className="flex items-center gap-2">
          {!isCoupled && !showInvite && (
            <button
              onClick={handleCreateInvite}
              className="px-3 py-1.5 rounded-[10px] bg-[#FF6B9D] text-white text-[12px] font-semibold flex items-center gap-1"
              data-testid="button-invite-partner"
            >
              <UserPlus className="w-3 h-3" />
              상대방 초대
            </button>
          )}
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-3.5 py-2 rounded-[10px] bg-[#F2F4F6] text-[#4E5968] text-[13px] font-semibold flex items-center gap-1"
                data-testid="button-cancel-edit"
              >
                <X className="w-3 h-3" />
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-3.5 py-2 rounded-[10px] bg-[#333D4B] text-white text-[13px] font-semibold flex items-center gap-1"
                data-testid="button-save-edit"
              >
                <Check className="w-3 h-3" />
                저장
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F2F4F6] text-[#8B95A1] hover:bg-[#E5E8EB] transition-colors"
              data-testid="button-edit-profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showInvite && !isCoupled && (
        <div className="mb-5 p-4 bg-[#FFF0F5] rounded-[14px] border border-[#FFD6E7]">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-[#FF6B9D]" />
            <span className="text-[13px] font-bold text-[#191F28]">초대 링크</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${inviteCode}`}
              className="flex-1 text-[12px] bg-white rounded-lg px-3 py-2 border border-[#E5E8EB] text-[#4E5968]"
              data-testid="input-invite-link"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-lg bg-[#FF6B9D] text-white text-[12px] font-semibold flex items-center gap-1"
              data-testid="button-copy-invite"
            >
              <Copy className="w-3 h-3" />
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="text-[11px] text-[#8B95A1] mt-2">
            링크를 상대방에게 공유하면 함께 사용할 수 있어요
          </p>
        </div>
      )}

      {isCoupled && (
        <div className="mb-4 px-3 py-2 bg-[#FFF0F5] rounded-[10px] flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-[#FF6B9D]" fill="#FF6B9D" />
          <span className="text-[12px] text-[#FF6B9D] font-semibold">커플 연결 완료</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#F2F4F6] flex items-center justify-center overflow-hidden border-2 border-[#D1D6DB]">
              {myProfile.photo ? (
                <img src={myProfile.photo} alt={myProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#8B95A1]">{myProfile.name[0] || "?"}</span>
              )}
            </div>
            {isEditing && (
              <button data-testid="button-edit-my-photo" className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editMyName}
              onChange={(e) => setEditMyName(e.target.value)}
              className="mt-2.5 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-[#333D4B] bg-transparent focus:outline-none"
              data-testid="input-my-name-edit"
            />
          ) : (
            <span className="mt-2.5 text-[15px] font-bold text-[#191F28]" data-testid="text-my-name">{myProfile.name}</span>
          )}
          {isEditing ? (
            <div className="mt-1 w-32">
              <WheelDatePicker
                value={editMyBirthday}
                onChange={setEditMyBirthday}
                placeholder="생일 선택"
                className="!px-2 !py-1 !rounded-lg !text-[12px] !border-[#D1D6DB] text-center"
                label="생일"
              />
            </div>
          ) : (
            <span className="text-[12px] text-[#8B95A1] mt-0.5">
              {myProfile.birthday ? formatBirthdayDisplay(myProfile.birthday) : "생일 미입력"}
            </span>
          )}
        </div>

        <div className="flex flex-col items-center -mt-4">
          <div className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center" data-testid="icon-couple-heart">
            <Heart className="w-4 h-4 text-[#8B95A1]" />
          </div>
          <div className="mt-2 px-3 py-1.5 bg-[#F2F4F6] rounded-full" data-testid="text-dating-dday">
            <span className="text-[12px] font-bold text-[#4E5968]">D+{diffDays}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#F2F4F6] flex items-center justify-center overflow-hidden border-2 border-[#D1D6DB]">
              {partnerProfile.photo ? (
                <img src={partnerProfile.photo} alt={partnerProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#8B95A1]">{partnerProfile.name[0] || "?"}</span>
              )}
            </div>
            {isEditing && (
              <button data-testid="button-edit-partner-photo" className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editPartnerName}
              onChange={(e) => setEditPartnerName(e.target.value)}
              className="mt-2.5 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-[#333D4B] bg-transparent focus:outline-none"
              data-testid="input-partner-name-edit"
            />
          ) : (
            <span className="mt-2.5 text-[15px] font-bold text-[#191F28]" data-testid="text-partner-name">{partnerProfile.name}</span>
          )}
          {isEditing ? (
            <div className="mt-1 w-32">
              <WheelDatePicker
                value={editPartnerBirthday}
                onChange={setEditPartnerBirthday}
                placeholder="생일 선택"
                className="!px-2 !py-1 !rounded-lg !text-[12px] !border-[#D1D6DB] text-center"
                label="생일"
              />
            </div>
          ) : (
            <span className="text-[12px] text-[#8B95A1] mt-0.5">
              {partnerProfile.birthday ? formatBirthdayDisplay(partnerProfile.birthday) : "생일 미입력"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-[#F2F4F6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F2F4F6] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#4E5968]" />
            </div>
            <span className="text-[13px] text-[#8B95A1]">사귀기 시작한 날</span>
          </div>
          {isEditing ? (
            <div className="w-40">
              <WheelDatePicker
                value={editStartDate}
                onChange={setEditStartDate}
                placeholder="날짜 선택"
                className="!py-1.5 !text-[14px] !border-[#D1D6DB]"
                label="사귀기 시작한 날"
              />
            </div>
          ) : (
            <span className="text-[14px] font-medium text-[#191F28]">
              {startDate ? formatBirthdayDisplay(startDate) : "날짜 미입력"}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
