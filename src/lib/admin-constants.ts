/**
 * Client-safe admin constants (no server/db imports).
 * Import from here in Client Components instead of admin-utils.ts.
 */

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUPPORT_AGENT: "Support Agent",
};

export const ADMIN_ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
  ADMIN: "text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400",
  MODERATOR: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  SUPPORT_AGENT:
    "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
};
