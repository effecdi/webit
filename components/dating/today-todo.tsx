"use client";

import { useState } from "react";
import { MessageCircle, Star, Heart, Sparkles } from "lucide-react";
import { CommentModal } from "./comment-modal";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  icon: "heart" | "star" | "sparkle";
  comments: { id: string; author: string; text: string; isMe: boolean }[];
  assignee: "me" | "you" | "we";
}

const INITIAL_TODOS: TodoItem[] = [
  {
    id: "1",
    text: "저녁 메뉴 정하기",
    completed: false,
    icon: "heart",
    assignee: "we",
    comments: [
      { id: "c1", author: "준호", text: "오늘 파스타 어때?", isMe: false },
      { id: "c2", author: "민지", text: "좋아! 크림파스타 먹자", isMe: true },
    ],
  },
  {
    id: "2",
    text: "기념일 선물 고르기",
    completed: true,
    icon: "star",
    assignee: "me",
    comments: [
      { id: "c3", author: "민지", text: "힌트: 향수 아니야~", isMe: true },
    ],
  },
  {
    id: "3",
    text: "영화 예매하기",
    completed: false,
    icon: "sparkle",
    assignee: "you",
    comments: [],
  },
  {
    id: "4",
    text: "데이트 장소 검색",
    completed: false,
    icon: "heart",
    assignee: "we",
    comments: [
      { id: "c4", author: "준호", text: "성수동 카페 찾아봤어!", isMe: false },
    ],
  },
];

const ASSIGNEE_STYLES = {
  me: "bg-[#FFE4EC] text-[#FF6B9D]",
  you: "bg-[#E4F0FF] text-[#6B9DFF]",
  we: "bg-[#F0E4FF] text-[#9D6BFF]",
};

const ASSIGNEE_LABELS = {
  me: "나",
  you: "상대",
  we: "우리",
};

export function TodayTodo() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const IconComponent = ({ type, filled }: { type: TodoItem["icon"]; filled: boolean }) => {
    const className = `w-5 h-5 transition-all ${filled ? "scale-110" : ""}`;
    const fillColor = filled ? "currentColor" : "none";
    
    switch (type) {
      case "heart":
        return <Heart className={className} fill={fillColor} />;
      case "star":
        return <Star className={className} fill={fillColor} />;
      case "sparkle":
        return <Sparkles className={className} fill={fillColor} />;
    }
  };

  return (
    <>
      <div className="bg-card border-3 border-secondary p-4 shadow-brutalist">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold">Today&apos;s To-Do</h2>
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1">
            {todos.filter(t => t.completed).length}/{todos.length}
          </span>
        </div>
        
        <div className="space-y-3">
          {todos.map((todo) => (
            <div 
              key={todo.id}
              className={`flex items-center gap-3 p-3 border-2 border-secondary transition-all ${
                todo.completed ? "bg-muted opacity-60" : "bg-card hover:shadow-brutalist-sm"
              }`}
            >
              <button 
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-8 h-8 border-2 border-secondary flex items-center justify-center transition-colors ${
                  todo.completed ? "bg-primary text-secondary" : "bg-card text-primary hover:bg-primary/20"
                }`}
              >
                <IconComponent type={todo.icon} filled={todo.completed} />
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`font-sans text-sm font-medium ${todo.completed ? "line-through" : ""}`}>
                  {todo.text}
                </p>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 border border-secondary ${ASSIGNEE_STYLES[todo.assignee]}`}>
                {ASSIGNEE_LABELS[todo.assignee]}
              </span>
              
              <button 
                onClick={() => setSelectedTodo(todo)}
                className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {todo.comments.length > 0 && (
                  <span className="text-xs font-bold">{todo.comments.length}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <CommentModal 
        isOpen={!!selectedTodo}
        onClose={() => setSelectedTodo(null)}
        todo={selectedTodo}
      />
    </>
  );
}
