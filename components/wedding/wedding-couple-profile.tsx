"use client";

import { useState, useEffect } from "react";
import { Heart, Camera, Edit2, Sparkles, UserPlus, Link2, X, MessageCircle, Check } from "lucide-react";
import { BottomSheet } from '@/components/ui/bottom-sheet'

interface ProfileData {
  name: string;
  role: string;
  photo: string | null;
}

export function WeddingCoupleProfile() {
  const [brideProfile, setBrideProfile] = useState<ProfileData>({
    name: "",
    role: "신부",
    photo: null,
  });

  const [groomProfile, setGroomProfile] = useState<ProfileData>({
    name: "",
    role: "신랑",
    photo: null,
  });

  const [weddingDate, setWeddingDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCoupled, setIsCoupled] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "나";
    const partnerName = localStorage.getItem("survey_partnerName") || "상대";
    const savedWeddingDate = localStorage.getItem("wedding_date") || "";

    setGroomProfile({ name: myName, role: "신랑", photo: null });
    setBrideProfile({ name: partnerName, role: "신부", photo: null });
    if (savedWeddingDate) {
      const d = new Date(savedWeddingDate);
      setWeddingDate(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`);
    }

    fetch("/api/couple")
      .then(res => res.json())
      .then(data => {
        setIsCoupled(data.coupled === true);
        if (data.coupled && data.partner) {
          const pName = data.partner.firstName || partnerName;
          setBrideProfile(prev => ({
            ...prev,
            name: pName,
            photo: data.partner.profileImageUrl || null,
          }));
        }
        if (!data.coupled) {
          fetch("/api/couple-invite")
            .then(r => r.json())
            .then(invData => {
              if (invData.invites) {
                const pending = invData.invites.find((inv: any) => inv.mode === "wedding" && inv.status === "pending");
                if (pending) setInviteCode(pending.inviteCode);
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const inviteUrl = inviteCode
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteCode}`
    : "";

  const handleInviteClick = async () => {
    if (inviteCode) {
      setShowShareModal(true);
      return;
    }
    setIsLoadingInvite(true);
    try {
      const myName = localStorage.getItem("survey_myName") || "나";
      const res = await fetch("/api/couple-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterName: myName, mode: "wedding" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.invite) setInviteCode(data.invite.inviteCode);
        else if (data.inviteCode) setInviteCode(data.inviteCode);
        setShowShareModal(true);
      }
    } catch {}
    setIsLoadingInvite(false);
  };

  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-bold">우리의 결혼</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isCoupled && !isEditing && (
            <button
              onClick={handleInviteClick}
              disabled={isLoadingInvite}
              className="px-3 py-1.5 bg-blue-400 border-2 border-secondary text-white text-[12px] font-bold flex items-center gap-1 disabled:opacity-50"
              data-testid="button-invite-partner-wedding"
            >
              <UserPlus className="w-3 h-3" />
              {isLoadingInvite ? "생성 중..." : "상대방 초대"}
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 border-2 border-secondary hover:bg-muted transition-colors"
            data-testid="button-edit-wedding-profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isCoupled && (
        <div className="mb-4 px-3 py-2 bg-blue-50 border-2 border-blue-300 flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-blue-500" fill="currentColor" />
          <span className="text-[12px] text-blue-600 font-bold">커플 연결 완료</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 border-3 border-blue-400 bg-blue-50 flex items-center justify-center overflow-hidden">
              {groomProfile.photo ? (
                <img src={groomProfile.photo} alt={groomProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-3xl font-bold text-blue-500">{groomProfile.name[0] || "?"}</span>
              )}
            </div>
            <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-blue-400 border-2 border-secondary text-xs font-bold text-white">
              {groomProfile.role}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-400 border-2 border-secondary flex items-center justify-center shadow-brutalist-sm">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={groomProfile.name}
              onChange={(e) => setGroomProfile({ ...groomProfile, name: e.target.value })}
              className="mt-3 w-20 text-center font-bold border-b-2 border-secondary bg-transparent focus:outline-none focus:border-blue-400"
              data-testid="input-groom-name"
            />
          ) : (
            <span className="mt-3 font-bold" data-testid="text-groom-name">{groomProfile.name}</span>
          )}
        </div>

        <div className="flex flex-col items-center -mt-4">
          <div className="relative">
            <Heart className="w-12 h-12 text-amber-500" fill="currentColor" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-600 mt-1">{weddingDate || "날짜 미정"}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 border-3 border-primary bg-primary/10 flex items-center justify-center overflow-hidden">
              {brideProfile.photo ? (
                <img src={brideProfile.photo} alt={brideProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-3xl font-bold text-primary">{brideProfile.name[0] || "?"}</span>
              )}
            </div>
            <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-primary border-2 border-secondary text-xs font-bold text-primary-foreground">
              {brideProfile.role}
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary border-2 border-secondary flex items-center justify-center shadow-brutalist-sm">
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={brideProfile.name}
              onChange={(e) => setBrideProfile({ ...brideProfile, name: e.target.value })}
              className="mt-3 w-20 text-center font-bold border-b-2 border-secondary bg-transparent focus:outline-none focus:border-primary"
              data-testid="input-bride-name"
            />
          ) : (
            <span className="mt-3 font-bold" data-testid="text-bride-name">{brideProfile.name}</span>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-50 via-amber-50 to-pink-50 border-3 border-amber-500 shadow-brutalist-sm">
          <span className="font-serif text-xl font-bold text-blue-600" data-testid="text-groom-display">{groomProfile.name}</span>
          <Heart className="w-5 h-5 text-amber-500" fill="currentColor" />
          <span className="font-serif text-xl font-bold text-primary" data-testid="text-bride-display">{brideProfile.name}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground font-serif italic">{"We're getting married!"}</p>
      </div>

      {isEditing && (
        <button
          onClick={() => setIsEditing(false)}
          className="mt-4 w-full py-3 bg-amber-500 text-white font-bold border-3 border-secondary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          data-testid="button-save-wedding-profile"
        >
          저장하기
        </button>
      )}

      <BottomSheet open={showShareModal} onOpenChange={setShowShareModal} className="bg-white dark:bg-gray-900 z-[60]" overlayClassName="z-[60]" showHandle={false}>
            <div className="px-5 pt-3 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-bold text-[#191F28] dark:text-gray-100">상대방 초대하기</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                  data-testid="button-close-share-modal"
                >
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => { handleCopyLink(); setTimeout(() => setShowShareModal(false), 800); }}
                  className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#F2F4F6] dark:bg-gray-800 hover:bg-[#E5E8EB] dark:hover:bg-gray-700 transition-colors"
                  data-testid="button-share-copy-link"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Link2 className="w-6 h-6 text-[#4E5968] dark:text-gray-300" />}
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">{copied ? "복사됨!" : "링크 복사"}</p>
                    <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">{copied ? "클립보드에 복사되었습니다" : "초대 링크를 클립보드에 복사합니다"}</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="h-10" />
      </BottomSheet>
    </section>
  );
}
