import { useState } from "react";
import { format } from "date-fns";
import { useExpenses, useCreateExpense } from "@/hooks/use-expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Loader2, DollarSign, TrendingUp, CreditCard, ShoppingBag, Utensils, Home, Car, Smartphone, Check, ChevronRight, Crown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  food: Utensils,
  bills: Home,
  transport: Car,
  entertainment: Smartphone,
  general: CreditCard,
};

export default function MarriageMode() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  
  const { data: expenses, isLoading } = useExpenses();
  const createMutation = useCreateExpense();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("general");

  const handleSubmit = async () => {
    if (!title || !amount) return;
    try {
      await createMutation.mutateAsync({
        title,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
        userId: "1",
      });
      setIsAddOpen(false);
      setTitle("");
      setAmount("");
      setCategory("general");
    } catch (e) {
      console.error(e);
    }
  };

  const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  
  const categoryData = expenses?.reduce((acc, curr) => {
    const existing = acc.find(a => a.name === curr.category);
    if (existing) {
      existing.value += Number(curr.amount);
    } else {
      acc.push({ name: curr.category, value: Number(curr.amount) });
    }
    return acc;
  }, [] as { name: string, value: number }[]) || [];

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground font-display">예산</h1>
        <p className="text-muted-foreground">공동 재정 관리</p>
      </header>

      <div className="space-y-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-foreground/80 font-medium">총 지출</span>
              <DollarSign className="w-5 h-5 text-primary-foreground/60" />
            </div>
            <div className="text-4xl font-bold tracking-tight">
              ₩{totalExpenses.toLocaleString()}
            </div>
            <div className="mt-4 flex gap-2 text-sm bg-black/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>지난달 대비 +12%</span>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">카테고리별 지출</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events / Schedule Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">다가오는 일정</h2>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">청첩장 발송</p>
                  <p className="text-sm text-muted-foreground">2025년 3월 15일</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">D-10</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">웨딩홀 미팅</p>
                  <p className="text-sm text-muted-foreground">2025년 3월 20일</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">D-15</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">최근 거래</h2>
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {expenses?.map((expense) => {
                const IconComponent = CATEGORY_ICONS[expense.category] || CreditCard;
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card p-4 rounded-xl shadow-sm border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{expense.category} • {format(new Date(expense.date), "MMM d")}</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground">-₩{Number(expense.amount).toLocaleString()}</span>
                  </motion.div>
                );
              })}
              {(!expenses || expenses.length === 0) && (
                <div className="text-center py-8 text-muted-foreground bg-accent/30 rounded-xl border border-dashed">
                  <p>지출 기록이 없습니다</p>
                  <p className="text-xs mt-1">+ 버튼을 눌러 추가하세요</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Membership CTA */}
        <div className="text-center pt-4">
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
      </div>

      <FloatingActionButton onClick={() => setIsAddOpen(true)} data-testid="fab-add-expense" />

      {/* Add Expense Modal - Same style as Home */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">지출 기록</DialogTitle>
            <DialogDescription>새로운 지출을 추가합니다</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="예: 식료품"
                data-testid="input-expense-title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">금액</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0"
                data-testid="input-expense-amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-expense-category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">일반</SelectItem>
                  <SelectItem value="food">음식</SelectItem>
                  <SelectItem value="bills">청구서</SelectItem>
                  <SelectItem value="transport">교통</SelectItem>
                  <SelectItem value="entertainment">여가</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending} 
              className="w-full h-12 text-base"
              data-testid="button-add-expense"
            >
              {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              지출 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subscription Modal */}
      <Dialog open={showSubscription} onOpenChange={(open) => { setShowSubscription(open); if(!open) setPaymentStep(false); }}>
        <DialogContent className="sm:max-w-[425px]">
          {!paymentStep ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">모든 기능 잠금해제</DialogTitle>
                <DialogDescription className="text-center">
                  결혼 준비의 모든 혜택을 누려보세요
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid gap-3">
                  {[
                    "고급 예산 분석",
                    "결혼 준비 체크리스트",
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
