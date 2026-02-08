export default function UIScreenshots() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 7: Implementation</span>
      </div>

      <h2 className="report-h2">7.3 User Interface Screenshots</h2>

      <p className="report-paragraph">
        The following screenshots demonstrate the key interfaces of the Flowgent 1.0
        platform, showcasing the visual design and user experience.
      </p>

      <h3 className="report-h3 mt-5">7.3.1 Dashboard</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Dashboard Screenshot</p>
          <p className="text-sm">Shows workflow overview, recent activity, statistics</p>
        </div>
      </div>

      <h3 className="report-h3 mt-5">7.3.2 Workflow Editor</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Workflow Editor Screenshot</p>
          <p className="text-sm">Visual drag-and-drop canvas with nodes and edges</p>
        </div>
      </div>

      <h3 className="report-h3 mt-5">7.3.3 Node Configuration Panel</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Node Configuration Screenshot</p>
          <p className="text-sm">Side panel for configuring node properties</p>
        </div>
      </div>

      <h3 className="report-h3 mt-5">7.3.4 Execution Logs</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Execution Logs Screenshot</p>
          <p className="text-sm">Detailed execution history with step-by-step logs</p>
        </div>
      </div>

      <h3 className="report-h3 mt-5">7.3.5 Credentials Management</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Credentials Page Screenshot</p>
          <p className="text-sm">Secure credential storage and management</p>
        </div>
      </div>

      <h3 className="report-h3 mt-5">7.3.6 Team Management</h3>
      <div className="my-4 border border-gray-400 h-48 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="font-medium">Team Management Screenshot</p>
          <p className="text-sm">Team members, roles, and invitations</p>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600 border border-gray-400 p-3">
        <strong>Note:</strong> The placeholders above represent actual screenshots that
        should be captured from the running application. Each screenshot demonstrates
        a key aspect of the user interface design.
      </div>
    </div>
  );
}
