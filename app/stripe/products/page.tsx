"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, RefreshCw, Save, AlertTriangle } from "lucide-react"

type StripePrice = {
  id: string
  unit_amount: number | null
  currency: string
  active: boolean
  recurring: {
    interval: string
    interval_count: number | null
  } | null
  metadata: Record<string, string>
}

type StripeProduct = {
  id: string
  name: string
  description: string | null
  metadata: Record<string, string>
  active: boolean
  prices: StripePrice[]
}

export default function StripeProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/products")
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "상품 정보를 불러오지 못했어요.")
      }
      const data = await res.json()
      setProducts(data.products || [])
    } catch (e) {
      console.error("Failed to fetch stripe products:", e)
      setError("Stripe 상품 목록을 불러오는 중 오류가 발생했어요.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleUpdateProductTier = async (product: StripeProduct, tier: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const metadata = { ...product.metadata, tier }
      const res = await fetch("/api/stripe/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          id: product.id,
          metadata,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "상품 정보를 수정하지 못했어요.")
      }
      const updated = await res.json()
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updated.id
            ? {
                ...p,
                metadata: updated.metadata || {},
                active: updated.active,
              }
            : p,
        ),
      )
    } catch (e) {
      console.error("Failed to update product tier:", e)
      setError("상품 등급 정보를 수정하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePriceMode = async (productId: string, price: StripePrice, mode: string) => {
    setIsSaving(true)
    setError(null)
    try {
      const metadata = { ...price.metadata }
      if (mode) {
        metadata.mode = mode
      } else {
        delete metadata.mode
      }

      const res = await fetch("/api/stripe/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "price",
          id: price.id,
          metadata,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || "가격 정보를 수정하지 못했어요.")
      }
      const updated = await res.json()
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                prices: p.prices.map((pr) =>
                  pr.id === updated.id
                    ? {
                        ...pr,
                        metadata: updated.metadata || {},
                        active: updated.active,
                      }
                    : pr,
                ),
              }
            : p,
        ),
      )
    } catch (e) {
      console.error("Failed to update price mode:", e)
      setError("가격 모드 정보를 수정하는 중 오류가 발생했어요.")
    } finally {
      setIsSaving(false)
    }
  }

  const formatAmount = (unitAmount: number | null, currency: string) => {
    if (!unitAmount) return "-"
    if (currency.toLowerCase() === "krw") {
      return `${(unitAmount / 100).toLocaleString()}원`
    }
    return `${(unitAmount / 100).toLocaleString()} ${currency.toUpperCase()}`
  }

  return (
    <main className="min-h-dvh bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 h-14 max-w-md mx-auto">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[17px] font-bold">결제 플랜 관리 (관리자용)</h1>
          <button
            onClick={fetchProducts}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {error && (
          <div className="flex items-center gap-2 text-[12px] text-red-400 bg-red-500/10 border border-red-500/40 rounded-[12px] px-3 py-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {isSaving && (
          <div className="text-[12px] text-[#B0B8C1]">저장 중...</div>
        )}

        <p className="text-[12px] text-[#B0B8C1]">
          이 화면은 일반 유저가 아니라 운영을 위한 관리자용 화면이에요.
          구독에 사용되는 결제 플랜의 등급(tier)과 가격 모드(mode)를 여기서만 조정합니다.
        </p>

        {isLoading && products.length === 0 && (
          <div className="text-[13px] text-[#B0B8C1]">불러오는 중...</div>
        )}

        <div className="space-y-4">
          {products.map((product) => {
            const tier = product.metadata?.tier || ""
            return (
              <section
                key={product.id}
                className="bg-white/5 rounded-[16px] border border-white/10 p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">
                        {product.name}
                      </span>
                      {!product.active && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300">
                          비활성
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-[11px] text-[#B0B8C1] mt-0.5">
                        {product.description}
                      </p>
                    )}
                    <p className="text-[10px] text-[#8B95A1] mt-1">
                      ID: {product.id}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#8B95A1]">상품 등급 (tier)</span>
                    <div className="flex items-center gap-1">
                      <input
                        defaultValue={tier}
                        placeholder="advanced / premium"
                        className="px-2 py-1 rounded-[10px] bg-black/40 border border-white/15 text-[11px] w-28"
                        onBlur={(e) =>
                          handleUpdateProductTier(product, e.target.value.trim())
                        }
                      />
                      <button
                        onClick={() =>
                          handleUpdateProductTier(
                            product,
                            tier || "advanced",
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#8B95A1]">
                    membership 화면에서는 이 tier 값으로 고급/프리미엄 상품을 구분해요.
                  </p>
                </div>

                <div className="border-t border-white/10 pt-2 mt-1 space-y-1.5">
                  <p className="text-[11px] text-[#8B95A1]">가격 목록</p>
                  <div className="space-y-1.5">
                    {product.prices.map((price) => {
                      const priceMode = price.metadata?.mode || ""
                      return (
                        <div
                          key={price.id}
                          className="flex flex-col gap-1 rounded-[10px] bg-black/30 border border-white/10 px-2 py-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px]">
                              {formatAmount(price.unit_amount, price.currency)}
                            </span>
                            <span className="text-[10px] text-[#B0B8C1]">
                              {price.recurring
                                ? `${price.recurring.interval}${price.recurring.interval_count && price.recurring.interval_count > 1 ? ` x${price.recurring.interval_count}` : ""}`
                                : "일회성"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[#8B95A1]">
                              ID: {price.id}
                            </span>
                            {!price.active && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300">
                                비활성
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-[10px] text-[#8B95A1]">
                              사용 모드 (mode)
                            </span>
                            <select
                              value={priceMode}
                              onChange={(e) =>
                                handleUpdatePriceMode(
                                  product.id,
                                  price,
                                  e.target.value,
                                )
                              }
                              className="px-2 py-1 rounded-[10px] bg-black/40 border border-white/15 text-[11px]"
                            >
                              <option value="">공통</option>
                              <option value="dating">연애</option>
                              <option value="family">가족</option>
                            </select>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          })}

          {!isLoading && products.length === 0 && (
            <div className="text-[13px] text-[#B0B8C1]">
              표시할 Stripe 상품이 없습니다. seed 스크립트나 Stripe 대시보드에서 상품을 먼저 생성해주세요.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
