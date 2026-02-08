export default function Annexures() {
  return (
    <div className="report-page report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Annexures</span>
      </div>

      <div className="text-center mb-6">
        <h1 className="report-h1 text-3xl font-bold">ANNEXURES</h1>
        <div className="w-20 h-1 bg-black mx-auto mt-4" />
      </div>

      <h3 className="report-h3 mt-5">Annexure A: Project Repository</h3>
      <div className="my-3 p-4 border border-gray-400">
        <p className="text-sm space-y-2">
          <span className="block"><strong>Project Name:</strong> Flowgent 1.0 - Visual Workflow Automation Platform</span>
          <span className="block"><strong>Developer:</strong> Kanish Kumar (Roll No: 11792312331)</span>
          <span className="block"><strong>Institution:</strong> Hindu College, Amritsar</span>
          <span className="block"><strong>GitHub Repository:</strong> [Repository URL]</span>
          <span className="block"><strong>Live Demo:</strong> [Deployment URL]</span>
        </p>
      </div>

      <h3 className="report-h3 mt-5">Annexure B: Technology Versions</h3>
      <table className="report-table avoid-break text-sm">
        <thead>
          <tr>
            <th>Technology</th>
            <th>Version</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Node.js</td><td>20.x LTS</td><td>JavaScript Runtime</td></tr>
          <tr><td>Next.js</td><td>15.1.1</td><td>React Framework</td></tr>
          <tr><td>React</td><td>19.x</td><td>UI Library</td></tr>
          <tr><td>TypeScript</td><td>5.x</td><td>Type-Safe JavaScript</td></tr>
          <tr><td>Prisma</td><td>7.2.0</td><td>Database ORM</td></tr>
          <tr><td>PostgreSQL</td><td>14+</td><td>Primary Database</td></tr>
          <tr><td>Inngest</td><td>3.49.3</td><td>Workflow Execution</td></tr>
          <tr><td>tRPC</td><td>11.x</td><td>Type-Safe APIs</td></tr>
          <tr><td>Tailwind CSS</td><td>4.x</td><td>Utility CSS Framework</td></tr>
          <tr><td>React Flow</td><td>12.10.0</td><td>Visual Editor</td></tr>
          <tr><td>Better Auth</td><td>1.x</td><td>Authentication</td></tr>
          <tr><td>Vitest</td><td>Latest</td><td>Testing Framework</td></tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-5">Annexure C: Environment Variables</h3>
      <table className="report-table avoid-break text-xs">
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>DATABASE_URL</td><td>PostgreSQL connection string</td><td>Yes</td></tr>
          <tr><td>BETTER_AUTH_SECRET</td><td>Auth encryption key (32+ chars)</td><td>Yes</td></tr>
          <tr><td>BETTER_AUTH_URL</td><td>Base URL for auth callbacks</td><td>Yes</td></tr>
          <tr><td>INNGEST_EVENT_KEY</td><td>Inngest event signing key</td><td>Yes</td></tr>
          <tr><td>INNGEST_SIGNING_KEY</td><td>Inngest webhook verification</td><td>Yes</td></tr>
          <tr><td>OPENAI_API_KEY</td><td>OpenAI API key for AI nodes</td><td>No</td></tr>
          <tr><td>ANTHROPIC_API_KEY</td><td>Anthropic Claude API key</td><td>No</td></tr>
          <tr><td>GOOGLE_GENERATIVE_AI_API_KEY</td><td>Google Gemini API key</td><td>No</td></tr>
          <tr><td>CREDENTIAL_ENCRYPTION_KEY</td><td>Key for encrypting credentials</td><td>Yes</td></tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-5">Annexure D: Database Schema Summary</h3>
      <table className="report-table avoid-break text-xs">
        <thead>
          <tr>
            <th>Table Name</th>
            <th>Primary Key</th>
            <th>Key Relationships</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>User</td><td>id (CUID)</td><td>Has many: Workflows, Credentials, TeamMembers</td></tr>
          <tr><td>Workflow</td><td>id (CUID)</td><td>Belongs to: User, Team. Has many: Executions, Schedules</td></tr>
          <tr><td>Execution</td><td>id (CUID)</td><td>Belongs to: Workflow</td></tr>
          <tr><td>Credential</td><td>id (CUID)</td><td>Belongs to: User</td></tr>
          <tr><td>Team</td><td>id (CUID)</td><td>Has many: TeamMembers, Workflows</td></tr>
          <tr><td>TeamMember</td><td>id (CUID)</td><td>Belongs to: User, Team</td></tr>
          <tr><td>Schedule</td><td>id (CUID)</td><td>Belongs to: Workflow</td></tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-5">Annexure E: Glossary of Terms</h3>
      <table className="report-table avoid-break text-sm">
        <thead>
          <tr>
            <th>Term</th>
            <th>Definition</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Workflow</strong></td><td>A sequence of automated tasks connected together to perform a business process</td></tr>
          <tr><td><strong>Node</strong></td><td>A single step or action in a workflow (e.g., HTTP request, AI call, condition)</td></tr>
          <tr><td><strong>Edge</strong></td><td>A connection between two nodes indicating data flow direction</td></tr>
          <tr><td><strong>Trigger</strong></td><td>An event that initiates a workflow execution (webhook, schedule, manual)</td></tr>
          <tr><td><strong>Execution</strong></td><td>A single instance of a workflow running with specific input data</td></tr>
          <tr><td><strong>Credential</strong></td><td>Encrypted authentication data for accessing external services</td></tr>
          <tr><td><strong>RBAC</strong></td><td>Role-Based Access Control for managing team permissions</td></tr>
          <tr><td><strong>Webhook</strong></td><td>An HTTP endpoint that triggers workflow execution when called</td></tr>
          <tr><td><strong>Cron</strong></td><td>A time-based scheduling expression for automated triggers</td></tr>
          <tr><td><strong>Durable Execution</strong></td><td>Workflow execution that survives failures and can resume from last state</td></tr>
        </tbody>
      </table>

      {/* End of Report */}
      <div className="mt-12 pt-6 border-t-4 border-double border-gray-400">
        <div className="text-center space-y-3">
          <div className="inline-block px-8 py-4 border border-gray-400">
            <p className="text-2xl font-bold text-black">--- End of Report ---</p>
          </div>
          <p className="text-sm text-gray-600">
            Project Report submitted by <strong>Kanish Kumar</strong> (Roll No: 11792312331)
          </p>
          <p className="text-sm text-gray-600">
            Bachelor of Computer Applications (BCA) | Academic Year: 2025-2026
          </p>
          <p className="text-sm text-gray-600">
            Hindu College, Dhab Khatikan, Amritsar - 143001, Punjab
          </p>
          <p className="text-xs text-gray-500 mt-3">
            Under the guidance of <strong>Mr. Anshuman Sharma</strong> & <strong>Dr. Sunny Sharma</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
