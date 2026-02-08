const figures = [
  { number: "1.1", title: "High-Level System Architecture", page: "2" },
  { number: "1.2", title: "Technology Stack Overview", page: "3" },
  { number: "3.1", title: "Agile Development Process Model", page: "10" },
  { number: "3.2", title: "Development Sprints", page: "11" },
  { number: "5.1", title: "Context Level DFD (Level 0)", page: "24" },
  { number: "5.2", title: "Level 1 DFD - Workflow Management", page: "25" },
  { number: "5.3", title: "Level 2 DFD - Execution Engine", page: "26" },
  { number: "5.4", title: "Use Case Diagram - User Authentication", page: "27" },
  { number: "5.5", title: "Use Case Diagram - Workflow Operations", page: "28" },
  { number: "5.6", title: "Use Case Diagram - Team Management", page: "29" },
  { number: "5.7", title: "Entity Relationship Diagram", page: "30" },
  { number: "5.8", title: "Database Schema Diagram", page: "31" },
  { number: "6.1", title: "Gantt Chart - Project Timeline", page: "40" },
  { number: "7.1", title: "Login Page Screenshot", page: "52" },
  { number: "7.2", title: "Dashboard Home Screenshot", page: "53" },
  { number: "7.3", title: "Workflow Editor Screenshot", page: "54" },
  { number: "7.4", title: "Node Configuration Panel Screenshot", page: "55" },
  { number: "7.5", title: "Execution History Screenshot", page: "56" },
  { number: "7.6", title: "Team Management Screenshot", page: "57" },
];

export default function ListOfFigures() {
  return (
    <div className="report-page page-break-after relative print-no-margin h-[297mm] flex flex-col justify-between">
      <div className="pt-12 pb-20 px-12">
        <h1 className="report-h1">List of Figures</h1>

        <div className="mt-8">
          <table className="report-table">
            <thead>
              <tr>
                <th className="w-20">Figure No.</th>
                <th>Title</th>
                <th className="w-20">Page No.</th>
              </tr>
            </thead>
            <tbody>
              {figures.map((fig, index) => (
                <tr key={index}>
                  <td className="text-center">{fig.number}</td>
                  <td>{fig.title}</td>
                  <td className="text-center">{fig.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page specific footer */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">vii</span>
      </div>
    </div>
  );
}
