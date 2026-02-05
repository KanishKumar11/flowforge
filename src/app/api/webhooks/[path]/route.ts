import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface WebhookParams {
  params: Promise<{ path: string }>;
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

    // Parse request data
    const method = request.method;
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let body: unknown = null;
    const contentType = request.headers.get("content-type") || "";

    if (method !== "GET" && method !== "HEAD") {
      if (contentType.includes("application/json")) {
        try {
          body = await request.json();
        } catch {
          body = await request.text();
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
      } else {
        body = await request.text();
      }
    }

    const queryParams = Object.fromEntries(
      request.nextUrl.searchParams.entries(),
    );

    // Create trigger data - serialize to JSON-compatible format
    const triggerData = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
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

    // Send workflow execution event
    await inngest.send({
      name: "workflow/execute",
      data: {
        workflowId: webhook.workflowId,
        executionId: execution.id,
        triggerData,
      },
    });

    // Return immediately (async mode)
    return NextResponse.json({
      success: true,
      executionId: execution.id,
      message: "Workflow execution triggered",
    });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 },
    );
  }
}
