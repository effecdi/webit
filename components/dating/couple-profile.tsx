"use client"

import { useState } from "react"
import { Heart, Camera, Edit2, Check } from "lucide-react"

interface ProfileData {
  name: string
  birthday: string
  photo: string | null
}

export function CoupleProfile() {
  const [myProfile, setMyProfile] = useState<ProfileData>({
    name: "현정",
    birthday: "1995.03.15",
    photo: null,
  })

  const [partnerProfile, setPartnerProfile] = useState<ProfileData>({
    name: "주호",
    birthday: "1993.08.22",
    photo: null,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [startDate] = useState("2025.02.05")
  
  // Calculate D+days
  const start = new Date(startDate.replace(/\./g, "-"))
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <section className="bg-white rounded-[20px] p-6 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isEditing ? "bg-[#FF8A80] text-white" : "bg-[#F2F4F6] text-[#8B95A1]"
          }`}
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Couple Profiles */}
      <div className="flex items-center justify-center gap-6">
        {/* My Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center overflow-hidden ring-3 ring-pink-200">
              {myProfile.photo ? (
                <img src={myProfile.photo || "/placeholder.svg"} alt={myProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-pink-400">{myProfile.name[0]}</span>
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
              value={myProfile.name}
              onChange={(e) => setMyProfile({ ...myProfile, name: e.target.value })}
              className="mt-3 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-[#FF8A80] bg-transparent focus:outline-none"
            />
          ) : (
            <span className="mt-3 text-[15px] font-bold text-[#191F28]">{myProfile.name}</span>
          )}
          <span className="text-[12px] text-[#8B95A1] mt-0.5">{myProfile.birthday}</span>
        </div>

        {/* Heart & D-day */}
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

        {/* Partner Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden ring-3 ring-blue-200">
              {partnerProfile.photo ? (
                <img src={partnerProfile.photo || "/placeholder.svg"} alt={partnerProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-blue-400">{partnerProfile.name[0]}</span>
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
              value={partnerProfile.name}
              onChange={(e) => setPartnerProfile({ ...partnerProfile, name: e.target.value })}
              className="mt-3 w-16 text-center text-[15px] font-bold text-[#191F28] border-b-2 border-blue-400 bg-transparent focus:outline-none"
            />
          ) : (
            <span className="mt-3 text-[15px] font-bold text-[#191F28]">{partnerProfile.name}</span>
          )}
          <span className="text-[12px] text-[#8B95A1] mt-0.5">{partnerProfile.birthday}</span>
        </div>
      </div>

      {/* Couple Name Badge */}
      <div className="mt-6 flex justify-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-50 via-white to-blue-50 rounded-full border border-[#F2F4F6]">
          <span className="text-[15px] font-bold text-pink-500">{myProfile.name}</span>
          <Heart className="w-4 h-4 text-[#FF8A80]" fill="currentColor" />
          <span className="text-[15px] font-bold text-blue-500">{partnerProfile.name}</span>
        </div>
      </div>

      {/* Anniversary Info */}
      <div className="mt-5 pt-5 border-t border-[#F2F4F6]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#8B95A1]">사귀기 시작한 날</span>
          {isEditing ? (
            <input
              type="text"
              value={startDate}
              className="text-[14px] font-medium text-[#191F28] text-right border-b border-[#E5E8EB] bg-transparent focus:outline-none focus:border-[#FF8A80] w-24"
            />
          ) : (
            <span className="text-[14px] font-medium text-[#191F28]">{startDate}</span>
          )}
        </div>
      </div>
    </section>
  )
}
