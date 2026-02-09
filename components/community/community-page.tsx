"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Plus,
  X,
  User,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react"

interface CommunityPost {
  id: number
  userId: string
  mode: string
  category: string
  title: string
  content: string
  authorName: string | null
  likeCount: number | null
  commentCount: number | null
  isLiked: boolean
  createdAt: string
}

interface ModeConfig {
  mode: string
  backHref: string
  title: string
  accentColor: string
  accentBg: string
  accentLight: string
  gradient: string
  gradientColors: string[]
  categories: string[]
  bottomNav: React.ReactNode
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "방금 전"
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 30) return `${diffDay}일 전`
  return `${Math.floor(diffDay / 30)}개월 전`
}

export function CommunityPage({ config }: { config: ModeConfig }) {
  const router = useRouter()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [activeCategory, setActiveCategory] = useState("전체")
  const [loading, setLoading] = useState(true)
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: config.categories[0] })
  const [submitting, setSubmitting] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      const cat = activeCategory !== "전체" ? `&category=${encodeURIComponent(activeCategory)}` : ""
      const res = await fetch(`/api/community/posts?mode=${config.mode}${cat}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }, [config.mode, activeCategory])

  useEffect(() => {
    setLoading(true)
    fetchPosts()
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: config.mode,
          category: newPost.category,
          title: newPost.title,
          content: newPost.content,
        }),
      })
      if (res.ok) {
        setShowWriteModal(false)
        setNewPost({ title: "", content: "", category: config.categories[0] })
        fetchPosts()
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePostClick = (postId: number) => {
    const basePath = `/${config.mode}/community/${postId}`
    router.push(basePath)
  }

  const bannerBg = `linear-gradient(135deg, ${config.gradientColors[0]}, ${config.gradientColors[1]})`

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-36">
      <header className="bg-white px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link href={config.backHref} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors" data-testid="link-back">
              <ArrowLeft className="w-5 h-5 text-[#191F28]" />
            </Link>
            <h1 className="text-[20px] font-bold text-[#191F28]" data-testid="text-community-title">{config.title}</h1>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-4">
        <div
          className="rounded-[20px] p-5 text-white relative overflow-hidden"
          style={{ background: bannerBg }}
          data-testid="community-gradient-banner"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <p className="text-[22px] font-bold mb-1 leading-tight">함께 나누는 이야기</p>
            <p className="text-[13px] text-white/80 mb-4">고민 상담, 정보 교환, 경험을 공유해 보세요</p>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/15 backdrop-blur-sm rounded-[14px] py-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-[11px] text-white/90 font-medium">트렌드</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/15 backdrop-blur-sm rounded-[14px] py-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-[11px] text-white/90 font-medium">소통</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1 bg-white/15 backdrop-blur-sm rounded-[14px] py-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-[11px] text-white/90 font-medium">정보</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("전체")}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === "전체"
                ? "bg-[#191F28] text-white shadow-sm"
                : "bg-white text-[#4E5968] hover:bg-[#E5E8EB]"
            }`}
            data-testid="filter-category-all"
          >
            전체
          </button>
          {config.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-[#191F28] text-white shadow-sm"
                  : "bg-white text-[#4E5968] hover:bg-[#E5E8EB]"
              }`}
              data-testid={`filter-category-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[16px] p-5 animate-pulse">
                <div className="h-4 bg-[#F2F4F6] rounded w-1/4 mb-3" />
                <div className="h-5 bg-[#F2F4F6] rounded w-3/4 mb-3" />
                <div className="h-3 bg-[#F2F4F6] rounded w-full mb-2" />
                <div className="h-3 bg-[#F2F4F6] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="w-full text-left bg-white rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
                data-testid={`post-card-${post.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${config.accentLight} ${config.accentColor}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#B0B8C1]">
                    <Clock className="w-3 h-3" />
                    {timeAgo(post.createdAt)}
                  </div>
                </div>

                <h3 className="text-[15px] font-bold text-[#191F28] mb-1.5 line-clamp-1">{post.title}</h3>
                <p className="text-[13px] text-[#8B95A1] line-clamp-2 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F2F4F6]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#E5E8EB] flex items-center justify-center">
                      <User className="w-3 h-3 text-[#8B95A1]" />
                    </div>
                    <span className="text-[12px] text-[#8B95A1]">{post.authorName || "익명"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[12px] text-[#8B95A1]">
                      <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-red-400 text-red-400" : ""}`} />
                      {post.likeCount || 0}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-[#8B95A1]">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.commentCount || 0}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[16px] p-8 text-center" data-testid="empty-posts">
            <MessageCircle className="w-12 h-12 text-[#E5E8EB] mx-auto mb-3" />
            <p className="text-[14px] text-[#8B95A1] mb-1">아직 게시글이 없어요</p>
            <p className="text-[12px] text-[#B0B8C1]">첫 번째 글을 작성해 보세요!</p>
          </div>
        )}
      </main>

      <button
        onClick={() => setShowWriteModal(true)}
        className={`fixed bottom-24 right-5 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-30`}
        style={{
          background: bannerBg,
          right: "max(1.25rem, calc((100vw - 28rem) / 2 + 1.25rem))",
        }}
        data-testid="button-write-post"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showWriteModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 pb-4 border-b border-[#F2F4F6]">
              <button onClick={() => setShowWriteModal(false)} data-testid="button-close-write">
                <X className="w-6 h-6 text-[#8B95A1]" />
              </button>
              <h3 className="text-[17px] font-bold text-[#191F28]">글 작성</h3>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.title.trim() || !newPost.content.trim() || submitting}
                className={`text-[15px] font-semibold ${
                  newPost.title.trim() && newPost.content.trim() ? config.accentColor : "text-[#B0B8C1]"
                }`}
                data-testid="button-submit-post"
              >
                {submitting ? "저장중..." : "완료"}
              </button>
            </div>

            <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">카테고리</label>
                <div className="flex gap-2 flex-wrap">
                  {config.categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewPost({ ...newPost, category: cat })}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                        newPost.category === cat
                          ? "bg-[#191F28] text-white"
                          : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}
                      data-testid={`select-category-${cat}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">제목</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#E5E8EB]"
                  data-testid="input-post-title"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#4E5968] mb-2">내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="자유롭게 이야기를 나눠보세요"
                  rows={6}
                  className="w-full px-4 py-3.5 bg-[#F2F4F6] rounded-[12px] text-[15px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#E5E8EB] resize-none"
                  data-testid="input-post-content"
                />
              </div>
            </div>

            <div className="h-8" />
          </div>
        </div>
      )}

      {config.bottomNav}
    </div>
  )
}
