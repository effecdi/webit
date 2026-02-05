import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Crown, Shield, Bell, HelpCircle, CreditCard, Check, Smartphone, Wallet, ChevronRight, Settings, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [showSubscription, setShowSubscription] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [customerCenter, setCustomerCenter] = useState(false);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground font-display mb-6">프로필</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20 border-2 border-primary">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-sm text-muted-foreground">무료 회원</p>
            <Button 
              variant="link" 
              className="px-0 h-auto text-primary font-semibold"
              onClick={() => setShowSubscription(true)}
              data-testid="button-upgrade-premium"
            >
              프리미엄으로 업그레이드
            </Button>
          </div>
        </div>

        {/* Membership Subscription Card */}
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-white border-none shadow-lg mb-8">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                멤버십 구독
              </p>
              <p className="text-primary-foreground/80 text-sm">모든 위젯 잠금해제 & 무제한 저장공간</p>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-primary hover:bg-white/90 font-bold shrink-0"
              onClick={() => setShowSubscription(true)}
              data-testid="button-subscribe"
            >
              구독하기
            </Button>
          </CardContent>
        </Card>

        {/* Widget Mode Section */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              위젯 모드
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Widget 1: Calendar */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-blue-700">캘린더</span>
              </motion.div>

              {/* Widget 2: Photo */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-pink-50 border border-pink-100 flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-pink-700">갤러리</span>
              </motion.div>

              {/* Widget 3: Budget */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-green-50 border border-green-100 flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-green-700">예산</span>
              </motion.div>

              {/* Widget 4: Premium Only (Locked) */}
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center gap-2 cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[1px] z-10 flex items-center justify-center bg-white/50">
                  <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-sm font-medium text-amber-700">인사이트</span>
                <span className="text-xs text-amber-500">멤버십 전용</span>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Section - Switch Buttons */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium block">알림 설정</span>
                  <span className="text-xs text-muted-foreground">푸시 알림을 받습니다</span>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium block">개인정보 보호</span>
                  <span className="text-xs text-muted-foreground">프로필을 비공개로 설정</span>
                </div>
              </div>
              <Switch 
                checked={privacy} 
                onCheckedChange={setPrivacy}
                data-testid="switch-privacy"
              />
            </div>

            {/* Customer Center */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent text-primary">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium block">고객센터</span>
                  <span className="text-xs text-muted-foreground">문의 알림 받기</span>
                </div>
              </div>
              <Switch 
                checked={customerCenter} 
                onCheckedChange={setCustomerCenter}
                data-testid="switch-customer-center"
              />
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Subscription Modal */}
      <Dialog open={showSubscription} onOpenChange={(open) => { setShowSubscription(open); if(!open) setPaymentStep(false); }}>
        <DialogContent className="sm:max-w-[425px]">
          {!paymentStep ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">모든 기능 잠금해제</DialogTitle>
                <DialogDescription className="text-center">
                  가족 관계 관리의 모든 혜택을 누려보세요
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid gap-3">
                  {[
                    "무제한 사진 저장",
                    "고급 예산 분석",
                    "모든 위젯 사용",
                    "우선 고객지원"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-600 rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-accent/50 p-4 rounded-xl text-center">
                  <span className="text-3xl font-bold">₩4,900</span>
                  <span className="text-muted-foreground">/월</span>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full text-lg h-12" 
                  onClick={() => setPaymentStep(true)}
                  data-testid="button-subscribe-now"
                >
                  구독하기
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">결제 수단 선택</DialogTitle>
                <DialogDescription>원하시는 결제 방법을 선택해주세요</DialogDescription>
              </DialogHeader>
              <div className="py-6 grid gap-3">
                {/* Credit Card */}
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("card")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "card" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="payment-credit-card"
                >
                  <CreditCard className={`w-6 h-6 ${selectedPayment === "card" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left flex-1">
                    <p className="font-bold">신용/체크카드</p>
                    <p className="text-xs text-muted-foreground">VISA, Mastercard, 국내카드</p>
                  </div>
                  {selectedPayment === "card" && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </motion.button>
                
                {/* Mobile Payment */}
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("mobile")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "mobile" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="payment-mobile"
                >
                  <Smartphone className={`w-6 h-6 ${selectedPayment === "mobile" ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left flex-1">
                    <p className="font-bold">휴대폰 결제</p>
                    <p className="text-xs text-muted-foreground">SKT, KT, LG U+</p>
                  </div>
                  {selectedPayment === "mobile" && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </motion.button>

                {/* Kakao Pay */}
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("kakao")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "kakao" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid="payment-kakao"
                >
                  <div className={`w-6 h-6 rounded ${selectedPayment === "kakao" ? "bg-yellow-400" : "bg-yellow-300"}`} />
                  <div className="text-left flex-1">
                    <p className="font-bold">카카오페이</p>
                    <p className="text-xs text-muted-foreground">간편결제</p>
                  </div>
                  {selectedPayment === "kakao" && (
                    <div className="bg-primary text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </motion.button>
              </div>
              <DialogFooter className="flex-col gap-2">
                <Button 
                  className="w-full h-12 text-base font-bold" 
                  onClick={() => { setShowSubscription(false); setPaymentStep(false); }}
                  data-testid="button-confirm-payment"
                >
                  결제 연결하기
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setPaymentStep(false)}
                >
                  이전으로
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
