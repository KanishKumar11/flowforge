import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import prisma from "@/lib/db";

export const teamsRouter = createTRPCRouter({
  // List teams the user belongs to
  list: protectedProcedure.query(async ({ ctx }) => {
    const memberships = await prisma.teamMember.findMany({
      where: { userId: ctx.user.id },
      include: {
        team: {
          include: {
            _count: { select: { members: true, workflows: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return memberships.map((m) => ({
      ...m.team,
      role: m.role,
      memberCount: m.team._count.members,
      workflowCount: m.team._count.workflows,
    }));
  }),

  // Get a single team by ID
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.id, userId: ctx.user.id },
        },
        include: {
          team: {
            include: {
              members: {
                include: { user: { select: { id: true, name: true, email: true, image: true } } },
              },
              _count: { select: { workflows: true } },
            },
          },
        },
      });

      if (!membership) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
      }

      return {
        ...membership.team,
        currentUserRole: membership.role,
      };
    }),

  // Create a new team
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const team = await prisma.team.create({
        data: {
          name: input.name,
          slug: `${slug}-${Date.now().toString(36)}`,
          description: input.description,
          members: {
            create: {
              userId: ctx.user.id,
              role: "OWNER",
            },
          },
        },
      });

      return team;
    }),

  // Update team details
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is OWNER or ADMIN
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.id, userId: ctx.user.id },
        },
      });

      if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      const team = await prisma.team.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      return team;
    }),

  // Invite a member to the team
  invite: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        email: z.string().email(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is OWNER or ADMIN
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.teamId, userId: ctx.user.id },
        },
      });

      if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Find user by email
      const invitee = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!invitee) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Check if already a member
      const existing = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.teamId, userId: invitee.id },
        },
      });

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "User is already a member" });
      }

      const member = await prisma.teamMember.create({
        data: {
          teamId: input.teamId,
          userId: invitee.id,
          role: input.role,
        },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      });

      return member;
    }),

  // Remove a member from the team
  removeMember: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is OWNER or ADMIN
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.teamId, userId: ctx.user.id },
        },
      });

      if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      // Can't remove the owner
      const targetMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.teamId, userId: input.userId },
        },
      });

      if (targetMember?.role === "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot remove the owner" });
      }

      await prisma.teamMember.delete({
        where: {
          teamId_userId: { teamId: input.teamId, userId: input.userId },
        },
      });

      return { success: true };
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is OWNER
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.teamId, userId: ctx.user.id },
        },
      });

      if (!membership || membership.role !== "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can change roles" });
      }

      const member = await prisma.teamMember.update({
        where: {
          teamId_userId: { teamId: input.teamId, userId: input.userId },
        },
        data: { role: input.role },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      });

      return member;
    }),

  // Delete team
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is OWNER
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: { teamId: input.id, userId: ctx.user.id },
        },
      });

      if (!membership || membership.role !== "OWNER") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can delete team" });
      }

      await prisma.team.delete({ where: { id: input.id } });

      return { success: true };
    }),
});
