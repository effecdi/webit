"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import WheelTimePicker from "@/components/ui/wheel-time-picker"
import { FloatingBackButton } from "@/components/shared/floating-back-button"
import { 
  ArrowLeft, 
  Plus, 
  Check,
  Plane,
  MapPin,
  Clock,
  X,
  Users,
  User
} from "lucide-react"

interface ScheduleItem {
  id: string
  time: string
  title: string
  location?: string
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: "shared" | "personal"
}

interface ExpenseItem {
  id: string
  title: string
  amount: number
  category: string
}

const TRIPS_DATA: Record<string, {
  destination: string
  startDate: string
  endDate: string
  budget: number
}> = {
  "1": { destination: "제주도", startDate: "2026-02-20", endDate: "2026-02-23", budget: 800000 },
  "2": { destination: "오사카", startDate: "2026-04-15", endDate: "2026-04-19", budget: 2000000 },
  "3": { destination: "부산", startDate: "2025-12-01", endDate: "2025-12-03", budget: 500000 }
}

const INITIAL_SCHEDULE: Record<number, ScheduleItem[]> = {
  1: [
    { id: "s1", time: "10:00", title: "공항 출발", location: "김포공항" },
    { id: "s2", time: "11:30", title: "제주 도착", location: "제주공항" },
    { id: "s3", time: "13:00", title: "점심 식사", location: "흑돼지 맛집" },
    { id: "s4", time: "15:00", title: "숙소 체크인", location: "애월 호텔" },
  ],
  2: [
    { id: "s5", time: "09:00", title: "성산일출봉", location: "서귀포" },
    { id: "s6", time: "12:00", title: "점심 식사", location: "해물탕 맛집" },
    { id: "s7", time: "15:00", title: "섭지코지", location: "서귀포" },
  ],
  3: [
    { id: "s8", time: "10:00", title: "카페 투어", location: "애월 카페거리" },
    { id: "s9", time: "14:00", title: "공항 이동", location: "제주공항" },
    { id: "s10", time: "16:00", title: "서울 도착", location: "김포공항" },
  ]
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: "c1", text: "여권 챙기기", completed: true, category: "shared" },
  { id: "c2", text: "숙소 예약 확인", completed: true, category: "shared" },
  { id: "c3", text: "렌터카 예약", completed: false, category: "shared" },
  { id: "c4", text: "항공권 확인", completed: true, category: "shared" },
  { id: "c5", text: "세면도구", completed: false, category: "personal" },
  { id: "c6", text: "충전기 & 보조배터리", completed: false, category: "personal" },
  { id: "c7", text: "상비약", completed: true, category: "personal" },
  { id: "c8", text: "카메라", completed: false, category: "personal" },
]

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: "e1", title: "항공권", amount: 200000, category: "교통" },
  { id: "e2", title: "숙소 2박", amount: 280000, category: "숙박" },
  { id: "e3", title: "렌터카", amount: 120000, category: "교통" },
]

type TabType = "schedule" | "checklist" | "budget"

export default function TravelDetailPage() {
  const router = useRouter()
  const params = useParams()
  const tripId = params.id as string
  const trip = TRIPS_DATA[tripId] || TRIPS_DATA["1"]
  
  const [activeTab, setActiveTab] = useState<TabType>("schedule")
  const [selectedDay, setSelectedDay] = useState(1)
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE)
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST)
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [checklistFilter, setChecklistFilter] = useState<"all" | "shared" | "personal">("all")
  
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [newSchedule, setNewSchedule] = useState({ time: "", title: "", location: "" })
  
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "기타" })

  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)
  const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const days = Array.from({ length: dayCount }, (_, i) => i + 1)
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remainingBudget = trip.budget - totalSpent
  const spentPercent = Math.min((totalSpent / trip.budget) * 100, 100)

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const filteredChecklist = checklist.filter(item => {
    if (checklistFilter === "all") return true
    return item.category === checklistFilter
  })

  const handleAddSchedule = () => {
    if (!newSchedule.time || !newSchedule.title) return
    const item: ScheduleItem = {
      id: Date.now().toString(),
      time: newSchedule.time,
      title: newSchedule.title,
      location: newSchedule.location
    }
    setSchedule({
      ...schedule,
      [selectedDay]: [...(schedule[selectedDay] || []), item].sort((a, b) => a.time.localeCompare(b.time))
    })
    setNewSchedule({ time: "", title: "", location: "" })
    setShowAddSchedule(false)
  }

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) return
    const item: ExpenseItem = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: Number(newExpense.amount.replace(/,/g, "")),
      category: newExpense.category
    }
    setExpenses([...expenses, item])
    setNewExpense({ title: "", amount: "", category: "기타" })
    setShowAddExpense(false)
  }

  const formatAmount = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num ? Number(num).toLocaleString() : ""
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: "schedule", label: "일정" },
    { key: "checklist", label: "체크리스트" },
    { key: "budget", label: "예산" }
  ]

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="fixed top-0 fixed-header-safe left-0 right-0 z-50 bg-white">
        <div className="flex items-center justify-center px-5 py-3 max-w-md mx-auto">
          <div className="text-center">
            <h1 className="text-[17px] font-bold text-[#191F28]">{trip.destination}</h1>
            <p className="text-[12px] text-[#8B95A1]">
              {new Date(trip.startDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })} - {new Date(trip.endDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </p>
          </div>
        </div>
        
        <div className="flex border-b border-[#E5E8EB]">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
                activeTab === tab.key 
                  ? "text-[#3B82F6]" 
                  : "text-[#8B95A1]"
              }`}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#3B82F6] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="pt-28 px-5 max-w-md mx-auto">
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {days.map(day => {
                const date = new Date(startDate)
                date.setDate(date.getDate() + day - 1)
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-semibold transition-colors ${
                      selectedDay === day
                        ? "bg-[#3B82F6] text-white"
                        : "bg-white text-[#4E5968] shadow-sm"
                    }`}
                    data-testid={`day-chip-${day}`}
                  >
                    Day {day}
                    <span className="ml-1 text-[11px] opacity-80">
                      {date.getDate()}일
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-weve">
              {(schedule[selectedDay] || []).length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-[#8B95A1] text-[14px]">아직 일정이 없어요</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {(schedule[selectedDay] || []).map((item, idx) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                        {idx < (schedule[selectedDay] || []).length - 1 && (
                          <div className="w-0.5 flex-1 bg-[#E5E8EB] my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <span className="text-[12px] font-medium text-[#3B82F6]">{item.time}</span>
                        <h4 className="text-[15px] font-semibold text-[#191F28]">{item.title}</h4>
                        {item.location && (
                          <div className="flex items-center gap-1 text-[12px] text-[#8B95A1] mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowAddSchedule(true)}
              className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-[16px] text-[14px] font-medium text-[#8B95A1] flex items-center justify-center gap-2 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
              data-testid="button-add-schedule"
            >
              <Plus className="w-4 h-4" />
              일정 추가
            </button>
          </div>
        )}

        {activeTab === "checklist" && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["all", "shared", "personal"] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setChecklistFilter(filter)}
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${
                    checklistFilter === filter
                      ? "bg-[#3B82F6] text-white"
                      : "bg-white text-[#4E5968] shadow-sm"
                  }`}
                  data-testid={`filter-${filter}`}
                >
                  {filter === "shared" && <Users className="w-3.5 h-3.5" />}
                  {filter === "personal" && <User className="w-3.5 h-3.5" />}
                  {filter === "all" ? "전체" : filter === "shared" ? "공유" : "개인"}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-weve">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[15px] font-bold text-[#191F28]">준비물</h3>
                <span className="text-[13px] text-[#8B95A1]">
                  {checklist.filter(i => i.completed).length}/{checklist.length} 완료
                </span>
              </div>
              
              <div className="space-y-2">
                {filteredChecklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-center gap-3 py-3 hover:bg-[#F8F9FA] rounded-[12px] transition-colors px-2 -mx-2"
                    data-testid={`checklist-item-${item.id}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.completed 
                        ? "bg-[#3B82F6] border-[#3B82F6]" 
                        : "border-[#D1D5DB]"
                    }`}>
                      {item.completed && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 text-left text-[15px] ${
                      item.completed ? "text-[#8B95A1] line-through" : "text-[#191F28]"
                    }`}>
                      {item.text}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      item.category === "shared" 
                        ? "bg-[#F3E8FF] text-[#d63bf2]" 
                        : "bg-purple-50 text-purple-500"
                    }`}>
                      {item.category === "shared" ? "공유" : "개인"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="space-y-4">
            <div className="bg-white rounded-[20px] p-5 shadow-weve">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[15px] font-bold text-[#191F28]">예산 현황</h3>
                <span className="text-[13px] font-medium text-[#3B82F6]">
                  {Math.round(spentPercent)}% 사용
                </span>
              </div>
              
              <div className="h-3 bg-[#F2F4F6] rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    spentPercent > 90 ? "bg-red-500" : spentPercent > 70 ? "bg-amber-500" : "bg-[#3B82F6]"
                  }`}
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-[12px] p-4">
                  <p className="text-[12px] text-[#8B95A1] mb-1">총 예산</p>
                  <p className="text-[17px] font-bold text-[#191F28]">
                    {trip.budget.toLocaleString()}원
                  </p>
                </div>
                <div className="bg-[#F8F9FA] rounded-[12px] p-4">
                  <p className="text-[12px] text-[#8B95A1] mb-1">남은 예산</p>
                  <p className={`text-[17px] font-bold ${remainingBudget < 0 ? "text-red-500" : "text-[#191F28]"}`}>
                    {remainingBudget.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-weve">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[15px] font-bold text-[#191F28]">지출 내역</h3>
                <span className="text-[13px] text-[#8B95A1]">
                  총 {totalSpent.toLocaleString()}원
                </span>
              </div>
              
              {expenses.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[#8B95A1] text-[14px]">아직 지출이 없어요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expenses.map(expense => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between py-2"
                      data-testid={`expense-item-${expense.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F2F4F6] text-[#4E5968]">
                          {expense.category}
                        </span>
                        <span className="text-[15px] text-[#191F28]">{expense.title}</span>
                      </div>
                      <span className="text-[15px] font-medium text-[#191F28]">
                        {expense.amount.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowAddExpense(true)}
              className="w-full py-3 border-2 border-dashed border-[#D1D5DB] rounded-[16px] text-[14px] font-medium text-[#8B95A1] flex items-center justify-center gap-2 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
              data-testid="button-add-expense"
            >
              <Plus className="w-4 h-4" />
              지출 추가
            </button>
          </div>
        )}
      </main>

      {showAddSchedule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddSchedule(false)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-[#191F28]">일정 추가</h2>
              <button onClick={() => setShowAddSchedule(false)} className="w-8 h-8 flex items-center justify-center">
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">시간</label>
                <WheelTimePicker
                  value={newSchedule.time}
                  onChange={(val) => setNewSchedule({ ...newSchedule, time: val })}
                  placeholder="시간 선택"
                  className="!px-4 !py-3.5 !rounded-[12px] !text-[15px] !border-0"
                />
              </div>
              
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">일정</label>
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  placeholder="무엇을 하나요?"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  data-testid="input-schedule-title"
                />
              </div>
              
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">장소 (선택)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
                  <input
                    type="text"
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                    placeholder="어디에서?"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                    data-testid="input-schedule-location"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddSchedule}
                disabled={!newSchedule.time || !newSchedule.title}
                className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-[12px] disabled:bg-[#B0B8C1] disabled:cursor-not-allowed mt-2"
                data-testid="button-confirm-add-schedule"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddExpense && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddExpense(false)} />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-[#191F28]">지출 추가</h2>
              <button onClick={() => setShowAddExpense(false)} className="w-8 h-8 flex items-center justify-center">
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">항목</label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  placeholder="무엇에 사용했나요?"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  data-testid="input-expense-title"
                />
              </div>
              
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">금액</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: formatAmount(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] pr-10"
                    data-testid="input-expense-amount"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B95A1]">원</span>
                </div>
              </div>
              
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {["교통", "숙박", "식비", "관광", "쇼핑", "기타"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewExpense({ ...newExpense, category: cat })}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                        newExpense.category === cat
                          ? "bg-[#3B82F6] text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                      data-testid={`category-${cat}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.title || !newExpense.amount}
                className="w-full py-4 bg-[#3B82F6] text-white font-bold rounded-[12px] disabled:bg-[#B0B8C1] disabled:cursor-not-allowed mt-2"
                data-testid="button-confirm-add-expense"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
      <FloatingBackButton />
    </div>
  )
}
