export default function Conclusions() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 8: Conclusions</span>
      </div>

      <h2 className="report-h2 text-xl font-bold">8.2 Conclusions & Future Work</h2>

      <h3 className="report-h3 mt-5">8.2.1 Conclusions</h3>

      <p className="report-paragraph text-base first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
        The Flowgent 1.0 Visual Workflow Automation Platform has been successfully designed,
        developed, and deployed as a comprehensive solution for no-code/low-code workflow
        automation. This project demonstrates the practical application of modern web
        technologies and software engineering principles learned during the BCA program
        at Hindu College, Amritsar.
      </p>

      <div className="border-l-4 border-black pl-4 my-5">
        <h4 className="font-bold text-black mb-3">Objectives Achieved:</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span><strong>Visual Workflow Design:</strong> Developed an intuitive drag-and-drop editor using React Flow.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span><strong>Reliable Execution Engine:</strong> Implemented durable workflow execution with Inngest.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span><strong>Multiple Trigger Types:</strong> Supported manual, webhook, and scheduled (cron-based) triggers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span><strong>Service Integrations:</strong> Built integrations for HTTP APIs, Slack, Notion, GitHub, email.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span><strong>AI Capabilities:</strong> Integrated OpenAI, Anthropic, and Google Gemini.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">6.</span>
            <span><strong>Team Collaboration:</strong> Implemented RBAC with Owner, Admin, Member, Viewer roles.</span>
          </li>
        </ul>
      </div>

      <p className="report-paragraph text-base">
        The project demonstrates proficiency in the complete software development lifecycle,
        from requirement analysis and system design to implementation and testing.
      </p>

      <h3 className="report-h3 mt-6">8.2.2 Future Work</h3>

      <div className="grid grid-cols-1 gap-3 my-5">
        <div className="border border-gray-400 overflow-hidden">
          <div className="bg-black text-white px-4 py-2 font-bold">
            Short-Term (3-6 months)
          </div>
          <ul className="p-3 space-y-1 text-sm">
            <li>- Additional service integrations (Google Sheets, Airtable, Jira)</li>
            <li>- Real-time execution monitoring with WebSocket updates</li>
            <li>- Enhanced debugging tools with step-through execution</li>
            <li>- Workflow templates marketplace</li>
          </ul>
        </div>

        <div className="border border-gray-400 overflow-hidden">
          <div className="bg-gray-700 text-white px-4 py-2 font-bold">
            Medium-Term (6-12 months)
          </div>
          <ul className="p-3 space-y-1 text-sm">
            <li>- Plugin system for custom node development</li>
            <li>- Advanced analytics dashboard</li>
            <li>- Multi-language support (internationalization)</li>
            <li>- Workflow approval and review processes</li>
          </ul>
        </div>

        <div className="border border-gray-400 overflow-hidden">
          <div className="bg-gray-500 text-white px-4 py-2 font-bold">
            Long-Term (12+ months)
          </div>
          <ul className="p-3 space-y-1 text-sm">
            <li>- Self-hosted deployment option (Docker)</li>
            <li>- Multi-region support for global distribution</li>
            <li>- AI-powered workflow suggestions and optimization</li>
            <li>- Enterprise SSO integration (SAML, OIDC)</li>
          </ul>
        </div>
      </div>

      <h3 className="report-h3 mt-6">8.2.3 Final Remarks</h3>

      <p className="report-paragraph text-base">
        This project has been an invaluable learning experience in full-stack web development,
        system design, and software engineering practices.
      </p>

      <div className="border border-gray-400 p-5 my-5 text-center">
        <p className="text-base font-medium text-black">
          The Flowgent 1.0 platform represents a practical demonstration of how modern web
          technologies can be combined to create powerful, user-friendly automation tools.
        </p>
      </div>

      <p className="report-paragraph text-base">
        I extend my sincere gratitude to my guides, <strong>Mr. Anshuman Sharma</strong> and{" "}
        <strong>Dr. Sunny Sharma</strong>, for their constant support and guidance
        throughout this project. Their expertise and encouragement made this achievement possible.
      </p>
    </div>
  );
}
