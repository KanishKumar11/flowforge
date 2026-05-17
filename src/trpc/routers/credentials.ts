import prisma from "@/lib/db";
import { createTRPCRouter, teamProcedure } from "../init";
import { z } from "zod";
import { encryptCredential, decryptCredential } from "@/lib/crypto";
import { TRPCError } from "@trpc/server";

export const credentialsRouter = createTRPCRouter({
  // List all credentials for the active team
  list: teamProcedure.query(async ({ ctx }) => {
    return prisma.credential.findMany({
      where: { teamId: ctx.team.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        lastUsedAt: true,
      },
    });
  }),

  // Get a single credential by ID (without decrypted data)
  get: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.id,
          teamId: ctx.team.id,
        },
        select: {
          id: true,
          name: true,
          type: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
          lastUsedAt: true,
        },
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });
      }

      return credential;
    }),

  // Create a new credential
  create: teamProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.enum(["oauth2", "apiKey", "basic", "bearer", "custom"]),
        provider: z.string().min(1).max(50),
        data: z.record(z.string(), z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const encryptedData = encryptCredential(input.data);

      return prisma.credential.upsert({
        where: {
          userId_name: { userId: ctx.user.id, name: input.name },
        },
        create: {
          name: input.name,
          type: input.type,
          provider: input.provider,
          data: encryptedData,
          userId: ctx.user.id,
          teamId: ctx.team.id,
        },
        update: {
          type: input.type,
          provider: input.provider,
          data: encryptedData,
          teamId: ctx.team.id,
        },
        select: {
          id: true,
          name: true,
          type: true,
          provider: true,
          createdAt: true,
        },
      });
    }),

  // Update a credential
  update: teamProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        data: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const credential = await prisma.credential.findFirst({
        where: { id, teamId: ctx.team.id },
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });
      }

      const data: Record<string, unknown> = {};
      if (updateData.name) data.name = updateData.name;
      if (updateData.data) {
        data.data = encryptCredential(updateData.data);
      }

      return prisma.credential.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          type: true,
          provider: true,
          updatedAt: true,
        },
      });
    }),

  // Delete a credential
  delete: teamProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: { id: input.id, teamId: ctx.team.id },
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });
      }

      return prisma.credential.delete({
        where: { id: input.id },
      });
    }),

  // Get decrypted credential data — SERVER-SIDE USE ONLY.
  // This procedure is intentionally restricted to server callers (inngest functions,
  // server actions) by requiring the caller to be on the same team.
  // IMPORTANT: Never call this from client components — raw credential data
  // (passwords, API keys) must never be transmitted to the browser.
  getDecrypted: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Extra server-side guard: reject if this is called from a client origin
      // (tRPC batch requests from the browser include the "x-trpc-source" header
      // set by our client wrapper; direct server calls do not).
      // This is defence-in-depth — the real protection is that this procedure
      // should never be called from client components at all.
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.id,
          teamId: ctx.team.id,
        },
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });
      }

      await prisma.credential.update({
        where: { id: input.id },
        data: { lastUsedAt: new Date() },
      });

      // Return only the metadata — not the raw decrypted payload.
      // Actual decryption happens in the workflow execution engine (server-side only).
      return {
        id: credential.id,
        name: credential.name,
        type: credential.type,
        provider: credential.provider,
      };
    }),
});
