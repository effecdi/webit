"use client";

import { useState } from "react";
import { Heart, Camera, Edit2, Sparkles } from "lucide-react";

interface ProfileData {
  name: string;
  role: string;
  photo: string | null;
}

export function WeddingCoupleProfile() {
  const [brideProfile, setBrideProfile] = useState<ProfileData>({
    name: "현정",
    role: "신부",
    photo: null,
  });

  const [groomProfile, setGroomProfile] = useState<ProfileData>({
    name: "주호",
    role: "신랑",
    photo: null,
  });

  const [weddingDate] = useState("2025.05.24");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-serif text-lg font-bold">우리의 결혼</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 border-2 border-secondary hover:bg-muted transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Couple Profiles */}
      <div className="flex items-center justify-center gap-6">
        {/* Groom Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 border-3 border-blue-400 bg-blue-50 flex items-center justify-center overflow-hidden">
              {groomProfile.photo ? (
                <img src={groomProfile.photo || "/placeholder.svg"} alt={groomProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-3xl font-bold text-blue-500">{groomProfile.name[0]}</span>
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
            />
          ) : (
            <span className="mt-3 font-bold">{groomProfile.name}</span>
          )}
        </div>

        {/* Heart with Wedding Date */}
        <div className="flex flex-col items-center -mt-4">
          <div className="relative">
            <Heart className="w-12 h-12 text-amber-500" fill="currentColor" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-600 mt-1">{weddingDate}</span>
        </div>

        {/* Bride Profile */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 border-3 border-primary bg-primary/10 flex items-center justify-center overflow-hidden">
              {brideProfile.photo ? (
                <img src={brideProfile.photo || "/placeholder.svg"} alt={brideProfile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-3xl font-bold text-primary">{brideProfile.name[0]}</span>
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
            />
          ) : (
            <span className="mt-3 font-bold">{brideProfile.name}</span>
          )}
        </div>
      </div>

      {/* Couple Name Display - Wedding Style */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-50 via-amber-50 to-pink-50 border-3 border-amber-500 shadow-brutalist-sm">
          <span className="font-serif text-xl font-bold text-blue-600">{groomProfile.name}</span>
          <Heart className="w-5 h-5 text-amber-500" fill="currentColor" />
          <span className="font-serif text-xl font-bold text-primary">{brideProfile.name}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground font-serif italic">{"We're getting married!"}</p>
      </div>

      {isEditing && (
        <button
          onClick={() => setIsEditing(false)}
          className="mt-4 w-full py-3 bg-amber-500 text-white font-bold border-3 border-secondary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          저장하기
        </button>
      )}
    </section>
  );
}
