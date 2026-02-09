"use client";

import { useState, useEffect } from "react";
import { Heart, Camera, Edit2, Sparkles, UserPlus, Link2, Copy } from "lucide-react";

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
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

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
      })
      .catch(() => {});
  }, []);

  const handleCreateInvite = async () => {
    try {
      const myName = localStorage.getItem("survey_myName") || "나";
      const res = await fetch("/api/couple-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviterName: myName, mode: "wedding" }),
      });
      if (res.ok) {
        const data = await res.json();
        setInviteCode(data.inviteCode);
        setShowInvite(true);
      }
    } catch {}
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/invite/${inviteCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-bold">우리의 결혼</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isCoupled && !showInvite && (
            <button
              onClick={handleCreateInvite}
              className="px-3 py-1.5 bg-blue-400 border-2 border-secondary text-white text-[12px] font-bold flex items-center gap-1"
              data-testid="button-invite-partner-wedding"
            >
              <UserPlus className="w-3 h-3" />
              상대방 초대
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

      {showInvite && !isCoupled && (
        <div className="mb-5 p-4 bg-blue-50 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-blue-500" />
            <span className="text-[13px] font-bold">초대 링크</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite/${inviteCode}`}
              className="flex-1 text-[12px] bg-white px-3 py-2 border-2 border-secondary text-[#4E5968]"
              data-testid="input-invite-link-wedding"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-blue-400 border-2 border-secondary text-white text-[12px] font-bold flex items-center gap-1"
              data-testid="button-copy-invite-wedding"
            >
              <Copy className="w-3 h-3" />
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
          <p className="text-[11px] text-[#8B95A1] mt-2">
            링크를 상대방에게 공유하면 함께 사용할 수 있어요
          </p>
        </div>
      )}

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
    </section>
  );
}
