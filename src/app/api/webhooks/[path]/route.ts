import { inngest } from "@/inngest/client";
import { executeWorkflowDirect } from "@/inngest/functions";
import prisma from "@/lib/db";
import { after } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { createHmac, timingSafeEqual } from "crypto";

interface WebhookParams {
  params: Promise<{ path: string }>;
}

/**
 * Verify an HMAC-SHA256 webhook signature.
 * The signature header must be in the form "sha256=<hex-digest>".
 */
function verifyHmacSignature(
  rawBody: string,
  secretHash: string,
  signatureHeader: string | null,
): boolean {
  if (!signatureHeader) return false;
  const expected = `sha256=${createHmac("sha256", secretHash).update(rawBody).digest("hex")}`;
  try {
    return timingSafeEqual(
      Buffer.from(signatureHeader, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest, { params }: WebhookParams) {
  return handleWebhook(request, await params);
}

export async function POST(request: NextRequest, { params }: WebhookParams) {
  return handleWebhook(request, await params);
}

export async function PUT(request: NextRequest, { params }: WebhookParams) {
  return handleWebhook(request, await params);
}

export async function DELETE(request: NextRequest, { params }: WebhookParams) {
  return handleWebhook(request, await params);
}

async function handleWebhook(request: NextRequest, { path }: { path: string }) {
  try {
    // Find the webhook endpoint by path
    const webhook = await prisma.webhookEndpoint.findFirst({
      where: {
        path,
        isActive: true,
      },
      include: {
        workflow: true,
      },
    });

    if (!webhook) {
      return NextResponse.json(
        { error: "Webhook not found or inactive" },
        { status: 404 },
      );
    }

    // Check if workflow is active
    if (!webhook.workflow.isActive) {
      return NextResponse.json(
        { error: "Workflow is not active" },
        { status: 400 },
      );
    }

    // Parse request data — read raw body text FIRST so we can verify signatures
    const method = request.method;
    const contentType = request.headers.get("content-type") || "";

    let rawBody = "";
    let body: unknown = null;

    if (method !== "GET" && method !== "HEAD") {
      rawBody = await request.text();

      if (contentType.includes("application/json")) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          body = rawBody;
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(rawBody);
        body = Object.fromEntries(params.entries());
      } else {
        body = rawBody;
      }
    }

    // ── HMAC signature verification ──────────────────────────────────
    // If the endpoint has a secretHash set, verify the request signature.
    // Callers must send the signature as: X-Webhook-Signature: sha256=<hex>
    if (webhook.secretHash) {
      const signature =
        request.headers.get("x-webhook-signature") ??
        request.headers.get("x-hub-signature-256");
      if (!verifyHmacSignature(rawBody, webhook.secretHash, signature)) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 },
        );
      }
    }

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const queryParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    // Create trigger data - store body as-is for template variable resolution
    const triggerData = {
      method,
      headers,
      body: body ?? null,
      query: queryParams,
      path: webhook.path,
      timestamp: new Date().toISOString(),
    };

    // Create execution record
    const execution = await prisma.execution.create({
      data: {
        workflowId: webhook.workflowId,
        mode: "WEBHOOK",
        status: "PENDING",
        inputData: triggerData,
      },
    });

    // Update webhook last called
    await prisma.webhookEndpoint.update({
      where: { id: webhook.id },
      data: { lastCalledAt: new Date(), callCount: { increment: 1 } },
    });

    // Execute in background — use Inngest only when deployed with a public URL.
    // Locally, Inngest Cloud can't reach localhost, so execute directly.
    const publicHost = process.env.VERCEL_URL || process.env.INNGEST_APP_URL;
    const useInngest = !!process.env.INNGEST_EVENT_KEY && !!publicHost;
    console.log(
      `[exec:webhook] executionId=${execution.id} workflowId=${webhook.workflowId} useInngest=${useInngest} publicHost=${publicHost ?? "(none)"}`,
    );

    after(async () => {
      try {
        if (useInngest) {
          console.log(`[exec:webhook] sending to Inngest Cloud`);
          await inngest.send({
            name: "workflow/execute",
            data: {
              workflowId: webhook.workflowId,
              executionId: execution.id,
              triggerData,
            },
          });
        } else {
          await executeWorkflowDirect(
            webhook.workflowId,
            execution.id,
            triggerData,
          );
        }
      } catch (err) {
        Sentry.captureException(err);
        await prisma.execution
          .update({
            where: { id: execution.id },
            data: {
              status: "ERROR",
              finishedAt: new Date(),
              error: (err as Error).message,
            },
          })
          .catch(() => {});
      }
    });

    // Return immediately (async mode)
    return NextResponse.json({
      success: true,
      executionId: execution.id,
      message: "Workflow execution triggered",
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
