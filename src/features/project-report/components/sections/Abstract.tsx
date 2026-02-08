export default function Abstract() {
  return (
    <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
      {/* Top Section: Title & Content - Added bottom padding to prevent footer overlap */}
      <div className="pt-12 pb-20">
        <div className="text-center mb-12">
          <h1 className="report-h1 text-3xl font-bold">ABSTRACT</h1>
          <div className="w-20 h-1 bg-black mx-auto mt-4" />
        </div>

        <div className="max-w-3xl mx-auto px-8 space-y-4 text-justify leading-relaxed text-[11pt]">
          <p className="report-paragraph text-sm first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            In the modern digital landscape, businesses face increasing pressure to
            automate repetitive tasks, integrate disparate systems, and streamline
            operational workflows. Traditional automation solutions often require
            significant technical expertise, creating barriers for non-technical users
            and small organizations. This project presents <strong>Flowgent 1.0</strong>,
            a visual workflow automation platform that democratizes process automation
            through an intuitive, no-code interface.
          </p>

          <p className="report-paragraph text-sm">
            Flowgent 1.0 enables users to design, execute, and monitor complex automation
            workflows using a drag-and-drop visual editor built with <strong>React Flow</strong>.
            The platform supports various trigger types including webhooks, scheduled
            (cron-based) execution, and manual triggers. It features a comprehensive
            node system with 20+ node types spanning HTTP operations, AI integrations,
            data transformation, conditional logic, and third-party service connections.
          </p>

          <p className="report-paragraph text-sm">
            The system architecture leverages modern technologies including:
          </p>

          <div className="border border-gray-400 p-3 my-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <p><strong>Frontend:</strong> Next.js 15, React 19, TypeScript</p>
                <p><strong>UI:</strong> Tailwind CSS, Shadcn/UI, React Flow</p>
                <p><strong>Backend:</strong> tRPC for type-safe APIs</p>
              </div>
              <div className="space-y-1">
                <p><strong>Database:</strong> PostgreSQL with Prisma ORM</p>
                <p><strong>Execution:</strong> Inngest for durable workflows</p>
                <p><strong>Auth:</strong> Better Auth with OAuth support</p>
              </div>
            </div>
          </div>

          <p className="report-paragraph text-sm">
            Key features include <strong>team collaboration</strong> with role-based access
            control (Owner, Admin, Member, Viewer), <strong>credential management</strong> with
            encrypted storage, <strong>AI-powered automation</strong> through integrations with
            OpenAI, Anthropic, and Google Gemini, and <strong>execution monitoring</strong> with
            detailed logs and analytics.
          </p>

          <p className="report-paragraph text-sm">
            The project follows the <strong>Agile methodology</strong> with two-week sprints,
            emphasizing iterative development and continuous feedback. The system was
            designed with scalability in mind, utilizing industry-standard practices
            for security, performance optimization, and maintainable code architecture.
          </p>

          <p className="report-paragraph text-sm font-medium text-center border border-gray-400 py-2 px-6 mt-4">
            Flowgent 1.0 represents a significant step toward making workflow automation
            accessible to all users, regardless of their technical background.
          </p>
        </div>

        {/* Keywords */}
        <div className="max-w-3xl mx-auto mt-6 px-8">
          <h3 className="font-bold text-black mb-2 text-sm">Keywords:</h3>
          <p className="text-xs text-gray-700">
            Workflow Automation, No-Code Platform, Visual Editor, Next.js,
            React Flow, Inngest, tRPC, AI Integration, Team Collaboration,
            Process Automation
          </p>
        </div>
      </div>

      {/* Footer - Absolute positioned */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">v</span>
      </div>
    </div>
  );
}
