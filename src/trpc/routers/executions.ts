import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";

export const executionsRouter = createTRPCRouter({
  // List executions with filters
  list: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        status: z
          .enum([
            "PENDING",
            "RUNNING",
            "SUCCESS",
            "ERROR",
            "CANCELLED",
            "WAITING",
          ])
          .optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const executions = await prisma.execution.findMany({
        where: {
          workflow: { userId: ctx.user.id },
          ...(input.workflowId && { workflowId: input.workflowId }),
          ...(input.status && { status: input.status }),
        },
        orderBy: { startedAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (executions.length > input.limit) {
        const nextItem = executions.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: executions,
        nextCursor,
      };
    }),

  // Get a single execution with full details
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!execution) {
        throw new Error("Execution not found");
      }

      return execution;
    }),

  // Get execution stats for a workflow
  stats: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        days: z.number().min(1).max(90).default(7),
      }),
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const [total, success, error, running] = await Promise.all([
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.user.id },
            ...(input.workflowId && { workflowId: input.workflowId }),
            startedAt: { gte: startDate },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.user.id },
            ...(input.workflowId && { workflowId: input.workflowId }),
            status: "SUCCESS",
            startedAt: { gte: startDate },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.user.id },
            ...(input.workflowId && { workflowId: input.workflowId }),
            status: "ERROR",
            startedAt: { gte: startDate },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: { userId: ctx.user.id },
            ...(input.workflowId && { workflowId: input.workflowId }),
            status: "RUNNING",
          },
        }),
      ]);

      // Calculate average duration for successful executions
      const avgDuration = await prisma.execution.aggregate({
        where: {
          workflow: { userId: ctx.user.id },
          ...(input.workflowId && { workflowId: input.workflowId }),
          status: "SUCCESS",
          duration: { not: null },
          startedAt: { gte: startDate },
        },
        _avg: {
          duration: true,
        },
      });

      return {
        total,
        success,
        error,
        running,
        successRate: total > 0 ? (success / total) * 100 : 0,
        avgDuration: avgDuration._avg.duration || 0,
      };
    }),

  // Cancel a running execution
  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
          status: { in: ["PENDING", "RUNNING", "WAITING"] },
        },
      });

      if (!execution) {
        throw new Error("Execution not found or cannot be cancelled");
      }

      return prisma.execution.update({
        where: { id: input.id },
        data: {
          status: "CANCELLED",
          finishedAt: new Date(),
        },
      });
    }),

  // Retry a failed execution
  retry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
          status: { in: ["ERROR", "CANCELLED"] },
        },
        include: {
          workflow: true,
        },
      });

      if (!execution) {
        throw new Error("Execution not found or cannot be retried");
      }

      // Create a new execution as a retry
      return prisma.execution.create({
        data: {
          workflowId: execution.workflowId,
          userId: ctx.user.id,
          mode: execution.mode,
          inputData: execution.inputData ?? undefined,
          status: "PENDING",
          retryOf: execution.id,
          retryCount: execution.retryCount + 1,
        },
      });
    }),

  // Delete an execution
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!execution) {
        throw new Error("Execution not found");
      }

      return prisma.execution.delete({
        where: { id: input.id },
      });
    }),

  // Get execution timeline (hourly breakdown)
  timeline: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
        hours: z.number().min(1).max(168).default(24), // Max 1 week
      }),
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - input.hours);

      const executions = await prisma.execution.findMany({
        where: {
          workflow: { userId: ctx.user.id },
          ...(input.workflowId && { workflowId: input.workflowId }),
          startedAt: { gte: startDate },
        },
        select: {
          id: true,
          status: true,
          startedAt: true,
          duration: true,
        },
        orderBy: { startedAt: "asc" },
      });

      // Group by hour
      const hourlyData: Record<
        string,
        { success: number; error: number; total: number }
      > = {};

      executions.forEach((exec) => {
        if (exec.startedAt) {
          const hourKey = exec.startedAt.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          if (!hourlyData[hourKey]) {
            hourlyData[hourKey] = { success: 0, error: 0, total: 0 };
          }
          hourlyData[hourKey].total++;
          if (exec.status === "SUCCESS") hourlyData[hourKey].success++;
          if (exec.status === "ERROR") hourlyData[hourKey].error++;
        }
      });

      return {
        timeline: Object.entries(hourlyData).map(([hour, data]) => ({
          hour,
          ...data,
        })),
        totalExecutions: executions.length,
      };
    }),
});
