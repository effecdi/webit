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
  isLoading: boolean
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

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [totalBudget, setTotalBudget] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
    loadBudget()
  }, [])

  const loadBudget = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.totalBudget) {
          setTotalBudget(data.totalBudget)
          return
        }
      }
      
      // Also check for budget from wedding onboarding
      const onboardingBudget = localStorage.getItem("wedding_budget")
      if (onboardingBudget) {
        const budget = Number(onboardingBudget)
        if (budget > 0) {
          setTotalBudget(budget)
          saveBudget(budget) // Save to main storage key for future use
        }
      }
    } catch (e) {
      console.error("Failed to load budget data:", e)
    }
  }

  const saveBudget = (budget: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalBudget: budget }))
    } catch (e) {
      console.error("Failed to save budget data:", e)
    }
  }

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/expenses?mode=wedding')
      if (!res.ok) return
      const data = await res.json()
      if (!Array.isArray(data)) return
      setExpenses(data.map((e: { id: number; title: string; amount: string; category: string; date: string; isPaid: boolean; memo: string }) => ({
        id: String(e.id),
        title: e.title,
        amount: Number(e.amount),
        category: e.category,
        date: e.date.split('T')[0],
        payer: 'shared' as const,
        status: e.isPaid ? 'paid' as const : 'scheduled' as const,
        method: 'card' as const,
        memo: e.memo
      })))
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetTotalBudget = (budget: number) => {
    setTotalBudget(budget)
    saveBudget(budget)
  }

  const addExpense = async (expense: Expense) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          isPaid: expense.status === 'paid',
          memo: expense.memo,
          mode: 'wedding'
        })
      })
      const newExpense = await res.json()
      setExpenses(prev => [{
        id: String(newExpense.id),
        title: newExpense.title,
        amount: Number(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date.split('T')[0],
        payer: expense.payer,
        status: newExpense.isPaid ? 'paid' : 'scheduled',
        method: expense.method,
        memo: newExpense.memo
      }, ...prev])
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const patchBody: Record<string, unknown> = {
        id: parseInt(id),
        ...updates
      }
      // Only include isPaid if status is explicitly provided
      if (updates.status !== undefined) {
        patchBody.isPaid = updates.status === 'paid'
      }
      await fetch('/api/expenses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchBody)
      })
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    } catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
      setExpenses(prev => prev.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  const totalPaid = expenses.filter(e => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
  const totalDeposits = expenses.filter(e => e.status === "scheduled").reduce((sum, e) => sum + (e.deposit || 0), 0)
  const totalSpent = totalPaid + totalDeposits
  const totalScheduled = expenses.filter(e => e.status === "scheduled").reduce((sum, e) => sum + (e.balance || e.amount), 0)
  const remaining = totalBudget - totalSpent - totalScheduled
  const spentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const scheduledPercent = totalBudget > 0 ? Math.round((totalScheduled / totalBudget) * 100) : 0

  return (
    <BudgetContext.Provider value={{
      totalBudget,
      setTotalBudget: handleSetTotalBudget,
      expenses,
      setExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      isLoading,
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
