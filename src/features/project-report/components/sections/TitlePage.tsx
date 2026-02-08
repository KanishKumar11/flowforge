export default function TitlePage() {
  return (
    <div className="title-page report-page page-break-after flex flex-col justify-between min-h-[297mm] !p-12 bg-white relative print-no-margin">

      {/* Header Section */}
      <div className="text-center pt-8">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-700 font-medium mb-4">
          A Project Report on
        </p>
        {/* Title box - using table display for reliable vertical centering in print */}
        <div
          className="border-2 border-black inline-block px-12 mb-3"
          style={{
            display: 'inline-table',
            height: '80px',
          }}
        >
          <h1
            className="text-4xl font-bold tracking-wide text-black m-0"
            style={{
              display: 'table-cell',
              verticalAlign: 'middle',
              lineHeight: 1,
            }}
          >
            FLOWGENT 1.0
          </h1>
        </div>
        <div className="w-20 h-1 bg-black mx-auto mb-4" />
        <p className="text-lg italic text-gray-700 font-serif">
          Visual Workflow Automation Platform
        </p>
      </div>

      {/* University Logo */}
      <div className="flex justify-center my-6">
        <img
          src="/logo.png"
          alt="Guru Nanak Dev University Logo"
          className="h-24 w-auto object-contain invert"
        />
      </div>

      {/* Submission Text */}
      <div className="text-center">
        <div className="py-4 px-8 border border-gray-400 inline-block">
          <p className="text-sm uppercase tracking-wider text-gray-800 font-semibold">
            Submitted in Partial Fulfillment for the Award of Degree of
          </p>
          <h3 className="text-2xl font-bold text-black mt-2">
            Bachelor of Computer Applications
          </h3>
          <p className="text-gray-600 mt-1">(BCA)</p>
        </div>
      </div>

      {/* Student & Guide Details */}
      <div className="grid grid-cols-2 gap-12 mt-8 px-4">
        {/* Student Details */}
        <div className="text-left">
          <div className="border-l-4 border-black pl-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Submitted By
            </p>
            <p className="text-xl font-bold text-black">Kanish Kumar</p>
            <p className="text-gray-600">Roll No: 11792312331</p>
          </div>
        </div>

        {/* Guide Details */}
        <div className="text-left">
          <div className="border-l-4 border-black pl-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Under the Guidance of
            </p>
            <p className="text-lg font-bold text-black">Mr. Anshuman Sharma</p>
            <p className="text-gray-600">&</p>
            <p className="text-lg font-bold text-black">Dr. Sunny Sharma</p>
          </div>
        </div>
      </div>

      {/* College Details */}
      <div className="text-center mt-8 pt-6 border-t-2 border-gray-400">
        <div className="flex justify-center my-6">
          <img
            src="/gndu.png"
            alt="Guru Nanak Dev University Logo"
            className="h-24 w-auto object-contain "
          />
        </div>
        <div className="inline-block px-8 py-4 border border-gray-300">
          <h4 className="text-xl font-bold text-black uppercase tracking-wide">
            Hindu College, Amritsar
          </h4>
          <p className="text-sm text-gray-600 mt-1">Dhab Khatikan, Amritsar - 143001, Punjab</p>
          <p className="text-sm text-gray-700 mt-2 font-medium italic">
            Affiliated to Guru Nanak Dev University, Amritsar
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="w-12 h-[1px] bg-gray-400" />
            <p className="text-gray-700 font-medium">
              Academic Year: 2025-2026
            </p>
            <span className="w-12 h-[1px] bg-gray-400" />
          </div>
        </div>
      </div>

    </div>
  );
}
