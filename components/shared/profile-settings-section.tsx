"use client"

import { useState } from "react"
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
  Crown,
  Lock,
  ChevronRight,
  X
} from "lucide-react"

interface ProfileSettingsSectionProps {
  mode: "dating" | "wedding" | "family"
}

// Widget Data
const WIDGETS = [
  {
    id: "dday",
    name: "D-Day 위젯",
    description: "홈 화면에서 D-Day 확인",
    icon: Heart,
    preview: "D+365",
    isPremium: false,
  },
  {
    id: "calendar",
    name: "캘린더 위젯",
    description: "이번 주 일정 미리보기",
    icon: Calendar,
    preview: "2월 14일 데이트",
    isPremium: false,
  },
  {
    id: "photo",
    name: "포토 위젯",
    description: "커플 사진 슬라이드쇼",
    icon: LayoutGrid,
    preview: "랜덤 사진",
    isPremium: true,
  },
  {
    id: "countdown",
    name: "카운트다운 위젯",
    description: "다음 기념일까지 남은 시간",
    icon: Clock,
    preview: "100일 D-30",
    isPremium: true,
  },
]

export function ProfileSettingsSection({ mode }: ProfileSettingsSectionProps) {
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  const [showSupportSettings, setShowSupportSettings] = useState(false)
  const [showWidgetSettings, setShowWidgetSettings] = useState(false)
  const [selectedWidget, setSelectedWidget] = useState("dday")
  
  // Notification states
  const [notifications, setNotifications] = useState({
    message: true,
    schedule: true,
    anniversary: true,
    gift: false,
    daily: false,
  })

  // Privacy states
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    locationShare: false,
    readReceipt: true,
    onlineStatus: true,
    activityShare: false,
  })

  // Support states
  const [support, setSupport] = useState({
    newsletter: true,
    eventNotify: true,
    feedback: false,
    survey: false,
  })

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
      label: "위젯 설정", 
      desc: "홈 화면 위젯 관리",
      action: () => setShowWidgetSettings(true)
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
          className="fixed inset-0 z-50 bg-black/50"
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
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications] ? "bg-[#3182F6]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
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
          className="fixed inset-0 z-50 bg-black/50"
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
                    onClick={() => setPrivacy({...privacy, [item.key]: !privacy[item.key as keyof typeof privacy]})}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      privacy[item.key as keyof typeof privacy] ? "bg-[#3182F6]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
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
          className="fixed inset-0 z-50 bg-black/50"
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
                    onClick={() => setSupport({...support, [item.key]: !support[item.key as keyof typeof support]})}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      support[item.key as keyof typeof support] ? "bg-[#3182F6]" : "bg-[#E5E8EB]"
                    }`}
                  >
                    <div 
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                        support[item.key as keyof typeof support] ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
              
              {/* Quick Links */}
              <div className="pt-4 mt-4 border-t border-[#F2F4F6] space-y-2">
                <button className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors">
                  <span className="text-[14px] font-medium text-[#191F28]">자주 묻는 질문 (FAQ)</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors">
                  <span className="text-[14px] font-medium text-[#191F28]">1:1 문의하기</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors">
                  <span className="text-[14px] font-medium text-[#191F28]">이용약관</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
                <button className="w-full flex items-center justify-between py-3 px-4 bg-[#F8F9FA] rounded-[12px] hover:bg-[#F2F4F6] transition-colors">
                  <span className="text-[14px] font-medium text-[#191F28]">개인정보 처리방침</span>
                  <ChevronRight className="w-5 h-5 text-[#B0B8C1]" />
                </button>
              </div>
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}

      {/* Widget Settings Modal */}
      {showWidgetSettings && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5"
          onClick={() => setShowWidgetSettings(false)}
        >
          <div 
            className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-4 border-b border-[#F2F4F6]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-[#191F28]" />
                  <h3 className="text-[19px] font-bold text-[#191F28]">위젯 설정</h3>
                </div>
                <button 
                  onClick={() => setShowWidgetSettings(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F2F4F6] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-[#8B95A1]" />
                </button>
              </div>
              <p className="text-[13px] text-[#8B95A1]">홈 화면에 추가할 위젯을 선택하세요</p>
            </div>
            
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {WIDGETS.map((widget) => {
                  const IconComponent = widget.icon
                  const isSelected = selectedWidget === widget.id
                  
                  return (
                    <button
                      key={widget.id}
                      onClick={() => !widget.isPremium && setSelectedWidget(widget.id)}
                      className={`relative p-4 rounded-[16px] border-2 transition-all text-left ${
                        isSelected 
                          ? "border-[#3182F6] bg-blue-50" 
                          : "border-[#E5E8EB] bg-white hover:border-[#B0B8C1]"
                      } ${widget.isPremium ? "opacity-80" : ""}`}
                    >
                      {/* Premium Badge */}
                      {widget.isPremium && (
                        <div className="absolute top-3 right-3">
                          <Crown className="w-5 h-5 text-amber-500" />
                        </div>
                      )}
                      
                      {/* Radio */}
                      <div className="absolute top-3 right-3">
                        {!widget.isPremium && (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-[#3182F6] bg-[#3182F6]" : "border-[#B0B8C1]"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        )}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        isSelected ? "bg-[#3182F6] text-white" : "bg-[#F2F4F6] text-[#4E5968]"
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <p className="text-[14px] font-bold text-[#191F28] mb-0.5">{widget.name}</p>
                      <p className="text-[12px] text-[#8B95A1] mb-3">{widget.description}</p>
                      
                      {/* Preview */}
                      <div className="bg-[#F2F4F6] rounded-[8px] py-2 px-3 text-center">
                        <span className="text-[13px] text-[#4E5968]">{widget.preview}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {/* Info Text */}
              <p className="text-center text-[12px] text-[#8B95A1] mt-4 px-4">
                위젯을 활성화한 후, 기기 홈 화면에서 WE:VE 위젯을 추가하세요
              </p>
              
              {/* Premium CTA */}
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-[16px]">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="text-[14px] font-bold text-[#191F28]">프리미엄 위젯</span>
                </div>
                <p className="text-[13px] text-[#4E5968] mb-3">
                  포토 위젯, 카운트다운 위젯은 멤버십 구독 후 이용 가능합니다
                </p>
                <button className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold text-[14px] rounded-[10px]">
                  프리미엄 구독하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
