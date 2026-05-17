import React from "react";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import ProjectReportDocument from "../src/features/project-report/pdf/ProjectReportDocument";

async function main() {
  const doc = pdf(<ProjectReportDocument />);
  const stream = await doc.toBuffer();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk as Uint8Array));
  }
  const pdfDoc = await PDFDocument.load(Buffer.concat(chunks));
  console.log("pages", pdfDoc.getPageCount());
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
