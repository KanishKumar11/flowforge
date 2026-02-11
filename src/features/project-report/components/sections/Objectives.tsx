export default function Objectives() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Chapter 3: Project Objectives
        </span>
      </div>

      <h2 className="report-h2">2.3 Project Objectives</h2>

      <p className="report-paragraph">
        The primary objective of this project is to design and develop a
        comprehensive visual workflow automation platform that addresses the
        identified challenges. The specific objectives are:
      </p>

      <h3 className="report-h3 mt-6">2.3.1 Primary Objectives</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Visual Workflow Design:</strong> Create an intuitive
          drag-and-drop interface that allows users to design workflows without
          programming knowledge
        </li>
        <li>
          <strong>Reliable Execution Engine:</strong> Implement a durable
          execution engine with built-in retry mechanisms, state persistence,
          and error handling
        </li>
        <li>
          <strong>Multi-Trigger Support:</strong> Enable workflows to be
          triggered manually, via webhooks, or on schedules using cron
          expressions
        </li>
        <li>
          <strong>Service Integrations:</strong> Provide ready-to-use
          integrations with popular services including Slack, Notion, Email, and
          HTTP APIs
        </li>
        <li>
          <strong>AI Capabilities:</strong> Integrate AI models from OpenAI,
          Anthropic, and Google for intelligent automation tasks
        </li>
      </ol>

      <h3 className="report-h3 mt-6">2.3.2 Secondary Objectives</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Team Collaboration:</strong> Implement role-based access
          control for team environments with owner, admin, member, and viewer
          roles
        </li>
        <li>
          <strong>Credential Security:</strong> Securely store and manage API
          keys and credentials with encryption at rest
        </li>
        <li>
          <strong>Execution Monitoring:</strong> Provide comprehensive logging,
          execution history, and debugging capabilities
        </li>
        <li>
          <strong>Version Control:</strong> Enable workflow versioning with the
          ability to rollback to previous versions
        </li>
        <li>
          <strong>Audit Trails:</strong> Maintain detailed audit logs for
          compliance and security purposes
        </li>
      </ol>

      <h3 className="report-h3 mt-6">2.3.3 Technical Objectives</h3>
      <ol className="report-list list-decimal">
        <li>
          Utilize modern web technologies: Next.js 16, React 19, TypeScript
        </li>
        <li>Implement type-safe API layer using tRPC</li>
        <li>Use PostgreSQL with Prisma ORM for data persistence</li>
        <li>Leverage Inngest for durable function execution</li>
        <li>Implement responsive UI with Tailwind CSS and Shadcn/UI</li>
        <li>Ensure security through Better Auth with OAuth support</li>
      </ol>

      <h2 className="report-h2 mt-8">2.4 Expected Outcomes</h2>
      <ul className="report-list list-disc">
        <li>
          A fully functional workflow automation platform deployable on cloud
          infrastructure
        </li>
        <li>Comprehensive documentation for users and administrators</li>
        <li>Test suite covering core functionality</li>
        <li>Scalable architecture supporting concurrent workflow executions</li>
        <li>User-friendly interface requiring minimal training</li>
      </ul>
    </div>
  );
}
