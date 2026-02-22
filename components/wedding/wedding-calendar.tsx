"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Gem, Heart } from "lucide-react"
import WheelTimePicker from "@/components/ui/wheel-time-picker"

interface Event {
  id: string
  title: string
  date: string
  type: "wedding" | "groom" | "bride" | "both"
  time?: string
}

const DUMMY_EVENTS: Event[] = []

const EVENT_COLORS = {
  wedding: "bg-[#D4AF37]",
  groom: "bg-[#5B8DEF]",
  bride: "bg-primary",
  both: "bg-[#9B7ED9]",
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"]

export function WeddingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(DUMMY_EVENTS)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: "", type: "both" as Event["type"], time: "" })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getEventsForDate = (day: number) => {
    const dateStr = formatDate(day)
    return events.filter((e) => e.date === dateStr)
  }

  const handleAddEvent = () => {
    if (!selectedDate || !newEvent.title) return
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      type: newEvent.type,
      time: newEvent.time || undefined,
    }
    setEvents([...events, event])
    setShowAddModal(false)
    setNewEvent({ title: "", type: "both", time: "" })
  }

  const selectedDateEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : []

  // D-Day 계산
  const weddingDate = events.find((e) => e.type === "wedding")?.date
  const dday = weddingDate
    ? Math.ceil((new Date(weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="p-4">
      {/* D-Day Banner */}
      {dday !== null && (
        <div className="mb-4 bg-[#D4AF37] border-3 border-secondary p-4 shadow-brutalist flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gem className="w-6 h-6 text-secondary" />
            <div>
              <p className="text-xs text-secondary/80 uppercase tracking-wider">Wedding Day</p>
              <p className="font-serif text-2xl font-black text-secondary">D-{dday}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-secondary">{weddingDate?.replace(/-/g, ".")}</p>
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-card border-3 border-secondary shadow-brutalist mb-4">
        <div className="flex items-center justify-between p-4 border-b-2 border-secondary">
          <button
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center border-2 border-secondary hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-serif text-xl font-bold">
            {year}. {String(month + 1).padStart(2, "0")}
          </h2>
          <button
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center border-2 border-secondary hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b-2 border-secondary">
          {DAYS.map((day, i) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-bold ${
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-foreground"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 border-r border-b border-muted" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = formatDate(day)
            const dayEvents = getEventsForDate(day)
            const isSelected = selectedDate === dateStr
            const isToday =
              new Date().toDateString() === new Date(year, month, day).toDateString()
            const dayOfWeek = (firstDay + i) % 7

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`h-16 p-1 border-r border-b border-muted flex flex-col items-center transition-colors ${
                  isSelected ? "bg-[#D4AF37]/20" : "hover:bg-muted"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    isToday
                      ? "w-6 h-6 bg-secondary text-card flex items-center justify-center"
                      : dayOfWeek === 0
                        ? "text-red-500"
                        : dayOfWeek === 6
                          ? "text-blue-500"
                          : ""
                  }`}
                >
                  {day}
                </span>
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`w-1.5 h-1.5 ${EVENT_COLORS[event.type]}`}
                    />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#D4AF37] border border-secondary" />
          <span className="text-xs text-muted-foreground">본식</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#5B8DEF] border border-secondary" />
          <span className="text-xs text-muted-foreground">신랑</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-primary border border-secondary" />
          <span className="text-xs text-muted-foreground">신부</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#9B7ED9] border border-secondary" />
          <span className="text-xs text-muted-foreground">함께</span>
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-card border-3 border-secondary shadow-brutalist">
          <div className="flex items-center justify-between p-3 border-b-2 border-secondary bg-muted">
            <h3 className="font-bold text-sm">
              {selectedDate.replace(/-/g, ".")}
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] border-2 border-secondary hover:bg-[#D4AF37]/80 transition-colors"
            >
              <Plus className="w-4 h-4 text-secondary" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            {selectedDateEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">일정이 없습니다</p>
            ) : (
              selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2 border-2 border-secondary hover:bg-muted transition-colors"
                >
                  <div className={`w-3 h-10 ${EVENT_COLORS[event.type]}`} />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{event.title}</p>
                    {event.time && (
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-sm bg-card border-3 border-secondary shadow-brutalist-lg">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-card flex items-center justify-center border-2 border-secondary"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4 border-b-2 border-secondary bg-muted">
              <h3 className="font-serif text-lg font-bold">일정 추가</h3>
              <p className="text-sm text-muted-foreground">{selectedDate.replace(/-/g, ".")}</p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider">제목</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border-2 border-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="일정 제목"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider">시간</label>
                <WheelTimePicker
                  value={newEvent.time}
                  onChange={(val) => setNewEvent({ ...newEvent, time: val })}
                  placeholder="시간 선택"
                  className="!border-2 !border-secondary !p-2 !text-sm !rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider">구분</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: "groom", label: "신랑", icon: Heart, color: "bg-[#5B8DEF]" },
                    { value: "bride", label: "신부", icon: Heart, color: "bg-primary" },
                    { value: "both", label: "함께", icon: Heart, color: "bg-[#9B7ED9]" },
                    { value: "wedding", label: "본식", icon: Gem, color: "bg-[#D4AF37]" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewEvent({ ...newEvent, type: option.value as Event["type"] })}
                      className={`p-2 border-2 border-secondary text-center transition-colors ${
                        newEvent.type === option.value ? option.color + " text-secondary" : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-xs font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddEvent}
                className="w-full bg-[#D4AF37] border-3 border-secondary py-3 font-bold text-secondary shadow-brutalist hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
