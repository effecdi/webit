import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "weve_session";

function getBaseUrl(): string {
  const domain = process.env.REPLIT_DOMAINS?.split(",")[0] || process.env.REPLIT_DEV_DOMAIN;
  if (domain) return `https://${domain}`;
  return "http://localhost:5000";
}

export function getKakaoConfig() {
  return {
    clientId: process.env.KAKAO_CLIENT_ID || "",
    clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    userInfoUrl: "https://kapi.kakao.com/v2/user/me",
    redirectUri: `${getBaseUrl()}/api/auth/kakao/callback`,
  };
}

export function getGoogleConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    redirectUri: `${getBaseUrl()}/api/auth/google/callback`,
  };
}

export function getAppleConfig() {
  return {
    clientId: process.env.APPLE_CLIENT_ID || "",
    teamId: process.env.APPLE_TEAM_ID || "",
    keyId: process.env.APPLE_KEY_ID || "",
    privateKey: process.env.APPLE_PRIVATE_KEY || "",
    authUrl: "https://appleid.apple.com/auth/authorize",
    tokenUrl: "https://appleid.apple.com/auth/token",
    redirectUri: `${getBaseUrl()}/api/auth/apple/callback`,
  };
}

export async function startKakaoLogin(): Promise<string> {
  const config = getKakaoConfig();
  const state = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
    scope: "profile_nickname profile_image",
  });

  return `${config.authUrl}?${params.toString()}`;
}

export async function handleKakaoCallback(code: string, state: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return { success: false, error: "Invalid state" };
    }

    const config = getKakaoConfig();

    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code,
    };
    if (config.clientSecret) {
      tokenParams.client_secret = config.clientSecret;
    }

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Kakao token error:", err);
      return { success: false, error: "Failed to get Kakao token" };
    }

    const tokenData = await tokenRes.json();

    const userRes = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    if (!userRes.ok) {
      return { success: false, error: "Failed to get Kakao user info" };
    }

    const kakaoUser = await userRes.json();
    const kakaoAccount = kakaoUser.kakao_account || {};
    const profile = kakaoAccount.profile || {};

    const providerId = String(kakaoUser.id);
    const email = kakaoAccount.email || null;
    const nickname = profile.nickname || null;
    const profileImage = profile.profile_image_url || null;

    return await createOrUpdateUser({
      provider: "kakao",
      providerId,
      email,
      firstName: nickname,
      lastName: null,
      profileImageUrl: profileImage,
    });
  } catch (error) {
    console.error("Kakao callback error:", error);
    return { success: false, error: String(error) };
  }
}

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = crypto.createHash("sha256").update(verifier).digest();
  return hash.toString("base64url");
}

export async function startGoogleLogin(): Promise<string> {
  const config = getGoogleConfig();
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${config.authUrl}?${params.toString()}`;
}

export async function handleGoogleCallback(code: string, state: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    const codeVerifier = cookieStore.get("google_code_verifier")?.value;
    if (!savedState || savedState !== state) {
      return { success: false, error: "Invalid state" };
    }
    if (!codeVerifier) {
      return { success: false, error: "Missing PKCE code verifier" };
    }

    const config = getGoogleConfig();

    const tokenParams: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code,
      code_verifier: codeVerifier,
    };

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Google token error:", err);
      return { success: false, error: "Failed to get Google token" };
    }

    const tokenData = await tokenRes.json();

    const userRes = await fetch(config.userInfoUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return { success: false, error: "Failed to get Google user info" };
    }

    const googleUser = await userRes.json();

    return await createOrUpdateUser({
      provider: "google",
      providerId: googleUser.id,
      email: googleUser.email || null,
      firstName: googleUser.given_name || googleUser.name || null,
      lastName: googleUser.family_name || null,
      profileImageUrl: googleUser.picture || null,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    return { success: false, error: String(error) };
  }
}

export async function startAppleLogin(): Promise<string> {
  const config = getAppleConfig();
  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("apple_nonce", nonce, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code id_token",
    state,
    nonce,
    scope: "name email",
    response_mode: "form_post",
  });

  return `${config.authUrl}?${params.toString()}`;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function generateAppleClientSecret(): string {
  const config = getAppleConfig();
  const now = Math.floor(Date.now() / 1000);

  const header = base64UrlEncode(JSON.stringify({
    alg: "ES256",
    kid: config.keyId,
    typ: "JWT",
  }));

  const payload = base64UrlEncode(JSON.stringify({
    iss: config.teamId,
    iat: now,
    exp: now + 15777000,
    aud: "https://appleid.apple.com",
    sub: config.clientId,
  }));

  const privateKey = config.privateKey.replace(/\\n/g, "\n");
  const sign = crypto.createSign("SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(privateKey, "base64url");

  return `${header}.${payload}.${signature}`;
}

export async function handleAppleCallback(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    const state = formData.get("state") as string;
    const code = formData.get("code") as string;
    const idToken = formData.get("id_token") as string;
    const userStr = formData.get("user") as string;

    if (!savedState || savedState !== state) {
      return { success: false, error: "Invalid state" };
    }

    if (!code) {
      return { success: false, error: "No authorization code" };
    }

    const config = getAppleConfig();
    let clientSecret: string;
    try {
      clientSecret = generateAppleClientSecret();
    } catch (e) {
      console.error("Apple client secret generation failed:", e);
      return { success: false, error: "Apple auth configuration error" };
    }

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientId,
        client_secret: clientSecret,
        redirect_uri: config.redirectUri,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Apple token error:", err);
      return { success: false, error: "Failed to get Apple token" };
    }

    const tokenData = await tokenRes.json();
    const appleIdToken = tokenData.id_token || idToken;

    if (!appleIdToken) {
      return { success: false, error: "No Apple ID token" };
    }

    const parts = appleIdToken.split(".");
    const payloadStr = Buffer.from(parts[1], "base64url").toString("utf-8");
    const claims = JSON.parse(payloadStr);

    if (claims.iss !== "https://appleid.apple.com") {
      return { success: false, error: "Invalid Apple token issuer" };
    }
    if (claims.aud !== config.clientId) {
      return { success: false, error: "Invalid Apple token audience" };
    }
    const savedNonce = cookieStore.get("apple_nonce")?.value;
    if (savedNonce && claims.nonce !== savedNonce) {
      return { success: false, error: "Invalid Apple token nonce" };
    }
    if (claims.exp && claims.exp * 1000 < Date.now()) {
      return { success: false, error: "Apple token expired" };
    }

    let firstName = null;
    let lastName = null;
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        firstName = userData.name?.firstName || null;
        lastName = userData.name?.lastName || null;
      } catch {}
    }

    return await createOrUpdateUser({
      provider: "apple",
      providerId: claims.sub,
      email: claims.email || null,
      firstName,
      lastName,
      profileImageUrl: null,
    });
  } catch (error) {
    console.error("Apple callback error:", error);
    return { success: false, error: String(error) };
  }
}

async function createOrUpdateUser(data: {
  provider: string;
  providerId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const existingUsers = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, data.provider), eq(users.providerId, data.providerId)))
      .limit(1);

    let userId: string;

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id;
      await db
        .update(users)
        .set({
          email: data.email || existingUsers[0].email,
          firstName: data.firstName || existingUsers[0].firstName,
          lastName: data.lastName || existingUsers[0].lastName,
          profileImageUrl: data.profileImageUrl || existingUsers[0].profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      if (data.email) {
        const emailUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, data.email))
          .limit(1);

        if (emailUsers.length > 0) {
          userId = emailUsers[0].id;
          await db
            .update(users)
            .set({
              provider: data.provider,
              providerId: data.providerId,
              firstName: data.firstName || emailUsers[0].firstName,
              lastName: data.lastName || emailUsers[0].lastName,
              profileImageUrl: data.profileImageUrl || emailUsers[0].profileImageUrl,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        } else {
          const newId = crypto.randomUUID();
          await db.insert(users).values({
            id: newId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            profileImageUrl: data.profileImageUrl,
            provider: data.provider,
            providerId: data.providerId,
            updatedAt: new Date(),
          });
          userId = newId;
        }
      } else {
        const newId = crypto.randomUUID();
        await db.insert(users).values({
          id: newId,
          email: null,
          firstName: data.firstName,
          lastName: data.lastName,
          profileImageUrl: data.profileImageUrl,
          provider: data.provider,
          providerId: data.providerId,
          updatedAt: new Date(),
        });
        userId = newId;
      }
    }

    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      sid: sessionId,
      sess: {
        userId,
        claims: {
          id: userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          profileImageUrl: data.profileImageUrl,
        },
      },
      expire: expiry,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    cookieStore.delete("oauth_state");
    cookieStore.delete("apple_nonce");
    cookieStore.delete("google_code_verifier");

    return { success: true };
  } catch (error) {
    console.error("createOrUpdateUser error:", error);
    return { success: false, error: String(error) };
  }
}
