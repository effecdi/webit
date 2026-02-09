"use client";

import React from "react";
import { useState } from "react";
import { LayoutGrid, Heart, Calendar, ImageIcon, Clock, Crown } from "lucide-react";

interface WidgetItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  preview: string;
  isPremium: boolean;
  enabled: boolean;
}

export function WidgetSettings() {
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    {
      id: "dday",
      name: "D-Day 위젯",
      description: "홈 화면에서 D-Day 확인",
      icon: Heart,
      preview: "D+365",
      isPremium: false,
      enabled: true,
    },
    {
      id: "calendar",
      name: "캘린더 위젯",
      description: "이번 주 일정 미리보기",
      icon: Calendar,
      preview: "2월 14일 데이트",
      isPremium: false,
      enabled: false,
    },
    {
      id: "photo",
      name: "포토 위젯",
      description: "커플 사진 슬라이드쇼",
      icon: ImageIcon,
      preview: "랜덤 사진",
      isPremium: true,
      enabled: false,
    },
    {
      id: "countdown",
      name: "카운트다운 위젯",
      description: "다음 기념일까지 남은 시간",
      icon: Clock,
      preview: "100일 D-30",
      isPremium: true,
      enabled: false,
    },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid className="w-5 h-5" />
        <h2 className="font-serif text-lg font-bold">위젯 설정</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        홈 화면에 추가할 위젯을 선택하세요
      </p>

      <div className="grid grid-cols-2 gap-3">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <button
              key={widget.id}
              onClick={() => toggleWidget(widget.id)}
              className={`relative p-4 border-3 text-left transition-all ${
                widget.enabled
                  ? "border-primary bg-primary/10 shadow-brutalist-sm"
                  : "border-secondary bg-background hover:bg-muted"
              }`}
            >
              {widget.isPremium && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 border-2 border-secondary flex items-center justify-center">
                  <Crown className="w-3 h-3 text-secondary" />
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 border-2 border-secondary flex items-center justify-center ${
                    widget.enabled ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${widget.enabled ? "text-primary-foreground" : ""}`} />
                </div>
                <div
                  className={`w-4 h-4 border-2 border-secondary ${
                    widget.enabled ? "bg-primary" : "bg-background"
                  }`}
                />
              </div>

              <p className="font-bold text-sm mb-1">{widget.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{widget.description}</p>

              {/* Widget Preview */}
              <div className="mt-3 p-2 bg-muted border-2 border-dashed border-secondary/50 text-center">
                <span className="text-xs font-mono">{widget.preview}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-muted border-2 border-dashed border-secondary">
        <p className="text-xs text-center text-muted-foreground">
          위젯을 활성화한 후, 기기 홈 화면에서 WE:BEAT 위젯을 추가하세요
        </p>
      </div>
    </section>
  );
}
