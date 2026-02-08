export default function TableOfContents() {
  const chapters = [
    { title: "Declaration", page: "i" },
    { title: "Certificate", page: "ii" },
    { title: "Acknowledgement", page: "iii" },
    { title: "Preface", page: "iv" },
    { title: "Abstract", page: "v" },
    { title: "List of Figures", page: "vi" },
    { title: "List of Tables", page: "vii" },
    { title: "List of Acronyms", page: "viii" },
    { break: true },
    {
      chapter: 1, title: "Introduction", page: "1", items: [
        { title: "Project Overview", page: "1" },
        { title: "Background & Motivation", page: "2" },
        { title: "Scope of the Project", page: "3" },
        { title: "Report Organization", page: "4" },
      ]
    },
    {
      chapter: 2, title: "Problem Statement", page: "5", items: [
        { title: "Existing System Challenges", page: "5" },
        { title: "Comparison with Existing Solutions", page: "6" },
      ]
    },
    {
      chapter: 3, title: "Project Objectives", page: "8", items: [
        { title: "Primary Objectives", page: "8" },
        { title: "Secondary Objectives", page: "9" },
        { title: "Technical Objectives", page: "10" },
      ]
    },
    {
      chapter: 4, title: "Software Development Lifecycle", page: "12", items: [
        { title: "SDLC Overview & Deliverables", page: "12" },
        { title: "Process Model (Agile)", page: "14" },
        { title: "Requirement Gathering", page: "16" },
        { title: "Software Requirement Specification", page: "18" },
        { title: "Feasibility Study", page: "20" },
      ]
    },
    {
      chapter: 5, title: "System Design", page: "23", items: [
        { title: "Data Flow Diagrams (DFD)", page: "23" },
        { title: "Use Case Diagrams", page: "25" },
        { title: "Entity Relationship Diagram", page: "27" },
      ]
    },
    {
      chapter: 6, title: "Estimation & Planning", page: "30", items: [
        { title: "COCOMO Estimation", page: "30" },
        { title: "Risk Analysis", page: "32" },
        { title: "Project Timeline", page: "34" },
      ]
    },
    {
      chapter: 7, title: "Implementation", page: "36", items: [
        { title: "Code Snippets", page: "36" },
        { title: "Testing & Test Cases", page: "40" },
        { title: "User Interface Screenshots", page: "44" },
      ]
    },
    {
      chapter: 8, title: "Conclusions", page: "48", items: [
        { title: "Limitations", page: "48" },
        { title: "Conclusions & Future Work", page: "50" },
      ]
    },
    { break: true },
    { title: "References", page: "52" },
    { title: "Annexures", page: "54" },
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
