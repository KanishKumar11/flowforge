import prisma from "@/lib/db";
import { createTRPCRouter, teamProcedure } from "../init";
import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";

export const webhooksRouter = createTRPCRouter({
  // List all webhooks for a workflow or all team workflows
  list: teamProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.webhookEndpoint.findMany({
        where: {
          workflow: { teamId: ctx.team.id },
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

  // Create a new webhook endpoint
  create: teamProcedure
    .input(
      z.object({
        workflowId: z.string(),
        method: z
          .enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
          .default("POST"),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      const path = nanoid(12);

      return prisma.webhookEndpoint.create({
        data: {
          workflowId: input.workflowId,
          path,
          method: input.method,
          isActive: input.isActive,
        },
      });
    }),

  // Update a webhook
  update: teamProcedure
    .input(
      z.object({
        id: z.string(),
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id,
          workflow: { teamId: ctx.team.id },
        },
      });

      if (!webhook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Webhook not found",
        });
      }

      return prisma.webhookEndpoint.update({
        where: { id },
        data,
      });
    }),

  // Delete a webhook
  delete: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id: input.id,
          workflow: { teamId: ctx.team.id },
        },
      });

      if (!webhook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Webhook not found",
        });
      }

      return prisma.webhookEndpoint.delete({
        where: { id: input.id },
      });
    }),

  // Regenerate webhook path
  regenerate: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id: input.id,
          workflow: { teamId: ctx.team.id },
        },
      });

      if (!webhook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Webhook not found",
        });
      }

      const newPath = nanoid(12);

      return prisma.webhookEndpoint.update({
        where: { id: input.id },
        data: { path: newPath },
      });
    }),
});
