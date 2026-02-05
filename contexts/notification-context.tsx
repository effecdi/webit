"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export interface Notification {
  id: string
  type: "schedule" | "photo" | "travel" | "todo" | "general"
  title: string
  message: string
  time: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "time">) => void
  clearNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id" | "time">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: "방금 전"
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      clearNotifications,
      unreadCount: notifications.length
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
