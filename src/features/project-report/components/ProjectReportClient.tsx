"use client";

import { Button } from "@/components/ui/button";
import { Printer, Download, Eye } from "lucide-react";

// Section imports
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
import RiskAnalysis from "./sections/RiskAnalysis";
import Timeline from "./sections/Timeline";
import CodeSnippets from "./sections/CodeSnippets";
import Testing from "./sections/Testing";
import UIScreenshots from "./sections/UIScreenshots";
import Limitations from "./sections/Limitations";
import Conclusions from "./sections/Conclusions";
import References from "./sections/References";
import Annexures from "./sections/Annexures";

export default function ProjectReportClient() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header with controls - hidden in print */}
      <div className="no-print sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Project Report Preview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>
        </div>
      </div>

      {/* Report container - visible in both screen and print */}
      <div className="container mx-auto py-8 px-4 print:p-0 print:m-0">
        <div className="report-container shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <TitlePage />
          <Declaration />
          <Certificate />
          <Acknowledgement />
          <Preface />
          <Abstract />
          <TableOfContents />
          <ListOfFigures />
          <ListOfTables />
          <Acronyms />
          <Introduction />
          <ProblemStatement />
          <Objectives />
          <SDLCOverview />
          <ProcessModel />
          <RequirementGathering />
          <SRS />
          <FeasibilityStudy />
          <DesignDiagrams />
          <COCOMOEstimation />
          <RiskAnalysis />
          <Timeline />
          <CodeSnippets />
          <Testing />
          <UIScreenshots />
          <Limitations />
          <Conclusions />
          <References />
          <Annexures />
        </div>
      </div>


    </div>
  );
}
