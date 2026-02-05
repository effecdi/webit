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
      const res = await fetch('/api/checklist?userId=default&mode=wedding')
      const data = await res.json()
      setItems(data.map((item: { id: number; title: string; category: string; dueDate: string; completed: boolean; priority: string }) => ({
        id: String(item.id),
        title: item.title,
        category: item.category,
        dueDate: item.dueDate ? item.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        completed: item.completed,
        priority: (item.priority || 'medium') as "high" | "medium" | "low"
      })))
    } catch (error) {
      console.error('Error fetching checklist:', error)
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
          userId: 'default',
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
