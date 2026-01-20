import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";

export const auditRouter = createTRPCRouter({
  // List audit logs with pagination
  list: protectedProcedure
    .input(
      z.object({
        entity: z.string().optional(),
        action: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const logs = await prisma.auditLog.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.entity && { entity: input.entity }),
          ...(input.action && { action: input.action }),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (logs.length > input.limit) {
        const nextItem = logs.pop();
        nextCursor = nextItem!.id;
      }

      return { items: logs, nextCursor };
    }),

  // Get activity for a specific entity
  forEntity: protectedProcedure
    .input(z.object({ entity: z.string(), entityId: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.auditLog.findMany({
        where: {
          userId: ctx.user.id,
          entity: input.entity,
          entityId: input.entityId,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      });
    }),

  // Create an audit log entry (internal use)
  create: protectedProcedure
    .input(
      z.object({
        action: z.string(),
        entity: z.string(),
        entityId: z.string().optional(),
        details: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.auditLog.create({
        data: {
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          details: input.details,
          userId: ctx.user.id,
        },
      });
    }),

  // Get recent activity summary
  summary: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(30).default(7) }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const [totalActions, byEntity, recentLogs] = await Promise.all([
        prisma.auditLog.count({
          where: { userId: ctx.user.id, createdAt: { gte: startDate } },
        }),
        prisma.auditLog.groupBy({
          by: ["entity"],
          where: { userId: ctx.user.id, createdAt: { gte: startDate } },
          _count: { entity: true },
        }),
        prisma.auditLog.findMany({
          where: { userId: ctx.user.id, createdAt: { gte: startDate } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      return {
        totalActions,
        byEntity: byEntity.map((b: { entity: string; _count: { entity: number } }) => ({ entity: b.entity, count: b._count.entity })),
        recentLogs,
      };
    }),
});
