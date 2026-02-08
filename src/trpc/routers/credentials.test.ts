import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMockCredential, createMockUser } from "@/tests/test-factories";

// Mock auth module FIRST - must be before any imports that use it
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

// Mock database module
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

// Mock polar client
vi.mock("@/lib/polar", () => ({
  polarClient: {
    customers: {
      getStateExternal: vi.fn(),
    },
  },
}));

// Now import after mocks
import { credentialsRouter } from "@/trpc/routers/credentials";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

describe("Credentials Router", () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock auth to return a valid session
    (auth.api.getSession as any).mockResolvedValue({
      user: mockUser,
      session: { userId: mockUser.id },
    });
  });

  describe("list", () => {
    it("should return all credentials for the current user", async () => {
      const mockCredentials = [
        createMockCredential({ userId: mockUser.id, provider: "slack" }),
        createMockCredential({
          id: "cred-2",
          userId: mockUser.id,
          provider: "google",
        }),
      ];

      (prisma.credential.findMany as any).mockResolvedValue(mockCredentials);

      const caller = credentialsRouter.createCaller({});
      const result = await caller.list();

      expect(result).toHaveLength(2);
      expect(prisma.credential.findMany).toHaveBeenCalled();
    });

    it("should return empty array when user has no credentials", async () => {
      (prisma.credential.findMany as any).mockResolvedValue([]);

      const caller = credentialsRouter.createCaller({});
      const result = await caller.list();

      expect(result).toHaveLength(0);
    });
  });

  describe("get", () => {
    it("should return a credential by ID for the current user", async () => {
      const mockCredential = createMockCredential({ userId: mockUser.id });
      (prisma.credential.findFirst as any).mockResolvedValue(mockCredential);

      const caller = credentialsRouter.createCaller({});
      const result = await caller.get({ id: mockCredential.id });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockCredential.id);
    });

    it("should throw error when credential is not found", async () => {
      (prisma.credential.findFirst as any).mockResolvedValue(null);

      const caller = credentialsRouter.createCaller({});

      await expect(caller.get({ id: "non-existent" })).rejects.toThrow(
        "Credential not found",
      );
    });
  });

  describe("create", () => {
    it("should create a new credential", async () => {
      const newCredential = {
        name: "My Slack Credential",
        type: "oauth2" as const,
        provider: "slack",
        data: { accessToken: "test-token" },
      };

      const mockCreatedCredential = createMockCredential({
        ...newCredential,
        userId: mockUser.id,
      });

      (prisma.credential.create as any).mockResolvedValue(mockCreatedCredential);

      const caller = credentialsRouter.createCaller({});
      const result = await caller.create(newCredential);

      expect(result.id).toBe(mockCreatedCredential.id);
      expect(prisma.credential.create).toHaveBeenCalled();
    });

    it("should validate credential name is not empty", async () => {
      const invalidCredential = {
        name: "",
        type: "oauth2" as const,
        provider: "slack",
        data: { token: "test" },
      };

      const caller = credentialsRouter.createCaller({});

      await expect(caller.create(invalidCredential)).rejects.toThrow();
    });

    it("should validate credential type enum", async () => {
      const invalidCredential = {
        name: "Test",
        type: "invalid" as any,
        provider: "slack",
        data: { token: "test" },
      };

      const caller = credentialsRouter.createCaller({});

      await expect(caller.create(invalidCredential)).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update credential name", async () => {
      const existingCredential = createMockCredential({ userId: mockUser.id });
      const updatedName = "Updated Name";

      (prisma.credential.findFirst as any).mockResolvedValue(existingCredential);
      (prisma.credential.update as any).mockResolvedValue({
        ...existingCredential,
        name: updatedName,
      });

      const caller = credentialsRouter.createCaller({});
      const result = await caller.update({
        id: existingCredential.id,
        name: updatedName,
      });

      expect(result.name).toBe(updatedName);
    });

    it("should throw error when updating non-existent credential", async () => {
      (prisma.credential.findFirst as any).mockResolvedValue(null);

      const caller = credentialsRouter.createCaller({});

      await expect(
        caller.update({ id: "non-existent", name: "New Name" }),
      ).rejects.toThrow("Credential not found");
    });
  });

  describe("delete", () => {
    it("should delete a credential by ID", async () => {
      const credential = createMockCredential({ userId: mockUser.id });

      (prisma.credential.findFirst as any).mockResolvedValue(credential);
      (prisma.credential.delete as any).mockResolvedValue(credential);

      const caller = credentialsRouter.createCaller({});
      await caller.delete({ id: credential.id });

      expect(prisma.credential.delete).toHaveBeenCalledWith({
        where: { id: credential.id },
      });
    });

    it("should throw error when deleting non-existent credential", async () => {
      (prisma.credential.findFirst as any).mockResolvedValue(null);

      const caller = credentialsRouter.createCaller({});

      await expect(caller.delete({ id: "non-existent" })).rejects.toThrow(
        "Credential not found",
      );
    });
  });

  describe("getDecrypted", () => {
    it("should return decrypted credential data", async () => {
      const credentialData = { accessToken: "secret-token", apiKey: "key123" };
      const credential = createMockCredential({
        userId: mockUser.id,
        data: JSON.stringify(credentialData),
      });

      (prisma.credential.findFirst as any).mockResolvedValue(credential);
      (prisma.credential.update as any).mockResolvedValue(credential);

      const caller = credentialsRouter.createCaller({});
      const result = await caller.getDecrypted({ id: credential.id });

      expect(result.data).toEqual(credentialData);
    });

    it("should throw error when credential not found", async () => {
      (prisma.credential.findFirst as any).mockResolvedValue(null);

      const caller = credentialsRouter.createCaller({});

      await expect(
        caller.getDecrypted({ id: "non-existent" }),
      ).rejects.toThrow("Credential not found");
    });

    it("should update lastUsedAt when getting decrypted data", async () => {
      const credential = createMockCredential({ userId: mockUser.id });

      (prisma.credential.findFirst as any).mockResolvedValue(credential);
      (prisma.credential.update as any).mockResolvedValue(credential);

      const caller = credentialsRouter.createCaller({});
      await caller.getDecrypted({ id: credential.id });

      expect(prisma.credential.update).toHaveBeenCalledWith({
        where: { id: credential.id },
        data: { lastUsedAt: expect.any(Date) },
      });
    });
  });

  describe("unauthorized access", () => {
    it("should throw unauthorized error when no session", async () => {
      (auth.api.getSession as any).mockResolvedValue(null);

      const caller = credentialsRouter.createCaller({});

      await expect(caller.list()).rejects.toThrow("Unauthorized");
    });
  });
});
