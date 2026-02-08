import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names correctly", () => {
      const result = cn("px-4", "py-2");
      expect(result).toBeTruthy();
      expect(result).toContain("px-4");
      expect(result).toContain("py-2");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");

      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("should ignore falsy values", () => {
      const result = cn("base", false && "hidden", null, undefined, "visible");

      expect(result).toContain("base");
      expect(result).toContain("visible");
      expect(result).not.toContain("hidden");
    });

    it("should merge conflicting Tailwind classes correctly", () => {
      // tailwind-merge should handle this
      const result = cn("px-4", "px-8");
      expect(result).toContain("px-8");
    });

    it("should handle array of classes", () => {
      const classes = ["flex", "items-center", "gap-2"];
      const result = cn(...classes);

      classes.forEach((cls) => {
        expect(result).toContain(cls);
      });
    });

    it("should handle empty input", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle objects with boolean values", () => {
      const result = cn({
        "text-red-500": true,
        "text-blue-500": false,
        "font-bold": true,
      });

      expect(result).toContain("text-red-500");
      expect(result).toContain("font-bold");
      expect(result).not.toContain("text-blue-500");
    });
  });
});
