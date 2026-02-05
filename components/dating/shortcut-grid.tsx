"use client";

import Link from "next/link";
import { Calendar, ImageIcon, Plane } from "lucide-react";

const SHORTCUTS = [
  {
    id: "calendar",
    label: "캘린더",
    icon: Calendar,
    href: "/dating/calendar",
    color: "bg-[#FFE4EC]",
    badge: "3",
    badgeColor: "bg-primary",
  },
  {
    id: "album",
    label: "앨범",
    icon: ImageIcon,
    href: "/dating/gallery",
    color: "bg-[#E4F0FF]",
    badge: "128",
    badgeColor: "bg-[#6B9DFF]",
  },
  {
    id: "travel",
    label: "여행 계획",
    icon: Plane,
    href: "/dating/gallery",
    color: "bg-[#F0E4FF]",
    badge: "D-12",
    badgeColor: "bg-[#9D6BFF]",
  },
];

export function ShortcutGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {SHORTCUTS.map((shortcut) => (
        <Link
          key={shortcut.id}
          href={shortcut.href}
          className={`relative ${shortcut.color} border-3 border-secondary p-4 shadow-brutalist hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex flex-col items-center justify-center aspect-square`}
        >
          {/* Badge */}
          <div className={`absolute -top-2 -right-2 ${shortcut.badgeColor} border-2 border-secondary px-2 py-0.5 shadow-brutalist-sm`}>
            <span className="text-[10px] font-bold text-white">{shortcut.badge}</span>
          </div>
          
          <shortcut.icon className="w-8 h-8 text-secondary mb-2" strokeWidth={2.5} />
          <span className="font-sans text-sm font-bold text-secondary">{shortcut.label}</span>
        </Link>
      ))}
    </div>
  );
}
