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

const today = new Date().toISOString().split("T")[0]

const defaultWeddingChecklist: ChecklistItem[] = [
  { id: "w1", title: "예식장 투어 일정 잡기", category: "웨딩홀", dueDate: today, completed: false, priority: "high" },
  { id: "w2", title: "예식장 계약 확정", category: "웨딩홀", dueDate: today, completed: false, priority: "high" },
  { id: "w3", title: "스튜디오 업체 선택", category: "스튜디오", dueDate: today, completed: false, priority: "medium" },
  { id: "w4", title: "스튜디오 촬영 예약", category: "스튜디오", dueDate: today, completed: false, priority: "medium" },
  { id: "w5", title: "드레스 투어 및 피팅 예약", category: "드레스", dueDate: today, completed: false, priority: "medium" },
  { id: "w6", title: "본식 드레스 선택", category: "드레스", dueDate: today, completed: false, priority: "medium" },
  { id: "w7", title: "2부 드레스 선택", category: "2부드레스", dueDate: today, completed: false, priority: "low" },
  { id: "w8", title: "본식 메이크업 샵 예약", category: "메이크업", dueDate: today, completed: false, priority: "medium" },
  { id: "w9", title: "신랑 예복 맞춤/대여", category: "예복", dueDate: today, completed: false, priority: "medium" },
  { id: "w10", title: "예물 커플링 선택", category: "예물", dueDate: today, completed: false, priority: "medium" },
  { id: "w11", title: "본식 스냅 업체 선택", category: "본식스냅", dueDate: today, completed: false, priority: "medium" },
  { id: "w12", title: "DVD 업체 선택", category: "DVD", dueDate: today, completed: false, priority: "low" },
  { id: "w13", title: "식전 영상 제작 업체 선택", category: "식전영상", dueDate: today, completed: false, priority: "low" },
  { id: "w14", title: "식중 영상 업체 선택", category: "식중영상", dueDate: today, completed: false, priority: "low" },
  { id: "w15", title: "청첩장 디자인 선택", category: "청첩장", dueDate: today, completed: false, priority: "medium" },
  { id: "w16", title: "청첩장 주문 및 수령", category: "청첩장", dueDate: today, completed: false, priority: "low" },
  { id: "w17", title: "사회자 섭외", category: "사회자", dueDate: today, completed: false, priority: "medium" },
  { id: "w18", title: "축가 섭외", category: "기타", dueDate: today, completed: false, priority: "low" },
]

interface ChecklistContextType {
  items: ChecklistItem[]
  setItems: (items: ChecklistItem[]) => void
  addItem: (item: Omit<ChecklistItem, "id">) => void
  updateItem: (id: string, updates: Partial<ChecklistItem>) => void
  deleteItem: (id: string) => void
  toggleComplete: (id: string) => void
  isLoading: boolean
  completedCount: number
  totalCount: number
  progressPercent: number
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined)

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChecklist()
  }, [])

  const fetchChecklist = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/checklist?mode=wedding')
      if (!res.ok) {
        console.error('Failed to fetch checklist:', res.status)
        setItems(defaultWeddingChecklist)
        return
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        console.error('Invalid checklist response:', data)
        setItems(defaultWeddingChecklist)
        return
      }
      setItems(
        data.map(
          (item: {
            id: number
            title: string
            category: string
            dueDate: string
            completed: boolean
            priority: string
          }) => ({
            id: String(item.id),
            title: item.title,
            category: item.category,
            dueDate: item.dueDate ? item.dueDate.split("T")[0] : today,
            completed: item.completed,
            priority: (item.priority || "medium") as "high" | "medium" | "low",
          })
        )
      )
    } catch (error) {
      console.error('Error fetching checklist:', error)
      setItems(defaultWeddingChecklist)
    } finally {
      setIsLoading(false)
    }
  }

  const addItem = async (item: Omit<ChecklistItem, "id">) => {
    try {
      const res = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          dueDate: item.dueDate,
          priority: item.priority,
          mode: 'wedding'
        })
      })
      const newItem = await res.json()
      setItems(prev => [...prev, {
        id: String(newItem.id),
        title: newItem.title,
        category: newItem.category,
        dueDate: newItem.dueDate ? newItem.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        completed: newItem.completed,
        priority: newItem.priority || 'medium'
      }])
    } catch (error) {
      console.error('Error adding checklist item:', error)
    }
  }

  const updateItem = async (id: string, updates: Partial<ChecklistItem>) => {
    try {
      await fetch('/api/checklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id), ...updates })
      })
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ))
    } catch (error) {
      console.error('Error updating checklist item:', error)
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await fetch(`/api/checklist?id=${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting checklist item:', error)
    }
  }

  const toggleComplete = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    
    try {
      await fetch('/api/checklist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id), completed: !item.completed })
      })
      setItems(prev => prev.map(i =>
        i.id === id ? { ...i, completed: !i.completed } : i
      ))
    } catch (error) {
      console.error('Error toggling checklist item:', error)
    }
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
      isLoading,
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
