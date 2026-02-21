"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { WeddingBottomNav } from "@/components/wedding/wedding-bottom-nav"
import { CheckCircle2, Building2, Camera, Shirt, Gift, Users, MoreHorizontal, Download } from "lucide-react"

type WeddingVendor = {
  id: number
  category: string
  name: string
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
]

const categoryIcons: Record<string, React.ReactNode> = {
  "웨딩홀": <Building2 className="w-4 h-4" />,
  "스튜디오": <Camera className="w-4 h-4" />,
  "드레스": <Shirt className="w-4 h-4" />,
  "2부드레스": <Shirt className="w-4 h-4" />,
  "메이크업": <Users className="w-4 h-4" />,
  "예복": <Shirt className="w-4 h-4" />,
  "예물": <Gift className="w-4 h-4" />,
  "본식스냅": <Camera className="w-4 h-4" />,
  "DVD": <Camera className="w-4 h-4" />,
  "식전영상": <Camera className="w-4 h-4" />,
  "식중영상": <Camera className="w-4 h-4" />,
  "청첩장": <Gift className="w-4 h-4" />,
  "사회자": <Users className="w-4 h-4" />,
}

export default function WeddingVendorsProgressPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [vendors, setVendors] = useState<WeddingVendor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      console.error("Failed to fetch wedding vendors progress:", e)
      setError("진행상태를 불러오는 중 오류가 발생했어요.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusLabel = (vendor: WeddingVendor | null) => {
    if (!vendor) return "미정"
    if (vendor.status === "contracted") return "계약완료"
    if (vendor.status === "done") return "완료"
    return vendor.status || "진행중"
  }

  const rows = categories.map((category) => {
    const contracted = vendors.find(
      (v) => v.category === category && v.status === "contracted",
    )
    const any = contracted || vendors.find((v) => v.category === category)
    return {
      category,
      name: any ? any.name : "",
      status: getStatusLabel(contracted || any || null),
      vendorId: any ? any.id : "",
    }
  })

  const exportToExcel = () => {
    const headers = ["업체ID", "구분", "업체명", "상태"]

    const dataRows = rows.map((row) => [
      row.vendorId || "",
      row.category,
      row.name || "미정",
      row.status,
    ])

    const BOM = "\uFEFF"
    const csvContent = BOM + [
      headers.join(","),
      ...dataRows.map((row) =>
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
    link.download = `업체진행상태_${new Date().toISOString().split("T")[0]}.csv`
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
            <button
              onClick={exportToPdf}
              className="px-3 py-1.5 rounded-full border border-[#E5E8EB] text-[11px] text-[#4E5968]"
            >
              PDF
            </button>
            <Link
              href="/wedding/vendors"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3182F6]"
            >
              <CheckCircle2 className="w-4 h-4" />
              업체 비교
            </Link>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-4">
        <section className="bg-white rounded-[20px] p-4 shadow-sm">
          <p className="text-[13px] text-[#8B95A1] mb-2">
            각 카테고리에서 선택한 업체가 자동으로 채워져요.
          </p>
          {isLoading && (
            <p className="text-[12px] text-[#B0B8C1]">불러오는 중...</p>
          )}
          {error && (
            <p className="text-[12px] text-red-500">{error}</p>
          )}
        </section>

        <section className="bg-white rounded-[20px] shadow-sm overflow-hidden">
          <div className="grid grid-cols-[80px,1fr,80px] px-4 py-3 border-b border-[#F2F4F6] bg-[#F9FAFB] text-[12px] font-semibold text-[#4E5968]">
            <div>구분</div>
            <div>업체명</div>
            <div className="text-right">상태</div>
          </div>
          <div>
            {rows.map((row) => (
              <div
                key={row.category}
                className="grid grid-cols-[80px,1fr,80px] px-4 py-3 border-b border-[#F2F4F6] text-[13px] items-center"
              >
                <div className="flex items-center gap-2 text-[#4E5968]">
                  <div className="w-6 h-6 rounded-full bg-[#F2F4F6] flex items-center justify-center text-[#8B95A1]">
                    {categoryIcons[row.category] || <MoreHorizontal className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">{row.category}</span>
                </div>
                <div className="text-[#191F28] truncate">
                  {row.name || "미정"}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center justify-end px-2 py-0.5 rounded-full text-[11px] ${
                      row.status === "계약완료"
                        ? "bg-[#E5F0FF] text-[#3182F6]"
                        : row.status === "완료"
                        ? "bg-[#E5FFF4] text-[#12B886]"
                        : "bg-[#F2F4F6] text-[#8B95A1]"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <WeddingBottomNav />
    </div>
  )
}
