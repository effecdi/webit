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

  const weddingDate = new Date("2025-12-20")
  const today = new Date()
  const daysTogether = Math.floor((today.getTime() - weddingDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <section className="bg-white rounded-[24px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          data-testid="button-edit-family-profile"
          className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-[10px] transition-all ${
            isEditing
              ? "bg-[#333D4B] text-white"
              : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
          }`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditing ? "완료" : "편집"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-5 mb-5">
        <div className="flex flex-col items-center">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D1D6DB]">
              <Image
                src={profiles.me.photo || "/placeholder.svg"}
                alt={profiles.me.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button data-testid="button-edit-my-photo" className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] text-white rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.me.name}
              onChange={(e) => setProfiles({ ...profiles, me: { ...profiles.me, name: e.target.value } })}
              className="w-16 text-center text-[15px] font-bold border-b-2 border-[#333D4B] bg-transparent focus:outline-none text-[#191F28]"
              data-testid="input-family-my-name"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">{profiles.me.name}</span>
          )}
          <span className="text-[12px] text-[#8B95A1] font-medium mt-0.5">{profiles.me.role}</span>
        </div>

        <div className="flex flex-col items-center -mt-6">
          <div className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center" data-testid="icon-couple-heart">
            <Heart className="w-4 h-4 text-[#8B95A1]" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D1D6DB]">
              <Image
                src={profiles.partner.photo || "/placeholder.svg"}
                alt={profiles.partner.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button data-testid="button-edit-partner-photo" className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] text-white rounded-full flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.partner.name}
              onChange={(e) => setProfiles({ ...profiles, partner: { ...profiles.partner, name: e.target.value } })}
              className="w-16 text-center text-[15px] font-bold border-b-2 border-[#333D4B] bg-transparent focus:outline-none text-[#191F28]"
              data-testid="input-family-partner-name"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">{profiles.partner.name}</span>
          )}
          <span className="text-[12px] text-[#8B95A1] font-medium mt-0.5">{profiles.partner.role}</span>
        </div>
      </div>

      <div className="bg-[#F7F8FA] rounded-[14px] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5E8EB] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#4E5968]" />
            </div>
            <div>
              <p className="text-[11px] text-[#8B95A1] font-medium leading-tight">결혼기념일</p>
              <p className="text-[14px] font-semibold text-[#191F28]">2025.12.20</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-[#E5E8EB] rounded-full" data-testid="text-wedding-dday">
            <span className="text-[13px] font-bold text-[#333D4B]">D+{daysTogether}</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-[#F2F4F6] grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">{profiles.me.name} 생일</label>
            <input
              type="text"
              value={profiles.me.birthday}
              onChange={(e) => setProfiles({ ...profiles, me: { ...profiles.me, birthday: e.target.value } })}
              className="w-full px-3 py-2.5 text-[14px] bg-transparent border border-[#E5E8EB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#333D4B] text-[#191F28]"
              placeholder="YYYY.MM.DD"
              data-testid="input-family-my-birthday"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">{profiles.partner.name} 생일</label>
            <input
              type="text"
              value={profiles.partner.birthday}
              onChange={(e) => setProfiles({ ...profiles, partner: { ...profiles.partner, birthday: e.target.value } })}
              className="w-full px-3 py-2.5 text-[14px] bg-transparent border border-[#E5E8EB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#333D4B] text-[#191F28]"
              placeholder="YYYY.MM.DD"
              data-testid="input-family-partner-birthday"
            />
          </div>
        </div>
      )}
    </section>
  )
}
