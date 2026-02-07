"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/splash")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogin = () => {
    setIsRedirecting(true)
    window.location.href = "/api/login"
  }

  return (
    <main className="min-h-dvh bg-white flex flex-col px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-blue-500 fill-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-blue-500 tracking-tight mb-2">
            WE:VE
          </h1>
          <p className="text-[15px] text-[#8B95A1]">
            우리만의 특별한 순간을 시작해요
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleLogin}
            disabled={isRedirecting}
            className="w-full h-14 bg-[#3182F6] rounded-[16px] flex items-center justify-center gap-3 font-semibold text-white transition-all hover:bg-[#1B6CE7] active:scale-[0.98] disabled:opacity-70"
            data-testid="button-login"
          >
            {isRedirecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인 / 회원가입"
            )}
          </button>

          <p className="text-center text-[13px] text-[#8B95A1] mt-2">
            Google, Apple, GitHub 등으로 간편하게 시작하세요
          </p>
        </div>
      </div>

      <p className="text-center text-[12px] text-[#B0B8C1] mt-8">
        시작하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
      </p>
    </main>
  )
}
