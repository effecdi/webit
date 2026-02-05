"use client"

import { useEffect, useRef } from "react"
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
  schedule: "bg-green-50 text-green-500",
  photo: "bg-blue-50 text-blue-500",
  travel: "bg-purple-50 text-purple-500",
  todo: "bg-pink-50 text-pink-500",
  general: "bg-gray-50 text-gray-500"
}

export function NotificationModal({ 
  isOpen, 
  onClose, 
  notifications, 
  onClearAll,
  mode = "dating" 
}: NotificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        const button = (event.target as Element)?.closest('[data-testid="button-notifications"]')
        if (!button) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const modeAccent = {
    dating: "text-pink-500",
    wedding: "text-[#3182F6]",
    family: "text-green-500"
  }

  if (!isOpen) return null

  return (
    <div 
      ref={modalRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-[20px] shadow-xl z-50 overflow-hidden" 
      data-testid="notification-modal"
    >
      <div className="p-4 border-b border-[#F2F4F6]">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#191F28]">알림</h3>
          {notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="text-[13px] text-[#8B95A1] hover:text-[#4E5968]"
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
            <Bell className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[14px] text-[#8B95A1]">새로운 알림이 없어요</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2F4F6]">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type]
              const colorClass = typeColors[notification.type]
              
              return (
                <div 
                  key={notification.id} 
                  className="p-4 hover:bg-[#FAFBFC] transition-colors"
                  data-testid={`notification-item-${notification.id}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#191F28] truncate">
                        {notification.title}
                      </p>
                      <p className="text-[13px] text-[#8B95A1] truncate">
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
