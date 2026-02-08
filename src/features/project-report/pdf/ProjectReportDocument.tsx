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
 * - Chapter 4 (SDLC): 33 pages
 *   - 4.1 Overview: 4 pages (20-23)
 *   - 4.2 Process Model: 5 pages (24-28)
 *   - 4.3 Requirement Gathering: 7 pages (29-35)
 *   - 4.4 SRS: 10 pages (36-45)
 *   - 4.5 Feasibility: 7 pages (46-52)
 * - Chapter 5 (Design): 6 pages (53-58)
 * - Chapter 6 (COCOMO): 5 pages (59-63)
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
      <TableOfContents startPage={6} />
      <ListOfFigures pageNumber={11} />
      <ListOfTables startPage={12} />
      <Acronyms startPage={16} />

      {/* ========== Content Pages (Arabic Numerals) ========== */}

      {/* Chapter 1: Introduction */}
      <Introduction />

      {/* Chapter 2: Problem Statement */}
      <ProblemStatement />

      {/* Chapter 3: Objectives */}
      <Objectives />

      {/* Chapter 4: SDLC */}
      {/* 4.1 Feasibility Study (moved earlier - assessed before development begins) */}
      <FeasibilityStudy />
      {/* 4.2 SDLC Overview */}
      <SDLCOverview />
      {/* 4.3 Process Model */}
      <ProcessModel />
      {/* 4.4 Requirement Gathering */}
      <RequirementGathering />
      {/* 4.5 SRS */}
      <SRS />

      {/* Chapter 5: System Design */}
      <DesignDiagrams />

      {/* Chapter 6: Estimation & Planning */}
      <COCOMOEstimation />

      {/* Chapter 7: Implementation */}
      <Implementation />

      {/* Chapter 8: Testing */}
      <Testing />

      {/* Chapter 9: Output & Screenshots */}
      <OutputScreens />

      {/* Chapter 10: Conclusions */}
      <Conclusions />

      {/* References */}
      <References />

      {/* Annexures */}
      <Annexures />
    </Document>
  );
}
