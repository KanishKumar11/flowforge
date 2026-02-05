import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// OAuth2 callback handler for various providers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // Contains userId and redirect info
  const error = searchParams.get("error");

  if (error) {
    console.error(`OAuth error for ${provider}:`, error);
    return NextResponse.redirect(
      new URL(`/credentials?error=${encodeURIComponent(error)}`, request.url),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/credentials?error=no_code", request.url),
    );
  }

  try {
    // Decode state to get user info
    const stateData = state
      ? JSON.parse(Buffer.from(state, "base64").toString())
      : null;
    const userId = stateData?.userId;

    if (!userId) {
      return NextResponse.redirect(
        new URL("/credentials?error=invalid_state", request.url),
      );
    }

    // Exchange code for tokens based on provider
    const tokens = await exchangeCodeForTokens(provider, code, request.url);

    // Store credential
    await prisma.credential.create({
      data: {
        name: `${provider}-${Date.now()}`,
        type: "oauth2",
        provider,
        data: JSON.stringify({ accessToken: tokens.access_token }), // Encrypt in production
        userId,
        expiresAt: tokens.expires_in
          ? new Date(Date.now() + tokens.expires_in * 1000)
          : null,
        refreshToken: tokens.refresh_token || null,
        scope: tokens.scope || null,
        metadata: { tokenType: tokens.token_type },
      },
    });

    return NextResponse.redirect(
      new URL(`/credentials?success=${provider}`, request.url),
    );
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err);
    return NextResponse.redirect(
      new URL(`/credentials?error=exchange_failed`, request.url),
    );
  }
}

// Token exchange logic per provider
async function exchangeCodeForTokens(
  provider: string,
  code: string,
  redirectUrl: string,
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}> {
  const redirectUri =
    new URL(`/api/oauth/${provider}/callback`, redirectUrl).origin +
    `/api/oauth/${provider}/callback`;

  const configs: Record<
    string,
    { tokenUrl: string; clientId: string; clientSecret: string }
  > = {
    slack: {
      tokenUrl: "https://slack.com/api/oauth.v2.access",
      clientId: process.env.SLACK_CLIENT_ID || "",
      clientSecret: process.env.SLACK_CLIENT_SECRET || "",
    },
    google: {
      tokenUrl: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    notion: {
      tokenUrl: "https://api.notion.com/v1/oauth/token",
      clientId: process.env.NOTION_CLIENT_ID || "",
      clientSecret: process.env.NOTION_CLIENT_SECRET || "",
    },
  };

  const config = configs[provider];
  if (!config) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return response.json();
}
