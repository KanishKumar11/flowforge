import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
import { nanoid } from "nanoid";

export const webhooksRouter = createTRPCRouter({
  // List all webhooks for a workflow or all workflows
  list: protectedProcedure
    .input(
      z.object({
        workflowId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return prisma.webhookEndpoint.findMany({
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

  // Create a new webhook endpoint
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST"),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify workflow ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Generate unique path
      const path = `/api/webhooks/${nanoid(12)}`;

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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!webhook) {
        throw new Error("Webhook not found");
      }

      return prisma.webhookEndpoint.update({
        where: { id },
        data,
      });
    }),

  // Delete a webhook
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!webhook) {
        throw new Error("Webhook not found");
      }

      return prisma.webhookEndpoint.delete({
        where: { id: input.id },
      });
    }),

  // Regenerate webhook path
  regenerate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const webhook = await prisma.webhookEndpoint.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.user.id },
        },
      });

      if (!webhook) {
        throw new Error("Webhook not found");
      }

      const newPath = `/api/webhooks/${nanoid(12)}`;

      return prisma.webhookEndpoint.update({
        where: { id: input.id },
        data: { path: newPath },
      });
    }),
});
