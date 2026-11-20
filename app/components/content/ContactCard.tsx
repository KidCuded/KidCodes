"use client";

import { useRef, useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

export const CONTACT = {
  email: "akidsyazwan@gmail.com",
  linkedin: "https://www.linkedin.com/in/akid-syazwan-nor-azman-shah-621752236",
  github: "https://github.com/KidCuded",
} as const;

// Shared by the envelope view in the room and the /contact page.
export default function ContactCard() {
  const [status, setStatus] = useState("");
  const emailRef = useRef<HTMLSpanElement>(null);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setStatus("Copied");
    } catch {
      // Clipboard unavailable (e.g. insecure context): select the text instead.
      const node = emailRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("Selected — press Ctrl+C to copy");
    }
    window.setTimeout(() => setStatus(""), 2500);
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-white/10 bg-room-floor p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-bold text-white">Get in touch</h2>

      <div className="mb-5">
        <p className="mb-1 text-sm text-ink-muted">Email</p>
        <div className="flex flex-wrap items-center gap-3">
          <span ref={emailRef} className="select-all break-all font-medium text-ink">
            {CONTACT.email}
          </span>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 rounded-md border border-accent/60 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
          >
            {status === "Copied" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            Copy
          </button>
        </div>
        <p aria-live="polite" className="mt-1 h-5 text-sm text-accent">
          {status}
        </p>
      </div>

      <ul className="space-y-2">
        <li>
          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 py-1 text-accent hover:underline">
            <Mail className="h-4 w-4" aria-hidden />
            Send an email
          </a>
        </li>
        <li>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-1 text-accent hover:underline">
            LinkedIn <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
        <li>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-1 text-accent hover:underline">
            GitHub <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
