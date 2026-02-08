export default function FeasibilityStudy() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8 hidden print:block">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Chapter 4: SDLC
        </span>
      </div>

      <h2 className="report-h2">4.3 Feasibility Study</h2>

      <p className="report-paragraph">
        A comprehensive feasibility study was conducted to assess the viability
        of the project from technical, economic, and operational perspectives.
      </p>

      <h3 className="report-h3 mt-6">4.3.1 Technical Feasibility</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.5: Technical Feasibility Analysis</caption>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>Assessment</th>
            <th>Feasibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Technology Stack</td>
            <td>Next.js, React, TypeScript are mature and well-documented</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>Visual Editor</td>
            <td>React Flow library provides robust canvas functionality</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>Execution Engine</td>
            <td>
              Inngest provides durable execution with built-in reliability
            </td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>PostgreSQL with Prisma ORM provides type-safe DB access</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>API Integration</td>
            <td>tRPC enables type-safe API development</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>Authentication</td>
            <td>Better Auth provides comprehensive auth solution</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>AI Integration</td>
            <td>Official SDKs available for OpenAI, Anthropic, Google</td>
            <td>Feasible</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td>Vercel provides seamless Next.js deployment</td>
            <td>Feasible</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 font-semibold text-green-700">
        Technical Feasibility: APPROVED
      </p>

      <h3 className="report-h3 mt-8">4.3.2 Economic Feasibility</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.6: Economic Feasibility Analysis</caption>
        <thead>
          <tr>
            <th>Cost Category</th>
            <th>Description</th>
            <th>Estimated Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Development</td>
            <td>Developer time (12 weeks)</td>
            <td>INR0 (Self-developed)</td>
          </tr>
          <tr>
            <td>Infrastructure</td>
            <td>Vercel Pro + Neon Database</td>
            <td>INR2,000/month</td>
          </tr>
          <tr>
            <td>Domain</td>
            <td>Domain registration (annual)</td>
            <td>INR1,500/year</td>
          </tr>
          <tr>
            <td>Third-party APIs</td>
            <td>OpenAI, Inngest (free tier)</td>
            <td>INR0 (Free tier)</td>
          </tr>
          <tr>
            <td>Tools</td>
            <td>IDE, Git, Design tools</td>
            <td>INR0 (Free/student licenses)</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} className="font-bold">
              Total Initial Cost
            </td>
            <td className="font-bold">INR3,500</td>
          </tr>
          <tr>
            <td colSpan={2} className="font-bold">
              Monthly Running Cost
            </td>
            <td className="font-bold">INR2,000</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-4 font-semibold text-green-700">
        Economic Feasibility: APPROVED
      </p>

      <h3 className="report-h3 mt-8">4.3.3 Operational Feasibility</h3>
      <ul className="report-list list-disc">
        <li>
          <strong>User Acceptance:</strong> The visual interface reduces
          learning curve, making the system accessible to non-technical users
        </li>
        <li>
          <strong>Training Requirements:</strong> Minimal training needed due to
          intuitive drag-and-drop interface
        </li>
        <li>
          <strong>Maintenance:</strong> Modern stack with good documentation
          ensures maintainability
        </li>
        <li>
          <strong>Scalability:</strong> Cloud-native architecture supports
          horizontal scaling
        </li>
        <li>
          <strong>Support:</strong> Comprehensive error messages and execution
          logs facilitate troubleshooting
        </li>
      </ul>
      <p className="mt-4 font-semibold text-green-700">
        Operational Feasibility: APPROVED
      </p>

      <div className="mt-8 p-4 border-2 border-green-600 bg-green-50 text-center">
        <p className="font-bold text-green-800 text-lg">
          Overall Feasibility Assessment: PROJECT APPROVED
        </p>
      </div>
    </div>
  );
}
