(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/invitation-layouts/use-preview-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePreviewState",
    ()=>usePreviewState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function usePreviewState(data) {
    _s();
    const allPhotos = [
        data.coverImage,
        ...data.mainPhotos || []
    ].filter(Boolean);
    const galleryImages = data.galleryImages?.filter(Boolean) || [];
    const [currentSlide, setCurrentSlide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showContact, setShowContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPhotoViewer, setShowPhotoViewer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewerIndex, setViewerIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showGuestbookForm, setShowGuestbookForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [guestbookName, setGuestbookName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [guestbookMessage, setGuestbookMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [guestbookEntries, setGuestbookEntries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [copiedToast, setCopiedToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [expandedAccordion, setExpandedAccordion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const slideInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const coverStyle = data.coverDisplayStyle || "slide";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePreviewState.useEffect": ()=>{
            if (allPhotos.length <= 1 || coverStyle === "static") return;
            slideInterval.current = setInterval({
                "usePreviewState.useEffect": ()=>{
                    setCurrentSlide({
                        "usePreviewState.useEffect": (prev)=>(prev + 1) % allPhotos.length
                    }["usePreviewState.useEffect"]);
                }
            }["usePreviewState.useEffect"], 3000);
            return ({
                "usePreviewState.useEffect": ()=>{
                    if (slideInterval.current) clearInterval(slideInterval.current);
                }
            })["usePreviewState.useEffect"];
        }
    }["usePreviewState.useEffect"], [
        allPhotos.length,
        coverStyle
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePreviewState.useEffect": ()=>{
            if (!data.weddingDate) return;
            const updateCountdown = {
                "usePreviewState.useEffect.updateCountdown": ()=>{
                    const now = new Date().getTime();
                    const target = new Date(data.weddingDate).getTime();
                    const diff = Math.max(0, target - now);
                    setCountdown({
                        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                        hours: Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
                        minutes: Math.floor(diff % (1000 * 60 * 60) / (1000 * 60)),
                        seconds: Math.floor(diff % (1000 * 60) / 1000)
                    });
                }
            }["usePreviewState.useEffect.updateCountdown"];
            updateCountdown();
            const timer = setInterval(updateCountdown, 1000);
            return ({
                "usePreviewState.useEffect": ()=>clearInterval(timer)
            })["usePreviewState.useEffect"];
        }
    }["usePreviewState.useEffect"], [
        data.weddingDate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePreviewState.useEffect": ()=>{
            const loadGuestbook = {
                "usePreviewState.useEffect.loadGuestbook": async ()=>{
                    try {
                        const res = await fetch("/api/invitation/guestbook?userId=default");
                        if (res.ok) {
                            const entries = await res.json();
                            if (Array.isArray(entries)) setGuestbookEntries(entries);
                        }
                    } catch  {}
                }
            }["usePreviewState.useEffect.loadGuestbook"];
            loadGuestbook();
        }
    }["usePreviewState.useEffect"], []);
    const copyToClipboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[copyToClipboard]": (text, label)=>{
            navigator.clipboard.writeText(text).then({
                "usePreviewState.useCallback[copyToClipboard]": ()=>{
                    setCopiedToast(`${label} 복사되었습니다.`);
                    setTimeout({
                        "usePreviewState.useCallback[copyToClipboard]": ()=>setCopiedToast("")
                    }["usePreviewState.useCallback[copyToClipboard]"], 2000);
                }
            }["usePreviewState.useCallback[copyToClipboard]"]).catch({
                "usePreviewState.useCallback[copyToClipboard]": ()=>{}
            }["usePreviewState.useCallback[copyToClipboard]"]);
        }
    }["usePreviewState.useCallback[copyToClipboard]"], []);
    const copyLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[copyLink]": ()=>{
            const url = window.location.origin + "/invitation/preview";
            navigator.clipboard.writeText(url).then({
                "usePreviewState.useCallback[copyLink]": ()=>{
                    setCopiedToast("링크가 복사되었습니다.");
                    setTimeout({
                        "usePreviewState.useCallback[copyLink]": ()=>setCopiedToast("")
                    }["usePreviewState.useCallback[copyLink]"], 2000);
                }
            }["usePreviewState.useCallback[copyLink]"]).catch({
                "usePreviewState.useCallback[copyLink]": ()=>{}
            }["usePreviewState.useCallback[copyLink]"]);
        }
    }["usePreviewState.useCallback[copyLink]"], []);
    const submitGuestbook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[submitGuestbook]": async ()=>{
            if (!guestbookName.trim() || !guestbookMessage.trim()) return;
            const entry = {
                name: guestbookName.trim(),
                message: guestbookMessage.trim(),
                date: new Date().toISOString().split("T")[0]
            };
            try {
                await fetch("/api/invitation/guestbook", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: "default",
                        entry
                    })
                });
            } catch  {}
            setGuestbookEntries({
                "usePreviewState.useCallback[submitGuestbook]": (prev)=>[
                        entry,
                        ...prev
                    ]
            }["usePreviewState.useCallback[submitGuestbook]"]);
            setGuestbookName("");
            setGuestbookMessage("");
            setShowGuestbookForm(false);
        }
    }["usePreviewState.useCallback[submitGuestbook]"], [
        guestbookName,
        guestbookMessage
    ]);
    const formatWeddingDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[formatWeddingDate]": ()=>{
            if (!data.weddingDate) return "";
            const d = new Date(data.weddingDate);
            return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
        }
    }["usePreviewState.useCallback[formatWeddingDate]"], [
        data.weddingDate
    ]);
    const formatWeddingTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[formatWeddingTime]": ()=>{
            if (!data.time) return "";
            return data.time;
        }
    }["usePreviewState.useCallback[formatWeddingTime]"], [
        data.time
    ]);
    const getMonthAbbr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[getMonthAbbr]": ()=>{
            if (!data.weddingDate) return "";
            const months = [
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC"
            ];
            return months[new Date(data.weddingDate).getMonth()];
        }
    }["usePreviewState.useCallback[getMonthAbbr]"], [
        data.weddingDate
    ]);
    const getDayNum = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[getDayNum]": ()=>{
            if (!data.weddingDate) return "";
            return String(new Date(data.weddingDate).getDate());
        }
    }["usePreviewState.useCallback[getDayNum]"], [
        data.weddingDate
    ]);
    const getCalendarData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePreviewState.useCallback[getCalendarData]": ()=>{
            if (!data.weddingDate) return null;
            const d = new Date(data.weddingDate);
            const year = d.getFullYear();
            const month = d.getMonth();
            const weddingDay = d.getDate();
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();
            const days = [];
            for(let i = 0; i < firstDay; i++)days.push(null);
            for(let i = 1; i <= lastDate; i++)days.push(i);
            const dayNames = [
                "일",
                "월",
                "화",
                "수",
                "목",
                "금",
                "토"
            ];
            const weddingDayName = dayNames[d.getDay()];
            return {
                year,
                month: month + 1,
                weddingDay,
                days,
                weddingDayName,
                dayNames
            };
        }
    }["usePreviewState.useCallback[getCalendarData]"], [
        data.weddingDate
    ]);
    const state = {
        allPhotos,
        galleryImages,
        currentSlide,
        countdown,
        showContact,
        setShowContact,
        showPhotoViewer,
        setShowPhotoViewer,
        viewerIndex,
        setViewerIndex,
        showGuestbookForm,
        setShowGuestbookForm,
        guestbookName,
        setGuestbookName,
        guestbookMessage,
        setGuestbookMessage,
        guestbookEntries,
        copiedToast,
        expandedAccordion,
        setExpandedAccordion
    };
    const helpers = {
        formatWeddingDate,
        formatWeddingTime,
        getMonthAbbr,
        getDayNum,
        getCalendarData,
        copyToClipboard,
        copyLink,
        submitGuestbook
    };
    return {
        state,
        helpers
    };
}
_s(usePreviewState, "7bkwM2b2ncl+4ebqxAuMpZmIgmo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_invitation-layouts_use-preview-state_ts_1a40957f._.js.map