import React from "react"
import { BudgetProvider } from "@/contexts/budget-context"
import { ChecklistProvider } from "@/contexts/checklist-context"

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BudgetProvider>
      <ChecklistProvider>
        {children}
      </ChecklistProvider>
    </BudgetProvider>
  )
}
