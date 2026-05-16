import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import ProjectReportDocument from '../src/features/project-report/pdf/ProjectReportDocument';

async function main() {
  const doc = pdf(<ProjectReportDocument />);
  const bytes = await doc.toBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  console.log('pages', pdfDoc.getPageCount());
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
