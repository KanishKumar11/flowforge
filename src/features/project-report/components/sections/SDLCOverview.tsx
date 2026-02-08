export default function SDLCOverview() {
  return (
    <div className="report-page page-break-after report-section relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-8 py-2 text-right border-b border-gray-300 mb-8">
        <span className="text-xs uppercase tracking-widest text-gray-500">Chapter 4: SDLC</span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-500">Chapter 3</h2>
        <h1 className="report-h1 mt-2">Software Development Life Cycle</h1>
      </div>

      <h2 className="report-h2">3.1 SDLC Overview</h2>
      <p className="report-paragraph">
        The Software Development Life Cycle (SDLC) is a systematic process for planning,
        creating, testing, and deploying software applications. This project follows a
        structured approach to ensure quality, maintainability, and timely delivery.
      </p>

      <h3 className="report-h3 mt-6">3.1.1 SDLC Phases</h3>

      <h4 className="font-bold mt-4 mb-2">Phase 1: Requirement Gathering and Analysis</h4>
      <p className="report-paragraph">
        In this phase, detailed requirements were gathered through questionnaires,
        interviews, and analysis of existing workflow automation solutions. The
        requirements were categorized into functional and non-functional requirements,
        and use cases were identified for different user roles.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: Requirements Document, Use Case Specifications, SRS Document
      </p>

      <h4 className="font-bold mt-4 mb-2">Phase 2: Feasibility Study</h4>
      <p className="report-paragraph">
        A comprehensive feasibility study was conducted covering technical, economic,
        and operational aspects. The study confirmed that the project was viable with
        the available resources, technologies, and timeline.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: Feasibility Report, Technology Assessment, Cost-Benefit Analysis
      </p>

      <h4 className="font-bold mt-4 mb-2">Phase 3: System Design</h4>
      <p className="report-paragraph">
        The system architecture was designed using modern best practices. This included
        creating Data Flow Diagrams (DFD), Use Case Diagrams, Entity-Relationship Diagrams,
        and detailed component designs. The database schema was designed using Prisma.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: System Architecture Document, DFD, ER Diagrams, Database Schema
      </p>

      <h4 className="font-bold mt-4 mb-2">Phase 4: Development/Coding</h4>
      <p className="report-paragraph">
        The development phase followed an iterative approach with weekly sprints.
        The frontend was built using Next.js and React, while the backend utilized
        tRPC and Prisma. The execution engine was implemented using Inngest for
        durable function execution.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: Source Code, API Documentation, Component Library
      </p>

      <h4 className="font-bold mt-4 mb-2">Phase 5: Testing</h4>
      <p className="report-paragraph">
        Comprehensive testing was performed including unit testing, integration testing,
        and system testing. Test cases were designed to cover all major functionality
        and edge cases.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: Test Plans, Test Cases, Test Reports, Bug Fixes
      </p>

      <h4 className="font-bold mt-4 mb-2">Phase 6: Deployment</h4>
      <p className="report-paragraph">
        The application was configured for deployment on Vercel with PostgreSQL database
        on Neon. Environment configuration, security settings, and monitoring were
        established for production readiness.
      </p>
      <p className="text-sm italic text-gray-600 ml-10 mb-4">
        Deliverables: Deployment Configuration, Production Environment, Monitoring Setup
      </p>
    </div>
  );
}
