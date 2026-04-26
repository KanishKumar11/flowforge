import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import prisma from "@/lib/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  return {};
});
const t = initTRPC.create({});
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const publicProcedure = baseProcedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
  }
  return next({ ctx: { ...ctx, user: session.user, session } });
});

/**
 * teamProcedure — resolves the active team from the `x-team-id` request header
 * and verifies the caller is a member of that team. Adds `team` and `teamRole`
 * to the tRPC context for downstream authorization checks.
 */
export const teamProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const reqHeaders = await headers();
  const teamId = reqHeaders.get("x-team-id");

  if (!teamId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing x-team-id header",
    });
  }

  const membership = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: ctx.user.id } },
    include: { team: true },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this team",
    });
  }

  return next({
    ctx: {
      ...ctx,
      team: membership.team,
      teamRole: membership.role,
    },
  });
});

export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.user.id,
    });
    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Active subscription required",
      });
    }

    return next({ ctx: { ...ctx, customer } });
  },
);
