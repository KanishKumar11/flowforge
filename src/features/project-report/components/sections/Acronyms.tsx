const acronyms = [
  { acronym: "AI", expansion: "Artificial Intelligence" },
  { acronym: "API", expansion: "Application Programming Interface" },
  { acronym: "COCOMO", expansion: "Constructive Cost Model" },
  { acronym: "CRUD", expansion: "Create, Read, Update, Delete" },
  { acronym: "CSS", expansion: "Cascading Style Sheets" },
  { acronym: "DFD", expansion: "Data Flow Diagram" },
  { acronym: "ER", expansion: "Entity Relationship" },
  { acronym: "GUI", expansion: "Graphical User Interface" },
  { acronym: "HMAC", expansion: "Hash-based Message Authentication Code" },
  { acronym: "HOD", expansion: "Head of Department" },
  { acronym: "HTML", expansion: "HyperText Markup Language" },
  { acronym: "HTTP", expansion: "HyperText Transfer Protocol" },
  { acronym: "IDE", expansion: "Integrated Development Environment" },
  { acronym: "JSON", expansion: "JavaScript Object Notation" },
  { acronym: "JWT", expansion: "JSON Web Token" },
  { acronym: "LLM", expansion: "Large Language Model" },
  { acronym: "MVC", expansion: "Model-View-Controller" },
  { acronym: "OAUTH", expansion: "Open Authorization" },
  { acronym: "ORM", expansion: "Object-Relational Mapping" },
  { acronym: "RBAC", expansion: "Role-Based Access Control" },
  { acronym: "REST", expansion: "Representational State Transfer" },
  { acronym: "RPC", expansion: "Remote Procedure Call" },
  { acronym: "SDK", expansion: "Software Development Kit" },
  { acronym: "SDLC", expansion: "Software Development Life Cycle" },
  { acronym: "SMS", expansion: "Short Message Service" },
  { acronym: "SQL", expansion: "Structured Query Language" },
  { acronym: "SRS", expansion: "Software Requirement Specification" },
  { acronym: "SSL", expansion: "Secure Sockets Layer" },
  { acronym: "TLS", expansion: "Transport Layer Security" },
  { acronym: "tRPC", expansion: "TypeScript Remote Procedure Call" },
  { acronym: "UI", expansion: "User Interface" },
  { acronym: "URL", expansion: "Uniform Resource Locator" },
  { acronym: "UX", expansion: "User Experience" },
];

export default function Acronyms() {
  // Split data for two pages
  const page1Data = acronyms.slice(0, 22);
  const page2Data = acronyms.slice(22);

  const renderTable = (data: typeof acronyms) => (
    <div className="w-full">
      <div className="grid grid-cols-[1fr,3fr] border-y-2 border-black font-bold text-lg py-3 bg-gray-50 mb-2">
        <div className="pl-4">Acronym</div>
        <div className="pl-4">Full Form</div>
      </div>
      <div className="divide-y divide-gray-300">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr,3fr] py-3 hover:bg-gray-50 transition-colors">
            <div className="pl-4 font-bold text-black">{item.acronym}</div>
            <div className="pl-4 text-gray-800">{item.expansion}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Page 1 */}
      <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
        <div className="pt-12 pb-20">
          <div className="text-center mb-12">
            <h1 className="report-h1 text-3xl font-bold">LIST OF ACRONYMS</h1>
            <div className="w-20 h-1 bg-black mx-auto mt-4" />
          </div>
          {renderTable(page1Data)}
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <span className="font-serif">viii</span>
        </div>
      </div>

      {/* Page 2 */}
      <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
        <div className="pt-12 pb-20">
          <div className="text-center mb-12">
            <h1 className="report-h1 text-3xl font-bold">LIST OF ACRONYMS (Contd.)</h1>
            <div className="w-20 h-1 bg-black mx-auto mt-4" />
          </div>
          {renderTable(page2Data)}
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <span className="font-serif">viii</span>
        </div>
      </div>
    </>
  );
}
