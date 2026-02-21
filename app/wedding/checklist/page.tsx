"use client"

import React, { useState } from "react"
import Link from "next/link"
import WheelDatePicker from "@/components/ui/wheel-date-picker"
import { 
  Plus, 
  X,
  Check,
  Circle,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Trash2,
  Filter,
  Building2,
  Shirt,
  Camera,
  Mail,
  Plane,
  Gift,
  Home,
  MoreHorizontal
} from "lucide-react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { useChecklist, type ChecklistItem } from "@/contexts/checklist-context"

const categories = ["전체", "예식장", "드레스", "스튜디오", "스냅", "청첩장", "허니문", "예물", "혼수", "기타"]

const categoryIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  "예식장": { icon: <Building2 className="w-4 h-4" />, bg: "bg-pink-100 text-pink-500" },
  "드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-purple-100 text-purple-500" },
  "스튜디오": { icon: <Camera className="w-4 h-4" />, bg: "bg-indigo-100 text-indigo-500" },
  "스냅": { icon: <Camera className="w-4 h-4" />, bg: "bg-cyan-100 text-cyan-500" },
  "청첩장": { icon: <Mail className="w-4 h-4" />, bg: "bg-rose-100 text-rose-500" },
  "허니문": { icon: <Plane className="w-4 h-4" />, bg: "bg-blue-100 text-blue-500" },
  "예물": { icon: <Gift className="w-4 h-4" />, bg: "bg-amber-100 text-amber-500" },
  "혼수": { icon: <Home className="w-4 h-4" />, bg: "bg-green-100 text-green-500" },
  "기타": { icon: <MoreHorizontal className="w-4 h-4" />, bg: "bg-gray-100 text-gray-500" },
}

const priorityColors = {
  high: "bg-red-50 text-red-500 border-red-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-gray-50 text-gray-500 border-gray-200",
}

const priorityLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
}

export default function ChecklistPage() {
  const { 
    items, 
    addItem, 
    deleteItem, 
    toggleComplete, 
    completedCount, 
    totalCount, 
    progressPercent 
  } = useChecklist()

  const [activeCategory, setActiveCategory] = useState("전체")
  const [activeFilter, setActiveFilter] = useState<"all" | "todo" | "done">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
    title: "",
    category: "",
    dueDate: "",
    priority: "medium" as "high" | "medium" | "low",
    memo: "",
  })

  // Filter items
  const filteredItems = items.filter(item => {
    const categoryMatch = activeCategory === "전체" || item.category === activeCategory
    const statusMatch = activeFilter === "all" || 
      (activeFilter === "todo" && !item.completed) || 
      (activeFilter === "done" && item.completed)
    return categoryMatch && statusMatch
  })

  // Sort by due date and priority
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  const handleAddItem = () => {
    if (!newItem.title || !newItem.category || !newItem.dueDate) return
    addItem({
      title: newItem.title,
      category: newItem.category,
      dueDate: newItem.dueDate,
      priority: newItem.priority,
      memo: newItem.memo,
      completed: false,
    })
    setShowAddModal(false)
    setNewItem({ title: "", category: "", dueDate: "", priority: "medium", memo: "" })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(dateStr)
    targetDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)}일 지남`
    if (diffDays === 0) return "오늘"
    if (diffDays === 1) return "내일"
    if (diffDays <= 7) return `${diffDays}일 후`
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  const isOverdue = (dateStr: string, completed: boolean) => {
    if (completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(dateStr)
    targetDate.setHours(0, 0, 0, 0)
    return targetDate < today
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      {/* Header */}
      <header className="sticky top-0 sticky-header-safe z-50 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14">
          <h1 className="text-[17px] font-bold text-[#191F28]">체크리스트</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-[#191F28]" />
          </button>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* Progress Card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] text-[#8B95A1]">준비 진행률</p>
              <p className="text-[28px] font-bold text-[#191F28]">{progressPercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] text-[#8B95A1]">완료</p>
              <p className="text-[18px] font-bold text-[#3182F6]">{completedCount}/{totalCount}</p>
            </div>
          </div>
          <div className="h-2.5 bg-[#F2F4F6] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF8A80] to-[#FF6B6B] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 업체 관리 진입 카드 */}
        <section className="bg-white rounded-[20px] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] text-[#8B95A1]">업체 관리</p>
              <p className="text-[15px] font-semibold text-[#191F28]">
                비교 항목과 진행상태를 한 곳에서 확인해요
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/wedding/vendors"
              className="flex items-center gap-2 px-3 py-3 rounded-[14px] border border-[#E5E8EB] bg-[#F9FAFB] active:scale-[0.98] transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-[#E5F0FF] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[#3182F6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#191F28]">업체 비교</span>
                <span className="text-[11px] text-[#8B95A1]">웨딩홀·스튜디오 등 후보 비교</span>
              </div>
            </Link>
            <Link
              href="/wedding/vendors/progress"
              className="flex items-center gap-2 px-3 py-3 rounded-[14px] border border-[#E5E8EB] bg-[#F9FAFB] active:scale-[0.98] transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-[#E7F5FF] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#0CA678]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#191F28]">진행상태</span>
                <span className="text-[11px] text-[#8B95A1]">계약금·잔금·완납 현황 관리</span>
              </div>
            </Link>
          </div>
        </section>

        <>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-[#3182F6] text-white"
                      : "bg-white text-[#4E5968] border border-[#E5E8EB]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex bg-[#F2F4F6] rounded-[12px] p-1">
              {[
                { key: "all", label: "전체", count: items.length },
                { key: "todo", label: "준비중", count: items.filter(i => !i.completed).length },
                { key: "done", label: "완료", count: items.filter(i => i.completed).length },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as "all" | "todo" | "done")}
                  className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
                    activeFilter === filter.key
                      ? "bg-white text-[#191F28] shadow-sm"
                      : "text-[#8B95A1]"
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1 text-[12px] ${
                    activeFilter === filter.key ? "text-[#3182F6]" : "text-[#B0B8C1]"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
              {sortedItems.length > 0 ? (
                <div className="divide-y divide-[#F2F4F6]">
                  {sortedItems.map((item) => {
                    const catInfo = categoryIcons[item.category] || categoryIcons["기타"]
                    const overdue = isOverdue(item.dueDate, item.completed)
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`flex items-center px-5 py-4 ${item.completed ? "bg-[#FAFBFC]" : ""}`}
                      >
                        <button
                          onClick={() => toggleComplete(item.id)}
                          className="mr-4 flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-[#3182F6]" />
                          ) : (
                            <Circle className="w-6 h-6 text-[#D1D6DB]" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[15px] font-medium ${
                              item.completed ? "text-[#B0B8C1] line-through" : "text-[#191F28]"
                            }`}>
                              {item.title}
                            </span>
                            {!item.completed && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${priorityColors[item.priority]}`}>
                                {priorityLabels[item.priority]}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${catInfo.bg}`}>
                              {catInfo.icon}
                              {item.category}
                            </span>
                            <span className={`text-[12px] ${
                              overdue ? "text-red-500 font-medium" : "text-[#8B95A1]"
                            }`}>
                              {formatDate(item.dueDate)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="ml-2 p-2 text-[#B0B8C1] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#B0B8C1]" />
                  </div>
                  <p className="text-[15px] text-[#8B95A1]">
                    {activeFilter === "done" ? "완료된 항목이 없습니다" : "등록된 항목이 없습니다"}
                  </p>
                </div>
              )}
            </div>
        </>
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#3182F6] hover:bg-[#2563EB] rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#E5E8EB]">
            <button onClick={() => setShowAddModal(false)}>
              <X className="w-6 h-6 text-[#8B95A1]" />
            </button>
            <h3 className="text-[17px] font-bold text-[#191F28]">할 일 추가</h3>
            <button 
              onClick={handleAddItem}
              disabled={!newItem.title || !newItem.category || !newItem.dueDate}
              className={`text-[15px] font-semibold transition-colors ${
                newItem.title && newItem.category && newItem.dueDate
                  ? "text-[#3182F6]" 
                  : "text-[#B0B8C1]"
              }`}
            >
              저장
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5 space-y-6 max-h-[calc(100vh-56px)] overflow-y-auto pb-20">
            {/* Title */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">할 일</label>
              <input
                type="text"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="예: 드레스 가봉 예약"
                className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-3">카테고리</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.slice(1).map((cat) => {
                  const catInfo = categoryIcons[cat]
                  if (!catInfo) return null
                  return (
                    <button
                      key={cat}
                      onClick={() => setNewItem({ ...newItem, category: cat })}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-[12px] transition-all ${
                        newItem.category === cat
                          ? "bg-white border-2 border-[#3182F6]"
                          : "bg-[#F2F4F6] border-2 border-transparent"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full ${catInfo.bg} flex items-center justify-center`}>
                        {catInfo.icon}
                      </div>
                      <span className={`text-[11px] font-medium ${
                        newItem.category === cat ? "text-[#191F28]" : "text-[#4E5968]"
                      }`}>{cat}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">마감일</label>
              <WheelDatePicker
                value={newItem.dueDate}
                onChange={(val) => setNewItem({ ...newItem, dueDate: val })}
                placeholder="마감일 선택"
                className="!px-4 !py-3.5 !bg-[#F2F4F6] !rounded-[12px] !text-[15px]"
                label="마감일"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">우선순위</label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setNewItem({ ...newItem, priority })}
                    className={`flex-1 py-3 rounded-[12px] text-[14px] font-medium transition-all border ${
                      newItem.priority === priority
                        ? priorityColors[priority] + " border-2"
                        : "bg-[#F2F4F6] text-[#4E5968] border-transparent"
                    }`}
                  >
                    {priorityLabels[priority]}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-[13px] font-medium text-[#4E5968] mb-2">메모 (선택)</label>
              <textarea
                value={newItem.memo}
                onChange={(e) => setNewItem({ ...newItem, memo: e.target.value })}
                placeholder="추가 메모를 입력하세요"
                rows={3}
                className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </div>
  )
}
