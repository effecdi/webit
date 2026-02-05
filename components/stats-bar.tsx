"use client"

import { Camera, Calendar, MapPin, Heart } from "lucide-react"

const stats = [
  { icon: Camera, label: "사진", value: "248" },
  { icon: Calendar, label: "기념일", value: "12" },
  { icon: MapPin, label: "데이트", value: "89" },
  { icon: Heart, label: "편지", value: "36" },
]

export function StatsBar() {
  return (
    <section className="px-4 py-4">
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="border-3 border-secondary bg-card p-3 text-center hover:bg-primary transition-colors group"
          >
            <stat.icon className="w-5 h-5 mx-auto mb-1 text-foreground group-hover:text-secondary" />
            <p className="font-serif text-xl font-bold text-foreground group-hover:text-secondary">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-secondary/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
