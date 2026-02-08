export default function COCOMOEstimation() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 6: Estimation & Planning</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 6</h2>
        <h1 className="report-h1 mt-2">Estimation & Planning</h1>
      </div>

      <h2 className="report-h2">6.1 COCOMO Estimation</h2>
      <p className="report-paragraph">
        The Constructive Cost Model (COCOMO) is used to estimate the effort,
        development time, and team size required for the project. We use the
        Basic COCOMO model for this estimation.
      </p>

      <h3 className="report-h3 mt-6">6.1.1 Project Size Estimation</h3>
      <table className="report-table avoid-break">
        <caption>Table 6.1: Lines of Code Estimation</caption>
        <thead>
          <tr>
            <th>Module</th>
            <th>Estimated LOC</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Authentication Module</td><td>800</td></tr>
          <tr><td>Workflow Editor</td><td>3,500</td></tr>
          <tr><td>Node System</td><td>2,500</td></tr>
          <tr><td>Execution Engine</td><td>2,000</td></tr>
          <tr><td>API Layer (tRPC)</td><td>1,500</td></tr>
          <tr><td>Team Management</td><td>1,200</td></tr>
          <tr><td>Credential Management</td><td>600</td></tr>
          <tr><td>UI Components</td><td>2,500</td></tr>
          <tr><td>Utility Functions</td><td>400</td></tr>
          <tr className="font-bold"><td>Total</td><td>15,000</td></tr>
        </tbody>
      </table>

      <p className="report-paragraph mt-4">
        <strong>KLOC (Kilo Lines of Code):</strong> 15 KLOC
      </p>

      <h3 className="report-h3 mt-6">6.1.2 COCOMO Parameters</h3>
      <p className="report-paragraph">
        For an organic project (small team, familiar environment):
      </p>
      <table className="report-table avoid-break">
        <caption>Table 6.2: COCOMO Basic Model Parameters</caption>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Formula</th>
            <th>Organic Values</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Effort (E)</td><td>a × (KLOC)^b</td><td>a=2.4, b=1.05</td></tr>
          <tr><td>Development Time (D)</td><td>c × (E)^d</td><td>c=2.5, d=0.38</td></tr>
          <tr><td>People Required (P)</td><td>E / D</td><td>-</td></tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-6">6.1.3 Effort Calculation</h3>
      <div className="my-4 p-4 border border-gray-300 bg-gray-50 font-mono text-sm">
        <p><strong>Effort (E)</strong> = a × (KLOC)^b</p>
        <p className="ml-8">= 2.4 × (15)^1.05</p>
        <p className="ml-8">= 2.4 × 17.19</p>
        <p className="ml-8 font-bold">= 41.26 Person-Months</p>
      </div>

      <h3 className="report-h3 mt-6">6.1.4 Development Time Calculation</h3>
      <div className="my-4 p-4 border border-gray-300 bg-gray-50 font-mono text-sm">
        <p><strong>Development Time (D)</strong> = c × (E)^d</p>
        <p className="ml-8">= 2.5 × (41.26)^0.38</p>
        <p className="ml-8">= 2.5 × 4.47</p>
        <p className="ml-8 font-bold">= 11.18 Months ≈ 12 Months</p>
      </div>

      <h3 className="report-h3 mt-6">6.1.5 Team Size Calculation</h3>
      <div className="my-4 p-4 border border-gray-300 bg-gray-50 font-mono text-sm">
        <p><strong>Average Team Size (P)</strong> = E / D</p>
        <p className="ml-8">= 41.26 / 11.18</p>
        <p className="ml-8 font-bold">= 3.69 ≈ 4 Persons</p>
      </div>

      <h3 className="report-h3 mt-6">6.1.6 Estimation Summary</h3>
      <table className="report-table avoid-break">
        <caption>Table 6.3: COCOMO Estimation Summary</caption>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Calculated Value</th>
            <th>Actual (Project)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Project Size</td><td>15 KLOC</td><td>~15 KLOC</td></tr>
          <tr><td>Effort</td><td>41.26 PM</td><td>~3 PM (single dev)</td></tr>
          <tr><td>Duration</td><td>12 Months</td><td>3 Months</td></tr>
          <tr><td>Team Size</td><td>4 Persons</td><td>1 Person</td></tr>
        </tbody>
      </table>

      <p className="report-paragraph mt-4">
        <strong>Note:</strong> The actual development effort is lower than COCOMO estimates
        due to extensive use of modern frameworks (Next.js, Prisma), component libraries
        (Shadcn/UI), and the developer's familiarity with the technology stack.
      </p>
    </div>
  );
}
