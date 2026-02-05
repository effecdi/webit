"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Plus, 
  X,
  Heart,
  ShoppingBag,
  Check,
  ExternalLink,
  Trash2,
  Tag,
  ChevronRight,
  Gift,
  Sparkles,
  Diamond,
  Gem
} from "lucide-react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"

interface GoodsItem {
  id: string
  name: string
  category: string
  price: number
  link?: string
  image?: string
  status: "wishlist" | "purchased" | "received"
  notes?: string
  forWhom?: "bride" | "groom" | "both" | "guest"
}

const categories = [
  { id: "ring", label: "예물", icon: Diamond },
  { id: "gift", label: "예단", icon: Gift },
  { id: "honeymoon", label: "허니문", icon: Sparkles },
  { id: "decor", label: "웨딩데코", icon: Gem },
  { id: "etc", label: "기타", icon: ShoppingBag },
]

const initialGoods: GoodsItem[] = [
  {
    id: "1",
    name: "까르띠에 러브링 옐로우골드",
    category: "예물",
    price: 3500000,
    status: "purchased",
    forWhom: "bride",
  },
  {
    id: "2",
    name: "까르띠에 러브링 화이트골드",
    category: "예물",
    price: 3200000,
    status: "purchased",
    forWhom: "groom",
  },
  {
    id: "3",
    name: "몽블랑 만년필 세트",
    category: "예단",
    price: 850000,
    status: "wishlist",
    forWhom: "groom",
    notes: "시아버지 선물",
  },
  {
    id: "4",
    name: "발리 허니문 패키지",
    category: "허니문",
    price: 4500000,
    status: "wishlist",
    forWhom: "both",
  },
  {
    id: "5",
    name: "웨딩 포토테이블 세트",
    category: "웨딩데코",
    price: 150000,
    status: "received",
    forWhom: "both",
    notes: "친구 선물",
  },
]

export default function GoodsPage() {
  const [goods, setGoods] = useState<GoodsItem[]>(initialGoods)
  const [activeCategory, setActiveCategory] = useState("전체")
  const [activeStatus, setActiveStatus] = useState<"all" | "wishlist" | "purchased" | "received">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "예물",
    price: "",
    link: "",
    notes: "",
    forWhom: "both" as const,
  })

  const filteredGoods = goods.filter(item => {
    const categoryMatch = activeCategory === "전체" || item.category === activeCategory
    const statusMatch = activeStatus === "all" || item.status === activeStatus
    return categoryMatch && statusMatch
  })

  const totalWishlist = goods.filter(g => g.status === "wishlist").reduce((sum, g) => sum + g.price, 0)
  const totalPurchased = goods.filter(g => g.status === "purchased").reduce((sum, g) => sum + g.price, 0)

  const formatPrice = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num ? Number(num).toLocaleString() : ""
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return
    
    const item: GoodsItem = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price.replace(/,/g, "")),
      link: newItem.link || undefined,
      notes: newItem.notes || undefined,
      status: "wishlist",
      forWhom: newItem.forWhom,
    }
    setGoods([item, ...goods])
    setShowAddModal(false)
    setNewItem({ name: "", category: "예물", price: "", link: "", notes: "", forWhom: "both" })
  }

  const updateStatus = (id: string, status: GoodsItem["status"]) => {
    setGoods(goods.map(g => g.id === id ? { ...g, status } : g))
  }

  const deleteItem = (id: string) => {
    setGoods(goods.filter(g => g.id !== id))
  }

  const statusConfig = {
    wishlist: { label: "위시리스트", bg: "bg-pink-50", text: "text-pink-500", icon: Heart },
    purchased: { label: "구매완료", bg: "bg-blue-50", text: "text-blue-600", icon: Check },
    received: { label: "선물받음", bg: "bg-amber-50", text: "text-amber-600", icon: Gift },
  }

  const forWhomLabels: Record<string, string> = {
    bride: "신부용",
    groom: "신랑용",
    both: "공동",
    guest: "하객선물",
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-24">
      {/* Header */}
      <header className="bg-white px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/wedding" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[20px] font-bold text-[#191F28]">웨딩 굿즈</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8A80] hover:bg-[#FF6B6B] transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[20px] p-5 text-white">
          <p className="text-[13px] text-white/80 mb-1">웨딩 굿즈</p>
          <p className="text-[28px] font-bold mb-4">총 {goods.length}개</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-white/20 rounded-[12px] p-3">
              <p className="text-[11px] text-white/80 mb-1">위시리스트</p>
              <p className="text-[16px] font-bold">{(totalWishlist / 10000).toFixed(0)}만원</p>
            </div>
            <div className="flex-1 bg-white/20 rounded-[12px] p-3">
              <p className="text-[11px] text-white/80 mb-1">구매완료</p>
              <p className="text-[16px] font-bold">{(totalPurchased / 10000).toFixed(0)}만원</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("전체")}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === "전체"
                ? "bg-[#191F28] text-white"
                : "bg-white text-[#4E5968]"
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.label
                  ? "bg-[#191F28] text-white"
                  : "bg-white text-[#4E5968]"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(["all", "wishlist", "purchased", "received"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                activeStatus === status
                  ? "bg-[#4E5968] text-white"
                  : "bg-white text-[#8B95A1]"
              }`}
            >
              {status === "all" ? "전체" : statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* Goods List */}
        <div className="space-y-3">
          {filteredGoods.length > 0 ? (
            filteredGoods.map((item) => {
              const StatusIcon = statusConfig[item.status].icon
              return (
                <div key={item.id} className="bg-white rounded-[16px] p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-bold text-[#191F28] line-clamp-1">{item.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 bg-[#F2F4F6] text-[#8B95A1] rounded">
                          {item.category}
                        </span>
                        {item.forWhom && (
                          <span className="text-[11px] text-[#8B95A1]">
                            {forWhomLabels[item.forWhom]}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${statusConfig[item.status].bg} ${statusConfig[item.status].text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[item.status].label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[18px] font-bold text-[#191F28]">
                      {item.price.toLocaleString()}원
                    </p>
                    <div className="flex items-center gap-2">
                      {item.status === "wishlist" && (
                        <button
                          onClick={() => updateStatus(item.id, "purchased")}
                          className="px-3 py-1.5 bg-[#3182F6] text-white text-[12px] font-medium rounded-[8px]"
                        >
                          구매완료
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F4F6]"
                      >
                        <Trash2 className="w-4 h-4 text-[#B0B8C1]" />
                      </button>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-2 pt-2 border-t border-[#F2F4F6] text-[12px] text-[#8B95A1]">
                      {item.notes}
                    </p>
                  )}
                </div>
              )
            })
          ) : (
            <div className="bg-white rounded-[16px] p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-[#E5E8EB] mx-auto mb-3" />
              <p className="text-[14px] text-[#8B95A1]">등록된 굿즈가 없습니다</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-[#8B95A1]" />
              </button>
              <h3 className="text-[17px] font-bold text-[#191F28]">굿즈 추가</h3>
              <button 
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.price}
                className={`text-[15px] font-semibold ${
                  newItem.name && newItem.price ? "text-[#FF8A80]" : "text-[#B0B8C1]"
                }`}
              >
                저장
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">상품명 *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="상품 이름"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">카테고리</label>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setNewItem({ ...newItem, category: cat.label })}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                        newItem.category === cat.label
                          ? "bg-[#191F28] text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">가격 *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: formatPrice(e.target.value) })}
                    placeholder="0"
                    className="flex-1 px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[18px] font-bold text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] text-right"
                  />
                  <span className="text-[15px] text-[#8B95A1]">원</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">대상</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["bride", "groom", "both", "guest"] as const).map((whom) => (
                    <button
                      key={whom}
                      onClick={() => setNewItem({ ...newItem, forWhom: whom })}
                      className={`py-2.5 rounded-[10px] text-[13px] font-medium transition-colors ${
                        newItem.forWhom === whom
                          ? "bg-[#191F28] text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {forWhomLabels[whom]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">링크 (선택)</label>
                <input
                  type="url"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  placeholder="https://"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">메모 (선택)</label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="추가 메모"
                  rows={2}
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80] resize-none"
                />
              </div>
            </div>

            <div className="h-8" />
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </div>
  )
}
