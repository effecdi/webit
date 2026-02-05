"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, X, MapPin, Clock, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

type ScheduleOwner = "me" | "you" | "we"

interface Schedule {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  owner: ScheduleOwner
}

const DUMMY_SCHEDULES: Schedule[] = [
  { id: "1", title: "네일샵 예약", date: "2026-02-08", time: "14:00", owner: "me" },
  { id: "2", title: "회사 회식", date: "2026-02-12", time: "19:00", location: "강남역", owner: "you" },
  { id: "3", title: "2주년 기념일", date: "2026-02-14", owner: "we" },
  { id: "4", title: "영화 데이트", date: "2026-02-15", time: "17:00", location: "CGV 용산", owner: "we" },
  { id: "5", title: "피부과", date: "2026-02-20", time: "11:00", owner: "me" },
  { id: "6", title: "친구 생일파티", date: "2026-02-22", time: "18:00", owner: "you" },
  { id: "7", title: "제주도 여행", date: "2026-02-28", owner: "we" },
]

const OWNER_COLORS: Record<ScheduleOwner, { bg: string; dot: string; light: string }> = {
  me: { bg: "bg-pink-500", dot: "bg-pink-400", light: "bg-pink-50" },
  you: { bg: "bg-blue-500", dot: "bg-blue-400", light: "bg-blue-50" },
  we: { bg: "bg-purple-500", dot: "bg-purple-400", light: "bg-purple-50" },
}

const OWNER_LABELS: Record<ScheduleOwner, string> = {
  me: "나",
  you: "상대",
  we: "우리",
}

export function CoupleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [schedules, setSchedules] = useState<Schedule[]>(DUMMY_SCHEDULES)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null)
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    time: "",
    location: "",
    owner: "we" as ScheduleOwner,
  })

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getSchedulesForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return schedules.filter(s => s.date === dateStr)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setNewSchedule({
      title: schedule.title,
      time: schedule.time || "",
      location: schedule.location || "",
      owner: schedule.owner,
    })
    setSelectedDate(schedule.date)
    setShowModal(true)
  }

  const handleDeleteClick = (schedule: Schedule) => {
    setScheduleToDelete(schedule)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules(schedules.filter(s => s.id !== scheduleToDelete.id))
      setScheduleToDelete(null)
      setShowDeleteModal(false)
    }
  }

  const handleSaveSchedule = () => {
    if (!newSchedule.title || !selectedDate) return
    
    if (editingSchedule) {
      // Update existing
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, title: newSchedule.title, time: newSchedule.time, location: newSchedule.location, owner: newSchedule.owner, date: selectedDate }
          : s
      ))
    } else {
      // Add new
      const newItem: Schedule = {
        id: Date.now().toString(),
        title: newSchedule.title,
        date: selectedDate,
        time: newSchedule.time || undefined,
        location: newSchedule.location || undefined,
        owner: newSchedule.owner,
      }
      setSchedules([...schedules, newItem])
    }
    
    // Reset form
    setNewSchedule({ title: "", time: "", location: "", owner: "we" })
    setEditingSchedule(null)
    setShowModal(false)
  }

  const resetAndCloseModal = () => {
    setNewSchedule({ title: "", time: "", location: "", owner: "we" })
    setEditingSchedule(null)
    setShowModal(false)
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setShowModal(true)
  }

  const selectedSchedules = selectedDate 
    ? schedules.filter(s => s.date === selectedDate)
    : []

  return (
    <>
  {/* Header */}
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E8EB]">
  <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
  <h1 className="text-[20px] font-bold text-[#191F28]">캘린더</h1>
  <div className="w-10" />
  </div>
  </header>

      <div className="px-5 py-5 max-w-md mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button 
            onClick={prevMonth}
            className="w-10 h-10 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#4E5968]" />
          </button>
          <h2 className="text-[20px] font-bold text-[#191F28]">
            {year}년 {month + 1}월
          </h2>
          <button 
            onClick={nextMonth}
            className="w-10 h-10 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#4E5968]" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-4">
          {(Object.entries(OWNER_LABELS) as [ScheduleOwner, string][]).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${OWNER_COLORS[key].dot}`} />
              <span className="text-[12px] text-[#8B95A1]">{label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#F2F4F6]">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
              <div 
                key={day} 
                className={`py-3 text-center text-[13px] font-medium ${
                  i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-[#8B95A1]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const schedules = day ? getSchedulesForDate(day) : []
              const isToday = day === 5 && month === 1 && year === 2026
              const dayOfWeek = index % 7
              
              return (
                <button
                  key={index}
                  onClick={() => day && handleDateClick(day)}
                  disabled={!day}
                  className={`relative aspect-square p-1 flex flex-col items-center justify-start pt-2 transition-colors ${
                    day ? "hover:bg-[#F8F9FA]" : ""
                  } ${isToday ? "bg-[#FFF0EE]" : ""}`}
                >
                  {day && (
                    <>
                      <span className={`text-[14px] font-medium ${
                        dayOfWeek === 0 ? "text-red-400" : dayOfWeek === 6 ? "text-blue-400" : "text-[#191F28]"
                      } ${isToday ? "w-7 h-7 rounded-full bg-[#FF8A80] text-white flex items-center justify-center" : ""}`}>
                        {day}
                      </span>
                      {schedules.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {schedules.slice(0, 3).map((schedule) => (
                            <div 
                              key={schedule.id}
                              className={`w-1.5 h-1.5 rounded-full ${OWNER_COLORS[schedule.owner].dot}`}
                            />
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

        {/* Upcoming Schedules */}
        <div className="mt-6">
          <h3 className="text-[17px] font-bold text-[#191F28] mb-3">다가오는 일정</h3>
          <div className="space-y-2">
            {schedules.slice(0, 4).map((schedule) => (
              <div 
                key={schedule.id}
                className="flex items-center gap-3 p-4 bg-white rounded-[16px] shadow-sm"
              >
                <div className={`w-1 h-10 rounded-full ${OWNER_COLORS[schedule.owner].bg}`} />
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-[#191F28]">{schedule.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#8B95A1]">
                      {new Date(schedule.date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                    </span>
                    {schedule.time && (
                      <span className="text-[12px] text-[#8B95A1] flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {schedule.time}
                      </span>
                    )}
                  </div>
                </div>
                {/* Edit/Delete Buttons */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEditSchedule(schedule)}
                    className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(schedule)}
                    className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
                  </button>
                </div>
                <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${OWNER_COLORS[schedule.owner].light} ${
                  schedule.owner === "me" ? "text-pink-600" : 
                  schedule.owner === "you" ? "text-blue-600" : "text-purple-600"
                }`}>
                  {OWNER_LABELS[schedule.owner]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`)
          setShowModal(true)
        }}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#FF8A80] hover:bg-[#FF6B6B] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div 
            className="absolute inset-0" 
            onClick={resetAndCloseModal} 
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
              <h3 className="text-[17px] font-bold text-[#191F28]">
                {editingSchedule ? "일정 수정" : (selectedDate && new Date(selectedDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" }))}
              </h3>
              <button 
                onClick={resetAndCloseModal}
                className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>

            {/* Existing Schedules */}
            {selectedSchedules.length > 0 && !editingSchedule && (
              <div className="px-5 py-4 border-b border-[#F2F4F6] space-y-2">
                {selectedSchedules.map((schedule) => (
                  <div 
                    key={schedule.id}
                    className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]"
                  >
                    <div className={`w-1 h-8 rounded-full ${OWNER_COLORS[schedule.owner].bg}`} />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-[#191F28]">{schedule.title}</p>
                      {schedule.location && (
                        <p className="text-[12px] text-[#8B95A1] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {schedule.location}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditSchedule(schedule)}
                        className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-[#8B95A1]" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(schedule)}
                        className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-[#FF6B6B]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Schedule Form */}
            <div className="px-5 py-5 space-y-4 max-h-[50vh] overflow-y-auto">
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">일정 제목</label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                  placeholder="일정을 입력하세요"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">시간</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                    className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">장소</label>
                  <input
                    type="text"
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({...newSchedule, location: e.target.value})}
                    placeholder="장소 입력"
                    className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">누구 일정인가요?</label>
                <div className="flex gap-2">
                  {(Object.entries(OWNER_LABELS) as [ScheduleOwner, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewSchedule({...newSchedule, owner: key})}
                      className={`flex-1 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                        newSchedule.owner === key 
                          ? `${OWNER_COLORS[key].bg} text-white` 
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveSchedule}
                disabled={!newSchedule.title}
                className={`w-full py-4 font-semibold rounded-[14px] transition-colors ${
                  newSchedule.title 
                    ? "bg-[#FF8A80] hover:bg-[#FF6B6B] text-white" 
                    : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                }`}
              >
                {editingSchedule ? "수정하기" : "저장하기"}
              </button>
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && scheduleToDelete && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-5"
          onClick={() => {
            setShowDeleteModal(false)
            setScheduleToDelete(null)
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
              <p className="text-[14px] text-[#8B95A1]">{scheduleToDelete.title}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setScheduleToDelete(null)
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
