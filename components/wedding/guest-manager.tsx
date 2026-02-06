"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  Users, Utensils, Mail, UserPlus, X, Search, Pencil, Trash2,
  ChevronDown, Phone, Check, Filter
} from "lucide-react"

interface Guest {
  id: number
  name: string
  side: string
  relationship: string
  attendance: string
  invitationSent: boolean
  mealType: string
  giftAmount: number
  memo: string
  phone: string
}

interface WeddingInfoData {
  expectedGuests: number
  groomGuests: number
  brideGuests: number
  mealCostAdult: number
  mealCostChild: number
  invitationCount: number
  physicalInvitationCount: number
}

const RELATIONSHIP_OPTIONS = ["가족", "친척", "친구", "직장", "학교", "기타"]
const ATTENDANCE_OPTIONS = [
  { id: "confirmed", label: "참석" },
  { id: "declined", label: "불참" },
  { id: "pending", label: "미정" },
]

export function GuestManager() {
  const [activeTab, setActiveTab] = useState<"report" | "list">("report")
  const [reportMode, setReportMode] = useState<"before" | "after">("before")
  const [guests, setGuests] = useState<Guest[]>([])
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSide, setFilterSide] = useState<"all" | "groom" | "bride">("all")
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    side: "groom" as string,
    relationship: "친구",
    attendance: "pending",
    invitationSent: false,
    mealType: "adult",
    giftAmount: 0,
    memo: "",
    phone: "",
  })

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [guestsRes, infoRes] = await Promise.all([
        fetch("/api/guests?userId=default"),
        fetch("/api/wedding-info?userId=default"),
      ])
      const guestsData = await guestsRes.json()
      const infoData = await infoRes.json()
      setGuests(guestsData || [])
      setWeddingInfo(infoData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const groomGuestsList = guests.filter(g => g.side === "groom")
  const brideGuestsList = guests.filter(g => g.side === "bride")
  const confirmedGuests = guests.filter(g => g.attendance === "confirmed")
  const invitedGuests = guests.filter(g => g.invitationSent)
  const totalGiftAmount = guests.reduce((sum, g) => sum + (g.giftAmount || 0), 0)

  const expectedTotal = (weddingInfo?.groomGuests || 0) + (weddingInfo?.brideGuests || 0)
  const estimatedMealCost =
    (weddingInfo?.mealCostAdult || 0) * expectedTotal

  const filteredGuests = guests
    .filter(g => filterSide === "all" || g.side === filterSide)
    .filter(g =>
      !searchQuery ||
      g.name.includes(searchQuery) ||
      (g.relationship && g.relationship.includes(searchQuery))
    )

  const openAddModal = () => {
    setEditingGuest(null)
    setFormData({
      name: "",
      side: "groom",
      relationship: "친구",
      attendance: "pending",
      invitationSent: false,
      mealType: "adult",
      giftAmount: 0,
      memo: "",
      phone: "",
    })
    setShowAddModal(true)
  }

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest)
    setFormData({
      name: guest.name,
      side: guest.side,
      relationship: guest.relationship || "친구",
      attendance: guest.attendance || "pending",
      invitationSent: guest.invitationSent || false,
      mealType: guest.mealType || "adult",
      giftAmount: guest.giftAmount || 0,
      memo: guest.memo || "",
      phone: guest.phone || "",
    })
    setShowAddModal(true)
  }

  const handleSave = async () => {
    if (!formData.name) return
    try {
      if (editingGuest) {
        const res = await fetch("/api/guests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingGuest.id, ...formData }),
        })
        const updated = await res.json()
        setGuests(guests.map(g => (g.id === editingGuest.id ? updated : g)))
      } else {
        const res = await fetch("/api/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "default", ...formData }),
        })
        const newGuest = await res.json()
        setGuests([newGuest, ...guests])
      }
      setShowAddModal(false)
    } catch (error) {
      console.error("Error saving guest:", error)
    }
  }

  const confirmDelete = async () => {
    if (!guestToDelete) return
    try {
      await fetch(`/api/guests?id=${guestToDelete.id}`, { method: "DELETE" })
      setGuests(guests.filter(g => g.id !== guestToDelete.id))
    } catch (error) {
      console.error("Error deleting guest:", error)
    }
    setGuestToDelete(null)
    setShowDeleteModal(false)
  }

  const formatMoney = (amount: number) => {
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)} 만원`
    }
    return `${amount.toLocaleString()} 원`
  }

  return (
    <>
      <div className="px-5 pt-5 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex bg-[#F2F4F6] rounded-full p-1 flex-1">
            <button
              onClick={() => setActiveTab("report")}
              className={`flex-1 py-2.5 text-[14px] font-semibold rounded-full transition-all ${
                activeTab === "report"
                  ? "bg-white text-[#191F28] shadow-sm"
                  : "text-[#8B95A1]"
              }`}
              data-testid="tab-report"
            >
              리포트
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 py-2.5 text-[14px] font-semibold rounded-full transition-all ${
                activeTab === "list"
                  ? "bg-white text-[#191F28] shadow-sm"
                  : "text-[#8B95A1]"
              }`}
              data-testid="tab-list"
            >
              명단
            </button>
          </div>
        </div>

        {activeTab === "report" ? (
          <div className="space-y-4">
            <div className="flex bg-[#F2F4F6] rounded-full p-1 max-w-[200px]">
              <button
                onClick={() => setReportMode("before")}
                className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all ${
                  reportMode === "before"
                    ? "bg-white text-[#191F28] shadow-sm"
                    : "text-[#8B95A1]"
                }`}
                data-testid="toggle-before"
              >
                예식 전
              </button>
              <button
                onClick={() => setReportMode("after")}
                className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all ${
                  reportMode === "after"
                    ? "bg-white text-[#191F28] shadow-sm"
                    : "text-[#8B95A1]"
                }`}
                data-testid="toggle-after"
              >
                예식 후
              </button>
            </div>

            {reportMode === "before" ? (
              <>
                <div className="bg-white rounded-[20px] shadow-weve p-5">
                  <h3 className="text-[15px] font-bold text-[#191F28] mb-4">하객 및 식대</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#191F28]">예상 하객 수</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[11px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                              신랑 {weddingInfo?.groomGuests || groomGuestsList.length}명
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full">
                              신부 {weddingInfo?.brideGuests || brideGuestsList.length}명
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {expectedTotal || guests.length} <span className="text-[14px] font-normal text-[#8B95A1]">명</span>
                      </p>
                    </div>

                    <div className="border-t border-[#F2F4F6]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-[12px] flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#191F28]">예상 식대</p>
                          <div className="text-[11px] text-[#8B95A1] mt-0.5">
                            어른 {(weddingInfo?.mealCostAdult || 0).toLocaleString()} x 예상 하객 수
                          </div>
                        </div>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {formatMoney(estimatedMealCost)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[20px] shadow-weve p-5">
                  <h3 className="text-[15px] font-bold text-[#191F28] mb-4">청첩장</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-[12px] flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#191F28]">청첩장 모임 인원</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[11px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                              신랑 {groomGuestsList.filter(g => g.invitationSent).length}명
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full">
                              신부 {brideGuestsList.filter(g => g.invitationSent).length}명
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {invitedGuests.length} <span className="text-[14px] font-normal text-[#8B95A1]">명</span>
                      </p>
                    </div>

                    <div className="border-t border-[#F2F4F6]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#191F28]">참석 확인</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[11px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                              신랑 {groomGuestsList.filter(g => g.attendance === "confirmed").length}명
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full">
                              신부 {brideGuestsList.filter(g => g.attendance === "confirmed").length}명
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {confirmedGuests.length} <span className="text-[14px] font-normal text-[#8B95A1]">명</span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-[20px] shadow-weve p-5">
                  <h3 className="text-[15px] font-bold text-[#191F28] mb-4">축의금 현황</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-[12px] flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-[14px] font-medium text-[#191F28]">총 축의금</p>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {formatMoney(totalGiftAmount)}
                      </p>
                    </div>

                    <div className="border-t border-[#F2F4F6]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-[12px] flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-[14px] font-medium text-[#191F28]">실제 참석 인원</p>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {confirmedGuests.length} <span className="text-[14px] font-normal text-[#8B95A1]">명</span>
                      </p>
                    </div>

                    <div className="border-t border-[#F2F4F6]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center">
                          <Utensils className="w-5 h-5 text-red-500" />
                        </div>
                        <p className="text-[14px] font-medium text-[#191F28]">실제 식대</p>
                      </div>
                      <p className="text-[20px] font-bold text-[#191F28]">
                        {formatMoney((weddingInfo?.mealCostAdult || 0) * confirmedGuests.length)}
                      </p>
                    </div>

                    <div className="border-t border-[#F2F4F6]" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-[14px] font-medium text-[#191F28]">수지 (축의금 - 식대)</p>
                      </div>
                      <p className={`text-[20px] font-bold ${totalGiftAmount - (weddingInfo?.mealCostAdult || 0) * confirmedGuests.length >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {formatMoney(totalGiftAmount - (weddingInfo?.mealCostAdult || 0) * confirmedGuests.length)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B95A1]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이름, 관계로 검색"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F2F4F6] rounded-[12px] text-[14px] outline-none focus:ring-2 focus:ring-blue-300"
                  data-testid="input-search-guest"
                />
              </div>
              <div className="flex bg-[#F2F4F6] rounded-[10px] p-0.5">
                {(["all", "groom", "bride"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterSide(s)}
                    className={`px-3 py-2 text-[12px] font-medium rounded-[8px] transition-all ${
                      filterSide === s ? "bg-white text-[#191F28] shadow-sm" : "text-[#8B95A1]"
                    }`}
                    data-testid={`filter-${s}`}
                  >
                    {s === "all" ? "전체" : s === "groom" ? "신랑" : "신부"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] text-[#8B95A1]">
                총 {filteredGuests.length}명
              </p>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-[#8B95A1]">로딩 중...</div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="w-10 h-10 text-[#D1D6DB] mx-auto mb-3" />
                <p className="text-[#8B95A1] text-[14px]">등록된 하객이 없어요</p>
                <p className="text-[#B0B8C1] text-[12px] mt-1">하객을 추가해보세요</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGuests.map(guest => (
                  <div
                    key={guest.id}
                    className="bg-white rounded-[16px] shadow-weve p-4"
                    data-testid={`card-guest-${guest.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white ${
                          guest.side === "groom" ? "bg-blue-400" : "bg-pink-400"
                        }`}>
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-medium text-[#191F28]">{guest.name}</p>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                              guest.side === "groom" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                            }`}>
                              {guest.side === "groom" ? "신랑" : "신부"}
                            </span>
                            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                              guest.attendance === "confirmed"
                                ? "bg-green-100 text-green-600"
                                : guest.attendance === "declined"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {guest.attendance === "confirmed" ? "참석" : guest.attendance === "declined" ? "불참" : "미정"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[12px] text-[#8B95A1]">
                            {guest.relationship && <span>{guest.relationship}</span>}
                            {guest.giftAmount > 0 && (
                              <span>축의금 {guest.giftAmount.toLocaleString()}원</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(guest)}
                          className="p-1.5 rounded-full hover:bg-[#F2F4F6]"
                          data-testid={`button-edit-guest-${guest.id}`}
                        >
                          <Pencil className="w-4 h-4 text-[#8B95A1]" />
                        </button>
                        <button
                          onClick={() => {
                            setGuestToDelete(guest)
                            setShowDeleteModal(true)
                          }}
                          className="p-1.5 rounded-full hover:bg-[#F2F4F6]"
                          data-testid={`button-delete-guest-${guest.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-[#8B95A1]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={openAddModal}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 bg-[#3182F6] hover:bg-[#1B64DA] text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
        data-testid="button-add-guest-fab"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      {showAddModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center" onClick={() => setShowAddModal(false)}>
          <div
            className="bg-white rounded-t-[24px] w-full max-w-md max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F2F4F6] sticky top-0 bg-white z-10">
              <h3 className="text-[17px] font-bold text-[#191F28]">
                {editingGuest ? "하객 수정" : "하객 추가"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-[#F2F4F6]">
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="하객 이름"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-blue-300"
                  data-testid="input-guest-name"
                />
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">소속</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, side: "groom" })}
                    className={`flex-1 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                      formData.side === "groom" ? "bg-blue-500 text-white" : "bg-[#F2F4F6] text-[#4E5968]"
                    }`}
                    data-testid="button-side-groom"
                  >
                    신랑측
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, side: "bride" })}
                    className={`flex-1 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                      formData.side === "bride" ? "bg-pink-500 text-white" : "bg-[#F2F4F6] text-[#4E5968]"
                    }`}
                    data-testid="button-side-bride"
                  >
                    신부측
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">관계</label>
                <div className="flex flex-wrap gap-2">
                  {RELATIONSHIP_OPTIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setFormData({ ...formData, relationship: r })}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
                        formData.relationship === r
                          ? "bg-[#3182F6] text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">참석 여부</label>
                <div className="flex gap-2">
                  {ATTENDANCE_OPTIONS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setFormData({ ...formData, attendance: a.id })}
                      className={`flex-1 py-2.5 rounded-[10px] text-[13px] font-medium transition-all ${
                        formData.attendance === a.id
                          ? a.id === "confirmed"
                            ? "bg-green-500 text-white"
                            : a.id === "declined"
                            ? "bg-red-400 text-white"
                            : "bg-gray-500 text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="text-[13px] text-[#4E5968]">청첩장 발송 여부</label>
                <button
                  onClick={() => setFormData({ ...formData, invitationSent: !formData.invitationSent })}
                  className={`w-12 h-7 rounded-full transition-all relative ${
                    formData.invitationSent ? "bg-[#3182F6]" : "bg-[#D1D6DB]"
                  }`}
                  data-testid="toggle-invitation"
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                    formData.invitationSent ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">연락처</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-blue-300"
                  data-testid="input-guest-phone"
                />
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">축의금</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.giftAmount ? formData.giftAmount.toLocaleString() : ""}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^0-9]/g, "")
                      setFormData({ ...formData, giftAmount: parseInt(num) || 0 })
                    }}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-blue-300 pr-10"
                    data-testid="input-gift-amount"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#8B95A1]">원</span>
                </div>
              </div>

              <div>
                <label className="text-[13px] text-[#8B95A1] mb-1.5 block">메모</label>
                <input
                  type="text"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  placeholder="메모 (선택)"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="px-5 pb-8 pt-2">
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="w-full py-4 bg-[#3182F6] hover:bg-[#1B64DA] disabled:bg-[#E5E8EB] text-white font-bold rounded-[14px] transition-all"
                data-testid="button-save-guest"
              >
                {editingGuest ? "수정하기" : "추가하기"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showDeleteModal && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-5">
          <div className="bg-white rounded-[24px] w-full max-w-xs p-6 text-center">
            <h3 className="text-[17px] font-bold text-[#191F28] mb-2">하객 삭제</h3>
            <p className="text-[14px] text-[#8B95A1] mb-5">
              {guestToDelete?.name}님을 명단에서 삭제할까요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setGuestToDelete(null) }}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px]"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-[#FF6B6B] text-white font-medium rounded-[12px]"
              >
                삭제
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
