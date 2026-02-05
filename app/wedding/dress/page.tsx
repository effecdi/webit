"use client"

import React, { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Plus, 
  X,
  MapPin,
  Phone,
  Calendar,
  Star,
  Heart,
  Clock,
  ChevronRight,
  Camera,
  Check,
  Trash2
} from "lucide-react"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"

interface DressShop {
  id: string
  name: string
  address: string
  phone: string
  visitDate: string
  visitTime: string
  status: "scheduled" | "visited" | "favorite"
  rating?: number
  notes?: string
  photos?: string[]
  dresses?: {
    name: string
    price: number
    liked: boolean
  }[]
}

const initialShops: DressShop[] = [
  {
    id: "1",
    name: "르비엔 브라이덜",
    address: "서울 강남구 압구정로 123",
    phone: "02-1234-5678",
    visitDate: "2025-02-10",
    visitTime: "14:00",
    status: "visited",
    rating: 5,
    notes: "친절하고 드레스 종류가 다양함. 메인 드레스 마음에 듦!",
    dresses: [
      { name: "오프숄더 A라인", price: 800000, liked: true },
      { name: "머메이드 레이스", price: 1200000, liked: false },
    ]
  },
  {
    id: "2",
    name: "웨딩앤드모어",
    address: "서울 서초구 사평대로 456",
    phone: "02-9876-5432",
    visitDate: "2025-02-15",
    visitTime: "11:00",
    status: "scheduled",
  },
  {
    id: "3",
    name: "더화이트 브라이덜",
    address: "서울 강남구 도산대로 789",
    phone: "02-5555-1234",
    visitDate: "2025-02-08",
    visitTime: "15:00",
    status: "favorite",
    rating: 4,
    notes: "분위기 좋고 가격대가 합리적",
    dresses: [
      { name: "클래식 볼가운", price: 950000, liked: true },
    ]
  },
]

export default function DressTourPage() {
  const [shops, setShops] = useState<DressShop[]>(initialShops)
  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "visited" | "favorite">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedShop, setSelectedShop] = useState<DressShop | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [newShop, setNewShop] = useState({
    name: "",
    address: "",
    phone: "",
    visitDate: "",
    visitTime: "",
  })

  const filteredShops = activeTab === "all" 
    ? shops 
    : shops.filter(s => s.status === activeTab)

  const handleAddShop = () => {
    if (!newShop.name || !newShop.visitDate) return
    
    const shop: DressShop = {
      id: Date.now().toString(),
      ...newShop,
      status: "scheduled",
    }
    setShops([shop, ...shops])
    setShowAddModal(false)
    setNewShop({ name: "", address: "", phone: "", visitDate: "", visitTime: "" })
  }

  const updateShopStatus = (id: string, status: DressShop["status"]) => {
    setShops(shops.map(s => s.id === id ? { ...s, status } : s))
  }

  const deleteShop = (id: string) => {
    setShops(shops.filter(s => s.id !== id))
    setShowDetailModal(false)
    setSelectedShop(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", { 
      month: "short", 
      day: "numeric",
      weekday: "short"
    })
  }

  const statusConfig = {
    scheduled: { label: "예정", bg: "bg-blue-50", text: "text-blue-600" },
    visited: { label: "방문완료", bg: "bg-green-50", text: "text-green-600" },
    favorite: { label: "관심샵", bg: "bg-pink-50", text: "text-pink-500" },
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
            <h1 className="text-[20px] font-bold text-[#191F28]">드레스 투어</h1>
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
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-[20px] p-5 text-white">
          <p className="text-[13px] text-white/80 mb-1">드레스샵 투어</p>
          <p className="text-[28px] font-bold mb-4">총 {shops.length}곳</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-white/20 rounded-[12px] p-3 text-center">
              <p className="text-[20px] font-bold">{shops.filter(s => s.status === "scheduled").length}</p>
              <p className="text-[11px] text-white/80">예정</p>
            </div>
            <div className="flex-1 bg-white/20 rounded-[12px] p-3 text-center">
              <p className="text-[20px] font-bold">{shops.filter(s => s.status === "visited").length}</p>
              <p className="text-[11px] text-white/80">방문완료</p>
            </div>
            <div className="flex-1 bg-white/20 rounded-[12px] p-3 text-center">
              <p className="text-[20px] font-bold">{shops.filter(s => s.status === "favorite").length}</p>
              <p className="text-[11px] text-white/80">관심샵</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "scheduled", "visited", "favorite"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#191F28] text-white"
                  : "bg-white text-[#4E5968]"
              }`}
            >
              {tab === "all" ? "전체" : statusConfig[tab].label}
            </button>
          ))}
        </div>

        {/* Shop List */}
        <div className="space-y-3">
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <div 
                key={shop.id} 
                className="bg-white rounded-[16px] p-4 shadow-sm"
                onClick={() => {
                  setSelectedShop(shop)
                  setShowDetailModal(true)
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-bold text-[#191F28]">{shop.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusConfig[shop.status].bg} ${statusConfig[shop.status].text}`}>
                        {statusConfig[shop.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] text-[#8B95A1]">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1] flex-shrink-0" />
                </div>

                <div className="flex items-center gap-4 text-[12px] text-[#4E5968]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(shop.visitDate)}</span>
                  </div>
                  {shop.visitTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{shop.visitTime}</span>
                    </div>
                  )}
                  {shop.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{shop.rating}점</span>
                    </div>
                  )}
                </div>

                {shop.notes && (
                  <p className="mt-2 text-[12px] text-[#8B95A1] line-clamp-1">{shop.notes}</p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[16px] p-8 text-center">
              <p className="text-[14px] text-[#8B95A1]">등록된 드레스샵이 없습니다</p>
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
              <h3 className="text-[17px] font-bold text-[#191F28]">드레스샵 추가</h3>
              <button 
                onClick={handleAddShop}
                disabled={!newShop.name || !newShop.visitDate}
                className={`text-[15px] font-semibold ${
                  newShop.name && newShop.visitDate ? "text-[#FF8A80]" : "text-[#B0B8C1]"
                }`}
              >
                저장
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">샵 이름 *</label>
                <input
                  type="text"
                  value={newShop.name}
                  onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  placeholder="드레스샵 이름"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">주소</label>
                <input
                  type="text"
                  value={newShop.address}
                  onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                  placeholder="샵 주소"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">연락처</label>
                <input
                  type="tel"
                  value={newShop.phone}
                  onChange={(e) => setNewShop({ ...newShop, phone: e.target.value })}
                  placeholder="02-0000-0000"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">방문일 *</label>
                  <input
                    type="date"
                    value={newShop.visitDate}
                    onChange={(e) => setNewShop({ ...newShop, visitDate: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#4E5968] mb-2">시간</label>
                  <input
                    type="time"
                    value={newShop.visitTime}
                    onChange={(e) => setNewShop({ ...newShop, visitTime: e.target.value })}
                    className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#FF8A80]"
                  />
                </div>
              </div>
            </div>

            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedShop && (
        <div className="fixed inset-0 z-50 bg-white">
          <header className="flex items-center justify-between px-4 h-14 border-b border-[#E5E8EB]">
            <button onClick={() => setShowDetailModal(false)}>
              <ArrowLeft className="w-6 h-6 text-[#191F28]" />
            </button>
            <h3 className="text-[17px] font-bold text-[#191F28]">{selectedShop.name}</h3>
            <button 
              onClick={() => deleteShop(selectedShop.id)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F2F4F6]"
            >
              <Trash2 className="w-5 h-5 text-[#8B95A1]" />
            </button>
          </header>

          <div className="px-5 py-5 space-y-5 max-h-[calc(100vh-56px)] overflow-y-auto pb-32">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[13px] font-medium ${statusConfig[selectedShop.status].bg} ${statusConfig[selectedShop.status].text}`}>
                {statusConfig[selectedShop.status].label}
              </span>
              {selectedShop.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < selectedShop.rating! ? "text-amber-400 fill-amber-400" : "text-[#E5E8EB]"}`} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-[#F8F9FA] rounded-[16px] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#8B95A1]" />
                <span className="text-[14px] text-[#333D4B]">{selectedShop.address || "주소 미등록"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8B95A1]" />
                <span className="text-[14px] text-[#333D4B]">{selectedShop.phone || "연락처 미등록"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#8B95A1]" />
                <span className="text-[14px] text-[#333D4B]">
                  {formatDate(selectedShop.visitDate)} {selectedShop.visitTime && `${selectedShop.visitTime}`}
                </span>
              </div>
            </div>

            {/* Notes */}
            {selectedShop.notes && (
              <div>
                <h4 className="text-[15px] font-bold text-[#191F28] mb-2">메모</h4>
                <p className="text-[14px] text-[#4E5968] bg-[#F8F9FA] rounded-[12px] p-4">
                  {selectedShop.notes}
                </p>
              </div>
            )}

            {/* Tried Dresses */}
            {selectedShop.dresses && selectedShop.dresses.length > 0 && (
              <div>
                <h4 className="text-[15px] font-bold text-[#191F28] mb-3">입어본 드레스</h4>
                <div className="space-y-2">
                  {selectedShop.dresses.map((dress, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#F8F9FA] rounded-[12px] p-4">
                      <div className="flex items-center gap-3">
                        {dress.liked && <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />}
                        <span className="text-[14px] text-[#333D4B]">{dress.name}</span>
                      </div>
                      <span className="text-[14px] font-medium text-[#4E5968]">
                        {dress.price.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {selectedShop.status === "scheduled" && (
                <button
                  onClick={() => {
                    updateShopStatus(selectedShop.id, "visited")
                    setSelectedShop({ ...selectedShop, status: "visited" })
                  }}
                  className="w-full py-4 rounded-[14px] bg-[#3182F6] text-white font-semibold text-[16px]"
                >
                  방문 완료로 변경
                </button>
              )}
              {selectedShop.status !== "favorite" && (
                <button
                  onClick={() => {
                    updateShopStatus(selectedShop.id, "favorite")
                    setSelectedShop({ ...selectedShop, status: "favorite" })
                  }}
                  className="w-full py-4 rounded-[14px] bg-pink-50 text-pink-500 font-semibold text-[16px]"
                >
                  관심샵으로 등록
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <WeddingBottomNav />
    </div>
  )
}
