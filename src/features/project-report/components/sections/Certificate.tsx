export default function Certificate() {
  return (
    <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
      {/* Decorative double border frame */}
      <div className="absolute top-20 bottom-16 left-6 right-6 border-4 border-double border-black" />
      <div className="absolute top-24 bottom-20 left-10 right-10 border border-gray-400" />

      <div className="relative z-10 px-16 pt-12 pb-12 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="report-h1 text-3xl font-bold uppercase tracking-wider">
            Certificate
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="w-16 h-[2px] bg-black" />
            <span className="text-black">*</span>
            <span className="w-16 h-[2px] bg-black" />
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-5 text-justify leading-relaxed">
          <p className="report-paragraph text-base">
            This is to certify that the project report entitled{" "}
            <strong>
              "FLOWGENT 1.0 - Visual Workflow Automation Platform"
            </strong>{" "}
            submitted by <strong>Kanish Kumar</strong> (Roll No:{" "}
            <strong>11792312331</strong>) is a bonafide work carried out by the
            candidate under our supervision and guidance.
          </p>

          <p className="report-paragraph text-base">
            This project is submitted in partial fulfillment of the requirements
            for the award of the degree of{" "}
            <strong>Bachelor of Computer Applications (BCA)</strong> from{" "}
            <strong>Hindu College, Amritsar</strong>.
          </p>

          <p className="report-paragraph text-base">
            To the best of our knowledge, the work presented in this project
            report is original and has not been submitted previously for any
            other degree or diploma.
          </p>

          <p className="report-paragraph text-base font-medium text-center mt-6 border border-gray-300 py-3 px-6">
            We wish the candidate all the best for future endeavors.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-12 grid grid-cols-2 gap-8">
          {/* Guide Signature */}
          <div className="text-center">
            <div className="w-36 border-b-2 border-black mx-auto mb-2" />
            <p className="font-bold text-black">Mr. Anshuman Sharma</p>
            <p className="text-gray-600 text-sm">Project Guide</p>
          </div>

          <div className="text-center">
            <div className="w-36 border-b-2 border-black mx-auto mb-2" />
            <p className="font-bold text-black">Dr. Sunny Sharma</p>
            <p className="text-gray-600 text-sm">Project Guide</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8">
          {/* HOD Signature */}
          <div className="text-center">
            <div className="w-36 border-b-2 border-black mx-auto mb-2" />
            <p className="font-bold text-black">Dr. Rama Sharma</p>
            <p className="text-gray-600 text-sm">Head of Department</p>
            <p className="text-gray-500 text-xs">
              PG Department of Computer Science & Applications
            </p>
          </div>

          {/* Principal */}
          {/* External Examiner */}
          <div className="text-center">
            <div className="w-36 border-b-2 border-black mx-auto mb-2" />
            <p className="font-bold text-black pt-4">External Examiner</p>
          </div>
        </div>

        {/* Seal placeholder */}
        <div className="flex justify-center mt-10">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
            <p className="text-gray-400 text-xs text-center">
              College
              <br />
              Seal
            </p>
          </div>
        </div>
      </div>

      {/* Page specific footer */}
      <div className="absolute bottom-12 left-0 right-0 text-center z-20">
        <span className="font-serif">ii</span>
      </div>
    </div>
  );
}
