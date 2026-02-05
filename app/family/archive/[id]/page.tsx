"use client"

import { useState, use } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Heart, 
  Gem, 
  Home,
  Plus,
  MoreHorizontal,
  X,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Trash2
} from "lucide-react"
import { FamilyBottomNav } from "@/components/family/family-bottom-nav"

interface Memory {
  id: string
  date: string
  title: string
  location?: string
  photos: string[]
  description?: string
}

const ARCHIVE_DATA: Record<string, {
  title: string
  subtitle: string
  period: string
  gradient: string
  lightBg: string
  iconColor: string
  icon: "heart" | "gem" | "home"
  memories: Memory[]
}> = {
  "dating-2024": {
    title: "연애 시절",
    subtitle: "우리의 시작",
    period: "2024.03 - 2024.12",
    gradient: "from-pink-500 to-rose-500",
    lightBg: "bg-pink-50",
    iconColor: "#ec4899",
    icon: "heart",
    memories: [
      {
        id: "1",
        date: "2024.03.15",
        title: "첫 만남",
        location: "홍대 카페",
        photos: ["https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400"],
        description: "소개팅으로 처음 만난 날. 3시간 동안 이야기가 끊이지 않았어요."
      },
      {
        id: "2",
        date: "2024.04.20",
        title: "첫 데이트",
        location: "경복궁",
        photos: [
          "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=400",
          "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400"
        ],
        description: "한복 입고 경복궁 데이트. 사진도 많이 찍었어요."
      },
      {
        id: "3",
        date: "2024.06.23",
        title: "100일",
        location: "남산타워",
        photos: [
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400",
          "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400",
          "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400"
        ],
        description: "100일 기념으로 남산타워에서 자물쇠도 걸고 케이블카도 탔어요."
      },
      {
        id: "4",
        date: "2024.08.10",
        title: "첫 여행",
        location: "부산",
        photos: [
          "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400",
          "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400"
        ],
        description: "1박 2일 부산 여행. 해운대에서 밤새 이야기하던 날."
      },
      {
        id: "5",
        date: "2024.12.24",
        title: "크리스마스",
        location: "명동",
        photos: ["https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400"],
        description: "첫 크리스마스를 함께 보냈어요."
      }
    ]
  },
  "wedding-prep-2025": {
    title: "결혼 준비",
    subtitle: "함께 준비한 날들",
    period: "2025.01 - 2025.12",
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    iconColor: "#f59e0b",
    icon: "gem",
    memories: [
      {
        id: "1",
        date: "2025.01.14",
        title: "프로포즈",
        location: "한강",
        photos: [
          "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400",
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400"
        ],
        description: "한강에서 서프라이즈 프로포즈! 평생 잊지 못할 순간."
      },
      {
        id: "2",
        date: "2025.03.08",
        title: "웨딩홀 투어",
        location: "강남",
        photos: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400"],
        description: "5군데 웨딩홀 투어. 드디어 마음에 드는 곳을 찾았어요."
      },
      {
        id: "3",
        date: "2025.05.20",
        title: "스튜디오 촬영",
        location: "청담동",
        photos: [
          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
          "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400",
          "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400"
        ],
        description: "웨딩 촬영 완료! 정말 예쁘게 나왔어요."
      },
      {
        id: "4",
        date: "2025.08.15",
        title: "드레스 피팅",
        location: "이태원",
        photos: ["https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400"],
        description: "드레스 최종 피팅. 완벽해요!"
      },
      {
        id: "5",
        date: "2025.12.07",
        title: "결혼식",
        location: "그랜드 하얏트",
        photos: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
          "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=400"
        ],
        description: "우리의 결혼식. 가장 행복했던 날."
      }
    ]
  },
  "honeymoon-2025": {
    title: "신혼",
    subtitle: "새로운 시작",
    period: "2025.12 - 현재",
    gradient: "from-green-500 to-emerald-500",
    lightBg: "bg-green-50",
    iconColor: "#22c55e",
    icon: "home",
    memories: [
      {
        id: "1",
        date: "2025.12.10",
        title: "신혼여행 출발",
        location: "인천공항",
        photos: ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400"],
        description: "드디어 몰디브로 출발!"
      },
      {
        id: "2",
        date: "2025.12.11",
        title: "몰디브 Day 1",
        location: "몰디브",
        photos: [
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400",
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400",
          "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=400"
        ],
        description: "수상빌라에서의 첫날. 꿈만 같아요."
      },
      {
        id: "3",
        date: "2025.12.15",
        title: "스노클링",
        location: "몰디브",
        photos: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400",
          "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400"
        ],
        description: "함께 스노클링! 바다거북이도 봤어요."
      },
      {
        id: "4",
        date: "2025.12.20",
        title: "새 집",
        location: "서울",
        photos: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"],
        description: "드디어 새 집에 입주했어요. 우리만의 보금자리!"
      }
    ]
  }
}

const IconComponent = ({ type, color }: { type: string; color: string }) => {
  switch (type) {
    case "heart":
      return <Heart className="w-6 h-6" style={{ color }} />
    case "gem":
      return <Gem className="w-6 h-6" style={{ color }} />
    case "home":
      return <Home className="w-6 h-6" style={{ color }} />
    default:
      return <Heart className="w-6 h-6" style={{ color }} />
  }
}

export default function ArchiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)

  const archive = ARCHIVE_DATA[id]

  if (!archive) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[17px] font-bold text-[#191F28] mb-2">존재하지 않는 페이지입니다</p>
          <Link href="/family/archive" className="text-[#3182F6]">돌아가기</Link>
        </div>
      </div>
    )
  }

  const totalPhotos = archive.memories.reduce((sum, m) => sum + m.photos.length, 0)

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-24">
      {/* Header */}
      <header className={`bg-gradient-to-r ${archive.gradient} px-4 pt-4 pb-8`}>
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/family/archive"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[18px] bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <IconComponent type={archive.icon} color="white" />
          </div>
          <div>
            <h1 className="text-[24px] font-bold text-white mb-1">{archive.title}</h1>
            <p className="text-[14px] text-white/80">{archive.period}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6">
          <div>
            <p className="text-[24px] font-bold text-white">{archive.memories.length}</p>
            <p className="text-[12px] text-white/70">추억</p>
          </div>
          <div>
            <p className="text-[24px] font-bold text-white">{totalPhotos}</p>
            <p className="text-[12px] text-white/70">사진</p>
          </div>
        </div>
      </header>

      {/* Memory Timeline */}
      <main className="px-5 py-5 space-y-4 -mt-4">
        {archive.memories.map((memory, index) => (
          <div 
            key={memory.id}
            className="bg-white rounded-[20px] shadow-sm overflow-hidden"
            onClick={() => {
              setSelectedMemory(memory)
              setCurrentPhotoIndex(0)
            }}
          >
            {/* Photo Preview */}
            <div className="relative aspect-[16/9] bg-[#F2F4F6]">
              <img 
                src={memory.photos[0] || "/placeholder.svg"} 
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              {memory.photos.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 rounded-full text-[12px] text-white font-medium">
                  +{memory.photos.length - 1}
                </div>
              )}
              {/* Date Badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                <p className="text-[12px] font-semibold text-[#191F28]">{memory.date}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-[17px] font-bold text-[#191F28] mb-1">{memory.title}</h3>
              {memory.location && (
                <div className="flex items-center gap-1 text-[13px] text-[#8B95A1] mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {memory.location}
                </div>
              )}
              {memory.description && (
                <p className="text-[14px] text-[#4E5968] leading-relaxed line-clamp-2">
                  {memory.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* FAB - Add Memory */}
      <button
        onClick={() => setShowAddModal(true)}
        className={`fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-r ${archive.gradient} shadow-lg flex items-center justify-center z-40 hover:opacity-90 transition-opacity`}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Photo Viewer Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-[60] bg-black">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedMemory(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="text-center">
                <p className="text-[15px] font-bold text-white">{selectedMemory.title}</p>
                <p className="text-[12px] text-white/70">{selectedMemory.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="h-full flex items-center justify-center">
            <img 
              src={selectedMemory.photos[currentPhotoIndex] || "/placeholder.svg"} 
              alt={selectedMemory.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation Arrows */}
          {selectedMemory.photos.length > 1 && (
            <>
              {currentPhotoIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentPhotoIndex(currentPhotoIndex - 1)
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {currentPhotoIndex < selectedMemory.photos.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentPhotoIndex(currentPhotoIndex + 1)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </>
          )}

          {/* Footer - Photo Counter & Description */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
            {/* Photo Counter */}
            {selectedMemory.photos.length > 1 && (
              <div className="flex justify-center gap-1.5 mb-4">
                {selectedMemory.photos.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentPhotoIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Description */}
            {selectedMemory.description && (
              <p className="text-[14px] text-white/90 text-center leading-relaxed">
                {selectedMemory.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 border-b border-[#F2F4F6]">
              <h3 className="text-[19px] font-bold text-[#191F28]">새 추억 추가</h3>
              <p className="text-[13px] text-[#8B95A1] mt-1">{archive.title}에 새로운 추억을 기록하세요</p>
            </div>

            {/* Content */}
            <div className="px-5 py-5 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">날짜</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">제목</label>
                <input 
                  type="text"
                  placeholder="어떤 추억인가요?"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">장소</label>
                <input 
                  type="text"
                  placeholder="어디서 있었던 일인가요?"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">사진</label>
                <button className="w-full py-8 border-2 border-dashed border-[#D1D6DB] rounded-[12px] flex flex-col items-center justify-center gap-2 hover:border-[#3182F6] transition-colors">
                  <Plus className="w-8 h-8 text-[#B0B8C1]" />
                  <span className="text-[14px] text-[#8B95A1]">사진 추가하기</span>
                </button>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">메모</label>
                <textarea 
                  placeholder="이 순간에 대해 기록해보세요"
                  rows={3}
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#3182F6] resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-8">
              <button className={`w-full py-4 rounded-[14px] bg-gradient-to-r ${archive.gradient} text-white font-semibold text-[16px] hover:opacity-90 transition-opacity`}>
                추억 저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      <FamilyBottomNav />
    </div>
  )
}
