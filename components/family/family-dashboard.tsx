"use client"

import { useState } from "react"
import { CalendarDays, ImageIcon, Book, Plus, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: "일정 추가", color: "bg-[#2D8B57]", href: "/family/calendar" },
  { icon: ImageIcon, label: "사진 추가", color: "bg-[#2D8B57]", href: "/family/gallery" },
  { icon: Book, label: "추억 보기", color: "bg-amber-500", href: "/family/archive" },
]

const TODAY_EVENTS: { time: string; title: string; category: string }[] = []

const RECENT_MEMORIES: { id: number; title: string; date: string; count: number }[] = []

export function FamilyDashboard() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "좋은 아침이에요"
    if (hour < 18) return "좋은 오후예요"
    return "좋은 저녁이에요"
  })

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Greeting */}
      <section>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1">Today</p>
        <h2 className="font-serif text-xl font-bold text-foreground">
          {greeting}, 현정 님
        </h2>
      </section>

      {/* Quick Actions */}
      <section className="flex gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex-1 flex flex-col items-center gap-2 p-4 bg-card border-3 border-secondary shadow-brutalist-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <div className={`w-10 h-10 ${action.color} flex items-center justify-center border-2 border-secondary`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-center">{action.label}</span>
            </Link>
          )
        })}
      </section>

      {/* Today's Schedule */}
      <section className="bg-card border-3 border-secondary p-4 shadow-brutalist">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-bold">오늘의 일정</h3>
          <Link href="/family/calendar" className="text-xs text-[#2D8B57] font-bold flex items-center gap-1">
            전체 보기 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {TODAY_EVENTS.length > 0 ? (
          <div className="space-y-3">
            {TODAY_EVENTS.map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 border-2 border-secondary/20">
                <div className="w-12 h-12 bg-[#2D8B57]/10 border-2 border-[#2D8B57]/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#2D8B57]">{event.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm mb-3">오늘 일정이 없어요</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D8B57] text-white text-sm font-bold border-2 border-secondary">
              <Plus className="w-4 h-4" />
              일정 추가하기
            </button>
          </div>
        )}
      </section>

      {/* AI Family Activity */}
      <Link
        href="/family/ai-recommend"
        className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-[16px] p-4 shadow-sm"
        data-testid="link-family-ai-recommend"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-white">AI 가족 활동 추천</p>
            <p className="text-[12px] text-white/70 mt-0.5">맞춤형 가족 나들이와 활동을 추천받으세요</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60" />
        </div>
      </Link>

      {/* Memory Archive Preview */}
      <section className="bg-card border-3 border-secondary p-4 shadow-brutalist">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-lg font-bold">추억 보관함</h3>
          </div>
          <Link href="/family/archive" className="text-xs text-amber-600 font-bold flex items-center gap-1">
            전체 보기 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {RECENT_MEMORIES.map((memory) => (
            <Link
              key={memory.id}
              href={`/family/archive/${memory.id}`}
              className="flex-shrink-0 w-36 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 p-3 hover:shadow-brutalist-sm transition-all"
            >
              <div className="w-full aspect-square bg-amber-200/50 border border-amber-300 mb-2 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-bold text-sm truncate">{memory.title}</p>
              <p className="text-xs text-muted-foreground">{memory.date} · {memory.count}장</p>
            </Link>
          ))}
          
          <Link
            href="/family/archive"
            className="flex-shrink-0 w-36 bg-muted/50 border-2 border-dashed border-muted-foreground/30 p-3 flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 border-2 border-muted-foreground/30 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground text-center">더 많은 추억</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
