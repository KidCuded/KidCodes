import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";

// Shared by the resume view in the room and the /resume page.
// NOTE: resume-page1.webp is page 1 of public/resume.pdf, exported once at
// 1240px wide. Re-export it whenever resume.pdf changes.
export default function ResumeView() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5">
      <Image
        src="/images/resume-page1.webp"
        alt="Page 1 of Akid's resume"
        width={1240}
        height={1605}
        sizes="(max-width: 768px) 92vw, 672px"
        className="h-auto w-full rounded-md bg-white shadow-2xl"
      />
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="/resume.pdf"
          download="Akid_Resume.pdf"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-room-wall transition-colors hover:bg-white"
        >
          <Download className="h-5 w-5" aria-hidden />
          Download PDF
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-accent px-5 py-3 font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          <ExternalLink className="h-5 w-5" aria-hidden />
          Open full PDF <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
