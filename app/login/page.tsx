"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Heart, Check, ChevronRight, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { BottomSheet } from "@/components/ui/bottom-sheet"

const CONSENT_ITEMS = [
  {
    id: "terms",
    label: "서비스 이용약관 동의",
    required: true,
    content: "WE:BEAT 서비스 이용약관에 동의합니다. 본 약관은 WE:BEAT 서비스의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임 사항 등을 규정합니다. 서비스 이용 중 발생하는 모든 사항은 본 약관에 따릅니다.",
  },
  {
    id: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    content: "WE:BEAT는 서비스 제공을 위해 다음 개인정보를 수집합니다: 이름, 이메일, 프로필 사진, 소셜 로그인 정보. 수집된 개인정보는 서비스 운영, 본인 확인, 고객 상담 등에 활용되며, 회원 탈퇴 시 즉시 파기됩니다.",
  },
  {
    id: "age",
    label: "만 14세 이상 확인",
    required: true,
    content: "본 서비스는 만 14세 이상의 사용자만 이용할 수 있습니다. 만 14세 미만의 아동은 법정 대리인의 동의 없이 서비스를 이용할 수 없습니다.",
  },
  {
    id: "marketing",
    label: "마케팅 정보 수신 동의",
    required: false,
    content: "WE:BEAT의 신규 기능, 이벤트, 프로모션 등의 마케팅 정보를 이메일, 푸시 알림 등으로 수신합니다. 수신 동의는 언제든지 설정에서 변경할 수 있습니다.",
  },
]

function getInviteCode(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)pending_invite_code=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [showConsent, setShowConsent] = useState(false)
  const [pendingProvider, setPendingProvider] = useState<string | null>(null)
  const [consents, setConsents] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    age: false,
    marketing: false,
  })
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const inviteCode = getInviteCode()
      if (inviteCode) {
        router.push(`/invite-welcome?code=${inviteCode}`)
      } else {
        router.push("/splash")
      }
    }
  }, [isLoading, isAuthenticated, router])

  const allRequiredChecked = CONSENT_ITEMS
    .filter((item) => item.required)
    .every((item) => consents[item.id])

  const allChecked = CONSENT_ITEMS.every((item) => consents[item.id])

  const handleToggleAll = () => {
    const newValue = !allChecked
    const newConsents: Record<string, boolean> = {}
    CONSENT_ITEMS.forEach((item) => {
      newConsents[item.id] = newValue
    })
    setConsents(newConsents)
  }

  const handleToggle = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLoginClick = (provider: string) => {
    setPendingProvider(provider)
    setShowConsent(true)
  }

  const handleConsentConfirm = () => {
    if (!allRequiredChecked || !pendingProvider) return
    setShowConsent(false)
    if (pendingProvider === "dev") {
      handleDevLogin()
    } else {
      handleSocialLogin(pendingProvider)
    }
  }

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider)
    window.location.href = `/api/auth/${provider}`
  }

  const handleDevLogin = async () => {
    setLoadingProvider("dev")
    try {
      const res = await fetch("/api/auth/dev-login", { method: "POST" })
      if (res.ok) {
        const inviteCode = getInviteCode()
        if (inviteCode) {
          window.location.href = `/invite-welcome?code=${inviteCode}`
        } else {
          window.location.href = "/splash"
        }
      } else {
        setLoadingProvider(null)
      }
    } catch {
      setLoadingProvider(null)
    }
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[#d63bf2] fill-[#d63bf2]" />
          </div>
          <h1 className="text-3xl font-bold text-[#d63bf2] tracking-tight mb-2">
            WE:BEAT
          </h1>
          <p className="text-[15px] text-[#8B95A1]">
            우리만의 특별한 순간을 시작해요
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => handleLoginClick("dev")}
            disabled={loadingProvider !== null}
            className="w-full h-14 bg-[#d63bf2] rounded-[16px] flex items-center justify-center gap-3 font-semibold text-white transition-all hover:bg-[#a82cbf] active:scale-[0.98] disabled:opacity-70"
            data-testid="button-login-dev"
          >
            {loadingProvider === "dev" ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white" />
                바로 시작하기
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#E5E8EB]" />
            <span className="text-xs text-[#B0B8C1]">소셜 로그인</span>
            <div className="flex-1 h-px bg-[#E5E8EB]" />
          </div>

          <button
            onClick={() => handleLoginClick("kakao")}
            disabled={loadingProvider !== null}
            className="w-full h-14 bg-[#FEE500] rounded-[16px] flex items-center justify-center gap-3 font-semibold text-[#191919] transition-all hover:bg-[#F5DC00] active:scale-[0.98] disabled:opacity-70"
            data-testid="button-login-kakao"
          >
            {loadingProvider === "kakao" ? (
              <div className="w-5 h-5 border-2 border-[#191919] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.74 4.93 4.36 6.24-.14.52-.9 3.36-.93 3.58 0 0-.02.16.08.22.1.06.22.02.22.02.29-.04 3.36-2.2 3.9-2.58.76.1 1.56.16 2.37.16 5.52 0 10-3.36 10-7.64C22 6.36 17.52 3 12 3Z" fill="#191919"/>
                </svg>
                카카오로 시작하기
              </>
            )}
          </button>

          <button
            onClick={() => handleLoginClick("google")}
            disabled={loadingProvider !== null}
            className="w-full h-14 bg-white border-2 border-[#E5E8EB] rounded-[16px] flex items-center justify-center gap-3 font-semibold text-[#191919] transition-all hover:bg-[#F9FAFB] active:scale-[0.98] disabled:opacity-70"
            data-testid="button-login-google"
          >
            {loadingProvider === "google" ? (
              <div className="w-5 h-5 border-2 border-[#191919] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google로 시작하기
              </>
            )}
          </button>

        </div>
      </div>

      <p className="text-center text-[12px] text-[#B0B8C1] mt-8">
        시작하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
      </p>

      <BottomSheet
        open={showConsent}
        onOpenChange={(open) => { if (!open) { setShowConsent(false); setPendingProvider(null) } }}
        className="bg-white z-[60]"
        overlayClassName="z-[60]"
      >
            <div className="px-6 pb-2">
              <h3 className="text-[20px] font-bold text-[#191F28] mb-1">
                서비스 이용 동의
              </h3>
              <p className="text-[14px] text-[#8B95A1]">
                WE:BEAT 서비스 이용을 위해 약관에 동의해주세요
              </p>
            </div>

            <div className="px-6 py-3">
              <button
                onClick={handleToggleAll}
                data-testid="button-consent-all"
                className="w-full flex items-center gap-3 py-4 px-4 bg-[#F8F9FA] rounded-[16px] mb-4"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    allChecked
                      ? "bg-[#d63bf2]"
                      : "bg-white border-2 border-[#D1D6DB]"
                  }`}
                >
                  {allChecked && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-[16px] font-bold text-[#191F28]">
                  전체 동의하기
                </span>
              </button>

              <div className="space-y-1">
                {CONSENT_ITEMS.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-3 py-3">
                      <button
                        onClick={() => handleToggle(item.id)}
                        data-testid={`button-consent-${item.id}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            consents[item.id]
                              ? "bg-[#d63bf2]"
                              : "bg-white border-2 border-[#D1D6DB]"
                          }`}
                        >
                          {consents[item.id] && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-[14px] text-[#191F28] text-left">
                          <span className={`${item.required ? "text-[#d63bf2]" : "text-[#8B95A1]"} text-[13px] mr-1`}>
                            {item.required ? "[필수]" : "[선택]"}
                          </span>
                          {item.label}
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setExpandedItem(
                            expandedItem === item.id ? null : item.id
                          )
                        }
                        data-testid={`button-consent-detail-${item.id}`}
                        className="shrink-0 p-1"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-[#B0B8C1] transition-transform ${
                            expandedItem === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {expandedItem === item.id && (
                      <div className="ml-8 mr-2 mb-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                        <p className="text-[13px] text-[#4E5968] leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-8 pt-2">
              <button
                onClick={handleConsentConfirm}
                disabled={!allRequiredChecked}
                data-testid="button-consent-confirm"
                className={`w-full h-14 rounded-[16px] flex items-center justify-center font-semibold text-[16px] transition-all active:scale-[0.98] ${
                  allRequiredChecked
                    ? "bg-[#d63bf2] text-white"
                    : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                }`}
              >
                동의하고 계속하기
              </button>
            </div>
      </BottomSheet>
    </main>
  )
}
