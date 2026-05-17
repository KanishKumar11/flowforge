import "server-only";
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

// Re-export client-safe constants for convenience
export { ADMIN_ROLE_LABELS, ADMIN_ROLE_COLORS } from "@/lib/admin-constants";
