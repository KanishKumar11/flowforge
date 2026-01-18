import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";
import { checkout, polar, portal } from "@polar-sh/better-auth"
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
      use: [checkout({
        products: [
          {
            productId: "30e0628d-a01c-4af7-8abc-baa5b1d57e27",
            slug: "pro",

          }
        ],
        successUrl: process.env.POLAR_SUCCESS_URL,
        authenticatedUsersOnly: true,
      }), portal(),]
    })
  ],
});
