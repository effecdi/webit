"use client";

import React from "react"

import { useState } from "react";
import { Bell, MessageCircle, Calendar, Heart, Gift, Clock } from "lucide-react";

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "message",
      icon: MessageCircle,
      label: "메시지 알림",
      description: "상대방이 메시지를 보냈을 때",
      enabled: true,
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "일정 알림",
      description: "예정된 데이트 1일 전, 1시간 전",
      enabled: true,
    },
    {
      id: "anniversary",
      icon: Heart,
      label: "기념일 알림",
      description: "D-Day 및 특별한 날 리마인드",
      enabled: true,
    },
    {
      id: "gift",
      icon: Gift,
      label: "선물 추천",
      description: "기념일 맞춤 선물 추천",
      enabled: false,
    },
    {
      id: "daily",
      icon: Clock,
      label: "데일리 알림",
      description: "매일 사랑 표현 리마인드",
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5" />
        <h2 className="font-serif text-lg font-bold">알림 설정</h2>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border-2 border-secondary bg-background hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-secondary flex items-center justify-center bg-muted">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleNotification(item.id)}
                className={`relative w-12 h-7 border-2 border-secondary transition-colors ${
                  item.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-background border-2 border-secondary transition-transform ${
                    item.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
