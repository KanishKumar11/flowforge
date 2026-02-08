"use client";

import { Document } from "@react-pdf/renderer";

// Preliminary sections (Roman numerals)
import TitlePage from "./sections/TitlePage";
import Declaration from "./sections/Declaration";
import Certificate from "./sections/Certificate";
import Acknowledgement from "./sections/Acknowledgement";
import Preface from "./sections/Preface";
import Abstract from "./sections/Abstract";
import TableOfContents from "./sections/TableOfContents";
import ListOfFigures from "./sections/ListOfFigures";
import ListOfTables from "./sections/ListOfTables";
import Acronyms from "./sections/Acronyms";
import PlagiarismReport from "./sections/PlagiarismReport";

// Content sections (Arabic numerals)
import Introduction from "./sections/Introduction";
import ProblemStatement from "./sections/ProblemStatement";
import Objectives from "./sections/Objectives";
import SDLCOverview from "./sections/SDLCOverview";
import ProcessModel from "./sections/ProcessModel";
import RequirementGathering from "./sections/RequirementGathering";
import SRS from "./sections/SRS";
import FeasibilityStudy from "./sections/FeasibilityStudy";
import DesignDiagrams from "./sections/DesignDiagrams";
import COCOMOEstimation from "./sections/COCOMOEstimation";
import Implementation from "./sections/Implementation";
import Testing from "./sections/Testing";
import UserManual from "./sections/UserManual";
import OutputScreens from "./sections/OutputScreens";
import Conclusions from "./sections/Conclusions";
import References from "./sections/References";
import Annexures from "./sections/Annexures";
import InnerCover from "./sections/InnerCover";

/**
 * Main Project Report PDF Document
 * Composes all sections into a single printable document
 *
 * Page Numbering (Updated for expanded content):
 * - Preliminary pages: Roman numerals (i, ii, iii...) - ~12 pages
 * - Content pages: Arabic numerals (1, 2, 3...) - ~85 pages
 *
 * Page Distribution:
 * - Chapter 1 (Introduction): 7 pages (1-7)
 * - Chapter 2 (Problem Statement): 7 pages (8-14)
 * - Chapter 3 (Objectives): 5 pages (15-19)
 * - Chapter 4 (Feasibility): 7 pages
 * - Chapter 5 (Estimation/COCOMO): 5 pages
 * - Chapter 6 (SDLC): 26 pages
 *   - 6.1 Overview
 *   - 6.2 Process Model
 *   - 6.3 Requirement Gathering
 *   - 6.4 SRS
 * - Chapter 7 (Design): 6 pages
 * - Chapter 7 (Testing): 7 pages (64-70)
 * - Chapter 8 (Conclusions): 4 pages (71-74)
 * - References: 2 pages (75-76)
 * Total Content: ~76 pages + 12 preliminary = ~88 pages
 */
export default function ProjectReportDocument() {
  return (
    <Document
      title="Flowgent 1.0 - Project Report"
      author="Kanish Kumar"
      subject="BCA Final Year Project Report"
      keywords="workflow automation, project report, BCA"
    >
      {/* ========== Preliminary Pages (Roman Numerals) ========== */}
      <TitlePage />
      <InnerCover />
      <Declaration pageNumber={1} />
      <Certificate pageNumber={2} />
      <Acknowledgement pageNumber={3} />
      <Preface pageNumber={4} />
      <Abstract pageNumber={5} />
      <PlagiarismReport pageNumber={6} />
      <TableOfContents startPage={7} />
      <ListOfFigures startPage={13} />
      <ListOfTables startPage={15} />
      <Acronyms startPage={19} />

      {/* ========== Content Pages (Arabic Numerals) ========== */}

      {/* Chapter 1: Introduction */}
      <Introduction />

      {/* Chapter 2: Problem Statement */}
      <ProblemStatement />

      {/* Chapter 3: Objectives */}
      <Objectives />

      {/* Chapter 4: Feasibility Study */}
      <FeasibilityStudy />

      {/* Chapter 5: Estimation & Planning (COCOMO) */}
      <COCOMOEstimation />

      {/* Chapter 6: SDLC */}
      <SDLCOverview />
      <ProcessModel />
      <RequirementGathering />
      <SRS />

      {/* Chapter 7: System Design */}
      <DesignDiagrams />

      {/* Chapter 7: Implementation */}
      <Implementation />

      {/* Chapter 8: Testing */}
      <Testing />

      {/* Chapter 9 (Testing) ends, Chapter 10: User Manual */}
      <UserManual />

      {/* Chapter 11: Output & Screenshots */}
      <OutputScreens />

      {/* Chapter 12: Conclusions & Future Scope */}
      <Conclusions />

      {/* References */}
      <References />

      {/* Annexures */}
      <Annexures />
    </Document>
  );
}
