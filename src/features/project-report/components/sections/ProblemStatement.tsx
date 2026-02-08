export default function ProblemStatement() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 2: Problem Statement</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 2</h2>
        <h1 className="report-h1 mt-2">Problem Statement & Objectives</h1>
      </div>

      <h2 className="report-h2">2.1 Problem Statement</h2>
      <p className="report-paragraph">
        Modern organizations face several challenges in managing and automating their
        business processes:
      </p>

      <h3 className="report-h3 mt-6">2.1.1 Manual Process Overhead</h3>
      <p className="report-paragraph">
        Many business operations still rely on manual interventions for tasks that could
        be automated. This includes data entry, file transfers, notification sending,
        report generation, and cross-system data synchronization. Manual processes are
        time-consuming, error-prone, and do not scale effectively.
      </p>

      <h3 className="report-h3">2.1.2 Technical Barrier to Automation</h3>
      <p className="report-paragraph">
        Traditional automation solutions require programming knowledge, making them
        inaccessible to business users who understand the processes but lack coding skills.
        This creates a dependency on IT teams and development resources, leading to longer
        implementation timelines and higher costs.
      </p>

      <h3 className="report-h3">2.1.3 Integration Complexity</h3>
      <p className="report-paragraph">
        Modern businesses use multiple SaaS applications and services that need to work
        together. Building custom integrations between these systems requires understanding
        different APIs, authentication mechanisms, and data formats. This complexity
        increases with the number of systems involved.
      </p>

      <h3 className="report-h3">2.1.4 Reliability and Monitoring</h3>
      <p className="report-paragraph">
        Automations need to be reliable and provide visibility into their execution.
        When failures occur, users need to understand what went wrong and have the
        ability to retry or correct issues. Many existing solutions lack robust
        monitoring and debugging capabilities.
      </p>

      <h3 className="report-h3">2.1.5 Collaboration and Access Control</h3>
      <p className="report-paragraph">
        In team environments, workflows need to be shared, and access needs to be
        controlled based on roles. Teams need to collaborate on workflow development
        while maintaining security and audit trails for compliance purposes.
      </p>

      <h2 className="report-h2 mt-8">2.2 Existing Solutions Analysis</h2>
      <table className="report-table avoid-break">
        <caption>Table 2.1: Comparison of Existing Solutions</caption>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Zapier</th>
            <th>n8n</th>
            <th>Make</th>
            <th>Flowgent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Visual Editor</td>
            <td>Limited</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Self-Hosted Option</td>
            <td>No</td>
            <td>Yes</td>
            <td>No</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>AI Integration</td>
            <td>Limited</td>
            <td>Plugins</td>
            <td>Limited</td>
            <td>Native</td>
          </tr>
          <tr>
            <td>Team RBAC</td>
            <td>Enterprise</td>
            <td>Enterprise</td>
            <td>Enterprise</td>
            <td>Built-in</td>
          </tr>
          <tr>
            <td>Open Source</td>
            <td>No</td>
            <td>Yes</td>
            <td>No</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Version Control</td>
            <td>No</td>
            <td>Limited</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
