export default function Preface() {
  return (
    <div className="report-page page-break-after border report-section relative print-no-margin h-[297mm] flex flex-col !justify-start">
      {/* Top Section: Title & Content */}
      <div className="pt-12 pb-20">
        <div className="text-center mb-12">
          <h1 className="report-h1 text-3xl font-bold">PREFACE</h1>
          <div className="w-20 h-1 bg-black mx-auto mt-4" />
        </div>

        <div className="max-w-3xl mx-auto px-8 space-y-5 text-justify leading-relaxed">
          <p className="report-paragraph text-base first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            This project report presents the development of <strong>Flowgent 1.0</strong>,
            a visual workflow automation platform designed to simplify complex business
            process automation for users of all technical backgrounds. The project was
            undertaken as part of the academic requirements for the degree of{" "}
            <strong>Bachelor of Computer Applications (BCA)</strong> at Hindu College, Amritsar.
          </p>

          <p className="report-paragraph text-base">
            The report is structured to provide a comprehensive understanding of the
            project from conception to completion. It begins with an introduction to
            the problem domain and motivation, followed by a detailed analysis of
            existing solutions and their limitations.
          </p>

          <p className="report-paragraph text-base">
            The subsequent chapters cover the complete <strong>Software Development Life Cycle
              (SDLC)</strong>, including requirement gathering through questionnaire methods,
            system design with DFD, Use Case, and ER diagrams, and project estimation
            using the COCOMO model.
          </p>

          <div className="border border-gray-400 p-5 my-5">
            <h4 className="font-bold text-black mb-3">Technologies Explored:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>- Next.js 15 & React 19</div>
              <div>- TypeScript & Tailwind CSS</div>
              <div>- PostgreSQL & Prisma ORM</div>
              <div>- Inngest for Durable Execution</div>
              <div>- React Flow for Visual Editor</div>
              <div>- tRPC for Type-Safe APIs</div>
              <div>- Better Auth for Authentication</div>
              <div>- AI SDKs (OpenAI, Anthropic)</div>
            </div>
          </div>

          <p className="report-paragraph text-base">
            The implementation section includes carefully selected code snippets that
            demonstrate key concepts, along with comprehensive test cases and UI
            screenshots. The report concludes with an honest assessment of the
            project's limitations and a roadmap for future enhancements.
          </p>

          <p className="report-paragraph text-base">
            Every effort has been made to present the information in a clear,
            well-organized manner while adhering to academic standards. I hope
            this report serves as both documentation of my learning journey and
            a useful reference for anyone interested in building similar full-stack
            applications.
          </p>

          <p className="report-paragraph text-base font-medium text-center border border-gray-400 py-3 px-6 mt-6">
            Your feedback and suggestions are welcome to help improve this work.
          </p>
        </div>

        {/* Signature moved into flow */}
        <div className="mt-14 text-right px-16">
          <div className="inline-block text-center">
            {/* <p className="font-bold text-lg text-black">Kanish Kumar</p> */}
            {/* <p className="text-gray-600">BCA Final Year</p> */}
          </div>
        </div>
      </div>

      {/* Page Number Only - Absolute positioned */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">iv</span>
      </div>
    </div>
  );
}
