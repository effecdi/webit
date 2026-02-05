import { useState } from "react";
import { format } from "date-fns";
import { useExpenses, useCreateExpense } from "@/hooks/use-expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Loader2, DollarSign, TrendingUp, CreditCard, ShoppingBag } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from "framer-motion";

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export default function MarriageMode() {
  const [isAddOpen, setIsAddOpen] = useState(false);
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
        userId: 1,
      });
      setIsAddOpen(false);
      setTitle("");
      setAmount("");
      setCategory("general");
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate totals
  const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;
  
  // Aggregate for chart
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
        <h1 className="text-3xl font-bold text-foreground font-display">Budget</h1>
        <p className="text-muted-foreground">Manage your shared finances</p>
      </header>

      <div className="space-y-6">
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary-foreground/80 font-medium">Total Spent</span>
              <DollarSign className="w-5 h-5 text-primary-foreground/60" />
            </div>
            <div className="text-4xl font-bold tracking-tight">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-4 flex gap-2 text-sm bg-black/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expenses by Category</CardTitle>
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

        {/* Expense List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          {isLoading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {expenses?.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card p-4 rounded-xl shadow-sm border flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary">
                      {expense.category === 'food' ? <ShoppingBag className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{expense.category} • {format(new Date(expense.date), "MMM d")}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">-${Number(expense.amount).toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton onClick={() => setIsAddOpen(true)} />

      {/* Add Expense Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Groceries" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="bills">Bills</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={createMutation.isPending} className="w-full">
              {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
