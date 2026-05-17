import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";

export const adminAIUsageRouter = createTRPCRouter({
  overview: adminProcedure.query(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalStats, last30dStats, byProvider, byModel, recentFailures] =
      await Promise.all([
        prisma.aIUsageLog.aggregate({
          _sum: {
            totalTokens: true,
            inputTokens: true,
            outputTokens: true,
            costUsd: true,
          },
          _count: true,
          _avg: { latencyMs: true },
        }),
        prisma.aIUsageLog.aggregate({
          where: { createdAt: { gte: thirtyDaysAgo } },
          _sum: { totalTokens: true, costUsd: true },
          _count: true,
        }),
        prisma.aIUsageLog.groupBy({
          by: ["provider"],
          _sum: { totalTokens: true, costUsd: true },
          _count: true,
          orderBy: { _count: { provider: "desc" } },
        }),
        prisma.aIUsageLog.groupBy({
          by: ["model"],
          _sum: { totalTokens: true, costUsd: true },
          _count: true,
          orderBy: { _sum: { totalTokens: "desc" } },
          take: 10,
        }),
        prisma.aIUsageLog.findMany({
          where: { success: false, createdAt: { gte: thirtyDaysAgo } },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            provider: true,
            model: true,
            error: true,
            createdAt: true,
            user: { select: { email: true } },
          },
        }),
      ]);

    return {
      aggregate: {
        totalTokens: totalStats._sum.totalTokens ?? 0,
        totalCost: totalStats._sum.costUsd ?? 0,
        totalRequests: totalStats._count,
        failedRequests: recentFailures.length,
        avgLatencyMs: totalStats._avg.latencyMs ?? 0,
      },
      last30d: {
        tokens: last30dStats._sum.totalTokens ?? 0,
        cost: last30dStats._sum.costUsd ?? 0,
        requests: last30dStats._count,
      },
      byProvider: byProvider.map((p) => ({
        provider: p.provider,
        tokens: p._sum.totalTokens ?? 0,
        cost: p._sum.costUsd ?? 0,
        requests: p._count,
      })),
      byModel: byModel.map((m) => ({
        model: m.model,
        tokens: m._sum.totalTokens ?? 0,
        cost: m._sum.costUsd ?? 0,
        requests: m._count,
      })),
      recentFailures,
    };
  }),

  trend: adminProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).default(30),
        provider: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const from = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const rows = await prisma.$queryRaw<
        {
          date: Date;
          tokens: bigint;
          cost: number;
          requests: bigint;
          errors: bigint;
        }[]
      >`
        SELECT
          DATE_TRUNC('day', "createdAt") as date,
          SUM("totalTokens") as tokens,
          SUM("costUsd") as cost,
          COUNT(*) as requests,
          SUM(CASE WHEN success = false THEN 1 ELSE 0 END) as errors
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
        errors: Number(r.errors),
      }));
    }),

  topUsers: adminProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const rows = await prisma.aIUsageLog.groupBy({
        by: ["userId"],
        _sum: { totalTokens: true, costUsd: true },
        _count: true,
        orderBy: { _sum: { totalTokens: "desc" } },
        take: input.limit,
        where: { userId: { not: null } },
      });

      const userIds = rows.map((r) => r.userId!).filter(Boolean);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      });
      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      return rows.map((r) => ({
        userId: r.userId,
        user: r.userId ? userMap[r.userId] : null,
        totalTokens: r._sum.totalTokens ?? 0,
        totalCost: r._sum.costUsd ?? 0,
        requests: r._count,
      }));
    }),
});
