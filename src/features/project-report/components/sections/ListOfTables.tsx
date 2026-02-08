const tables = [
  { number: "2.1", title: "Comparison of Existing Solutions", page: "5" },
  { number: "4.1", title: "Functional Requirements", page: "16" },
  { number: "4.2", title: "Non-Functional Requirements", page: "17" },
  { number: "4.3", title: "Hardware Requirements", page: "18" },
  { number: "4.4", title: "Software Requirements", page: "19" },
  { number: "4.5", title: "Technical Feasibility Analysis", page: "21" },
  { number: "4.6", title: "Economic Feasibility Analysis", page: "22" },
  { number: "5.1", title: "User Entity Attributes", page: "31" },
  { number: "5.2", title: "Workflow Entity Attributes", page: "31" },
  { number: "5.3", title: "Execution Entity Attributes", page: "32" },
  { number: "6.1", title: "COCOMO Parameters", page: "34" },
  { number: "6.2", title: "Effort Estimation", page: "35" },
  { number: "6.3", title: "Risk Identification Matrix", page: "37" },
  { number: "6.4", title: "Risk Mitigation Strategies", page: "38" },
  { number: "6.5", title: "Project Schedule", page: "41" },
  { number: "7.1", title: "Unit Test Cases - Authentication", page: "48" },
  { number: "7.2", title: "Unit Test Cases - Workflow CRUD", page: "49" },
  { number: "7.3", title: "Integration Test Cases", page: "50" },
  { number: "7.4", title: "System Test Cases", page: "51" },
];

export default function ListOfTables() {
  return (
    <div className="report-page page-break-after relative print-no-margin h-[297mm] flex flex-col justify-between">
      <div className="pt-12 pb-20 px-12">
        <h1 className="report-h1">List of Tables</h1>

        <div className="mt-8">
          <table className="report-table">
            <thead>
              <tr>
                <th className="w-20">Table No.</th>
                <th>Title</th>
                <th className="w-20">Page No.</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table, index) => (
                <tr key={index}>
                  <td className="text-center">{table.number}</td>
                  <td>{table.title}</td>
                  <td className="text-center">{table.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page specific footer */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">viii</span>
      </div>
    </div>
  );
}
