"use client";

import { useState, useEffect } from "react";
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

const ICONS: ("heart" | "star" | "sparkle")[] = ["heart", "star", "sparkle"];

export function TodayTodo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos?mode=dating');
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      const formatted = items.map((t: { id: number; text: string; completed: boolean; assignee: string }, index: number) => ({
        id: String(t.id),
        text: t.text,
        completed: t.completed,
        icon: ICONS[index % 3],
        assignee: t.assignee === "me" ? "me" : t.assignee === "you" ? "you" : "we",
        comments: [],
      }));
      setTodos(formatted);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newCompleted = !todo.completed;
    setTodos(todos.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    
    try {
      await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), completed: newCompleted }),
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !newCompleted } : t));
    }
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
          {todos.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              아직 할 일이 없어요
            </div>
          ) : null}
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
