"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/splash")
    }
  }, [isLoading, isAuthenticated, router])

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider)
    window.location.href = `/api/auth/${provider}`
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
            onClick={() => handleSocialLogin("kakao")}
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
            onClick={() => handleSocialLogin("google")}
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

          <button
            onClick={() => handleSocialLogin("apple")}
            disabled={loadingProvider !== null}
            className="w-full h-14 bg-black rounded-[16px] flex items-center justify-center gap-3 font-semibold text-white transition-all hover:bg-[#1a1a1a] active:scale-[0.98] disabled:opacity-70"
            data-testid="button-login-apple"
          >
            {loadingProvider === "apple" ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple로 시작하기
              </>
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-[12px] text-[#B0B8C1] mt-8">
        시작하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
      </p>
    </main>
  )
}
