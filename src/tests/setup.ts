import { beforeAll, afterEach, afterAll, vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// Mock Next.js headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
  cookies: vi.fn(() => Promise.resolve({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock environment variables
process.env.SLACK_CLIENT_ID = "test-slack-client-id";
process.env.SLACK_CLIENT_SECRET = "test-slack-secret";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
process.env.GITHUB_CLIENT_ID = "test-github-client-id";
process.env.GITHUB_CLIENT_SECRET = "test-github-secret";
process.env.NOTION_CLIENT_ID = "test-notion-client-id";
process.env.NOTION_CLIENT_SECRET = "test-notion-secret";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb";

// Global test setup
beforeAll(() => {
  // Setup MSW or other global mocks if needed
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
});
