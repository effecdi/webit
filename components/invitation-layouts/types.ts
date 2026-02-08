import type { InvitationData } from "@/app/wedding/editor/page"

export interface CalendarData {
  year: number
  month: number
  weddingDay: number
  days: (number | null)[]
  weddingDayName: string
  dayNames: string[]
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface GuestbookEntry {
  name: string
  message: string
  date: string
}

export interface PreviewHelpers {
  formatWeddingDate: () => string
  formatWeddingTime: () => string
  getMonthAbbr: () => string
  getDayNum: () => string
  getCalendarData: () => CalendarData | null
  copyToClipboard: (text: string, label: string) => void
  copyLink: () => void
  submitGuestbook: () => Promise<void>
}

export interface PreviewState {
  allPhotos: string[]
  galleryImages: string[]
  currentSlide: number
  countdown: Countdown
  showContact: boolean
  setShowContact: (v: boolean) => void
  showPhotoViewer: boolean
  setShowPhotoViewer: (v: boolean) => void
  viewerIndex: number
  setViewerIndex: (v: number) => void
  showGuestbookForm: boolean
  setShowGuestbookForm: (v: boolean) => void
  guestbookName: string
  setGuestbookName: (v: string) => void
  guestbookMessage: string
  setGuestbookMessage: (v: string) => void
  guestbookEntries: GuestbookEntry[]
  copiedToast: string
  expandedAccordion: string | null
  setExpandedAccordion: (v: string | null) => void
}

export interface LayoutProps {
  data: InvitationData & { date?: string; time?: string }
  state: PreviewState
  helpers: PreviewHelpers
  onRsvpClick?: () => void
}
