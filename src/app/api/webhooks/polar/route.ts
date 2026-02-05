import { NextRequest, NextResponse } from "next/server";
import { WebhookVerificationError, validateEvent } from "@polar-sh/sdk/webhooks";
import prisma from "@/lib/db";
import { PLANS } from "@/lib/plans";

const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("polar-webhook-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const headers = {
      "polar-webhook-signature": signature,
    };
    event = validateEvent(rawBody, headers, WEBHOOK_SECRET);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  // Handle subscription events
  switch (event.type) {
    case "subscription.created":
    case "subscription.updated": {
      const subscription = event.data;
      // Polar SDK types might differ, verifying payload structure is tricky without strict types
      // But typically subscription object has user info or custom_fields.

      const email = (subscription as any).user?.email || (subscription as any).customer?.email;

      if (email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // Find user's personal team (where they are OWNER)
          const membership = await prisma.teamMember.findFirst({
            where: { userId: user.id, role: "OWNER" },
            include: { team: true }
          });

          if (membership) {
            // Determine plan based on product ID or name
            const isPro = subscription.product.name.toLowerCase().includes("pro");
            const newPlan = isPro ? "pro" : "free";

            if (membership.team.plan !== newPlan) {
              await prisma.team.update({
                where: { id: membership.team.id },
                data: { plan: newPlan }
              });
            }
          }
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
