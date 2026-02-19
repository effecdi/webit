"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Edit2,
  Camera,
  Calendar,
  UserPlus,
  Link2,
  X,
  MessageCircle,
  Check,
} from "lucide-react";
import Image from "next/image";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export function FamilyCoupleProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profiles, setProfiles] = useState({
    me: {
      name: "",
      role: "아내",
      birthday: "",
      photo: "/placeholder.svg?height=120&width=120",
    },
    partner: {
      name: "",
      role: "남편",
      birthday: "",
      photo: "/placeholder.svg?height=120&width=120",
    },
  });
  const [isCoupled, setIsCoupled] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [weddingDateStr, setWeddingDateStr] = useState("날짜 미정");
  const [daysTogether, setDaysTogether] = useState(0);

  useEffect(() => {
    const savedWeddingDate =
      localStorage.getItem("wedding_date") || "2025-12-20";
    const wd = new Date(savedWeddingDate);
    const t = new Date();
    setDaysTogether(
      Math.floor((t.getTime() - wd.getTime()) / (1000 * 60 * 60 * 24)),
    );
    setWeddingDateStr(
      `${wd.getFullYear()}.${String(wd.getMonth() + 1).padStart(2, "0")}.${String(wd.getDate()).padStart(2, "0")}`,
    );
  }, []);

  useEffect(() => {
    const myName = localStorage.getItem("survey_myName") || "나";
    const partnerName = localStorage.getItem("survey_partnerName") || "상대";
    const myBirthday = localStorage.getItem("survey_myBirthday") || "";
    const partnerBirthday =
      localStorage.getItem("survey_partnerBirthday") || "";

    setProfiles({
      me: {
        name: myName,
        role: "아내",
        birthday: myBirthday,
        photo: "/placeholder.svg?height=120&width=120",
      },
      partner: {
        name: partnerName,
        role: "남편",
        birthday: partnerBirthday,
        photo: "/placeholder.svg?height=120&width=120",
      },
    });

    fetch("/api/couple")
      .then((res) => res.json())
      .then((data) => {
        setIsCoupled(data.coupled === true);
        if (data.coupled && data.partner) {
          const pName = data.partner.firstName || partnerName;
          setProfiles((prev) => ({
            ...prev,
            partner: {
              ...prev.partner,
              name: pName,
              photo: data.partner.profileImageUrl || prev.partner.photo,
            },
          }));
        }
        if (!data.coupled) {
          fetch("/api/couple-invite")
            .then((r) => r.json())
            .then((invData) => {
              if (invData.invites) {
                const pending = invData.invites.find(
                  (inv: any) =>
                    inv.mode === "family" && inv.status === "pending",
                );
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
        body: JSON.stringify({ inviterName: myName, mode: "family" }),
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
    <section className="bg-white rounded-[24px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[17px] font-bold text-[#191F28]">우리 프로필</h2>
        <div className="flex items-center gap-2">
          {!isCoupled && !isEditing && (
            <button
              onClick={handleInviteClick}
              disabled={isLoadingInvite}
              className="px-3 py-1.5 rounded-[10px] bg-green-500 text-white text-[12px] font-semibold flex items-center gap-1 disabled:opacity-50"
              data-testid="button-invite-partner-family"
            >
              <UserPlus className="w-3 h-3" />
              {isLoadingInvite ? "생성 중..." : "상대방 초대"}
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            data-testid="button-edit-family-profile"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold rounded-[10px] transition-all ${
              isEditing
                ? "bg-[#333D4B] text-white"
                : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? "완료" : "편집"}
          </button>
        </div>
      </div>

      {isCoupled && (
        <div className="mb-4 px-3 py-2 bg-green-50 rounded-[10px] flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-green-500" fill="currentColor" />
          <span className="text-[12px] text-green-600 font-semibold">
            커플 연결 완료
          </span>
        </div>
      )}

      <div className="flex items-center justify-center gap-5 mb-5">
        <div className="flex flex-col items-center">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D1D6DB]">
              <Image
                src={profiles.me.photo || "/placeholder.svg"}
                alt={profiles.me.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button
                data-testid="button-edit-my-photo"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] text-white rounded-full flex items-center justify-center shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.me.name}
              onChange={(e) =>
                setProfiles({
                  ...profiles,
                  me: { ...profiles.me, name: e.target.value },
                })
              }
              className="w-16 text-center text-[15px] font-bold border-b-2 border-[#333D4B] bg-transparent focus:outline-none text-[#191F28]"
              data-testid="input-family-my-name"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">
              {profiles.me.name}
            </span>
          )}
          <span className="text-[12px] text-[#8B95A1] font-medium mt-0.5">
            {profiles.me.role}
          </span>
        </div>

        <div className="flex flex-col items-center -mt-6">
          <div
            className="w-9 h-9 rounded-full bg-[#F2F4F6] flex items-center justify-center"
            data-testid="icon-couple-heart"
          >
            <Heart className="w-4 h-4 text-[#8B95A1]" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D1D6DB]">
              <Image
                src={profiles.partner.photo || "/placeholder.svg"}
                alt={profiles.partner.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button
                data-testid="button-edit-partner-photo"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#333D4B] text-white rounded-full flex items-center justify-center shadow-md"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={profiles.partner.name}
              onChange={(e) =>
                setProfiles({
                  ...profiles,
                  partner: { ...profiles.partner, name: e.target.value },
                })
              }
              className="w-16 text-center text-[15px] font-bold border-b-2 border-[#333D4B] bg-transparent focus:outline-none text-[#191F28]"
              data-testid="input-family-partner-name"
            />
          ) : (
            <span className="text-[15px] font-bold text-[#191F28]">
              {profiles.partner.name}
            </span>
          )}
          <span className="text-[12px] text-[#8B95A1] font-medium mt-0.5">
            {profiles.partner.role}
          </span>
        </div>
      </div>

      <div className="bg-[#F7F8FA] rounded-[14px] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5E8EB] flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#4E5968]" />
            </div>
            <div>
              <p className="text-[11px] text-[#8B95A1] font-medium leading-tight">
                결혼기념일
              </p>
              <p className="text-[14px] font-semibold text-[#191F28]">
                {weddingDateStr}
              </p>
            </div>
          </div>
          <div
            className="px-3 py-1.5 bg-[#E5E8EB] rounded-full"
            data-testid="text-wedding-dday"
          >
            <span className="text-[13px] font-bold text-[#333D4B]">
              D{daysTogether}
            </span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 pt-4 border-t border-[#F2F4F6] grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">
              {profiles.me.name} 생일
            </label>
            <input
              type="text"
              value={profiles.me.birthday}
              onChange={(e) =>
                setProfiles({
                  ...profiles,
                  me: { ...profiles.me, birthday: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 text-[14px] bg-transparent border border-[#E5E8EB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#333D4B] text-[#191F28]"
              placeholder="YYYY.MM.DD"
              data-testid="input-family-my-birthday"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#8B95A1] mb-1.5">
              {profiles.partner.name} 생일
            </label>
            <input
              type="text"
              value={profiles.partner.birthday}
              onChange={(e) =>
                setProfiles({
                  ...profiles,
                  partner: { ...profiles.partner, birthday: e.target.value },
                })
              }
              className="w-full px-3 py-2.5 text-[14px] bg-transparent border border-[#E5E8EB] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#333D4B] text-[#191F28]"
              placeholder="YYYY.MM.DD"
              data-testid="input-family-partner-birthday"
            />
          </div>
        </div>
      )}

      <BottomSheet open={showShareModal} onOpenChange={setShowShareModal} className="bg-white dark:bg-gray-900 z-[60]" overlayClassName="z-[60]">
        <div className="px-5 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-bold text-[#191F28] dark:text-gray-100">
              상대방 초대하기
            </h3>
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
              onClick={() => {
                handleCopyLink();
                setTimeout(() => setShowShareModal(false), 800);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-[14px] bg-[#F2F4F6] dark:bg-gray-800 hover:bg-[#E5E8EB] dark:hover:bg-gray-700 transition-colors"
              data-testid="button-share-copy-link"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                {copied ? (
                  <Check className="w-6 h-6 text-green-500" />
                ) : (
                  <Link2 className="w-6 h-6 text-[#4E5968] dark:text-gray-300" />
                )}
              </div>
              <div className="text-left">
                <p className="text-[15px] font-bold text-[#191F28] dark:text-gray-100">
                  {copied ? "복사됨!" : "링크 복사"}
                </p>
                <p className="text-[12px] text-[#8B95A1] dark:text-gray-400">
                  {copied
                    ? "클립보드에 복사되었습니다"
                    : "초대 링크를 클립보드에 복사합니다"}
                </p>
              </div>
            </button>
          </div>
        </div>
        <div className="h-10" />
      </BottomSheet>
    </section>
  );
}
