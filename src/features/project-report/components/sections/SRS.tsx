export default function SRS() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 4: SDLC</span>
      </div>

      <h2 className="report-h2">4.2 Software Requirement Specification (SRS)</h2>

      <h3 className="report-h3 mt-4">4.2.1 Introduction</h3>
      <p className="report-paragraph">
        This Software Requirement Specification document describes the functional and
        non-functional requirements for the Flowgent Workflow Automation Platform.
      </p>

      <h3 className="report-h3 mt-6">4.2.2 Functional Requirements</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.1: Functional Requirements</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Requirement</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FR-01</td>
            <td>Users shall be able to create new workflows using a visual editor</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-02</td>
            <td>Users shall be able to drag and drop nodes onto the canvas</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-03</td>
            <td>Users shall be able to connect nodes to define data flow</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-04</td>
            <td>Users shall be able to configure node properties through a panel</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-05</td>
            <td>System shall support manual, webhook, and scheduled triggers</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-06</td>
            <td>System shall execute workflows reliably with retry mechanisms</td>
            <td>High</td>
          </tr>
          <tr>
            <td>FR-07</td>
            <td>Users shall be able to view execution history and logs</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>FR-08</td>
            <td>System shall support team creation and member management</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>FR-09</td>
            <td>System shall enforce role-based access control</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>FR-10</td>
            <td>Users shall be able to save and load workflow credentials</td>
            <td>Medium</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">4.2.3 Non-Functional Requirements</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.2: Non-Functional Requirements</caption>
        <thead>
          <tr>
            <th>Category</th>
            <th>Requirement</th>
            <th>Metric</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance</td>
            <td>Page load time under normal conditions</td>
            <td>&lt; 3 seconds</td>
          </tr>
          <tr>
            <td>Performance</td>
            <td>Workflow execution start latency</td>
            <td>&lt; 500ms</td>
          </tr>
          <tr>
            <td>Scalability</td>
            <td>Concurrent workflow executions</td>
            <td>100+</td>
          </tr>
          <tr>
            <td>Availability</td>
            <td>System uptime</td>
            <td>99.9%</td>
          </tr>
          <tr>
            <td>Security</td>
            <td>Data encryption at rest</td>
            <td>AES-256</td>
          </tr>
          <tr>
            <td>Security</td>
            <td>Session management</td>
            <td>HTTP-only cookies</td>
          </tr>
          <tr>
            <td>Usability</td>
            <td>Time to create first workflow</td>
            <td>&lt; 10 minutes</td>
          </tr>
          <tr>
            <td>Compatibility</td>
            <td>Browser support</td>
            <td>Chrome, Firefox, Safari, Edge</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">4.2.4 Hardware Requirements</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.3: Hardware Requirements</caption>
        <thead>
          <tr>
            <th>Component</th>
            <th>Minimum</th>
            <th>Recommended</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Processor</td>
            <td>Dual Core 2.0 GHz</td>
            <td>Quad Core 2.5 GHz</td>
          </tr>
          <tr>
            <td>RAM</td>
            <td>4 GB</td>
            <td>8 GB</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>10 GB SSD</td>
            <td>50 GB SSD</td>
          </tr>
          <tr>
            <td>Network</td>
            <td>10 Mbps</td>
            <td>100 Mbps</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">4.2.5 Software Requirements</h3>
      <table className="report-table avoid-break">
        <caption>Table 4.4: Software Requirements</caption>
        <thead>
          <tr>
            <th>Component</th>
            <th>Technology</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Runtime</td>
            <td>Node.js</td>
            <td>20+</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>PostgreSQL</td>
            <td>14+</td>
          </tr>
          <tr>
            <td>Framework</td>
            <td>Next.js</td>
            <td>15+</td>
          </tr>
          <tr>
            <td>Package Manager</td>
            <td>npm</td>
            <td>9+</td>
          </tr>
          <tr>
            <td>Browser</td>
            <td>Chrome/Firefox/Safari/Edge</td>
            <td>Latest</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
