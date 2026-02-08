"use client"

import { useState, useEffect, use } from "react"
import { InvitationPreview } from "@/components/invitation-preview"
import { RsvpFormSection } from "@/components/wedding/rsvp-form"
import type { InvitationData } from "@/app/wedding/editor/page"

export default function SharedInvitationPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = use(params)
  const [data, setData] = useState<(InvitationData & { date?: string; time?: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [textScale, setTextScale] = useState(1)

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        const res = await fetch(`/api/shared/invitation?id=${shareId}`)
        if (!res.ok) {
          setLoading(false)
          return
        }
        const json = await res.json()
        if (json) {
          const invData = json as InvitationData
          let dateStr = ""
          let timeStr = ""

          if (invData.weddingDate) {
            const d = new Date(invData.weddingDate)
            const year = d.getFullYear()
            const month = d.getMonth() + 1
            const day = d.getDate()
            const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
            const weekday = weekdays[d.getDay()]
            dateStr = `${year}년 ${month}월 ${day}일 ${weekday}요일`
          }

          if (invData.ampm && invData.hour && invData.minute) {
            timeStr = `${invData.ampm} ${invData.hour}시 ${invData.minute}분`
          }

          setData({ ...invData, date: dateStr, time: timeStr })
        }
      } catch (error) {
        console.error("Failed to load invitation:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#c9a86c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-[#8b7355]">청첩장을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#3d3d3d] mb-2">청첩장을 찾을 수 없어요</p>
          <p className="text-[14px] text-[#8b7355]">링크를 다시 확인해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <InvitationPreview
        data={data}
        isShared={true}
        textScale={textScale}
        onTextScaleChange={setTextScale}
        shareId={shareId}
      />
      <div className="max-w-[360px] mx-auto pb-10" style={textScale !== 1 ? { zoom: textScale } : undefined}>
        <RsvpFormSection />
      </div>
    </div>
  )
}
