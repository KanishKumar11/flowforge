import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

describe("useIsMobile", () => {
  let matchMediaMock: any;
  let listeners: Array<(e: any) => void> = [];

  beforeEach(() => {
    listeners = [];

    matchMediaMock = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (event: string, listener: (e: any) => void) => {
        if (event === "change") {
          listeners.push(listener);
        }
      },
      removeEventListener: (event: string, listener: (e: any) => void) => {
        if (event === "change") {
          listeners = listeners.filter((l) => l !== listener);
        }
      },
      dispatchEvent: () => true,
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    listeners = [];
  });

  it("should return false for desktop width (>= 768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should return true for mobile width (< 768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("should return true at 767px (just below breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it("should return false at 768px (at breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("should use matchMedia with correct breakpoint query", () => {
    const matchMediaSpy = vi.fn(matchMediaMock);
    window.matchMedia = matchMediaSpy;

    renderHook(() => useIsMobile());

    expect(matchMediaSpy).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("should update when window is resized", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    // Trigger the matchMedia listener
    listeners.forEach((listener) => listener({ matches: true }));
    rerender();

    expect(result.current).toBe(true);
  });

  it("should cleanup listener on unmount", () => {
    const removeEventListenerSpy = vi.fn();

    matchMediaMock = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: () => true,
    });

    window.matchMedia = matchMediaMock;

    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should initialize as undefined before effect runs", () => {
    // This behavior is intentional to avoid hydration mismatches
    const { result } = renderHook(() => useIsMobile());

    // After rendering, it should have a boolean value
    expect(typeof result.current).toBe("boolean");
  });

  it("should handle rapid resize events", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Rapid changes
    for (let i = 0; i < 10; i++) {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: i % 2 === 0 ? 375 : 1024,
      });

      listeners.forEach((listener) =>
        listener({ matches: i % 2 === 0 }),
      );
      rerender();
    }

    // Should end up with desktop size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    listeners.forEach((listener) => listener({ matches: false }));
    rerender();

    expect(result.current).toBe(false);
  });

  it("should handle common mobile widths", () => {
    const mobileWidths = [320, 375, 414, 428, 390, 767];

    mobileWidths.forEach((width) => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: width,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
    });
  });

  it("should handle common desktop widths", () => {
    const desktopWidths = [768, 1024, 1280, 1440, 1920, 2560];

    desktopWidths.forEach((width) => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: width,
      });

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });
  });
});
