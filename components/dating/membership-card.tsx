"use client";

import { useState } from "react";
import { Crown, Check, Sparkles, X } from "lucide-react";

const MEMBERSHIP_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "무료",
    features: ["기본 캘린더", "사진 50장 저장", "기본 위젯", "저화질 추억 보관"],
    color: "bg-muted",
    borderColor: "border-secondary",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₩1,900/월",
    features: ["무제한 캘린더", "사진 무제한", "프리미엄 위젯", "광고 제거", "고화질 원본 평생 보관", "히스토리 북 무제한"],
    color: "bg-primary/20",
    borderColor: "border-primary",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "₩4,900/월",
    features: ["Premium 전체", "전용 테마", "우선 고객지원", "커플 굿즈 할인", "특별 이벤트", "가족 모드 프리미엄"],
    color: "bg-gradient-to-br from-amber-100 to-amber-200",
    borderColor: "border-amber-500",
  },
];

export function MembershipCard() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [showModal, setShowModal] = useState(false);

  const activePlan = MEMBERSHIP_PLANS.find((p) => p.id === currentPlan);

  return (
    <>
      <section className="bg-card border-3 border-secondary p-6 shadow-brutalist">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold">멤버십</h2>
          <div className="flex items-center gap-1 px-3 py-1 bg-muted border-2 border-secondary">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold">{activePlan?.name}</span>
          </div>
        </div>

        {/* Current Plan Info */}
        <div className={`p-4 border-3 ${activePlan?.borderColor} ${activePlan?.color} mb-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">{activePlan?.name} 플랜</p>
              <p className="text-sm text-muted-foreground">{activePlan?.price}</p>
            </div>
            {currentPlan === "free" && (
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            )}
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 bg-primary text-primary-foreground font-bold border-3 border-secondary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {currentPlan === "free" ? "업그레이드하기" : "플랜 변경하기"}
        </button>
      </section>

      {/* Membership Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">
          <div className="w-full max-w-md bg-card border-3 border-secondary shadow-brutalist-lg max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b-3 border-secondary p-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">멤버십 선택</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans */}
            <div className="p-4 space-y-4">
              {MEMBERSHIP_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-4 border-3 ${plan.borderColor} ${plan.color} cursor-pointer transition-all ${
                    currentPlan === plan.id ? "shadow-brutalist" : "hover:shadow-brutalist-sm"
                  }`}
                  onClick={() => setCurrentPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold border-2 border-secondary">
                      BEST
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-serif font-bold text-lg">{plan.name}</p>
                      <p className="font-bold text-primary">{plan.price}</p>
                    </div>
                    <div
                      className={`w-6 h-6 border-3 border-secondary flex items-center justify-center ${
                        currentPlan === plan.id ? "bg-primary" : "bg-background"
                      }`}
                    >
                      {currentPlan === plan.id && <Check className="w-4 h-4 text-primary-foreground" />}
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="sticky bottom-0 bg-card border-t-3 border-secondary p-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-secondary text-secondary-foreground font-bold border-3 border-secondary shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
