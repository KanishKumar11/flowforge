import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Post-processes a PDF blob to add page numbers in the footer.
 *
 * - Preliminary pages (1–preliminaryPageCount): Roman numerals (already
 *   handled by individual section components, so we skip them here).
 * - Content pages (preliminaryPageCount+1 onwards): Arabic numerals
 *   starting from 1, placed at the bottom-right of each page.
 *
 * @param pdfBytes - The raw PDF as Uint8Array or ArrayBuffer
 * @param preliminaryPageCount - Number of preliminary pages to skip (default 18)
 * @returns Modified PDF as Uint8Array with page numbers added
 */
export async function addPageNumbers(
  pdfBytes: ArrayBuffer | Uint8Array,
  preliminaryPageCount = 22,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pages = pdfDoc.getPages();

  for (let i = preliminaryPageCount; i < pages.length; i++) {
    const page = pages[i];
    const contentPageNum = i - preliminaryPageCount + 1;
    const text = `${contentPageNum}`;
    const fontSize = 9;
    const textWidth = timesRomanFont.widthOfTextAtSize(text, fontSize);

    const { width } = page.getSize();

    // Position: bottom-right, matching BookPageLayout footer
    // right margin = 50pt, bottom = 30pt
    page.drawText(text, {
      x: width - 50 - textWidth,
      y: 40,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0.4, 0.4, 0.4), // #666666
    });
  }

  return pdfDoc.save();
}
