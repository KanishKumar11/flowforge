import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";

// Mock the sidebar components since they require context
vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle</button>,
}));

// Import after mock
import { AppHeader } from "@/components/AppHeader";

describe("AppHeader", () => {
  it("should render without crashing", () => {
    render(<AppHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("should have correct CSS classes", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("flex", "items-center", "border-b");
  });

  it("should render SidebarTrigger component", () => {
    render(<AppHeader />);
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
  });

  it("should have fixed height", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("h-14");
  });

  it("should have proper layout classes for flexbox", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("flex", "items-center", "gap-2");
  });

  it("should have background styling", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("bg-background");
  });

  it("should have padding", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("px-4");
  });

  it("should have shrink-0 to prevent shrinking", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("shrink-0");
  });
});
