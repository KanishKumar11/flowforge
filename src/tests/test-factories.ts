import type { User, Credential } from "@/generated/prisma";

// Factory functions for creating test data

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    plan: "free",
    ...overrides,
  };
}

export function createMockCredential(
  overrides?: Partial<Credential>,
): Credential {
  return {
    id: "test-credential-id",
    name: "Test Credential",
    type: "oauth2",
    provider: "slack",
    data: JSON.stringify({ accessToken: "test-token" }),
    userId: "test-user-id",
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    refreshToken: "test-refresh-token",
    scope: "chat:write,channels:read",
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUsedAt: null,
    ...overrides,
  };
}

export function createMockOAuthTokenResponse(overrides?: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
}) {
  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    scope: "read write",
    token_type: "Bearer",
    ...overrides,
  };
}

export function createMockSession(overrides?: {
  userId?: string;
  email?: string;
  name?: string;
}) {
  return {
    user: {
      id: overrides?.userId || "test-user-id",
      email: overrides?.email || "test@example.com",
      name: overrides?.name || "Test User",
    },
    session: {
      userId: overrides?.userId || "test-user-id",
      expiresAt: new Date(Date.now() + 86400000), // 24 hours
    },
  };
}
