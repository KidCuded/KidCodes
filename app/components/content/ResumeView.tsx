"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";

// The resume in the room: one page at a time, sized to fit the screen (no
// scrolling), with Previous / Next (or the arrow keys) to flip between pages,
// and Download / Open beside it (below it on phones).
// NOTE: the page images are public/resume.pdf rendered at 1600px wide.
// Re-render them whenever resume.pdf changes.
const PAGES = ["/images/resume-1.webp", "/images/resume-2.webp"];

export default function ResumeView() {
  const [page, setPage] = useState(0);
  const last = PAGES.length - 1;

  // Left / right arrow keys flip pages while the resume is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(last, p + 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(0, p - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  return (
    <div className="resume-view">
      <div className="resume-sheet">
        {/* Both pages are loaded up front so flipping is instant; only one shows. */}
        {PAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Page ${i + 1} of ${PAGES.length} of Akid's resume`}
            width={1600}
            height={2071}
            sizes="(max-width: 640px) 88vw, 560px"
            quality={90}
            priority={i === 0}
            className="resume-page"
            hidden={i !== page}
          />
        ))}
      </div>

      <div className="resume-actions">
        <div className="resume-pager" role="group" aria-label="Resume pages">
          <button type="button" className="resume-page-btn" onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <span className="resume-page-count" aria-live="polite">
            Page {page + 1} of {PAGES.length}
          </span>
          <button type="button" className="resume-page-btn" onClick={() => setPage(page + 1)} disabled={page === last} aria-label="Next page">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <a href="/resume.pdf" download="Akid_Resume.pdf" className="resume-btn resume-btn-solid">
          <Download className="h-5 w-5" aria-hidden />
          Download PDF
        </a>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-btn resume-btn-outline">
          <ExternalLink className="h-5 w-5" aria-hidden />
          Open full PDF <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
