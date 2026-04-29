import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { pollImapWorkflowOnce } from "@/inngest/functions";

/**
 * GET /api/cron/imap-poll
 *
 * Polls every active IMAP workflow. Protected by CRON_SECRET.
 * Called by Netlify Scheduled Functions or any external cron.
 *
 * netlify.toml:
 *   [[scheduled_functions]]
 *     function = "imap-poll"   # maps to this route via @netlify/plugin-nextjs
 *     cron = "* * * * *"
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") ?? "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const all = await prisma.workflow.findMany({
    where: { isActive: true },
    select: { id: true, nodes: true },
  });

  const imapWorkflows = all.filter((wf) => {
    const nodes = wf.nodes as unknown as Array<{
      type: string;
      data: { type: string };
    }>;
    return (
      Array.isArray(nodes) &&
      nodes.some((n) => n.type === "trigger" && n.data?.type === "email-inbox")
    );
  });

  const results: Record<string, unknown>[] = [];
  for (const wf of imapWorkflows) {
    const result = await pollImapWorkflowOnce(wf.id);
    results.push({ workflowId: wf.id, ...result });
  }

  return NextResponse.json({ polled: imapWorkflows.length, results });
}
