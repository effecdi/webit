"use client"

import { useState, useEffect } from "react"
import { Heart, Camera, Edit2, Check, Calendar } from "lucide-react"
import WheelDatePicker from "@/components/ui/wheel-date-picker"

interface ProfileData {
  name: string
  birthday: string
  photo: string | null
}

const formatBirthdayDisplay = (dateStr: string): string => {
  if (!dateStr) return ""
  const parts = dateStr.split("-")
  if (parts.length !== 3) return dateStr
  return `${parts[0]}.${parts[1]}.${parts[2]}`
}

const formatBirthdayForInput = (displayStr: string): string => {
  if (!displayStr) return ""
  return displayStr.replace(/\./g, "-")
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

  const [startDate, setStartDate] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editMyName, setEditMyName] = useState("")
  const [editPartnerName, setEditPartnerName] = useState("")
  const [editMyBirthday, setEditMyBirthday] = useState("")
  const [editPartnerBirthday, setEditPartnerBirthday] = useState("")
  const [editStartDate, setEditStartDate] = useState("")
  const [diffDays, setDiffDays] = useState(0)

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "나"
    const partnerName = localStorage.getItem("survey_partnerName") || "상대"
    const myBirthday = localStorage.getItem("survey_myBirthday") || ""
    const partnerBirthday = localStorage.getItem("survey_partnerBirthday") || ""
    const savedStartDate = localStorage.getItem("survey_firstMeetDate") || ""

    setMyProfile({
      name: myName,
      birthday: myBirthday,
      photo: null,
    })
    setPartnerProfile({
      name: partnerName,
      birthday: partnerBirthday,
      photo: null,
    })
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
  }, [])

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

  return (
    <section className="bg-white rounded-[20px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[13px] font-medium"
              data-testid="button-cancel-edit"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-full bg-pink-500 text-white text-[13px] font-medium flex items-center gap-1"
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

      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden ring-3 ring-pink-200">
              {myProfile.photo ? (
                <img src={myProfile.photo || "/placeholder.svg"} alt={myProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-pink-400">{myProfile.name[0] || "?"}</span>
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#FF8A80] rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editMyName}
              onChange={(e) => setEditMyName(e.target.value)}
              className="mt-3 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-[#FF8A80] bg-transparent focus:outline-none"
              data-testid="input-my-name-edit"
            />
          ) : (
            <span className="mt-3 text-[15px] font-bold text-[#191F28]">{myProfile.name}</span>
          )}
          {isEditing ? (
            <div className="mt-1 w-32">
              <WheelDatePicker
                value={editMyBirthday}
                onChange={setEditMyBirthday}
                placeholder="생일 선택"
                className="!px-2 !py-1 !rounded-lg !text-[12px] !border-pink-200 text-center"
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
          <div className="relative">
            <Heart className="w-12 h-12 text-[#FF8A80]" fill="currentColor" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">LOVE</span>
            </div>
          </div>
          <div className="mt-2 px-3 py-1 bg-[#FFF0EE] rounded-full">
            <span className="text-[12px] font-bold text-[#FF8A80]">D+{diffDays}</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ring-3 ring-blue-200">
              {partnerProfile.photo ? (
                <img src={partnerProfile.photo || "/placeholder.svg"} alt={partnerProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-blue-400">{partnerProfile.name[0] || "?"}</span>
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editPartnerName}
              onChange={(e) => setEditPartnerName(e.target.value)}
              className="mt-3 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-blue-400 bg-transparent focus:outline-none"
              data-testid="input-partner-name-edit"
            />
          ) : (
            <span className="mt-3 text-[15px] font-bold text-[#191F28]">{partnerProfile.name}</span>
          )}
          {isEditing ? (
            <div className="mt-1 w-32">
              <WheelDatePicker
                value={editPartnerBirthday}
                onChange={setEditPartnerBirthday}
                placeholder="생일 선택"
                className="!px-2 !py-1 !rounded-lg !text-[12px] !border-blue-200 text-center"
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

      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-white to-blue-50 rounded-full border border-[#F2F4F6]">
          <span className="text-[15px] font-bold text-pink-500">{myProfile.name}</span>
          <Heart className="w-4 h-4 text-[#FF8A80]" fill="currentColor" />
          <span className="text-[15px] font-bold text-blue-500">{partnerProfile.name}</span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-[#F2F4F6]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#8B95A1]">사귀기 시작한 날</span>
          {isEditing ? (
            <div className="w-40">
              <WheelDatePicker
                value={editStartDate}
                onChange={setEditStartDate}
                placeholder="날짜 선택"
                className="!py-1.5 !text-[14px] !border-pink-200"
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
