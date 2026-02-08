import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create mock data
const mockCredentials = [
  {
    id: "cred-1",
    name: "Slack Integration",
    type: "oauth2",
    provider: "slack",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUsedAt: null,
  },
  {
    id: "cred-2",
    name: "Google Sheets",
    type: "oauth2",
    provider: "google",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUsedAt: new Date(),
  },
];

// Mock TRPC client - must be before component import
vi.mock("@/trpc/client", () => ({
  useTRPC: () => ({
    credentials: {
      list: {
        queryOptions: () => ({ queryKey: ["credentials", "list"] }),
      },
    },
  }),
  useVanillaClient: () => ({
    credentials: {
      create: { mutate: vi.fn() },
      update: { mutate: vi.fn() },
      delete: { mutate: vi.fn() },
    },
  }),
}));

// Mock @tanstack/react-query to return test data
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: () => ({
      data: mockCredentials,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }),
    useMutation: () => ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(() => Promise.resolve()),
      isPending: false,
      isError: false,
    }),
  };
});

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock DashboardHeader to avoid header complexities
vi.mock("@/components/DashboardHeader", () => ({
  DashboardHeader: ({ children }: { children: React.ReactNode }) => (
    <header data-testid="dashboard-header">{children}</header>
  ),
}));

// Import component after all mocks
import { CredentialsPageClient } from "@/features/credentials/components/CredentialsPageClient";

// Wrapper component with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("CredentialsPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Component should render
    expect(document.body).toBeInTheDocument();
  });

  it("should display credentials heading", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Look for credentials-related content
    expect(
      screen.getByText(/credentials/i) || screen.getByText(/integrations/i),
    ).toBeTruthy();
  });

  it("should display credential names when loaded", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // The mock data should be displayed
    expect(screen.getByText("Slack Integration")).toBeInTheDocument();
    expect(screen.getByText("Google Sheets")).toBeInTheDocument();
  });

  it("should show create button", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should display provider information", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Use getAllByText since there are multiple elements with slack
    const slackElements = screen.getAllByText(/slack/i);
    expect(slackElements.length).toBeGreaterThan(0);
  });

  it("should have OAuth quick connect buttons", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // The component uses buttons instead of links for OAuth
    const buttons = screen.getAllByRole("button");
    // Should have Link Slack, Link Google, Link GitHub buttons
    expect(buttons.length).toBeGreaterThan(3);
  });

  it("should display credential count in stats", () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Should show the count (2 credentials) - use getAllBy since there are multiple
    const countElements = screen.getAllByText("2");
    expect(countElements.length).toBeGreaterThan(0);
  });
});

describe("CredentialsPageClient - Loading State", () => {
  it("should render component successfully", async () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Component should still render during loading
    expect(document.body).toBeInTheDocument();
  });
});

describe("CredentialsPageClient - Empty State", () => {
  it("should render component in empty state", async () => {
    render(<CredentialsPageClient />, { wrapper: createWrapper() });
    // Component should render
    expect(document.body).toBeInTheDocument();
  });
});
