"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Shield, 
  HelpCircle, 
  MessageCircle, 
  Calendar, 
  Heart, 
  Gift, 
  Clock,
  LayoutGrid,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProfileSettingsSectionProps {
  mode: "dating" | "wedding" | "family"
}

interface SettingsData {
  notifMessage: boolean
  notifSchedule: boolean
  notifAnniversary: boolean
  notifGift: boolean
  notifDaily: boolean
  privacyProfileVisible: boolean
  privacyLocationShare: boolean
  privacyReadReceipt: boolean
  privacyOnlineStatus: boolean
  privacyActivityShare: boolean
  supportNewsletter: boolean
  supportEventNotify: boolean
  supportFeedback: boolean
  supportSurvey: boolean
}

const DEFAULTS: SettingsData = {
  notifMessage: true,
  notifSchedule: true,
  notifAnniversary: true,
  notifGift: false,
  notifDaily: false,
  privacyProfileVisible: true,
  privacyLocationShare: false,
  privacyReadReceipt: true,
  privacyOnlineStatus: true,
  privacyActivityShare: false,
  supportNewsletter: true,
  supportEventNotify: true,
  supportFeedback: false,
  supportSurvey: false,
}

const FAQ_ITEMS = [
  {
    q: "WE:BEAT는 어떤 앱인가요?",
    a: "WE:BEAT는 커플의 연애부터 결혼, 가족까지 모든 라이프사이클을 함께하는 슈퍼앱입니다. 연애모드, 결혼모드, 가족모드를 전환하며 각 단계에 맞는 다양한 기능을 이용할 수 있습니다.",
  },
  {
    q: "모드 전환은 어떻게 하나요?",
    a: "앱 하단 네비게이션의 모드 아이콘을 탭하거나, 마이페이지에서 모드 전환 버튼을 눌러 연애/결혼/가족 모드를 자유롭게 전환할 수 있습니다. 각 모드의 데이터는 독립적으로 관리됩니다.",
  },
  {
    q: "커플 연결은 어떻게 하나요?",
    a: "마이페이지에서 '커플 연결' 메뉴를 통해 초대 코드를 생성하고, 상대방에게 카카오톡이나 링크로 공유하면 됩니다. 상대방이 코드를 입력하면 자동으로 커플로 연결됩니다.",
  },
  {
    q: "디지털 청첩장은 무료인가요?",
    a: "기본 템플릿 2종은 무료로 이용 가능하며, 최대 2개의 청첩장을 무료로 만들 수 있습니다. 프리미엄 템플릿과 추가 기능(AI 문구 생성, 고급 디자인 등)은 멤버십 구독 후 이용 가능합니다.",
  },
  {
    q: "청첩장을 카카오톡으로 공유할 수 있나요?",
    a: "네, 청첩장 편집기에서 '공유하기' 버튼을 누르면 카카오톡 채팅방으로 직접 공유할 수 있습니다. 링크 복사, URL 공유 등 다양한 공유 방법도 지원합니다.",
  },
  {
    q: "멤버십 구독 요금은 얼마인가요?",
    a: "WE:BEAT 멤버십은 Advanced(월 4,900원)와 Premium(월 9,900원) 두 가지 플랜을 제공합니다. Advanced는 커플 통계 리포트와 추가 저장 공간을, Premium은 AI 추천, 무제한 저장 공간, 프리미엄 템플릿 등 모든 기능을 이용할 수 있습니다.",
  },
  {
    q: "사진과 데이터는 안전하게 보관되나요?",
    a: "네, 모든 데이터는 암호화되어 안전하게 보관됩니다. 사진, 일정, 메모 등 개인 정보는 철저히 보호되며, 커플 연결이 해제되더라도 본인의 데이터는 유지됩니다.",
  },
  {
    q: "가족모드의 추억 아카이브는 무엇인가요?",
    a: "가족모드의 추억 아카이브는 가족의 소중한 순간들을 날짜별로 기록하고, 사진과 함께 아름다운 타임라인으로 감상할 수 있는 기능입니다. 기념일이나 특별한 순간을 영구적으로 보관할 수 있습니다.",
  },
  {
    q: "여행 플래너 기능은 어떻게 사용하나요?",
    a: "모든 모드에서 사용 가능한 여행 플래너는 여행 일정, 체크리스트, 예산 관리를 한 곳에서 할 수 있습니다. 새 여행을 추가하고 날짜별 일정을 등록하면 커플이 함께 확인하고 준비할 수 있습니다.",
  },
  {
    q: "앱을 탈퇴하면 데이터는 어떻게 되나요?",
    a: "탈퇴 시 모든 개인 데이터는 30일간 보관 후 영구 삭제됩니다. 탈퇴 전에 사진과 데이터를 백업하시기 바랍니다. 30일 이내에 재가입하면 기존 데이터를 복구할 수 있습니다.",
  },
]

export function ProfileSettingsSection({ mode }: ProfileSettingsSectionProps) {
  const router = useRouter()
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  const [showSupportSettings, setShowSupportSettings] = useState(false)
  const [showFaq, setShowFaq] = useState(false)
  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState<SettingsData>(DEFAULTS)

  useEffect(() => {
    fetch("/api/user-settings")
      .then(res => {
        if (!res.ok) throw new Error("unauthorized")
        return res.json()
      })
      .then(data => {
        const merged: SettingsData = { ...DEFAULTS }
        for (const k of Object.keys(DEFAULTS) as (keyof SettingsData)[]) {
          if (typeof data[k] === "boolean") merged[k] = data[k]
        }
        setSettings(merged)
        setSettingsLoaded(true)
      })
      .catch(() => setSettingsLoaded(true))
  }, [])

  const updateSetting = useCallback((key: keyof SettingsData, value: boolean) => {
    const prev = { ...settings }
    const updated = { ...settings, [key]: value }
    setSettings(updated as SettingsData)
    setSaving(true)
    fetch("/api/user-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then(res => {
        if (!res.ok) {
          setSettings(prev)
        }
      })
      .catch(() => {
        setSettings(prev)
      })
      .finally(() => setSaving(false))
  }, [settings])

  const notifications = {
    message: settings.notifMessage,
    schedule: settings.notifSchedule,
    anniversary: settings.notifAnniversary,
    gift: settings.notifGift,
    daily: settings.notifDaily,
  }

  const privacy = {
    profileVisible: settings.privacyProfileVisible,
    locationShare: settings.privacyLocationShare,
    readReceipt: settings.privacyReadReceipt,
    onlineStatus: settings.privacyOnlineStatus,
    activityShare: settings.privacyActivityShare,
  }

  const support = {
    newsletter: settings.supportNewsletter,
    eventNotify: settings.supportEventNotify,
    feedback: settings.supportFeedback,
    survey: settings.supportSurvey,
  }

  const notifKeyMap: Record<string, keyof SettingsData> = {
    message: "notifMessage",
    schedule: "notifSchedule",
    anniversary: "notifAnniversary",
    gift: "notifGift",
    daily: "notifDaily",
  }

  const privacyKeyMap: Record<string, keyof SettingsData> = {
    profileVisible: "privacyProfileVisible",
    locationShare: "privacyLocationShare",
    readReceipt: "privacyReadReceipt",
    onlineStatus: "privacyOnlineStatus",
    activityShare: "privacyActivityShare",
  }

  const supportKeyMap: Record<string, keyof SettingsData> = {
    newsletter: "supportNewsletter",
    eventNotify: "supportEventNotify",
    feedback: "supportFeedback",
    survey: "supportSurvey",
  }

  const themeColor = mode === "dating" ? "#FF8A80" : mode === "wedding" ? "#FF8A80" : "#22C55E"
  const themeColorLight = mode === "dating" ? "pink" : mode === "wedding" ? "pink" : "green"

  const settingsItems = [
    { 
      icon: Bell, 
      label: "알림 설정", 
      desc: "푸시 알림 및 앱 알림",
      action: () => setShowNotificationSettings(true)
    },
    { 
      icon: Shield, 
      label: "개인정보 보호", 
      desc: "프라이버시 및 보안 설정",
      action: () => setShowPrivacySettings(true)
    },
    { 
      icon: HelpCircle, 
      label: "고객센터", 
      desc: "문의하기 및 FAQ",
      action: () => setShowSupportSettings(true)
    },
    { 
      icon: LayoutGrid, 
      label: "위젯 스토어", 
      desc: "홈 화면 위젯 관리",
      action: () => router.push("/widgets")
    },
  ]

  return (
    <>
      {/* Settings Menu */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">
        {settingsItems.map((item, idx) => (
          <button
            key={item.label}
            onClick={item.action}
            data-testid={`button-settings-${item.label === "알림 설정" ? "notification" : item.label === "개인정보 보호" ? "privacy" : item.label === "고객센터" ? "support" : "widget"}`}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-[#F8F9FA] transition-colors ${
              idx !== settingsItems.length - 1 ? "border-b border-[#F2F4F6]" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#F2F4F6] flex items-center justify-center">
              <item.icon className="w-5 h-5 text-[#4E5968]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-medium text-[#191F28]">{item.label}</p>
              <p className="text-[13px] text-[#8B95A1]">{item.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
          </button>
        ))}
      </div>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setShowNotificationSettings(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
              </div>
              
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-[#F2F4F6]">
                <Bell className="w-6 h-6 text-[#191F28]" />
                <h3 className="text-[19px] font-bold text-[#191F28]">알림 설정</h3>
              </div>
            </div>
            
            <div className="px-5 py-4 space-y-1">
              {[
                { key: "message", icon: MessageCircle, label: "메시지 알림", desc: "상대방이 메시지를 보냈을 때" },
                { key: "schedule", icon: Calendar, label: "일정 알림", desc: "예정된 데이트 1일 전, 1시간 전" },
                { key: "anniversary", icon: Heart, label: "기념일 알림", desc: "D-Day 및 특별한 날 리마인드" },
                { key: "gift", icon: Gift, label: "선물 추천", desc: "기념일 맞춤 선물 추천" },
                { key: "daily", icon: Clock, label: "데일리 알림", desc: "매일 사랑 표현 리마인드" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#4E5968]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#191F28]">{item.label}</p>
                      <p className="text-[13px] text-[#8B95A1]">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[item.key as keyof typeof notifications]}
                    onClick={() => updateSetting(notifKeyMap[item.key], !notifications[item.key as keyof typeof notifications])}
                    data-testid={`switch-notification-${item.key}`}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-[#d63bf2]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform pointer-events-none ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacySettings && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setShowPrivacySettings(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
              </div>
              
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-[#F2F4F6]">
                <Shield className="w-6 h-6 text-[#191F28]" />
                <h3 className="text-[19px] font-bold text-[#191F28]">개인정보 보호</h3>
              </div>
            </div>
            
            <div className="px-5 py-4 space-y-1">
              {[
                { key: "profileVisible", label: "프로필 공개", desc: "다른 사용자에게 프로필 공개" },
                { key: "locationShare", label: "위치 공유", desc: "상대방에게 위치 공유 허용" },
                { key: "readReceipt", label: "읽음 표시", desc: "메시지 읽음 표시 보내기" },
                { key: "onlineStatus", label: "온라인 상태", desc: "접속 상태 표시하기" },
                { key: "activityShare", label: "활동 공유", desc: "앱 활동 내역 공유" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[#4E5968]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#191F28]">{item.label}</p>
                      <p className="text-[13px] text-[#8B95A1]">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={privacy[item.key as keyof typeof privacy]}
                    onClick={() => updateSetting(privacyKeyMap[item.key], !privacy[item.key as keyof typeof privacy])}
                    data-testid={`switch-privacy-${item.key}`}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      privacy[item.key as keyof typeof privacy] ? "bg-[#d63bf2]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform pointer-events-none ${
                        privacy[item.key as keyof typeof privacy] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Support/Customer Service Modal */}
      {showSupportSettings && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setShowSupportSettings(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
              </div>
              
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-[#F2F4F6]">
                <HelpCircle className="w-6 h-6 text-[#191F28]" />
                <h3 className="text-[19px] font-bold text-[#191F28]">고객센터</h3>
              </div>
            </div>
            
            <div className="px-5 py-4 space-y-1">
              {[
                { key: "newsletter", label: "뉴스레터 수신", desc: "새로운 기능 및 업데이트 소식" },
                { key: "eventNotify", label: "이벤트 알림", desc: "프로모션 및 이벤트 알림" },
                { key: "feedback", label: "피드백 요청", desc: "앱 개선을 위한 설문 참여" },
                { key: "survey", label: "만족도 조사", desc: "서비스 만족도 조사 참여" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F6] flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#4E5968]" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#191F28]">{item.label}</p>
                      <p className="text-[13px] text-[#8B95A1]">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={support[item.key as keyof typeof support]}
                    onClick={() => updateSetting(supportKeyMap[item.key], !support[item.key as keyof typeof support])}
                    data-testid={`switch-support-${item.key}`}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      support[item.key as keyof typeof support] ? "bg-[#d63bf2]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform pointer-events-none ${
                        support[item.key as keyof typeof support] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
              
              {/* Quick Links */}
              <div className="pt-4 mt-4 border-t border-[#F2F4F6] space-y-2">
                <button 
                  data-testid="button-faq" 
                  onClick={() => { setShowSupportSettings(false); setShowFaq(true); }}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors"
                >
                  <span className="text-[14px] font-medium text-[#191F28]">자주 묻는 질문 (FAQ)</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button 
                  data-testid="button-contact" 
                  onClick={() => router.push("/chatbot")}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors"
                >
                  <span className="text-[14px] font-medium text-[#191F28]">1:1 문의하기 (AI 상담)</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button 
                  data-testid="button-terms" 
                  onClick={() => router.push("/terms")}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] dark:bg-gray-800 rounded-[12px] hover:bg-[#F2F4F6] dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-[14px] font-medium text-[#191F28] dark:text-white">이용약관</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button 
                  data-testid="button-privacy-policy" 
                  onClick={() => router.push("/privacy")}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] dark:bg-gray-800 rounded-[12px] hover:bg-[#F2F4F6] dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-[14px] font-medium text-[#191F28] dark:text-white">개인정보 처리방침</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
              </div>
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaq && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={() => setShowFaq(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 rounded-t-[24px]">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#E5E8EB] rounded-full" />
              </div>
              
              <div className="flex items-center gap-3 px-5 pb-4 border-b border-[#F2F4F6]">
                <button
                  onClick={() => { setShowFaq(false); setShowSupportSettings(true); }}
                  data-testid="button-faq-back"
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#4E5968]" />
                </button>
                <HelpCircle className="w-6 h-6 text-[#191F28]" />
                <h3 className="text-[19px] font-bold text-[#191F28]">자주 묻는 질문</h3>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-[#F2F4F6]">
                    <AccordionTrigger 
                      className="text-[15px] font-semibold text-[#191F28] hover:no-underline py-4"
                      data-testid={`faq-question-${idx}`}
                    >
                      <span className="flex items-start gap-2 text-left">
                        <span className="text-[#d63bf2] font-bold shrink-0">Q.</span>
                        {item.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent 
                      className="text-[14px] text-[#4E5968] leading-relaxed pl-6"
                      data-testid={`faq-answer-${idx}`}
                    >
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

    </>
  )
}
