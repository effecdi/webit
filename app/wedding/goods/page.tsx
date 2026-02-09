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
  Trash2,
  Gift,
  Sparkles,
  Diamond,
  Gem,
  BookOpen,
  Scissors,
  Store,
  ChevronDown,
  ChevronUp,
  Ruler,
  Palette,
  Printer,
  Frame,
  Star,
  Lightbulb,
  CircleDollarSign,
  Wrench
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

interface GuideItem {
  id: string
  title: string
  icon: React.ElementType
  gradient: string
  description: string
  proInfo: {
    title: string
    options: { name: string; detail: string; price: string }[]
    tips: string[]
  }
  diyInfo: {
    title: string
    difficulty: string
    difficultyColor: string
    materials: string[]
    steps: string[]
    tips: string[]
    estimatedCost: string
    estimatedTime: string
  }
}

const guideItems: GuideItem[] = [
  {
    id: "poster",
    title: "웨딩 포스터",
    icon: Frame,
    gradient: "from-rose-400 to-pink-500",
    description: "웨딩 촬영 사진으로 만드는 감성 웨딩 포스터. 식장 입구나 포토테이블에 세워두면 분위기가 확 달라져요.",
    proInfo: {
      title: "전문 업체 제작",
      options: [
        { name: "온라인 인쇄 업체", detail: "레드프린팅, 비스타프린트, 프린트시티 등에서 고해상도 포스터 인쇄 가능", price: "1만~3만원" },
        { name: "웨딩 전문 디자인샵", detail: "크몽, 숨고에서 웨딩 포스터 디자인 + 인쇄까지 의뢰", price: "3만~8만원" },
        { name: "스냅 스튜디오 추가 옵션", detail: "웨딩 스냅 촬영 시 포스터 제작 옵션 추가 가능", price: "5만~15만원" },
      ],
      tips: [
        "A2(420x594mm) 또는 A1(594x841mm) 사이즈가 가장 인기가 많아요",
        "무광 코팅이 고급스러운 느낌을 줘요",
        "이젤 거치대도 함께 준비하세요 (1~2만원)",
      ],
    },
    diyInfo: {
      title: "셀프 제작 가이드",
      difficulty: "쉬움",
      difficultyColor: "text-green-500",
      materials: ["고해상도 웨딩 사진 (300dpi 이상)", "Canva 또는 미리캔버스 (무료 디자인 툴)", "인쇄용 PDF 파일", "온라인 인쇄 서비스"],
      steps: [
        "웨딩 사진 중 가장 마음에 드는 사진을 고해상도로 준비하세요",
        "Canva에서 '포스터' 템플릿을 선택하고 사이즈를 설정하세요",
        "사진을 배치하고 날짜, 이름, 문구 등을 넣으세요",
        "인쇄용 PDF로 다운로드 후 온라인 인쇄업체에 주문하세요",
      ],
      tips: [
        "사진은 꼭 원본 고해상도 파일을 사용하세요",
        "텍스트는 심플하게, 사진이 주인공이 되도록 해주세요",
        "인쇄 전 실제 크기로 출력해서 미리 확인하면 좋아요",
      ],
      estimatedCost: "5,000원~15,000원",
      estimatedTime: "약 1~2시간 (디자인) + 배송 2~3일",
    },
  },
  {
    id: "mirror",
    title: "웨딩 거울",
    icon: Diamond,
    gradient: "from-blue-400 to-indigo-500",
    description: "아크릴 거울에 웨딩 문구를 새긴 웰컴 사이니지. 식장 입구에서 하객들을 맞이하는 특별한 아이템이에요.",
    proInfo: {
      title: "전문 업체 제작",
      options: [
        { name: "아크릴 전문 업체", detail: "네이버 스마트스토어에서 '웨딩 아크릴 거울' 검색. 레터링 맞춤 제작", price: "3만~8만원" },
        { name: "캘리그라피 작가", detail: "크몽, 숨고에서 캘리그라피 작가에게 직접 의뢰. 손글씨 감성", price: "5만~15만원" },
        { name: "웨딩 소품 렌탈샵", detail: "일회용이라 부담될 때, 렌탈로 저렴하게 이용 가능", price: "2만~5만원 (렌탈)" },
      ],
      tips: [
        "아크릴 거울은 깨질 위험이 없어 안전해요",
        "골드/실버 레터링이 가장 인기 있어요",
        "사이즈는 A2~A1 정도가 적당해요",
        "이젤 거치대가 포함되는지 확인하세요",
      ],
    },
    diyInfo: {
      title: "셀프 제작 가이드",
      difficulty: "보통",
      difficultyColor: "text-amber-500",
      materials: ["아크릴 거울판 (인터넷 주문, 1~3만원)", "유성 마카/페인트 마커 (골드, 실버 추천)", "마스킹 테이프", "프린트한 글씨 시안 (밑그림용)", "먹지 또는 카본지"],
      steps: [
        "원하는 문구를 정하고 예쁜 폰트로 프린트하세요",
        "프린트한 시안을 아크릴 거울 위에 먹지와 함께 고정하세요",
        "펜으로 글씨 윤곽을 따라 그리면 거울에 자국이 남아요",
        "유성 마카나 페인트 마커로 자국을 따라 정성스럽게 써주세요",
        "완전히 건조시킨 후 마스킹 테이프를 제거하세요",
      ],
      tips: [
        "먼저 일반 유리에 연습한 뒤 본 작업을 하세요",
        "유성 마카는 지울 수 있으니 실수해도 괜찮아요",
        "글씨 크기가 너무 작으면 어려우니 큰 글씨부터 시작하세요",
        "건조 시간을 충분히 주세요 (최소 24시간)",
      ],
      estimatedCost: "15,000원~30,000원",
      estimatedTime: "약 2~3시간 + 건조 24시간",
    },
  },
  {
    id: "frame",
    title: "웨딩 액자",
    icon: Palette,
    gradient: "from-amber-400 to-orange-500",
    description: "웨딩 사진을 담은 고급 액자. 포토테이블 연출부터 신혼집 인테리어까지 두고두고 활용할 수 있어요.",
    proInfo: {
      title: "전문 업체 제작",
      options: [
        { name: "사진 인화/액자 전문점", detail: "오프라인 사진관 또는 온라인(스냅스, 포토몬 등)에서 액자 제작", price: "2만~10만원" },
        { name: "캔버스 액자", detail: "사진을 캔버스에 출력. 갤러리 느낌의 고급스러운 연출 가능", price: "3만~8만원" },
        { name: "메탈 액자", detail: "알루미늄 프레임에 고화질 인쇄. 모던하고 세련된 느낌", price: "4만~12만원" },
        { name: "아크릴 액자", detail: "투명 아크릴에 사진 인쇄. 깔끔하고 현대적인 느낌", price: "3만~7만원" },
      ],
      tips: [
        "5x7인치, 8x10인치, 11x14인치가 가장 많이 사용돼요",
        "무광 인화가 반사가 없어서 사진이 더 잘 보여요",
        "여러 장을 세트로 맞추면 통일감이 있어요",
        "신혼집에도 걸 거라면 인테리어와 어울리는 프레임 색상을 고르세요",
      ],
    },
    diyInfo: {
      title: "셀프 제작 가이드",
      difficulty: "쉬움",
      difficultyColor: "text-green-500",
      materials: ["고해상도 웨딩 사진", "원하는 사이즈 액자 프레임 (다이소, 이케아 등)", "사진 인화 (온라인 인화 서비스 이용)", "매트지 (선택사항, 고급스러운 연출)"],
      steps: [
        "액자 사이즈에 맞는 사진을 선택하세요",
        "온라인 인화 서비스(스냅스, 포토몬 등)에서 사진을 주문하세요",
        "액자 프레임은 다이소(3,000~5,000원)나 이케아에서 구입하세요",
        "매트지를 넣으면 갤러리처럼 고급스러워 보여요",
        "사진을 액자에 넣고 포토테이블에 배치하세요",
      ],
      tips: [
        "다이소 액자도 매트지만 넣으면 충분히 예뻐요",
        "같은 프레임으로 여러 개 통일하면 세련돼 보여요",
        "사진은 반드시 인화 서비스를 이용하세요 (가정용 프린터는 품질이 떨어져요)",
        "포토테이블 배치 시 높이감을 다르게 주면 입체적이에요",
      ],
      estimatedCost: "5,000원~20,000원 (액자 1개 기준)",
      estimatedTime: "약 30분 (조립) + 인화 배송 2~3일",
    },
  },
]

export default function GoodsPage() {
  const [activeTab, setActiveTab] = useState<"manage" | "guide">("manage")
  const [goods, setGoods] = useState<GoodsItem[]>(initialGoods)
  const [activeCategory, setActiveCategory] = useState("전체")
  const [activeStatus, setActiveStatus] = useState<"all" | "wishlist" | "purchased" | "received">("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<Record<string, "pro" | "diy" | null>>({})
  const [newItem, setNewItem] = useState<{
    name: string
    category: string
    price: string
    link: string
    notes: string
    forWhom: "bride" | "groom" | "both" | "guest"
  }>({
    name: "",
    category: "예물",
    price: "",
    link: "",
    notes: "",
    forWhom: "both",
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

  const toggleGuide = (id: string) => {
    setExpandedGuide(expandedGuide === id ? null : id)
  }

  const toggleSection = (guideId: string, section: "pro" | "diy") => {
    setExpandedSection(prev => ({
      ...prev,
      [guideId]: prev[guideId] === section ? null : section,
    }))
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
      <header className="bg-white px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/wedding" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors" data-testid="link-back">
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[20px] font-bold text-[#191F28]">웨딩 굿즈</h1>
          </div>
          {activeTab === "manage" && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FF8A80] hover:bg-[#FF6B6B] transition-colors"
              data-testid="button-add-goods"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <div className="flex gap-1 mt-3 max-w-md mx-auto bg-[#F2F4F6] rounded-[12px] p-1">
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
              activeTab === "manage"
                ? "bg-white text-[#191F28] shadow-sm"
                : "text-[#8B95A1]"
            }`}
            data-testid="tab-manage"
          >
            <ShoppingBag className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            굿즈 관리
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${
              activeTab === "guide"
                ? "bg-white text-[#191F28] shadow-sm"
                : "text-[#8B95A1]"
            }`}
            data-testid="tab-guide"
          >
            <BookOpen className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            제작 가이드
          </button>
        </div>
      </header>

      {activeTab === "manage" ? (
        <main className="px-5 py-5 max-w-md mx-auto space-y-5">
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

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("전체")}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === "전체"
                  ? "bg-[#191F28] text-white"
                  : "bg-white text-[#4E5968]"
              }`}
              data-testid="filter-category-all"
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
                data-testid={`filter-category-${cat.id}`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["all", "wishlist", "purchased", "received"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                  activeStatus === status
                    ? "bg-[#4E5968] text-white"
                    : "bg-white text-[#8B95A1]"
                }`}
                data-testid={`filter-status-${status}`}
              >
                {status === "all" ? "전체" : statusConfig[status].label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredGoods.length > 0 ? (
              filteredGoods.map((item) => {
                const StatusIcon = statusConfig[item.status].icon
                return (
                  <div key={item.id} className="bg-white rounded-[16px] p-4 shadow-sm" data-testid={`goods-item-${item.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[15px] font-bold text-[#191F28] line-clamp-1">{item.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
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
                            data-testid={`button-purchase-${item.id}`}
                          >
                            구매완료
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F4F6]"
                          data-testid={`button-delete-${item.id}`}
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
      ) : (
        <main className="px-5 py-5 max-w-md mx-auto space-y-5">
          <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-[20px] p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5" />
              <p className="text-[13px] text-white/80">웨딩 굿즈 제작 가이드</p>
            </div>
            <p className="text-[20px] font-bold mb-1">나만의 웨딩 아이템 만들기</p>
            <p className="text-[13px] text-white/80">전문 업체 의뢰부터 셀프 제작까지, 필요한 정보를 한눈에 확인하세요</p>
          </div>

          <div className="space-y-4">
            {guideItems.map((guide) => {
              const GuideIcon = guide.icon
              const isExpanded = expandedGuide === guide.id
              const activeSection = expandedSection[guide.id]

              return (
                <div key={guide.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm" data-testid={`guide-card-${guide.id}`}>
                  <button
                    onClick={() => toggleGuide(guide.id)}
                    className="w-full p-5 text-left"
                    data-testid={`button-guide-toggle-${guide.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${guide.gradient} flex items-center justify-center flex-shrink-0`}>
                        <GuideIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-[17px] font-bold text-[#191F28]">{guide.title}</h3>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-[#B0B8C1] flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#B0B8C1] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[13px] text-[#8B95A1] mt-1 leading-relaxed">{guide.description}</p>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSection(guide.id, "pro")}
                          className={`flex-1 py-3 rounded-[12px] text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                            activeSection === "pro"
                              ? "bg-[#191F28] text-white"
                              : "bg-[#F2F4F6] text-[#4E5968]"
                          }`}
                          data-testid={`button-section-pro-${guide.id}`}
                        >
                          <Store className="w-4 h-4" />
                          전문 제작
                        </button>
                        <button
                          onClick={() => toggleSection(guide.id, "diy")}
                          className={`flex-1 py-3 rounded-[12px] text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
                            activeSection === "diy"
                              ? "bg-[#191F28] text-white"
                              : "bg-[#F2F4F6] text-[#4E5968]"
                          }`}
                          data-testid={`button-section-diy-${guide.id}`}
                        >
                          <Scissors className="w-4 h-4" />
                          셀프 제작
                        </button>
                      </div>

                      {activeSection === "pro" && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <h4 className="text-[15px] font-bold text-[#191F28] flex items-center gap-2">
                            <Store className="w-4 h-4 text-[#3182F6]" />
                            {guide.proInfo.title}
                          </h4>
                          <div className="space-y-2.5">
                            {guide.proInfo.options.map((option, i) => (
                              <div key={i} className="bg-[#F8F9FA] rounded-[12px] p-4">
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <h5 className="text-[14px] font-bold text-[#191F28]">{option.name}</h5>
                                  <span className="text-[13px] font-semibold text-[#3182F6] whitespace-nowrap flex items-center gap-1">
                                    <CircleDollarSign className="w-3.5 h-3.5" />
                                    {option.price}
                                  </span>
                                </div>
                                <p className="text-[12px] text-[#8B95A1] leading-relaxed">{option.detail}</p>
                              </div>
                            ))}
                          </div>
                          <div className="bg-blue-50 rounded-[12px] p-4">
                            <p className="text-[13px] font-semibold text-[#3182F6] mb-2 flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5" />
                              알아두면 좋은 팁
                            </p>
                            <ul className="space-y-1.5">
                              {guide.proInfo.tips.map((tip, i) => (
                                <li key={i} className="text-[12px] text-[#4E5968] leading-relaxed flex gap-2">
                                  <span className="text-[#3182F6] mt-0.5 flex-shrink-0">&#8226;</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeSection === "diy" && (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[15px] font-bold text-[#191F28] flex items-center gap-2">
                              <Scissors className="w-4 h-4 text-[#FF8A80]" />
                              {guide.diyInfo.title}
                            </h4>
                            <span className={`text-[12px] font-semibold ${guide.diyInfo.difficultyColor} bg-white px-2.5 py-1 rounded-full`}>
                              난이도: {guide.diyInfo.difficulty}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <div className="flex-1 bg-[#F8F9FA] rounded-[12px] p-3 text-center">
                              <CircleDollarSign className="w-4 h-4 text-[#8B95A1] mx-auto mb-1" />
                              <p className="text-[11px] text-[#8B95A1] mb-0.5">예상 비용</p>
                              <p className="text-[13px] font-bold text-[#191F28]">{guide.diyInfo.estimatedCost}</p>
                            </div>
                            <div className="flex-1 bg-[#F8F9FA] rounded-[12px] p-3 text-center">
                              <Ruler className="w-4 h-4 text-[#8B95A1] mx-auto mb-1" />
                              <p className="text-[11px] text-[#8B95A1] mb-0.5">소요 시간</p>
                              <p className="text-[13px] font-bold text-[#191F28]">{guide.diyInfo.estimatedTime}</p>
                            </div>
                          </div>

                          <div className="bg-[#F8F9FA] rounded-[12px] p-4">
                            <p className="text-[13px] font-semibold text-[#191F28] mb-2 flex items-center gap-1.5">
                              <Wrench className="w-3.5 h-3.5 text-[#8B95A1]" />
                              준비물
                            </p>
                            <ul className="space-y-1.5">
                              {guide.diyInfo.materials.map((mat, i) => (
                                <li key={i} className="text-[12px] text-[#4E5968] flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                  {mat}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-[#F8F9FA] rounded-[12px] p-4">
                            <p className="text-[13px] font-semibold text-[#191F28] mb-2">제작 순서</p>
                            <ol className="space-y-2">
                              {guide.diyInfo.steps.map((step, i) => (
                                <li key={i} className="text-[12px] text-[#4E5968] flex items-start gap-3 leading-relaxed">
                                  <span className="w-5 h-5 rounded-full bg-[#FF8A80] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="bg-amber-50 rounded-[12px] p-4">
                            <p className="text-[13px] font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5" />
                              셀프 제작 꿀팁
                            </p>
                            <ul className="space-y-1.5">
                              {guide.diyInfo.tips.map((tip, i) => (
                                <li key={i} className="text-[12px] text-[#4E5968] leading-relaxed flex gap-2">
                                  <span className="text-amber-500 mt-0.5 flex-shrink-0">&#8226;</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-[16px] p-5 text-center">
            <p className="text-[13px] text-[#8B95A1] mb-1">더 많은 웨딩 굿즈 정보가 궁금하다면</p>
            <p className="text-[14px] font-semibold text-[#191F28]">커뮤니티에서 다른 예비부부들의 후기를 확인해 보세요</p>
          </div>
        </main>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
              <button onClick={() => setShowAddModal(false)} data-testid="button-close-modal">
                <X className="w-6 h-6 text-[#8B95A1]" />
              </button>
              <h3 className="text-[17px] font-bold text-[#191F28]">굿즈 추가</h3>
              <button 
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.price}
                className={`text-[15px] font-semibold ${
                  newItem.name && newItem.price ? "text-[#FF8A80]" : "text-[#B0B8C1]"
                }`}
                data-testid="button-save-goods"
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
                  data-testid="input-goods-name"
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
                    data-testid="input-goods-price"
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
                  data-testid="input-goods-link"
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
                  data-testid="input-goods-notes"
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
