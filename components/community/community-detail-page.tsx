"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Heart,
  MessageCircle,
  Send,
  Share2,
  User,
  Clock,
  Trash2,
  Copy,
  Check,
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

interface CommunityComment {
  id: number
  postId: number
  userId: string
  content: string
  authorName: string | null
  createdAt: string
}

interface DetailConfig {
  mode: string
  postId: string
  backHref: string
  accentColor: string
  accentBg: string
  accentLight: string
  gradient: string
  gradientColors: string[]
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

export function CommunityDetailPage({ config }: { config: DetailConfig }) {
  const router = useRouter()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/posts/${config.postId}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      }
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }, [config.postId])

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/community/comments?postId=${config.postId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }, [config.postId])

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [fetchPost, fetchComments])

  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.id) setCurrentUserId(data.id)
      })
      .catch(() => {})
  }, [])

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId)
    try {
      const res = await fetch(`/api/community/comments?id=${commentId}`, { method: "DELETE" })
      if (res.ok) {
        fetchComments()
        setPost(prev =>
          prev ? { ...prev, commentCount: Math.max((prev.commentCount || 0) - 1, 0) } : null
        )
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    } finally {
      setDeletingCommentId(null)
    }
  }

  const handleToggleLike = async () => {
    if (!post) return
    try {
      const res = await fetch("/api/community/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setPost(prev =>
          prev
            ? {
                ...prev,
                isLiked: data.liked,
                likeCount: data.liked
                  ? (prev.likeCount || 0) + 1
                  : Math.max((prev.likeCount || 0) - 1, 0),
              }
            : null
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting || !post) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          content: newComment,
        }),
      })
      if (res.ok) {
        setNewComment("")
        fetchComments()
        setPost(prev =>
          prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
        )
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async () => {
    if (!post) return
    try {
      const res = await fetch(`/api/community/posts?id=${post.id}`, { method: "DELETE" })
      if (res.ok) {
        router.push(config.backHref)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    const shareData = {
      title: post?.title || "커뮤니티 글",
      text: post?.content?.slice(0, 100) || "",
      url: shareUrl,
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        setShowShareMenu(true)
      }
    } else {
      setShowShareMenu(true)
    }
  }

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowShareMenu(false)
      }, 1500)
    } catch {
      console.error("Copy failed")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] pb-36">
        <header className="bg-white px-5 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <div className="h-5 bg-[#E5E8EB] rounded w-24 animate-pulse" />
          </div>
        </header>
        <main className="px-5 py-5 max-w-md mx-auto">
          <div className="bg-white rounded-[16px] p-5 animate-pulse">
            <div className="h-4 bg-[#F2F4F6] rounded w-1/4 mb-4" />
            <div className="h-6 bg-[#F2F4F6] rounded w-3/4 mb-3" />
            <div className="h-4 bg-[#F2F4F6] rounded w-full mb-2" />
            <div className="h-4 bg-[#F2F4F6] rounded w-full mb-2" />
            <div className="h-4 bg-[#F2F4F6] rounded w-2/3" />
          </div>
        </main>
        {config.bottomNav}
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F2F4F6] pb-36">
        <header className="bg-white px-5 py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <span className="text-[15px] text-[#8B95A1]">게시글</span>
          </div>
        </header>
        <main className="px-5 py-20 max-w-md mx-auto text-center">
          <p className="text-[14px] text-[#8B95A1]">게시글을 찾을 수 없어요</p>
        </main>
        {config.bottomNav}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] pb-36">
      <header className="bg-white px-5 py-4 sticky top-0 z-40 border-b border-[#F2F4F6]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <span className="text-[15px] font-medium text-[#191F28]">게시글</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="button-share"
            >
              <Share2 className="w-5 h-5 text-[#4E5968]" />
            </button>
            <button
              onClick={handleDeletePost}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F2F4F6] transition-colors"
              data-testid="button-delete-post"
            >
              <Trash2 className="w-5 h-5 text-[#B0B8C1]" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-5 py-5 max-w-md mx-auto space-y-3">
        <div className="bg-white rounded-[16px] p-5" data-testid="post-detail">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5E8EB] to-[#D1D5DB] flex items-center justify-center">
              <User className="w-5 h-5 text-[#8B95A1]" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[#191F28]" data-testid="text-author">{post.authorName || "익명"}</p>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${config.accentLight} ${config.accentColor}`}>
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#B0B8C1]">
                  <Clock className="w-3 h-3" />
                  {timeAgo(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-[18px] font-bold text-[#191F28] mb-3 leading-snug" data-testid="text-post-title">{post.title}</h2>
          <p className="text-[14px] text-[#4E5968] leading-relaxed whitespace-pre-wrap" data-testid="text-post-content">{post.content}</p>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#F2F4F6]">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                post.isLiked
                  ? `${config.accentLight} ${config.accentColor}`
                  : "bg-[#F2F4F6] text-[#8B95A1] hover:bg-[#E5E8EB]"
              }`}
              data-testid="button-like"
            >
              <Heart className={`w-4 h-4 transition-transform ${post.isLiked ? "fill-current scale-110" : ""}`} />
              {post.isLiked ? "공감했어요" : "공감"} {post.likeCount || 0}
            </button>
            <div className="flex items-center gap-1.5 text-[13px] text-[#8B95A1]">
              <MessageCircle className="w-4 h-4" />
              댓글 {post.commentCount || 0}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[16px] overflow-hidden" data-testid="comments-section">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[15px] font-bold text-[#191F28]">
              댓글 <span className={config.accentColor}>{post.commentCount || 0}</span>
            </p>
          </div>

          {comments.length > 0 ? (
            <div className="divide-y divide-[#F2F4F6]">
              {comments.map((comment) => (
                <div key={comment.id} className="px-5 py-4" data-testid={`comment-${comment.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#B0B8C1]" />
                      </div>
                      <span className="text-[13px] font-medium text-[#4E5968]">{comment.authorName || "익명"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#B0B8C1]">{timeAgo(comment.createdAt)}</span>
                      {currentUserId && comment.userId === currentUserId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={deletingCommentId === comment.id}
                          className="text-[#B0B8C1] hover:text-red-400 transition-colors p-0.5"
                          data-testid={`button-delete-comment-${comment.id}`}
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${deletingCommentId === comment.id ? "animate-pulse" : ""}`} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[14px] text-[#191F28] leading-relaxed pl-9">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 pb-5">
              <p className="text-[13px] text-[#B0B8C1] text-center py-6" data-testid="empty-comments">
                아직 댓글이 없어요. 첫 댓글을 남겨보세요!
              </p>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-20 left-0 right-0 z-30 bg-white border-t border-[#F2F4F6] px-4 py-3">
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 px-4 py-3 bg-[#F2F4F6] rounded-full text-[14px] text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none focus:ring-2 focus:ring-[#E5E8EB]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAddComment()
              }
            }}
            data-testid="input-comment"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || submitting}
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all ${
              newComment.trim()
                ? `${config.accentBg} text-white shadow-md`
                : "bg-[#E5E8EB] text-[#B0B8C1]"
            }`}
            data-testid="button-send-comment"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setShowShareMenu(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-5 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
            </div>
            <h3 className="text-[17px] font-bold text-[#191F28] mb-4 text-center">공유하기</h3>
            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-[#F2F4F6] hover:bg-[#E5E8EB] transition-colors"
                data-testid="button-copy-link"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-[#4E5968]" />
                )}
                <span className="text-[14px] font-medium text-[#191F28]">
                  {copied ? "링크가 복사되었어요!" : "링크 복사"}
                </span>
              </button>
            </div>
            <button
              onClick={() => setShowShareMenu(false)}
              className="w-full mt-3 py-3.5 rounded-[12px] text-[14px] font-medium text-[#8B95A1] hover:bg-[#F2F4F6] transition-colors"
              data-testid="button-close-share"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {config.bottomNav}
    </div>
  )
}
