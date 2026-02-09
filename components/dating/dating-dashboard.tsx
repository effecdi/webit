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
  MoreHorizontal,
  Pencil,
  Trash2,
  Gift,
  Cake,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import moodLove from "@/attached_assets/love_1770352834619.png";
import moodHappy from "@/attached_assets/happy_1770352834618.png";
import moodNormal from "@/attached_assets/nomal_1770352834619.png";
import moodSad from "@/attached_assets/sad_1770352834620.png";
import moodAngry from "@/attached_assets/angly_1770352834617.png";

const MOOD_OPTIONS: {
  id: string;
  image: typeof moodLove;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "love",
    image: moodLove,
    label: "사랑",
    color: "text-pink-500",
    bgColor: "bg-pink-100",
  },
  {
    id: "happy",
    image: moodHappy,
    label: "행복",
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    id: "normal",
    image: moodNormal,
    label: "보통",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    id: "sad",
    image: moodSad,
    label: "슬픔",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    id: "angry",
    image: moodAngry,
    label: "화남",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
];
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
    color: "bg-[#F3E8FF] text-[#d63bf2]",
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
  you: "bg-[#F3E8FF] text-[#d63bf2]",
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
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const isComposing = useRef(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [editText, setEditText] = useState("");
  const [editAssignee, setEditAssignee] = useState<"me" | "you" | "we">("we");
  const [showTodoMenu, setShowTodoMenu] = useState<number | null>(null);
  const [newTodoAssignee, setNewTodoAssignee] = useState<"me" | "you" | "we">(
    "we",
  );

  const [myMood, setMyMood] = useState("love");
  const [partnerMood, setPartnerMood] = useState("love");
  const [coupleNames, setCoupleNames] = useState({
    my: "민지",
    partner: "준호",
  });
  const [diffDays, setDiffDays] = useState(0);
  const [birthdayPerson, setBirthdayPerson] = useState<string | null>(null);
  const [upcomingBirthday, setUpcomingBirthday] = useState<{
    person: string;
    daysLeft: number;
  } | null>(null);
  const [upcomingMilestone, setUpcomingMilestone] = useState<{
    days: number;
    daysLeft: number;
  } | null>(null);

  const MILESTONES = [
    100, 200, 300, 365, 400, 500, 600, 700, 730, 800, 900, 1000, 1095, 1100,
    1200, 1300, 1400, 1460, 1500,
  ];

  const checkBirthday = (birthdayStr: string | null): boolean => {
    if (!birthdayStr) return false;
    const today = new Date();
    const birthday = new Date(birthdayStr);
    return (
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()
    );
  };

  const getDaysUntilBirthday = (birthdayStr: string | null): number => {
    if (!birthdayStr) return -1;
    const today = new Date();
    const birthday = new Date(birthdayStr);
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
    );

    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = thisYearBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUpcomingMilestone = (
    startDateStr: string | null,
  ): { days: number; daysLeft: number } | null => {
    if (!startDateStr) return null;
    const startDate = new Date(startDateStr);
    const today = new Date();
    const currentDays = Math.ceil(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    for (const milestone of MILESTONES) {
      const daysLeft = milestone - currentDays;
      if (daysLeft > 0 && daysLeft <= 7) {
        return { days: milestone, daysLeft };
      }
    }
    return null;
  };

  const openNaverShopping = (searchTerm: string = "생일선물") => {
    const searchQuery = encodeURIComponent(searchTerm);
    const naverShoppingUrl = `https://msearch.shopping.naver.com/search/all?query=${searchQuery}`;
    window.open(naverShoppingUrl, "_blank");
  };

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "민지";
    const partnerName = localStorage.getItem("survey_partnerName") || "준호";
    const savedDate = localStorage.getItem("survey_firstMeetDate");
    const myBirthday = localStorage.getItem("survey_myBirthday");
    const partnerBirthday = localStorage.getItem("survey_partnerBirthday");

    setCoupleNames({ my: myName, partner: partnerName });

    if (checkBirthday(myBirthday)) {
      setBirthdayPerson(myName);
    } else if (checkBirthday(partnerBirthday)) {
      setBirthdayPerson(partnerName);
    }

    const myBirthdayDays = getDaysUntilBirthday(myBirthday);
    const partnerBirthdayDays = getDaysUntilBirthday(partnerBirthday);

    if (myBirthdayDays > 0 && myBirthdayDays <= 7) {
      setUpcomingBirthday({ person: myName, daysLeft: myBirthdayDays });
    } else if (partnerBirthdayDays > 0 && partnerBirthdayDays <= 7) {
      setUpcomingBirthday({
        person: partnerName,
        daysLeft: partnerBirthdayDays,
      });
    }

    const milestone = getUpcomingMilestone(savedDate);
    if (milestone) {
      setUpcomingMilestone(milestone);
    }

    if (savedDate) {
      const start = new Date(savedDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      setDiffDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
      setDiffDays(0);
    }

    fetchData();

    const handleFocus = () => {
      fetch("/api/mood")
        .then((res) => res.json())
        .then((data) => {
          if (data.myMood) setMyMood(data.myMood);
          if (data.partnerMood) setPartnerMood(data.partnerMood);
        })
        .catch(() => {});
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleMoodChange = async (role: "me" | "partner", mood: string) => {
    if (role === "me") {
      setMyMood(mood);
    } else {
      setPartnerMood(mood);
    }
    try {
      await fetch("/api/mood", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, mood }),
      });
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        todosRes,
        notificationsRes,
        travelsRes,
        photosRes,
        eventsRes,
        moodRes,
      ] = await Promise.all([
        fetch("/api/todos?mode=dating"),
        fetch("/api/notifications?mode=dating"),
        fetch("/api/travels"),
        fetch("/api/photos?mode=dating"),
        fetch("/api/events?mode=dating"),
        fetch("/api/mood"),
      ]);

      const todosData = await todosRes.json();
      const notificationsData = await notificationsRes.json();
      const travelsData = await travelsRes.json();
      const photosData = await photosRes.json();
      const eventsData = await eventsRes.json();
      const moodData = await moodRes.json();
      if (moodData.myMood) setMyMood(moodData.myMood);
      if (moodData.partnerMood) setPartnerMood(moodData.partnerMood);

      setTodos(
        todosData.map(
          (t: {
            id: number;
            text: string;
            completed: boolean;
            assignee: string;
            comments: Comment[];
          }) => ({
            ...t,
            assignee: t.assignee as "me" | "you" | "we",
            comments: t.comments || [],
          }),
        ),
      );
      setNotifications(
        notificationsData.map(
          (n: {
            id: number;
            type: string;
            title: string;
            message: string;
            createdAt: string;
          }) => ({
            id: String(n.id),
            type: n.type,
            title: n.title,
            message: n.message,
            time: formatTimeAgo(n.createdAt),
          }),
        ),
      );
      setTravels(travelsData);
      setPhotoCount(photosData.length);
      setEventCount(eventsData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !todo.completed }),
      });
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const addTodo = async () => {
    if (!newTodoText.trim() || isAddingTodo) return;

    setIsAddingTodo(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newTodoText,
          assignee: newTodoAssignee,
          mode: "dating",
        }),
      });
      const newTodo = await res.json();
      setTodos([{ ...newTodo, comments: [] }, ...todos]);
      setNewTodoText("");
      setNewTodoAssignee("we");
      setShowAddTodo(false);
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsAddingTodo(false);
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
          : todo,
      ),
    );
    setSelectedTodo({
      ...selectedTodo,
      comments: [...selectedTodo.comments, comment],
    });
    setNewComment("");
  };

  const openEditModal = (todo: TodoItem) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditAssignee(todo.assignee);
    setShowEditModal(true);
    setShowTodoMenu(null);
  };

  const handleEditTodo = async () => {
    if (!editingTodo || !editText.trim()) return;

    try {
      await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTodo.id,
          text: editText.trim(),
          assignee: editAssignee,
        }),
      });
      setTodos(
        todos.map((t) =>
          t.id === editingTodo.id
            ? { ...t, text: editText.trim(), assignee: editAssignee }
            : t,
        ),
      );
      setShowEditModal(false);
      setEditingTodo(null);
      setEditText("");
      setEditAssignee("we");
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t.id !== id));
      setShowTodoMenu(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  const upcomingTravel = travels.find((t) => {
    const startDate = new Date(t.startDate);
    const today = new Date();
    return startDate >= today;
  });

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-nav-safe">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F2F4F6]/90 backdrop-blur-md fixed-header-safe">
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
            <p className="text-[13px] text-[#8B95A1] mb-1">
              {coupleNames.my} & {coupleNames.partner}
            </p>
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
              {(() => {
                const myMoodOption =
                  MOOD_OPTIONS.find((m) => m.id === myMood) || MOOD_OPTIONS[0];
                return (
                  <div
                    className={`w-16 h-16 ${myMoodOption.bgColor} rounded-2xl flex items-center justify-center transition-all duration-300`}
                  >
                    <Image
                      src={myMoodOption.image}
                      alt={myMoodOption.label}
                      width={36}
                      height={36}
                    />
                  </div>
                );
              })()}
              {(() => {
                const partnerMoodOption =
                  MOOD_OPTIONS.find((m) => m.id === partnerMood) ||
                  MOOD_OPTIONS[0];
                return (
                  <div
                    className={`w-16 h-16 ${partnerMoodOption.bgColor} rounded-2xl flex items-center justify-center transition-all duration-300`}
                  >
                    <Image
                      src={partnerMoodOption.image}
                      alt={partnerMoodOption.label}
                      width={36}
                      height={36}
                    />
                  </div>
                );
              })()}
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

        {birthdayPerson && (
          <div
            className="bg-gradient-to-r from-pink-50 to-amber-50 rounded-[24px] p-5 shadow-weve border border-pink-100"
            data-testid="birthday-banner"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-amber-400 flex items-center justify-center flex-shrink-0">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-[#191F28] mb-1">
                  오늘은 {birthdayPerson}님의 생일이에요!
                </p>
                <p className="text-[14px] text-[#4E5968] mb-3">
                  축하해요! {birthdayPerson}님에게 줄 선물을 골라볼까요?
                </p>
                <button
                  onClick={() => openNaverShopping("생일선물")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-[12px] font-semibold text-[14px] hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm"
                  data-testid="button-gift-shopping"
                >
                  <Gift className="w-4 h-4" />
                  선물하기
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        )}

        {!birthdayPerson && upcomingBirthday && (
          <div
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[24px] p-5 shadow-weve border border-amber-100"
            data-testid="upcoming-birthday-banner"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Cake className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[16px] font-bold text-[#191F28]">
                    {upcomingBirthday.person}님의 생일이 다가와요!
                  </p>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[12px] font-bold rounded-full">
                    D-{upcomingBirthday.daysLeft}
                  </span>
                </div>
                <p className="text-[14px] text-[#4E5968] mb-3">
                  미리 선물을 준비해보세요!
                </p>
                <button
                  onClick={() => openNaverShopping("생일선물")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-[12px] font-semibold text-[14px] hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
                  data-testid="button-upcoming-birthday-gift"
                >
                  <Gift className="w-4 h-4" />
                  선물하기
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        )}

        {upcomingMilestone && (
          <div
            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-[24px] p-5 shadow-weve border border-purple-100"
            data-testid="milestone-banner"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[16px] font-bold text-[#191F28]">
                    {upcomingMilestone.days}일 기념일이 다가와요!
                  </p>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[12px] font-bold rounded-full">
                    D-{upcomingMilestone.daysLeft}
                  </span>
                </div>
                <p className="text-[14px] text-[#4E5968] mb-3">
                  특별한 날을 위한 선물을 준비해보세요!
                </p>
                <button
                  onClick={() => openNaverShopping("커플 기념일 선물")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-[12px] font-semibold text-[14px] hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm"
                  data-testid="button-milestone-gift"
                >
                  <Gift className="w-4 h-4" />
                  선물하기
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" fill="#ec4899" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#333D4B]">
                오늘의 기분
              </p>
              <p className="text-[13px] text-[#8B95A1]">
                서로의 감정을 공유해요
              </p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodChange("me", mood.id)}
                  className={`flex-1 py-2.5 rounded-[12px] transition-all flex flex-col items-center gap-1 ${
                    myMood === mood.id
                      ? `${mood.bgColor} scale-105`
                      : "bg-[#F2F4F6] hover:bg-pink-50"
                  }`}
                  data-testid={`button-my-mood-${mood.id}`}
                >
                  <Image
                    src={mood.image}
                    alt={mood.label}
                    width={28}
                    height={28}
                    className={`${myMood === mood.id ? "" : "opacity-50 grayscale"} transition-all`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-menu rounded-[24px] p-4 grid grid-cols-3 gap-3">
          {SHORTCUTS.map((shortcut) => {
            const Icon = shortcut.icon;
            let badge = "";
            if (shortcut.id === "calendar")
              badge = eventCount > 0 ? String(eventCount) : "";
            if (shortcut.id === "album")
              badge = photoCount > 0 ? String(photoCount) : "";
            if (shortcut.id === "travel")
              badge = upcomingTravel
                ? `D-${Math.ceil((new Date(upcomingTravel.startDate).getTime() - new Date().getTime()) / 86400000)}`
                : "";

            return (
              <Link
                key={shortcut.id}
                href={shortcut.href}
                className="glass-menu-item rounded-[16px] p-3 flex flex-col items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full ${shortcut.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[13px] font-medium text-[#333D4B] dark:text-[#ccc]">
                  {shortcut.label}
                </span>
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

        <div className="bg-white rounded-[24px] p-5 shadow-weve">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-[19px] text-[#191F28]">
                오늘의 할 일
              </h3>
              <p className="text-[13px] text-[#8B95A1]">
                {todos.length > 0
                  ? `${completedCount}/${todos.length} 완료`
                  : "할 일을 추가해보세요"}
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
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
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
                  disabled={isAddingTodo || !newTodoText.trim()}
                  className={`px-4 py-2 rounded-[12px] text-[14px] font-medium transition-colors ${
                    isAddingTodo || !newTodoText.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-pink-500 text-white"
                  }`}
                  data-testid="button-submit-todo"
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
                      newTodoAssignee === assignee
                        ? ASSIGNEE_COLORS[assignee]
                        : "bg-[#F2F4F6] text-[#8B95A1]"
                    }`}
                    data-testid={`button-assignee-${assignee}`}
                  >
                    {ASSIGNEE_LABELS[assignee]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-[#E5E8EB] dark:bg-[#2a2a2a] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#E5E8EB] dark:bg-[#2a2a2a] rounded-md w-3/4" />
                  </div>
                  <div className="h-5 w-8 bg-[#E5E8EB] dark:bg-[#2a2a2a] rounded-full" />
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-[#8B95A1] text-[14px]">아직 할 일이 없어요</p>
              <p className="text-[#B0B8C1] text-[12px] mt-1">
                위의 + 버튼을 눌러 추가해보세요
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {todos.slice(0, 5).map((todo) => (
                <div
                  key={todo.id}
                  className="w-full flex items-center gap-3 py-3 relative"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      todo.completed
                        ? "bg-pink-500 border-pink-500"
                        : "border-[#D0D0D0]"
                    }`}
                    data-testid={`button-toggle-todo-${todo.id}`}
                  >
                    {todo.completed && (
                      <Check
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-[15px] ${
                      todo.completed
                        ? "text-[#B0B8C1] line-through"
                        : "text-[#333D4B]"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ASSIGNEE_COLORS[todo.assignee]}`}
                  >
                    {ASSIGNEE_LABELS[todo.assignee]}
                  </span>
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
                      <span className="text-[12px] font-medium">
                        {todo.comments.length}
                      </span>
                    )}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowTodoMenu(
                          showTodoMenu === todo.id ? null : todo.id,
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
                      data-testid={`button-todo-menu-${todo.id}`}
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#8B95A1]" />
                    </button>
                    {showTodoMenu === todo.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-[12px] shadow-lg border border-[#E5E8EB] overflow-hidden z-20 min-w-[120px]">
                        <button
                          onClick={() => openEditModal(todo)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-[14px] text-[#333D4B] hover:bg-[#F2F4F6] transition-colors"
                          data-testid={`button-edit-todo-${todo.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="w-full px-4 py-3 flex items-center gap-2 text-[14px] text-red-500 hover:bg-red-50 transition-colors"
                          data-testid={`button-delete-todo-${todo.id}`}
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

        <div className="bg-white rounded-[24px] overflow-hidden shadow-weve">
          <div
            className="w-full h-32 bg-cover bg-center relative"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white/80 text-[13px] mb-1">우리의 추억</p>
                <p className="text-white text-lg font-bold">
                  사진을 추가해보세요
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/dating/gallery"
            className="p-4 flex justify-between items-center"
          >
            <div>
              <div className="text-[15px] font-bold text-[#333D4B]">
                추억 앨범
              </div>
              <div className="text-[12px] text-[#8B95A1] mt-0.5">
                {photoCount > 0
                  ? `${photoCount}장의 사진`
                  : "아직 사진이 없어요"}
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
              <h3 className="text-[22px] font-bold text-white">
                WE:BEAT Premium
              </h3>
              <p className="text-white/80 text-[14px] mt-1">
                더 특별한 우리의 이야기
              </p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">
                    무제한 사진 저장
                  </p>
                  <p className="text-[12px] text-[#8B95A1]">
                    용량 걱정 없이 추억을 저장하세요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">
                    커플 통계 리포트
                  </p>
                  <p className="text-[12px] text-[#8B95A1]">
                    우리만의 데이트 기록과 통계를 확인하세요
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-[12px]">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#191F28]">
                    고급 캘린더 기능
                  </p>
                  <p className="text-[12px] text-[#8B95A1]">
                    반복 일정, 알림 설정 등 추가 기능
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 pb-6">
              <div className="text-center mb-4">
                <span className="text-[28px] font-bold text-[#191F28]">
                  ₩4,900
                </span>
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
                <p className="text-[13px] text-[#8B95A1] mt-0.5 truncate">
                  {selectedTodo.text}
                </p>
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
                <div className="text-center py-8 text-[14px] text-[#8B95A1]">
                  아직 댓글이 없어요
                </div>
              ) : (
                selectedTodo.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex ${comment.author === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-[16px] ${
                        comment.author === "me"
                          ? "bg-pink-500 text-white rounded-br-[4px]"
                          : "bg-[#F2F4F6] text-[#191F28] rounded-bl-[4px]"
                      }`}
                    >
                      <p className="text-[14px]">{comment.text}</p>
                      <p
                        className={`text-[11px] mt-1 ${comment.author === "me" ? "text-white/70" : "text-[#8B95A1]"}`}
                      >
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
                onCompositionStart={() => {
                  isComposing.current = true;
                }}
                onCompositionEnd={() => {
                  isComposing.current = false;
                }}
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
                  newComment.trim()
                    ? "bg-pink-500 text-white"
                    : "bg-[#E5E8EB] text-[#B0B8C1]"
                }`}
                data-testid="button-send-comment"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingTodo && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-5"
          onClick={() => {
            setShowEditModal(false);
            setEditingTodo(null);
            setEditText("");
            setEditAssignee("we");
          }}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-4 border-b border-[#F2F4F6]">
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-[#191F28]">
                  할 일 수정
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTodo(null);
                    setEditText("");
                    setEditAssignee("we");
                  }}
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
                  data-testid="button-close-edit-modal"
                >
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[13px] text-[#8B95A1] mb-2 block">
                  할 일
                </label>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="할 일 입력"
                  className="w-full px-4 py-3 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-pink-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEditTodo();
                    }
                  }}
                  data-testid="input-edit-todo"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[13px] text-[#8B95A1] mb-2 block">
                  담당
                </label>
                <div className="flex gap-2">
                  {(["me", "you", "we"] as const).map((assignee) => (
                    <button
                      key={assignee}
                      onClick={() => setEditAssignee(assignee)}
                      className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all ${
                        editAssignee === assignee
                          ? ASSIGNEE_COLORS[assignee]
                          : "bg-[#F2F4F6] text-[#8B95A1]"
                      }`}
                      data-testid={`button-edit-assignee-${assignee}`}
                    >
                      {ASSIGNEE_LABELS[assignee]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTodo(null);
                  setEditText("");
                  setEditAssignee("we");
                }}
                className="flex-1 py-3 bg-[#F2F4F6] text-[#4E5968] font-medium rounded-[12px] transition-colors hover:bg-[#E5E8EB]"
                data-testid="button-cancel-edit"
              >
                취소
              </button>
              <button
                onClick={handleEditTodo}
                disabled={!editText.trim()}
                className={`flex-1 py-3 font-medium rounded-[12px] transition-colors ${
                  editText.trim()
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-[#E5E8EB] text-[#B0B8C1]"
                }`}
                data-testid="button-save-edit"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
