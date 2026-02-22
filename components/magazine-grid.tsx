"use client"

import { Camera, Calendar, MessageCircle, Gift, Sparkles, BookOpen } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "PHOTO ALBUM",
    subtitle: "우리의 순간",
    description: "함께한 추억을 담아요",
    color: "bg-primary",
    size: "large",
  },
  {
    icon: Calendar,
    title: "D-DAY",
    subtitle: "기념일",
    description: "특별한 날을 기억해요",
    color: "bg-accent",
    size: "small",
  },
  {
    icon: MessageCircle,
    title: "LOVE LETTER",
    subtitle: "편지함",
    description: "마음을 전해요",
    color: "bg-card",
    size: "small",
  },
  {
    icon: Gift,
    title: "WISHLIST",
    subtitle: "위시리스트",
    description: "갖고 싶은 것들",
    color: "bg-accent",
    size: "medium",
  },
  {
    icon: Sparkles,
    title: "MOOD",
    subtitle: "오늘의 기분",
    description: "지금 어떤 기분이야?",
    color: "bg-primary",
    size: "small",
  },
  {
    icon: BookOpen,
    title: "OUR STORY",
    subtitle: "우리의 이야기",
    description: "타임라인으로 보기",
    color: "bg-card",
    size: "medium",
  },
]

export function MagazineGrid() {
  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-foreground">FEATURES</h3>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">우리만의 공간</p>
        </div>
        <div className="bg-secondary text-secondary-foreground px-3 py-1 text-xs font-bold uppercase">
          New
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`
              ${feature.size === "large" ? "col-span-2" : "col-span-1"}
              ${feature.size === "medium" ? "row-span-1" : ""}
              ${feature.color}
              border-3 border-secondary p-4 cursor-pointer
              hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--secondary)]
              transition-all duration-200
              group
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-secondary flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-foreground/60 font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            
            <div>
              <p className="text-[10px] uppercase tracking-widest text-foreground/60 mb-1">{feature.subtitle}</p>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1 tracking-tight">{feature.title}</h4>
              <p className="text-xs text-foreground/70">{feature.description}</p>
            </div>
            
            {feature.size === "large" && (
              <div className="mt-4 flex items-center gap-2">
                <span className="bg-secondary text-secondary-foreground px-2 py-1 text-[10px] font-bold uppercase">Photos</span>
                <span className="bg-secondary/20 text-foreground px-2 py-1 text-[10px] font-bold uppercase border border-secondary">View All</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Bottom Quote Section */}
      <div className="mt-6 border-3 border-secondary bg-secondary p-6 text-center">
        <p className="font-serif text-lg md:text-xl text-secondary-foreground italic text-balance">
          {"\"사랑은 매일 새로운 페이지를 쓰는 것\""}
        </p>
        <p className="text-secondary-foreground/60 text-xs mt-2 uppercase tracking-widest">— LOVEY Magazine</p>
      </div>
    </section>
  )
}
