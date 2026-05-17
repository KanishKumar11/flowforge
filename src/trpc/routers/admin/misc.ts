import { adminProcedure, createTRPCRouter, superAdminProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { logAdminAction } from "@/lib/admin-utils";

export const adminFeatureFlagsRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  }),

  upsert: adminProcedure
    .input(
      z.object({
        id: z.string().optional(),
        key: z.string().regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
        name: z.string().min(1),
        description: z.string().optional(),
        enabled: z.boolean().default(false),
        rolloutPct: z.number().min(0).max(100).default(0),
        targetUsers: z.array(z.string()).default([]),
        metadata: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const prismaData = data as Parameters<typeof prisma.featureFlag.create>[0]["data"];
      const flag = id
        ? await prisma.featureFlag.update({ where: { id }, data: prismaData })
        : await prisma.featureFlag.create({ data: prismaData });
      await logAdminAction(
        ctx.adminUser.id,
        id ? "UPDATE_FEATURE_FLAG" : "CREATE_FEATURE_FLAG",
        "feature_flag",
        flag.id,
        { key: flag.key, enabled: flag.enabled },
      );
      return flag;
    }),

  toggle: adminProcedure
    .input(z.object({ id: z.string(), enabled: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const flag = await prisma.featureFlag.update({
        where: { id: input.id },
        data: { enabled: input.enabled },
      });
      await logAdminAction(
        ctx.adminUser.id,
        "TOGGLE_FEATURE_FLAG",
        "feature_flag",
        input.id,
        { enabled: input.enabled },
      );
      return flag;
    }),

  delete: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.featureFlag.delete({ where: { id: input.id } });
      await logAdminAction(
        ctx.adminUser.id,
        "DELETE_FEATURE_FLAG",
        "feature_flag",
        input.id,
      );
      return { success: true };
    }),
});

export const adminAnnouncementsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        onlyActive: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      const where = input.onlyActive ? { isActive: true } : {};
      const skip = (input.page - 1) * input.limit;
      const [items, total] = await Promise.all([
        prisma.announcement.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
        }),
        prisma.announcement.count({ where }),
      ]);
      return { items, total };
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        message: z.string().min(1),
        type: z.enum(["INFO", "WARNING", "SUCCESS", "MAINTENANCE"]).default("INFO"),
        targetAudience: z.string().default("all"),
        scheduledAt: z.string().datetime().optional(),
        expiresAt: z.string().datetime().optional(),
        isDismissable: z.boolean().default(true),
        ctaText: z.string().optional(),
        ctaUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const item = await prisma.announcement.create({
        data: {
          ...input,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        },
      });
      await logAdminAction(
        ctx.adminUser.id,
        "CREATE_ANNOUNCEMENT",
        "announcement",
        item.id,
      );
      return item;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        message: z.string().min(1).optional(),
        isActive: z.boolean().optional(),
        expiresAt: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, expiresAt, ...rest } = input;
      const item = await prisma.announcement.update({
        where: { id },
        data: {
          ...rest,
          ...(expiresAt ? { expiresAt: new Date(expiresAt) } : {}),
        },
      });
      await logAdminAction(
        ctx.adminUser.id,
        "UPDATE_ANNOUNCEMENT",
        "announcement",
        id,
      );
      return item;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.announcement.delete({ where: { id: input.id } });
      await logAdminAction(
        ctx.adminUser.id,
        "DELETE_ANNOUNCEMENT",
        "announcement",
        input.id,
      );
      return { success: true };
    }),
});

export const adminSettingsRouter = createTRPCRouter({
  list: adminProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input }) => {
      return prisma.systemSetting.findMany({
        where: input.category ? { category: input.category } : undefined,
        orderBy: [{ category: "asc" }, { key: "asc" }],
      });
    }),

  set: superAdminProcedure
    .input(
      z.object({
        key: z.string().min(1),
        value: z.unknown(),
        category: z.string().default("general"),
        isPublic: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const setting = await prisma.systemSetting.upsert({
        where: { key: input.key },
        create: {
          key: input.key,
          value: input.value as never,
          category: input.category,
          isPublic: input.isPublic,
        },
        update: {
          value: input.value as never,
          category: input.category,
          isPublic: input.isPublic,
        },
      });
      await logAdminAction(
        ctx.adminUser.id,
        "UPDATE_SETTING",
        "system_setting",
        setting.id,
        { key: input.key },
      );
      return setting;
    }),
});

export const adminSupportRouter = createTRPCRouter({
  listTickets: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        status: z
          .enum(["OPEN", "IN_PROGRESS", "WAITING_FOR_USER", "RESOLVED", "CLOSED"])
          .optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Record<string, unknown> = {};
      if (input.status) where.status = input.status;
      if (input.priority) where.priority = input.priority;
      if (input.search) {
        where.OR = [
          { subject: { contains: input.search, mode: "insensitive" } },
          { user: { email: { contains: input.search, mode: "insensitive" } } },
        ];
      }
      const [tickets, total] = await Promise.all([
        prisma.supportTicket.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            _count: { select: { messages: true } },
          },
        }),
        prisma.supportTicket.count({ where }),
      ]);
      return { tickets, total };
    }),

  getTicket: adminProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ input }) => {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: input.ticketId },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
          messages: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      return ticket;
    }),

  replyToTicket: adminProcedure
    .input(
      z.object({
        ticketId: z.string(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const msg = await prisma.supportTicketMessage.create({
        data: {
          ticketId: input.ticketId,
          authorId: ctx.adminUser.userId,
          isAdmin: true,
          content: input.content,
        },
      });
      await prisma.supportTicket.update({
        where: { id: input.ticketId },
        data: { status: "IN_PROGRESS", updatedAt: new Date() },
      });
      return msg;
    }),

  updateTicket: adminProcedure
    .input(
      z.object({
        ticketId: z.string(),
        status: z
          .enum(["OPEN", "IN_PROGRESS", "WAITING_FOR_USER", "RESOLVED", "CLOSED"])
          .optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        assignedTo: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { ticketId, ...data } = input;
      const ticket = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
          ...data,
          ...(data.status === "RESOLVED" ? { resolvedAt: new Date() } : {}),
        },
      });
      await logAdminAction(
        ctx.adminUser.id,
        "UPDATE_SUPPORT_TICKET",
        "support_ticket",
        ticketId,
        data,
      );
      return ticket;
    }),

  ticketStats: adminProcedure.query(async () => {
    const [open, inProgress, resolved, critical] = await Promise.all([
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
      prisma.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
      prisma.supportTicket.count({
        where: { priority: "CRITICAL", status: { not: "CLOSED" } },
      }),
    ]);
    return { open, inProgress, resolved, critical };
  }),
});

export const adminLogsRouter = createTRPCRouter({
  list: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        action: z.string().optional(),
        adminUserId: z.string().optional(),
        dateFrom: z.string().datetime().optional(),
        dateTo: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Record<string, unknown> = {};
      if (input.action)
        where.action = { contains: input.action, mode: "insensitive" };
      if (input.adminUserId) where.adminUserId = input.adminUserId;
      if (input.dateFrom || input.dateTo) {
        where.createdAt = {
          ...(input.dateFrom ? { gte: new Date(input.dateFrom) } : {}),
          ...(input.dateTo ? { lte: new Date(input.dateTo) } : {}),
        };
      }
      const [logs, total] = await Promise.all([
        prisma.adminAuditLog.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
          include: {
            adminUser: {
              include: { user: { select: { name: true, email: true } } },
            },
          },
        }),
        prisma.adminAuditLog.count({ where }),
      ]);
      return { logs, total };
    }),

  systemLogs: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        entity: z.string().optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Record<string, unknown> = {};
      if (input.entity) where.entity = input.entity;
      if (input.userId) where.userId = input.userId;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        }),
        prisma.auditLog.count({ where }),
      ]);
      return { logs, total };
    }),
});
