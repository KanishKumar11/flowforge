import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";

export const credentialsRouter = createTRPCRouter({
  // List all credentials for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.credential.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        lastUsedAt: true,
        // Don't return the encrypted data in list view
      },
    });
  }),

  // Get a single credential by ID (without decrypted data)
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
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
        throw new Error("Credential not found");
      }

      return credential;
    }),

  // Create a new credential
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.enum(["oauth2", "apiKey", "basic", "bearer", "custom"]),
        provider: z.string().min(1).max(50),
        data: z.record(z.string(), z.any()), // The credential data to encrypt
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement proper AES-256 encryption
      // For now, we'll store as JSON string (NOT PRODUCTION READY)
      const encryptedData = JSON.stringify(input.data);

      return prisma.credential.create({
        data: {
          name: input.name,
          type: input.type,
          provider: input.provider,
          data: encryptedData,
          userId: ctx.user.id,
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
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        data: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify ownership
      const credential = await prisma.credential.findFirst({
        where: { id, userId: ctx.user.id },
      });

      if (!credential) {
        throw new Error("Credential not found");
      }

      const data: any = {};
      if (updateData.name) data.name = updateData.name;
      if (updateData.data) {
        // TODO: Implement proper encryption
        data.data = JSON.stringify(updateData.data);
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const credential = await prisma.credential.findFirst({
        where: { id: input.id, userId: ctx.user.id },
      });

      if (!credential) {
        throw new Error("Credential not found");
      }

      return prisma.credential.delete({
        where: { id: input.id },
      });
    }),

  // Get decrypted credential data (for workflow execution)
  getDecrypted: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!credential) {
        throw new Error("Credential not found");
      }

      // Update last used timestamp
      await prisma.credential.update({
        where: { id: input.id },
        data: { lastUsedAt: new Date() },
      });

      // TODO: Implement proper decryption
      const decryptedData = JSON.parse(credential.data);

      return {
        id: credential.id,
        name: credential.name,
        type: credential.type,
        provider: credential.provider,
        data: decryptedData,
      };
    }),
});
