"use client"

import { useState, useEffect } from "react"
import { Heart, Gem, Home, ChevronRight } from "lucide-react"
import Link from "next/link"

const statuses = [
  {
    id: "dating",
    label: "연애 중",
    icon: Heart,
    description: "설레는 우리의 시작",
    href: "/dating",
  },
  {
    id: "wedding",
    label: "결혼 준비",
    icon: Gem,
    description: "특별한 날을 향해",
    href: "/wedding",
  },
  {
    id: "family",
    label: "부부 · 가족",
    icon: Home,
    description: "함께하는 일상",
    href: "/family",
  },
]

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [myName, setMyName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [daysTogether, setDaysTogether] = useState(0)

  useEffect(() => {
    setMounted(true)
    setMyName(localStorage.getItem("survey_myName") || "")
    setPartnerName(localStorage.getItem("survey_partnerName") || "")
    const days = localStorage.getItem("survey_daysTogether")
    if (days) setDaysTogether(parseInt(days))
  }, [])

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <section className="pt-6 pb-8 px-5 bg-white">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-500 tracking-tight">
            WE:VE
          </h1>
        </div>

        <div 
          className={`relative mx-auto w-48 h-48 transition-all duration-700 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="w-full h-full rounded-[32px] overflow-hidden bg-gradient-to-br from-blue-100 to-pink-100">
            <img
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80"
              alt="Couple"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
        </div>

        <div 
          className={`mt-8 text-center transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {myName && partnerName ? (
            <>
              <p className="text-[15px] text-[#8B95A1] mb-2">
                {myName} ❤ {partnerName}
              </p>
              {daysTogether > 0 && (
                <p className="text-[17px] font-semibold text-blue-500 mb-4">
                  함께한 지 {daysTogether.toLocaleString()}일
                </p>
              )}
            </>
          ) : null}
          <h2 className="text-[28px] font-extrabold text-[#191F28] leading-tight whitespace-pre-line">
            {"반가워요!\n어떤 단계인가요?"}
          </h2>
          <p className="mt-3 text-[15px] text-[#8B95A1] font-light">
            우리 커플에게 딱 맞는 정보를 드릴게요
          </p>
        </div>
      </section>

      <section className="flex-1 px-5 py-6 bg-white">
        <div className="flex flex-col gap-3">
          {statuses.map((status) => {
            const Icon = status.icon
            const isSelected = selectedStatus === status.id

            return (
              <Link
                key={status.id}
                href={status.href}
                onClick={() => setSelectedStatus(status.id)}
                data-testid={`card-status-${status.id}`}
                className={`group relative bg-[#F3F5F7] rounded-[32px] p-6
                  transition-all duration-200 ease-out
                  hover:bg-[#EBEEF1] active:scale-[0.98]
                  ${isSelected ? "ring-2 ring-blue-500" : ""}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-7 h-7 text-blue-500" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[17px] font-bold text-[#191F28]">
                      {status.label}
                    </h3>
                    <p className="text-[14px] text-[#8B95A1] mt-0.5">
                      {status.description}
                    </p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-[#B0B8C1] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
