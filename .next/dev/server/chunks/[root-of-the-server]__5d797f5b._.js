module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/shop/goods/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
const mockProducts = [
    {
        id: "p1",
        category: "appliances",
        title: "삼성 비스포크 냉장고 4도어 875L",
        brand: "삼성전자",
        thumbnailUrl: "https://placehold.co/300x300/E8F5E9/2E7D32?text=냉장고",
        linkUrl: "https://www.coupang.com",
        platform: "COUPANG",
        benefit: "카드 즉시할인 10%",
        isRecommended: true,
        originalPrice: 2890000,
        salePrice: 2490000
    },
    {
        id: "p2",
        category: "interior",
        title: "웨딩 포토 액자 프리미엄 세트 (5종)",
        brand: "르메종",
        thumbnailUrl: "https://placehold.co/300x300/FFF3E0/E65100?text=액자세트",
        linkUrl: "https://smartstore.naver.com",
        platform: "NAVER",
        benefit: "1+1 이벤트",
        isRecommended: true,
        originalPrice: 89000,
        salePrice: 59000
    },
    {
        id: "p3",
        category: "favors",
        title: "프리미엄 와인 선물세트 (레드+화이트)",
        brand: "샤또마고",
        thumbnailUrl: "https://placehold.co/300x300/F3E5F5/7B1FA2?text=와인세트",
        linkUrl: "https://www.coupang.com",
        platform: "COUPANG",
        benefit: "5% 쿠폰",
        originalPrice: 128000,
        salePrice: 98000
    },
    {
        id: "p4",
        category: "accessories",
        title: "14K 골드 커플 웨딩밴드 세트",
        brand: "골든듀",
        thumbnailUrl: "https://placehold.co/300x300/FFF8E1/F57F17?text=웨딩밴드",
        linkUrl: "https://smartstore.naver.com",
        platform: "NAVER",
        isRecommended: true,
        originalPrice: 980000,
        salePrice: 780000
    },
    {
        id: "p5",
        category: "appliances",
        title: "LG 스타일러 오브제컬렉션",
        brand: "LG전자",
        thumbnailUrl: "https://placehold.co/300x300/E3F2FD/1565C0?text=스타일러",
        linkUrl: "https://www.coupang.com",
        platform: "COUPANG",
        benefit: "무료배송 + 설치",
        originalPrice: 1890000,
        salePrice: 1590000
    },
    {
        id: "p6",
        category: "favors",
        title: "답례품 명품 타올 세트 (50개입)",
        brand: "에르메스패턴",
        thumbnailUrl: "https://placehold.co/300x300/FCE4EC/C62828?text=답례품",
        linkUrl: "https://smartstore.naver.com",
        platform: "NAVER",
        benefit: "대량구매 할인",
        originalPrice: 350000,
        salePrice: 280000
    },
    {
        id: "p7",
        category: "interior",
        title: "신혼집 무드등 LED 캔들 세트",
        brand: "루미에르",
        thumbnailUrl: "https://placehold.co/300x300/FFFDE7/F9A825?text=무드등",
        linkUrl: "https://www.coupang.com",
        platform: "COUPANG",
        originalPrice: 45000,
        salePrice: 32000
    },
    {
        id: "p8",
        category: "accessories",
        title: "스와로브스키 웨딩 티아라",
        brand: "스와로브스키",
        thumbnailUrl: "https://placehold.co/300x300/EDE7F6/4527A0?text=티아라",
        linkUrl: "https://smartstore.naver.com",
        platform: "NAVER",
        benefit: "무료 포장",
        isRecommended: true,
        originalPrice: 320000,
        salePrice: 259000
    }
];
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockProducts);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5d797f5b._.js.map