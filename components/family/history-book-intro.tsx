"use client"

import { useState, useEffect } from "react"
import { Heart, Gem, Home, Book, Sparkles, ChevronRight, Plus, X, Calendar, Pencil, Trash2 } from "lucide-react"

interface HistoryBookIntroProps {
  onComplete: () => void
}

interface Milestone {
  id: string
  date: string
  label: string
  icon: string
  color: string
}

const ICON_MAP: Record<string, typeof Heart> = {
  Heart,
  Gem,
  Home,
  Sparkles,
}

const ICON_OPTIONS = [
  { key: "Heart", icon: Heart, label: "하트", color: "text-pink-500" },
  { key: "Sparkles", icon: Sparkles, label: "별", color: "text-amber-500" },
  { key: "Gem", icon: Gem, label: "반지", color: "text-[#3182F6]" },
  { key: "Home", icon: Home, label: "집", color: "text-green-500" },
]

function getIconComponent(key: string) {
  return ICON_MAP[key] || Heart
}

function getIconColor(key: string) {
  const opt = ICON_OPTIONS.find(o => o.key === key)
  return opt?.color || "text-pink-500"
}

function buildMilestonesFromStorage(): Milestone[] {
  const milestones: Milestone[] = []
  const firstMeetDate = localStorage.getItem("survey_firstMeetDate")
  const weddingDate = localStorage.getItem("wedding_date")

  if (firstMeetDate) {
    const d = new Date(firstMeetDate)
    if (isNaN(d.getTime())) return milestones
    milestones.push({
      id: "meet",
      date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
      label: "첫 만남",
      icon: "Heart",
      color: "text-pink-500",
    })

    const d100 = new Date(d)
    d100.setDate(d100.getDate() + 100)
    milestones.push({
      id: "100days",
      date: `${d100.getFullYear()}.${String(d100.getMonth() + 1).padStart(2, "0")}.${String(d100.getDate()).padStart(2, "0")}`,
      label: "100일",
      icon: "Heart",
      color: "text-pink-500",
    })

    const d1yr = new Date(d)
    d1yr.setFullYear(d1yr.getFullYear() + 1)
    milestones.push({
      id: "1year",
      date: `${d1yr.getFullYear()}.${String(d1yr.getMonth() + 1).padStart(2, "0")}.${String(d1yr.getDate()).padStart(2, "0")}`,
      label: "1주년",
      icon: "Sparkles",
      color: "text-amber-500",
    })
  }

  if (weddingDate) {
    const w = new Date(weddingDate)
    if (!isNaN(w.getTime())) milestones.push({
      id: "wedding",
      date: `${w.getFullYear()}.${String(w.getMonth() + 1).padStart(2, "0")}.${String(w.getDate()).padStart(2, "0")}`,
      label: "결혼식",
      icon: "Home",
      color: "text-green-500",
    })
  }

  const saved = localStorage.getItem("family_milestones_custom")
  if (saved) {
    try {
      const custom: Milestone[] = JSON.parse(saved)
      milestones.push(...custom)
    } catch {
      // ignore
    }
  }

  milestones.sort((a, b) => a.date.localeCompare(b.date))
  return milestones
}

export function HistoryBookIntro({ onComplete }: HistoryBookIntroProps) {
  const [stage, setStage] = useState(0)
  const [visibleMilestones, setVisibleMilestones] = useState(0)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [myName, setMyName] = useState("")
  const [partnerName, setPartnerName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [newIcon, setNewIcon] = useState("Heart")

  useEffect(() => {
    const my = localStorage.getItem("survey_myName") || ""
    const partner = localStorage.getItem("survey_partnerName") || ""
    setMyName(my)
    setPartnerName(partner)
    setMilestones(buildMilestonesFromStorage())
  }, [])

  useEffect(() => {
    if (stage === 1 && milestones.length > 0) {
      const interval = setInterval(() => {
        setVisibleMilestones((prev) => {
          if (prev >= milestones.length) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 600)
      return () => clearInterval(interval)
    }
    if (stage === 1 && milestones.length === 0) {
      setVisibleMilestones(0)
    }
  }, [stage, milestones.length])

  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 2000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  const saveCustomMilestones = (all: Milestone[]) => {
    const autoIds = ["meet", "100days", "1year", "wedding"]
    const custom = all.filter(m => !autoIds.includes(m.id))
    localStorage.setItem("family_milestones_custom", JSON.stringify(custom))
  }

  const handleAddMilestone = () => {
    if (!newDate || !newLabel.trim()) return
    const d = new Date(newDate)
    const formatted = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`

    if (editingId) {
      const updated = milestones.map(m =>
        m.id === editingId
          ? { ...m, date: formatted, label: newLabel.trim(), icon: newIcon, color: getIconColor(newIcon) }
          : m
      ).sort((a, b) => a.date.localeCompare(b.date))
      setMilestones(updated)
      saveCustomMilestones(updated)
      setEditingId(null)
    } else {
      const milestone: Milestone = {
        id: `custom_${Date.now()}`,
        date: formatted,
        label: newLabel.trim(),
        icon: newIcon,
        color: getIconColor(newIcon),
      }
      const updated = [...milestones, milestone].sort((a, b) => a.date.localeCompare(b.date))
      setMilestones(updated)
      saveCustomMilestones(updated)
    }

    setNewDate("")
    setNewLabel("")
    setNewIcon("Heart")
    setShowAddForm(false)
    setVisibleMilestones(999)
  }

  const handleEditMilestone = (m: Milestone) => {
    const autoIds = ["meet", "100days", "1year", "wedding"]
    if (autoIds.includes(m.id)) return
    setEditingId(m.id)
    const parts = m.date.split(".")
    setNewDate(`${parts[0]}-${parts[1]}-${parts[2]}`)
    setNewLabel(m.label)
    setNewIcon(m.icon)
    setShowAddForm(true)
    setVisibleMilestones(999)
  }

  const handleDeleteMilestone = (id: string) => {
    const autoIds = ["meet", "100days", "1year", "wedding"]
    if (autoIds.includes(id)) return
    const updated = milestones.filter(m => m.id !== id)
    setMilestones(updated)
    saveCustomMilestones(updated)
  }

  const nameText = myName && partnerName
    ? `${myName} 님과 ${partnerName} 님`
    : myName
      ? `${myName} 님`
      : "두 분"

  return (
    <div className="fixed inset-0 z-50 bg-[#191F28] overflow-hidden">
      {stage === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <Home className="w-12 h-12 text-green-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4" data-testid="text-congrats-title">
            가족이 된 것을 축하합니다!
          </h1>
          <p className="text-white/60 text-center max-w-xs text-[15px]" data-testid="text-congrats-names">
            {nameText}, 이제 하나의 가족으로
            <br />
            새로운 이야기를 시작해보세요
          </p>
        </div>
      )}

      {stage === 1 && (
        <div className="absolute inset-0 flex flex-col p-6 overflow-y-auto">
          <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-[12px] tracking-[0.2em] text-white/40 uppercase mb-3">Our Journey</p>
            <h2 className="text-2xl font-bold text-white text-center mb-8 text-balance">
              연애부터 결혼까지
              <br />
              <span className="text-green-500">우리의 소중한 기록</span>
            </h2>

            {milestones.length === 0 ? (
              <div className="w-full max-w-xs text-center py-8">
                <p className="text-white/50 text-[15px] mb-4">아직 기록된 이야기가 없어요</p>
                <p className="text-white/30 text-[13px] mb-6">프로필에서 첫 만남 날짜를 설정하거나<br />아래에서 기념일을 추가해보세요</p>
              </div>
            ) : (
              <div className="relative w-full max-w-xs space-y-3">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10 rounded-full" />
                {milestones.map((milestone, index) => {
                  const Icon = getIconComponent(milestone.icon)
                  const isVisible = index < visibleMilestones
                  const isCustom = !["meet", "100days", "1year", "wedding"].includes(milestone.id)

                  return (
                    <div
                      key={milestone.id}
                      className={`relative flex items-center gap-4 transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                    >
                      <div className="relative z-10 w-10 h-10 rounded-full bg-[#2D2D3A] flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${milestone.color}`} />
                      </div>
                      <div className="flex-1 py-2.5 px-4 bg-white/5 rounded-[14px]">
                        <p className="text-[11px] text-white/40">{milestone.date}</p>
                        <p className="text-[14px] font-medium text-white">{milestone.label}</p>
                      </div>
                      {isCustom && isVisible && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditMilestone(milestone)}
                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                            data-testid={`button-edit-milestone-${milestone.id}`}
                          >
                            <Pencil className="w-3 h-3 text-white/60" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                            data-testid={`button-delete-milestone-${milestone.id}`}
                          >
                            <Trash2 className="w-3 h-3 text-white/60" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {!showAddForm && (visibleMilestones >= milestones.length || milestones.length === 0) && (
              <div className="mt-6 animate-fade-in">
                <button
                  onClick={() => { setShowAddForm(true); setVisibleMilestones(999) }}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white/80 font-medium rounded-[14px] transition-colors hover:bg-white/15 mb-3"
                  data-testid="button-add-milestone"
                >
                  <Plus className="w-4 h-4" />
                  <span>기념일 추가하기</span>
                </button>
              </div>
            )}

            {showAddForm && (
              <div className="mt-6 w-full max-w-xs bg-white/10 rounded-[18px] p-5 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[15px] font-bold text-white">
                    {editingId ? "기념일 수정" : "기념일 추가"}
                  </h3>
                  <button
                    onClick={() => { setShowAddForm(false); setEditingId(null); setNewDate(""); setNewLabel(""); setNewIcon("Heart") }}
                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
                    data-testid="button-close-add-form"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[12px] text-white/50 mb-1 block">날짜</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="date"
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        className="w-full bg-white/10 border border-white/10 rounded-[10px] pl-10 pr-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                        data-testid="input-milestone-date"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] text-white/50 mb-1 block">이름</label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      placeholder="예: 프로포즈, 첫 여행"
                      className="w-full bg-white/10 border border-white/10 rounded-[10px] px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
                      data-testid="input-milestone-label"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] text-white/50 mb-1.5 block">아이콘</label>
                    <div className="flex gap-2">
                      {ICON_OPTIONS.map(opt => {
                        const OptIcon = opt.icon
                        return (
                          <button
                            key={opt.key}
                            onClick={() => setNewIcon(opt.key)}
                            className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors ${
                              newIcon === opt.key ? "bg-white/20 ring-1 ring-green-500" : "bg-white/5"
                            }`}
                            data-testid={`button-icon-${opt.key}`}
                          >
                            <OptIcon className={`w-4 h-4 ${opt.color}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddMilestone}
                    disabled={!newDate || !newLabel.trim()}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold rounded-[12px] transition-colors mt-2"
                    data-testid="button-save-milestone"
                  >
                    {editingId ? "수정 완료" : "추가하기"}
                  </button>
                </div>
              </div>
            )}

            {!showAddForm && (visibleMilestones >= milestones.length || milestones.length === 0) && (
              <div className="mt-3 animate-fade-in">
                <button
                  onClick={() => setStage(2)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[14px] transition-colors"
                  data-testid="button-save-memories"
                >
                  <span>추억 보관하기</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <Book className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-3">
            추억이 히스토리 북에 저장되었어요
          </h2>
          <p className="text-white/50 text-center text-[14px] max-w-xs mb-8">
            연애부터 결혼까지의 모든 순간이
            <br />
            안전하게 보관되었어요. 언제든 꺼내볼 수 있어요.
          </p>

          <div className="w-full max-w-xs space-y-3">
            <button
              onClick={onComplete}
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-[14px] transition-colors"
              data-testid="button-start-family-mode"
            >
              가족 모드 시작하기
            </button>
            <p className="text-center text-[12px] text-white/30">
              이제, 부부로서의 첫 페이지를 시작해 볼까요?
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
