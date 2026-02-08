import { describe, it, expect } from "vitest";
import {
  cronPresets,
  parseCronExpression,
  buildCronExpression,
  describeCron,
  isValidCron,
  getNextRunTimes,
} from "@/lib/cron-helper";

describe("Cron Helper", () => {
  describe("cronPresets", () => {
    it("should have at least 10 presets", () => {
      expect(cronPresets.length).toBeGreaterThanOrEqual(10);
    });

    it("should have valid structure for each preset", () => {
      cronPresets.forEach((preset) => {
        expect(preset.label).toBeTruthy();
        expect(preset.expression).toBeTruthy();
        expect(preset.description).toBeTruthy();
      });
    });

    it("should include common presets", () => {
      const labels = cronPresets.map((p) => p.label);

      expect(labels).toContain("Every minute");
      expect(labels).toContain("Every hour");
      expect(labels).toContain("Daily at midnight");
    });

    it("should have valid cron expressions for all presets", () => {
      cronPresets.forEach((preset) => {
        expect(isValidCron(preset.expression)).toBe(true);
      });
    });
  });

  describe("parseCronExpression", () => {
    it("should parse a simple cron expression", () => {
      const result = parseCronExpression("* * * * *");

      expect(result.minute).toBe("*");
      expect(result.hour).toBe("*");
      expect(result.dayOfMonth).toBe("*");
      expect(result.month).toBe("*");
      expect(result.dayOfWeek).toBe("*");
    });

    it("should parse every hour cron expression", () => {
      const result = parseCronExpression("0 * * * *");

      expect(result.minute).toBe("0");
      expect(result.hour).toBe("*");
    });

    it("should parse daily at midnight", () => {
      const result = parseCronExpression("0 0 * * *");

      expect(result.minute).toBe("0");
      expect(result.hour).toBe("0");
      expect(result.dayOfMonth).toBe("*");
      expect(result.month).toBe("*");
      expect(result.dayOfWeek).toBe("*");
    });

    it("should parse weekly schedule", () => {
      const result = parseCronExpression("0 9 * * 1");

      expect(result.minute).toBe("0");
      expect(result.hour).toBe("9");
      expect(result.dayOfWeek).toBe("1"); // Monday
    });

    it("should parse expressions with ranges", () => {
      const result = parseCronExpression("0 9-17 * * 1-5");

      expect(result.hour).toBe("9-17");
      expect(result.dayOfWeek).toBe("1-5");
    });

    it("should parse expressions with step values", () => {
      const result = parseCronExpression("*/15 * * * *");

      expect(result.minute).toBe("*/15");
    });

    it("should handle expressions with extra whitespace", () => {
      const result = parseCronExpression("0  0  *  *  *");

      expect(result.minute).toBe("0");
      expect(result.hour).toBe("0");
    });
  });

  describe("buildCronExpression", () => {
    it("should build cron expression from parts", () => {
      const parts = {
        minute: "0",
        hour: "9",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "*",
      };

      const result = buildCronExpression(parts);
      expect(result).toBe("0 9 * * *");
    });

    it("should build every minute expression", () => {
      const parts = {
        minute: "*",
        hour: "*",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "*",
      };

      const result = buildCronExpression(parts);
      expect(result).toBe("* * * * *");
    });

    it("should build complex expression with ranges", () => {
      const parts = {
        minute: "0",
        hour: "9-17",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "1-5",
      };

      const result = buildCronExpression(parts);
      expect(result).toBe("0 9-17 * * 1-5");
    });
  });

  describe("describeCron", () => {
    it("should return preset description for known expressions", () => {
      const result = describeCron("* * * * *");
      expect(result).toBe("Runs every minute");
    });

    it("should describe hourly schedule", () => {
      const result = describeCron("0 * * * *");
      expect(result).toBe("Runs at the start of every hour");
    });

    it("should describe daily at midnight", () => {
      const result = describeCron("0 0 * * *");
      expect(result).toBe("Runs at 00:00 every day");
    });

    it("should generate description for custom expression", () => {
      const result = describeCron("30 14 * * *");
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should describe expressions with step values", () => {
      const result = describeCron("*/15 * * * *");
      expect(result).toContain("15");
      expect(result).toContain("minute");
    });

    it("should describe weekly schedules", () => {
      const result = describeCron("0 9 * * 1");
      expect(result).toContain("Monday");
    });

    it("should describe day of month", () => {
      const result = describeCron("0 0 15 * *");
      expect(result).toContain("15");
    });
  });

  describe("isValidCron", () => {
    it("should validate correct cron expressions", () => {
      const validExpressions = [
        "* * * * *",
        "0 * * * *",
        "0 0 * * *",
        "*/15 * * * *",
        "0 9-17 * * 1-5",
        "30 2 * * *",
        "0 0 1 * *",
        "0 0 * * 0",
      ];

      validExpressions.forEach((expr) => {
        expect(isValidCron(expr)).toBe(true);
      });
    });

    it("should reject expressions with wrong number of parts", () => {
      expect(isValidCron("* * *")).toBe(false);
      expect(isValidCron("* * * * * *")).toBe(false);
      expect(isValidCron("*")).toBe(false);
    });

    it("should reject invalid minute values", () => {
      expect(isValidCron("60 * * * *")).toBe(false);
      expect(isValidCron("abc * * * *")).toBe(false);
    });

    it("should reject invalid hour values", () => {
      expect(isValidCron("0 24 * * *")).toBe(false);
      expect(isValidCron("0 -1 * * *")).toBe(false);
    });

    it("should reject invalid day of month values", () => {
      expect(isValidCron("0 0 32 * *")).toBe(false);
      expect(isValidCron("0 0 0 * *")).toBe(false);
    });

    it("should reject invalid month values", () => {
      expect(isValidCron("0 0 * 13 *")).toBe(false);
      expect(isValidCron("0 0 * 0 *")).toBe(false);
    });

    it("should reject invalid day of week values", () => {
      expect(isValidCron("0 0 * * 7")).toBe(false);
      expect(isValidCron("0 0 * * -1")).toBe(false);
    });

    it("should accept valid step values", () => {
      expect(isValidCron("*/5 * * * *")).toBe(true);
      expect(isValidCron("0 */2 * * *")).toBe(true);
    });

    it("should accept valid ranges", () => {
      expect(isValidCron("0 9-17 * * *")).toBe(true);
      expect(isValidCron("0 0 * * 1-5")).toBe(true);
    });

    it("should handle expressions with multiple spaces", () => {
      expect(isValidCron("0  0  *  *  *")).toBe(true);
    });
  });

  describe("getNextRunTimes", () => {
    it("should return array of Date objects", () => {
      const result = getNextRunTimes("* * * * *", 5);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
      result.forEach((date) => {
        expect(date).toBeInstanceOf(Date);
      });
    });

    it("should return requested number of run times", () => {
      expect(getNextRunTimes("* * * * *", 3).length).toBe(3);
      expect(getNextRunTimes("* * * * *", 10).length).toBe(10);
    });

    it("should return future dates", () => {
      const now = new Date();
      const result = getNextRunTimes("* * * * *", 5);

      result.forEach((date) => {
        expect(date.getTime()).toBeGreaterThan(now.getTime());
      });
    });

    it("should default to 5 run times when count not specified", () => {
      const result = getNextRunTimes("* * * * *");
      expect(result.length).toBe(5);
    });

    it("should return dates in chronological order", () => {
      const result = getNextRunTimes("* * * * *", 5);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].getTime()).toBeGreaterThan(result[i - 1].getTime());
      }
    });
  });

  describe("Integration tests", () => {
    it("should parse and rebuild the same expression", () => {
      const original = "0 9 * * 1";
      const parsed = parseCronExpression(original);
      const rebuilt = buildCronExpression(parsed);

      expect(rebuilt).toBe(original);
    });

    it("should validate all preset expressions", () => {
      cronPresets.forEach((preset) => {
        expect(isValidCron(preset.expression)).toBe(true);
      });
    });

    it("should describe all preset expressions", () => {
      cronPresets.forEach((preset) => {
        const description = describeCron(preset.expression);
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(0);
      });
    });
  });
});
