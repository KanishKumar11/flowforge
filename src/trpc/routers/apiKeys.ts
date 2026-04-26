import { createTRPCRouter, teamProcedure } from "../init";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/db";
import { createHash, randomBytes } from "crypto";

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function generateKey(): { raw: string; prefix: string; hash: string } {
  const raw = `fg_${randomBytes(24).toString("base64url")}`;
  const prefix = raw.slice(0, 12);
  const hash = hashKey(raw);
  return { raw, prefix, hash };
}

export const apiKeysRouter = createTRPCRouter({
  // List all API keys for the active team (never returns full key)
  list: teamProcedure.query(async ({ ctx }) => {
    return prisma.apiKey.findMany({
      where: { teamId: ctx.team.id },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });
  }),

  // Create a new API key — returns the raw key ONCE
  create: teamProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        workflowId: z.string().optional(),
        expiresAt: z.string().datetime().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify workflowId belongs to team if provided
      if (input.workflowId) {
        const workflow = await prisma.workflow.findFirst({
          where: { id: input.workflowId, teamId: ctx.team.id },
        });
        if (!workflow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workflow not found",
          });
        }
      }

      const { raw, prefix, hash } = generateKey();

      const apiKey = await prisma.apiKey.create({
        data: {
          name: input.name,
          keyHash: hash,
          keyPrefix: prefix,
          workflowId: input.workflowId ?? null,
          teamId: ctx.team.id,
          createdById: ctx.user.id,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
        },
      });

      // Return the raw key ONLY at creation time — never stored in plaintext
      return { ...apiKey, rawKey: raw };
    }),

  // Revoke (deactivate) an API key
  revoke: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await prisma.apiKey.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });
      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }
      return prisma.apiKey.update({
        where: { id: input.id },
        data: { isActive: false },
      });
    }),

  // Delete an API key permanently
  delete: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await prisma.apiKey.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });
      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }
      return prisma.apiKey.delete({ where: { id: input.id } });
    }),

  // Rotate: revoke old key, create new one (same name / settings)
  rotate: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await prisma.apiKey.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });
      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }

      const { raw, prefix, hash } = generateKey();

      await prisma.apiKey.update({
        where: { id: input.id },
        data: { isActive: false },
      });

      const newKey = await prisma.apiKey.create({
        data: {
          name: apiKey.name,
          keyHash: hash,
          keyPrefix: prefix,
          workflowId: apiKey.workflowId,
          teamId: ctx.team.id,
          createdById: ctx.user.id,
          expiresAt:
            apiKey.expiresAt && apiKey.expiresAt > new Date()
              ? apiKey.expiresAt
              : null,
        },
      });

      return { ...newKey, rawKey: raw };
    }),
});
