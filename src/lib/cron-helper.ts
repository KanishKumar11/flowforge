// Cron expression helper utilities

export interface CronPreset {
  label: string;
  expression: string;
  description: string;
}

export const cronPresets: CronPreset[] = [
  { label: "Every minute", expression: "* * * * *", description: "Runs every minute" },
  { label: "Every 5 minutes", expression: "*/5 * * * *", description: "Runs every 5 minutes" },
  { label: "Every 15 minutes", expression: "*/15 * * * *", description: "Runs every 15 minutes" },
  { label: "Every 30 minutes", expression: "*/30 * * * *", description: "Runs every 30 minutes" },
  { label: "Every hour", expression: "0 * * * *", description: "Runs at the start of every hour" },
  { label: "Every 2 hours", expression: "0 */2 * * *", description: "Runs every 2 hours" },
  { label: "Every 6 hours", expression: "0 */6 * * *", description: "Runs every 6 hours" },
  { label: "Every 12 hours", expression: "0 */12 * * *", description: "Runs twice a day" },
  { label: "Daily at midnight", expression: "0 0 * * *", description: "Runs at 00:00 every day" },
  { label: "Daily at 9 AM", expression: "0 9 * * *", description: "Runs at 09:00 every day" },
  { label: "Daily at 6 PM", expression: "0 18 * * *", description: "Runs at 18:00 every day" },
  { label: "Weekly (Monday 9 AM)", expression: "0 9 * * 1", description: "Runs every Monday at 09:00" },
  { label: "Weekly (Friday 5 PM)", expression: "0 17 * * 5", description: "Runs every Friday at 17:00" },
  { label: "Monthly (1st at midnight)", expression: "0 0 1 * *", description: "Runs on the 1st of each month" },
  { label: "Monthly (15th at noon)", expression: "0 12 15 * *", description: "Runs on the 15th of each month at 12:00" },
];

// Parse cron expression parts
export function parseCronExpression(expression: string): {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
} {
  const parts = expression.trim().split(/\s+/);
  return {
    minute: parts[0] || "*",
    hour: parts[1] || "*",
    dayOfMonth: parts[2] || "*",
    month: parts[3] || "*",
    dayOfWeek: parts[4] || "*",
  };
}

// Build cron expression from parts
export function buildCronExpression(parts: {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

// Get human-readable description
export function describeCron(expression: string): string {
  const preset = cronPresets.find((p) => p.expression === expression);
  if (preset) return preset.description;

  const parts = parseCronExpression(expression);
  const descriptions: string[] = [];

  if (parts.minute === "*") {
    descriptions.push("every minute");
  } else if (parts.minute.startsWith("*/")) {
    descriptions.push(`every ${parts.minute.slice(2)} minutes`);
  } else {
    descriptions.push(`at minute ${parts.minute}`);
  }

  if (parts.hour !== "*") {
    if (parts.hour.startsWith("*/")) {
      descriptions.push(`every ${parts.hour.slice(2)} hours`);
    } else {
      descriptions.push(`at ${parts.hour}:00`);
    }
  }

  if (parts.dayOfMonth !== "*") {
    descriptions.push(`on day ${parts.dayOfMonth}`);
  }

  if (parts.dayOfWeek !== "*") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayNum = parseInt(parts.dayOfWeek);
    if (!isNaN(dayNum) && days[dayNum]) {
      descriptions.push(`on ${days[dayNum]}`);
    }
  }

  return descriptions.join(", ");
}

// Validate cron expression
export function isValidCron(expression: string): boolean {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return false;

  const patterns = [
    /^(\*|[0-5]?\d)(-[0-5]?\d)?(\/\d+)?$/, // minute (0-59)
    /^(\*|[01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/\d+)?$/, // hour (0-23)
    /^(\*|[1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/\d+)?$/, // day of month (1-31)
    /^(\*|[1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/\d+)?$/, // month (1-12)
    /^(\*|[0-6])(-[0-6])?(\/\d+)?$/, // day of week (0-6)
  ];

  return parts.every((part, i) => patterns[i].test(part));
}

// Get next N run times
export function getNextRunTimes(expression: string, count: number = 5): Date[] {
  // Simple implementation - for production use a library like cron-parser
  const times: Date[] = [];
  const now = new Date();
  const parts = parseCronExpression(expression);

  // Very simplified - returns approximate next runs
  for (let i = 0; i < count; i++) {
    const nextRun = new Date(now);
    nextRun.setMinutes(nextRun.getMinutes() + (i + 1) * 60); // Placeholder
    times.push(nextRun);
  }

  return times;
}
