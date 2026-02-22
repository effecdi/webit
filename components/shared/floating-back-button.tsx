"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowLeft } from "lucide-react"

export function FloatingBackButton() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="fixed bottom-[30px] left-3 right-3 z-50 max-w-md mx-auto flex justify-start pointer-events-none">
      <button
        onClick={() => router.back()}
        data-testid="button-back-nav"
        className="w-[66px] h-[66px] rounded-full shadow-lg flex items-center justify-center flex-shrink-0 transition-transform duration-150 ease-out active:scale-[0.9] pointer-events-auto"
        style={{
          background: isDark ? "rgba(28, 28, 30, 0.88)" : "rgba(249, 250, 251, 0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderWidth: 1,
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(209,213,219,0.4)",
        }}
      >
        <ArrowLeft className="w-[22px] h-[22px]" style={{ color: isDark ? "#d1d5db" : "#191F28" }} />
      </button>
    </div>
  )
}
