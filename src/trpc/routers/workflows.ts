import { inngest } from "@/inngest/client";
import { executeWorkflowDirect } from "@/inngest/functions";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../init";
import { z } from "zod";
import { PLANS } from "@/lib/plans";
import { TRPCError } from "@trpc/server";
import {
  workflowTemplates,
  getTemplateById,
  getCategories,
} from "@/lib/templates";

export const workflowsRouter = createTRPCRouter({
  // List all templates
  templates: publicProcedure.query(() => {
    return {
      templates: workflowTemplates,
      categories: getCategories(),
    };
  }),

  // Create workflow from template
  createFromTemplate: protectedProcedure
    .input(z.object({ templateId: z.string(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const template = getTemplateById(input.templateId);
      if (!template) {
        throw new Error("Template not found");
      }

      // Get user's team and plan
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: ctx.user.id },
        include: { team: true },
      });

      if (!teamMember) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "You must be part of a team to create workflows",
        });
      }

      const plan =
        ((teamMember.team as any).plan?.toUpperCase() as keyof typeof PLANS) ||
        "FREE";
      const limit =
        PLANS[plan]?.limits.workflows || PLANS.FREE.limits.workflows;

      // Count existing workflows
      const count = await prisma.workflow.count({
        where: { userId: ctx.user.id },
      });

      if (count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Plan limit reached. Upgrade to Pro for more workflows.`,
        });
      }

      return prisma.workflow.create({
        data: {
          name: input.name || template.name,
          description: template.description,
          nodes: template.nodes as object[],
          edges: template.edges as object[],
          tags: template.tags,
          userId: ctx.user.id,
        },
      });
    }),

  // List all workflows for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });
  }),

  // Get a single workflow by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          schedules: true,
          webhooks: true,
          _count: {
            select: { executions: true },
          },
        },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return workflow;
    }),

  // ... existing imports

  // Create a new workflow
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's team and plan
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: ctx.user.id },
        include: { team: true },
      });

      if (!teamMember) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "You must be part of a team to create workflows",
        });
      }

      const plan =
        ((teamMember.team as any).plan?.toUpperCase() as keyof typeof PLANS) ||
        "FREE";
      const limit =
        PLANS[plan]?.limits.workflows || PLANS.FREE.limits.workflows;

      // Count existing workflows
      const count = await prisma.workflow.count({
        where: { userId: ctx.user.id },
      });

      if (count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Plan limit reached. Upgrade to Pro for more workflows.`,
        });
      }

      return prisma.workflow.create({
        data: {
          name: input.name,
          description: input.description,
          userId: ctx.user.id,
          nodes: [],
          edges: [],
        },
      });
    }),

  // Update a workflow
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        nodes: z.any().optional(),
        edges: z.any().optional(),
        viewport: z.any().optional(),
        settings: z.any().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Save version before updating if nodes or edges changed
      const shouldSaveVersion = data.nodes || data.edges;
      if (shouldSaveVersion) {
        await prisma.workflowVersion.create({
          data: {
            workflowId: workflow.id,
            versionNum: workflow.version,
            nodes: workflow.nodes as object,
            edges: workflow.edges as object,
            viewport: workflow.viewport ?? undefined,
            settings: workflow.settings ?? undefined,
            createdById: ctx.user.id,
          },
        });
      }

      return prisma.workflow.update({
        where: { id },
        data: {
          ...data,
          ...(shouldSaveVersion && { version: { increment: 1 } }),
        },
      });
    }),

  // List workflow versions
  listVersions: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflowVersion.findMany({
        where: { workflowId: input.workflowId },
        orderBy: { versionNum: "desc" },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });
    }),

  // Rollback to a previous version
  rollback: protectedProcedure
    .input(z.object({ workflowId: z.string(), versionNum: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Find the version to rollback to
      const version = await prisma.workflowVersion.findUnique({
        where: {
          workflowId_versionNum: {
            workflowId: input.workflowId,
            versionNum: input.versionNum,
          },
        },
      });

      if (!version) {
        throw new Error("Version not found");
      }

      // Save current state as a new version before rollback
      await prisma.workflowVersion.create({
        data: {
          workflowId: workflow.id,
          versionNum: workflow.version,
          nodes: workflow.nodes as object,
          edges: workflow.edges as object,
          viewport: workflow.viewport ?? undefined,
          settings: workflow.settings ?? undefined,
          createdById: ctx.user.id,
          changeMessage: `Rollback to v${input.versionNum}`,
        },
      });

      // Update workflow with old version data
      return prisma.workflow.update({
        where: { id: input.workflowId },
        data: {
          nodes: version.nodes as object,
          edges: version.edges as object,
          viewport: version.viewport ?? undefined,
          settings: version.settings ?? undefined,
          version: { increment: 1 },
        },
      });
    }),

  // Delete a workflow
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.delete({
        where: { id: input.id },
      });
    }),

  // Duplicate a workflow
  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.create({
        data: {
          name: `${workflow.name} (Copy)`,
          description: workflow.description,
          nodes: workflow.nodes ?? [],
          edges: workflow.edges ?? [],
          settings: workflow.settings ?? undefined,
          userId: ctx.user.id,
          isActive: false,
        },
      });
    }),

  // Toggle workflow active status
  toggleActive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { isActive: !workflow.isActive },
      });
    }),

  // Execute a workflow manually
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Check monthly execution limits
      const teamMember = await prisma.teamMember.findFirst({
        where: { userId: ctx.user.id },
        include: { team: true },
      });

      if (teamMember) {
        const plan =
          ((
            teamMember.team as any
          ).plan?.toUpperCase() as keyof typeof PLANS) || "FREE";
        const limit =
          PLANS[plan]?.limits.executionsPerMonth ||
          PLANS.FREE.limits.executionsPerMonth;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const count = await prisma.execution.count({
          where: {
            workflow: { userId: ctx.user.id },
            startedAt: { gte: startOfMonth },
          },
        });

        if (count >= limit) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Monthly execution limit reached (${limit}). Upgrade to Pro for more capacity.`,
          });
        }
      }

      // Create execution record
      const execution = await prisma.execution.create({
        data: {
          workflowId: workflow.id,
          mode: "MANUAL",
          status: "PENDING",
          userId: ctx.user.id,
        },
      });

      const triggerData = {
        triggeredBy: ctx.user.id,
        triggeredAt: new Date().toISOString(),
      };

      // Execute workflow directly for reliability
      // Inngest's event-driven approach requires Inngest Cloud to call back
      // the app, which can fail silently — direct execution is more reliable
      try {
        await executeWorkflowDirect(workflow.id, execution.id, triggerData);
      } catch (execError) {
        console.error("[Workflow Execute] Direct execution failed:", execError);
        // Status is already updated to ERROR inside executeWorkflowDirect
      }

      // Update last executed time
      await prisma.workflow.update({
        where: { id: workflow.id },
        data: { lastExecutedAt: new Date() },
      });

      return { executionId: execution.id };
    }),

  // Export a workflow as JSON
  export: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      // Return workflow data without sensitive info
      return {
        name: workflow.name,
        description: workflow.description,
        nodes: workflow.nodes,
        edges: workflow.edges,
        viewport: workflow.viewport,
        settings: workflow.settings,
        folder: workflow.folder,
        tags: workflow.tags,
        version: workflow.version,
        exportedAt: new Date().toISOString(),
        exportVersion: "1.0",
      };
    }),

  // Import a workflow from JSON
  import: protectedProcedure
    .input(
      z.object({
        data: z.object({
          name: z.string(),
          description: z.string().optional(),
          nodes: z.any(),
          edges: z.any(),
          viewport: z.any().optional(),
          settings: z.any().optional(),
          folder: z.string().optional(),
          tags: z.array(z.string()).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = input;

      const workflow = await prisma.workflow.create({
        data: {
          name: `${data.name} (Imported)`,
          description: data.description,
          nodes: data.nodes || [],
          edges: data.edges || [],
          viewport: data.viewport,
          settings: data.settings,
          folder: data.folder,
          tags: data.tags || [],
          userId: ctx.user.id,
        },
      });

      return workflow;
    }),

  // Update workflow folder
  updateFolder: protectedProcedure
    .input(z.object({ id: z.string(), folder: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { folder: input.folder },
      });
    }),

  // Update workflow tags
  updateTags: protectedProcedure
    .input(z.object({ id: z.string(), tags: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { tags: input.tags },
      });
    }),

  // Toggle workflow favorite
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { isFavorite: !workflow.isFavorite },
      });
    }),

  // List favorite workflows
  listFavorites: protectedProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: { userId: ctx.user.id, isFavorite: true },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { executions: true } } },
    });
  }),

  // List recent workflows
  listRecent: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findMany({
        where: { userId: ctx.user.id },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: { _count: { select: { executions: true } } },
      });
    }),

  // Search workflows by name, description, tags, or folder
  search: protectedProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const searchTerm = input.query.toLowerCase();

      return prisma.workflow.findMany({
        where: {
          userId: ctx.user.id,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
            { folder: { contains: searchTerm, mode: "insensitive" } },
            { tags: { has: searchTerm } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { executions: true } } },
      });
    }),

  // Update error alert settings
  updateErrorAlerts: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        errorAlertEnabled: z.boolean(),
        errorAlertEmail: z.string().email().nullable().optional(),
        errorAlertSlack: z.string().url().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: {
          errorAlertEnabled: input.errorAlertEnabled,
          errorAlertEmail: input.errorAlertEmail,
          errorAlertSlack: input.errorAlertSlack,
        },
      });
    }),

  // Get webhook API documentation for a workflow
  getWebhookDocs: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        include: { webhooks: true },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      return {
        workflowName: workflow.name,
        endpoints: workflow.webhooks.map((wh) => ({
          id: wh.id,
          method: wh.method,
          url: `${baseUrl}/api/webhooks/${wh.path}`,
          path: wh.path,
          isActive: wh.isActive,
          example: {
            curl: `curl -X ${wh.method} "${baseUrl}/api/webhooks/${wh.path}" -H "Content-Type: application/json" -d '{"key": "value"}'`,
          },
        })),
        documentation: {
          description: "Webhook endpoints for this workflow",
          authentication: "No authentication required by default",
          rateLimit: "100 requests per minute",
          responseFormat: "JSON",
        },
      };
    }),
});
