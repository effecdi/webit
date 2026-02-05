"use client";

import { useState, useRef } from "react";
import { X, Send } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  text: string;
  isMe: boolean;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  comments: Comment[];
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: TodoItem | null;
}

export function CommentModal({ isOpen, onClose, todo }: CommentModalProps) {
  const [newComment, setNewComment] = useState("");
  const isComposing = useRef(false);

  if (!isOpen || !todo) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = () => {
    isComposing.current = false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-card border-3 border-secondary rounded-lg shadow-brutalist animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-secondary">
          <h3 className="font-serif text-lg font-bold truncate pr-2">{todo.text}</h3>
          <button 
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 border-2 border-secondary flex items-center justify-center hover:bg-muted transition-colors"
            data-testid="button-close-comment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments - Post-it Style */}
        <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
          {todo.comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">아직 댓글이 없어요</p>
              <p className="text-muted-foreground text-xs mt-1">첫 번째 댓글을 남겨보세요!</p>
            </div>
          ) : (
            todo.comments.map((comment, index) => (
              <div 
                key={comment.id}
                className={`p-3 border-2 border-secondary shadow-brutalist-sm ${
                  comment.isMe 
                    ? "bg-[#FFE4EC] ml-8 -rotate-1" 
                    : "bg-[#E4F0FF] mr-8 rotate-1"
                }`}
                style={{ 
                  transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` 
                }}
              >
                <p className="text-xs font-bold text-muted-foreground mb-1">{comment.author}</p>
                <p className="text-sm">{comment.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t-2 border-secondary bg-muted rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder="댓글을 입력하세요..."
              className="flex-1 px-4 py-3 border-2 border-secondary bg-card font-sans text-sm focus:outline-none focus:shadow-brutalist-sm transition-shadow rounded"
              data-testid="input-comment"
            />
            <button 
              className="px-4 py-3 bg-primary border-2 border-secondary shadow-brutalist-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded"
              data-testid="button-send-comment"
            >
              <Send className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
