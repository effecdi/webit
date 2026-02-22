"use client"

import React, { Suspense } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { BottomSheet } from '@/components/ui/bottom-sheet'
import WheelDatePicker from "@/components/ui/wheel-date-picker"
import { useSearchParams } from "next/navigation"
import { 
  Download, 
  Plus, 
  X,
  Building2,
  Shirt,
  Plane,
  Gift,
  Home,
  MoreHorizontal,
  Check,
  Bell,
  CreditCard,
  Banknote,
  ArrowRightLeft,
  Camera,
  ChevronRight,
  Trash2,
  Settings
} from "lucide-react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { useBudget, type Expense, type PaymentRecord } from "@/contexts/budget-context"

const categoryIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  "예식장": { icon: <Building2 className="w-5 h-5" />, bg: "bg-pink-100 text-pink-500" },
  "드레스": { icon: <Shirt className="w-5 h-5" />, bg: "bg-purple-100 text-purple-500" },
  "스튜디오": { icon: <Camera className="w-5 h-5" />, bg: "bg-indigo-100 text-indigo-500" },
  "스냅": { icon: <Camera className="w-5 h-5" />, bg: "bg-cyan-100 text-cyan-500" },
  "허니문": { icon: <Plane className="w-5 h-5" />, bg: "bg-blue-100 text-[#3182F6]" },
  "예물": { icon: <Gift className="w-5 h-5" />, bg: "bg-amber-100 text-amber-500" },
  "혼수": { icon: <Home className="w-5 h-5" />, bg: "bg-green-100 text-green-500" },
  "기타": { icon: <MoreHorizontal className="w-5 h-5" />, bg: "bg-gray-100 text-gray-500" },
}

const categories = ["전체", "예식장", "드레스", "스튜디오", "스냅", "허니문", "예물", "기타"]

const payerLabels: Record<string, string> = {
  groom: "신랑 카드",
  bride: "신부 카드", 
  shared: "공동",
  parents: "양가 부모님",
}

export default function BudgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F2F4F6]" />}>
      <BudgetPageContent />
    </Suspense>
  )
}

function BudgetPageContent() {
  const {
    totalBudget,
    setTotalBudget,
    expenses,
    setExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    totalSpent,
    totalScheduled,
    remaining,
    spentPercent,
    scheduledPercent,
  } = useBudget()
  
  const [activeCategory, setActiveCategory] = useState("전체")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [swipedId, setSwipedId] = useState<string | null>(null)
  const [partialPayment, setPartialPayment] = useState("")
  const [budgetInput, setBudgetInput] = useState("")
  
  const searchParams = useSearchParams()
  
  // Auto-open add modal if ?add=true
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowAddModal(true)
    }
  }, [searchParams])
  
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    payer: "shared" as "groom" | "bride" | "shared" | "parents",
    status: "paid" as "paid" | "scheduled",
    method: "card" as "cash" | "card" | "transfer",
    deposit: "",
    dueDate: "",
    reminder: true,
    memo: "",
  })

  // Filter expenses
  const filteredExpenses = activeCategory === "전체" 
    ? expenses 
    : expenses.filter(e => e.category === activeCategory)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const handleAddExpense = () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) return

    const amount = Number(newExpense.amount.replace(/,/g, ""))
    const deposit = newExpense.deposit ? Number(newExpense.deposit.replace(/,/g, "")) : 0

    const initialPayments: PaymentRecord[] = []
    if (newExpense.status === "scheduled" && deposit > 0) {
      initialPayments.push({ amount: deposit, date: newExpense.date, memo: "계약금" })
    }

    const expense: Expense = {
      id: Date.now().toString(),
      title: newExpense.title,
      amount: amount,
      category: newExpense.category,
      date: newExpense.date,
      payer: newExpense.payer,
      status: newExpense.status,
      method: newExpense.status === "paid" ? newExpense.method : undefined,
      deposit: newExpense.status === "scheduled" ? deposit : undefined,
      balance: newExpense.status === "scheduled" ? amount - deposit : undefined,
      dueDate: newExpense.status === "scheduled" ? newExpense.dueDate : undefined,
      reminder: newExpense.status === "scheduled" ? newExpense.reminder : undefined,
      memo: newExpense.memo || undefined,
      payments: initialPayments.length > 0 ? initialPayments : undefined,
    }

    addExpense(expense)
    setShowAddModal(false)
    setNewExpense({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      payer: "shared",
      status: "paid",
      method: "card",
      deposit: "",
      dueDate: "",
      reminder: true,
      memo: "",
    })
  }

  const isFormValid = () => {
    if (!newExpense.title || !newExpense.amount || !newExpense.category) return false
    if (newExpense.status === "scheduled" && !newExpense.dueDate) return false
    return true
  }

  const formatAmountInput = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num ? Number(num).toLocaleString() : ""
  }

  // Handle partial payment (중간 결제)
  const handlePartialPayment = () => {
    if (!selectedExpense || !partialPayment) return
    const paymentAmount = Number(partialPayment.replace(/,/g, ""))
    if (paymentAmount <= 0) return

    const newBalance = (selectedExpense.balance || 0) - paymentAmount
    const newDeposit = (selectedExpense.deposit || 0) + paymentAmount

    const newRecord: PaymentRecord = {
      amount: paymentAmount,
      date: new Date().toISOString().split("T")[0],
      memo: "중간결제",
    }
    const updatedPayments = [...(selectedExpense.payments || []), newRecord]

    if (newBalance <= 0) {
      // Fully paid
      updateExpense(selectedExpense.id, {
        status: "paid",
        deposit: selectedExpense.amount,
        balance: 0,
        date: new Date().toISOString().split("T")[0],
        method: "card",
        payments: updatedPayments,
      })
    } else {
      updateExpense(selectedExpense.id, {
        deposit: newDeposit,
        balance: newBalance,
        payments: updatedPayments,
      })
    }
    setShowDetailModal(false)
    setPartialPayment("")
    setSelectedExpense(null)
  }

  // Handle full payment (전체 결제 완료)
  const handleFullPayment = () => {
    if (!selectedExpense) return
    setExpenses(expenses.map(e => 
      e.id === selectedExpense.id 
        ? { 
            ...e, 
            status: "paid", 
            deposit: undefined, 
            balance: undefined, 
            dueDate: undefined,
            date: new Date().toISOString().split("T")[0],
            method: "card"
          }
        : e
    ))
    setShowDetailModal(false)
    setSelectedExpense(null)
    setSwipedId(null)
  }

  // Handle delete expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
    setSwipedId(null)
  }

  // Open detail modal
  const openDetailModal = (expense: Expense) => {
    setSelectedExpense(expense)
    setShowDetailModal(true)
    setPartialPayment("")
    setSwipedId(null)
  }

  const exportToExcel = () => {
    const methodLabels: Record<string, string> = {
      cash: "현금",
      card: "카드",
      transfer: "이체",
    }
    
    const statusLabels: Record<string, string> = {
      paid: "결제완료",
      scheduled: "예정",
    }

    const headers = ["업체ID", "업체명", "날짜", "카테고리", "내용", "금액", "상태", "결제자", "결제수단", "계약금", "잔금", "결제예정일", "메모"]
    
    const rows = expenses.map(e => [
      e.vendorId ?? "",
      e.vendorName ?? "",
      e.date,
      e.category,
      e.title,
      e.amount,
      statusLabels[e.status],
      payerLabels[e.payer],
      e.method ? methodLabels[e.method] : "",
      e.deposit || "",
      e.balance || "",
      e.dueDate || "",
      e.memo || "",
    ])

    // Add summary row
    rows.push([])
    rows.push(["=== 요약 ==="])
    rows.push(["총 예산", "", "", totalBudget])
    rows.push(["사용 금액", "", "", totalSpent])
    rows.push(["예정 금액", "", "", totalScheduled])
    rows.push(["남은 금액", "", "", remaining])

    // Convert to CSV string with BOM for Excel Korean support
    const BOM = "\uFEFF"
    const csvContent = BOM + [
      headers.join(","),
      ...rows.map(row => row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma
        const str = String(cell)
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }).join(","))
    ].join("\n")

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `결혼예산_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToPdf = () => {
    if (typeof window === "undefined") return
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      {/* Header */}
      <header className="sticky top-0 sticky-header-safe z-50 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between h-14 px-5 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">예산 관리</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={exportToExcel}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
            >
              <Download className="w-4 h-4 text-[#4E5968]" />
            </button>
            <button
              onClick={exportToPdf}
              className="px-3 py-1.5 rounded-full border border-[#E5E8EB] text-[11px] text-[#4E5968]"
            >
              PDF
            </button>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* Total Summary Card or Empty State */}
        {totalBudget === 0 ? (
          <div className="bg-white rounded-[24px] p-6 shadow-weve">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-5 h-5 rounded-full bg-[#3182F6] flex items-center justify-center">
                <Banknote className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-[15px] text-[#333D4B]">총 예산</span>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => setShowBudgetModal(true)}
                className="text-[15px] text-[#3182F6] hover:text-[#1B64DA] font-medium underline underline-offset-2 transition-colors"
                data-testid="button-set-budget"
              >
                예산비용이 정해졌나요?
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] p-6 shadow-weve">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[13px] text-[#8B95A1]">총 예산</p>
              <button 
                onClick={() => {
                  setBudgetInput(totalBudget.toLocaleString())
                  setShowBudgetModal(true)
                }}
                className="flex items-center gap-1 text-[12px] text-[#8B95A1] hover:text-[#4E5968] transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                수정
              </button>
            </div>
            <div className="mb-4">
              <span className="text-[32px] font-bold text-[#191F28] tracking-tight">
                {totalBudget.toLocaleString()}
              </span>
              <span className="text-[22px] font-bold text-[#191F28]">원</span>
            </div>

            {/* Progress Bar - Stacked */}
            <div className="h-3 bg-[#E5E8EB] rounded-full overflow-hidden mb-4 flex">
              <div 
                className="h-full bg-[#FF8A80] transition-all duration-500"
                style={{ width: `${spentPercent}%` }}
              />
              <div 
                className="h-full bg-[#FFD4A3] transition-all duration-500"
                style={{ width: `${scheduledPercent}%` }}
              />
            </div>

            {/* Stats - 3 columns */}
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF8A80]" />
                  <p className="text-[12px] text-[#8B95A1]">사용</p>
                </div>
                <p className="text-[16px] font-bold text-[#FF8A80]">
                  {(totalSpent / 10000).toFixed(0)}만원
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-0.5 justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FFD4A3]" />
                  <p className="text-[12px] text-[#8B95A1]">예정</p>
                </div>
                <p className="text-[16px] font-bold text-[#F5A623]">
                  {(totalScheduled / 10000).toFixed(0)}만원
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 mb-0.5 justify-end">
                  <div className="w-2 h-2 rounded-full bg-[#3182F6]" />
                  <p className="text-[12px] text-[#8B95A1]">남음</p>
                </div>
                <p className="text-[16px] font-bold text-[#3182F6]">
                  {(remaining / 10000).toFixed(0)}만원
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                activeCategory === cat
                  ? "bg-white text-[#3182F6] border-2 border-[#3182F6] shadow-sm"
                  : "bg-white text-[#8B95A1] border border-[#E5E8EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-[24px] shadow-weve overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F2F4F6]">
            <h3 className="text-[17px] font-bold text-[#191F28]">지출 내역</h3>
            <button 
              onClick={exportToExcel}
              className="text-[13px] text-[#8B95A1] flex items-center gap-1 hover:text-[#4E5968] transition-colors"
            >
              <Download className="w-4 h-4" />
              엑셀 저장
            </button>
          </div>

          <div className="divide-y divide-[#F2F4F6]">
            {filteredExpenses.map((expense) => {
              const catInfo = categoryIcons[expense.category] || categoryIcons["기타"]
              const isSwiped = swipedId === expense.id
              
              return (
                <div key={expense.id} className="relative overflow-hidden">
                  {/* Swipe Actions (Right side reveal) */}
                  <div className="absolute right-0 top-0 bottom-0 flex">
                    {expense.status === "scheduled" && (
                      <button
                        onClick={() => openDetailModal(expense)}
                        className="w-20 h-full bg-[#3182F6] flex flex-col items-center justify-center text-white"
                      >
                        <Check className="w-5 h-5 mb-1" />
                        <span className="text-[11px]">결제</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="w-20 h-full bg-[#FF6B6B] flex flex-col items-center justify-center text-white"
                    >
                      <Trash2 className="w-5 h-5 mb-1" />
                      <span className="text-[11px]">삭제</span>
                    </button>
                  </div>

                  {/* Main Content - Swipeable */}
                  <div 
                    className={`flex items-center px-5 py-4 bg-white transition-transform duration-200 ${
                      isSwiped ? (expense.status === "scheduled" ? "-translate-x-40" : "-translate-x-20") : "translate-x-0"
                    }`}
                    onClick={() => {
                      if (isSwiped) {
                        setSwipedId(null)
                      } else {
                        openDetailModal(expense)
                      }
                    }}
                    onTouchStart={(e) => {
                      const touch = e.touches[0]
                      const startX = touch.clientX
                      const handleTouchMove = (moveEvent: TouchEvent) => {
                        const moveX = moveEvent.touches[0].clientX
                        const diff = startX - moveX
                        if (diff > 50) {
                          setSwipedId(expense.id)
                        } else if (diff < -50) {
                          setSwipedId(null)
                        }
                      }
                      const handleTouchEnd = () => {
                        document.removeEventListener("touchmove", handleTouchMove)
                        document.removeEventListener("touchend", handleTouchEnd)
                      }
                      document.addEventListener("touchmove", handleTouchMove)
                      document.addEventListener("touchend", handleTouchEnd)
                    }}
                  >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-[12px] ${catInfo.bg} flex items-center justify-center mr-4 flex-shrink-0`}>
                      {catInfo.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-[#191F28] truncate">{expense.title}</p>
                      <p className="text-[12px] text-[#8B95A1] mt-0.5">
                        {formatDate(expense.date)} • {payerLabels[expense.payer]}
                      </p>
                    </div>

                    {/* Amount & Status */}
                    <div className="text-right ml-3 flex-shrink-0">
                      {expense.status === "paid" ? (
                        <>
                          <p className="text-[15px] font-bold text-[#191F28]">
                            -{expense.amount.toLocaleString()}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-green-50 text-green-600">
                            결제완료
                          </span>
                        </>
                      ) : (
                        <>
                          <p className="text-[15px] font-bold text-[#191F28]">
                            {expense.amount.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-[#FF8A80] mt-0.5">
                            잔금 {expense.balance?.toLocaleString()}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-amber-50 text-[#F5A623]">
                            {expense.dueDate && new Date(expense.dueDate).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })} 예정
                          </span>
                        </>
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="w-5 h-5 text-[#B0B8C1] ml-1 flex-shrink-0" />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredExpenses.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#B0B8C1]" />
              </div>
              <p className="text-[14px] text-[#8B95A1] mb-1">아직 지출 내역이 없어요</p>
              <p className="text-[12px] text-[#B0B8C1]">+ 버튼을 눌러 지출을 등록해보세요</p>
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#3182F6] hover:bg-[#2563EB] rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Add Expense Modal - Full Screen */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#E5E8EB]">
            <button onClick={() => setShowAddModal(false)}>
              <X className="w-6 h-6 text-[#8B95A1]" />
            </button>
            <h3 className="text-[17px] font-bold text-[#191F28]">지출 등록</h3>
            <button 
              onClick={handleAddExpense}
              disabled={!isFormValid()}
              className={`text-[15px] font-semibold transition-colors ${
                isFormValid() ? "text-[#3182F6]" : "text-[#B0B8C1]"
              }`}
            >
              저장
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5 space-y-6 max-h-[calc(100vh-56px)] overflow-y-auto pb-20">
            
            {/* Category Selection Grid */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-3">어떤 카테고리인가요?</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.slice(1).map((cat) => {
                  const catInfo = categoryIcons[cat]
                  if (!catInfo) return null
                  return (
                    <button
                      key={cat}
                      onClick={() => setNewExpense({ ...newExpense, category: cat })}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] transition-all ${
                        newExpense.category === cat
                          ? "bg-white border-2 border-[#3182F6]"
                          : "bg-[#F2F4F6] border-2 border-transparent"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${catInfo.bg} flex items-center justify-center`}>
                        {catInfo.icon}
                      </div>
                      <span className={`text-[11px] font-medium ${
                        newExpense.category === cat ? "text-[#191F28]" : "text-[#4E5968]"
                      }`}>{cat}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">항목명</label>
              <input
                type="text"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                placeholder="예: 빌라 드 지디 계약금"
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
              />
            </div>

            {/* Total Cost - Large Number */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">총 금액</label>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: formatAmountInput(e.target.value) })}
                  placeholder="0"
                  className="flex-1 text-[32px] font-bold text-[#191F28] placeholder:text-[#E5E8EB] focus:outline-none border-b-2 border-[#E5E8EB] focus:border-[#3182F6] pb-1 transition-colors text-right"
                />
                <span className="text-[18px] font-medium text-[#8B95A1] pb-2">원</span>
              </div>
            </div>

            {/* Payment Status - Segmented Control */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제 상태</label>
              <div className="flex bg-[#F2F4F6] rounded-[12px] p-1">
                <button
                  onClick={() => setNewExpense({ ...newExpense, status: "paid" })}
                  className={`flex-1 py-3 rounded-[10px] text-[14px] font-semibold transition-all ${
                    newExpense.status === "paid"
                      ? "bg-white text-[#191F28] shadow-sm"
                      : "text-[#8B95A1]"
                  }`}
                >
                  결제 완료
                </button>
                <button
                  onClick={() => setNewExpense({ ...newExpense, status: "scheduled" })}
                  className={`flex-1 py-3 rounded-[10px] text-[14px] font-semibold transition-all ${
                    newExpense.status === "scheduled"
                      ? "bg-white text-[#191F28] shadow-sm"
                      : "text-[#8B95A1]"
                  }`}
                >
                  예정/잔금
                </button>
              </div>
            </div>

            {/* If Paid - Payment Details */}
            {newExpense.status === "paid" && (
              <>
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제일</label>
                  <WheelDatePicker
                    value={newExpense.date}
                    onChange={(val) => setNewExpense({ ...newExpense, date: val })}
                    placeholder="결제일 선택"
                    className="!px-4 !py-3.5 !rounded-[12px] !text-[15px]"
                    label="결제일"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제 수단</label>
                  <div className="flex gap-2">
                    {([
                      { key: "card", label: "카드", icon: <CreditCard className="w-4 h-4" /> },
                      { key: "transfer", label: "이체", icon: <ArrowRightLeft className="w-4 h-4" /> },
                      { key: "cash", label: "현금", icon: <Banknote className="w-4 h-4" /> },
                    ] as const).map((method) => (
                      <button
                        key={method.key}
                        onClick={() => setNewExpense({ ...newExpense, method: method.key })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                          newExpense.method === method.key
                            ? "bg-[#3182F6] text-white"
                            : "bg-[#F2F4F6] text-[#4E5968]"
                        }`}
                      >
                        {method.icon}
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* If Scheduled - Deposit & Balance */}
            {newExpense.status === "scheduled" && (
              <>
                {/* Deposit */}
                <div className="bg-[#FFF5F5] rounded-[16px] p-4 space-y-4">
                  <p className="text-[13px] font-semibold text-[#FF8A80]">계약금/잔금 상세</p>
                  
                  <div>
                    <label className="block text-[12px] text-[#8B95A1] mb-1">지금까지 낸 금액 (계약금)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={newExpense.deposit}
                        onChange={(e) => setNewExpense({ ...newExpense, deposit: formatAmountInput(e.target.value) })}
                        placeholder="0"
                        className="flex-1 px-3 py-2.5 bg-white rounded-[10px] text-[15px] font-medium text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] text-right"
                      />
                      <span className="text-[14px] text-[#8B95A1]">원</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] text-[#8B95A1] mb-1">남은 잔금 (자동 계산)</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2.5 bg-[#F2F4F6] rounded-[10px] text-[15px] font-bold text-[#FF8A80] text-right">
                        {(() => {
                          const total = Number(newExpense.amount.replace(/,/g, "") || 0)
                          const deposit = Number(newExpense.deposit.replace(/,/g, "") || 0)
                          return (total - deposit).toLocaleString()
                        })()}
                      </div>
                      <span className="text-[14px] text-[#8B95A1]">원</span>
                    </div>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">잔금 결제 예정일</label>
                  <WheelDatePicker
                    value={newExpense.dueDate}
                    onChange={(val) => setNewExpense({ ...newExpense, dueDate: val })}
                    placeholder="예정일 선택"
                    className="!px-4 !py-3.5 !rounded-[12px] !text-[15px]"
                    label="잔금 결제 예정일"
                  />
                </div>

                {/* Reminder Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#FF8A80]" />
                    <span className="text-[15px] text-[#191F28]">3일 전 알림 받기</span>
                  </div>
                  <button
                    onClick={() => setNewExpense({ ...newExpense, reminder: !newExpense.reminder })}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      newExpense.reminder ? "bg-[#FF8A80]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      newExpense.reminder ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </>
            )}

            {/* Payer */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">결제자</label>
              <div className="grid grid-cols-2 gap-2">
                {(["groom", "bride", "shared", "parents"] as const).map((payer) => (
                  <button
                    key={payer}
                    onClick={() => setNewExpense({ ...newExpense, payer })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                      newExpense.payer === payer
                        ? "bg-[#3182F6] text-white"
                        : "bg-[#F2F4F6] text-[#4E5968]"
                    }`}
                  >
                    {newExpense.payer === payer && <Check className="w-4 h-4" />}
                    {payerLabels[payer]}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">메모 (선택)</label>
              <textarea
                value={newExpense.memo}
                onChange={(e) => setNewExpense({ ...newExpense, memo: e.target.value })}
                placeholder="추가 메모를 입력하세요"
                rows={2}
                className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Detail Modal - Bottom Sheet */}
      <BottomSheet open={!!(showDetailModal && selectedExpense)} onOpenChange={(open) => { if (!open) { setShowDetailModal(false); setSelectedExpense(null); setPartialPayment("") }}} className="bg-white z-[60]" overlayClassName="z-[60]">
            {selectedExpense && (<>
            {/* Header */}
            <div className="px-6 pb-4 border-b border-[#F2F4F6]">
              <h3 className="text-[19px] font-bold text-[#191F28]">{selectedExpense.title}</h3>
              <p className="text-[13px] text-[#8B95A1] mt-1">{selectedExpense.category} • {payerLabels[selectedExpense.payer]}</p>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-5">
              {/* Amount Summary */}
              <div className="bg-[#F8F9FA] rounded-[16px] p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#8B95A1]">총 금액</span>
                  <span className="text-[16px] font-bold text-[#191F28]">{selectedExpense.amount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#8B95A1]">납부 완료</span>
                  <span className="text-[16px] font-semibold text-[#3182F6]">{(selectedExpense.deposit || 0).toLocaleString()}원</span>
                </div>
                <div className="h-px bg-[#E5E8EB]" />
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#FF6B6B]">남은 잔금</span>
                  <span className="text-[18px] font-bold text-[#FF6B6B]">{(selectedExpense.balance || 0).toLocaleString()}원</span>
                </div>
                {selectedExpense.dueDate && (
                  <p className="text-[12px] text-[#8B95A1] pt-1">
                    결제 예정일: {new Date(selectedExpense.dueDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>

              {/* Partial Payment Input */}
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">중간 결제 금액</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={partialPayment}
                    onChange={(e) => setPartialPayment(formatAmountInput(e.target.value))}
                    placeholder="0"
                    className="flex-1 px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[18px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] text-right"
                  />
                  <span className="text-[15px] text-[#8B95A1]">원</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePartialPayment}
                  disabled={!partialPayment}
                  className={`w-full py-4 rounded-[14px] font-semibold text-[16px] transition-all ${
                    partialPayment
                      ? "bg-[#3182F6] text-white hover:bg-[#1B64DA]"
                      : "bg-[#E5E8EB] text-[#B0B8C1] cursor-not-allowed"
                  }`}
                >
                  중간 결제 완료
                </button>

                <button
                  onClick={handleFullPayment}
                  className="w-full py-4 rounded-[14px] bg-[#3182F6] hover:bg-[#1B64DA] text-white font-semibold text-[16px] transition-all"
                >
                  전체 잔금 결제 완료
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedExpense(null)
                    setPartialPayment("")
                  }}
                  className="w-full py-3.5 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] font-semibold text-[15px] hover:bg-[#E5E8EB] transition-all"
                >
                  취소
                </button>
              </div>
            </div>

            {/* Safe Area */}
            <div className="h-8" />
            </>)}
      </BottomSheet>

      {/* Edit Budget Modal */}
      {showBudgetModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowBudgetModal(false)}
        >
          <div 
            className="bg-white rounded-[24px] p-6 w-full max-w-sm animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[19px] font-bold text-[#191F28] mb-4">총 예산 수정</h3>
            
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">예산 금액</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(formatAmountInput(e.target.value))}
                  placeholder="0"
                  className="flex-1 px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[20px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] text-right"
                />
                <span className="text-[15px] text-[#8B95A1]">원</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-3.5 rounded-[14px] bg-[#F2F4F6] text-[#4E5968] font-semibold text-[15px] hover:bg-[#E5E8EB] transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  const newBudget = Number(budgetInput.replace(/,/g, ""))
                  if (newBudget > 0) {
                    setTotalBudget(newBudget)
                  }
                  setShowBudgetModal(false)
                }}
                className="flex-1 py-3.5 rounded-[14px] bg-[#3182F6] text-white font-semibold text-[15px] hover:bg-[#1B64DA] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </div>
  )
}
