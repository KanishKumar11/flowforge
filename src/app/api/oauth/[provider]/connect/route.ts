import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Initiates OAuth2 flow for a provider
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  // Get current user session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const userId = session.user.id;

  // Build state for callback verification
  const state = Buffer.from(
    JSON.stringify({ userId, timestamp: Date.now() })
  ).toString("base64");

  // OAuth config per provider
  const configs: Record<string, { authUrl: string; clientId: string; scopes: string[] }> = {
    slack: {
      authUrl: "https://slack.com/oauth/v2/authorize",
      clientId: process.env.SLACK_CLIENT_ID || "",
      scopes: ["chat:write", "channels:read", "channels:join"],
    },
    google: {
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.file",
      ],
    },
    github: {
      authUrl: "https://github.com/login/oauth/authorize",
      clientId: process.env.GITHUB_CLIENT_ID || "",
      scopes: ["repo", "user"],
    },
    notion: {
      authUrl: "https://api.notion.com/v1/oauth/authorize",
      clientId: process.env.NOTION_CLIENT_ID || "",
      scopes: [], // Notion uses owner=user
    },
  };

  const config = configs[provider];
  if (!config) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const redirectUri = new URL(`/api/oauth/${provider}/callback`, request.url).toString();

  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("response_type", "code");

  if (config.scopes.length > 0) {
    // Slack uses 'scope', others use 'scope' or 'scopes'
    if (provider === "slack") {
      authUrl.searchParams.set("scope", config.scopes.join(","));
    } else {
      authUrl.searchParams.set("scope", config.scopes.join(" "));
    }
  }

  // Notion specific
  if (provider === "notion") {
    authUrl.searchParams.set("owner", "user");
  }

  // Google specific - request refresh token
  if (provider === "google") {
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");
  }

  return NextResponse.redirect(authUrl.toString());
}
