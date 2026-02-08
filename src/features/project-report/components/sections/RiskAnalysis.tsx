export default function RiskAnalysis() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 6: Estimation & Planning</span>
      </div>

      <h2 className="report-h2">6.2 Risk Analysis</h2>

      <p className="report-paragraph">
        Risk analysis identifies potential problems that could affect the project
        and defines mitigation strategies to minimize their impact.
      </p>

      <h3 className="report-h3 mt-6">6.2.1 Risk Identification</h3>
      <table className="report-table avoid-break">
        <caption>Table 6.4: Risk Identification Matrix</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Risk Description</th>
            <th>Category</th>
            <th>Probability</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>R1</td>
            <td>Technology learning curve delays</td>
            <td>Technical</td>
            <td>Medium</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>R2</td>
            <td>Inngest API changes or limitations</td>
            <td>Technical</td>
            <td>Low</td>
            <td>High</td>
          </tr>
          <tr>
            <td>R3</td>
            <td>Third-party service unavailability</td>
            <td>External</td>
            <td>Low</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>R4</td>
            <td>Database performance issues</td>
            <td>Technical</td>
            <td>Medium</td>
            <td>High</td>
          </tr>
          <tr>
            <td>R5</td>
            <td>Security vulnerabilities</td>
            <td>Security</td>
            <td>Medium</td>
            <td>Critical</td>
          </tr>
          <tr>
            <td>R6</td>
            <td>Scope creep during development</td>
            <td>Project</td>
            <td>High</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>R7</td>
            <td>Browser compatibility issues</td>
            <td>Technical</td>
            <td>Medium</td>
            <td>Low</td>
          </tr>
          <tr>
            <td>R8</td>
            <td>Timeline constraints</td>
            <td>Project</td>
            <td>Medium</td>
            <td>Medium</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-8">6.2.2 Risk Mitigation Strategies</h3>
      <table className="report-table avoid-break">
        <caption>Table 6.5: Risk Mitigation Strategies</caption>
        <thead>
          <tr>
            <th>Risk ID</th>
            <th>Mitigation Strategy</th>
            <th>Contingency Plan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>R1</td>
            <td>Early prototyping, following official documentation</td>
            <td>Use simpler alternatives if needed</td>
          </tr>
          <tr>
            <td>R2</td>
            <td>Abstract execution layer, regular dependency updates</td>
            <td>Implement custom execution engine</td>
          </tr>
          <tr>
            <td>R3</td>
            <td>Implement retry mechanisms, use reliable providers</td>
            <td>Graceful degradation, offline queue</td>
          </tr>
          <tr>
            <td>R4</td>
            <td>Proper indexing, query optimization, connection pooling</td>
            <td>Database scaling, caching layer</td>
          </tr>
          <tr>
            <td>R5</td>
            <td>Use established auth library, input validation, encryption</td>
            <td>Security audit, emergency patches</td>
          </tr>
          <tr>
            <td>R6</td>
            <td>Clear requirements, prioritized backlog, regular reviews</td>
            <td>Defer non-essential features</td>
          </tr>
          <tr>
            <td>R7</td>
            <td>Regular cross-browser testing, progressive enhancement</td>
            <td>Recommend supported browsers</td>
          </tr>
          <tr>
            <td>R8</td>
            <td>Realistic planning, regular progress tracking</td>
            <td>Reduce scope, extend timeline</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-8">6.2.3 Risk Priority Matrix</h3>
      <div className="my-4 p-4 border border-gray-300 bg-gray-50 avoid-break">
        <table className="w-full text-center text-sm">
          <thead>
            <tr>
              <th className="border p-2"></th>
              <th className="border p-2 bg-green-100">Low Impact</th>
              <th className="border p-2 bg-yellow-100">Medium Impact</th>
              <th className="border p-2 bg-red-100">High Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-bold bg-red-100">High Prob</td>
              <td className="border p-2 bg-yellow-50">Medium</td>
              <td className="border p-2 bg-orange-100">R6</td>
              <td className="border p-2 bg-red-200">Critical</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold bg-yellow-100">Med Prob</td>
              <td className="border p-2 bg-green-50">R7</td>
              <td className="border p-2 bg-yellow-100">R1, R8</td>
              <td className="border p-2 bg-orange-100">R4, R5</td>
            </tr>
            <tr>
              <td className="border p-2 font-bold bg-green-100">Low Prob</td>
              <td className="border p-2 bg-green-100">Low</td>
              <td className="border p-2 bg-green-50">R3</td>
              <td className="border p-2 bg-yellow-100">R2</td>
            </tr>
          </tbody>
        </table>
        <p className="text-center text-sm italic mt-2">Figure 6.1: Risk Priority Matrix</p>
      </div>
    </div>
  );
}
