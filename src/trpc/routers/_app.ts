import { createTRPCRouter } from "../init";
import { workflowsRouter } from "./workflows";
import { credentialsRouter } from "./credentials";
import { executionsRouter } from "./executions";
import { schedulesRouter } from "./schedules";
import { webhooksRouter } from "./webhooks";
import { teamsRouter } from "./teams";
import { auditRouter } from "./audit";
import { apiKeysRouter } from "./apiKeys";
import {
  adminUsersRouter,
  adminAnalyticsRouter,
  adminFeatureFlagsRouter,
  adminAnnouncementsRouter,
  adminSettingsRouter,
  adminSupportRouter,
  adminLogsRouter,
  adminAIUsageRouter,
  adminWorkflowsRouter,
} from "./admin";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  schedules: schedulesRouter,
  webhooks: webhooksRouter,
  teams: teamsRouter,
  audit: auditRouter,
  apiKeys: apiKeysRouter,
  // Admin routers
  admin: createTRPCRouter({
    users: adminUsersRouter,
    analytics: adminAnalyticsRouter,
    featureFlags: adminFeatureFlagsRouter,
    announcements: adminAnnouncementsRouter,
    settings: adminSettingsRouter,
    support: adminSupportRouter,
    logs: adminLogsRouter,
    aiUsage: adminAIUsageRouter,
    workflows: adminWorkflowsRouter,
  }),
});

export type AppRouter = typeof appRouter;
