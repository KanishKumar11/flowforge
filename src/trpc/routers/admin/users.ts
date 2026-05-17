import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { logAdminAction } from "@/lib/admin-utils";

export const adminUsersRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        sortBy: z
          .enum(["createdAt", "email", "name", "executionCount"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
        filter: z
          .object({
            hasAdmin: z.boolean().optional(),
            emailVerified: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, search, sortBy, sortOrder, filter } = input;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (search) {
        where.OR = [
          { email: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ];
      }
      if (filter?.emailVerified !== undefined) {
        where.emailVerified = filter.emailVerified;
      }
      if (filter?.hasAdmin !== undefined) {
        where.adminUser = filter.hasAdmin ? { isNot: null } : { is: null };
      }

      const orderBy: Record<string, unknown> =
        sortBy === "executionCount"
          ? { executions: { _count: sortOrder } }
          : { [sortBy]: sortOrder };

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
            adminUser: { select: { role: true, isActive: true } },
            _count: {
              select: {
                workflows: true,
                executions: true,
                teamMembers: true,
              },
            },
          },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        total,
        pages: Math.ceil(total / limit),
        page,
      };
    }),

  getById: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        include: {
          adminUser: true,
          sessions: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              createdAt: true,
              ipAddress: true,
              userAgent: true,
              expiresAt: true,
            },
          },
          accounts: { select: { providerId: true, createdAt: true } },
          _count: {
            select: {
              workflows: true,
              executions: true,
              teamMembers: true,
              credentials: true,
              apiKeys: true,
            },
          },
          auditLogs: {
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
              id: true,
              action: true,
              entity: true,
              entityId: true,
              createdAt: true,
              ipAddress: true,
            },
          },
          aiUsageLogs: {
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
              provider: true,
              model: true,
              totalTokens: true,
              costUsd: true,
              createdAt: true,
            },
          },
          supportTickets: {
            orderBy: { createdAt: "desc" },
            take: 10,
            select: {
              id: true,
              ticketNumber: true,
              subject: true,
              status: true,
              priority: true,
              createdAt: true,
            },
          },
        },
      });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      // Aggregate AI usage stats
      const aiStats = await prisma.aIUsageLog.aggregate({
        where: { userId: input.userId },
        _sum: { totalTokens: true, costUsd: true },
        _count: true,
      });

      return { user, aiStats };
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT_AGENT"]).nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.role === null) {
        await prisma.adminUser.deleteMany({ where: { userId: input.userId } });
      } else {
        await prisma.adminUser.upsert({
          where: { userId: input.userId },
          create: { userId: input.userId, role: input.role },
          update: { role: input.role, isActive: true },
        });
      }
      await logAdminAction(ctx.adminUser.id, "UPDATE_ADMIN_ROLE", "user", input.userId, {
        role: input.role,
      });
    }),

  banUser: adminProcedure
    .input(z.object({ userId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      // Revoke all sessions
      await prisma.session.deleteMany({ where: { userId: input.userId } });
      await logAdminAction(ctx.adminUser.id, "BAN_USER", "user", input.userId, {
        reason: input.reason,
      });
      return { success: true };
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.user.delete({ where: { id: input.userId } });
      await logAdminAction(ctx.adminUser.id, "DELETE_USER", "user", input.userId);
      return { success: true };
    }),

  sendNotification: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Create an announcement targeted to this user
      await prisma.announcement.create({
        data: {
          title: input.title,
          message: input.message,
          targetAudience: input.userId,
          type: "INFO",
        },
      });
      await logAdminAction(ctx.adminUser.id, "SEND_NOTIFICATION", "user", input.userId);
      return { success: true };
    }),

  stats: adminProcedure.query(async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, newLast30d, newLast7d, verified] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { emailVerified: true } }),
    ]);

    // Growth by day for the last 30 days
    const growth = await prisma.$queryRaw<
      { date: Date; count: bigint }[]
    >`
      SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
      FROM "user"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;

    return {
      total,
      newLast30d,
      newLast7d,
      verified,
      growth: growth.map((g) => ({
        date: g.date.toISOString().split("T")[0],
        count: Number(g.count),
      })),
    };
  }),
});
