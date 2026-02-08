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
"[project]/app/api/ai/invitation-text/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$18$2e$0_ws$40$8$2e$19$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.18.0_ws@8.19.0_zod@3.25.76/node_modules/openai/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$18$2e$0_ws$40$8$2e$19$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@6.18.0_ws@8.19.0_zod@3.25.76/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
;
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$6$2e$18$2e$0_ws$40$8$2e$19$2e$0_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"]({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});
const SYSTEM_PROMPT = `당신은 한국 결혼식 청첩장 문구 전문 카피라이터입니다.
아름답고 정제된 한국어로 청첩장에 어울리는 문구를 작성합니다.
- 격식 있으면서도 따뜻한 톤
- 간결하고 우아한 표현
- 줄바꿈(\\n)으로 적절히 문단 구분
- 이모지 절대 사용 금지
- JSON 형식으로 응답: { "text": "생성된 문구" }`;
function getPrompt(type, context) {
    const names = context.groomName && context.brideName ? `신랑: ${context.groomName}, 신부: ${context.brideName}` : "";
    const dateInfo = context.date ? `날짜: ${context.date}` : "";
    const venueInfo = context.venue ? `장소: ${context.venue}` : "";
    const contextStr = [
        names,
        dateInfo,
        venueInfo
    ].filter(Boolean).join(", ");
    switch(type){
        case "title":
            return `청첩장의 제목(타이틀)을 하나만 생성해주세요. 10자 이내의 짧고 인상적인 문구여야 합니다. 예시: "소중한 날에 초대합니다", "사랑으로 하나 되는 날"${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;
        case "message":
            return `청첩장의 초대 인사말을 하나만 작성해주세요. 3~5문장 정도의 따뜻한 초대 메시지입니다. 줄바꿈(\\n)으로 적절히 구분해주세요.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;
        case "fundingMessage":
            return `축의금/펀딩 안내 문구를 하나만 작성해주세요. 하객분들께 축의금 대신 마음을 모아달라는 정중한 안내입니다. 2~3문장, 줄바꿈(\\n)으로 구분.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;
        case "fundingThanks":
            return `축의금/펀딩 감사 인사 문구를 하나만 작성해주세요. 축의금을 보내준 분께 감사하는 짧은 메시지입니다. 2~3문장, 줄바꿈(\\n)으로 구분.`;
        case "noticeTitle":
            return `청첩장의 공지사항/안내사항 섹션 제목을 하나만 생성해주세요. 5~10자 이내의 짧은 제목입니다. 예시: "안내사항", "참석 안내", "식장 안내"`;
        case "endingContent":
            return `청첩장의 엔딩(마무리) 메시지를 하나만 작성해주세요. 감사의 마음을 담은 따뜻한 마무리 인사입니다. 2~4문장, 줄바꿈(\\n)으로 구분.${contextStr ? `\n참고 정보: ${contextStr}` : ""}`;
        default:
            return "청첩장에 어울리는 문구를 하나 작성해주세요.";
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { type, context = {} } = body;
        if (!type) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "type is required"
            }, {
                status: 400
            });
        }
        const prompt = getPrompt(type, context);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: {
                type: "json_object"
            },
            max_tokens: 500
        });
        const content = response.choices[0]?.message?.content || "{}";
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch  {
            parsed = {
                text: content
            };
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            text: parsed.text || ""
        });
    } catch (error) {
        console.error("AI invitation text generation error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "AI 문구 생성에 실패했습니다. 잠시 후 다시 시도해주세요."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__693a3557._.js.map