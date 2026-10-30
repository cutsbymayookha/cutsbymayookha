import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Eye,
  Download,
  X,
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { SITE_ASSETS, resolveAssetUrl } from "../data/portfolioAssets";

// Configure the PDF.js worker using Vite's native ESM asset URL resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export const RESUME_ASSET_URL = resolveAssetUrl(SITE_ASSETS.resumePdf.src);
export const RESUME_DOWNLOAD_FILENAME = SITE_ASSETS.resumePdf.downloadFilename;

interface ResumeControlsProps {
  className?: string;
}

interface PdfPageCanvasProps {
  key?: React.Key;
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
}

function PdfPageCanvas({
  pdfDoc,
  pageNumber,
  containerWidth,
}: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: RenderTask | null = null;

    async function renderPage() {
      const canvas = canvasRef.current;
      if (!canvas || containerWidth <= 0) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (isCancelled) return;

        const unscaledViewport = page.getViewport({ scale: 1 });
        // Fit available width comfortably while preventing horizontal overflow
        const targetWidth = Math.max(Math.min(containerWidth, 820), 220);
        const cssScale = targetWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: cssScale });

        // Render at high pixel density for crisp typography on all displays
        const outputScale = Math.min(
          Math.max(window.devicePixelRatio || 1, 2),
          3
        );

        const displayWidth = Math.floor(viewport.width);
        const displayHeight = Math.floor(viewport.height);

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        setDimensions({ width: displayWidth, height: displayHeight });

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill white page background before rendering PDF content
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        const transform =
          outputScale !== 1
            ? [outputScale, 0, 0, outputScale, 0, 0]
            : undefined;

        renderTask = page.render({
          canvasContext: ctx,
          canvas,
          viewport,
          transform,
        });

        await renderTask.promise;
      } catch (err: unknown) {
        const errorName =
          err && typeof err === "object" && "name" in err
            ? String((err as { name?: unknown }).name)
            : "";
        if (!isCancelled && errorName !== "RenderingCancelledException") {
          console.error(`Failed to render PDF page ${pageNumber}:`, err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // Ignore cancellation errors on unmount
        }
      }
    };
  }, [pdfDoc, pageNumber, containerWidth]);

  return (
    <div
      className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden transition-opacity duration-200 max-w-full"
      style={
        dimensions
          ? { width: `${dimensions.width}px`, height: `${dimensions.height}px` }
          : undefined
      }
    >
      <canvas
        ref={canvasRef}
        aria-label={`Resume page ${pageNumber}`}
        className="block w-full h-full"
      />
    </div>
  );
}

export function ResumeControls({ className = "" }: ResumeControlsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(760);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Measure the preview container width for responsive PDF page scaling
  useEffect(() => {
    if (!isPreviewOpen) return;

    const el = previewContainerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const clientWidth = el.clientWidth;
      if (clientWidth > 0) {
        // Subtract horizontal padding (24px on mobile, 48px on larger screens)
        const horizontalPadding = clientWidth < 640 ? 24 : 48;
        setContainerWidth(Math.max(clientWidth - horizontalPadding, 240));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isPreviewOpen]);

  // Load the PDF document using PDF.js when the modal opens or when Retry is clicked
  useEffect(() => {
    if (!isPreviewOpen) return;

    let isCancelled = false;
    let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | null = null;
    let loadedDocument: PDFDocumentProxy | null = null;

    async function loadResumePdf() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(RESUME_ASSET_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to fetch ${RESUME_ASSET_URL}`
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        if (isCancelled) return;

        // Verify PDF magic header (%PDF-) to ensure we didn't receive an HTML fallback
        const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
        const headerString = String.fromCharCode(...headerBytes);
        if (!headerString.startsWith("%PDF-")) {
          throw new Error(
            `Invalid file format received from ${RESUME_ASSET_URL} (expected PDF header).`
          );
        }

        loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;

        if (isCancelled) {
          await doc.cleanup();
          return;
        }

        loadedDocument = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err) {
        if (isCancelled) return;
        console.error("Resume PDF preview failed to load:", err);
        setPdfDoc(null);
        setNumPages(0);
        setLoadError(
          "Unable to display the resume preview right now. Please try again, or use Open PDF or Download above."
        );
        setIsLoading(false);
      }
    }

    loadResumePdf();

    return () => {
      isCancelled = true;
      if (loadedDocument) {
        loadedDocument.cleanup().catch(() => {});
      }
      if (loadingTask) {
        loadingTask.destroy().catch(() => {});
      }
      setPdfDoc(null);
      setNumPages(0);
    };
  }, [isPreviewOpen, retryCount]);

  // Close on Escape key
  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  return (
    <>
      <div
        className={`flex flex-wrap items-center gap-3 sm:gap-4 ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          aria-label="View Resume"
          className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-zinc-900 text-white text-xs sm:text-sm font-medium tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-zinc-800 hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] active:scale-[0.98] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          <Eye
            size={16}
            className="text-white/90 transition-transform duration-300 group-hover:scale-110"
          />
          <span>View Resume</span>
        </button>

        <a
          href={RESUME_ASSET_URL}
          download={RESUME_DOWNLOAD_FILENAME}
          aria-label="Download Resume"
          className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/80 backdrop-blur-xl text-zinc-900 border border-black/10 text-xs sm:text-sm font-medium tracking-wide shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:bg-white hover:border-black/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
        >
          <Download
            size={16}
            className="text-zinc-700 transition-transform duration-300 group-hover:-translate-y-0.5"
          />
          <span>Download Resume</span>
        </a>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isPreviewOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/55 backdrop-blur-md"
                onClick={() => setIsPreviewOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Resume Preview"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-4xl h-[88dvh] bg-[#FAF9F6] border border-white/80 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-white/85 backdrop-blur-xl border-b border-black/5 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 border border-black/5 flex items-center justify-center shrink-0">
                        <FileText size={15} className="text-zinc-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                          Mayookha Kurup — Resume
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                      <a
                        href={RESUME_ASSET_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open resume PDF in new tab"
                        className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100/80 hover:bg-zinc-200/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                      >
                        <ExternalLink size={13} />
                        <span>Open PDF</span>
                      </a>

                      <a
                        href={RESUME_ASSET_URL}
                        download={RESUME_DOWNLOAD_FILENAME}
                        aria-label="Download Resume PDF"
                        className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(false)}
                        aria-label="Close resume preview"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Modal Body / PDF.js Canvas Preview Area */}
                  <div
                    ref={previewContainerRef}
                    className="relative flex-1 w-full h-full bg-zinc-100 overflow-y-auto overflow-x-hidden scroll-smooth"
                  >
                    {isLoading && (
                      <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center gap-3 p-6 text-center">
                        <Loader2
                          size={26}
                          className="text-zinc-500 animate-spin"
                        />
                        <p className="text-xs sm:text-sm font-medium text-zinc-500 tracking-wide">
                          Loading resume preview…
                        </p>
                      </div>
                    )}

                    {!isLoading && loadError && (
                      <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center gap-4 p-6 text-center max-w-md mx-auto">
                        <div className="w-11 h-11 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-zinc-600">
                          <AlertCircle size={20} />
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                          {loadError}
                        </p>
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-900 bg-white border border-black/10 hover:bg-zinc-50 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                        >
                          <RotateCw size={13} />
                          <span>Retry</span>
                        </button>
                      </div>
                    )}

                    {!isLoading && !loadError && pdfDoc && numPages > 0 && (
                      <div className="w-full flex flex-col items-center gap-5 sm:gap-6 py-4 sm:py-6 px-3 sm:px-6">
                        {Array.from(
                          { length: numPages },
                          (_, idx) => idx + 1
                        ).map((pageNumber) => (
                          <PdfPageCanvas
                            key={pageNumber}
                            pdfDoc={pdfDoc}
                            pageNumber={pageNumber}
                            containerWidth={containerWidth}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
