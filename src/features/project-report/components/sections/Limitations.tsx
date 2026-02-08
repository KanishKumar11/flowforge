export default function Limitations() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 8: Conclusions</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 8</h2>
        <h1 className="report-h1 mt-2">Conclusions</h1>
      </div>

      <h2 className="report-h2">8.1 Limitations</h2>

      <p className="report-paragraph">
        While the Flowgent platform provides comprehensive workflow automation capabilities,
        the current version has certain limitations that should be acknowledged:
      </p>

      <h3 className="report-h3 mt-6">8.1.1 Technical Limitations</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Browser Dependency:</strong> The application is web-based and requires
          a modern browser (Chrome, Firefox, Safari, or Edge). Older browsers may not
          be fully supported.
        </li>
        <li>
          <strong>Internet Connectivity:</strong> Continuous internet connection is
          required for workflow execution. Offline mode is not supported.
        </li>
        <li>
          <strong>Execution Limits:</strong> Very long-running workflows may be subject
          to timeout limitations imposed by the Inngest platform (max 15 minutes per step).
        </li>
        <li>
          <strong>File Handling:</strong> Currently, the platform does not support
          file upload/download operations within workflows.
        </li>
        <li>
          <strong>Real-Time Updates:</strong> The execution monitoring does not have
          real-time WebSocket updates; users need to refresh to see latest status.
        </li>
      </ol>

      <h3 className="report-h3 mt-6">8.1.2 Functional Limitations</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Limited Integrations:</strong> The current version includes
          integrations for HTTP, Slack, Notion, and AI services. Other popular
          services like Salesforce, Jira, and Hubspot are not yet integrated.
        </li>
        <li>
          <strong>No Custom Node Development:</strong> Users cannot create custom
          node types without modifying the source code. A plugin system is planned
          for future releases.
        </li>
        <li>
          <strong>Simple Branching:</strong> Complex branching patterns like
          parallel execution with merge conditions are not fully supported.
        </li>
        <li>
          <strong>Version Management:</strong> While version history is available,
          diff comparison between versions is not implemented.
        </li>
        <li>
          <strong>Reporting:</strong> Advanced analytics and reporting features
          for workflow performance are limited.
        </li>
      </ol>

      <h3 className="report-h3 mt-6">8.1.3 Scalability Limitations</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Database:</strong> The current PostgreSQL setup may require
          optimization for very high volumes of execution data.
        </li>
        <li>
          <strong>Concurrent Executions:</strong> Very high concurrency scenarios
          (1000+ simultaneous executions) have not been tested.
        </li>
        <li>
          <strong>Multi-Region:</strong> The platform currently operates in a
          single region; global distribution is not supported.
        </li>
      </ol>

      <h3 className="report-h3 mt-6">8.1.4 User Experience Limitations</h3>
      <ol className="report-list list-decimal">
        <li>
          <strong>Mobile Experience:</strong> The workflow editor is optimized for
          desktop and may not provide the best experience on mobile devices.
        </li>
        <li>
          <strong>Keyboard Shortcuts:</strong> Limited keyboard shortcuts are
          implemented for power users.
        </li>
        <li>
          <strong>Localization:</strong> The platform is only available in English;
          internationalization is not implemented.
        </li>
      </ol>
    </div>
  );
}
