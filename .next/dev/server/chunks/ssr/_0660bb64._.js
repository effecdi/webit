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
const initialExpenses = [
    {
        id: "1",
        title: "빌라 드 지디 계약금",
        amount: 3000000,
        category: "예식장",
        date: "2025-01-15",
        payer: "groom",
        status: "paid",
        method: "transfer"
    },
    {
        id: "2",
        title: "드레스 가봉 비용",
        amount: 500000,
        category: "드레스",
        date: "2025-01-20",
        payer: "bride",
        status: "paid",
        method: "card"
    },
    {
        id: "3",
        title: "스튜디오 촬영 예약금",
        amount: 800000,
        category: "스튜디오",
        date: "2025-01-25",
        payer: "shared",
        status: "paid",
        method: "transfer"
    },
    {
        id: "4",
        title: "빌라 드 지디 잔금",
        amount: 5000000,
        category: "예식장",
        date: "2025-02-15",
        payer: "groom",
        status: "scheduled",
        deposit: 1000000,
        balance: 4000000,
        dueDate: "2025-05-01",
        reminder: true
    },
    {
        id: "5",
        title: "헤어메이크업",
        amount: 300000,
        category: "드레스",
        date: "2025-01-28",
        payer: "bride",
        status: "paid",
        method: "card"
    },
    {
        id: "6",
        title: "예물 반지",
        amount: 2500000,
        category: "예물",
        date: "2025-02-01",
        payer: "groom",
        status: "paid",
        method: "card"
    },
    {
        id: "7",
        title: "허니문 항공권",
        amount: 1800000,
        category: "허니문",
        date: "2025-02-05",
        payer: "shared",
        status: "scheduled",
        deposit: 500000,
        balance: 1300000,
        dueDate: "2025-06-01",
        reminder: true
    }
];
function BudgetProvider({ children }) {
    const [totalBudget, setTotalBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(28500000);
    const [expenses, setExpenses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialExpenses);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.totalBudget) setTotalBudget(data.totalBudget);
                if (data.expenses) setExpenses(data.expenses);
            }
        } catch (e) {
            console.error("Failed to load budget data:", e);
        }
        setIsLoaded(true);
    }, []);
    // Save to localStorage on changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    totalBudget,
                    expenses
                }));
            } catch (e) {
                console.error("Failed to save budget data:", e);
            }
        }
    }, [
        totalBudget,
        expenses,
        isLoaded
    ]);
    // Helper functions
    const addExpense = (expense)=>{
        setExpenses((prev)=>[
                expense,
                ...prev
            ]);
    };
    const updateExpense = (id, updates)=>{
        setExpenses((prev)=>prev.map((e)=>e.id === id ? {
                    ...e,
                    ...updates
                } : e));
    };
    const deleteExpense = (id)=>{
        setExpenses((prev)=>prev.filter((e)=>e.id !== id));
    };
    // Calculated values
    const totalPaid = expenses.filter((e)=>e.status === "paid").reduce((sum, e)=>sum + e.amount, 0);
    const totalDeposits = expenses.filter((e)=>e.status === "scheduled").reduce((sum, e)=>sum + (e.deposit || 0), 0);
    const totalSpent = totalPaid + totalDeposits;
    const totalScheduled = expenses.filter((e)=>e.status === "scheduled").reduce((sum, e)=>sum + (e.balance || 0), 0);
    const remaining = totalBudget - totalSpent - totalScheduled;
    const spentPercent = totalBudget > 0 ? Math.round(totalSpent / totalBudget * 100) : 0;
    const scheduledPercent = totalBudget > 0 ? Math.round(totalScheduled / totalBudget * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BudgetContext.Provider, {
        value: {
            totalBudget,
            setTotalBudget,
            expenses,
            setExpenses,
            addExpense,
            updateExpense,
            deleteExpense,
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
        lineNumber: 107,
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
const defaultItems = [
    {
        id: "1",
        title: "웨딩홀 투어 예약",
        category: "예식장",
        dueDate: "2025-02-15",
        completed: true,
        priority: "high"
    },
    {
        id: "2",
        title: "웨딩홀 계약",
        category: "예식장",
        dueDate: "2025-02-28",
        completed: true,
        priority: "high"
    },
    {
        id: "3",
        title: "드레스 가봉 1차",
        category: "드레스",
        dueDate: "2025-03-10",
        completed: true,
        priority: "medium"
    },
    {
        id: "4",
        title: "스튜디오 촬영 예약",
        category: "스튜디오",
        dueDate: "2025-03-15",
        completed: false,
        priority: "high"
    },
    {
        id: "5",
        title: "청첩장 문구 작성",
        category: "청첩장",
        dueDate: "2025-03-20",
        completed: false,
        priority: "medium"
    },
    {
        id: "6",
        title: "허니문 항공권 예약",
        category: "허니문",
        dueDate: "2025-04-01",
        completed: false,
        priority: "medium"
    },
    {
        id: "7",
        title: "예물 구매",
        category: "예물",
        dueDate: "2025-04-15",
        completed: false,
        priority: "low"
    },
    {
        id: "8",
        title: "드레스 가봉 2차",
        category: "드레스",
        dueDate: "2025-05-01",
        completed: false,
        priority: "medium"
    },
    {
        id: "9",
        title: "본식 스냅 작가 섭외",
        category: "스냅",
        dueDate: "2025-05-10",
        completed: false,
        priority: "high"
    },
    {
        id: "10",
        title: "혼수 가전 구매",
        category: "혼수",
        dueDate: "2025-05-20",
        completed: false,
        priority: "low"
    }
];
const ChecklistContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ChecklistProvider({ children }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultItems);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("wedding-checklist");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse checklist data", e);
            }
        }
        setIsLoaded(true);
    }, []);
    // Save to localStorage on change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isLoaded) {
            localStorage.setItem("wedding-checklist", JSON.stringify(items));
        }
    }, [
        items,
        isLoaded
    ]);
    const addItem = (item)=>{
        const newItem = {
            ...item,
            id: Date.now().toString()
        };
        setItems([
            ...items,
            newItem
        ]);
    };
    const updateItem = (id, updates)=>{
        setItems(items.map((item)=>item.id === id ? {
                ...item,
                ...updates
            } : item));
    };
    const deleteItem = (id)=>{
        setItems(items.filter((item)=>item.id !== id));
    };
    const toggleComplete = (id)=>{
        setItems(items.map((item)=>item.id === id ? {
                ...item,
                completed: !item.completed
            } : item));
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
            completedCount,
            totalCount,
            progressPercent
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/checklist-context.tsx",
        lineNumber: 95,
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
"[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_0660bb64._.js.map