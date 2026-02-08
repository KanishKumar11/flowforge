export default function RequirementGathering() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 4: SDLC</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 4</h2>
        <h1 className="report-h1 mt-2">Requirement Analysis</h1>
      </div>

      <h2 className="report-h2">4.1 Requirement Gathering</h2>
      <p className="report-paragraph">
        Requirements were gathered through multiple methods to ensure comprehensive
        coverage of user needs and system capabilities.
      </p>

      <h3 className="report-h3 mt-6">4.1.1 Questionnaire Method</h3>
      <p className="report-paragraph">
        A structured questionnaire was designed and distributed to potential users
        including developers, business analysts, and project managers. The questionnaire
        covered the following areas:
      </p>

      <div className="my-4 p-4 border border-gray-300 bg-gray-50 avoid-break">
        <p className="font-bold mb-2">Sample Questionnaire</p>
        <ol className="text-sm list-decimal ml-6 space-y-2">
          <li>What workflow automation tools have you used before?</li>
          <li>What are the main challenges you face with current tools?</li>
          <li>What types of workflows do you commonly automate?</li>
          <li>Which integrations are most important for your work?</li>
          <li>How important is team collaboration in your workflow management?</li>
          <li>What level of technical expertise do you have?</li>
          <li>How important is the ability to monitor workflow executions?</li>
          <li>Do you require AI capabilities in your automations?</li>
          <li>What security features are essential for your organization?</li>
          <li>How do you prefer to trigger workflows (manual/scheduled/webhook)?</li>
        </ol>
      </div>

      <h3 className="report-h3 mt-6">4.1.2 Key Findings</h3>
      <ul className="report-list list-disc">
        <li>85% of respondents struggled with the learning curve of existing tools</li>
        <li>70% needed HTTP API integration capabilities</li>
        <li>65% wanted AI-powered automation features</li>
        <li>80% required team collaboration features</li>
        <li>90% emphasized the importance of execution monitoring</li>
        <li>75% preferred visual interfaces over code-based solutions</li>
      </ul>

      <h3 className="report-h3 mt-6">4.1.3 Categorizing Requirements</h3>
      <p className="report-paragraph">
        Based on the gathered data, requirements were filtered and categorized
        according to different use cases:
      </p>

      <table className="report-table avoid-break">
        <thead>
          <tr>
            <th>Use Case</th>
            <th>User Role</th>
            <th>Key Requirements</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Workflow Creation</td>
            <td>Developer/Analyst</td>
            <td>Visual editor, node library, connections</td>
          </tr>
          <tr>
            <td>Workflow Execution</td>
            <td>All Users</td>
            <td>Triggers, execution engine, error handling</td>
          </tr>
          <tr>
            <td>Monitoring</td>
            <td>Admin/Developer</td>
            <td>Logs, status tracking, debugging</td>
          </tr>
          <tr>
            <td>Team Management</td>
            <td>Admin/Owner</td>
            <td>RBAC, invitations, permissions</td>
          </tr>
          <tr>
            <td>Integration</td>
            <td>Developer</td>
            <td>API nodes, credentials, webhooks</td>
          </tr>
          <tr>
            <td>AI Automation</td>
            <td>Analyst</td>
            <td>LLM nodes, prompt configuration</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">4.1.4 Requirement Prioritization</h3>
      <p className="report-paragraph">
        Requirements were prioritized using the MoSCoW method:
      </p>
      <ul className="report-list list-disc">
        <li><strong>Must Have:</strong> Visual editor, execution engine, authentication, basic triggers</li>
        <li><strong>Should Have:</strong> HTTP integration, team RBAC, execution history</li>
        <li><strong>Could Have:</strong> AI nodes, Slack/Notion integration, version control</li>
        <li><strong>Won't Have (this version):</strong> Mobile app, custom node development</li>
      </ul>
    </div>
  );
}
