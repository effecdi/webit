"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import splashLogo from "@/attached_assets/webeat.logo_1770644808504.png"
import Image from "next/image"

export default function SplashPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth()
  const [fadeOut, setFadeOut] = useState(false)
  const hasNavigated = useRef(false)
  const mountTime = useRef(Date.now())

  useEffect(() => {
    if (isLoading || hasNavigated.current) return

    const navigate = () => {
      if (hasNavigated.current) return
      hasNavigated.current = true

      if (!isAuthenticated) {
        router.replace("/login")
        return
      }

      const inviteCookieMatch = document.cookie.match(/(?:^|;\s*)pending_invite_code=([^;]*)/)
      if (inviteCookieMatch) {
        const inviteCode = decodeURIComponent(inviteCookieMatch[1])
        router.replace(`/invite-welcome?code=${inviteCode}`)
        return
      }

      const hasCompletedSurvey = localStorage.getItem("survey_myName")
      const selectedMode = localStorage.getItem("selected_mode")

      if (user?.firstName && !hasCompletedSurvey) {
        localStorage.setItem("survey_myName", user.firstName)
      }

      if (hasCompletedSurvey && selectedMode) {
        if (selectedMode === "wedding") {
          const weddingDate = localStorage.getItem("wedding_date")
          if (weddingDate) {
            const target = new Date(weddingDate)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            target.setHours(0, 0, 0, 0)
            const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            if (diff < 0) {
              localStorage.setItem("selected_mode", "family")
              localStorage.setItem("family_transition_pending", "true")
              router.replace("/family")
              return
            }
          }
          router.replace("/wedding")
        } else if (selectedMode === "dating") {
          router.replace("/dating")
        } else if (selectedMode === "family") {
          router.replace("/family")
        } else {
          router.replace("/dating")
        }
      } else if (hasCompletedSurvey) {
        router.replace("/dating")
      } else {
        router.replace("/survey/step1")
      }
    }

    const elapsed = Date.now() - mountTime.current
    const minSplashTime = 1800
    const remaining = Math.max(0, minSplashTime - elapsed)

    const fadeTimer = setTimeout(() => setFadeOut(true), Math.max(0, remaining - 500))
    const navigateTimer = setTimeout(navigate, remaining)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(navigateTimer)
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <AnimatePresence>
      <motion.main
        className="min-h-dvh bg-[#d63bf2] flex items-center justify-center"
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={splashLogo}
                alt="WE:BEAT"
                width={80}
                height={80}
                priority
                data-testid="img-splash-logo"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.main>
    </AnimatePresence>
  )
}
