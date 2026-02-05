"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Send,
  Plus,
} from "lucide-react";
import { ModeSwitch } from "@/components/mode-switch";
import { TravelEntryCard } from "@/components/travel/travel-entry-card";
import {
  NotificationModal,
  type Notification,
} from "@/components/shared/notification-modal";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  assignee: "me" | "you" | "we";
  comments: Comment[];
}

interface Comment {
  id: number;
  author: "me" | "you";
  text: string;
  createdAt: string;
}

interface Travel {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
}

const SHORTCUTS = [
  {
    id: "calendar",
    label: "캘린더",
    icon: Calendar,
    href: "/dating/calendar",
    color: "bg-pink-50 text-pink-500",
  },
  {
    id: "album",
    label: "앨범",
    icon: ImageIcon,
    href: "/dating/gallery",
    color: "bg-blue-50 text-[#3182F6]",
  },
  {
    id: "travel",
    label: "여행 계획",
    icon: Plane,
    href: "/travel",
    color: "bg-purple-50 text-purple-500",
  },
];

const ASSIGNEE_COLORS = {
  me: "bg-pink-100 text-pink-600",
  you: "bg-blue-100 text-blue-600",
  we: "bg-purple-100 text-purple-600",
};

const ASSIGNEE_LABELS = {
  me: "나",
  you: "상대",
  we: "우리",
};

export function DatingDashboard() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newTodoText, setNewTodoText] = useState("");
  const [showAddTodo, setShowAddTodo] = useState(false);
  const isComposing = useRef(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [myMood, setMyMood] = useState("👩");
  const [coupleNames, setCoupleNames] = useState({ my: "민지", partner: "준호" });
  const [diffDays, setDiffDays] = useState(0);

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "민지";
    const partnerName = localStorage.getItem("survey_partnerName") || "준호";
    const savedDate = localStorage.getItem("survey_firstMeetDate");
    
    setCoupleNames({ my: myName, partner: partnerName });
    
    if (savedDate) {
      const start = new Date(savedDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      setDiffDays(0);
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [todosRes, notificationsRes, travelsRes, photosRes, eventsRes] = await Promise.all([
        fetch('/api/todos?userId=default&mode=dating'),
        fetch('/api/notifications?userId=default&mode=dating'),
        fetch('/api/travels?userId=default'),
        fetch('/api/photos?userId=default&mode=dating'),
        fetch('/api/events?userId=default&mode=dating'),
      ]);
      
      const todosData = await todosRes.json();
      const notificationsData = await notificationsRes.json();
      const travelsData = await travelsRes.json();
      const photosData = await photosRes.json();
      const eventsData = await eventsRes.json();
      
      setTodos(todosData.map((t: { id: number; text: string; completed: boolean; assignee: string; comments: Comment[] }) => ({
        ...t,
        assignee: t.assignee as "me" | "you" | "we",
        comments: t.comments || []
      })));
      setNotifications(notificationsData.map((n: { id: number; type: string; title: string; message: string; createdAt: string }) => ({
        id: String(n.id),
        type: n.type,
        title: n.title,
        message: n.message,
        time: formatTimeAgo(n.createdAt)
      })));
      setTravels(travelsData);
      setPhotoCount(photosData.length);
      setEventCount(eventsData.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "방금";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    try {
      await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !todo.completed })
      });
      setTodos(todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: 'default', 
          text: newTodoText, 
          assignee: 'we', 
          mode: 'dating' 
        })
      });
      const newTodo = await res.json();
      setTodos([{ ...newTodo, comments: [] }, ...todos]);
      setNewTodoText("");
      setShowAddTodo(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const openCommentModal = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setShowCommentModal(true);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTodo) return;
    const comment: Comment = {
      id: Date.now(),
      author: "me",
      text: newComment,
      createdAt: new Date().toISOString(),
    };
    setTodos(
      todos.map((todo) =>
        todo.id === selectedTodo.id
          ? { ...todo, comments: [...todo.comments, comment] }
          : todo
      )
    );
    setSelectedTodo({
      ...selectedTodo,
      comments: [...selectedTodo.comments, comment],
    });
    setNewComment("");
  };

  const completedCount = todos.filter((t) => t.completed).length;

  const upcomingTravel = travels.find(t => {
    const startDate = new Date(t.startDate);
    const today = new Date();
    return startDate >= today;
  });

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-24">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 py-3 max-w-md mx-auto">
          <ModeSwitch currentMode="dating" />
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-6 h-6 text-[#4E5968]" strokeWidth={1.8} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-pink-500 rounded-full" />
              )}
            </button>
            <NotificationModal
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={() => setNotifications([])}
              mode="dating"
            />
          </div>
        </div>
      </header>

      <main className="pt-16 px-5 space-y-4 max-w-md mx-auto">
        <div className="mt-2 flex justify-between items-start">
          <div>
            <p className="text-[13px] text-[#8B95A1] mb-1">{coupleNames.my} & {coupleNames.partner}</p>
            <h1 className="text-[26px] leading-[1.35] font-bold text-[#191F28]">
              {diffDays > 0 ? (
                <>
                  우리 사랑한 지
                  <br />
                  <span className="text-pink-500">D+{diffDays}</span>일
                </>
              ) : (
                <>
                  우리의 이야기
                  <br />
                  <span className="text-pink-500">시작해요</span>
                </>
              )}
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex -space-x-2">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center border-2 border-white transition-all duration-300">
                <span className="text-xl">{myMood}</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white">
                <span className="text-xl">👨</span>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] font-bold text-white">Premium</span>
            </button>
          </div>
        </div>

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
                onClick={() => setMyMood(emoji)}
                className={`flex-1 py-3 rounded-[12px] text-xl transition-all ${
                  myMood === emoji
                    ? "bg-pink-100 scale-110"
                    : "bg-[#F2F4F6] hover:bg-pink-50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon;
            let badge = "";
            if (shortcut.id === "calendar") badge = eventCount > 0 ? String(eventCount) : "";
            if (shortcut.id === "album") badge = photoCount > 0 ? String(photoCount) : "";
            if (shortcut.id === "travel") badge = upcomingTravel ? `D-${Math.ceil((new Date(upcomingTravel.startDate).getTime() - new Date().getTime()) / 86400000)}` : "";
            
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
                {badge && (
                  <span className="text-[11px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {upcomingTravel && (
          <TravelEntryCard
            mode="dating"
            trip={{
              id: String(upcomingTravel.id),
              destination: upcomingTravel.destination,
              startDate: upcomingTravel.startDate,
              endDate: upcomingTravel.endDate,
            }}
          />
        )}

        <div className="bg-white rounded-[24px] p-5 shadow-toss">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28]">오늘의 할 일</h3>
              <p className="text-[13px] text-[#8B95A1]">
                {todos.length > 0 ? `${completedCount}/${todos.length} 완료` : "할 일을 추가해보세요"}
              </p>
            </div>
            <button
              onClick={() => setShowAddTodo(!showAddTodo)}
              className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors"
              data-testid="button-add-todo"
            >
              <Plus className="w-4 h-4 text-pink-500" />
            </button>
          </div>

          {showAddTodo && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="새 할 일 입력"
                className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[14px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTodo();
                  }
                }}
                data-testid="input-new-todo"
              />
              <button
                onClick={addTodo}
                className="px-4 py-2 bg-pink-500 text-white rounded-[12px] text-[14px] font-medium"
                data-testid="button-submit-todo"
              >
                추가
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-[#8B95A1]">로딩 중...</div>
          ) : todos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[14px]">아직 할 일이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">위의 + 버튼을 눌러 추가해보세요</p>
            </div>
          ) : (
            <div className="space-y-1">
              {todos.slice(0, 5).map((todo) => (
                <div key={todo.id} className="w-full flex items-center gap-3 py-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed ? "bg-pink-500 border-pink-500" : "border-[#D0D0D0]"
                    }`}
                    data-testid={`button-toggle-todo-${todo.id}`}
                  >
                    {todo.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </button>
                  <span
                    className={`flex-1 text-[15px] ${
                      todo.completed ? "text-[#B0B8C1] line-through" : "text-[#333D4B]"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ASSIGNEE_COLORS[todo.assignee]}`}>
                    {ASSIGNEE_LABELS[todo.assignee]}
                  </span>
                  <button
                    onClick={() => openCommentModal(todo)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                      todo.comments.length > 0 ? "bg-pink-50 text-pink-500" : "text-[#B0B8C1] hover:bg-[#F2F4F6]"
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
          )}
        </div>

        <div className="bg-white rounded-[24px] overflow-hidden shadow-toss">
          <div
            className="w-full h-32 bg-cover bg-center relative"
            style={{ backgroundImage: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">우리의 추억</p>
                <p className="text-white text-lg font-bold">사진을 추가해보세요</p>
              </div>
            </div>
          </div>
          <Link href="/dating/gallery" className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">추억 앨범</div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">
                {photoCount > 0 ? `${photoCount}장의 사진` : "아직 사진이 없어요"}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </Link>
        </div>
      </main>

      {showPremiumModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[22px] font-bold text-white">WE:VE Premium</h3>
              <p className="text-white/80 text-[14px] mt-1">더 특별한 우리의 이야기</p>
            </div>
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
            <div className="px-5 pb-6">
              <div className="text-center mb-4">
                <span className="text-[28px] font-bold text-[#191F28]">₩4,900</span>
                <span className="text-[14px] text-[#8B95A1]"> / 월</span>
              </div>
              <button
                onClick={() => {
                  alert("결제 페이지로 이동합니다");
                  setShowPremiumModal(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-[14px] transition-all"
              >
                프리미엄 구독하기
              </button>
              <button onClick={() => setShowPremiumModal(false)} className="w-full py-3 text-[#8B95A1] text-[14px] mt-2">
                나중에 할게요
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentModal && selectedTodo && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => {
            setShowCommentModal(false);
            setSelectedTodo(null);
            setNewComment("");
          }}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-[24px] animate-in zoom-in-95 duration-200 max-h-[70vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F2F4F6]">
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="text-[17px] font-bold text-[#191F28]">댓글</h3>
                <p className="text-[13px] text-[#8B95A1] mt-0.5 truncate">{selectedTodo.text}</p>
              </div>
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedTodo(null);
                  setNewComment("");
                }}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
                data-testid="button-close-comment"
              >
                <X className="w-5 h-5 text-[#8B95A1]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {selectedTodo.comments.length === 0 ? (
                <div className="text-center py-8 text-[14px] text-[#8B95A1]">아직 댓글이 없어요</div>
              ) : (
                selectedTodo.comments.map((comment) => (
                  <div key={comment.id} className={`flex ${comment.author === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-[16px] ${
                        comment.author === "me"
                          ? "bg-pink-500 text-white rounded-br-[4px]"
                          : "bg-[#F2F4F6] text-[#191F28] rounded-bl-[4px]"
                      }`}
                    >
                      <p className="text-[14px]">{comment.text}</p>
                      <p className={`text-[11px] mt-1 ${comment.author === "me" ? "text-white/70" : "text-[#8B95A1]"}`}>
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-4 border-t border-[#F2F4F6] flex gap-3 rounded-b-[24px]">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onCompositionStart={() => { isComposing.current = true; }}
                onCompositionEnd={() => { isComposing.current = false; }}
                placeholder="댓글을 입력하세요"
                className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-full text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-300"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isComposing.current) {
                    e.preventDefault();
                    addComment();
                  }
                }}
                data-testid="input-comment"
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  newComment.trim() ? "bg-pink-500 text-white" : "bg-[#E5E8EB] text-[#B0B8C1]"
                }`}
                data-testid="button-send-comment"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
