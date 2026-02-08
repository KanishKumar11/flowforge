import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { createMockCredential } from "@/tests/test-factories";

// Mock database module before importing routes
vi.mock("@/lib/db", () => {
  const mockModel = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return {
    default: {
      credential: { ...mockModel },
    },
  };
});

// Mock auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

import { GET } from "@/app/api/oauth/[provider]/callback/route";
import prisma from "@/lib/db";

// Mock fetch for token exchange
global.fetch = vi.fn();

describe("OAuth Callback Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SLACK_CLIENT_ID = "test-slack-client";
    process.env.SLACK_CLIENT_SECRET = "test-slack-secret";
    process.env.GOOGLE_CLIENT_ID = "test-google-client";
    process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
    process.env.GITHUB_CLIENT_ID = "test-github-client";
    process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
    process.env.NOTION_CLIENT_ID = "test-notion-client";
    process.env.NOTION_CLIENT_SECRET = "test-notion-secret";
  });

  describe("GET /api/oauth/[provider]/callback", () => {
    it("should redirect to credentials page with error when OAuth error is present", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/callback?error=access_denied",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/credentials?error=access_denied",
      );
    });

    it("should redirect with error when code is missing", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/callback",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/credentials?error=no_code",
      );
    });

    it("should redirect with error when state is invalid", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/oauth/slack/callback?code=test-code",
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/credentials?error=invalid_state",
      );
    });

    it("should exchange code for tokens and create credential for Slack", async () => {
      const userId = "user-123";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      const mockTokenResponse = {
        access_token: "slack-access-token",
        refresh_token: "slack-refresh-token",
        expires_in: 3600,
        scope: "chat:write,channels:read",
        token_type: "Bearer",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      const mockCredential = createMockCredential({
        userId,
        provider: "slack",
        type: "oauth2",
      });

      (prisma.credential.create as any).mockResolvedValue(mockCredential);

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/slack/callback?code=test-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/credentials?success=slack",
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "https://slack.com/api/oauth.v2.access",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/x-www-form-urlencoded",
          }),
        }),
      );

      expect(prisma.credential.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: "oauth2",
          provider: "slack",
          userId,
          refreshToken: "slack-refresh-token",
          scope: "chat:write,channels:read",
        }),
      });
    });

    it("should handle Google OAuth callback correctly", async () => {
      const userId = "user-456";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      const mockTokenResponse = {
        access_token: "google-access-token",
        refresh_token: "google-refresh-token",
        expires_in: 3600,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        token_type: "Bearer",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      (prisma.credential.create as any).mockResolvedValue(
        createMockCredential({ userId, provider: "google" }),
      );

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/google/callback?code=google-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "google" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://oauth2.googleapis.com/token",
        expect.any(Object),
      );
    });

    it("should handle GitHub OAuth callback correctly", async () => {
      const userId = "user-789";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      const mockTokenResponse = {
        access_token: "github-access-token",
        scope: "repo,user",
        token_type: "bearer",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      (prisma.credential.create as any).mockResolvedValue(
        createMockCredential({ userId, provider: "github" }),
      );

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/github/callback?code=github-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "github" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://github.com/login/oauth/access_token",
        expect.any(Object),
      );
    });

    it("should handle Notion OAuth callback correctly", async () => {
      const userId = "user-101";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      const mockTokenResponse = {
        access_token: "notion-access-token",
        token_type: "bearer",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      (prisma.credential.create as any).mockResolvedValue(
        createMockCredential({ userId, provider: "notion" }),
      );

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/notion/callback?code=notion-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "notion" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.notion.com/v1/oauth/token",
        expect.any(Object),
      );
    });

    it("should redirect with error when token exchange fails", async () => {
      const userId = "user-123";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        text: async () => "Invalid client credentials",
      } as Response);

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/slack/callback?code=test-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "slack" });

      const response = await GET(request, { params });

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toContain(
        "/credentials?error=exchange_failed",
      );
    });

    it("should store token expiry when provided", async () => {
      const userId = "user-123";
      const state = Buffer.from(
        JSON.stringify({ userId, timestamp: Date.now() }),
      ).toString("base64");

      const mockTokenResponse = {
        access_token: "access-token",
        expires_in: 7200, // 2 hours
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      } as Response);

      (prisma.credential.create as any).mockResolvedValue(
        createMockCredential({ userId }),
      );

      const request = new NextRequest(
        `http://localhost:3000/api/oauth/slack/callback?code=test-code&state=${state}`,
      );
      const params = Promise.resolve({ provider: "slack" });

      await GET(request, { params });

      expect(prisma.credential.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          expiresAt: expect.any(Date),
        }),
      });
    });
  });
});
