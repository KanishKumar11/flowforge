import { vi } from "vitest";
import type { PrismaClient } from "@/generated/prisma";

// Create a mock Prisma client using vi.fn()
const createMockPrisma = () => {
  const mockModel = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  };

  return {
    user: { ...mockModel },
    credential: { ...mockModel },
    workflow: { ...mockModel },
    schedule: { ...mockModel },
    execution: { ...mockModel },
    auditLog: { ...mockModel },
    team: { ...mockModel },
    teamMember: { ...mockModel },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $transaction: vi.fn(),
  } as unknown as PrismaClient;
};

export const prismaMock = createMockPrisma();

// Reset the mock before each test
export function resetPrismaMock() {
  Object.values(prismaMock).forEach((value: any) => {
    if (value && typeof value === "object") {
      Object.values(value).forEach((fn: any) => {
        if (typeof fn === "function" && fn.mockReset) {
          fn.mockReset();
        }
      });
    }
  });
}

// Helper to mock Prisma find operations
export function mockPrismaFind<T>(model: string, result: T | T[] | null) {
  const modelMock = (prismaMock as any)[model];
  if (!modelMock) return;

  if (Array.isArray(result)) {
    modelMock.findMany.mockResolvedValue(result);
  } else {
    modelMock.findFirst.mockResolvedValue(result);
    modelMock.findUnique.mockResolvedValue(result);
  }
}

// Helper to mock Prisma create operations
export function mockPrismaCreate<T>(model: string, result: T) {
  const modelMock = (prismaMock as any)[model];
  if (!modelMock) return;
  modelMock.create.mockResolvedValue(result);
}

// Helper to mock Prisma update operations
export function mockPrismaUpdate<T>(model: string, result: T) {
  const modelMock = (prismaMock as any)[model];
  if (!modelMock) return;
  modelMock.update.mockResolvedValue(result);
}

// Helper to mock Prisma delete operations
export function mockPrismaDelete<T>(model: string, result: T) {
  const modelMock = (prismaMock as any)[model];
  if (!modelMock) return;
  modelMock.delete.mockResolvedValue(result);
}
