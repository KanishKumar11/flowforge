import prisma from "@/lib/db";
import { executeWorkflowDirect } from "@/inngest/functions";
import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

interface RunParams {
  params: Promise<{ key: string }>;
}

function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: NextRequest, { params }: RunParams) {
  const { key } = await params;

  if (!key) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  const keyHash = hashKey(key);

  // Look up the API key
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash, isActive: true },
    include: { team: true },
  });

  if (!apiKey) {
    return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
  }

  // Check expiry
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return NextResponse.json({ error: "API key has expired" }, { status: 401 });
  }

  // Determine which workflow to run
  let workflowId = apiKey.workflowId;

  if (!workflowId) {
    // If no workflow bound to key, caller must specify via query param or body
    const url = new URL(request.url);
    const qWorkflowId = url.searchParams.get("workflowId");

    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      // body may be empty
    }

    workflowId = qWorkflowId ?? (body.workflowId as string | undefined) ?? null;
  }

  if (!workflowId) {
    return NextResponse.json(
      { error: "No workflowId bound to this API key. Pass ?workflowId= or include it in the request body." },
      { status: 400 },
    );
  }

  // Verify workflow belongs to the key's team
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, teamId: apiKey.teamId },
  });

  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  if (!workflow.isActive) {
    return NextResponse.json({ error: "Workflow is not active" }, { status: 400 });
  }

  // Parse input body
  let inputData: Record<string, unknown> = {};
  try {
    const raw = await request.text();
    if (raw) inputData = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // non-JSON body is fine
  }

  // Create execution record
  const execution = await prisma.execution.create({
    data: {
      workflowId: workflow.id,
      mode: "MANUAL",
      status: "PENDING",
      userId: apiKey.createdById,
    },
  });

  const triggerData: Record<string, unknown> = {
    triggeredBy: "api_key",
    apiKeyId: apiKey.id,
    triggeredAt: new Date().toISOString(),
    body: inputData,
  };

  // Update lastUsedAt
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  if (process.env.NODE_ENV === "development") {
    executeWorkflowDirect(workflow.id, execution.id, triggerData).catch(() => {});
  } else {
    await inngest.send({
      name: "workflow/execute",
      data: { workflowId: workflow.id, executionId: execution.id, triggerData },
    });
  }

  return NextResponse.json({ executionId: execution.id, status: "queued" }, { status: 202 });
}
