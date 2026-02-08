export default function DesignDiagrams() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 5: System Design</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 5</h2>
        <h1 className="report-h1 mt-2">System Design</h1>
      </div>

      <h2 className="report-h2">5.1 Data Flow Diagrams (DFD)</h2>

      <h3 className="report-h3 mt-6">5.1.1 Context Level DFD (Level 0)</h3>
      <div className="my-4 p-6 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-sm whitespace-pre leading-6">
          {`                    ┌─────────────────┐
                    │                 │
    ───────────────▶│                 │───────────────▶
   Workflow Request │    FLOWGENT     │  Execution Result
                    │     SYSTEM      │
    ◀───────────────│                 │◀───────────────
    Workflow Status │                 │  External API
                    └─────────────────┘   Response
                           ▲   │
                           │   │
                    Credentials│
                    & Config   ▼
                    ┌─────────────────┐
                    │    DATABASE     │
                    └─────────────────┘`}
        </p>
        <p className="text-center text-sm italic mt-4">Figure 5.1: Context Level DFD (Level 0)</p>
      </div>

      <h3 className="report-h3 mt-6">5.1.2 Level 1 DFD</h3>
      <div className="my-4 p-6 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-xs whitespace-pre leading-5">
          {`┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  USER   │───▶│ 1.0 AUTH    │───▶│2.0 WORKFLOW │───▶│3.0 EXECUTION│
└─────────┘    │   MODULE    │    │   EDITOR    │    │   ENGINE    │
               └─────────────┘    └─────────────┘    └─────────────┘
                     │                  │                   │
                     ▼                  ▼                   ▼
              ┌──────────────────────────────────────────────────┐
              │                    DATABASE                       │
              │  [Users] [Workflows] [Executions] [Credentials]  │
              └──────────────────────────────────────────────────┘
                                                                 │
                                                                 ▼
                                                    ┌─────────────────┐
                                                    │  4.0 EXTERNAL   │
                                                    │   INTEGRATIONS  │
                                                    └─────────────────┘`}
        </p>
        <p className="text-center text-sm italic mt-4">Figure 5.2: Level 1 DFD - Workflow Management</p>
      </div>

      <h2 className="report-h2 mt-10">5.2 Use Case Diagrams</h2>

      <h3 className="report-h3 mt-6">5.2.1 User Authentication Use Cases</h3>
      <div className="my-4 p-6 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-sm whitespace-pre leading-6">
          {`                    ┌─────────────────────────────┐
                    │      AUTHENTICATION         │
                    ├─────────────────────────────┤
                    │  ○ Sign Up                  │
  ┌────────┐        │  ○ Login                    │
  │  USER  │───────▶│  ○ Logout                   │
  └────────┘        │  ○ Reset Password           │
                    │  ○ OAuth Login (Google)     │
                    │  ○ Manage Profile           │
                    └─────────────────────────────┘`}
        </p>
        <p className="text-center text-sm italic mt-4">Figure 5.4: Use Case Diagram - User Authentication</p>
      </div>

      <h3 className="report-h3 mt-6">5.2.2 Workflow Operations Use Cases</h3>
      <div className="my-4 p-6 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-sm whitespace-pre leading-6">
          {`                    ┌─────────────────────────────┐
                    │    WORKFLOW OPERATIONS      │
                    ├─────────────────────────────┤
  ┌────────┐        │  ○ Create Workflow          │
  │  USER  │───────▶│  ○ Edit Workflow            │
  └────────┘        │  ○ Delete Workflow          │
                    │  ○ Execute Workflow         │
                    │  ○ View Execution History   │
                    │  ○ Duplicate Workflow       │
                    │  ○ Toggle Active Status     │
                    │  ○ Manage Versions          │
                    └─────────────────────────────┘`}
        </p>
        <p className="text-center text-sm italic mt-4">Figure 5.5: Use Case Diagram - Workflow Operations</p>
      </div>

      <h2 className="report-h2 mt-10">5.3 Entity Relationship Diagram</h2>
      <div className="my-4 p-6 border border-gray-300 bg-gray-50 avoid-break">
        <p className="text-center font-mono text-xs whitespace-pre leading-5">
          {`┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     USER     │       │   WORKFLOW   │       │  EXECUTION   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ PK id        │       │ PK id        │       │ PK id        │
│    name      │──1:N──│ FK userId    │──1:N──│ FK workflowId│
│    email     │       │    name      │       │    status    │
│    image     │       │    nodes     │       │    startedAt │
│    createdAt │       │    edges     │       │    outputData│
└──────────────┘       │    isActive  │       └──────────────┘
        │              └──────────────┘               
        │                     │                       
       1:N                   1:N                      
        │                     │                       
        ▼                     ▼                       
┌──────────────┐       ┌──────────────┐
│  CREDENTIAL  │       │   SCHEDULE   │
├──────────────┤       ├──────────────┤
│ PK id        │       │ PK id        │
│ FK userId    │       │ FK workflowId│
│    name      │       │    cron      │
│    type      │       │    timezone  │
│    data (enc)│       │    isActive  │
└──────────────┘       └──────────────┘`}
        </p>
        <p className="text-center text-sm italic mt-4">Figure 5.7: Entity Relationship Diagram</p>
      </div>

      <h3 className="report-h3 mt-6">5.3.1 Entity Descriptions</h3>
      <table className="report-table avoid-break">
        <caption>Table 5.1: User Entity Attributes</caption>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>id</td><td>String (CUID)</td><td>Primary key</td></tr>
          <tr><td>name</td><td>String</td><td>User's display name</td></tr>
          <tr><td>email</td><td>String (Unique)</td><td>User's email address</td></tr>
          <tr><td>emailVerified</td><td>Boolean</td><td>Email verification status</td></tr>
          <tr><td>image</td><td>String (URL)</td><td>Profile image URL</td></tr>
          <tr><td>createdAt</td><td>DateTime</td><td>Account creation timestamp</td></tr>
        </tbody>
      </table>
    </div>
  );
}
