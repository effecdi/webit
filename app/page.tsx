"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/splash")
  }, [router])

  return (
    <main className="min-h-dvh bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </main>
  )
}
