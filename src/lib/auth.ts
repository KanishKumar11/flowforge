import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";
import { checkout, polar, portal } from "@polar-sh/better-auth";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "30e0628d-a01c-4af7-8abc-baa5b1d57e27",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const name = user.name || "User";
          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          await prisma.team.create({
            data: {
              name: `${user.name}'s Workspace`,
              slug: `${slug}-${Date.now().toString(36)}`,
              description: "Your default personal workspace",
              members: {
                create: {
                  userId: user.id,
                  role: "OWNER",
                },
              },
            },
          });
        },
      },
    },
  },
});
