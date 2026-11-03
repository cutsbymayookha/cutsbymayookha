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
import { WorkerMessageHandler } from "pdfjs-dist/build/pdf.worker.min.mjs";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?worker&url";
import { SITE_ASSETS, resolveAssetUrl } from "../data/portfolioAssets";

// Polyfill Promise.withResolvers for browsers older than Chrome 119 / Safari 17.4
if (
  typeof Promise !== "undefined" &&
  typeof (Promise as unknown as { withResolvers?: unknown }).withResolvers !==
    "function"
) {
  (
    Promise as unknown as {
      withResolvers: <T>() => {
        promise: Promise<T>;
        resolve: (value: T | PromiseLike<T>) => void;
        reject: (reason?: unknown) => void;
      };
    }
  ).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Register in-memory main-thread worker handler AND bundled .js worker URL
// This prevents Hostinger/Apache .mjs MIME-type rejections from ever breaking PDF.js
if (typeof globalThis !== "undefined") {
  const globalScope = globalThis as Record<string, unknown>;
  if (!globalScope.pdfjsWorker && WorkerMessageHandler) {
    globalScope.pdfjsWorker = { WorkerMessageHandler };
  }
}
if (typeof pdfWorkerUrl === "string" && pdfWorkerUrl.length > 0) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export const RESUME_ASSET_URL = resolveAssetUrl(SITE_ASSETS.resumePdf.src);
export const RESUME_DOWNLOAD_FILENAME = SITE_ASSETS.resumePdf.downloadFilename;

// Module-level cache of verified PDF bytes to prevent unnecessary repeated network fetches
let cachedResumeBytes: Uint8Array | null = null;
let inFlightResumeFetch: Promise<Uint8Array> | null = null;

function isValidPdfBytes(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 5) return false;
  // Check for "%PDF-" within the first 1024 bytes (some PDFs have leading whitespace/BOM)
  const limit = Math.min(bytes.byteLength - 5, 1024);
  for (let i = 0; i <= limit; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d // -
    ) {
      return true;
    }
  }
  return false;
}

async function fetchVerifiedResumeBytes(retryCount = 0): Promise<Uint8Array> {
  if (retryCount === 0 && cachedResumeBytes && cachedResumeBytes.byteLength > 0) {
    return cachedResumeBytes;
  }

  if (retryCount === 0 && inFlightResumeFetch) {
    return inFlightResumeFetch;
  }

  const performFetch = async (): Promise<Uint8Array> => {
    const requestUrl = resolveAssetUrl(SITE_ASSETS.resumePdf.src, retryCount);
    const response = await fetch(requestUrl, {
      cache: retryCount > 0 ? "reload" : "no-cache",
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} when fetching ${requestUrl}`);
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (!isValidPdfBytes(bytes)) {
      throw new Error(
        `Response from ${requestUrl} did not contain a valid %PDF- header`
      );
    }

    cachedResumeBytes = bytes;
    return bytes;
  };

  if (retryCount === 0) {
    inFlightResumeFetch = performFetch().finally(() => {
      inFlightResumeFetch = null;
    });
    return inFlightResumeFetch;
  }

  return performFetch();
}

function isMobileOrTabletRestrictedPdfEnv(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const pdfViewerDisabled =
    "pdfViewerEnabled" in navigator &&
    (navigator as Navigator & { pdfViewerEnabled?: boolean })
      .pdfViewerEnabled === false;
  return isIOS || isAndroid || pdfViewerDisabled;
}

interface ResumeControlsProps {
  className?: string;
}

interface PdfPageCanvasProps {
  key?: React.Key;
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  onRenderError?: () => void;
}

function PdfPageCanvas({
  pdfDoc,
  pageNumber,
  containerWidth,
  onRenderError,
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
        if (!ctx) {
          onRenderError?.();
          return;
        }

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
          onRenderError?.();
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
  }, [pdfDoc, pageNumber, containerWidth, onRenderError]);

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
  const [useNativeEmbed, setUseNativeEmbed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(760);

  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Warm up the verified resume PDF bytes in idle time so preview opens instantaneously
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchVerifiedResumeBytes(0).catch(() => {
        // Silent warmup; full error handling occurs if user opens preview
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, []);

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

  // Load and render the PDF document when the modal opens or when Retry is clicked
  useEffect(() => {
    if (!isPreviewOpen) return;

    let isCancelled = false;
    let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | null = null;
    let loadedDocument: PDFDocumentProxy | null = null;

    async function loadResumePdf() {
      setIsLoading(true);
      setLoadError(null);
      setUseNativeEmbed(false);

      let verifiedBytes: Uint8Array | null = null;

      try {
        verifiedBytes = await fetchVerifiedResumeBytes(retryCount);
        if (isCancelled) return;
      } catch (fetchErr) {
        if (isCancelled) return;
        console.error("Resume PDF file could not be fetched:", fetchErr);
        setPdfDoc(null);
        setNumPages(0);
        setLoadError(
          "Unable to display the resume preview right now. Please try again, or use Open PDF or Download above."
        );
        setIsLoading(false);
        return;
      }

      try {
        // Pass a fresh slice of the cached bytes so Worker ArrayBuffer transfer never detaches our cache
        loadingTask = pdfjsLib.getDocument({
          data: verifiedBytes.slice(),
        });
        const doc = await loadingTask.promise;

        if (isCancelled) {
          await doc.cleanup();
          return;
        }

        loadedDocument = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (pdfRenderErr) {
        if (isCancelled) return;
        console.warn(
          "PDF.js renderer encountered an issue; switching to native browser PDF preview:",
          pdfRenderErr
        );
        // The PDF file itself was fetched and verified (%PDF- header confirmed),
        // so display it via native browser PDF embedding instead of showing an error
        setPdfDoc(null);
        setNumPages(0);
        setUseNativeEmbed(true);
        setLoadError(null);
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
    cachedResumeBytes = null;
    setRetryCount((prev) => prev + 1);
  }, []);

  const handleCanvasRenderError = useCallback(() => {
    // If canvas rendering fails after document load, switch seamlessly to native PDF viewer
    setUseNativeEmbed(true);
    setLoadError(null);
  }, []);

  const nativeEmbedUrl = `${RESUME_ASSET_URL}#view=FitH&toolbar=0&navpanes=0`;
  const isRestrictedMobileEmbed = isMobileOrTabletRestrictedPdfEnv();

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

                  {/* Modal Body / PDF Preview Area */}
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

                    {!isLoading &&
                      !loadError &&
                      !useNativeEmbed &&
                      pdfDoc &&
                      numPages > 0 && (
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
                              onRenderError={handleCanvasRenderError}
                            />
                          ))}
                        </div>
                      )}

                    {!isLoading && !loadError && useNativeEmbed && (
                      <div className="w-full h-full flex flex-col">
                        {isRestrictedMobileEmbed ? (
                          <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center gap-5 p-6 text-center max-w-md mx-auto">
                            <div className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm flex items-center justify-center text-zinc-700">
                              <FileText size={22} />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-sm sm:text-base font-semibold text-zinc-900">
                                Mayookha Kurup — Resume PDF
                              </h4>
                              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                Your mobile browser opens PDF documents in its
                                native fullscreen reader for optimal clarity and
                                pinch-to-zoom.
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                              <a
                                href={RESUME_ASSET_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm"
                              >
                                <ExternalLink size={14} />
                                <span>Open PDF</span>
                              </a>
                              <a
                                href={RESUME_ASSET_URL}
                                download={RESUME_DOWNLOAD_FILENAME}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-zinc-900 bg-white border border-black/10 hover:bg-zinc-50 transition-colors shadow-sm"
                              >
                                <Download size={14} />
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        ) : (
                          <object
                            data={nativeEmbedUrl}
                            type="application/pdf"
                            aria-label="Mayookha Kurup Resume PDF Preview"
                            className="w-full h-full flex-1 bg-white block"
                          >
                            <iframe
                              src={nativeEmbedUrl}
                              title="Mayookha Kurup Resume PDF Preview"
                              className="w-full h-full flex-1 border-0 bg-white block"
                            />
                          </object>
                        )}
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
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                          <button
                            type="button"
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-900 bg-white border border-black/10 hover:bg-zinc-50 shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                          >
                            <RotateCw size={13} />
                            <span>Retry</span>
                          </button>
                          <a
                            href={RESUME_ASSET_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-colors"
                          >
                            <ExternalLink size={13} />
                            <span>Open PDF</span>
                          </a>
                        </div>
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
