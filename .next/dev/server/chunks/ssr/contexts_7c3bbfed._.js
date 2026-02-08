module.exports = [
"[project]/contexts/budget-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BudgetProvider",
    ()=>BudgetProvider,
    "useBudget",
    ()=>useBudget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const BudgetContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_KEY = "wedding_budget_data";
function BudgetProvider({ children }) {
    const [totalBudget, setTotalBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchExpenses();
        loadBudget();
    }, []);
    const loadBudget = ()=>{
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.totalBudget) {
                    setTotalBudget(data.totalBudget);
                    return;
                }
            }
            // Also check for budget from wedding onboarding
            const onboardingBudget = localStorage.getItem("wedding_budget");
            if (onboardingBudget) {
                const budget = Number(onboardingBudget);
                if (budget > 0) {
                    setTotalBudget(budget);
                    saveBudget(budget); // Save to main storage key for future use
                }
            }
        } catch (e) {
            console.error("Failed to load budget data:", e);
        }
    };
    const saveBudget = (budget)=>{
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                totalBudget: budget
            }));
        } catch (e) {
            console.error("Failed to save budget data:", e);
        }
    };
    const fetchExpenses = async ()=>{
        setIsLoading(true);
        try {
            const res = await fetch('/api/expenses?mode=wedding');
            const data = await res.json();
            setExpenses(data.map((e)=>({
                    id: String(e.id),
                    title: e.title,
                    amount: Number(e.amount),
                    category: e.category,
                    date: e.date.split('T')[0],
                    payer: 'shared',
                    status: e.isPaid ? 'paid' : 'scheduled',
                    method: 'card',
                    memo: e.memo
                })));
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally{
            setIsLoading(false);
        }
    };
    const handleSetTotalBudget = (budget)=>{
        setTotalBudget(budget);
        saveBudget(budget);
    };
    const addExpense = async (expense)=>{
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: expense.title,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    isPaid: expense.status === 'paid',
                    memo: expense.memo,
                    mode: 'wedding'
                })
            });
            const newExpense = await res.json();
            setExpenses((prev)=>[
                    {
                        id: String(newExpense.id),
                        title: newExpense.title,
                        amount: Number(newExpense.amount),
                        category: newExpense.category,
                        date: newExpense.date.split('T')[0],
                        payer: expense.payer,
                        status: newExpense.isPaid ? 'paid' : 'scheduled',
                        method: expense.method,
                        memo: newExpense.memo
                    },
                    ...prev
                ]);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };
    const updateExpense = async (id, updates)=>{
        try {
            const patchBody = {
                id: parseInt(id),
                ...updates
            };
            // Only include isPaid if status is explicitly provided
            if (updates.status !== undefined) {
                patchBody.isPaid = updates.status === 'paid';
            }
            await fetch('/api/expenses', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patchBody)
            });
            setExpenses((prev)=>prev.map((e)=>e.id === id ? {
                        ...e,
                        ...updates
                    } : e));
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };
    const deleteExpense = async (id)=>{
        try {
            await fetch(`/api/expenses?id=${id}`, {
                method: 'DELETE'
            });
            setExpenses((prev)=>prev.filter((e)=>e.id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };
    const totalPaid = expenses.filter((e)=>e.status === "paid").reduce((sum, e)=>sum + e.amount, 0);
    const totalDeposits = expenses.filter((e)=>e.status === "scheduled").reduce((sum, e)=>sum + (e.deposit || 0), 0);
    const totalSpent = totalPaid + totalDeposits;
    const totalScheduled = expenses.filter((e)=>e.status === "scheduled").reduce((sum, e)=>sum + (e.balance || e.amount), 0);
    const remaining = totalBudget - totalSpent - totalScheduled;
    const spentPercent = totalBudget > 0 ? Math.round(totalSpent / totalBudget * 100) : 0;
    const scheduledPercent = totalBudget > 0 ? Math.round(totalScheduled / totalBudget * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BudgetContext.Provider, {
        value: {
            totalBudget,
            setTotalBudget: handleSetTotalBudget,
            expenses,
            setExpenses,
            addExpense,
            updateExpense,
            deleteExpense,
            isLoading,
            totalPaid,
            totalDeposits,
            totalSpent,
            totalScheduled,
            remaining,
            spentPercent,
            scheduledPercent
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/budget-context.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
function useBudget() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BudgetContext);
    if (context === undefined) {
        throw new Error("useBudget must be used within a BudgetProvider");
    }
    return context;
}
}),
"[project]/contexts/checklist-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChecklistProvider",
    ()=>ChecklistProvider,
    "useChecklist",
    ()=>useChecklist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ChecklistContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ChecklistProvider({ children }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchChecklist();
    }, []);
    const fetchChecklist = async ()=>{
        setIsLoading(true);
        try {
            const res = await fetch('/api/checklist?mode=wedding');
            const data = await res.json();
            setItems(data.map((item)=>({
                    id: String(item.id),
                    title: item.title,
                    category: item.category,
                    dueDate: item.dueDate ? item.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    completed: item.completed,
                    priority: item.priority || 'medium'
                })));
        } catch (error) {
            console.error('Error fetching checklist:', error);
        } finally{
            setIsLoading(false);
        }
    };
    const addItem = async (item)=>{
        try {
            const res = await fetch('/api/checklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: item.title,
                    category: item.category,
                    dueDate: item.dueDate,
                    priority: item.priority,
                    mode: 'wedding'
                })
            });
            const newItem = await res.json();
            setItems((prev)=>[
                    ...prev,
                    {
                        id: String(newItem.id),
                        title: newItem.title,
                        category: newItem.category,
                        dueDate: newItem.dueDate ? newItem.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
                        completed: newItem.completed,
                        priority: newItem.priority || 'medium'
                    }
                ]);
        } catch (error) {
            console.error('Error adding checklist item:', error);
        }
    };
    const updateItem = async (id, updates)=>{
        try {
            await fetch('/api/checklist', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    ...updates
                })
            });
            setItems((prev)=>prev.map((item)=>item.id === id ? {
                        ...item,
                        ...updates
                    } : item));
        } catch (error) {
            console.error('Error updating checklist item:', error);
        }
    };
    const deleteItem = async (id)=>{
        try {
            await fetch(`/api/checklist?id=${id}`, {
                method: 'DELETE'
            });
            setItems((prev)=>prev.filter((item)=>item.id !== id));
        } catch (error) {
            console.error('Error deleting checklist item:', error);
        }
    };
    const toggleComplete = async (id)=>{
        const item = items.find((i)=>i.id === id);
        if (!item) return;
        try {
            await fetch('/api/checklist', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                    completed: !item.completed
                })
            });
            setItems((prev)=>prev.map((i)=>i.id === id ? {
                        ...i,
                        completed: !i.completed
                    } : i));
        } catch (error) {
            console.error('Error toggling checklist item:', error);
        }
    };
    const completedCount = items.filter((item)=>item.completed).length;
    const totalCount = items.length;
    const progressPercent = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChecklistContext.Provider, {
        value: {
            items,
            setItems,
            addItem,
            updateItem,
            deleteItem,
            toggleComplete,
            isLoading,
            completedCount,
            totalCount,
            progressPercent
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/checklist-context.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
function useChecklist() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ChecklistContext);
    if (context === undefined) {
        throw new Error("useChecklist must be used within a ChecklistProvider");
    }
    return context;
}
}),
];

//# sourceMappingURL=contexts_7c3bbfed._.js.map