"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { 
  Plus,
  Star,
  StarOff,
  Building2,
  Camera,
  Shirt,
  Gift,
  Users,
  MoreHorizontal,
  Trash2,
  CheckCircle2,
  Download,
} from "lucide-react"

type WeddingVendor = {
  id: number
  category: string
  name: string
  price: number | null
  pros: string | null
  cons: string | null
  notes: string | null
  preference: number | null
  status: string | null
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
  "기타",
]

const categoryIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  "웨딩홀": { icon: <Building2 className="w-4 h-4" />, bg: "bg-pink-100 text-pink-500" },
  "스튜디오": { icon: <Camera className="w-4 h-4" />, bg: "bg-indigo-100 text-indigo-500" },
  "드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-purple-100 text-purple-500" },
  "2부드레스": { icon: <Shirt className="w-4 h-4" />, bg: "bg-rose-100 text-rose-500" },
  "메이크업": { icon: <Users className="w-4 h-4" />, bg: "bg-orange-100 text-orange-500" },
  "예복": { icon: <Shirt className="w-4 h-4" />, bg: "bg-sky-100 text-sky-500" },
  "예물": { icon: <Gift className="w-4 h-4" />, bg: "bg-amber-100 text-amber-500" },
  "본식스냅": { icon: <Camera className="w-4 h-4" />, bg: "bg-cyan-100 text-cyan-500" },
  "DVD": { icon: <Camera className="w-4 h-4" />, bg: "bg-lime-100 text-lime-500" },
  "식전영상": { icon: <Camera className="w-4 h-4" />, bg: "bg-emerald-100 text-emerald-500" },
  "식중영상": { icon: <Camera className="w-4 h-4" />, bg: "bg-teal-100 text-teal-500" },
  "청첩장": { icon: <Gift className="w-4 h-4" />, bg: "bg-rose-100 text-rose-500" },
  "사회자": { icon: <Users className="w-4 h-4" />, bg: "bg-violet-100 text-violet-500" },
  "기타": { icon: <MoreHorizontal className="w-4 h-4" />, bg: "bg-gray-100 text-gray-500" },
}

export default function WeddingVendorsPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [vendors, setVendors] = useState<WeddingVendor[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("웨딩홀")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newVendor, setNewVendor] = useState({
    category: "웨딩홀",
    name: "",
    price: "",
    preference: 3,
    pros: "",
    cons: "",
    notes: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/wedding/vendors?mode=wedding")
      if (!res.ok) {
        throw new Error("업체 정보를 불러오지 못했어요.")
      }
      const data = await res.json()
      setVendors(data)
    } catch (e) {
      console.error("Failed to fetch wedding vendors:", e)
      setError("업체 비교 데이터를 불러오는 중 오류가 발생했어요.")
    } finally {
      setIsLoading(false)
    }
  }

  const groupedVendors = categories.reduce<Record<string, WeddingVendor[]>>((acc, cat) => {
    acc[cat] = vendors.filter((v) => v.category === cat)
    return acc
  }, {})

  const handleAddVendor = async () => {
    if (!newVendor.name || !newVendor.category) return
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/wedding/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newVendor.category,
          name: newVendor.name,
          price: newVendor.price ? Number(newVendor.price.replace(/[^0-9]/g, "")) : 0,
          preference: newVendor.preference,
          pros: newVendor.pros || undefined,
          cons: newVendor.cons || undefined,
          notes: newVendor.notes || undefined,
          status: "candidate",
          mode: "wedding",
        }),
      })
      if (!res.ok) {
        throw new Error("업체를 저장하지 못했어요.")
      }
      const created = await res.json()
      setVendors((prev) => [created, ...prev])
      setNewVendor({
        category: newVendor.category,
        name: "",
        price: "",
        preference: 3,
        pros: "",
        cons: "",
        notes: "",
      })
    } catch (e) {
      console.error("Failed to add wedding vendor:", e)
      setError("업체를 추가하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteVendor = async (id: number) => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/wedding/vendors?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("업체를 삭제하지 못했어요.")
      }
      setVendors((prev) => prev.filter((v) => v.id !== id))
    } catch (e) {
      console.error("Failed to delete wedding vendor:", e)
      setError("업체를 삭제하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSelectContract = async (vendor: WeddingVendor) => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/wedding/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendor.id,
          status: vendor.status === "contracted" ? "candidate" : "contracted",
        }),
      })
      if (!res.ok) {
        throw new Error("계약 상태를 변경하지 못했어요.")
      }
      const updated = await res.json()
      setVendors((prev) =>
        prev.map((v) =>
          v.id === updated.id ? updated : v
        )
      )
    } catch (e) {
      console.error("Failed to update contract status:", e)
      setError("계약 상태를 변경하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreferenceChange = async (vendor: WeddingVendor, value: number) => {
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/wedding/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: vendor.id,
          preference: value,
        }),
      })
      if (!res.ok) {
        throw new Error("선호도를 변경하지 못했어요.")
      }
      const updated = await res.json()
      setVendors((prev) =>
        prev.map((v) =>
          v.id === updated.id ? updated : v
        )
      )
    } catch (e) {
      console.error("Failed to update preference:", e)
      setError("선호도를 변경하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price || price <= 0) return "-"
    return `${price.toLocaleString()}원`
  }

  const exportToExcel = () => {
    const headers = ["업체ID", "업체명", "카테고리", "가격", "선호도", "상태", "장점", "단점", "메모"]

    const rows = vendors.map((v) => [
      v.id,
      v.name,
      v.category,
      v.price ?? "",
      v.preference ?? "",
      v.status ?? "",
      v.pros ?? "",
      v.cons ?? "",
      v.notes ?? "",
    ])

    const BOM = "\uFEFF"
    const csvContent = BOM + [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell)
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
              return `"${str.replace(/"/g, '""')}"`
            }
            return str
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `업체비교_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToPdf = () => {
    if (typeof window === "undefined") return
    window.print()
  }

  const renderStars = (vendor: WeddingVendor) => {
    const value = vendor.preference ?? 0
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const active = i <= value
          const Icon = active ? Star : StarOff
          return (
            <button
              key={i}
              onClick={() => handlePreferenceChange(vendor, i)}
              className="w-5 h-5 flex items-center justify-center"
            >
              <Icon className={`w-4 h-4 ${active ? "text-[#FFB020]" : "text-[#D1D5DB]"}`} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="sticky top-0 sticky-header-safe z-50 bg-white border-b border-[#E5E8EB]">
        <div className="flex items-center justify-between px-5 h-14 max-w-md mx-auto">
          <h1 className="text-[17px] font-bold text-[#191F28]">업체 비교</h1>
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
            <Link
              href="/wedding/vendors/progress"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3182F6]"
            >
              <CheckCircle2 className="w-4 h-4" />
              진행상태
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-5">
        <section className="bg-white rounded-[20px] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[13px] text-[#8B95A1]">비교 카테고리</p>
              <p className="text-[17px] font-bold text-[#191F28]">{activeCategory}</p>
            </div>
            <span className="text-[12px] text-[#B0B8C1]">
              후보 {groupedVendors[activeCategory]?.length || 0}개
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setNewVendor((prev) => ({ ...prev, category: cat }))
                }}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#3182F6] text-white"
                    : "bg-[#F2F4F6] text-[#4E5968]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[20px] p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#191F28]">업체 후보 추가</h2>
            <span className="text-[11px] text-[#B0B8C1]">노션 표 대신 여기서 관리해요</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-[12px] text-[#8B95A1]">업체명</label>
              <input
                type="text"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full rounded-[12px] border border-[#E5E8EB] px-3 py-2 text-[14px] focus:outline-none focus:border-[#3182F6]"
                placeholder="예) 에스톤웨딩홀"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] text-[#8B95A1]">예상 비용</label>
              <input
                type="text"
                value={newVendor.price}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "")
                  setNewVendor({ ...newVendor, price: v ? Number(v).toLocaleString() : "" })
                }}
                className="w-full rounded-[12px] border border-[#E5E8EB] px-3 py-2 text-[14px] focus:outline-none focus:border-[#3182F6]"
                placeholder="숫자만 입력 (선택)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[12px] text-[#8B95A1]">선호도</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setNewVendor({ ...newVendor, preference: i })}
                    className="w-7 h-7 flex items-center justify-center"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i <= newVendor.preference ? "text-[#FFB020]" : "text-[#E5E8EB]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] text-[#8B95A1]">장점 / 단점 / 특이사항</label>
              <textarea
                value={newVendor.pros}
                onChange={(e) => setNewVendor({ ...newVendor, pros: e.target.value })}
                className="w-full rounded-[12px] border border-[#E5E8EB] px-3 py-2 text-[13px] min-h-[60px] focus:outline-none focus:border-[#3182F6]"
                placeholder="- 강점, 혜택, 느낌 등 자유롭게 적기"
              />
              <textarea
                value={newVendor.cons}
                onChange={(e) => setNewVendor({ ...newVendor, cons: e.target.value })}
                className="w-full rounded-[12px] border border-[#E5E8EB] px-3 py-2 text-[13px] min-h-[60px] focus:outline-none focus:border-[#3182F6]"
                placeholder="- 아쉬운 점, 고민 포인트 등"
              />
            </div>
            <button
              onClick={handleAddVendor}
              disabled={!newVendor.name || isSaving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] bg-[#3182F6] text-white text-[15px] font-semibold disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              업체 후보 추가
            </button>
            {error && (
              <p className="text-[12px] text-red-500 text-center">{error}</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F2F4F6]">
            <h2 className="text-[15px] font-semibold text-[#191F28]">업체 리스트</h2>
            {isLoading && (
              <span className="text-[11px] text-[#B0B8C1]">불러오는 중...</span>
            )}
          </div>
          {groupedVendors[activeCategory] && groupedVendors[activeCategory].length > 0 ? (
            <div className="divide-y divide-[#F2F4F6]">
              {groupedVendors[activeCategory].map((vendor) => {
                const iconInfo = categoryIcons[activeCategory] || categoryIcons["기타"]
                const isContracted = vendor.status === "contracted"
                return (
                  <div key={vendor.id} className="px-4 py-3 flex gap-3">
                    <div className="mt-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconInfo.bg}`}>
                        {iconInfo.icon}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-[#191F28]">{vendor.name}</span>
                          <span className="text-[12px] text-[#8B95A1]">{formatPrice(vendor.price)}</span>
                        </div>
                        <button
                          onClick={() => handleSelectContract(vendor)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isContracted
                              ? "bg-[#3182F6] text-white border-[#3182F6]"
                              : "bg-white text-[#4E5968] border-[#E5E8EB]"
                          }`}
                        >
                          {isContracted ? "계약완료" : "후보"}
                        </button>
                      </div>
                      {vendor.pros && (
                        <p className="text-[12px] text-[#4E5968] whitespace-pre-line">
                          {vendor.pros}
                        </p>
                      )}
                      {vendor.cons && (
                        <p className="text-[12px] text-[#95A0B0] whitespace-pre-line">
                          {vendor.cons}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        {renderStars(vendor)}
                        <button
                          onClick={() => handleDeleteVendor(vendor.id)}
                          className="flex items-center gap-1 text-[11px] text-[#B0B8C1]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-[13px] text-[#8B95A1]">
              아직 {activeCategory} 후보가 없어요.
              <br />
              위에서 업체 정보를 추가해 주세요.
            </div>
          )}
        </section>
      </main>

      <WeddingBottomNav />
    </div>
  )
}
