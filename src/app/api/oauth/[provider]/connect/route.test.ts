import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/oauth/[provider]/connect/route";

// Mock auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

const mockGetSession = vi.fn();
const authModule = await import("@/lib/auth");
(vi.mocked(authModule).auth.api as any).getSession = mockGetSession;

describe("OAuth Connect Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SLACK_CLIENT_ID = "test-slack-client";
    process.env.GOOGLE_CLIENT_ID = "test-google-client";
    process.env.GITHUB_CLIENT_ID = "test-github-client";
    process.env.NOTION_CLIENT_ID = "test-notion-client";
  });

  describe("GET /api/oauth/[provider]/connect", () => {
    it("should redirect to sign-in when user is not authenticated", async () => {
      mockGetSession.mockResolvedValue(null);

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/connect",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain("/sign-in");
    });

    it("should redirect to Slack OAuth URL with correct parameters", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/connect",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain("https://slack.com/oauth/v2/authorize");
      expect(location).toContain("client_id=test-slack-client");
      expect(location).toContain("redirect_uri");
      expect(location).toContain("state=");
      expect(location).toContain("response_type=code");
      expect(location).toContain("scope=");
    });

    it("should redirect to Google OAuth URL with correct parameters", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/google/connect",
      );
      const params = Promise.resolve({ provider: "google" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain(
        "https://accounts.google.com/o/oauth2/v2/auth",
      );
      expect(location).toContain("client_id=test-google-client");
      expect(location).toContain("access_type=offline");
      expect(location).toContain("prompt=consent");
    });

    it("should redirect to GitHub OAuth URL with correct parameters", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/github/connect",
      );
      const params = Promise.resolve({ provider: "github" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain("https://github.com/login/oauth/authorize");
      expect(location).toContain("client_id=test-github-client");
      expect(location).toContain("scope=repo+user"); // URL encodes space as +
    });

    it("should redirect to Notion OAuth URL with owner=user parameter", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/notion/connect",
      );
      const params = Promise.resolve({ provider: "notion" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      const location = response.headers.get("location");
      expect(location).toContain("https://api.notion.com/v1/oauth/authorize");
      expect(location).toContain("owner=user");
    });

    it("should return 400 for unknown provider", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/unknown/connect",
      );
      const params = Promise.resolve({ provider: "unknown" });

      const response = await GET(request, { params });

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.error).toBe("Unknown provider");
    });

    it("should include userId in state parameter", async () => {
      const userId = "user-456";
      mockGetSession.mockResolvedValue({
        user: { id: userId, email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/connect",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      const location = response.headers.get("location");
      const url = new URL(location!);
      const state = url.searchParams.get("state");

      expect(state).toBeTruthy();
      const decoded = JSON.parse(
        Buffer.from(state!, "base64").toString("utf-8"),
      );
      expect(decoded.userId).toBe(userId);
      expect(decoded.timestamp).toBeDefined();
    });

    it("should use correct redirect_uri for callback", async () => {
      mockGetSession.mockResolvedValue({
        user: { id: "user-123", email: "test@example.com" },
      });

      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/connect",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      const location = response.headers.get("location");
      const url = new URL(location!);
      const redirectUri = url.searchParams.get("redirect_uri");

      expect(redirectUri).toBe(
        "http://localhost:3000/api/oauth/slack/callback",
      );
    });
  });
});
