"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import WheelDatePicker from "@/components/ui/wheel-date-picker"
import { BottomSheet } from '@/components/ui/bottom-sheet'
import {
  Bell,
  ChevronRight,
  Heart,
  Diamond,
  Camera,
  Shirt,
  Building2,
  TrendingDown,
  Mail,
  Wallet,
  Sparkles,
  MapPin,
  X,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Plane,
  Pencil,
  Users,
  Gift,
  Film,
  Video,
  Mic,
  MoreHorizontal
} from "lucide-react"
import { ModeSwitch } from "@/components/mode-switch"
import { TravelEntryCard } from "@/components/travel/travel-entry-card"
import { NotificationModal, type Notification } from "@/components/shared/notification-modal"
import { useBudget, type Expense } from "@/contexts/budget-context"
import { useChecklist } from "@/contexts/checklist-context"
import { Circle, CheckCircle2 } from "lucide-react"



const WEDDING_DATE = "2025-06-15"

function calculateDday(targetDate: string) {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

const categoryIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  "웨딩홀": { icon: <Building2 className="w-4 h-4" />, bg: "bg-pink-50 text-pink-500" },
  "스튜디오": { icon: <Camera className="w-4 h-4" />, bg: "bg-indigo-50 text-indigo-500" },
  "드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-purple-50 text-purple-500" },
  "2부드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-fuchsia-50 text-fuchsia-500" },
  "메이크업": { icon: <Sparkles className="w-4 h-4" />, bg: "bg-rose-50 text-rose-500" },
  "예복": { icon: <Shirt className="w-4 h-4" />, bg: "bg-slate-50 text-slate-500" },
  "예물": { icon: <Gift className="w-4 h-4" />, bg: "bg-amber-50 text-amber-500" },
  "본식스냅": { icon: <Camera className="w-4 h-4" />, bg: "bg-cyan-50 text-cyan-500" },
  "DVD": { icon: <Film className="w-4 h-4" />, bg: "bg-violet-50 text-violet-500" },
  "식전영상": { icon: <Video className="w-4 h-4" />, bg: "bg-teal-50 text-teal-500" },
  "식중영상": { icon: <Video className="w-4 h-4" />, bg: "bg-emerald-50 text-emerald-500" },
  "청첩장": { icon: <Mail className="w-4 h-4" />, bg: "bg-blue-50 text-blue-500" },
  "사회자": { icon: <Mic className="w-4 h-4" />, bg: "bg-orange-50 text-orange-500" },
  "기타": { icon: <MoreHorizontal className="w-4 h-4" />, bg: "bg-gray-50 text-gray-500" },
}

const quickActions = [
  { id: "1", icon: Mail, label: "모바일 청첩장", href: "/wedding/invitation", color: "bg-pink-100 text-pink-500" },
  { id: "2", icon: Users, label: "하객 매니저", href: "/wedding/guests", color: "bg-blue-100 text-[#3182F6]" },
  { id: "3", icon: Plane, label: "허니문 계획", href: "/travel", color: "bg-purple-100 text-purple-500" },
  { id: "4", icon: Sparkles, label: "웨딩 굿즈", href: "/wedding/goods", color: "bg-amber-100 text-amber-500" },
]

const categories = ["예식장", "드레스", "스튜디오", "스냅", "청첩장", "허니문", "예물", "혼수", "기타"]

interface Travel {
  id: number
  destination: string
  startDate: string
  endDate: string
}

export function WeddingDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "progress" | "done">("all")
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [coupleNames, setCoupleNames] = useState({ my: "현정", partner: "주호" })
  const [daysTogether, setDaysTogether] = useState(0)
  const [weddingDate, setWeddingDate] = useState(WEDDING_DATE)
  const [venueName, setVenueName] = useState("예식장 미정")
  const [showEditWeddingModal, setShowEditWeddingModal] = useState(false)
  const [editWeddingDate, setEditWeddingDate] = useState("")
  const [editVenueName, setEditVenueName] = useState("")
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "예식장",
    payer: "shared" as "groom" | "bride" | "shared" | "parents",
    method: "card" as "cash" | "card" | "transfer",
  })
  
  const dday = calculateDday(weddingDate)
  
  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "현정"
    const partnerName = localStorage.getItem("survey_partnerName") || "주호"
    const savedDate = localStorage.getItem("survey_firstMeetDate")
    const savedWeddingDate = localStorage.getItem("wedding_date")
    const savedVenue = localStorage.getItem("wedding_venue")
    
    setCoupleNames({ my: myName, partner: partnerName })
    
    if (savedWeddingDate) {
      setWeddingDate(savedWeddingDate)
    }
    if (savedVenue) {
      setVenueName(savedVenue)
    }
    
    if (savedDate) {
      const start = new Date(savedDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      setDaysTogether(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    }
    
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [notificationsRes, travelsRes, weddingInfoRes] = await Promise.all([
        fetch('/api/notifications?mode=wedding'),
        fetch('/api/travels'),
        fetch('/api/wedding-info')
      ])
      const notificationsData = notificationsRes.ok ? await notificationsRes.json() : []
      const travelsData = travelsRes.ok ? await travelsRes.json() : []
      const weddingInfoData = weddingInfoRes.ok ? await weddingInfoRes.json() : null

      if (weddingInfoData) {
        if (weddingInfoData.weddingDate) setWeddingDate(weddingInfoData.weddingDate)
        if (weddingInfoData.venue) setVenueName(weddingInfoData.venue)
      }

      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData.map((n: { id: number; type: string; title: string; message: string; createdAt: string }) => ({
          id: String(n.id),
          type: n.type,
          title: n.title,
          message: n.message,
          time: formatTimeAgo(n.createdAt)
        })))
      }
      if (Array.isArray(travelsData)) {
        setTravels(travelsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return "방금"
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  const upcomingTravel = travels.find(t => {
    const startDate = new Date(t.startDate)
    const today = new Date()
    return startDate >= today
  })

  // Budget from context
  const { totalBudget, setTotalBudget, totalSpent, remaining, spentPercent, expenses, addExpense } = useBudget()
  const [showBudgetSetupModal, setShowBudgetSetupModal] = useState(false)
  const [budgetInput, setBudgetInput] = useState("")
  
  // Checklist from context
  const { items: checklistItems, toggleComplete, progressPercent: checklistProgress } = useChecklist()
  
  // Filter checklist items based on active tab
  const filteredChecklistItems = checklistItems.filter(item => {
    if (activeTab === "all") return true
    if (activeTab === "progress") return !item.completed
    if (activeTab === "done") return item.completed
    return true
  })
  
  // Get items to display (sorted by due date)
  const displayItems = filteredChecklistItems
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4)
  
  // Calculate this month's spending
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthSpent = expenses
    .filter(e => {
      const expDate = new Date(e.date)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear && e.status === "paid"
    })
    .reduce((sum, e) => sum + e.amount, 0)

  const formatAmountInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num ? Number(num).toLocaleString() : ""
  }

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount) return
    
    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: Number(newExpense.amount.replace(/,/g, "")),
      category: newExpense.category,
      date: new Date().toISOString().split("T")[0],
      payer: newExpense.payer,
      status: "paid",
      method: newExpense.method,
    }
    
    addExpense(expense)
    setNewExpense({
      title: "",
      amount: "",
      category: "예식장",
      payer: "shared",
      method: "card",
    })
    setShowExpenseModal(false)
  }
  
  // Group expenses by category for display
  const categoryTotals = expenses.reduce((acc, expense) => {
    const cat = expense.category
    if (!acc[cat]) {
      acc[cat] = { amount: 0, paid: 0 }
    }
    acc[cat].amount += expense.amount
    if (expense.status === "paid") {
      acc[cat].paid += expense.amount
    } else {
      acc[cat].paid += expense.deposit || 0
    }
    return acc
  }, {} as Record<string, { amount: number; paid: number }>)
  
  const budgetItems = Object.entries(categoryTotals).map(([category, data], index) => ({
    id: String(index + 1),
    category,
    amount: data.amount,
    paid: data.paid,
  }))

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md fixed-header-safe">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <ModeSwitch currentMode="wedding" />
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-6 h-6 text-[#4E5968]" strokeWidth={1.8} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#3182F6] rounded-full" />
              )}
            </button>
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              mode="wedding"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 px-5 space-y-5 max-w-md mx-auto">
        {/* Hero Section - D-Day Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-weve">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[13px] text-[#8B95A1] mb-1">{coupleNames.my} & {coupleNames.partner}의 웨딩</p>
              <h1 className="text-[32px] font-bold text-[#191F28] tracking-tight">
                D-{dday}
              </h1>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
              <Heart className="w-7 h-7 text-pink-400" fill="#f9a8d4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-[#4E5968] mb-2">
            <MapPin className="w-4 h-4 text-[#8B95A1]" />
            <span>
              {weddingDate ? new Date(weddingDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "날짜 미정"} | {venueName || "예식장 미정"}
            </span>
            <button
              onClick={() => {
                setEditWeddingDate(weddingDate)
                setEditVenueName(venueName)
                setShowEditWeddingModal(true)
              }}
              className="ml-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
              data-testid="button-edit-wedding-info"
            >
              <Pencil className="w-3.5 h-3.5 text-[#8B95A1]" />
            </button>
          </div>
          {daysTogether > 0 && (
            <p className="text-[13px] text-pink-500 mb-4">
              💕 함께한 지 {daysTogether.toLocaleString()}일
            </p>
          )}
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-[#8B95A1]">준비 진행률</span>
              <span className="text-[13px] font-bold text-[#3182F6]">{checklistProgress}%</span>
            </div>
            <div className="h-2.5 bg-[#F2F4F6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3182F6] to-[#5BA0F9] rounded-full transition-all duration-500" 
                style={{ width: `${checklistProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="glass-menu rounded-[24px] p-4 grid grid-cols-4 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.id}
                href={action.href}
                className="glass-menu-item flex flex-col items-center gap-2 py-3 rounded-[16px] hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <div className={`w-14 h-14 rounded-full ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[12px] font-medium text-[#4E5968] dark:text-[#ccc] text-center">{action.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Travel Entry Card - only shows when there's an upcoming trip */}
        {upcomingTravel && (
          <TravelEntryCard 
            mode="wedding" 
            trip={{
              id: String(upcomingTravel.id),
              destination: upcomingTravel.destination,
              startDate: upcomingTravel.startDate,
              endDate: upcomingTravel.endDate
            }}
          />
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E8EB] -mx-5 px-5 sticky top-[52px] bg-[#F2F4F6] z-40 pt-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 pb-3 text-[15px] font-bold transition-colors ${
              activeTab === "all"
                ? "text-[#191F28] border-b-2 border-[#191F28]"
                : "text-[#8B95A1] border-b-2 border-transparent"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 pb-3 text-[15px] font-medium transition-colors ${
              activeTab === "progress"
                ? "text-[#191F28] border-b-2 border-[#191F28]"
                : "text-[#8B95A1] border-b-2 border-transparent"
            }`}
          >
            준비중
          </button>
          <button
            onClick={() => setActiveTab("done")}
            className={`flex-1 pb-3 text-[15px] font-medium transition-colors ${
              activeTab === "done"
                ? "text-[#191F28] border-b-2 border-[#191F28]"
                : "text-[#8B95A1] border-b-2 border-transparent"
            }`}
          >
            완료
          </button>
        </div>

        {/* Checklist Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28]">웨딩 체크리스트</h3>
              <p className="text-[12px] text-[#8B95A1] mt-0.5">진행률 {checklistProgress}%</p>
            </div>
            <Link href="/wedding/checklist" className="text-[13px] font-medium text-[#3182F6]">
              전체보기
            </Link>
          </div>
          <div className="space-y-1">
            {displayItems.length > 0 ? (
              displayItems.map((item) => {
                const catInfo = categoryIcons[item.category] || categoryIcons["기타"]
                const dueDate = new Date(item.dueDate)
                const formattedDate = dueDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
                
                return (
                  <div key={item.id} className="flex items-center py-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className="mr-3 flex-shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-[#FF8A80]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#D1D6DB]" />
                      )}
                    </button>
                    
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-full ${catInfo.bg} flex items-center justify-center mr-3 flex-shrink-0`}>
                      {catInfo.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-[15px] font-medium truncate ${
                        item.completed ? "text-[#B0B8C1] line-through" : "text-[#333D4B]"
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-[12px] text-[#8B95A1] mt-0.5">{formattedDate}</div>
                    </div>
                    
                    {/* Priority Badge */}
                    {item.priority === "high" && !item.completed && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-bold rounded">
                        급함
                      </span>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="py-6 text-center text-[14px] text-[#8B95A1]">
                모든 할 일을 완료했습니다!
              </div>
            )}
          </div>
          
          {/* Add Button */}
          <Link
            href="/wedding/checklist"
            className="flex items-center justify-center gap-1 mt-4 pt-4 border-t border-[#F2F4F6] text-[14px] font-medium text-[#8B95A1] hover:text-[#4E5968] transition-colors"
          >
            + 할 일 추가하기
          </Link>
        </div>

        {/* Budget Card - Main */}
        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#3182F6] flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" fill="white" />
              </div>
              <span className="font-bold text-[15px] text-[#333D4B]">결혼 비용</span>
            </div>
            <Link href="/wedding/budget">
              <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
            </Link>
          </div>
          {totalBudget > 0 ? (
            <>
              <div className="mt-3 mb-2">
                <span className="text-[26px] font-bold text-[#191F28] tracking-tight">
                  {totalBudget.toLocaleString()}
                </span>
                <span className="text-[20px] font-bold text-[#191F28]">원</span>
              </div>
              
              {/* Budget Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[13px] text-[#8B95A1]">사용 {spentPercent}%</span>
                  <span className="text-[13px] text-[#8B95A1]">
                    남은 금액 {remaining.toLocaleString()}원
                  </span>
                </div>
                <div className="h-2 bg-[#F2F4F6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#3182F6] rounded-full transition-all duration-500"
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2.5">
                <Link 
                  href="/wedding/budget"
                  className="flex-1 bg-[#F2F4F6] hover:bg-gray-200 text-[#4E5968] font-semibold py-3 rounded-[12px] text-[15px] transition-colors text-center"
                >
                  예산 관리
                </Link>
                <button 
                  onClick={() => setShowExpenseModal(true)}
                  className="flex-1 bg-[#3182F6] hover:bg-[#1B64DA] text-white font-semibold py-3 rounded-[12px] text-[15px] transition-colors text-center"
                >
                  지출 기록
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <button 
                onClick={() => setShowBudgetSetupModal(true)}
                className="text-[15px] text-[#3182F6] hover:text-[#1B64DA] font-medium underline underline-offset-2 transition-colors"
                data-testid="button-set-budget"
              >
                예산비용이 정해졌나요?
              </button>
            </div>
          )}
        </div>

        {/* Budget List Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28] mb-1">결혼 비용 리스트</h3>
              <p className="text-[13px] text-[#8B95A1]">카테고리별 예산 현황</p>
            </div>
            <div className="bg-blue-50 text-[#3182F6] px-2 py-1 rounded-[6px] text-[11px] font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              예산 내
            </div>
          </div>

          <div className="space-y-3">
            {budgetItems.length > 0 ? (
              budgetItems.map((item) => {
                const percent = item.amount > 0 ? Math.round((item.paid / item.amount) * 100) : 0
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[14px] font-medium text-[#333D4B]">{item.category}</span>
                        <span className="text-[13px] text-[#8B95A1]">
                          {item.paid.toLocaleString()} / {item.amount.toLocaleString()}원
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#F2F4F6] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent >= 100 ? "bg-green-500" : percent >= 50 ? "bg-[#3182F6]" : "bg-[#B0B8C1]"
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-[13px] font-bold min-w-[40px] text-right ${
                      percent >= 100 ? "text-green-500" : "text-[#3182F6]"
                    }`}>
                      {percent}%
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-6 text-[14px] text-[#8B95A1]">
                아직 등록된 지출이 없습니다
              </div>
            )}
          </div>

          <Link 
            href="/wedding/budget"
            className="flex items-center justify-center gap-1 mt-4 pt-4 border-t border-[#F2F4F6] text-[14px] text-[#8B95A1] hover:text-[#4E5968] transition-colors"
          >
            전체 예산 관리
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Monthly Spending Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28] mb-1">이번 달 지출</h3>
              <p className="text-[13px] text-[#8B95A1]">
                {new Date().toLocaleDateString("ko-KR", { month: "long" })} 실시간
              </p>
            </div>
            {thisMonthSpent > 0 && (
              <div className="bg-blue-50 text-[#3182F6] px-2 py-1 rounded-[6px] text-[11px] font-bold">
                실시간
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-[22px] font-bold text-[#191F28]">{thisMonthSpent.toLocaleString()}</span>
              <span className="text-[16px] font-bold text-[#191F28]">원</span>
            </div>
            <div className="w-10 h-10 bg-[#F2F4F6] rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#8B95A1]" />
            </div>
          </div>
        </div>

        {/* Ad Banner */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-weve">
          <div 
            className="w-full h-32 bg-gray-100 bg-cover bg-center relative"
            style={{ 
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-[4px]">
              <span className="text-[10px] text-white font-bold">AD</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-bold">Special Offer</span>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">스튜디오 특가</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">커플 촬영 패키지 오픈</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </div>
        </div>
      </main>

      {/* Expense Add Modal */}
      <BottomSheet open={showExpenseModal} onOpenChange={setShowExpenseModal} className="bg-white z-[60]" overlayClassName="z-[60]" showHandle={false}>
            <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-[#F2F4F6]">
              <h3 className="text-[19px] font-bold text-[#191F28]">지출 기록</h3>
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">내용</label>
                <input
                  type="text"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                  placeholder="어디에 사용했나요?"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">금액</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: formatAmountInput(e.target.value)})}
                    placeholder="0"
                    className="flex-1 px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[18px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] text-right"
                  />
                  <span className="text-[15px] text-[#8B95A1]">원</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">카테고리</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewExpense({...newExpense, category: cat})}
                      className={`px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
                        newExpense.category === cat 
                          ? "bg-[#3182F6] text-white" 
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payer */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제자</label>
                <div className="flex gap-2">
                  {[
                    { key: "groom", label: "신랑" },
                    { key: "bride", label: "신부" },
                    { key: "shared", label: "공동" },
                    { key: "parents", label: "양가" },
                  ].map(p => (
                    <button
                      key={p.key}
                      onClick={() => setNewExpense({...newExpense, payer: p.key as "groom" | "bride" | "shared" | "parents"})}
                      className={`flex-1 py-2.5 rounded-[10px] text-[13px] font-medium transition-all ${
                        newExpense.payer === p.key 
                          ? "bg-[#3182F6] text-white" 
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제 수단</label>
                <div className="flex gap-2">
                  {[
                    { key: "card", label: "카드", icon: CreditCard },
                    { key: "cash", label: "현금", icon: Banknote },
                    { key: "transfer", label: "이체", icon: ArrowRightLeft },
                  ].map(m => (
                    <button
                      key={m.key}
                      onClick={() => setNewExpense({...newExpense, method: m.key as "cash" | "card" | "transfer"})}
                      className={`flex-1 py-3 rounded-[10px] text-[13px] font-medium transition-all flex flex-col items-center gap-1 ${
                        newExpense.method === m.key 
                          ? "bg-[#3182F6] text-white" 
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      <m.icon className="w-5 h-5" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.title || !newExpense.amount}
                className={`w-full py-4 rounded-[14px] font-semibold text-[16px] transition-all ${
                  newExpense.title && newExpense.amount 
                    ? "bg-[#3182F6] text-white hover:bg-[#1B64DA]" 
                    : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                }`}
              >
                저장하기
              </button>
            </div>
            
            <div className="h-8" />
      </BottomSheet>

      {/* Budget Setup Modal */}
      {showBudgetSetupModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setShowBudgetSetupModal(false)} 
          />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-[#191F28]">예산 설정</h2>
              <button 
                onClick={() => setShowBudgetSetupModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                data-testid="button-close-budget-modal"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">총 예산 (원)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
                  <input
                    type="text"
                    value={budgetInput ? Number(budgetInput).toLocaleString() : ""}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^\d]/g, "")
                      setBudgetInput(num)
                    }}
                    placeholder="예: 50,000,000"
                    className="w-full pl-12 pr-12 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                    data-testid="input-total-budget"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B95A1]">원</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (budgetInput) {
                    setTotalBudget(Number(budgetInput))
                    setShowBudgetSetupModal(false)
                    setBudgetInput("")
                  }
                }}
                disabled={!budgetInput}
                className={`w-full py-4 font-bold rounded-[12px] transition-all ${
                  budgetInput 
                    ? "bg-[#3182F6] text-white hover:bg-[#1B64DA]" 
                    : "bg-[#B0B8C1] text-white cursor-not-allowed"
                }`}
                data-testid="button-confirm-budget"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wedding Info Modal */}
      {showEditWeddingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setShowEditWeddingModal(false)} 
          />
          <div className="relative bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[19px] font-bold text-[#191F28]">결혼 정보 수정</h2>
              <button 
                onClick={() => setShowEditWeddingModal(false)}
                className="w-8 h-8 flex items-center justify-center"
                data-testid="button-close-edit-wedding-modal"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">결혼식 날짜</label>
                <WheelDatePicker
                  value={editWeddingDate}
                  onChange={setEditWeddingDate}
                  placeholder="결혼식 날짜 선택"
                  className="!px-4 !py-3.5 !bg-[#F2F4F6] !rounded-[12px] !text-[15px]"
                  label="결혼식 날짜"
                />
              </div>
              
              <div>
                <label className="text-[13px] font-medium text-[#4E5968] mb-1.5 block">예식장</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B95A1]" />
                  <input
                    type="text"
                    value={editVenueName}
                    onChange={(e) => setEditVenueName(e.target.value)}
                    placeholder="예: 더베일, 라비돌웨딩홀"
                    className="w-full pl-12 pr-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                    data-testid="input-edit-venue-name"
                  />
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (editWeddingDate) {
                    setWeddingDate(editWeddingDate)
                    localStorage.setItem("wedding_date", editWeddingDate)
                  }
                  if (editVenueName) {
                    setVenueName(editVenueName)
                    localStorage.setItem("wedding_venue", editVenueName)
                  }
                  setShowEditWeddingModal(false)
                }}
                className="w-full py-4 bg-[#3182F6] text-white font-bold rounded-[12px] hover:bg-[#1B64DA] transition-all"
                data-testid="button-confirm-edit-wedding"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
