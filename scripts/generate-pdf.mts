import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import React from 'react';
import { pdf } from '@react-pdf/renderer';

// Import the document component from the source (TSX). We use tsx runner to execute this file.
import ProjectReportDocument from '../src/features/project-report/pdf/ProjectReportDocument';

async function main() {
  // Try to load coverage data from the public folder
  let coverageData;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'coverage', 'coverage-final.json'), 'utf8');
    coverageData = JSON.parse(raw);
    console.log('Loaded coverage data');
  } catch (e) {
    console.warn('No coverage data found, continuing without it');
  }

  // Render PDF to a buffer (use createElement to avoid JSX transform issues in this script)
  const blob = await pdf(React.createElement(ProjectReportDocument, { coverageData })).toBuffer();
  const outPath = path.join(process.cwd(), 'tmp', 'project-report.pdf');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, Buffer.from(blob));
  console.log('PDF written to', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
