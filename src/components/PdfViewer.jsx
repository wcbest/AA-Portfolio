"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfViewer({ url, className = "" }) {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-y-auto overscroll-contain ${className}`}>
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            Loading…
          </div>
        }
        error={
          <div className="flex items-center justify-center py-16 text-sm text-red-400">
            Failed to load PDF.
          </div>
        }
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-1"
            />
          ))}
      </Document>
    </div>
  );
}
