export default function ProcessModel() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 4: SDLC</span>
      </div>

      <h2 className="report-h2">3.2 Process Model</h2>

      <p className="report-paragraph">
        This project adopted the <strong>Agile Development Methodology</strong> with
        iterative development cycles. The Agile approach was chosen for its flexibility,
        emphasis on working software, and ability to accommodate changing requirements.
      </p>

      <h3 className="report-h3 mt-6">3.2.1 Why Agile?</h3>
      <ul className="report-list list-disc">
        <li>
          <strong>Iterative Development:</strong> Allows for continuous improvement and
          refinement based on feedback
        </li>
        <li>
          <strong>Flexibility:</strong> Accommodates changes in requirements during development
        </li>
        <li>
          <strong>Early & Continuous Delivery:</strong> Working software delivered incrementally
        </li>
        <li>
          <strong>Risk Mitigation:</strong> Problems identified early through frequent reviews
        </li>
        <li>
          <strong>Focus on Quality:</strong> Continuous testing and integration
        </li>
      </ul>

      <h3 className="report-h3 mt-6">3.2.2 Agile Process Flow</h3>
      <div className="my-6 p-4 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-sm">
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐<br />
          │   PLAN      │───▶│   DESIGN    │───▶│   DEVELOP   │<br />
          └─────────────┘    └─────────────┘    └─────────────┘<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▲&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br />
          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐<br />
          │   REVIEW    │◀───│   DEPLOY    │◀───│    TEST     │<br />
          └─────────────┘    └─────────────┘    └─────────────┘<br />
        </p>
        <p className="text-center text-sm italic mt-2">Figure 3.1: Agile Development Process Model</p>
      </div>

      <h3 className="report-h3 mt-6">3.2.3 Sprint Structure</h3>
      <p className="report-paragraph">
        Development was organized into weekly sprints, each focusing on specific
        features or components. The sprint structure included:
      </p>
      <table className="report-table avoid-break">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Duration</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sprint Planning</td>
            <td>2 hours</td>
            <td>Define sprint goals and select backlog items</td>
          </tr>
          <tr>
            <td>Development</td>
            <td>5 days</td>
            <td>Implementation of planned features</td>
          </tr>
          <tr>
            <td>Code Review</td>
            <td>Ongoing</td>
            <td>Peer review of code changes</td>
          </tr>
          <tr>
            <td>Testing</td>
            <td>Ongoing</td>
            <td>Unit and integration testing</td>
          </tr>
          <tr>
            <td>Sprint Review</td>
            <td>1 hour</td>
            <td>Demo of completed features</td>
          </tr>
          <tr>
            <td>Retrospective</td>
            <td>1 hour</td>
            <td>Process improvement discussion</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">3.2.4 Development Sprints Overview</h3>
      <table className="report-table avoid-break">
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Focus Area</th>
            <th>Key Deliverables</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sprint 1-2</td>
            <td>Foundation</td>
            <td>Project setup, auth, database schema</td>
          </tr>
          <tr>
            <td>Sprint 3-4</td>
            <td>Editor</td>
            <td>Visual workflow editor, node system</td>
          </tr>
          <tr>
            <td>Sprint 5-6</td>
            <td>Execution</td>
            <td>Inngest integration, node executors</td>
          </tr>
          <tr>
            <td>Sprint 7-8</td>
            <td>Integrations</td>
            <td>HTTP, Slack, AI nodes</td>
          </tr>
          <tr>
            <td>Sprint 9-10</td>
            <td>Teams</td>
            <td>RBAC, credential management</td>
          </tr>
          <tr>
            <td>Sprint 11-12</td>
            <td>Polish</td>
            <td>Testing, bug fixes, deployment</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
