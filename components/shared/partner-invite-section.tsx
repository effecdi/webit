"use client"

import { useState, useEffect, useCallback } from "react"
import { UserPlus, Copy, Check, Share2, MessageCircle, Link2, X } from "lucide-react"
import { BottomSheet } from "@/components/ui/bottom-sheet"

interface PartnerInviteSectionProps {
  mode: "dating" | "wedding" | "family"
  myName?: string
}

const MODE_CONFIG = {
  dating: {
    label: "연애",
    gradient: "from-pink-50 to-rose-50",
    gradientDark: "dark:from-pink-950/30 dark:to-rose-950/30",
    accentColor: "text-pink-500",
    accentBg: "bg-pink-500",
    buttonBg: "bg-pink-500 hover:bg-pink-600",
    lightBg: "bg-pink-50",
    lightBgDark: "dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
    welcomeMessage: "행복한 연애",
  },
  wedding: {
    label: "결혼",
    gradient: "from-blue-50 to-indigo-50",
    gradientDark: "dark:from-blue-950/30 dark:to-indigo-950/30",
    accentColor: "text-blue-500",
    accentBg: "bg-blue-500",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
    lightBg: "bg-blue-50",
    lightBgDark: "dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    welcomeMessage: "행복한 결혼",
  },
  family: {
    label: "가족",
    gradient: "from-green-50 to-emerald-50",
    gradientDark: "dark:from-green-950/30 dark:to-emerald-950/30",
    accentColor: "text-green-500",
    accentBg: "bg-green-500",
    buttonBg: "bg-green-500 hover:bg-green-600",
    lightBg: "bg-green-50",
    lightBgDark: "dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    welcomeMessage: "행복한 결혼생활",
  },
}

export function PartnerInviteSection({ mode, myName }: PartnerInviteSectionProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const config = MODE_CONFIG[mode]

  const inviteUrl = inviteCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteCode}`
    : ""

  const generateInviteCode = useCallback(async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const name = myName || localStorage.getItem("survey_myName") || ""
      const res = await fetch("/api/couple-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterName: name, mode }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          setErrorMsg("로그인이 필요합니다")
        } else {
          setErrorMsg("초대 코드 생성에 실패했습니다. 다시 시도해주세요.")
        }
        return
      }
      const data = await res.json()
      if (data.invite) {
        setInviteCode(data.invite.inviteCode)
      }
    } catch (error) {
      console.error("Failed to generate invite code:", error)
      setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }, [mode, myName])

  useEffect(() => {
    const fetchExistingInvite = async () => {
      try {
        const res = await fetch("/api/couple-invite")
        const data = await res.json()
        if (data.invites) {
          const pending = data.invites.find(
            (inv: any) => inv.mode === mode && inv.status === "pending"
          )
          if (pending) {
            setInviteCode(pending.inviteCode)
          }
        }
      } catch (error) {
        console.error("Failed to fetch invites:", error)
      }
    }
    fetchExistingInvite()
  }, [mode])

  const handleCopyLink = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = inviteUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKakaoShare = () => {
    const w = window as any
    if (!w.Kakao) {
      alert("카카오 SDK를 로딩 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (kakaoKey && !w.Kakao.isInitialized()) {
      w.Kakao.init(kakaoKey)
    }

    const senderName = myName || localStorage.getItem("survey_myName") || "상대방"

    w.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "WE:BEAT - 커플 초대",
        description: `환영해요! ${senderName}님과의 ${config.welcomeMessage}을 위해 위브가 도와줄게요!`,
        imageUrl: `${window.location.origin}/og-image.png`,
        link: {
          mobileWebUrl: inviteUrl,
          webUrl: inviteUrl,
        },
      },
      buttons: [
        {
          title: "초대 수락하기",
          link: {
            mobileWebUrl: inviteUrl,
            webUrl: inviteUrl,
          },
        },
      ],
    })

    setShowShareModal(false)
  }

  const handleNativeShare = async () => {
    const senderName = myName || localStorage.getItem("survey_myName") || "상대방"
    if (navigator.share) {
      try {
        await navigator.share({
          title: "WE:BEAT - 커플 초대",
          text: `${senderName}님이 WE:BEAT에서 함께하자고 초대했어요!`,
          url: inviteUrl,
        })
      } catch {}
    }
    setShowShareModal(false)
  }

  if (!inviteCode) {
    return (
      <section className={`bg-gradient-to-r ${config.gradient} ${config.gradientDark} rounded-[20px] p-5 shadow-sm`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full ${config.lightBg} ${config.lightBgDark} flex items-center justify-center`}>
            <UserPlus className={`w-5 h-5 ${config.accentColor}`} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">상대방 초대하기</h3>
            <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">함께 사용할 상대방을 초대해보세요</p>
          </div>
        </div>
        {errorMsg && (
          <p className="text-[13px] text-red-500 dark:text-red-400 mb-2" data-testid="text-invite-error">{errorMsg}</p>
        )}
        <button
          onClick={generateInviteCode}
          disabled={isLoading}
          className={`w-full py-3.5 ${config.buttonBg} text-white font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
          data-testid="button-generate-invite"
        >
          <UserPlus className="w-4 h-4" />
          {isLoading ? "생성 중..." : "초대 코드 생성하기"}
        </button>
      </section>
    )
  }

  return (
    <>
      <section className={`bg-gradient-to-r ${config.gradient} ${config.gradientDark} rounded-[20px] p-5 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.lightBg} ${config.lightBgDark} flex items-center justify-center`}>
              <UserPlus className={`w-5 h-5 ${config.accentColor}`} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">상대방 초대하기</h3>
              <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">초대 링크를 공유해보세요</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/50 rounded-[14px] p-4 mb-3">
          <p className="text-[11px] text-[#8B95A1] dark:text-gray-400 mb-1.5">초대 코드</p>
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold tracking-widest text-[#191F28] dark:text-gray-100" data-testid="text-invite-code">
              {inviteCode}
            </span>
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium flex items-center gap-1 transition-all ${
                copied
                  ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                  : `${config.lightBg} ${config.lightBgDark} ${config.accentColor}`
              }`}
              data-testid="button-copy-invite-link"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  링크 복사
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className={`w-full py-3.5 ${config.buttonBg} text-white font-semibold rounded-[14px] transition-all flex items-center justify-center gap-2`}
          data-testid="button-share-invite"
        >
          <Share2 className="w-4 h-4" />
          초대 링크 공유하기
        </button>
      </section>

      <BottomSheet open={showShareModal} onOpenChange={setShowShareModal} className="bg-white dark:bg-gray-900 z-[60]" overlayClassName="z-[60]">
        <div className="px-5 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-bold text-[#191F28] dark:text-gray-100">공유 방법 선택</h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              data-testid="button-close-share-modal"
            >
              <X className="w-5 h-5 text-[#8B95A1]" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleKakaoShare}
              className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#FEE500] hover:bg-[#FDD800] transition-colors"
              data-testid="button-share-kakao"
            >
              <div className="w-12 h-12 rounded-full bg-[#3C1E1E] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#FEE500]" />
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-[#3C1E1E]">카카오톡으로 공유</p>
                <p className="text-[12px] text-[#3C1E1E]/60">카카오톡 채팅으로 초대 링크를 보냅니다</p>
              </div>
            </button>

            <button
              onClick={() => {
                handleCopyLink()
                setShowShareModal(false)
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#F2F4F6] dark:bg-gray-800 hover:bg-[#E5E8EB] dark:hover:bg-gray-700 transition-colors"
              data-testid="button-share-copy-link"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-[#4E5968] dark:text-gray-300" />
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">링크 복사</p>
                <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">초대 링크를 클립보드에 복사합니다</p>
              </div>
            </button>

            {typeof window !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#F2F4F6] dark:bg-gray-800 hover:bg-[#E5E8EB] dark:hover:bg-gray-700 transition-colors"
                data-testid="button-share-native"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-[#4E5968] dark:text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">다른 앱으로 공유</p>
                  <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">기기의 공유 기능을 사용합니다</p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="h-10" />
      </BottomSheet>
    </>
  )
}
