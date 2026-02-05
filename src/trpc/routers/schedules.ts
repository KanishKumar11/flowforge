import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";

export const schedulesRouter = createTRPCRouter({
  // List all schedules for a workflow or all workflows
  list: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.schedule.findMany({
        where: {
          workflow: { userId: ctx.user.id },
          ...(input.workflowId && { workflowId: input.workflowId }),
        },
        orderBy: { createdAt: "desc" },
        include: {
          workflow: {
            select: { id: true, name: true },
          },
        },
      });
    }),

  // Create a new schedule
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        cronExpression: z.string().min(1),
        timezone: z.string().default("UTC"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify workflow ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.schedule.create({
        data: {
          workflowId: input.workflowId,
          cronExpression: input.cronExpression,
          timezone: input.timezone,
          isActive: input.isActive,
        },
      });
    }),

  // Update a schedule
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        cronExpression: z.string().min(1).optional(),
        timezone: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership via workflow
      const schedule = await prisma.schedule.findFirst({
        where: {
          id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!schedule) {
        throw new Error("Schedule not found");
      }

      return prisma.schedule.update({
        where: { id },
        data,
      });
    }),

  // Delete a schedule
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await prisma.schedule.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!schedule) {
        throw new Error("Schedule not found");
      }

      return prisma.schedule.delete({
        where: { id: input.id },
      });
    }),

  // Toggle schedule active status
  toggle: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const schedule = await prisma.schedule.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!schedule) {
        throw new Error("Schedule not found");
      }

      return prisma.schedule.update({
        where: { id: input.id },
        data: { isActive: !schedule.isActive },
      });
    }),

  // Get cron expression presets
  presets: protectedProcedure.query(() => {
    return [
      {
        label: "Every minute",
        expression: "* * * * *",
        description: "Runs every minute",
      },
      {
        label: "Every 5 minutes",
        expression: "*/5 * * * *",
        description: "Runs every 5 minutes",
      },
      {
        label: "Every 15 minutes",
        expression: "*/15 * * * *",
        description: "Runs every 15 minutes",
      },
      {
        label: "Every 30 minutes",
        expression: "*/30 * * * *",
        description: "Runs every 30 minutes",
      },
      {
        label: "Every hour",
        expression: "0 * * * *",
        description: "Runs at the start of every hour",
      },
      {
        label: "Every 2 hours",
        expression: "0 */2 * * *",
        description: "Runs every 2 hours",
      },
      {
        label: "Daily at midnight",
        expression: "0 0 * * *",
        description: "Runs at 00:00 every day",
      },
      {
        label: "Daily at 9 AM",
        expression: "0 9 * * *",
        description: "Runs at 09:00 every day",
      },
      {
        label: "Weekly (Monday)",
        expression: "0 9 * * 1",
        description: "Runs every Monday at 09:00",
      },
      {
        label: "Monthly (1st)",
        expression: "0 0 1 * *",
        description: "Runs on the 1st of each month",
      },
    ];
  }),

  // Describe a cron expression
  describe: protectedProcedure
    .input(z.object({ expression: z.string() }))
    .query(({ input }) => {
      const parts = input.expression.trim().split(/\s+/);
      if (parts.length !== 5) {
        return {
          valid: false,
          description: "Invalid cron expression (must have 5 parts)",
        };
      }

      const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
      const descriptions: string[] = [];

      if (minute === "*") {
        descriptions.push("every minute");
      } else if (minute.startsWith("*/")) {
        descriptions.push(`every ${minute.slice(2)} minutes`);
      } else {
        descriptions.push(`at minute ${minute}`);
      }

      if (hour !== "*") {
        descriptions.push(`at ${hour}:00`);
      }

      if (dayOfMonth !== "*") {
        descriptions.push(`on day ${dayOfMonth}`);
      }

      if (dayOfWeek !== "*") {
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayNum = parseInt(dayOfWeek);
        if (!isNaN(dayNum) && days[dayNum]) {
          descriptions.push(`on ${days[dayNum]}`);
        }
      }

      return {
        valid: true,
        description: descriptions.join(", "),
        parts: { minute, hour, dayOfMonth, month, dayOfWeek },
      };
    }),
});
