import prisma from "@/lib/db";

/**
 * Log an admin action to the AdminAuditLog table.
 */
export async function logAdminAction(
  adminUserId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>,
) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminUserId,
        action,
        targetType,
        targetId,
        details: (details ?? undefined) as import("@/generated/prisma").Prisma.InputJsonValue | undefined,
      },
    });
  } catch {
    // Non-fatal — don't throw if audit logging fails
    console.error("[admin-utils] Failed to write audit log:", { action, adminUserId });
  }
}

/**
 * Format bytes into human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

/**
 * Format a cost in USD.
 */
export function formatCost(usd: number): string {
  if (usd < 0.01) return `$${(usd * 100).toFixed(2)}¢`;
  return `$${usd.toFixed(4)}`;
}

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
  SUPPORT_AGENT: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
};
