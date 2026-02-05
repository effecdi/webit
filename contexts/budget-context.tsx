"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  payer: "groom" | "bride" | "shared" | "parents"
  status: "paid" | "scheduled"
  method?: "cash" | "card" | "transfer"
  deposit?: number
  balance?: number
  dueDate?: string
  reminder?: boolean
  memo?: string
}

interface BudgetContextType {
  totalBudget: number
  setTotalBudget: (budget: number) => void
  expenses: Expense[]
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  // Calculated values
  totalPaid: number
  totalDeposits: number
  totalSpent: number
  totalScheduled: number
  remaining: number
  spentPercent: number
  scheduledPercent: number
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

const STORAGE_KEY = "wedding_budget_data"

const initialExpenses: Expense[] = [
  { id: "1", title: "빌라 드 지디 계약금", amount: 3000000, category: "예식장", date: "2025-01-15", payer: "groom", status: "paid", method: "transfer" },
  { id: "2", title: "드레스 가봉 비용", amount: 500000, category: "드레스", date: "2025-01-20", payer: "bride", status: "paid", method: "card" },
  { id: "3", title: "스튜디오 촬영 예약금", amount: 800000, category: "스튜디오", date: "2025-01-25", payer: "shared", status: "paid", method: "transfer" },
  { id: "4", title: "빌라 드 지디 잔금", amount: 5000000, category: "예식장", date: "2025-02-15", payer: "groom", status: "scheduled", deposit: 1000000, balance: 4000000, dueDate: "2025-05-01", reminder: true },
  { id: "5", title: "헤어메이크업", amount: 300000, category: "드레스", date: "2025-01-28", payer: "bride", status: "paid", method: "card" },
  { id: "6", title: "예물 반지", amount: 2500000, category: "예물", date: "2025-02-01", payer: "groom", status: "paid", method: "card" },
  { id: "7", title: "허니문 항공권", amount: 1800000, category: "허니문", date: "2025-02-05", payer: "shared", status: "scheduled", deposit: 500000, balance: 1300000, dueDate: "2025-06-01", reminder: true },
]

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [totalBudget, setTotalBudget] = useState(28500000)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.totalBudget) setTotalBudget(data.totalBudget)
        if (data.expenses) setExpenses(data.expenses)
      }
    } catch (e) {
      console.error("Failed to load budget data:", e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalBudget, expenses }))
      } catch (e) {
        console.error("Failed to save budget data:", e)
      }
    }
  }, [totalBudget, expenses, isLoaded])

  // Helper functions
  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev])
  }

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  // Calculated values
  const totalPaid = expenses.filter(e => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
  const totalDeposits = expenses.filter(e => e.status === "scheduled").reduce((sum, e) => sum + (e.deposit || 0), 0)
  const totalSpent = totalPaid + totalDeposits
  const totalScheduled = expenses.filter(e => e.status === "scheduled").reduce((sum, e) => sum + (e.balance || 0), 0)
  const remaining = totalBudget - totalSpent - totalScheduled
  const spentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const scheduledPercent = totalBudget > 0 ? Math.round((totalScheduled / totalBudget) * 100) : 0

  return (
    <BudgetContext.Provider value={{
      totalBudget,
      setTotalBudget,
      expenses,
      setExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      totalPaid,
      totalDeposits,
      totalSpent,
      totalScheduled,
      remaining,
      spentPercent,
      scheduledPercent,
    }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  const context = useContext(BudgetContext)
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider")
  }
  return context
}
