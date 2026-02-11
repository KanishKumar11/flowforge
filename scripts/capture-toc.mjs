import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const url = 'http://localhost:3000/project-report-pdf';
const outDir = path.join(process.cwd(), 'tmp');
fs.mkdirSync(outDir, { recursive: true });

async function waitForServer(timeout = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const resp = await fetch(url);
      if (resp.status === 200) return true;
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Server did not become available in time');
}

(async () => {
  console.log('Waiting for dev server...');
  await waitForServer();
  console.log('Server is up, launching Puppeteer...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 1600 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the iframe and for the PDF blob to be loaded
  await page.waitForSelector('iframe', { timeout: 60000 });
  const iframe = await page.$('iframe');

  // Click the "Regenerate" button to ensure we have the latest PDF
  try {
    const [regenBtn] = await page.$x("//button[contains(., 'Regenerate')]");
    if (regenBtn) {
      await regenBtn.click();
    }
  } catch (e) {
    // ignore if button not found
  }

  // Wait until iframe src is set to a blob URL
  let src = await page.evaluate((el) => el.getAttribute('src'), iframe);
  const start = Date.now();
  while ((!src || !src.startsWith('blob:')) && Date.now() - start < 120000) {
    await new Promise((r) => setTimeout(r, 500));
    src = await page.evaluate((el) => el.getAttribute('src'), iframe);
  }

  if (!src || !src.startsWith('blob:')) {
    console.warn('PDF iframe src was not a blob URL within timeout, capturing page anyway');
  }

  // Small pause to let the PDF generation finish
  await new Promise((r) => setTimeout(r, 1500));

  // Capture screenshot of the entire page
  const screenshotPath = path.join(outDir, 'toc-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Attempt to fetch the PDF blob from the iframe and save it locally
  const base64 = await page.evaluate(async (el) => {
    const src = el.getAttribute('src');
    if (!src || !src.startsWith('blob:')) return null;
    try {
      const resp = await fetch(src);
      const arr = await resp.arrayBuffer();
      const bytes = new Uint8Array(arr);
      const chunkSize = 0x8000;
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
      }
      return btoa(binary);
    } catch (err) {
      return null;
    }
  }, iframe);

  if (base64) {
    const filePath = path.join(outDir, 'project-report.pdf');
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    console.log('PDF saved to', filePath);

    // Use pdf-lib to get the page count
    const { PDFDocument } = await import('pdf-lib');
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF page count:', pdfDoc.getPageCount());
  } else {
    console.warn('Could not download PDF blob; skipping save');
  }
  console.log('Screenshot saved to', screenshotPath);

  await browser.close();
})();
