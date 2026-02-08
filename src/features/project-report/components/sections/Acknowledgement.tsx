export default function Acknowledgement() {
  return (
    <div className="report-page page-break-after report-section relative print-no-margin h-[297mm] flex flex-col justify-between">
      {/* Top Section: Title & Content */}
      <div className="pt-12 pb-20">
        <div className="text-center mb-12">
          <h1 className="report-h1 text-3xl font-bold">ACKNOWLEDGEMENT</h1>
          <div className="w-20 h-1 bg-black mx-auto mt-4" />
        </div>

        <div className="max-w-3xl mx-auto px-8 space-y-5 text-justify leading-relaxed">
          <p className="report-paragraph text-base first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            The success and final outcome of this project required a lot of
            guidance and assistance from many people, and I am extremely
            privileged to have got this all along the completion of my project.
            All that I have done is only due to such supervision and assistance,
            and I would not forget to thank them.
          </p>

          <p className="report-paragraph text-base">
            I express my heartfelt gratitude to my project guides{" "}
            <strong>Mr. Anshuman Sharma</strong> and{" "}
            <strong>Dr. Sunny Sharma</strong> for their valuable guidance,
            constant encouragement, and constructive criticism throughout the
            development of this project. Their expertise and insights have been
            instrumental in shaping this work.
          </p>

          <p className="report-paragraph text-base">
            I would like to express my sincere thanks to the Head of Department,
            <strong> Dr. Rama Sharma</strong>, PG Department of Computer Science
            & Applications, for providing this opportunity and for the necessary
            support and facilities during the project work.
          </p>

          <p className="report-paragraph text-base">
            I am also thankful to the Principal,{" "}
            <strong>Dr. Rakesh Kumar</strong>, Hindu College, Amritsar, for
            providing the required infrastructure and resources that made this
            project possible.
          </p>

          <p className="report-paragraph text-base">
            Special thanks to all the faculty members of the Department of
            Computer Applications for their support and encouragement. Their
            teaching and knowledge throughout the BCA program have laid the
            foundation for this project.
          </p>

          <p className="report-paragraph text-base">
            I extend my appreciation to my classmates and friends for their
            cooperation, suggestions, and moral support during the entire
            project period.
          </p>

          <p className="report-paragraph text-base">
            Last but not least, I would like to express my deepest gratitude to
            my
            <strong> family</strong> for their unconditional love, support, and
            encouragement. Their belief in me has been my greatest strength
            throughout this journey.
          </p>
        </div>

        {/* Signature Section - Moved inside content flow */}
        <div className="mt-12 text-right px-16">
          <div className="inline-block text-center">
            <div className="w-40 border-b-2 border-black mb-2" />
            <p className="font-bold text-lg text-black">Kanish Kumar</p>
            <p className="text-gray-600">Roll No: 11792312331</p>
          </div>
        </div>
      </div>

      {/* Page Number Only - Absolute positioned */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="font-serif">iii</span>
      </div>
    </div>
  );
}
