"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Check, Edit2, Trash2, Clock, MapPin } from "lucide-react"
import WheelTimePicker from "@/components/ui/wheel-time-picker"
import { BottomSheet } from "@/components/ui/bottom-sheet"

interface Event {
  id: string
  date: string
  title: string
  category: "me" | "partner" | "together" | "anniversary"
  time?: string
  location?: string
}

const CATEGORY_STYLES = {
  me: { bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-500", label: "나" },
  partner: { bg: "bg-[#d63bf2]", light: "bg-[#F3E8FF]", text: "text-[#d63bf2]", label: "파트너" },
  together: { bg: "bg-green-500", light: "bg-green-50", text: "text-green-500", label: "함께" },
  anniversary: { bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-500", label: "기념일" },
}

export function FamilyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?mode=family')
      const data = await res.json()
      const items = Array.isArray(data) ? data : []
      const formatted = items.map((e: { id: number; date: string; title: string; category: string; time?: string; location?: string }) => ({
        id: String(e.id),
        date: new Date(e.date).toISOString().split('T')[0],
        title: e.title,
        category: e.category as "me" | "partner" | "together" | "anniversary",
        time: e.time,
        location: e.location,
      }))
      setEvents(formatted)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({ title: "", category: "together" as Event["category"], time: "", location: "" })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: (number | null)[] = []
    for (let i = 0; i < startPadding; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }, [year, month])

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((e) => e.date === dateStr)
  }

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
  }

  const openAddModal = () => {
    if (!selectedDate) {
      const today = new Date()
      setSelectedDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`)
    }
    setEditingEvent(null)
    setNewEvent({ title: "", category: "together", time: "", location: "" })
    setShowModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      category: event.category,
      time: event.time || "",
      location: event.location || "",
    })
    setSelectedDate(event.date)
    setShowModal(true)
  }

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id))
      setEventToDelete(null)
      setShowDeleteModal(false)
    }
  }

  const handleSaveEvent = () => {
    if (!selectedDate || !newEvent.title) return
    
    if (editingEvent) {
      // Update existing
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...e, title: newEvent.title, category: newEvent.category, time: newEvent.time || undefined, location: newEvent.location || undefined, date: selectedDate }
          : e
      ))
    } else {
      // Add new
      const event: Event = {
        id: Date.now().toString(),
        date: selectedDate,
        title: newEvent.title,
        category: newEvent.category,
        time: newEvent.time || undefined,
        location: newEvent.location || undefined,
      }
      setEvents([...events, event])
    }
    
    resetAndCloseModal()
  }

  const resetAndCloseModal = () => {
    setNewEvent({ title: "", category: "together", time: "", location: "" })
    setEditingEvent(null)
    setShowModal(false)
  }

  const selectedDateEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : []

  // Upcoming events (sorted by date)
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <>
      <div className="px-5 py-5 max-w-md mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={handlePrevMonth} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#4E5968]" />
          </button>
          <h2 className="text-[18px] font-bold text-[#191F28]">
            {year}년 {month + 1}월
          </h2>
          <button 
            onClick={handleNextMonth} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#4E5968]" />
          </button>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
              <span className="text-[12px] text-[#8B95A1]">{style.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mb-5">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#F2F4F6]">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
              <div
                key={day}
                className={`py-3 text-center text-[13px] font-medium ${
                  idx === 0 ? "text-red-400" : idx === 6 ? "text-blue-400" : "text-[#8B95A1]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null
              const dayEvents = day ? getEventsForDay(day) : []
              const isSelected = dateStr === selectedDate
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
              const dayOfWeek = idx % 7

              return (
                <button
                  key={idx}
                  disabled={!day}
                  onClick={() => day && handleDayClick(day)}
                  className={`relative aspect-square p-1 transition-colors ${
                    day ? "hover:bg-[#F8F9FA] cursor-pointer" : ""
                  } ${isSelected ? "bg-green-50" : ""}`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-[14px] font-medium flex items-center justify-center ${
                          isToday ? "w-7 h-7 bg-green-500 text-white rounded-full mx-auto" : ""
                        } ${
                          !isToday && dayOfWeek === 0 ? "text-red-400" : ""
                        } ${
                          !isToday && dayOfWeek === 6 ? "text-blue-400" : ""
                        } ${
                          !isToday && dayOfWeek !== 0 && dayOfWeek !== 6 ? "text-[#191F28]" : ""
                        }`}
                      >
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((e) => (
                            <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${CATEGORY_STYLES[e.category].bg}`} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <section className="bg-white rounded-[20px] shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#191F28]">
                {new Date(selectedDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
              </h3>
            </div>

            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex items-center gap-3 p-3.5 rounded-[12px] ${CATEGORY_STYLES[event.category].light}`}
                  >
                    <div className={`w-1 h-10 rounded-full ${CATEGORY_STYLES[event.category].bg}`} />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#191F28]">{event.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {event.time && (
                          <span className="text-[12px] text-[#8B95A1] flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {event.time}
                          </span>
                        )}
                        {event.location && (
                          <span className="text-[12px] text-[#8B95A1] flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditEvent(event)}
                        className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(event)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#8B95A1] text-[14px] py-6">일정이 없습니다</p>
            )}
          </section>
        )}

        {/* Upcoming Events */}
        <section className="bg-white rounded-[20px] shadow-sm p-5">
          <h3 className="text-[17px] font-bold text-[#191F28] mb-4">다가오는 일정</h3>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-center gap-3 p-4 bg-[#F8F9FA] rounded-[12px]"
              >
                <div className={`w-1 h-10 rounded-full ${CATEGORY_STYLES[event.category].bg}`} />
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#191F28]">{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#8B95A1]">
                      {new Date(event.date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                    </span>
                    {event.time && (
                      <span className="text-[12px] text-[#8B95A1] flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {event.time}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditEvent(event)}
                    className="w-8 h-8 rounded-full hover:bg-[#E5E8EB] flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(event)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
                  </button>
                </div>
                <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${CATEGORY_STYLES[event.category].light} ${CATEGORY_STYLES[event.category].text}`}>
                  {CATEGORY_STYLES[event.category].label}
                </span>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-center text-[#8B95A1] text-[14px] py-6">다가오는 일정이 없습니다</p>
            )}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={openAddModal}
        className="fixed bottom-24 right-5 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add/Edit Event Modal */}
      <BottomSheet open={showModal} onOpenChange={(open) => { if (!open) resetAndCloseModal() }} className="bg-white max-w-md mx-auto z-[60]" overlayClassName="z-[60]" showHandle={false}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
          <button onClick={resetAndCloseModal}>
            <X className="w-6 h-6 text-[#8B95A1]" />
          </button>
          <h3 className="text-[17px] font-bold text-[#191F28]">
            {editingEvent ? "일정 수정" : "일정 추가"}
          </h3>
          <button 
            onClick={handleSaveEvent}
            disabled={!newEvent.title}
            className={`text-[15px] font-semibold ${newEvent.title ? "text-green-500" : "text-[#B0B8C1]"}`}
          >
            {editingEvent ? "수정" : "저장"}
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-[#4E5968] mb-2">일정 제목</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="일정을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#4E5968] mb-2">카테고리</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
                <button
                  key={key}
                  onClick={() => setNewEvent({ ...newEvent, category: key as Event["category"] })}
                  className={`flex items-center justify-center gap-2 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                    newEvent.category === key
                      ? `${style.bg} text-white`
                      : "bg-[#F2F4F6] text-[#4E5968]"
                  }`}
                >
                  {newEvent.category === key && <Check className="w-4 h-4" />}
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#4E5968] mb-2">시간 (선택)</label>
            <WheelTimePicker
              value={newEvent.time}
              onChange={(val) => setNewEvent({ ...newEvent, time: val })}
              placeholder="시간 선택"
              className="!px-4 !py-3.5 !bg-[#F2F4F6] !rounded-[12px] !text-[15px] !border-0"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#4E5968] mb-2">장소 (선택)</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="장소를 입력하세요"
            />
          </div>
        </div>

        <div className="h-8" />
      </BottomSheet>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-5"
          onClick={() => {
            setShowDeleteModal(false)
            setEventToDelete(null)
          }}
        >
          <div 
            className="bg-white rounded-[24px] w-full max-w-sm p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-[#FF6B6B]" />
              </div>
              <h3 className="text-[19px] font-bold text-[#191F28] mb-2">일정을 삭제할까요?</h3>
              <p className="text-[14px] text-[#8B95A1]">{eventToDelete.title}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setEventToDelete(null)
                }}
                className="flex-1 py-3.5 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] font-semibold text-[15px] hover:bg-[#E5E8EB] transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3.5 rounded-[14px] bg-[#FF6B6B] text-white font-semibold text-[15px] hover:bg-[#FF5252] transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
