"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { InvitationData } from "@/app/wedding/editor/page"
import type { PreviewState, PreviewHelpers, GuestbookEntry } from "./types"

export function usePreviewState(data: InvitationData & { date?: string; time?: string }) {
  const allPhotos = [data.coverImage, ...(data.mainPhotos || [])].filter(Boolean) as string[]
  const galleryImages = data.galleryImages?.filter(Boolean) || []

  const [currentSlide, setCurrentSlide] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [showGuestbookForm, setShowGuestbookForm] = useState(false)
  const [guestbookName, setGuestbookName] = useState("")
  const [guestbookMessage, setGuestbookMessage] = useState("")
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([])
  const [copiedToast, setCopiedToast] = useState("")
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)
  const [guestSnapPhotos, setGuestSnapPhotos] = useState<string[]>(data.guestSnapPhotos || [])
  const slideInterval = useRef<NodeJS.Timeout | null>(null)

  const coverStyle = data.coverDisplayStyle || "slide"

  useEffect(() => {
    if (allPhotos.length <= 1 || coverStyle === "static") return
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allPhotos.length)
    }, 3000)
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current)
    }
  }, [allPhotos.length, coverStyle])

  useEffect(() => {
    if (!data.weddingDate) return
    const updateCountdown = () => {
      const now = new Date().getTime()
      const target = new Date(data.weddingDate!).getTime()
      const diff = Math.max(0, target - now)
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [data.weddingDate])

  useEffect(() => {
    const loadGuestbook = async () => {
      try {
        const res = await fetch("/api/invitation/guestbook?userId=default")
        if (res.ok) {
          const entries = await res.json()
          if (Array.isArray(entries)) setGuestbookEntries(entries)
        }
      } catch {}
    }
    loadGuestbook()
  }, [])

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(`${label} 복사되었습니다.`)
      setTimeout(() => setCopiedToast(""), 2000)
    }).catch(() => {})
  }, [])

  const copyLink = useCallback(() => {
    const url = window.location.origin + "/invitation/preview"
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToast("링크가 복사되었습니다.")
      setTimeout(() => setCopiedToast(""), 2000)
    }).catch(() => {})
  }, [])

  const submitGuestbook = useCallback(async () => {
    if (!guestbookName.trim() || !guestbookMessage.trim()) return
    const entry = {
      name: guestbookName.trim(),
      message: guestbookMessage.trim(),
      date: new Date().toISOString().split("T")[0],
    }
    try {
      await fetch("/api/invitation/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default", entry }),
      })
    } catch {}
    setGuestbookEntries((prev) => [entry, ...prev])
    setGuestbookName("")
    setGuestbookMessage("")
    setShowGuestbookForm(false)
  }, [guestbookName, guestbookMessage])

  const formatWeddingDate = useCallback(() => {
    if (!data.weddingDate) return ""
    const d = new Date(data.weddingDate)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
  }, [data.weddingDate])

  const formatWeddingTime = useCallback(() => {
    if (!data.time) return ""
    return data.time
  }, [data.time])

  const getMonthAbbr = useCallback(() => {
    if (!data.weddingDate) return ""
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    return months[new Date(data.weddingDate).getMonth()]
  }, [data.weddingDate])

  const getDayNum = useCallback(() => {
    if (!data.weddingDate) return ""
    return String(new Date(data.weddingDate).getDate())
  }, [data.weddingDate])

  const getCalendarData = useCallback(() => {
    if (!data.weddingDate) return null
    const d = new Date(data.weddingDate)
    const year = d.getFullYear()
    const month = d.getMonth()
    const weddingDay = d.getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= lastDate; i++) days.push(i)
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"]
    const weddingDayName = dayNames[d.getDay()]
    return { year, month: month + 1, weddingDay, days, weddingDayName, dayNames }
  }, [data.weddingDate])

  const state: PreviewState = {
    allPhotos,
    galleryImages,
    currentSlide,
    countdown,
    showContact,
    setShowContact,
    showPhotoViewer,
    setShowPhotoViewer,
    viewerIndex,
    setViewerIndex,
    showGuestbookForm,
    setShowGuestbookForm,
    guestbookName,
    setGuestbookName,
    guestbookMessage,
    setGuestbookMessage,
    guestbookEntries,
    copiedToast,
    expandedAccordion,
    setExpandedAccordion,
    guestSnapPhotos,
  }

  const helpers: PreviewHelpers = {
    formatWeddingDate,
    formatWeddingTime,
    getMonthAbbr,
    getDayNum,
    getCalendarData,
    copyToClipboard,
    copyLink,
    submitGuestbook,
  }

  const addGuestSnapPhoto = useCallback((url: string) => {
    setGuestSnapPhotos((prev) => [...prev, url])
  }, [])

  return { state, helpers, addGuestSnapPhoto }
}
