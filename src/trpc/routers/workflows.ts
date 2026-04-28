import { inngest } from "@/inngest/client";
import { executeWorkflowDirect } from "@/inngest/functions";
import prisma from "@/lib/db";
import { after } from "next/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  teamProcedure,
} from "../init";
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
  createFromTemplate: teamProcedure
    .input(z.object({ templateId: z.string(), name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const template = getTemplateById(input.templateId);
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      const plan =
        (ctx.team.plan?.toUpperCase() as keyof typeof PLANS) || "FREE";
      const limit =
        PLANS[plan]?.limits.workflows || PLANS.FREE.limits.workflows;

      const count = await prisma.workflow.count({
        where: { teamId: ctx.team.id },
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
          teamId: ctx.team.id,
        },
      });
    }),

  // List all workflows for the active team
  list: teamProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: { teamId: ctx.team.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { executions: true },
        },
      },
    });
  }),

  // Get a single workflow by ID
  get: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: {
          id: input.id,
          teamId: ctx.team.id,
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return workflow;
    }),

  // ... existing imports

  // Create a new workflow
  create: teamProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const plan =
        (ctx.team.plan?.toUpperCase() as keyof typeof PLANS) || "FREE";
      const limit =
        PLANS[plan]?.limits.workflows || PLANS.FREE.limits.workflows;

      const count = await prisma.workflow.count({
        where: { teamId: ctx.team.id },
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
          teamId: ctx.team.id,
          nodes: [],
          edges: [],
        },
      });
    }),

  // Update a workflow
  update: teamProcedure
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

      // Verify team ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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
  listVersions: teamProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify team ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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
  rollback: teamProcedure
    .input(z.object({ workflowId: z.string(), versionNum: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Verify team ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.workflowId, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Version not found",
        });
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
  delete: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify team ownership
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.delete({
        where: { id: input.id },
      });
    }),

  // Duplicate a workflow
  duplicate: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.create({
        data: {
          name: `${workflow.name} (Copy)`,
          description: workflow.description,
          nodes: workflow.nodes ?? [],
          edges: workflow.edges ?? [],
          settings: workflow.settings ?? undefined,
          userId: ctx.user.id,
          teamId: ctx.team.id,
          isActive: false,
        },
      });
    }),

  // Toggle workflow active status
  toggleActive: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { isActive: !workflow.isActive },
      });
    }),

  // Execute a workflow manually
  execute: teamProcedure
    .input(
      z.object({
        id: z.string(),
        inputData: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      // Check monthly execution limits based on team plan
      const plan =
        (ctx.team.plan?.toUpperCase() as keyof typeof PLANS) || "FREE";
      const limit =
        PLANS[plan]?.limits.executionsPerMonth ||
        PLANS.FREE.limits.executionsPerMonth;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const count = await prisma.execution.count({
        where: {
          workflow: { teamId: ctx.team.id },
          startedAt: { gte: startOfMonth },
        },
      });

      if (count >= limit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Monthly execution limit reached (${limit}). Upgrade to Pro for more capacity.`,
        });
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

      const triggerData: Record<string, unknown> = {
        triggeredBy: ctx.user.id,
        triggeredAt: new Date().toISOString(),
        ...(input.inputData ? { body: input.inputData } : {}),
      };

      // Use `after()` so Next.js keeps the process alive after the HTTP response
      // is sent. Without it, fire-and-forget tasks are killed in App Router.
      after(async () => {
        try {
          // Only use Inngest Cloud when deployed with a real public URL.
          // VERCEL_URL is auto-set on Vercel; INNGEST_APP_URL can be set for other hosts.
          // Locally (even with `next start`), Inngest Cloud can't reach localhost,
          // so we always execute directly.
          const publicHost =
            process.env.VERCEL_URL || process.env.INNGEST_APP_URL;
          const useInngest = !!process.env.INNGEST_EVENT_KEY && !!publicHost;

          if (useInngest) {
            // Deployed: delegate to Inngest for durability + step.sleep support
            await inngest.send({
              name: "workflow/execute",
              data: {
                workflowId: workflow.id,
                executionId: execution.id,
                triggerData,
              },
            });
          } else {
            // Local or no public URL: execute directly in-process
            await executeWorkflowDirect(workflow.id, execution.id, triggerData);
          }
        } catch (err) {
          console.error("[workflow/execute] execution failed:", err);
          // Mark as error so the UI doesn't stay stuck at PENDING
          await prisma.execution
            .update({
              where: { id: execution.id },
              data: {
                status: "ERROR",
                finishedAt: new Date(),
                error: (err as Error).message,
              },
            })
            .catch(() => {});
        }
      });

      return { executionId: execution.id };
    }),

  // Export a workflow as JSON
  export: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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
  import: teamProcedure
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
          teamId: ctx.team.id,
        },
      });

      return workflow;
    }),

  // Update workflow folder
  updateFolder: teamProcedure
    .input(z.object({ id: z.string(), folder: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { folder: input.folder },
      });
    }),

  // Update workflow tags
  updateTags: teamProcedure
    .input(z.object({ id: z.string(), tags: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { tags: input.tags },
      });
    }),

  // Toggle workflow favorite
  toggleFavorite: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: { isFavorite: !workflow.isFavorite },
      });
    }),

  // List favorite workflows
  listFavorites: teamProcedure.query(async ({ ctx }) => {
    return prisma.workflow.findMany({
      where: { teamId: ctx.team.id, isFavorite: true },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { executions: true } } },
    });
  }),

  // List recent workflows
  listRecent: teamProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ ctx, input }) => {
      return prisma.workflow.findMany({
        where: { teamId: ctx.team.id },
        orderBy: { updatedAt: "desc" },
        take: input.limit,
        include: { _count: { select: { executions: true } } },
      });
    }),

  // Search workflows by name, description, tags, or folder
  search: teamProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const searchTerm = input.query.toLowerCase();

      return prisma.workflow.findMany({
        where: {
          teamId: ctx.team.id,
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
  updateErrorAlerts: teamProcedure
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
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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

  // Update execution safety settings (timeout + concurrency)
  updateExecutionSettings: teamProcedure
    .input(
      z.object({
        id: z.string(),
        timeoutMs: z.number().int().min(0).nullable().optional(),
        maxConcurrency: z.number().int().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return prisma.workflow.update({
        where: { id: input.id },
        data: {
          timeoutMs: input.timeoutMs ?? null,
          maxConcurrency: input.maxConcurrency ?? 0,
        },
      });
    }),

  // Get webhook API documentation for a workflow
  getWebhookDocs: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
        include: { webhooks: true },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
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
