"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface RsvpData {
  name: string
  attendance: "confirmed" | "declined"
  mealType: "adult" | "child" | "none"
  side: "groom" | "bride"
  phone: string
  memo: string
}

export function RsvpFormSection() {
  const [formData, setFormData] = useState<RsvpData>({
    name: "",
    attendance: "confirmed",
    mealType: "adult",
    side: "groom",
    phone: "",
    memo: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("성함을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "default",
          name: formData.name.trim(),
          side: formData.side,
          attendance: formData.attendance,
          mealType: formData.mealType,
          phone: formData.phone.trim() || null,
          memo: formData.memo.trim() || null,
          relationship: "청첩장",
          giftAmount: 0,
          invitationSent: true,
        }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("RSVP submission failed:", error)
      alert("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-[#faf9f7] rounded-[20px] p-8 text-center my-10 mx-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-[18px] font-bold text-[#191F28] mb-2">참석 의사가 전달되었어요</h3>
        <p className="text-[14px] text-[#8B95A1] leading-relaxed">
          소중한 시간 내어주셔서 감사합니다.
          <br />
          {formData.attendance === "confirmed"
            ? "예식일에 뵙겠습니다."
            : "마음은 잘 전달되었습니다."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-[#f0ebe3] p-6 my-10 mx-4">
      <h3 className="text-[20px] font-bold text-[#3d3d3d] text-center mb-2" data-testid="text-rsvp-title">
        참석 의사 전달하기
      </h3>
      <p className="text-[13px] text-[#8b7355] text-center mb-6">
        축하하는 마음을 미리 전해주세요.
        <br />
        원활한 예식 진행에 큰 도움이 됩니다.
      </p>

      <div className="space-y-4">
        <div className="flex bg-[#F2F4F6] rounded-[12px] p-1">
          <button
            onClick={() => setFormData({...formData, side: "groom"})}
            className={`flex-1 py-3 rounded-[10px] text-[14px] font-medium transition-all ${
              formData.side === "groom" ? "bg-white text-blue-500 shadow-sm" : "text-[#8B95A1]"
            }`}
            data-testid="rsvp-side-groom"
          >
            신랑측 손님
          </button>
          <button
            onClick={() => setFormData({...formData, side: "bride"})}
            className={`flex-1 py-3 rounded-[10px] text-[14px] font-medium transition-all ${
              formData.side === "bride" ? "bg-white text-pink-500 shadow-sm" : "text-[#8B95A1]"
            }`}
            data-testid="rsvp-side-bride"
          >
            신부측 손님
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFormData({...formData, attendance: "confirmed"})}
            className={`flex-1 py-3.5 rounded-[12px] border transition-all font-medium text-[14px] ${
              formData.attendance === "confirmed"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-[#E5E8EB] bg-white text-[#4E5968]"
            }`}
            data-testid="rsvp-attend-yes"
          >
            참석할게요
          </button>
          <button
            onClick={() => setFormData({...formData, attendance: "declined"})}
            className={`flex-1 py-3.5 rounded-[12px] border transition-all font-medium text-[14px] ${
              formData.attendance === "declined"
                ? "border-[#FF6B6B] bg-red-50 text-[#FF6B6B]"
                : "border-[#E5E8EB] bg-white text-[#4E5968]"
            }`}
            data-testid="rsvp-attend-no"
          >
            마음만 보낼게요
          </button>
        </div>

        <div>
          <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">성함</label>
          <input
            type="text"
            placeholder="성함을 입력해주세요"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c]"
            data-testid="input-rsvp-name"
          />
        </div>

        {formData.attendance === "confirmed" && (
          <div>
            <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">식사 여부</label>
            <div className="flex gap-2">
              {([
                { value: "adult", label: "식사 (어른)" },
                { value: "child", label: "식사 (아동)" },
                { value: "none", label: "식사 안함" },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFormData({...formData, mealType: opt.value})}
                  className={`flex-1 py-2.5 rounded-[10px] border text-[13px] font-medium transition-all ${
                    formData.mealType === opt.value
                      ? "border-[#c9a86c] bg-[#faf5eb] text-[#8b7355]"
                      : "border-[#E5E8EB] bg-white text-[#8B95A1]"
                  }`}
                  data-testid={`rsvp-meal-${opt.value}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">연락처 (선택)</label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c]"
            data-testid="input-rsvp-phone"
          />
        </div>

        <div>
          <label className="text-[13px] text-[#8B95A1] mb-1.5 block ml-1">축하 메시지 (선택)</label>
          <textarea
            placeholder="신랑신부에게 전할 축하 메시지를 남겨주세요"
            rows={3}
            value={formData.memo}
            onChange={(e) => setFormData({...formData, memo: e.target.value})}
            className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[14px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#c9a86c] resize-none"
            data-testid="input-rsvp-memo"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-[#3d3d3d] text-white font-bold rounded-[14px] text-[16px] mt-2 hover:bg-[#191F28] transition-colors disabled:opacity-50"
          data-testid="button-rsvp-submit"
        >
          {isSubmitting ? "전송 중..." : "참석 의사 전달하기"}
        </button>
      </div>
    </div>
  )
}
