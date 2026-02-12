"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Clock,
  ChevronLeft,
  Shield,
  AlertCircle,
  User,
  FileText,
  Loader2,
  Truck,
  PackageCheck,
} from "lucide-react";

interface Verification {
  id: number;
  userId: string;
  orderNumber: string;
  receiptUrl: string | null;
  status: string;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
}

type FilterType = "all" | "pending" | "approved" | "shipping" | "delivered" | "rejected";

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: typeof Check }> = {
  pending: { label: "대기중", bg: "bg-amber-500/20", text: "text-amber-400", icon: Clock },
  approved: { label: "승인", bg: "bg-green-500/20", text: "text-green-400", icon: Check },
  shipping: { label: "배송 중", bg: "bg-blue-500/20", text: "text-blue-400", icon: Truck },
  delivered: { label: "배송완료", bg: "bg-emerald-500/20", text: "text-emerald-400", icon: PackageCheck },
  rejected: { label: "반려", bg: "bg-red-500/20", text: "text-red-400", icon: AlertCircle },
};

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectNoteId, setRejectNoteId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const fetchVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.status === 403) {
        setError("관리자 권한이 필요합니다.");
        return;
      }
      if (res.status === 401) {
        setError("로그인이 필요합니다.");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVerifications(data.verifications);
    } catch (e) {
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleStatusUpdate = async (id: number, status: string, adminNote?: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminNote }),
      });
      if (res.ok) {
        setVerifications((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, status, adminNote: adminNote || v.adminNote, reviewedAt: new Date().toISOString() }
              : v
          )
        );
        if (status === "rejected") {
          setRejectNoteId(null);
          setRejectNote("");
        }
      }
    } catch (e) {
      console.error("Status update error:", e);
    } finally {
      setProcessingId(null);
    }
  };

  const filtered = verifications.filter((v) =>
    filter === "all" ? true : v.status === filter
  );

  const statusCounts = {
    all: verifications.length,
    pending: verifications.filter((v) => v.status === "pending").length,
    approved: verifications.filter((v) => v.status === "approved").length,
    shipping: verifications.filter((v) => v.status === "shipping").length,
    delivered: verifications.filter((v) => v.status === "delivered").length,
    rejected: verifications.filter((v) => v.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-[17px] font-bold text-white mb-2">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2.5 bg-white/10 text-white rounded-full text-[14px] font-medium"
            data-testid="button-go-back"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const getNextAction = (status: string) => {
    switch (status) {
      case "approved":
        return { label: "배송 시작", nextStatus: "shipping", icon: Truck, color: "bg-blue-500/20 text-blue-400" };
      case "shipping":
        return { label: "배송 완료", nextStatus: "delivered", icon: PackageCheck, color: "bg-emerald-500/20 text-emerald-400" };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center px-4 h-14 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2 ml-2">
            <Shield className="w-5 h-5 text-[#d63bf2]" />
            <h1 className="text-[17px] font-bold text-white">구매 인증 관리</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(["pending", "all", "approved", "shipping", "delivered", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                filter === f
                  ? "bg-[#d63bf2] text-white"
                  : "bg-white/8 text-white/50 hover:bg-white/12"
              }`}
              data-testid={`filter-${f}`}
            >
              {f === "all" && `전체 (${statusCounts.all})`}
              {f === "pending" && `대기중 (${statusCounts.pending})`}
              {f === "approved" && `승인 (${statusCounts.approved})`}
              {f === "shipping" && `배송 중 (${statusCounts.shipping})`}
              {f === "delivered" && `배송완료 (${statusCounts.delivered})`}
              {f === "rejected" && `반려 (${statusCounts.rejected})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-[14px] text-white/30">
              {filter === "pending" ? "대기 중인 인증 요청이 없습니다" : "항목이 없습니다"}
            </p>
          </div>
        ) : (
          filtered.map((v) => {
            const cfg = statusConfig[v.status] || statusConfig.pending;
            const nextAction = getNextAction(v.status);

            return (
              <div
                key={v.id}
                className="bg-white/5 rounded-[16px] p-4 border border-white/5"
                data-testid={`verification-card-${v.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-white truncate">
                        {v.userFirstName || ""} {v.userLastName || ""}
                      </p>
                      <p className="text-[11px] text-white/40 truncate">{v.userEmail || v.userId}</p>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}
                  >
                    <cfg.icon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>

                <div className="bg-white/5 rounded-[12px] p-3 mb-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-[12px] text-white/50">주문번호</span>
                  </div>
                  <p className="text-[14px] text-white font-medium pl-5.5">{v.orderNumber}</p>
                </div>

                {v.adminNote && (
                  <div className="bg-red-500/10 rounded-[12px] p-3 mb-3">
                    <p className="text-[12px] text-red-400">반려 사유: {v.adminNote}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/30">
                    {new Date(v.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {v.status === "pending" && (
                    <div className="flex gap-2">
                      {rejectNoteId === v.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="반려 사유 입력"
                            className="w-40 px-3 py-1.5 bg-white/10 rounded-lg text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-red-400/50 border-0"
                            data-testid={`input-reject-note-${v.id}`}
                            autoFocus
                          />
                          <button
                            onClick={() => handleStatusUpdate(v.id, "rejected", rejectNote.trim())}
                            disabled={!rejectNote.trim() || processingId === v.id}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-[12px] font-semibold disabled:opacity-40"
                            data-testid={`button-confirm-reject-${v.id}`}
                          >
                            {processingId === v.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              "확인"
                            )}
                          </button>
                          <button
                            onClick={() => { setRejectNoteId(null); setRejectNote(""); }}
                            className="px-2 py-1.5 text-white/40 text-[12px]"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setRejectNoteId(v.id)}
                            disabled={processingId === v.id}
                            className="px-4 py-2 bg-white/8 text-white/60 rounded-full text-[12px] font-semibold hover:bg-white/12 transition-colors"
                            data-testid={`button-reject-${v.id}`}
                          >
                            반려
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(v.id, "approved")}
                            disabled={processingId === v.id}
                            className="px-4 py-2 bg-[#d63bf2] text-white rounded-full text-[12px] font-semibold hover:bg-[#c030d8] transition-colors flex items-center gap-1"
                            data-testid={`button-approve-${v.id}`}
                          >
                            {processingId === v.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                승인
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {nextAction && (
                    <button
                      onClick={() => handleStatusUpdate(v.id, nextAction.nextStatus)}
                      disabled={processingId === v.id}
                      className={`px-4 py-2 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${nextAction.color}`}
                      data-testid={`button-${nextAction.nextStatus}-${v.id}`}
                    >
                      {processingId === v.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <nextAction.icon className="w-3.5 h-3.5" />
                          {nextAction.label}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
