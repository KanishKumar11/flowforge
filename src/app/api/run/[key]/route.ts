import prisma from "@/lib/db";
import { executeWorkflowDirect } from "@/inngest/functions";
import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { PLANS } from "@/lib/plans";

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
    return NextResponse.json(
      { error: "Invalid or inactive API key" },
      { status: 401 },
    );
  }

  // Check expiry
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return NextResponse.json({ error: "API key has expired" }, { status: 401 });
  }

  // Parse the body ONCE — may contain both workflowId and input fields
  let bodyJson: Record<string, unknown> = {};
  try {
    const raw = await request.text();
    if (raw) bodyJson = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // non-JSON body is fine — input will be empty
  }

  // Determine which workflow to run
  let workflowId = apiKey.workflowId;

  if (!workflowId) {
    // If no workflow bound to key, caller must specify via query param or body
    const url = new URL(request.url);
    const qWorkflowId = url.searchParams.get("workflowId");
    workflowId =
      qWorkflowId ?? (bodyJson.workflowId as string | undefined) ?? null;
  }

  if (!workflowId) {
    return NextResponse.json(
      {
        error:
          "No workflowId bound to this API key. Pass ?workflowId= or include it in the request body.",
      },
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
    return NextResponse.json(
      { error: "Workflow is not active" },
      { status: 400 },
    );
  }

  // ── Monthly execution limit check ──
  const plan = (apiKey.team.plan?.toUpperCase() as keyof typeof PLANS) || "FREE";
  const execLimit =
    PLANS[plan]?.limits.executionsPerMonth ??
    PLANS.FREE.limits.executionsPerMonth;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyCount = await prisma.execution.count({
    where: {
      workflow: { teamId: apiKey.teamId },
      startedAt: { gte: startOfMonth },
    },
  });

  if (monthlyCount >= execLimit) {
    return NextResponse.json(
      {
        error: `Monthly execution limit reached (${execLimit}). Upgrade your plan for more capacity.`,
      },
      { status: 429 },
    );
  }

  // Use the body we already parsed — exclude workflowId from the input payload
  const { workflowId: _wid, ...inputData } = bodyJson;

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

  const publicHost = process.env.VERCEL_URL || process.env.INNGEST_APP_URL;
  const useInngest = !!process.env.INNGEST_EVENT_KEY && !!publicHost;

  if (useInngest) {
    await inngest.send({
      name: "workflow/execute",
      data: { workflowId: workflow.id, executionId: execution.id, triggerData },
    });
  } else {
    executeWorkflowDirect(workflow.id, execution.id, triggerData).catch(
      async (err) => {
        console.error("[api/run] executeWorkflowDirect failed:", err);
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
      },
    );
  }

  return NextResponse.json(
    { executionId: execution.id, status: "queued" },
    { status: 202 },
  );
}
