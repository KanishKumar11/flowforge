"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import ProjectReportDocument from "../pdf/ProjectReportDocument";
import { addPageNumbers } from "../pdf/addPageNumbers";

/**
 * PDF Report Viewer with post-compilation page numbering.
 *
 * Flow:
 * 1. Render <ProjectReportDocument /> via react-pdf's `pdf()` to get a blob
 * 2. Post-process the blob with pdf-lib to inject Arabic page numbers
 *    on content pages (skipping the first 16 preliminary pages)
 * 3. Display the processed PDF in an <iframe> and offer a download button
 */
export default function PDFReportViewer() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const generatePdf = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    // Revoke previous blob URL to free memory
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    try {
      // Dynamically import pdf() to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");

      // Step 1: Generate raw PDF blob from react-pdf
      const blob = await pdf(<ProjectReportDocument />).toBlob();
      const arrayBuffer = await blob.arrayBuffer();

      // Step 2: Post-process with pdf-lib to add page numbers
      const processedBytes = await addPageNumbers(arrayBuffer, 24);

      // Step 3: Create blob URL for display/download
      const processedBlob = new Blob([processedBytes as BlobPart], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(processedBlob);
      blobUrlRef.current = url;
      setPdfUrl(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError(err instanceof Error ? err.message : "PDF generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Generate on mount
  useEffect(() => {
    generatePdf();
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [generatePdf]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "Flowgent-Project-Report.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header with controls */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Project Report (PDF)</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generatePdf}
              disabled={isGenerating}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
              />
              Regenerate
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={!pdfUrl || isGenerating}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="container mx-auto py-4 px-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Generating PDF with page numbers...
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={generatePdf}>
                Retry
              </Button>
            </div>
          )}

          {pdfUrl && !isGenerating && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="1000px"
              style={{ border: "none" }}
              title="Project Report PDF"
            />
          )}
        </div>
      </div>
    </div>
  );
}
