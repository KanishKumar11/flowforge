export default function References() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">References</span>
      </div>

      <h2 className="report-h2">References</h2>

      <div className="mt-6 space-y-4">
        <h3 className="report-h3">Books</h3>
        <ol className="report-list list-decimal text-sm">
          <li className="mb-2">
            Pressman, R. S., & Maxim, B. R. (2020). <em>Software Engineering:
              A Practitioner's Approach</em> (9th ed.). McGraw-Hill Education.
          </li>
          <li className="mb-2">
            Sommerville, I. (2019). <em>Software Engineering</em> (10th ed.).
            Pearson.
          </li>
          <li className="mb-2">
            Martin, R. C. (2017). <em>Clean Architecture: A Craftsman's Guide
              to Software Structure and Design</em>. Prentice Hall.
          </li>
        </ol>

        <h3 className="report-h3">Online Documentation</h3>
        <ol className="report-list list-decimal text-sm" start={4}>
          <li className="mb-2">
            Next.js Documentation. (2024). <em>Getting Started with Next.js</em>.
            Retrieved from https://nextjs.org/docs
          </li>
          <li className="mb-2">
            React Documentation. (2024). <em>React Reference</em>.
            Retrieved from https://react.dev/reference
          </li>
          <li className="mb-2">
            TypeScript Documentation. (2024). <em>TypeScript Handbook</em>.
            Retrieved from https://www.typescriptlang.org/docs/
          </li>
          <li className="mb-2">
            Prisma Documentation. (2024). <em>Prisma Client Reference</em>.
            Retrieved from https://www.prisma.io/docs
          </li>
          <li className="mb-2">
            Inngest Documentation. (2024). <em>Inngest Functions Guide</em>.
            Retrieved from https://www.inngest.com/docs
          </li>
          <li className="mb-2">
            React Flow Documentation. (2024). <em>React Flow API Reference</em>.
            Retrieved from https://reactflow.dev/docs
          </li>
          <li className="mb-2">
            tRPC Documentation. (2024). <em>tRPC Quickstart</em>.
            Retrieved from https://trpc.io/docs
          </li>
          <li className="mb-2">
            Tailwind CSS Documentation. (2024). <em>Tailwind CSS v4</em>.
            Retrieved from https://tailwindcss.com/docs
          </li>
          <li className="mb-2">
            Shadcn/UI Documentation. (2024). <em>Components</em>.
            Retrieved from https://ui.shadcn.com/docs
          </li>
        </ol>

        <h3 className="report-h3">Research Papers</h3>
        <ol className="report-list list-decimal text-sm" start={13}>
          <li className="mb-2">
            van der Aalst, W. M. P. (2016). Process Mining: Data Science in Action.
            <em>Springer</em>.
          </li>
          <li className="mb-2">
            Wetzstein, B., Ma, Z., & Leymann, F. (2008). Towards Measuring Key
            Performance Indicators of Semantic Business Processes.
            <em>Business Information Systems, 11th International Conference</em>.
          </li>
        </ol>

        <h3 className="report-h3">Web Resources</h3>
        <ol className="report-list list-decimal text-sm" start={15}>
          <li className="mb-2">
            MDN Web Docs. (2024). <em>JavaScript Reference</em>.
            Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript
          </li>
          <li className="mb-2">
            PostgreSQL Documentation. (2024). <em>PostgreSQL 14 Manual</em>.
            Retrieved from https://www.postgresql.org/docs/14/
          </li>
          <li className="mb-2">
            OpenAI API Documentation. (2024). <em>API Reference</em>.
            Retrieved from https://platform.openai.com/docs
          </li>
          <li className="mb-2">
            Anthropic API Documentation. (2024). <em>Claude API</em>.
            Retrieved from https://docs.anthropic.com
          </li>
          <li className="mb-2">
            Vercel Documentation. (2024). <em>Deployment Guide</em>.
            Retrieved from https://vercel.com/docs
          </li>
        </ol>
      </div>
    </div>
  );
}
