export default function Timeline() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          Chapter 6: Estimation & Planning
        </span>
      </div>

      <h2 className="report-h2">6.3 Project Timeline</h2>

      <p className="report-paragraph">
        The project was executed over a 12-week period following an Agile
        methodology with 2-week sprints.
      </p>

      <h3 className="report-h3 mt-6">6.3.1 Gantt Chart</h3>
      <div className="my-4 p-4 border border-gray-300 bg-gray-50 avoid-break overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="border p-1 bg-gray-200 min-w-[150px]">Task</th>
              <th className="border p-1 bg-gray-200 w-6">W1</th>
              <th className="border p-1 bg-gray-200 w-6">W2</th>
              <th className="border p-1 bg-gray-200 w-6">W3</th>
              <th className="border p-1 bg-gray-200 w-6">W4</th>
              <th className="border p-1 bg-gray-200 w-6">W5</th>
              <th className="border p-1 bg-gray-200 w-6">W6</th>
              <th className="border p-1 bg-gray-200 w-6">W7</th>
              <th className="border p-1 bg-gray-200 w-6">W8</th>
              <th className="border p-1 bg-gray-200 w-6">W9</th>
              <th className="border p-1 bg-gray-200 w-6">W10</th>
              <th className="border p-1 bg-gray-200 w-6">W11</th>
              <th className="border p-1 bg-gray-200 w-6">W12</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1">Requirement Analysis</td>
              <td className="border p-1 bg-blue-400"></td>
              <td className="border p-1 bg-blue-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">System Design</td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-green-400"></td>
              <td className="border p-1 bg-green-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Project Setup & Auth</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-yellow-400"></td>
              <td className="border p-1 bg-yellow-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Workflow Editor</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-orange-400"></td>
              <td className="border p-1 bg-orange-400"></td>
              <td className="border p-1 bg-orange-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Execution Engine</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-purple-400"></td>
              <td className="border p-1 bg-purple-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Integrations</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-pink-400"></td>
              <td className="border p-1 bg-pink-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Team & RBAC</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-cyan-400"></td>
              <td className="border p-1 bg-cyan-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Testing</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-red-400"></td>
              <td className="border p-1 bg-red-400"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Documentation</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-indigo-400"></td>
              <td className="border p-1 bg-indigo-400"></td>
              <td className="border p-1"></td>
            </tr>
            <tr>
              <td className="border p-1">Deployment</td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1"></td>
              <td className="border p-1 bg-teal-400"></td>
              <td className="border p-1 bg-teal-400"></td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-sm italic mt-4">
          Figure 6.2: Project Gantt Chart
        </p>
      </div>

      <h3 className="report-h3 mt-6">6.3.2 Milestone Schedule</h3>
      <table className="report-table avoid-break">
        <caption>Table 6.6: Project Milestones</caption>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Target Week</th>
            <th>Deliverables</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>M1: Project Kickoff</td>
            <td>Week 1</td>
            <td>Requirements document, project plan</td>
            <td>✔ Completed</td>
          </tr>
          <tr>
            <td>M2: Design Complete</td>
            <td>Week 3</td>
            <td>System design, database schema, UI mockups</td>
            <td>✔ Completed</td>
          </tr>
          <tr>
            <td>M3: Core MVP</td>
            <td>Week 6</td>
            <td>Working editor, basic execution</td>
            <td>✔ Completed</td>
          </tr>
          <tr>
            <td>M4: Feature Complete</td>
            <td>Week 9</td>
            <td>All features implemented</td>
            <td>✔ Completed</td>
          </tr>
          <tr>
            <td>M5: Testing Complete</td>
            <td>Week 10</td>
            <td>All tests passed, bugs fixed</td>
            <td>✔ Completed</td>
          </tr>
          <tr>
            <td>M6: Production Release</td>
            <td>Week 12</td>
            <td>Deployed to production, documentation</td>
            <td>✔ Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
