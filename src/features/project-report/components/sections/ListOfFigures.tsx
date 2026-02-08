const figures = [
  { number: "1.1", title: "System Architecture Overview", page: "3" },
  { number: "1.2", title: "Project Module Structure", page: "5" },
  {
    number: "2.1",
    title: "Workflow Automation Market Growth (2022-2030)",
    page: "10",
  },
  {
    number: "2.2",
    title: "Feature Comparison Radar \u2014 Flowgent vs n8n",
    page: "15",
  },
  {
    number: "4.1",
    title: "Technical Feasibility Radar Assessment",
    page: "28",
  },
  { number: "4.2", title: "Project Cost Breakdown", page: "30" },
  { number: "4.3", title: "12-Week Project Schedule Timeline", page: "32" },
  { number: "4.4", title: "SWOT Analysis Matrix", page: "34" },
  { number: "4.5", title: "Feasibility Assessment Scorecard", page: "35" },
  { number: "5.1", title: "Risk Assessment Matrix", page: "37" },
  { number: "5.2", title: "Project Timeline - Gantt Chart", page: "38" },
  { number: "6.1", title: "SDLC Phases Flow Diagram", page: "40" },
  { number: "6.2", title: "Agile Sprint Cycle", page: "46" },
  { number: "6.3", title: "User Requirements Questionnaire", page: "53" },
  { number: "7.1", title: "Context Diagram (Level 0 DFD)", page: "72" },
  { number: "7.2", title: "Level 1 Data Flow Diagram", page: "73" },
  {
    number: "7.3",
    title: "Level 2 DFD - Workflow Execution Engine",
    page: "74",
  },
  { number: "7.4", title: "Use Case Diagram", page: "75" },
  { number: "7.5", title: "Entity Relationship Diagram", page: "76" },
  { number: "7.6", title: "Component Hierarchy Diagram", page: "77" },
  { number: "7.7", title: "Workflow Execution Sequence Diagram", page: "78" },
  { number: "8.1", title: "AI Node Execution Pipeline", page: "84" },
  { number: "8.2", title: "Deployment Architecture", page: "86" },
  { number: "9.1", title: "Testing Pyramid", page: "89" },
  {
    number: "10.1",
    title: "User Journey Through Flowgent Platform",
    page: "96",
  },
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
