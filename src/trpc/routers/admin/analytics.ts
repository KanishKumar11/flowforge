import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";

export const adminAnalyticsRouter = createTRPCRouter({
  overview: adminProcedure.query(async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast30d,
      newUsersLast7d,
      totalWorkflows,
      activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      executionsLast30d,
      totalAiTokens,
      totalAiCost,
      totalTeams,
      execsLast24h,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.workflow.count(),
      prisma.workflow.count({ where: { isActive: true } }),
      prisma.execution.count(),
      prisma.execution.count({ where: { status: "SUCCESS" } }),
      prisma.execution.count({ where: { status: "ERROR" } }),
      prisma.execution.count({ where: { startedAt: { gte: thirtyDaysAgo } } }),
      prisma.aIUsageLog.aggregate({ _sum: { totalTokens: true } }),
      prisma.aIUsageLog.aggregate({ _sum: { costUsd: true } }),
      prisma.team.count(),
      prisma.execution.count({ where: { startedAt: { gte: yesterday } } }),
    ]);

    return {
      users: {
        total: totalUsers,
        newLast30d: newUsersLast30d,
        newLast7d: newUsersLast7d,
      },
      workflows: {
        total: totalWorkflows,
        active: activeWorkflows,
      },
      executions: {
        total: totalExecutions,
        successful: successfulExecutions,
        failed: failedExecutions,
        last30d: executionsLast30d,
        last24h: execsLast24h,
        successRate:
          totalExecutions > 0
            ? Math.round((successfulExecutions / totalExecutions) * 100)
            : 0,
      },
      ai: {
        totalTokens: totalAiTokens._sum.totalTokens ?? 0,
        totalCostUsd: totalAiCost._sum.costUsd ?? 0,
      },
      teams: { total: totalTeams },
    };
  }),

  userGrowth: adminProcedure
    .input(z.object({ days: z.number().min(7).max(365).default(30) }))
    .query(async ({ input }) => {
      const from = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const rows = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
        FROM "user"
        WHERE "createdAt" >= ${from}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `;
      return rows.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        users: Number(r.count),
      }));
    }),

  executionTrend: adminProcedure
    .input(z.object({ days: z.number().min(7).max(90).default(30) }))
    .query(async ({ input }) => {
      const from = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const rows = await prisma.$queryRaw<
        { date: Date; total: bigint; success: bigint; error: bigint }[]
      >`
        SELECT
          DATE_TRUNC('day', "startedAt") as date,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as success,
          SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as error
        FROM "execution"
        WHERE "startedAt" >= ${from}
        GROUP BY DATE_TRUNC('day', "startedAt")
        ORDER BY date ASC
      `;
      return rows.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        total: Number(r.total),
        success: Number(r.success),
        error: Number(r.error),
      }));
    }),

  aiUsageTrend: adminProcedure
    .input(z.object({ days: z.number().min(7).max(90).default(30) }))
    .query(async ({ input }) => {
      const from = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const rows = await prisma.$queryRaw<
        { date: Date; tokens: bigint; cost: number; requests: bigint }[]
      >`
        SELECT
          DATE_TRUNC('day', "createdAt") as date,
          SUM("totalTokens") as tokens,
          SUM("costUsd") as cost,
          COUNT(*) as requests
        FROM "ai_usage_log"
        WHERE "createdAt" >= ${from}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `;
      return rows.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        tokens: Number(r.tokens),
        cost: Number(r.cost),
        requests: Number(r.requests),
      }));
    }),

  recentSignups: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ input }) => {
      return prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: input.limit,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          emailVerified: true,
        },
      });
    }),

  topWorkflows: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input }) => {
      return prisma.workflow.findMany({
        orderBy: { executions: { _count: "desc" } },
        take: input.limit,
        select: {
          id: true,
          name: true,
          isActive: true,
          createdAt: true,
          user: { select: { email: true, name: true } },
          _count: { select: { executions: true } },
        },
      });
    }),

  systemStatus: adminProcedure.query(async () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const [recentExecs, recentErrors, recentAiLogs] = await Promise.all([
      prisma.execution.count({ where: { startedAt: { gte: fiveMinAgo } } }),
      prisma.execution.count({
        where: { startedAt: { gte: fiveMinAgo }, status: "ERROR" },
      }),
      prisma.aIUsageLog.count({
        where: { createdAt: { gte: fiveMinAgo }, success: false },
      }),
    ]);
    return {
      recentExecutions: recentExecs,
      recentErrors,
      recentAiFailures: recentAiLogs,
      errorRate: recentExecs > 0 ? Math.round((recentErrors / recentExecs) * 100) : 0,
      status:
        recentErrors / Math.max(recentExecs, 1) > 0.2
          ? "degraded"
          : recentErrors > 0
            ? "warning"
            : "healthy",
    };
  }),
});
