"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import {
  CheckCircle2,
  Building2,
  Camera,
  Shirt,
  Gift,
  Users,
  MoreHorizontal,
  Download,
  Sparkles,
  X,
  Mail,
  Mic,
  Video,
  Film,
} from "lucide-react"

type WeddingVendor = {
  id: number
  category: string
  name: string
  status: string | null
}

type Expense = {
  id: number
  vendorId: number | null
  vendorName: string | null
  amount: string
  memo: string | null
  isPaid: boolean
  category: string
}

const categories = [
  "웨딩홀",
  "스튜디오",
  "드레스",
  "2부드레스",
  "메이크업",
  "예복",
  "예물",
  "본식스냅",
  "DVD",
  "식전영상",
  "식중영상",
  "청첩장",
  "사회자",
]

const categoryIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  "웨딩홀": { icon: <Building2 className="w-4 h-4" />, bg: "bg-pink-100 text-pink-500" },
  "스튜디오": { icon: <Camera className="w-4 h-4" />, bg: "bg-indigo-100 text-indigo-500" },
  "드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-purple-100 text-purple-500" },
  "2부드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-fuchsia-100 text-fuchsia-500" },
  "메이크업": { icon: <Sparkles className="w-4 h-4" />, bg: "bg-rose-100 text-rose-500" },
  "예복": { icon: <Shirt className="w-4 h-4" />, bg: "bg-slate-100 text-slate-500" },
  "예물": { icon: <Gift className="w-4 h-4" />, bg: "bg-amber-100 text-amber-500" },
  "본식스냅": { icon: <Camera className="w-4 h-4" />, bg: "bg-cyan-100 text-cyan-500" },
  "DVD": { icon: <Film className="w-4 h-4" />, bg: "bg-violet-100 text-violet-500" },
  "식전영상": { icon: <Video className="w-4 h-4" />, bg: "bg-teal-100 text-teal-500" },
  "식중영상": { icon: <Video className="w-4 h-4" />, bg: "bg-emerald-100 text-emerald-500" },
  "청첩장": { icon: <Mail className="w-4 h-4" />, bg: "bg-blue-100 text-blue-500" },
  "사회자": { icon: <Mic className="w-4 h-4" />, bg: "bg-orange-100 text-orange-500" },
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  done: { label: "완료", bg: "bg-green-50", text: "text-green-600" },
  contracted: { label: "계약완료", bg: "bg-blue-50", text: "text-blue-600" },
  pre_contract: { label: "가계약", bg: "bg-amber-50", text: "text-amber-600" },
  considering: { label: "고민중", bg: "bg-purple-50", text: "text-purple-500" },
  candidate: { label: "후보", bg: "bg-gray-50", text: "text-gray-500" },
}

const getStatusInfo = (status: string | null) => {
  if (!status || !statusConfig[status]) return { label: "미정", bg: "bg-gray-50", text: "text-gray-400" }
  return statusConfig[status]
}

export default function WeddingVendorsProgressPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [vendors, setVendors] = useState<WeddingVendor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expensesList, setExpensesList] = useState<Expense[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  useEffect(() => {
    fetchVendors()
    fetchExpenses()
  }, [])

  const fetchVendors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/wedding/vendors?mode=wedding")
      if (!res.ok) throw new Error("업체 정보를 불러오지 못했어요.")
      const data = await res.json()
      setVendors(data)
    } catch (e) {
      console.error("Failed to fetch wedding vendors progress:", e)
      setError("진행상태를 불러오는 중 오류가 발생했어요.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses?mode=wedding")
      if (!res.ok) { setExpensesList([]); return }
      const data = await res.json()
      if (!Array.isArray(data)) { setExpensesList([]); return }
      setExpensesList(
        data.map((e: Expense) => ({
          id: e.id,
          vendorId: e.vendorId,
          vendorName: e.vendorName,
          amount: e.amount,
          memo: e.memo,
          isPaid: e.isPaid,
          category: e.category,
        })),
      )
    } catch (e) {
      console.error("Failed to fetch expenses:", e)
    }
  }

  type PaymentInfo = {
    deposit: string
    balance: string
    note: string
    method: string
    paidBy: string
  }

  const emptyPayment: PaymentInfo = { deposit: "", balance: "", note: "", method: "", paidBy: "" }

  const parsePaymentMemo = (memo: string | null): PaymentInfo => {
    if (!memo) return { ...emptyPayment }
    try {
      const parsed = JSON.parse(memo)
      return {
        deposit: parsed.deposit || "",
        balance: parsed.balance || "",
        note: parsed.note || "",
        method: parsed.method || "",
        paidBy: parsed.paidBy || "",
      }
    } catch {
      return { ...emptyPayment, note: memo }
    }
  }

  const buildPaymentMemo = (info: Partial<PaymentInfo>) => {
    return JSON.stringify({
      deposit: info.deposit || "",
      balance: info.balance || "",
      note: info.note || "",
      method: info.method || "",
      paidBy: info.paidBy || "",
    })
  }

  const parseAmount = (str: string) => {
    const num = Number(str.replace(/[^0-9]/g, ""))
    return isNaN(num) ? 0 : num
  }

  const calcTotal = (deposit: string, balance: string) => {
    return parseAmount(deposit) + parseAmount(balance)
  }

  const getVendorExpense = (vendorId: number) => {
    return expensesList.find((e) => e.vendorId === vendorId) || null
  }

  const handlePaymentUpdate = async (
    vendor: WeddingVendor,
    updates: { field: keyof PaymentInfo; value: string },
  ) => {
    const currentExpense = getVendorExpense(vendor.id)
    const baseInfo = currentExpense ? parsePaymentMemo(currentExpense.memo) : { ...emptyPayment }
    const nextInfo = { ...baseInfo, [updates.field]: updates.value }
    const memo = buildPaymentMemo(nextInfo)
    const totalAmount = String(calcTotal(nextInfo.deposit, nextInfo.balance))

    setIsSaving(true)
    try {
      if (!currentExpense) {
        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${vendor.category} - ${vendor.name}`,
            amount: totalAmount,
            category: vendor.category,
            vendorId: vendor.id,
            vendorName: vendor.name,
            date: new Date().toISOString(),
            isPaid: false,
            memo,
            mode: "wedding",
          }),
        })
        if (!res.ok) return
        const created = await res.json()
        setExpensesList((prev) => [...prev, created])
      } else {
        const res = await fetch("/api/expenses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentExpense.id, memo, amount: totalAmount }),
        })
        if (!res.ok) return
        const updated = await res.json()
        setExpensesList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      }
    } catch (e) {
      console.error("Failed to update payments:", e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePaid = async (vendor: WeddingVendor) => {
    const currentExpense = getVendorExpense(vendor.id)
    if (!currentExpense) return
    const nextPaid = !currentExpense.isPaid
    setIsSaving(true)
    try {
      const res = await fetch("/api/expenses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentExpense.id, isPaid: nextPaid }),
      })
      if (res.ok) {
        const updated = await res.json()
        setExpensesList((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
      }
    } catch (e) {
      console.error("Failed to toggle paid status:", e)
    } finally {
      setIsSaving(false)
    }
  }

  const exportToExcel = () => {
    const headers = ["구분", "업체명", "상태"]
    const dataRows = rows.map((row) => [row.category, row.name || "미정", row.statusLabel])
    const BOM = "\uFEFF"
    const csvContent = BOM + [headers.join(","), ...dataRows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `업체진행상태_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Build rows
  const rows = categories.map((category) => {
    const contracted = vendors.find((v) => v.category === category && (v.status === "contracted" || v.status === "done"))
    const best = contracted || vendors.find((v) => v.category === category && v.status === "pre_contract")
      || vendors.find((v) => v.category === category)
    const info = getStatusInfo(best?.status ?? null)
    return {
      category,
      name: best?.name || "",
      status: best?.status ?? null,
      statusLabel: info.label,
      statusBg: info.bg,
      statusText: info.text,
      vendorId: best?.id || null,
    }
  })

  // Stats
  const totalCategories = categories.length
  const decidedCount = rows.filter((r) => r.status === "contracted" || r.status === "done").length
  const progressPercent = Math.round((decidedCount / totalCategories) * 100)

  // Contract detail vendors
  const contractVendors = vendors.filter(
    (v) => v.status === "contracted" || v.status === "pre_contract" || v.status === "done",
  )

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="sticky top-0 sticky-header-safe z-50 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">진행상태</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
            >
              <Download className="w-4 h-4 text-[#4E5968]" />
            </button>
            <Link
              href="/wedding/vendors"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3182F6]"
            >
              업체 비교
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-4">
        {/* Progress Summary */}
        <section className="bg-white rounded-[20px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] text-[#8B95A1]">전체 진행률</p>
              <p className="text-[22px] font-bold text-[#191F28]">{decidedCount}<span className="text-[15px] font-normal text-[#8B95A1]"> / {totalCategories}</span></p>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
              background: `conic-gradient(rgb(49, 130, 246) ${progressPercent}%, rgb(75, 75, 75) ${progressPercent}%)`,
            }}>
              <div className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center text-[14px] font-bold text-[#3182F6]">
                {progressPercent}%
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-[#F2F4F6] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3182F6] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {isLoading && <p className="text-[12px] text-[#B0B8C1] mt-2">불러오는 중...</p>}
          {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}
        </section>

        {/* Category Cards */}
        <section className="space-y-2">
          {rows.map((row) => {
            const iconInfo = categoryIcons[row.category] || { icon: <MoreHorizontal className="w-4 h-4" />, bg: "bg-gray-100 text-gray-500" }
            return (
              <button
                key={row.category}
                onClick={() => setSelectedCategory(row.category)}
                className="w-full bg-white rounded-[16px] px-4 py-3.5 shadow-sm flex items-center gap-3 text-left transition-colors active:bg-[#F9FAFB]"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconInfo.bg}`}>
                  {iconInfo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#191F28] truncate">
                    {row.category}
                  </p>
                  <p className="text-[12px] text-[#8B95A1] truncate">
                    {row.name || "아직 선택된 업체가 없어요"}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${row.statusBg} ${row.statusText}`}>
                  {row.statusLabel}
                </span>
              </button>
            )
          })}
        </section>

      </main>

      {/* Category Detail BottomSheet */}
      <BottomSheet
        open={!!selectedCategory}
        onOpenChange={(open) => { if (!open) setSelectedCategory(null) }}
        className="bg-white dark:bg-[#1C1C1E] z-[9999]"
        overlayClassName="z-[9999]"
      >
        {selectedCategory && (() => {
          const categoryVendors = vendors.filter((v) => v.category === selectedCategory)
          const iconInfo = categoryIcons[selectedCategory] || { icon: <MoreHorizontal className="w-4 h-4" />, bg: "bg-gray-100 text-gray-500" }
          return (
            <div className="px-5 pt-2 pb-8 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconInfo.bg}`}>
                    {iconInfo.icon}
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-[#191F28]">{selectedCategory}</h2>
                    <p className="text-[12px] text-[#8B95A1]">후보 {categoryVendors.length}개</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>

              {categoryVendors.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F2F4F6] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-[#B0B8C1]" />
                  </div>
                  <p className="text-[14px] text-[#8B95A1]">아직 등록된 업체가 없어요</p>
                  <p className="text-[12px] text-[#B0B8C1] mt-1">업체 비교에서 추가해 주세요</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryVendors.map((vendor) => {
                    const expense = getVendorExpense(vendor.id)
                    const payments = parsePaymentMemo(expense?.memo ?? null)
                    const info = getStatusInfo(vendor.status)
                    const isContract = vendor.status === "contracted" || vendor.status === "pre_contract" || vendor.status === "done"
                    return (
                      <div key={vendor.id} className="bg-[#F9FAFB] rounded-[16px] p-4 space-y-3">
                        {/* Vendor Row */}
                        <div className="flex items-center justify-between">
                          <p className="text-[15px] font-semibold text-[#191F28]">{vendor.name}</p>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${info.bg} ${info.text}`}>
                            {info.label}
                          </span>
                        </div>

                        {isContract && (
                          <>
                            {/* Payment */}
                            <div className="flex items-center justify-between bg-white rounded-[12px] p-3">
                              <div>
                                <p className="text-[11px] text-[#8B95A1]">총 비용</p>
                                <p className="text-[15px] font-bold text-[#191F28]">
                                  {expense?.amount && Number(expense.amount) > 0
                                    ? `${Number(expense.amount).toLocaleString()}원`
                                    : "-"}
                                </p>
                              </div>
                              <button
                                onClick={() => handleTogglePaid(vendor)}
                                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors ${
                                  expense?.isPaid
                                    ? "bg-green-500 text-white"
                                    : "bg-[#E5E8EB] text-[#8B95A1]"
                                }`}
                              >
                                {expense?.isPaid ? "완납" : "미완납"}
                              </button>
                            </div>

                            {/* Deposit / Balance */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-[11px] text-[#8B95A1] mb-1">계약금</p>
                                <input
                                  defaultValue={payments.deposit}
                                  onBlur={(e) => handlePaymentUpdate(vendor, { field: "deposit", value: e.target.value })}
                                  className="w-full px-3 py-2 rounded-[10px] bg-white border-0 text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                                  placeholder="예: 300,000"
                                />
                              </div>
                              <div>
                                <p className="text-[11px] text-[#8B95A1] mb-1">잔금</p>
                                <input
                                  defaultValue={payments.balance}
                                  onBlur={(e) => handlePaymentUpdate(vendor, { field: "balance", value: e.target.value })}
                                  className="w-full px-3 py-2 rounded-[10px] bg-white border-0 text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                                  placeholder="예: 700,000"
                                />
                              </div>
                            </div>

                            {/* Note */}
                            <div>
                              <p className="text-[11px] text-[#8B95A1] mb-1">비고</p>
                              <textarea
                                defaultValue={payments.note}
                                onBlur={(e) => handlePaymentUpdate(vendor, { field: "note", value: e.target.value })}
                                className="w-full px-3 py-2 rounded-[10px] bg-white border-0 text-[13px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] resize-none min-h-[40px]"
                                placeholder="메모를 입력하세요"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </BottomSheet>

      <WeddingBottomNav />
    </div>
  )
}
