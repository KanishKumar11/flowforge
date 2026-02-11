export default function TableOfContents() {
  const chapters = [
    { title: "CERTIFICATE", page: "2" },
    { title: "ACKNOWLEDGEMENT", page: "3" },
    { title: "PREFACE", page: "4" },
    { title: "ABSTRACT", page: "5" },
    { title: "LIST OF FIGURES", page: "12" },
    { title: "LIST OF TABLES", page: "14" },
    { title: "LIST OF ACRONYMS", page: "18" },
    { break: true },
    {
      chapter: 1, title: "Introduction", page: "1", items: [
        { title: "Project Overview", page: "1" },
        { title: "Background", page: "1" },
        { title: "Problem Statement", page: "2" },
        { title: "Motivation", page: "3" },
        { title: "Project Objectives", page: "3" },
        { title: "Proposed Solution", page: "4" },
        { title: "Technology Stack", page: "6" },
        { title: "Technology Justification", page: "7" },
        { title: "Scope of the Project", page: "9" },
        { title: "Key Features Summary", page: "10" },
        { title: "Report Organization", page: "11" },
      ]
    },
    {
      chapter: 2, title: "Problem Statement", page: "12", items: [
        { title: "Introduction", page: "12" },
        { title: "Problem Statement", page: "12" },
        { title: "Market Demand & Industry Trends", page: "16" },
        { title: "Analysis of Existing Solutions", page: "17" },
        { title: "Comparative Analysis", page: "19" },
        { title: "Gap Analysis", page: "22" },
        { title: "Proposed Solution Overview", page: "23" },
        { title: "Justification for New Development", page: "24" },
        { title: "Summary", page: "25" },
      ]
    },
    {
      chapter: 3, title: "Project Objectives", page: "26", items: [
        { title: "Introduction", page: "26" },
        { title: "Primary Objectives", page: "27" },
        { title: "Secondary Objectives", page: "30" },
        { title: "Technical Objectives", page: "32" },
        { title: "Expected Outcomes", page: "34" },
        { title: "Summary", page: "34" },
      ]
    },
    {
      chapter: 4, title: "Feasibility Study", page: "36", items: [
        { title: "Introduction", page: "36" },
        { title: "Technical Feasibility", page: "36" },
        { title: "Economic Feasibility", page: "38" },
        { title: "Operational Feasibility", page: "41" },
        { title: "Schedule Feasibility", page: "42" },
        { title: "Legal Feasibility", page: "43" },
        { title: "SWOT Analysis", page: "44" },
        { title: "Feasibility Summary", page: "45" },
        { title: "Conclusion", page: "45" },
      ]
    },
    {
      chapter: 5, title: "Estimation & Planning", page: "47", items: [
        { title: "Introduction to COCOMO", page: "47" },
        { title: "Lines of Code Estimation", page: "47" },
        { title: "Basic COCOMO Model", page: "48" },
        { title: "Intermediate COCOMO Model", page: "49" },
        { title: "Risk Analysis", page: "51" },
        { title: "Actual vs Estimated Comparison", page: "52" },
        { title: "Summary", page: "53" },
      ]
    },
    {
      chapter: 6, title: "Software Development Life Cycle", page: "55", items: [
        { title: "Introduction to SDLC", page: "55" },
        { title: "Process Model", page: "64" },
        { title: "Requirement Gathering", page: "72" },
        { title: "Software Requirement Specification", page: "81" },
      ]
    },
    {
      chapter: 7, title: "System Design", page: "93", items: [
        { title: "Introduction", page: "93" },
        { title: "Data Flow Diagrams", page: "93" },
        { title: "Use Case Diagrams", page: "96" },
        { title: "Entity Relationship Diagram", page: "98" },
        { title: "System Architecture", page: "100" },
        { title: "Database Schema", page: "102" },
        { title: "Design Patterns", page: "114" },
        { title: "Security Design", page: "114" },
        { title: "Interaction Design", page: "114" },
        { title: "Summary", page: "117" },
      ]
    },
    {
      chapter: 8, title: "Implementation", page: "118", items: [
        { title: "Introduction", page: "118" },
        { title: "Project Structure", page: "118" },
        { title: "Frontend Implementation", page: "119" },
        { title: "Backend Implementation", page: "120" },
        { title: "Workflow Execution Engine", page: "123" },
        { title: "Node Types Implementation", page: "127" },
        { title: "Integration Implementation", page: "128" },
        { title: "Key Features Implementation", page: "129" },
        { title: "API Routes", page: "133" },
        { title: "Deployment", page: "134" },
        { title: "Summary", page: "135" },
      ]
    },
    {
      chapter: 9, title: "Testing", page: "136", items: [
        { title: "Software Engineering Principles", page: "136" },
        { title: "Testing Strategy", page: "137" },
        { title: "Unit Testing", page: "138" },
        { title: "Integration Testing", page: "139" },
        { title: "System Testing", page: "140" },
        { title: "UI/UX Testing", page: "140" },
        { title: "Security Testing", page: "141" },
        { title: "Performance Testing", page: "141" },
        { title: "Defect Tracking", page: "143" },
        { title: "Test Results Summary", page: "143" },
        { title: "Testing Conclusion", page: "144" },
      ]
    },
    {
      chapter: 10, title: "User Manual", page: "145", items: [
        { title: "Getting Started", page: "145" },
        { title: "Dashboard Navigation", page: "146" },
        { title: "Creating a Workflow", page: "147" },
        { title: "Node Types & Configuration", page: "147" },
        { title: "Credential Management", page: "149" },
        { title: "Executing & Monitoring Workflows", page: "150" },
        { title: "Scheduling Workflows", page: "150" },
        { title: "Team Collaboration", page: "151" },
        { title: "Version History", page: "152" },
        { title: "Webhook Configuration", page: "152" },
        { title: "Troubleshooting & FAQ", page: "153" },
        { title: "Summary", page: "153" },
      ]
    },
    {
      chapter: 11, title: "Output & Screenshots", page: "154", items: [
        { title: "Authentication Screens", page: "154" },
        { title: "Dashboard", page: "155" },
        { title: "Visual Workflow Editor", page: "156" },
        { title: "Workflows Management", page: "157" },
        { title: "Execution History", page: "158" },
        { title: "Credential Management", page: "159" },
        { title: "Team Management", page: "159" },
        { title: "Schedule Configuration", page: "160" },
        { title: "Version History", page: "160" },
        { title: "Webhook Documentation", page: "160" },
        { title: "Summary", page: "161" },
      ]
    },
    {
      chapter: 12, title: "Conclusions & Future Scope", page: "162", items: [
        { title: "Project Summary", page: "162" },
        { title: "Key Achievements", page: "162" },
        { title: "Technical Accomplishments", page: "163" },
        { title: "Limitations", page: "163" },
        { title: "Lessons Learned", page: "163" },
        { title: "Future Scope", page: "164" },
        { title: "Conclusion", page: "166" },
      ]
    },
    { break: true },
    { title: "References", page: "167" },
    { title: "Annexures", page: "169" },
  ];

  // Split content into two pages manually for better control
  // Page 1: Preliminaries to Chapter 3
  const page1Content = chapters.slice(0, 12); // Up to Chapter 3
  // Page 2: Chapter 4 to End
  const page2Content = chapters.slice(12);

  const renderContent = (items: typeof chapters) => (
    <div className="max-w-3xl mx-auto px-8 w-full">
      {items.map((item, index) => {
        if ('break' in item) {
          return <div key={index} className="my-5 border-b border-gray-300" />;
        }

        if ('chapter' in item) {
          return (
            <div key={index} className="mb-4">
              <div className="flex items-baseline justify-between py-2 font-bold">
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 border-2 border-black text-black flex items-center justify-center text-sm font-bold shrink-0">
                    {item.chapter}
                  </span>
                  <span className="text-base">{item.title}</span>
                </span>
                <span className="flex-1 mx-4 border-b border-dotted border-gray-400" />
                <span className="font-bold">{item.page}</span>
              </div>
              {item.items?.map((subItem, subIndex) => (
                <div key={subIndex} className="flex items-baseline justify-between py-1 pl-12 text-gray-700 text-sm">
                  <span>{item.chapter}.{subIndex + 1} {subItem.title}</span>
                  <span className="flex-1 mx-4 border-b border-dotted border-gray-300" />
                  <span>{subItem.page}</span>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div key={index} className="flex items-baseline justify-between py-2 text-gray-700">
            <span className="font-medium">{item.title}</span>
            <span className="flex-1 mx-4 border-b border-dotted border-gray-400" />
            <span>{item.page}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
        <div className="pt-12 pb-20">
          <div className="text-center mb-12">
            <h1 className="report-h1 text-3xl font-bold">TABLE OF CONTENTS</h1>
            <div className="w-20 h-1 bg-black mx-auto mt-4" />
          </div>
          {renderContent(page1Content)}
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center">
          <span className="font-serif">vi</span>
        </div>
      </div>

      <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
        <div className="pt-12 pb-20">
          <div className="text-center mb-12">
            <h1 className="report-h1 text-3xl font-bold">TABLE OF CONTENTS (Contd.)</h1>
            <div className="w-20 h-1 bg-black mx-auto mt-4" />
          </div>
          {renderContent(page2Content)}
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center">
          <span className="font-serif">vii</span>
        </div>
      </div>
    </>
  );
}
