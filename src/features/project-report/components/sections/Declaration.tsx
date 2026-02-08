export default function Declaration() {
  return (
    <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-12 h-12" style={{ borderTop: '3px solid black', borderLeft: '3px solid black' }} />
      <div className="absolute top-8 right-8 w-12 h-12" style={{ borderTop: '3px solid black', borderRight: '3px solid black' }} />
      <div className="absolute bottom-8 left-8 w-12 h-12" style={{ borderBottom: '3px solid black', borderLeft: '3px solid black' }} />
      <div className="absolute bottom-8 right-8 w-12 h-12" style={{ borderBottom: '3px solid black', borderRight: '3px solid black' }} />

      {/* Top Section: Title & Content */}
      <div className="pt-12 px-16 flex-1 flex flex-col">
        <div className="text-center mb-12">
          <h1 className="report-h1 text-3xl font-bold relative inline-block">
            DECLARATION
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-black" />
          </h1>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 text-justify leading-relaxed flex-1">
          <p className="report-paragraph text-base first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            I hereby declare that this project report entitled <strong>"FLOWGENT 1.0 -
              Visual Workflow Automation Platform"</strong> submitted by me to {" "}
            <strong>Hindu College, Amritsar</strong> in partial fulfillment of the requirements
            for the award of the degree of <strong>Bachelor of Computer Applications (BCA)</strong> is
            a bonafide record of work carried out by me under the supervision and
            guidance of <strong>Mr. Anshuman Sharma</strong> and{" "}
            <strong>Dr. Sunny Sharma</strong>.
          </p>

          <p className="report-paragraph text-base">
            I further declare that this project work is the result of my own effort
            and that it has not been submitted anywhere else for any other degree
            or diploma. All the sources of information and help received during the
            work have been duly acknowledged.
          </p>

          <p className="report-paragraph text-base">
            The work presented in this project report is original and has not been
            copied from any source without proper citation. I understand that any
            violation of this declaration may be treated as plagiarism.
          </p>
        </div>

        {/* Signature Section - Pushed to bottom of flex container */}
        <div className="px-4 pb-20 mt-8">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <p className="text-sm text-gray-600 mb-10">Place: Amritsar</p>
              <p className="text-sm text-gray-600">Date: ________________</p>
            </div>

            <div className="text-center">
              <div className="w-44 border-b-2 border-black mb-2" />
              <p className="font-bold text-lg text-black">Kanish Kumar</p>
              <p className="text-gray-600">Roll No: 11792312331</p>
              <p className="text-sm text-gray-500">BCA Final Year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Number Only - Absolute positioned */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">i</span>
      </div>
    </div>
  );
}
