"use client"

import { useState } from "react"
import { Check, ChevronRight } from "lucide-react"
import Link from "next/link"

interface TodoItem {
  id: string
  title: string
  description: string
  completed: boolean
  tag?: string
}

const initialTodos: TodoItem[] = [
  {
    id: "1",
    title: "드레스 투어 예약하기",
    description: "강남/청담 지역 3곳",
    completed: false,
    tag: "D-120",
  },
  {
    id: "2",
    title: "스냅 촬영 업체 미팅",
    description: "오후 3시 더스튜디오",
    completed: false,
  },
  {
    id: "3",
    title: "식사 메뉴 논의하기",
    description: "민준님과 함께",
    completed: true,
  },
]

export function WeveTodayTodo() {
  const [todos, setTodos] = useState(initialTodos)
  const [completedAnimation, setCompletedAnimation] = useState<string | null>(null)

  const toggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (todo && !todo.completed) {
      setCompletedAnimation(id)
      setTimeout(() => {
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, completed: true } : t
          )
        )
        setCompletedAnimation(null)
      }, 400)
    } else {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      )
    }
  }

  const completedCount = todos.filter((t) => t.completed).length
  const totalCount = todos.length

  return (
    <section className="bg-white mt-2">
      {/* Section Header - WE:VE tab style */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-4">
          <button className="text-[17px] font-bold text-[#202020] pb-2 border-b-2 border-[#202020]">
            할 일
          </button>
          <Link href="/wedding/calendar" className="text-[17px] font-bold text-[#B0B0B0] pb-2">
            일정
          </Link>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-[#8B8B8B]">오늘의 진행률</span>
          <span className="text-[13px] font-medium text-[#D4836B]">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#D4836B] rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Todo Items - WE:VE list style */}
      <div className="px-5 pb-2">
        {todos.map((todo) => (
          <button
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`w-full flex items-center gap-4 py-4 text-left transition-all duration-300 border-b border-[#F5F5F5] last:border-0 ${
              completedAnimation === todo.id ? "scale-[0.99] opacity-70" : ""
            }`}
          >
            {/* Checkbox - WE:VE style */}
            <div
              className={`relative w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                todo.completed
                  ? "bg-[#D4836B] border-[#D4836B]"
                  : "border-[#D0D0D0]"
              }`}
            >
              {todo.completed && (
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              )}
              {completedAnimation === todo.id && (
                <div className="absolute inset-0 rounded-full bg-[#D4836B]/30 animate-ping" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[15px] transition-all duration-300 ${
                    todo.completed
                      ? "text-[#B0B0B0] line-through"
                      : "text-[#202020]"
                  }`}
                >
                  {todo.title}
                </span>
                {todo.tag && !todo.completed && (
                  <span className="px-1.5 py-0.5 bg-[#FFF0ED] rounded text-[11px] font-medium text-[#D4836B]">
                    {todo.tag}
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] mt-0.5 block transition-colors duration-300 ${
                  todo.completed ? "text-[#C8C8C8]" : "text-[#8B8B8B]"
                }`}
              >
                {todo.description}
              </span>
            </div>

            <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-colors ${
              todo.completed ? "text-[#D8D8D8]" : "text-[#C8C8C8]"
            }`} />
          </button>
        ))}
      </div>

      {/* View all link */}
      <Link 
        href="/wedding/checklist" 
        className="flex items-center justify-center gap-1 py-4 text-[14px] text-[#8B8B8B] hover:text-[#505050] transition-colors border-t border-[#F5F5F5]"
      >
        전체 할 일 보기
        <ChevronRight className="w-4 h-4" />
      </Link>
    </section>
  )
}
