"use client"

import { useState, useEffect, use } from "react"
import { Heart, Sparkles, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface InviteData {
  inviterName: string | null
  mode: string
  status: string
}

const MODE_CONFIG = {
  dating: {
    label: "연애",
    welcomeAction: "행복한 연애",
    gradient: "from-pink-400 via-rose-400 to-pink-500",
    bgGradient: "from-pink-50 via-white to-rose-50",
    darkBgGradient: "dark:from-pink-950 dark:via-gray-950 dark:to-rose-950",
    iconColor: "text-pink-400",
    buttonBg: "bg-pink-500 hover:bg-pink-600",
    sparkleColor: "text-pink-300",
    redirectPath: "/dating",
  },
  wedding: {
    label: "결혼",
    welcomeAction: "행복한 결혼",
    gradient: "from-blue-400 via-indigo-400 to-blue-500",
    bgGradient: "from-blue-50 via-white to-indigo-50",
    darkBgGradient: "dark:from-blue-950 dark:via-gray-950 dark:to-indigo-950",
    iconColor: "text-blue-400",
    buttonBg: "bg-[#b455e0] hover:bg-[#9240b8]",
    sparkleColor: "text-blue-300",
    redirectPath: "/wedding",
  },
  family: {
    label: "가족",
    welcomeAction: "행복한 결혼생활",
    gradient: "from-green-400 via-emerald-400 to-green-500",
    bgGradient: "from-green-50 via-white to-emerald-50",
    darkBgGradient: "dark:from-green-950 dark:via-gray-950 dark:to-emerald-950",
    iconColor: "text-green-400",
    buttonBg: "bg-green-500 hover:bg-green-600",
    sparkleColor: "text-green-300",
    redirectPath: "/family",
  },
}

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState<"entering" | "visible" | "exiting">("entering")
  const [isAccepting, setIsAccepting] = useState(false)

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await fetch(`/api/couple-invite/lookup?code=${code}`)
        if (!res.ok) {
          setError("유효하지 않은 초대 코드입니다")
          setIsLoading(false)
          return
        }
        const data = await res.json()
        setInvite(data.invite)
      } catch {
        setError("초대 정보를 불러올 수 없습니다")
      } finally {
        setIsLoading(false)
      }
    }
    fetchInvite()
  }, [code])

  useEffect(() => {
    if (!invite) return
    const timer1 = setTimeout(() => setSplashPhase("visible"), 100)
    const timer2 = setTimeout(() => setSplashPhase("exiting"), 4000)
    const timer3 = setTimeout(() => setShowSplash(false), 4500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [invite])

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-pink-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !invite) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-[22px] font-bold text-[#191F28] dark:text-gray-100 mb-2">
          초대를 찾을 수 없어요
        </h1>
        <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 text-center mb-8">
          {error || "유효하지 않거나 만료된 초대 링크입니다"}
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#191F28] dark:bg-gray-700 text-white rounded-[14px] font-semibold flex items-center gap-2"
          data-testid="link-go-home"
        >
          <Home className="w-4 h-4" />
          홈으로 이동
        </Link>
      </div>
    )
  }

  const mode = (invite.mode as "dating" | "wedding" | "family") || "dating"
  const config = MODE_CONFIG[mode]
  const inviterName = invite.inviterName || "상대방"

  if (showSplash) {
    return (
      <div className={`min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b ${config.bgGradient} ${config.darkBgGradient} px-6 overflow-hidden`}>
        <div
          className={`flex flex-col items-center transition-all duration-700 ${
            splashPhase === "entering"
              ? "opacity-0 scale-90 translate-y-8"
              : splashPhase === "visible"
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4"
          }`}
        >
          <div className="relative mb-8">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
            <Sparkles className={`absolute -top-2 -right-2 w-7 h-7 ${config.sparkleColor} animate-pulse`} />
            <Sparkles className={`absolute -bottom-1 -left-3 w-5 h-5 ${config.sparkleColor} animate-pulse delay-300`} />
          </div>

          <p className="text-[20px] font-bold text-[#191F28] dark:text-gray-100 text-center leading-relaxed" data-testid="text-welcome-message">
            환영해요! {inviterName}님과의<br />
            {config.welcomeAction}을 위해<br />
            <span className={`${config.iconColor}`}>위브</span>가 도와줄게요!
          </p>
        </div>

        <div
          className={`absolute bottom-12 transition-all duration-500 delay-1000 ${
            splashPhase === "visible" ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[13px] text-[#B0B8C1] dark:text-gray-500 animate-pulse">
            잠시 후 이동합니다...
          </p>
        </div>

        <style jsx>{`
          .delay-300 { animation-delay: 300ms; }
        `}</style>
      </div>
    )
  }

  return (
    <div className={`min-h-dvh bg-gradient-to-b ${config.bgGradient} ${config.darkBgGradient} flex flex-col items-center justify-center px-6`}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-[24px] font-bold text-[#191F28] dark:text-gray-100 mb-2">
            WE:BEAT
          </h1>
          <p className="text-[15px] text-[#4E5968] dark:text-gray-300">
            {inviterName}님이 초대했어요
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-[20px] p-6 shadow-sm mb-5">
          <h2 className="text-[17px] font-bold text-[#191F28] dark:text-gray-100 mb-3">
            함께 시작해볼까요?
          </h2>
          <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 leading-relaxed mb-5">
            WE:BEAT에서 {inviterName}님과 함께 {config.welcomeAction}을 시작해보세요.
            일정 관리, 사진 공유, D-day 추적 등 다양한 기능이 준비되어 있어요.
          </p>

          <button
            onClick={async () => {
              if (isAccepting) return
              setIsAccepting(true)
              try {
                const res = await fetch("/api/invite/set-cookie", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code }),
                })
                if (!res.ok) {
                  setError("쿠키 설정에 실패했습니다. 다시 시도해주세요.")
                  setIsAccepting(false)
                  return
                }
                router.push("/login")
              } catch {
                setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
                setIsAccepting(false)
              }
            }}
            disabled={isAccepting}
            className={`w-full py-4 ${config.buttonBg} text-white font-bold rounded-[14px] transition-all flex items-center justify-center gap-2 text-[15px] disabled:opacity-60`}
            data-testid="button-accept-invite"
          >
            {isAccepting ? "이동 중..." : "초대 수락하기"}
            {!isAccepting && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-center text-[12px] text-[#B0B8C1] dark:text-gray-500">
          이미 계정이 있다면 로그인 후 자동으로 연결됩니다
        </p>
      </div>
    </div>
  )
}
