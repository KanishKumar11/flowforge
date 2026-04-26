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

      return prisma.credential.create({
        data: {
          name: input.name,
          type: input.type,
          provider: input.provider,
          data: encryptedData,
          userId: ctx.user.id,
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

  // Get decrypted credential data (for workflow execution)
  getDecrypted: teamProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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

      const decryptedData = decryptCredential(credential.data);

      return {
        id: credential.id,
        name: credential.name,
        type: credential.type,
        provider: credential.provider,
        data: decryptedData,
      };
    }),
});
