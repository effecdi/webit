import { useState } from "react";
import { useWidgets } from "@/hooks/use-widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Heart, Lock, Calendar, MessageCircle, Star, Bell, Shield, HelpCircle, Crown, Check, CreditCard, Smartphone, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function LoveMode() {
  const { data: widgets } = useWidgets();
  const [showSubscription, setShowSubscription] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  
  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4 shadow-sm">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl font-bold font-display text-foreground">연애 모드</h1>
        <p className="text-muted-foreground">함께한 날: <span className="text-primary font-bold">1,024일</span></p>
      </header>

      {/* Widget Grid - 4 Widgets */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Widget 1: D-Day */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
          <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-none shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-pink-100 font-medium text-sm">다음 기념일</p>
                <h3 className="text-2xl font-bold">2025년 10월 15일</h3>
              </div>
              <Calendar className="w-8 h-8 text-pink-100/50" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Widget 2: Photo Memory */}
        <motion.div whileHover={{ scale: 1.02 }} className="aspect-square">
          <Card className="h-full overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&auto=format&fit=crop&q=60" 
              alt="Memory" 
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-3 text-white">
              <p className="font-bold text-sm">추억</p>
            </div>
          </Card>
        </motion.div>

        {/* Widget 3: Couple Chat */}
        <motion.div whileHover={{ scale: 1.02 }} className="aspect-square">
          <Card className="h-full bg-blue-50 border-blue-100 flex flex-col items-center justify-center text-blue-600 gap-2 cursor-pointer hover:bg-blue-100 transition-colors">
            <MessageCircle className="w-8 h-8" />
            <span className="font-semibold text-sm">커플 채팅</span>
          </Card>
        </motion.div>

        {/* Widget 4: Premium (Locked) - Membership Only */}
        <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
          <Card className="bg-zinc-50 border-zinc-200 relative overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-[2px] z-10 flex items-center justify-center bg-white/40">
              <div className="bg-white/90 p-2 rounded-full shadow-sm">
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 opacity-50">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">프리미엄 인사이트</h3>
                  <p className="text-sm text-muted-foreground">연애 분석 잠금해제</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">다가오는 일정</h2>
        <div className="space-y-3">
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">100일 기념일</p>
                <p className="text-sm text-muted-foreground">2025년 3월 20일</p>
              </div>
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">D-15</span>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-rose-400">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">생일</p>
                <p className="text-sm text-muted-foreground">2025년 4월 5일</p>
              </div>
              <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">D-31</span>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowSubscription(true)}
          data-testid="button-view-membership"
        >
          <Crown className="w-4 h-4" />
          멤버십 옵션 보기
        </Button>
      </div>

      {/* Subscription Modal */}
      <Dialog open={showSubscription} onOpenChange={(open) => { setShowSubscription(open); if(!open) setPaymentStep(false); }}>
        <DialogContent className="sm:max-w-[425px]">
          {!paymentStep ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">모든 기능 잠금해제</DialogTitle>
                <DialogDescription className="text-center">
                  연애 관리의 모든 혜택을 누려보세요
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid gap-3">
                  {[
                    "무제한 사진 저장",
                    "고급 기념일 알림",
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
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("card")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "card" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
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
                
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("mobile")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "mobile" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
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

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPayment("kakao")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedPayment === "kakao" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
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
