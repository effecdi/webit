"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Calendar, ImageIcon, Plane, Check, Bell } from "lucide-react"

export interface Notification {
  id: string
  type: "schedule" | "photo" | "travel" | "todo" | "general"
  title: string
  message: string
  time: string
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onClearAll: () => void
  mode?: "dating" | "wedding" | "family"
}

const typeIcons = {
  schedule: Calendar,
  photo: ImageIcon,
  travel: Plane,
  todo: Check,
  general: Bell
}

const typeColors = {
  schedule: "bg-green-50 text-green-500 dark:bg-green-950/40 dark:text-green-400",
  photo: "bg-[#F3E8FF] text-[#d63bf2] dark:bg-purple-950/40 dark:text-purple-400",
  travel: "bg-purple-50 text-purple-500 dark:bg-purple-950/40 dark:text-purple-400",
  todo: "bg-pink-50 text-pink-500 dark:bg-pink-950/40 dark:text-pink-400",
  general: "bg-gray-50 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
}

export function NotificationModal({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll,
  mode = "dating" 
}: NotificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true)
        })
      })
    } else {
      setAnimating(false)
      const timer = setTimeout(() => setVisible(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      const button = (event.target as Element)?.closest('[data-testid="button-notifications"]')
      if (!button) {
        onClose()
      }
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const modeAccent = {
    dating: "text-pink-500",
    wedding: "text-[#3182F6]",
    family: "text-green-500"
  }

  if (!visible) return null

  return (
    <div 
      ref={modalRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] rounded-[20px] shadow-2xl z-[60] overflow-hidden transition-all duration-200 ease-out origin-top-right"
      style={{
        opacity: animating ? 1 : 0,
        transform: animating 
          ? "scale(1) translateY(0)" 
          : "scale(0.92) translateY(-8px)",
        boxShadow: animating 
          ? "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)"
          : "0 10px 25px -5px rgba(0,0,0,0.1)",
      }}
      data-testid="notification-modal"
    >
      <div className="p-4 border-b border-[#F2F4F6] dark:border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#191F28] dark:text-[#e8e8e8]">알림</h3>
          {notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[13px] text-[#8B95A1] hover:text-[#4E5968] dark:text-[#888] dark:hover:text-[#ccc]"
              data-testid="button-clear-notifications"
            >
              모두 지우기
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell className="w-10 h-10 text-[#D1D5DB] dark:text-[#444] mx-auto mb-3" />
            <p className="text-[14px] text-[#8B95A1] dark:text-[#888]">새로운 알림이 없어요</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2F4F6] dark:divide-[#2a2a2a]">
            {notifications.map((notification, index) => {
              const Icon = typeIcons[notification.type]
              const colorClass = typeColors[notification.type]
              
              return (
                <div 
                  key={notification.id} 
                  className="p-4 hover:bg-[#FAFBFC] dark:hover:bg-[#222] transition-all duration-200 ease-out"
                  style={{
                    opacity: animating ? 1 : 0,
                    transform: animating ? "translateY(0)" : "translateY(6px)",
                    transitionDelay: animating ? `${60 + index * 30}ms` : "0ms",
                  }}
                  data-testid={`notification-item-${notification.id}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#191F28] dark:text-[#e8e8e8] truncate">
                        {notification.title}
                      </p>
                      <p className="text-[13px] text-[#8B95A1] dark:text-[#888] truncate">
                        {notification.message}
                      </p>
                      <p className={`text-[11px] ${modeAccent[mode]} mt-1`}>
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
