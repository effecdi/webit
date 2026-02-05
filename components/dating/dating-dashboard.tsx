"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Bell, 
  Heart, 
  ChevronRight, 
  Calendar,
  ImageIcon,
  Plane,
  MessageCircle,
  Check,
  Crown,
  X,
  Send
} from "lucide-react"
import { ModeSwitch } from "@/components/mode-switch"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  assignee: "me" | "you" | "we"
  comments: Comment[]
}

interface Comment {
  id: string
  author: "me" | "you"
  text: string
  time: string
}

const INITIAL_TODOS: TodoItem[] = [
  { id: "1", text: "저녁 메뉴 정하기", completed: false, assignee: "we", comments: [
    { id: "c1", author: "me", text: "이탈리안 어때?", time: "10:30" },
    { id: "c2", author: "you", text: "좋아! 파스타 먹자", time: "10:45" },
  ]},
  { id: "2", text: "기념일 선물 고르기", completed: true, assignee: "me", comments: [
    { id: "c3", author: "you", text: "뭐 사줄거야?", time: "어제" },
  ]},
  { id: "3", text: "영화 예매하기", completed: false, assignee: "you", comments: [] },
  { id: "4", text: "데이트 장소 검색", completed: false, assignee: "we", comments: [
    { id: "c4", author: "me", text: "성수동 카페 어때?", time: "오전" },
  ]},
]

const SHORTCUTS = [
  { id: "calendar", label: "캘린더", icon: Calendar, href: "/dating/calendar", badge: "3", color: "bg-pink-50 text-pink-500" },
  { id: "album", label: "앨범", icon: ImageIcon, href: "/dating/gallery", badge: "128", color: "bg-blue-50 text-[#3182F6]" },
  { id: "travel", label: "여행 계획", icon: Plane, href: "/dating/travel", badge: "D-12", color: "bg-purple-50 text-purple-500" },
]

const ASSIGNEE_COLORS = {
  me: "bg-pink-100 text-pink-600",
  you: "bg-blue-100 text-blue-600",
  we: "bg-purple-100 text-purple-600",
}

const ASSIGNEE_LABELS = {
  me: "나",
  you: "상대",
  we: "우리",
}

export function DatingDashboard() {
  const [todos, setTodos] = useState(INITIAL_TODOS)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null)
  const [newComment, setNewComment] = useState("")
  
  // Calculate D-day
  const startDate = new Date("2023-03-15")
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const openCommentModal = (todo: TodoItem) => {
    setSelectedTodo(todo)
    setShowCommentModal(true)
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedTodo) return
    const comment: Comment = {
      id: Date.now().toString(),
      author: "me",
      text: newComment,
      time: "방금"
    }
    setTodos(todos.map(todo => 
      todo.id === selectedTodo.id 
        ? { ...todo, comments: [...todo.comments, comment] }
        : todo
    ))
    setSelectedTodo({ ...selectedTodo, comments: [...selectedTodo.comments, comment] })
    setNewComment("")
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-24">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <ModeSwitch currentMode="dating" />
          <button className="relative">
            <Bell className="w-6 h-6 text-[#4E5968]" strokeWidth={1.8} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-pink-500 rounded-full" />
          </button>
        </div>
      </header>

      <main className="pt-16 px-5 space-y-4 max-w-md mx-auto">
        {/* Hero Section */}
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-[13px] text-[#8B95A1] mb-1">민지 & 준호</p>
            <h1 className="text-[26px] leading-[1.35] font-bold text-[#191F28]">
              우리 사랑한 지
              <br />
              <span className="text-pink-500">D+{diffDays}</span>일
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex -space-x-2">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white">
                <span className="text-xl">👩</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white">
                <span className="text-xl">👨</span>
              </div>
            </div>
            {/* Premium Button */}
            <button 
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] font-bold text-white">Premium</span>
            </button>
          </div>
        </div>

        {/* Couple Stats Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" fill="#ec4899" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#333D4B]">오늘의 기분</p>
              <p className="text-[13px] text-[#8B95A1]">서로의 감정을 공유해요</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["💕", "🥰", "😊", "🤗", "✨"].map((emoji, idx) => (
              <button 
                key={idx}
                className="flex-1 py-3 bg-[#F2F4F6] hover:bg-pink-50 rounded-[12px] text-xl transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-3 gap-3">
          {SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                className="bg-white rounded-[20px] p-4 shadow-toss flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div className={`w-12 h-12 rounded-full ${shortcut.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[13px] font-medium text-[#333D4B]">{shortcut.label}</span>
                <span className="text-[11px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                  {shortcut.badge}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Today's Todo Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 할 일</h3>
              <p className="text-[13px] text-[#8B95A1]">{completedCount}/{todos.length} 완료</p>
            </div>
            <Link href="/dating/todos" className="text-[13px] font-medium text-[#8B95A1]">
              더보기
            </Link>
          </div>

          <div className="space-y-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="w-full flex items-center gap-3 py-3"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    todo.completed 
                      ? "bg-pink-500 border-pink-500" 
                      : "border-[#D0D0D0]"
                  }`}
                >
                  {todo.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </button>
                <span className={`flex-1 text-[15px] ${
                  todo.completed ? "text-[#B0B8C1] line-through" : "text-[#333D4B]"
                }`}>
                  {todo.text}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ASSIGNEE_COLORS[todo.assignee]}`}>
                  {ASSIGNEE_LABELS[todo.assignee]}
                </span>
                {/* Comment Button */}
                <button
                  onClick={() => openCommentModal(todo)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                    todo.comments.length > 0 
                      ? "bg-pink-50 text-pink-500" 
                      : "text-[#B0B8C1] hover:bg-[#F2F4F6]"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {todo.comments.length > 0 && (
                    <span className="text-[12px] font-medium">{todo.comments.length}</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Anniversary */}
        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28] mb-1">다가오는 기념일</h3>
              <p className="text-[13px] text-[#8B95A1]">700일 기념일</p>
            </div>
            <div className="bg-pink-50 text-pink-500 px-3 py-1.5 rounded-[10px] text-[13px] font-bold">
              D-15
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-[#F2F4F6] hover:bg-gray-200 text-[#4E5968] font-semibold py-3 rounded-[12px] text-[15px] transition-colors">
              선물 찾기
            </button>
            <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-[12px] text-[15px] transition-colors">
              계획 세우기
            </button>
          </div>
        </div>

        {/* Memory Banner */}
        <div className="bg-white rounded-[24px] overflow-hidden shadow-toss">
          <div 
            className="w-full h-32 bg-cover bg-center relative"
            style={{ 
              backgroundImage: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">1년 전 오늘</p>
                <p className="text-white text-lg font-bold">첫 여행을 떠났어요</p>
              </div>
            </div>
          </div>
          <Link href="/dating/gallery" className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">추억 앨범</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">128장의 사진</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </Link>
        </div>
      </main>

      {/* Premium Subscription Modal */}
      {showPremiumModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowPremiumModal(false)}
        >
          <div 
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-white">WE:VE Premium</h3>
              <p className="text-white/80 text-[14px] mt-1">더 특별한 우리의 이야기</p>
            </div>
            
            {/* Benefits */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">무제한 사진 저장</p>
                  <p className="text-[12px] text-[#8B95A1]">용량 걱정 없이 추억을 저장하세요</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">광고 없는 환경</p>
                  <p className="text-[12px] text-[#8B95A1]">방해 없이 둘만의 공간을 즐기세요</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">고급 캘린더 기능</p>
                  <p className="text-[12px] text-[#8B95A1]">반복 일정, 알림 설정 등 추가 기능</p>
                </div>
              </div>
            </div>
            
            {/* Price & CTA */}
            <div className="px-5 pb-6">
              <div className="text-center mb-4">
                <span className="text-[28px] font-bold text-[#191F28]">₩4,900</span>
                <span className="text-[14px] text-[#8B95A1]"> / 월</span>
              </div>
              <button 
                onClick={() => {
                  alert("결제 페이지로 이동합니다")
                  setShowPremiumModal(false)
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-[14px] transition-all"
              >
                프리미엄 구독하기
              </button>
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="w-full py-3 text-[#8B95A1] text-[14px] mt-2"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && selectedTodo && (
        <div 
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => {
            setShowCommentModal(false)
            setSelectedTodo(null)
            setNewComment("")
          }}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
              <div>
                <h3 className="text-[17px] font-bold text-[#191F28]">댓글</h3>
                <p className="text-[13px] text-[#8B95A1] mt-0.5">{selectedTodo.text}</p>
              </div>
              <button 
                onClick={() => {
                  setShowCommentModal(false)
                  setSelectedTodo(null)
                  setNewComment("")
                }}
                className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {selectedTodo.comments.length === 0 ? (
                <div className="text-center py-8 text-[14px] text-[#8B95A1]">
                  아직 댓글이 없어요
                </div>
              ) : (
                selectedTodo.comments.map((comment) => (
                  <div 
                    key={comment.id}
                    className={`flex ${comment.author === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2.5 rounded-[16px] ${
                      comment.author === "me" 
                        ? "bg-pink-500 text-white rounded-br-[4px]" 
                        : "bg-[#F2F4F6] text-[#191F28] rounded-bl-[4px]"
                    }`}>
                      <p className="text-[14px]">{comment.text}</p>
                      <p className={`text-[11px] mt-1 ${
                        comment.author === "me" ? "text-white/70" : "text-[#8B95A1]"
                      }`}>{comment.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Input */}
            <div className="px-5 py-4 border-t border-[#F2F4F6] flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-full text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-300"
                onKeyDown={(e) => e.key === "Enter" && addComment()}
              />
              <button 
                onClick={addComment}
                disabled={!newComment.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  newComment.trim() 
                    ? "bg-pink-500 text-white" 
                    : "bg-[#E5E8EB] text-[#B0B8C1]"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-6" />
          </div>
        </div>
      )}
    </div>
  )
}
