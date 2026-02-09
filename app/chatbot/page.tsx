"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! WE:BEAT 고객센터입니다.\n궁금하신 점이나 도움이 필요하신 부분을 편하게 말씀해주세요."
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = { role: "user", content: trimmed }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const allMessages = [...messages, userMessage]
      const chatHistory = allMessages.slice(1)

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      })

      if (!res.ok) throw new Error("Failed to get response")

      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col" data-testid="page-chatbot">
      <header className="sticky top-0 z-50 bg-white border-b border-[#F2F4F6] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-colors"
          data-testid="button-chatbot-back"
        >
          <ChevronLeft className="w-6 h-6 text-[#191F28]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#191F28]">1:1 문의하기</h1>
          <p className="text-[12px] text-[#8B95A1]">AI 상담사가 도와드립니다</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            data-testid={`message-${msg.role}-${i}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[#b455e0] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <span className="text-white text-[11px] font-bold">AI</span>
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-[16px] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#b455e0] text-white rounded-br-[4px]"
                  : "bg-[#F2F4F6] text-[#191F28] rounded-bl-[4px]"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start" data-testid="message-loading">
            <div className="w-8 h-8 rounded-full bg-[#b455e0] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
              <span className="text-white text-[11px] font-bold">AI</span>
            </div>
            <div className="bg-[#F2F4F6] rounded-[16px] rounded-bl-[4px] px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#B0B8C1] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#B0B8C1] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#B0B8C1] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#F2F4F6] px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 h-11 px-4 bg-[#F8F9FA] rounded-full text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] outline-none focus:ring-2 focus:ring-[#b455e0]/20"
            disabled={isLoading}
            data-testid="input-chatbot-message"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#b455e0] text-white disabled:opacity-40 transition-all active:scale-95"
            data-testid="button-chatbot-send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
