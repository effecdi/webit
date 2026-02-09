"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Heart, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const MODE_CONFIG = {
  dating: {
    label: "연애",
    welcomeAction: "행복한 연애",
    gradient: "from-pink-400 via-rose-400 to-pink-500",
    bgGradient: "from-pink-50 via-white to-rose-50",
    darkBgGradient: "dark:from-pink-950 dark:via-gray-950 dark:to-rose-950",
    iconColor: "text-pink-400",
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
    sparkleColor: "text-green-300",
    redirectPath: "/family",
  },
}

function InviteWelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  const [inviteData, setInviteData] = useState<{
    mode: string
    inviterName: string
  } | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [splashPhase, setSplashPhase] = useState<"loading" | "entering" | "visible" | "exiting">("loading")

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    if (!code) {
      router.push("/splash")
      return
    }
    acceptInvite()
  }, [authLoading, isAuthenticated, code])

  const clearInviteCookie = () => {
    document.cookie = "pending_invite_code=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }

  const acceptInvite = async () => {
    if (!code || isAccepting) return
    setIsAccepting(true)

    try {
      const res = await fetch("/api/couple-invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error === "Invite already accepted") {
          const lookupRes = await fetch(`/api/couple-invite/lookup?code=${code}`)
          if (lookupRes.ok) {
            const lookupData = await lookupRes.json()
            const invite = lookupData.invite
            setInviteData({
              mode: invite.mode,
              inviterName: invite.inviterName || "상대방",
            })
            setAccepted(true)
            return
          }
        }
        clearInviteCookie()
        setError(data.error || "초대를 수락할 수 없습니다")
        return
      }

      const data = await res.json()
      setInviteData({
        mode: data.invite.mode,
        inviterName: data.invite.inviterName,
      })
      setAccepted(true)
    } catch {
      clearInviteCookie()
      setError("초대를 수락하는 중 오류가 발생했습니다")
    } finally {
      setIsAccepting(false)
    }
  }

  useEffect(() => {
    if (!accepted || !inviteData) return

    clearInviteCookie()

    const mode = inviteData.mode as "dating" | "wedding" | "family"
    const config = MODE_CONFIG[mode] || MODE_CONFIG.dating

    if (user?.firstName) {
      localStorage.setItem("survey_myName", user.firstName)
    }
    localStorage.setItem("selected_mode", mode)
    localStorage.setItem("survey_partnerName", inviteData.inviterName)
    localStorage.setItem("invite_accepted", "true")

    setSplashPhase("entering")
    const t1 = setTimeout(() => setSplashPhase("visible"), 100)
    const t2 = setTimeout(() => setSplashPhase("exiting"), 4000)
    const t3 = setTimeout(() => {
      router.push(config.redirectPath)
    }, 4800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [accepted, inviteData, user, router])

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-[22px] font-bold text-[#191F28] dark:text-gray-100 mb-2" data-testid="text-invite-error-title">
          초대를 수락할 수 없어요
        </h1>
        <p className="text-[14px] text-[#8B95A1] dark:text-gray-400 text-center mb-8" data-testid="text-invite-error-msg">
          {error}
        </p>
        <button
          onClick={() => router.push("/splash")}
          className="px-6 py-3 bg-[#191F28] dark:bg-gray-700 text-white rounded-[14px] font-semibold"
          data-testid="button-go-splash"
        >
          홈으로 이동
        </button>
      </div>
    )
  }

  if (!accepted || !inviteData || splashPhase === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-[14px] text-[#8B95A1] dark:text-gray-400">초대를 수락하는 중...</p>
        </div>
      </div>
    )
  }

  const mode = (inviteData.mode as "dating" | "wedding" | "family") || "dating"
  const config = MODE_CONFIG[mode]

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
          <Sparkles className={`absolute -bottom-1 -left-3 w-5 h-5 ${config.sparkleColor} animate-pulse`} style={{ animationDelay: "300ms" }} />
        </div>

        <p className="text-[20px] font-bold text-[#191F28] dark:text-gray-100 text-center leading-relaxed" data-testid="text-welcome-message">
          환영해요! {inviteData.inviterName}님과의<br />
          {config.welcomeAction}을 위해<br />
          <span className={config.iconColor}>위브</span>가 도와줄게요!
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
    </div>
  )
}

export default function InviteWelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <InviteWelcomeContent />
    </Suspense>
  )
}
