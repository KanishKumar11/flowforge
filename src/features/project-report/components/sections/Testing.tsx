export default function Testing() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 7: Implementation</span>
      </div>

      <h2 className="report-h2">7.2 Testing & Test Cases</h2>

      <p className="report-paragraph">
        Comprehensive testing was performed using <strong>Vitest</strong> as the testing
        framework to ensure the reliability and quality of the Flowgent 1.0 platform.
        The project includes unit tests, integration tests, and system tests.
      </p>

      <h3 className="report-h3 mt-6">7.2.1 Testing Framework & Tools</h3>
      <div className="border border-gray-400 p-4 my-4">
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li><strong>Framework:</strong> Vitest</li>
          <li><strong>Mocking:</strong> vi.mock(), vi.fn()</li>
          <li><strong>Assertions:</strong> expect, toBe, toEqual</li>
          <li><strong>Coverage:</strong> v8 coverage reporter</li>
        </ul>
      </div>

      <h3 className="report-h3 mt-6">7.2.2 Credentials Router Test Cases</h3>
      <p className="text-sm text-gray-600 mb-2">Source: <code>src/trpc/routers/credentials.test.ts</code></p>
      <table className="report-table avoid-break text-sm">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Test Description</th>
            <th>Expected Result</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CR-01</td>
            <td>list: Return all credentials for current user</td>
            <td>Array of user credentials returned</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-02</td>
            <td>list: Return empty array when no credentials</td>
            <td>Empty array returned</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-03</td>
            <td>get: Return credential by ID for current user</td>
            <td>Credential object with matching ID</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-04</td>
            <td>get: Throw error when credential not found</td>
            <td>Error: "Credential not found"</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-05</td>
            <td>get: Not return data field in response</td>
            <td>No 'data' property in response</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-06</td>
            <td>create: Create credential with encrypted data</td>
            <td>New credential with encrypted data</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-07</td>
            <td>create: Validate credential name length</td>
            <td>Validation error for empty name</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-08</td>
            <td>create: Validate credential type enum</td>
            <td>Validation error for invalid type</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-09</td>
            <td>create: Store data as JSON string</td>
            <td>Data stored as stringified JSON</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-10</td>
            <td>update: Update credential name</td>
            <td>Name updated successfully</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-11</td>
            <td>update: Update credential data</td>
            <td>Data updated with new JSON</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-12</td>
            <td>update: Verify ownership before updating</td>
            <td>Error when not owner</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-13</td>
            <td>delete: Delete credential by ID</td>
            <td>Credential deleted</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-14</td>
            <td>delete: Verify ownership before deleting</td>
            <td>Error when not owner</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-15</td>
            <td>getDecrypted: Return decrypted data</td>
            <td>Original data object returned</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>CR-16</td>
            <td>getDecrypted: Update lastUsedAt timestamp</td>
            <td>Timestamp updated on access</td>
            <td>Pass</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-8">7.2.3 Integration Registry Test Cases</h3>
      <p className="text-sm text-gray-600 mb-2">Source: <code>src/lib/integrations/registry.test.ts</code></p>
      <table className="report-table avoid-break text-sm">
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Test Description</th>
            <th>Expected Result</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>IR-01</td>
            <td>Contains all expected providers</td>
            <td>slack, google_sheets, github, notion present</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-02</td>
            <td>Has at least 4 integrations</td>
            <td>Integration count is 4 or more</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-03</td>
            <td>Slack: Correct metadata</td>
            <td>ID, name, type, icon verified</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-04</td>
            <td>Slack: Correct OAuth scopes</td>
            <td>chat:write, channels:read, channels:join</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-05</td>
            <td>Slack: send_message operation</td>
            <td>channel and message args required</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-06</td>
            <td>Google Sheets: Correct metadata</td>
            <td>ID, name, type verified</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-07</td>
            <td>Google Sheets: append_row operation</td>
            <td>spreadsheetId required</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-08</td>
            <td>GitHub: Correct OAuth scopes</td>
            <td>repo, user scopes</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-09</td>
            <td>GitHub: create_issue operation</td>
            <td>owner, repo, title required</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-10</td>
            <td>Notion: create_page operation</td>
            <td>databaseId, properties required</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-11</td>
            <td>All integrations have required fields</td>
            <td>id, name, description, type, icon, operations</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-12</td>
            <td>Valid operation args structure</td>
            <td>type, label fields present</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-13</td>
            <td>Only valid integration types</td>
            <td>oauth2, apiKey, basic only</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>IR-14</td>
            <td>OAuth2 integrations have scopes</td>
            <td>scopes array defined</td>
            <td>Pass</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-8">7.2.4 Additional Test Suites</h3>
      <table className="report-table avoid-break text-sm">
        <thead>
          <tr>
            <th>Test File</th>
            <th>Coverage Area</th>
            <th>Tests</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>useDebounce.test.ts</td>
            <td>Debounce hook functionality</td>
            <td>5</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>cron-helper.test.ts</td>
            <td>Cron expression parsing</td>
            <td>8</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>utils.test.ts</td>
            <td>Utility functions</td>
            <td>6</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>use-mobile.test.ts</td>
            <td>Mobile detection hook</td>
            <td>4</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>AppHeader.test.tsx</td>
            <td>Header component rendering</td>
            <td>7</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>CredentialsPageClient.test.tsx</td>
            <td>Credentials page UI</td>
            <td>9</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>oauth/[provider]/connect.test.ts</td>
            <td>OAuth connection flow</td>
            <td>6</td>
            <td>All Pass</td>
          </tr>
          <tr>
            <td>oauth/[provider]/callback.test.ts</td>
            <td>OAuth callback handling</td>
            <td>8</td>
            <td>All Pass</td>
          </tr>
        </tbody>
      </table>

      <h3 className="report-h3 mt-8">7.2.5 Test Summary</h3>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="text-center p-4 border border-gray-400">
          <p className="text-2xl font-bold">75</p>
          <p className="text-sm text-gray-600">Total Tests</p>
        </div>
        <div className="text-center p-4 border border-gray-400">
          <p className="text-2xl font-bold">75</p>
          <p className="text-sm text-gray-600">Passed</p>
        </div>
        <div className="text-center p-4 border border-gray-400">
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-gray-600">Failed</p>
        </div>
        <div className="text-center p-4 border border-gray-400">
          <p className="text-2xl font-bold">100%</p>
          <p className="text-sm text-gray-600">Pass Rate</p>
        </div>
      </div>
    </div>
  );
}
