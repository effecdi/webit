import * as client from "openid-client";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "weve_session";

let oidcConfig: client.Configuration | null = null;

async function getOIDCConfig(): Promise<client.Configuration> {
  if (oidcConfig) return oidcConfig;

  const issuerUrl = process.env.ISSUER_URL;
  if (!issuerUrl) {
    throw new Error("ISSUER_URL is not configured");
  }

  oidcConfig = await client.discovery(
    new URL(issuerUrl),
    process.env.REPL_ID!,
    undefined,
    undefined,
    {
      execute: [client.allowInsecureRequests],
    }
  );

  return oidcConfig;
}

function getCallbackUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return `${envUrl.replace(/\/+$/, "")}/api/auth/callback`;
  return "http://localhost:3000/api/auth/callback";
}

export async function startLogin(): Promise<string> {
  const config = await getOIDCConfig();
  const callbackUrl = getCallbackUrl();

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("oidc_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set("oidc_state", state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });

  const authUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: callbackUrl,
    scope: "openid email profile",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  });

  return authUrl.href;
}

export async function handleCallback(url: URL): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getOIDCConfig();
    const callbackUrl = getCallbackUrl();

    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get("oidc_code_verifier")?.value;
    const savedState = cookieStore.get("oidc_state")?.value;

    if (!codeVerifier || !savedState) {
      return { success: false, error: "Missing OIDC session data" };
    }

    const tokens = await client.authorizationCodeGrant(config, url, {
      pkceCodeVerifier: codeVerifier,
      expectedState: savedState,
    });

    const claims = tokens.claims();
    if (!claims || !claims.sub) {
      return { success: false, error: "No user claims in token" };
    }

    const userData = {
      id: claims.sub as string,
      email: (claims.email as string) || null,
      firstName: (claims.first_name as string) || (claims.given_name as string) || null,
      lastName: (claims.last_name as string) || (claims.family_name as string) || null,
      profileImageUrl: (claims.profile_image_url as string) || (claims.picture as string) || null,
    };

    await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      });

    const sessionId = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      sid: sessionId,
      sess: { userId: userData.id, claims: userData },
      expire: expiry,
    });

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    cookieStore.delete("oidc_code_verifier");
    cookieStore.delete("oidc_state");

    return { success: true };
  } catch (error) {
    console.error("OIDC callback error:", error);
    return { success: false, error: String(error) };
  }
}

export async function getAuthUser(): Promise<{
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
} | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return null;

    const sessionRows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sid, sessionId))
      .limit(1);

    if (sessionRows.length === 0) return null;

    const session = sessionRows[0];
    if (new Date(session.expire) < new Date()) {
      await db.delete(sessions).where(eq(sessions.sid, sessionId));
      return null;
    }

    const sess = session.sess as { userId: string; claims: any };
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, sess.userId))
      .limit(1);

    if (userRows.length === 0) return null;

    const user = userRows[0];
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    };
  } catch (error) {
    console.error("getAuthUser error:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.sid, sessionId));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAuthUserId(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.id || null;
}
