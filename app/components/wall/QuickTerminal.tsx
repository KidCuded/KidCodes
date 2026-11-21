"use client";

import { useState } from "react";
import Link from "next/link";

type Target = "about" | "resume" | "contact";

type Row = {
  name: string;
  perms: string;
  size: string;
  what: string;
  dir?: boolean;
} & ({ href: string; view?: never } | { view: Target; href?: never });

const ROWS: Row[] = [
  { name: "projects/", perms: "drwxr-xr-x", size: "4", what: "things I've built", dir: true, href: "/portfolio#projects" },
  { name: "about.md", perms: "-rw-r--r--", size: "1.2K", what: "who I am", view: "about" },
  { name: "resume.pdf", perms: "-rw-r--r--", size: "88K", what: "one page, also a PDF", view: "resume" },
  { name: "contact.txt", perms: "-rw-r--r--", size: "312", what: "email, LinkedIn, GitHub", view: "contact" },
];

/**
 * The quick-links view: the desk monitor, close up, running a terminal.
 * `ls -l` lists the places you can go; hovering or focusing an entry types
 * `open <entry>` at the prompt, and clicking it goes there.
 */
export default function QuickTerminal({ onSwap, onClose }: { onSwap: (v: Target) => void; onClose: () => void }) {
  const [typed, setTyped] = useState("");

  return (
    <div className="monitor">
      <div className="monitor-screen">
        <div className="term-bar" aria-hidden="true">
          <span className="term-dot term-dot-red" />
          <span className="term-dot term-dot-yellow" />
          <span className="term-dot term-dot-green" />
          <span className="term-title">akid@room: ~ — zsh</span>
        </div>
        <div className="term-body">
          <p className="term-muted" aria-hidden="true">Last login: today on ttys001</p>
          <p aria-hidden="true">
            <span className="term-prompt">akid@room ~ %</span> ls -l
          </p>
          <p className="term-muted" aria-hidden="true">total 4</p>
          <nav aria-label="Quick links">
            <ul className="term-list">
              {ROWS.map((r) => {
                const line = (
                  <>
                    <span className="term-perms" aria-hidden="true">{r.perms}</span>
                    <span className="term-size" aria-hidden="true">{r.size}</span>
                    <span className={r.dir ? "term-dir" : "term-file"}>{r.name}</span>
                    <span className="term-what" aria-hidden="true"># {r.what}</span>
                  </>
                );
                const hover = {
                  onMouseEnter: () => setTyped(`open ${r.name}`),
                  onFocus: () => setTyped(`open ${r.name}`),
                  onMouseLeave: () => setTyped(""),
                  onBlur: () => setTyped(""),
                };
                return (
                  <li key={r.name}>
                    {r.href ? (
                      <Link href={r.href} className="term-row" onClick={onClose} {...hover}>
                        {line}
                      </Link>
                    ) : (
                      <button type="button" className="term-row" onClick={() => r.view && onSwap(r.view)} {...hover}>
                        {line}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <p aria-hidden="true">
            <span className="term-prompt">akid@room ~ %</span> {typed}
            <span className="term-cursor" />
          </p>
        </div>
      </div>
      <div className="monitor-chin" aria-hidden="true">
        <span className="monitor-led" />
      </div>
    </div>
  );
}
