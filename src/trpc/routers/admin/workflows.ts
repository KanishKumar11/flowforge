import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import { z } from "zod";
import { logAdminAction } from "@/lib/admin-utils";

export const adminWorkflowsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        search: z.string().optional(),
        isActive: z.boolean().optional(),
        userId: z.string().optional(),
        sortBy: z
          .enum(["createdAt", "updatedAt", "name", "executionCount"])
          .default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Record<string, unknown> = {};
      if (input.search)
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
        ];
      if (input.isActive !== undefined) where.isActive = input.isActive;
      if (input.userId) where.userId = input.userId;

      const orderBy: Record<string, unknown> =
        input.sortBy === "executionCount"
          ? { executions: { _count: input.sortOrder } }
          : { [input.sortBy]: input.sortOrder };

      const [workflows, total] = await Promise.all([
        prisma.workflow.findMany({
          where,
          skip,
          take: input.limit,
          orderBy,
          include: {
            user: { select: { id: true, name: true, email: true } },
            _count: { select: { executions: true, schedules: true } },
          },
        }),
        prisma.workflow.count({ where }),
      ]);

      return { workflows, total, pages: Math.ceil(total / input.limit) };
    }),

  getExecutions: adminProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z
          .enum(["PENDING", "RUNNING", "SUCCESS", "ERROR", "CANCELLED", "WAITING"])
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Record<string, unknown> = {};
      if (input.workflowId) where.workflowId = input.workflowId;
      if (input.status) where.status = input.status;

      const [executions, total] = await Promise.all([
        prisma.execution.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { startedAt: "desc" },
          include: {
            workflow: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        }),
        prisma.execution.count({ where }),
      ]);

      return { executions, total };
    }),

  deleteWorkflow: adminProcedure
    .input(z.object({ workflowId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.workflow.delete({ where: { id: input.workflowId } });
      await logAdminAction(
        ctx.adminUser.id,
        "DELETE_WORKFLOW",
        "workflow",
        input.workflowId,
      );
      return { success: true };
    }),

  executionStats: adminProcedure.query(async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [byStatus, avgDuration, topFailing] = await Promise.all([
      prisma.execution.groupBy({
        by: ["status"],
        _count: true,
        where: { startedAt: { gte: thirtyDaysAgo } },
      }),
      prisma.execution.aggregate({
        where: { status: "SUCCESS", duration: { not: null } },
        _avg: { duration: true },
      }),
      prisma.workflow.findMany({
        orderBy: { executions: { _count: "desc" } },
        take: 5,
        where: {
          executions: {
            some: { status: "ERROR", startedAt: { gte: thirtyDaysAgo } },
          },
        },
        select: {
          id: true,
          name: true,
          user: { select: { email: true } },
          _count: { select: { executions: true } },
        },
      }),
    ]);

    return { byStatus, avgDuration: avgDuration._avg.duration, topFailing };
  }),
});
