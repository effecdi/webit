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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/stripe-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStripePublishableKey",
    ()=>getStripePublishableKey,
    "getStripeSecretKey",
    ()=>getStripeSecretKey,
    "getStripeSync",
    ()=>getStripeSync,
    "getUncachableStripeClient",
    ()=>getUncachableStripeClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$stripe$40$20$2e$0$2e$0_$40$types$2b$node$40$22$2e$19$2e$8$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/stripe@20.0.0_@types+node@22.19.8/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
;
async function getCredentials() {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY ? 'repl ' + process.env.REPL_IDENTITY : process.env.WEB_REPL_RENEWAL ? 'depl ' + process.env.WEB_REPL_RENEWAL : null;
    if (!xReplitToken) {
        throw new Error('X_REPLIT_TOKEN not found for repl/depl');
    }
    const connectorName = 'stripe';
    const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
    const targetEnvironment = isProduction ? 'production' : 'development';
    const url = new URL(`https://${hostname}/api/v2/connection`);
    url.searchParams.set('include_secrets', 'true');
    url.searchParams.set('connector_names', connectorName);
    url.searchParams.set('environment', targetEnvironment);
    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'X_REPLIT_TOKEN': xReplitToken
        }
    });
    const data = await response.json();
    const connectionSettings = data.items?.[0];
    if (!connectionSettings || !connectionSettings.settings.publishable || !connectionSettings.settings.secret) {
        throw new Error(`Stripe ${targetEnvironment} connection not found`);
    }
    return {
        publishableKey: connectionSettings.settings.publishable,
        secretKey: connectionSettings.settings.secret
    };
}
async function getUncachableStripeClient() {
    const { secretKey } = await getCredentials();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$stripe$40$20$2e$0$2e$0_$40$types$2b$node$40$22$2e$19$2e$8$2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](secretKey, {
        apiVersion: '2025-08-27.basil'
    });
}
async function getStripePublishableKey() {
    const { publishableKey } = await getCredentials();
    return publishableKey;
}
async function getStripeSecretKey() {
    const { secretKey } = await getCredentials();
    return secretKey;
}
let stripeSync = null;
async function getStripeSync() {
    if (!stripeSync) {
        const { StripeSync } = await __turbopack_context__.A("[project]/node_modules/.pnpm/stripe-replit-sync@1.0.0_stripe@20.0.0_@types+node@22.19.8_/node_modules/stripe-replit-sync/dist/index.js [app-route] (ecmascript, async loader)");
        const secretKey = await getStripeSecretKey();
        stripeSync = new StripeSync({
            poolConfig: {
                connectionString: process.env.DATABASE_URL,
                max: 2
            },
            stripeSecretKey: secretKey
        });
    }
    return stripeSync;
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/stripe-init.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureStripeInitialized",
    ()=>ensureStripeInitialized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$stripe$2d$replit$2d$sync$40$1$2e$0$2e$0_stripe$40$20$2e$0$2e$0_$40$types$2b$node$40$22$2e$19$2e$8_$2f$node_modules$2f$stripe$2d$replit$2d$sync$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/stripe-replit-sync@1.0.0_stripe@20.0.0_@types+node@22.19.8_/node_modules/stripe-replit-sync/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stripe-client.ts [app-route] (ecmascript)");
;
;
let initialized = false;
let initPromise = null;
async function ensureStripeInitialized() {
    if (initialized) return;
    if (initPromise) return initPromise;
    initPromise = (async ()=>{
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            console.error('DATABASE_URL not set, skipping Stripe init');
            return;
        }
        try {
            console.log('Initializing Stripe schema...');
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$stripe$2d$replit$2d$sync$40$1$2e$0$2e$0_stripe$40$20$2e$0$2e$0_$40$types$2b$node$40$22$2e$19$2e$8_$2f$node_modules$2f$stripe$2d$replit$2d$sync$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runMigrations"])({
                databaseUrl
            });
            console.log('Stripe schema ready');
            const stripeSync = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStripeSync"])();
            const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || process.env.REPLIT_DEV_DOMAIN;
            if (domain) {
                try {
                    console.log('Setting up managed webhook...');
                    const result = await stripeSync.findOrCreateManagedWebhook(`https://${domain}/api/stripe/webhook`);
                    console.log('Webhook setup result:', JSON.stringify(result, null, 2).substring(0, 200));
                } catch (webhookErr) {
                    console.warn('Webhook setup warning (non-fatal):', webhookErr.message);
                }
            }
            stripeSync.syncBackfill().then(()=>console.log('Stripe data synced')).catch((err)=>console.error('Error syncing Stripe data:', err));
            initialized = true;
        } catch (error) {
            console.error('Failed to initialize Stripe:', error);
            initPromise = null;
        }
    })();
    return initPromise;
}
}),
"[project]/app/api/stripe/webhook/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stripe-client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$init$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stripe-init.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$init$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureStripeInitialized"])();
        const signature = request.headers.get('stripe-signature');
        if (!signature) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing stripe-signature'
            }, {
                status: 400
            });
        }
        const body = await request.arrayBuffer();
        const payload = Buffer.from(body);
        const sync = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStripeSync"])();
        await sync.processWebhook(payload, signature);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            received: true
        });
    } catch (error) {
        console.error('Webhook error:', error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Webhook processing error'
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9f174b04._.js.map