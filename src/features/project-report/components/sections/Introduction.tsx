export default function Introduction() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Chapter 1: Introduction
        </span>
      </div>

      <div className="text-center mb-6">
        <div className="inline-block px-5 py-2 bg-black text-white mb-4">
          <span className="text-sm font-medium tracking-wider">CHAPTER 1</span>
        </div>
        <h1 className="report-h1 mt-2 text-3xl font-bold">INTRODUCTION</h1>
        <div className="w-20 h-1 bg-black mx-auto mt-4" />
      </div>

      <div className="max-w-3xl mx-auto px-8 space-y-5 text-justify leading-relaxed">
        <h2 className="report-h2 text-xl font-bold">1.1 Project Overview</h2>

        <p className="report-paragraph text-base first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
          <strong>Flowgent 1.0</strong> is a modern, visual workflow automation
          platform that empowers users to design, execute, and monitor automated
          workflows through an intuitive drag-and-drop interface. Built as a
          full-stack web application, it addresses the growing need for
          accessible automation tools that don't require programming expertise.
        </p>

        <p className="report-paragraph text-base">
          The platform enables users to automate repetitive tasks, integrate
          various services, and create sophisticated business processes using a
          visual canvas where nodes represent individual actions and edges
          define the flow of data and execution.
        </p>

        <div className="border border-gray-400 p-4 my-5">
          <h4 className="font-bold text-black mb-3">Core Features:</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Visual Workflow Editor
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              20+ Node Types
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Webhook & Cron Triggers
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              AI Integrations
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Team Collaboration
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Execution Monitoring
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Credential Management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Role-Based Access Control
            </li>
          </ul>
        </div>

        <h2 className="report-h2 text-xl font-bold mt-6">
          1.2 Background & Motivation
        </h2>

        <p className="report-paragraph text-base">
          The digital transformation of businesses has created an unprecedented
          demand for automation solutions. According to industry reports,
          businesses spend approximately{" "}
          <strong>30-40% of their time on repetitive, manual tasks</strong> that
          could be automated.
        </p>

        <p className="report-paragraph text-base">
          While enterprise automation platforms like Zapier, Make (formerly
          Integromat), and n8n exist, they often come with significant costs,
          learning curves, or limitations. Small and medium businesses
          frequently find these solutions either too expensive or too complex
          for their needs.
        </p>

        <p className="report-paragraph text-base">
          The motivation behind Flowgent 1.0 stems from the desire to create an
          <strong> open, accessible, and developer-friendly</strong> automation
          platform that combines the ease of no-code tools with the power and
          flexibility required by technical users.
        </p>

        <h2 className="report-h2 text-xl font-bold mt-6">
          1.3 Scope of the Project
        </h2>

        <p className="report-paragraph text-base">
          The scope of Flowgent 1.0 encompasses the following functional areas:
        </p>

        <div className="grid grid-cols-1 gap-2 my-4">
          <div className="border-l-4 border-black pl-4 py-2">
            <strong>User Management:</strong> Complete authentication system
            with email/password and OAuth support, user profiles, and session
            management.
          </div>
          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <strong>Workflow Design:</strong> Visual editor with drag-and-drop
            functionality, node palette, configuration panels, and canvas
            controls.
          </div>
          <div className="border-l-4 border-black pl-4 py-2">
            <strong>Execution Engine:</strong> Durable workflow execution using
            Inngest, supporting parallel processing and automatic retries.
          </div>
          <div className="border-l-4 border-gray-400 pl-4 py-2">
            <strong>Team Collaboration:</strong> Multi-user teams with
            role-based permissions (Owner, Admin, Member, Viewer).
          </div>
        </div>

        <h2 className="report-h2 text-xl font-bold mt-6">
          1.4 Report Organization
        </h2>

        <p className="report-paragraph text-base">
          This report is organized into eight chapters, each covering a specific
          aspect of the project development:
        </p>

        <table className="w-full text-sm my-4 border border-gray-400">
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 1
              </td>
              <td className="py-2 px-3">
                Introduction to the project and its scope
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 2
              </td>
              <td className="py-2 px-3">
                Problem Statement and existing system analysis
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 3
              </td>
              <td className="py-2 px-3">
                Project Objectives (primary, secondary, technical)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 4
              </td>
              <td className="py-2 px-3">
                Feasibility Study: technical, economic, operational, schedule,
                legal, SWOT
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 5
              </td>
              <td className="py-2 px-3">
                Project Estimation & Planning (COCOMO, effort estimation, risk
                assessment)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 6
              </td>
              <td className="py-2 px-3">
                Software Development Life Cycle (SDLC, requirement gathering,
                SRS)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 7
              </td>
              <td className="py-2 px-3">
                System Design (DFD, Use Case, ER diagrams, architecture, DB
                schema)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 8
              </td>
              <td className="py-2 px-3">
                Implementation (code architecture, frontend, backend,
                deployment)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 9
              </td>
              <td className="py-2 px-3">
                Testing (strategy, unit/integration/UI/security/performance)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 10
              </td>
              <td className="py-2 px-3">
                User Manual (getting started, dashboards, workflow creation)
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 11
              </td>
              <td className="py-2 px-3">
                Output & Screenshots (application screens and walkthroughs)
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-bold border-r border-gray-400">
                Chapter 12
              </td>
              <td className="py-2 px-3">Conclusions & Future Scope</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
