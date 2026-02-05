"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SurveyData {
  myName: string
  myGender: "male" | "female" | ""
  partnerName: string
  partnerGender: "male" | "female" | ""
  firstMeetDate: string
  coupleIntro: string
}

interface SurveyContextType {
  data: SurveyData
  updateData: (updates: Partial<SurveyData>) => void
  getDaysTogether: () => number
}

const SurveyContext = createContext<SurveyContextType | null>(null)

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SurveyData>({
    myName: "",
    myGender: "",
    partnerName: "",
    partnerGender: "",
    firstMeetDate: "",
    coupleIntro: "",
  })

  const updateData = (updates: Partial<SurveyData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const getDaysTogether = () => {
    if (!data.firstMeetDate) return 0
    const start = new Date(data.firstMeetDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <SurveyContext.Provider value={{ data, updateData, getDaysTogether }}>
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  const context = useContext(SurveyContext)
  if (!context) {
    throw new Error("useSurvey must be used within SurveyProvider")
  }
  return context
}
