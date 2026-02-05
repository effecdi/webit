"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface ChecklistItem {
  id: string
  title: string
  category: string
  dueDate: string
  completed: boolean
  memo?: string
  priority: "high" | "medium" | "low"
}

interface ChecklistContextType {
  items: ChecklistItem[]
  setItems: (items: ChecklistItem[]) => void
  addItem: (item: Omit<ChecklistItem, "id">) => void
  updateItem: (id: string, updates: Partial<ChecklistItem>) => void
  deleteItem: (id: string) => void
  toggleComplete: (id: string) => void
  completedCount: number
  totalCount: number
  progressPercent: number
}

const defaultItems: ChecklistItem[] = [
  { id: "1", title: "웨딩홀 투어 예약", category: "예식장", dueDate: "2025-02-15", completed: true, priority: "high" },
  { id: "2", title: "웨딩홀 계약", category: "예식장", dueDate: "2025-02-28", completed: true, priority: "high" },
  { id: "3", title: "드레스 가봉 1차", category: "드레스", dueDate: "2025-03-10", completed: true, priority: "medium" },
  { id: "4", title: "스튜디오 촬영 예약", category: "스튜디오", dueDate: "2025-03-15", completed: false, priority: "high" },
  { id: "5", title: "청첩장 문구 작성", category: "청첩장", dueDate: "2025-03-20", completed: false, priority: "medium" },
  { id: "6", title: "허니문 항공권 예약", category: "허니문", dueDate: "2025-04-01", completed: false, priority: "medium" },
  { id: "7", title: "예물 구매", category: "예물", dueDate: "2025-04-15", completed: false, priority: "low" },
  { id: "8", title: "드레스 가봉 2차", category: "드레스", dueDate: "2025-05-01", completed: false, priority: "medium" },
  { id: "9", title: "본식 스냅 작가 섭외", category: "스냅", dueDate: "2025-05-10", completed: false, priority: "high" },
  { id: "10", title: "혼수 가전 구매", category: "혼수", dueDate: "2025-05-20", completed: false, priority: "low" },
]

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined)

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ChecklistItem[]>(defaultItems)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wedding-checklist")
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse checklist data", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wedding-checklist", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: Omit<ChecklistItem, "id">) => {
    const newItem: ChecklistItem = {
      ...item,
      id: Date.now().toString(),
    }
    setItems([...items, newItem])
  }

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const toggleComplete = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <ChecklistContext.Provider value={{
      items,
      setItems,
      addItem,
      updateItem,
      deleteItem,
      toggleComplete,
      completedCount,
      totalCount,
      progressPercent,
    }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const context = useContext(ChecklistContext)
  if (context === undefined) {
    throw new Error("useChecklist must be used within a ChecklistProvider")
  }
  return context
}
