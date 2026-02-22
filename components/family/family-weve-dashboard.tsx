"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  Bell, 
  Heart, 
  ChevronRight, 
  Calendar,
  ImageIcon,
  Book,
  Plus,
  Home,
  Plane,
  Check,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Sparkles
} from "lucide-react"
import { TravelEntryCard } from "@/components/travel/travel-entry-card"
import { NotificationModal, type Notification } from "@/components/shared/notification-modal"
import { ModeSwitch } from "@/components/mode-switch"
import { TodoListSkeleton, EventListSkeleton, AlbumGridSkeleton } from "@/components/shared/skeleton-ui"
import { BottomSheet } from "@/components/ui/bottom-sheet"

const QUICK_ACTIONS = [
  { icon: Calendar, label: "일정 추가", color: "bg-green-50 text-green-600", href: "/family/calendar" },
  { icon: Plane, label: "여행 계획", color: "bg-purple-50 text-purple-600", href: "/travel" },
  { icon: Book, label: "추억 보기", color: "bg-amber-50 text-amber-600", href: "/family/archive" },
]

const ASSIGNEE_COLORS: Record<string, string> = {
  me: "bg-pink-100 text-pink-600",
  you: "bg-[#F3E8FF] text-[#d63bf2]",
  we: "bg-purple-100 text-purple-600",
}

const ASSIGNEE_LABELS: Record<string, string> = {
  me: "나",
  you: "상대",
  we: "우리",
}

interface TodayEvent {
  id: number
  time: string
  title: string
  category: string
}

interface Album {
  id: number
  title: string
  photoCount: number
  eventDate: string | null
}

interface Travel {
  id: number
  destination: string
  startDate: string
  endDate: string
}

interface Comment {
  id: number
  author: string
  text: string
  createdAt: string
}

interface TodoItem {
  id: number
  text: string
  completed: boolean
  assignee: "me" | "you" | "we"
  comments: Comment[]
}

export function FamilyWeveDashboard() {
  const [dDay, setDDay] = useState(0)
  const [greeting, setGreeting] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([])
  const [recentAlbums, setRecentAlbums] = useState<Album[]>([])
  const [travels, setTravels] = useState<Travel[]>([])
  const [photoCount, setPhotoCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [coupleNames, setCoupleNames] = useState({ my: "", partner: "" })
  const [daysTogether, setDaysTogether] = useState(0)

  const [todos, setTodos] = useState<TodoItem[]>([])
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [newTodoText, setNewTodoText] = useState("")
  const [newTodoAssignee, setNewTodoAssignee] = useState<"me" | "you" | "we">("we")
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null)
  const [newComment, setNewComment] = useState("")
  const isComposingRef = useRef(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [editText, setEditText] = useState("")
  const [editAssignee, setEditAssignee] = useState<"me" | "you" | "we">("we")
  const [showTodoMenu, setShowTodoMenu] = useState<number | null>(null)

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || ""
    const partnerName = localStorage.getItem("survey_partnerName") || ""
    const savedDate = localStorage.getItem("survey_firstMeetDate")
    
    setCoupleNames({ my: myName, partner: partnerName })
    
    if (savedDate) {
      const start = new Date(savedDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - start.getTime())
      setDaysTogether(Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    } else {
      const savedWeddingDate = localStorage.getItem("wedding_date")
      if (savedWeddingDate) {
        const wDate = new Date(savedWeddingDate)
        if (!isNaN(wDate.getTime())) {
          const today = new Date()
          const diffTime = today.getTime() - wDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          setDDay(diffDays > 0 ? diffDays : 0)
        }
      }
    }

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("좋은 아침이에요")
    else if (hour < 18) setGreeting("좋은 오후예요")
    else setGreeting("좋은 저녁이에요")
    
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const [notificationsRes, eventsRes, albumsRes, travelsRes, photosRes, todosRes] = await Promise.all([
        fetch('/api/notifications?mode=family'),
        fetch(`/api/events?mode=family&date=${today}`),
        fetch('/api/albums?mode=family'),
        fetch('/api/travels'),
        fetch('/api/photos?mode=family'),
        fetch('/api/todos?mode=family')
      ])
      
      const notificationsData = await notificationsRes.json()
      const eventsData = await eventsRes.json()
      const albumsData = await albumsRes.json()
      const travelsData = await travelsRes.json()
      const photosData = await photosRes.json()
      const todosData = await todosRes.json()
      
      const notifArr = Array.isArray(notificationsData) ? notificationsData : []
      const eventsArr = Array.isArray(eventsData) ? eventsData : []
      const albumsArr = Array.isArray(albumsData) ? albumsData : []
      const travelsArr = Array.isArray(travelsData) ? travelsData : []
      const photosArr = Array.isArray(photosData) ? photosData : []
      const todosArr = Array.isArray(todosData) ? todosData : []
      
      setNotifications(notifArr.map((n: { id: number; type: "schedule" | "photo" | "travel" | "todo" | "general"; title: string; message: string; createdAt: string }) => ({
        id: String(n.id),
        type: n.type,
        title: n.title,
        message: n.message,
        time: formatTimeAgo(n.createdAt)
      })))
      
      setTodayEvents(eventsArr.map((e: { id: number; time: string; title: string; category: string }) => ({
        id: e.id,
        time: e.time || "00:00",
        title: e.title,
        category: e.category || "일정"
      })))
      
      setRecentAlbums(albumsArr.slice(0, 3))
      setTravels(travelsArr)
      setPhotoCount(photosArr.length)
      setTodos(todosArr)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return "방금"
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !todo.completed }),
      })
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    } catch (error) {
      console.error("Error toggling todo:", error)
    }
  }

  const addTodo = async () => {
    if (!newTodoText.trim() || isAddingTodo) return
    setIsAddingTodo(true)
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodoText, assignee: newTodoAssignee, mode: "family" }),
      })
      const newTodo = await res.json()
      setTodos([{ ...newTodo, comments: [] }, ...todos])
      setNewTodoText("")
      setNewTodoAssignee("we")
      setShowAddTodo(false)
    } catch (error) {
      console.error("Error adding todo:", error)
    } finally {
      setIsAddingTodo(false)
    }
  }

  const openCommentModal = (todo: TodoItem) => {
    setSelectedTodo(todo)
    setShowCommentModal(true)
  }

  const addComment = () => {
    if (!newComment.trim() || !selectedTodo) return
    const comment: Comment = { id: Date.now(), author: "me", text: newComment, createdAt: new Date().toISOString() }
    setTodos(todos.map((todo) => todo.id === selectedTodo.id ? { ...todo, comments: [...todo.comments, comment] } : todo))
    setSelectedTodo({ ...selectedTodo, comments: [...selectedTodo.comments, comment] })
    setNewComment("")
  }

  const openEditModal = (todo: TodoItem) => {
    setEditingTodo(todo)
    setEditText(todo.text)
    setEditAssignee(todo.assignee)
    setShowEditModal(true)
    setShowTodoMenu(null)
  }

  const handleEditTodo = async () => {
    if (!editingTodo || !editText.trim()) return
    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingTodo.id, text: editText.trim(), assignee: editAssignee }),
      })
      setTodos(todos.map((t) => t.id === editingTodo.id ? { ...t, text: editText.trim(), assignee: editAssignee } : t))
      setShowEditModal(false)
      setEditingTodo(null)
      setEditText("")
      setEditAssignee("we")
    } catch (error) {
      console.error("Error editing todo:", error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos?id=${id}`, { method: "DELETE" })
      setTodos(todos.filter((t) => t.id !== id))
      setShowTodoMenu(null)
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const completedCount = todos.filter((t) => t.completed).length

  const upcomingTravel = travels.find(t => {
    const startDate = new Date(t.startDate)
    const today = new Date()
    return startDate >= today
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "함께": return "bg-green-100 text-green-600"
      case "데이트": return "bg-pink-100 text-pink-600"
      default: return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md fixed-header-safe">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <ModeSwitch currentMode="family" />
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-6 h-6 text-[#4E5968]" strokeWidth={1.8} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full" />
              )}
            </button>
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              mode="family"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 px-5 space-y-4 max-w-md mx-auto">
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-[13px] text-[#8B95A1] mb-1">{greeting}{coupleNames.my ? `, ${coupleNames.my}님` : ""}</p>
            <h1 className="text-[26px] leading-[1.35] font-bold text-[#191F28]">
              {daysTogether > 0 || dDay > 0 ? (
                <>
                  함께한 지
                  <br />
                  <span className="text-green-600">D+{daysTogether > 0 ? daysTogether : dDay}</span>일
                </>
              ) : (
                <>
                  우리 가족의
                  <br />
                  <span className="text-green-600">일상</span>
                </>
              )}
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Home className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center border-2">
                <Home className="w-6 h-6 text-[#d63bf2]" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[17px] font-bold text-[#191F28]">{coupleNames.my && coupleNames.partner ? `${coupleNames.my} & ${coupleNames.partner}` : "우리 가족"}</p>
              <p className="text-[13px] text-[#8B95A1]">함께하는 일상</p>
            </div>
            <Heart className="w-6 h-6 text-green-500" fill="#22c55e" />
          </div>
        </div>

        <div className="glass-menu rounded-[24px] p-4 grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="glass-menu-item rounded-[16px] p-3 flex flex-col items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[13px] font-medium text-[#333D4B] dark:text-[#ccc]">{action.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 일정</h3>
            <Link href="/family/calendar" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <EventListSkeleton />
          ) : todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-3">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F2F4F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-[13px] font-bold text-[#4E5968]">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-[#333D4B]">{event.title}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[15px] mb-3">오늘 일정이 없어요</p>
              <Link 
                href="/family/calendar"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-[14px] font-bold rounded-[12px]"
              >
                <Plus className="w-4 h-4" />
                일정 추가하기
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 할 일</h3>
              <p className="text-[13px] text-[#8B95A1]">
                {todos.length > 0 ? `${completedCount}/${todos.length} 완료` : "할 일을 추가해보세요"}
              </p>
            </div>
            <button
              onClick={() => setShowAddTodo(!showAddTodo)}
              className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center hover:bg-green-100 transition-colors"
              data-testid="button-add-todo-family"
            >
              <Plus className="w-4 h-4 text-green-600" />
            </button>
          </div>

          {showAddTodo && (
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="새 할 일 입력"
                  className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-green-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTodo()
                    }
                  }}
                  data-testid="input-new-todo-family"
                />
                <button
                  onClick={addTodo}
                  disabled={isAddingTodo || !newTodoText.trim()}
                  className={`px-4 py-2 rounded-[12px] text-[14px] font-medium transition-colors ${
                    isAddingTodo || !newTodoText.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white"
                  }`}
                  data-testid="button-submit-todo-family"
                >
                  {isAddingTodo ? "추가 중..." : "추가"}
                </button>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] text-[#8B95A1] py-1.5">담당:</span>
                {(["me", "you", "we"] as const).map((assignee) => (
                  <button
                    key={assignee}
                    onClick={() => setNewTodoAssignee(assignee)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                      newTodoAssignee === assignee ? ASSIGNEE_COLORS[assignee] : "bg-[#F2F4F6] text-[#8B95A1]"
                    }`}
                    data-testid={`button-family-assignee-${assignee}`}
                  >
                    {ASSIGNEE_LABELS[assignee]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <TodoListSkeleton />
          ) : todos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[14px]">아직 할 일이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">위의 + 버튼을 눌러 추가해보세요</p>
            </div>
          ) : (
            <div className="space-y-1">
              {todos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="w-full flex items-center gap-3 py-3 relative">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed ? "bg-green-600 border-green-600" : "border-[#D0D0D0]"
                    }`}
                    data-testid={`button-toggle-todo-family-${todo.id}`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-[15px] ${todo.completed ? "text-[#B0B8C1] line-through" : "text-[#333D4B]"}`}>
                    {todo.text}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ASSIGNEE_COLORS[todo.assignee]}`}>
                    {ASSIGNEE_LABELS[todo.assignee]}
                  </span>
                  <button
                    onClick={() => openCommentModal(todo)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                      todo.comments.length > 0 ? "bg-green-50 text-green-600" : "text-[#B0B8C1] hover:bg-[#F2F4F6]"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {todo.comments.length > 0 && <span className="text-[12px] font-medium">{todo.comments.length}</span>}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowTodoMenu(showTodoMenu === todo.id ? null : todo.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
                      data-testid={`button-todo-menu-family-${todo.id}`}
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#8B95A1]" />
                    </button>
                    {showTodoMenu === todo.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-[12px] shadow-lg border border-[#E5E8EB] overflow-hidden z-20 min-w-[120px]">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-[14px] text-[#333D4B] hover:bg-[#F2F4F6] transition-colors"
                          data-testid={`button-edit-todo-family-${todo.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-[14px] text-red-500 hover:bg-red-50 transition-colors"
                          data-testid={`button-delete-todo-family-${todo.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Family Activity - 프리미엄 기능 준비 중이므로 숨김 처리 */}
        {/*
        <Link
          href="/family/ai-recommend"
          className="block bg-gradient-to-r from-green-500 to-emerald-600 rounded-[20px] p-4 shadow-sm"
          data-testid="link-family-ai-recommend"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white">AI 가족 활동 추천</p>
              <p className="text-[12px] text-white/70 mt-0.5">맞춤형 가족 나들이와 활동을 추천받으세요</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60" />
          </div>
        </Link>
        */}

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-[19px] text-[#191F28]">추억 보관함</h3>
            </div>
            <Link href="/family/archive" className="text-[13px] font-medium text-[#8B95A1] flex items-center gap-0.5">
              더보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <AlbumGridSkeleton />
          ) : recentAlbums.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
              {recentAlbums.map((album) => (
                <Link
                  key={album.id}
                  href={`/family/archive/${album.id}`}
                  className="flex-shrink-0 w-36 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[16px] p-3 hover:scale-[1.02] transition-transform"
                >
                  <div className="w-full aspect-square bg-amber-200/50 rounded-[12px] mb-2 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="font-bold text-[14px] text-[#333D4B] truncate">{album.title}</p>
                  <p className="text-[12px] text-[#8B95A1]">{album.photoCount}장</p>
                </Link>
              ))}
              
              <Link
                href="/family/archive"
                className="flex-shrink-0 w-36 bg-[#F2F4F6] rounded-[16px] p-3 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-[#8B95A1]" />
                </div>
                <p className="text-[13px] text-[#8B95A1] text-center">더 많은 추억</p>
              </Link>
            </div>
          ) : (
            <div className="py-6 text-center">
              <ImageIcon className="w-12 h-12 text-amber-200 mx-auto mb-2" />
              <p className="text-[#8B95A1] text-[14px]">아직 추억이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">사진을 추가해서 추억을 남겨보세요</p>
            </div>
          )}
        </div>

        {upcomingTravel && (
          <TravelEntryCard 
            mode="family" 
            trip={{
              id: String(upcomingTravel.id),
              destination: upcomingTravel.destination,
              startDate: upcomingTravel.startDate,
              endDate: upcomingTravel.endDate
            }}
          />
        )}

        <div className="bg-white rounded-[24px] overflow-hidden shadow-weve">
          <div 
            className="w-full h-32 bg-cover bg-center relative"
            style={{ backgroundImage: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">우리의 추억</p>
                <p className="text-white text-lg font-bold">
                  {photoCount > 0 ? "사진을 확인해보세요" : "사진을 추가해보세요"}
                </p>
              </div>
            </div>
          </div>
          <Link href="/family/archive" className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">추억 보기</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">
                {photoCount > 0 ? `${photoCount}장의 사진` : "아직 사진이 없어요"}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </Link>
        </div>
      </main>

      <BottomSheet open={showCommentModal && !!selectedTodo} onOpenChange={(open) => { if (!open) setShowCommentModal(false) }} className="bg-white z-[100]" overlayClassName="z-[100]" showHandle={false}>
        {selectedTodo && (
          <div className="p-5 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[17px] text-[#191F28]">댓글</h3>
              <button onClick={() => setShowCommentModal(false)} className="w-8 h-8 rounded-full bg-[#F2F4F6] flex items-center justify-center" data-testid="button-close-comment-modal">
                <X className="w-4 h-4 text-[#8B95A1]" />
              </button>
            </div>
            <p className="text-[14px] text-[#4E5968] mb-4 pb-3 border-b border-[#E5E8EB]">{selectedTodo.text}</p>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {selectedTodo.comments.length === 0 ? (
                <p className="text-center text-[#8B95A1] text-[14px] py-4">아직 댓글이 없어요</p>
              ) : (
                selectedTodo.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-green-600">
                        {comment.author === "me" ? "나" : "상대"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#333D4B]">{comment.text}</p>
                      <p className="text-[11px] text-[#B0B8C1] mt-1">{formatTimeAgo(comment.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onCompositionStart={() => { isComposingRef.current = true }}
                onCompositionEnd={(e) => { isComposingRef.current = false; setNewComment((e.target as HTMLInputElement).value) }}
                placeholder="댓글 입력"
                className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-green-300"
                onKeyDown={(e) => { if (e.key === "Enter" && !isComposingRef.current && !e.nativeEvent.isComposing) { e.preventDefault(); addComment() } }}
                data-testid="input-comment-family"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className={`px-4 py-2 rounded-[12px] text-[14px] font-medium transition-colors ${
                  !newComment.trim() ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 text-white"
                }`}
                data-testid="button-submit-comment-family"
              >
                전송
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {showEditModal && editingTodo && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-5" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-[24px] w-full max-w-sm p-5 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[17px] text-[#191F28]">할 일 수정</h3>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-[#F2F4F6] flex items-center justify-center" data-testid="button-close-edit-modal">
                <X className="w-4 h-4 text-[#8B95A1]" />
              </button>
            </div>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[14px] mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
              data-testid="input-edit-todo-family"
            />
            <div className="flex gap-2 mb-4">
              <span className="text-[13px] text-[#8B95A1] py-1.5">담당:</span>
              {(["me", "you", "we"] as const).map((assignee) => (
                <button
                  key={assignee}
                  onClick={() => setEditAssignee(assignee)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                    editAssignee === assignee ? ASSIGNEE_COLORS[assignee] : "bg-[#F2F4F6] text-[#8B95A1]"
                  }`}
                  data-testid={`button-edit-assignee-family-${assignee}`}
                >
                  {ASSIGNEE_LABELS[assignee]}
                </button>
              ))}
            </div>
            <button
              onClick={handleEditTodo}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-[12px]"
              data-testid="button-save-edit-family"
            >
              수정 완료
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
