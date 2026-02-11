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

  // Wait until iframe src is set (blob URL)
  let src = await page.evaluate((el) => el.getAttribute('src'), iframe);
  const start = Date.now();
  while ((!src || !src.startsWith('blob:')) && Date.now() - start < 60000) {
    await new Promise((r) => setTimeout(r, 500));
    src = await page.evaluate((el) => el.getAttribute('src'), iframe);
  }

  if (!src || !src.startsWith('blob:')) {
    console.warn('PDF iframe src was not a blob URL within timeout, capturing page anyway');
  }

  // Give some time for PDF to render inside iframe
  await new Promise((r) => setTimeout(r, 2000));

  // Capture screenshot of the entire page
  const screenshotPath = path.join(outDir, 'toc-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to', screenshotPath);

  await browser.close();
})();
