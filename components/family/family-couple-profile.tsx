"use client"

import { useState } from "react"
import { Heart, Edit2, Camera, Calendar } from "lucide-react"
import Image from "next/image"

export function FamilyCoupleProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profiles, setProfiles] = useState({
    me: {
      name: "현정",
      role: "아내",
      birthday: "1995.03.14",
      photo: "/placeholder.svg?height=120&width=120",
    },
    partner: {
      name: "주호",
      role: "남편",
      birthday: "1993.08.21",
      photo: "/placeholder.svg?height=120&width=120",
    },
  })

  // Calculate days together
  const weddingDate = new Date("2025-12-20")
  const today = new Date()
  const daysTogether = Math.floor((today.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <section className="bg-white rounded-[24px] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-[10px] transition-all ${
            isEditing
              ? "bg-green-500 text-white"
              : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditing ? "완료" : "편집"}
        </button>
      </div>

      {/* Couple Profiles */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* My Profile */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-pink-400">
              <Image
                src={profiles.me.photo || "/placeholder.svg"}
                alt={profiles.me.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.me.name}
              onChange={(e) => setProfiles({ ...profiles, me: { ...profiles.me, name: e.target.value } })}
              className="w-16 text-center text-[15px] font-bold border-b-2 border-pink-400 bg-transparent focus:outline-none"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">{profiles.me.name}</span>
          )}
          <span className="text-[12px] text-pink-500 font-medium">{profiles.me.role}</span>
        </div>

        {/* Heart Icon */}
        <div className="flex flex-col items-center -mt-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
        </div>

        {/* Partner Profile */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-blue-400">
              <Image
                src={profiles.partner.photo || "/placeholder.svg"}
                alt={profiles.partner.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.partner.name}
              onChange={(e) => setProfiles({ ...profiles, partner: { ...profiles.partner, name: e.target.value } })}
              className="w-16 text-center text-[15px] font-bold border-b-2 border-blue-400 bg-transparent focus:outline-none"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">{profiles.partner.name}</span>
          )}
          <span className="text-[12px] text-blue-500 font-medium">{profiles.partner.role}</span>
        </div>
      </div>

      {/* Couple Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-[16px] p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[16px] font-bold text-pink-500">{profiles.me.name}</span>
          <Heart className="w-4 h-4 text-green-500" fill="currentColor" />
          <span className="text-[16px] font-bold text-blue-500">{profiles.partner.name}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[13px] text-[#4E5968]">
          <Calendar className="w-4 h-4" />
          <span>2025.12.20 결혼</span>
          <span className="text-[#B0B8C1]">|</span>
          <span className="font-semibold text-green-600">D+{daysTogether}</span>
        </div>
      </div>

      {/* Birthday Info - Edit Mode */}
      {isEditing && (
        <div className="mt-4 pt-4 border-t border-[#F2F4F6] grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">{profiles.me.name} 생일</label>
            <input
              type="text"
              value={profiles.me.birthday}
              onChange={(e) => setProfiles({ ...profiles, me: { ...profiles.me, birthday: e.target.value } })}
              className="w-full px-3 py-2.5 text-[14px] bg-[#F2F4F6] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="YYYY.MM.DD"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">{profiles.partner.name} 생일</label>
            <input
              type="text"
              value={profiles.partner.birthday}
              onChange={(e) => setProfiles({ ...profiles, partner: { ...profiles.partner, birthday: e.target.value } })}
              className="w-full px-3 py-2.5 text-[14px] bg-[#F2F4F6] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="YYYY.MM.DD"
            />
          </div>
        </div>
      )}
    </section>
  )
}
