"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ModeSwitch } from "@/components/mode-switch";

const MOODS = [
  { emoji: "💕", label: "사랑스러워" },
  { emoji: "🥰", label: "행복해" },
  { emoji: "😊", label: "설레어" },
  { emoji: "🤗", label: "따뜻해" },
  { emoji: "✨", label: "특별해" },
];

export function DatingHero() {
  const [currentMood, setCurrentMood] = useState(MOODS[0]);
  const startDate = new Date("2023-03-15");
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="relative h-[420px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      
      {/* Magazine Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        <div className="bg-background border-2 border-secondary px-3 py-1 shadow-brutalist-sm">
          <span className="font-serif text-lg font-bold tracking-tight">WE:VE</span>
        </div>
        <ModeSwitch currentMode="dating" />
      </div>

      {/* Mood Badge - Kitsch Style */}
      <button 
        onClick={() => {
          const currentIndex = MOODS.findIndex(m => m.emoji === currentMood.emoji);
          setCurrentMood(MOODS[(currentIndex + 1) % MOODS.length]);
        }}
        className="absolute top-20 right-4 bg-[#FF6B9D] border-2 border-secondary px-4 py-2 shadow-brutalist rotate-3 hover:rotate-0 transition-transform"
      >
        <span className="text-2xl mr-2">{currentMood.emoji}</span>
        <span className="font-sans text-sm font-bold text-secondary">{currentMood.label}</span>
      </button>

      {/* D-Day Counter */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-background border-3 border-secondary p-4 shadow-brutalist-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest">Our Love Story</p>
              <p className="font-serif text-4xl font-black text-secondary">D+{diffDays}</p>
              <p className="text-sm font-sans text-muted-foreground mt-1">2023.03.15 ~</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-3 border-secondary bg-[#FFE4EC] flex items-center justify-center overflow-hidden">
                  <span className="text-xl">👩</span>
                </div>
                <div className="w-12 h-12 rounded-full border-3 border-secondary bg-[#E4F0FF] flex items-center justify-center overflow-hidden">
                  <span className="text-xl">👨</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#FFE4EC] border-2 border-secondary px-2 py-0.5">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-bold">민지 & 준호</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
