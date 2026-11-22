"use client";

import { useEffect, useState } from "react";

// The code that types itself out, block after block, forever. Lines stay
// short (the screen fits ~44 characters).
const BLOCKS = [
  [
    "// kidpos: total up a cart",
    "function cartTotal(items) {",
    "  return items.reduce((sum, it) =>",
    "    sum + it.price * it.qty, 0);",
    "}",
  ],
  [
    "# bartr: match swaps to wants",
    "def match_trades(user, listings):",
    "    wants = set(user.wants)",
    "    return [l for l in listings",
    "            if l.item in wants]",
  ],
  [
    "-- kabo: busiest customers",
    "SELECT name, COUNT(*) AS orders",
    "FROM customers c",
    "JOIN orders o ON o.customer_id = c.id",
    "GROUP BY name ORDER BY orders DESC;",
  ],
  [
    "// load the bookshelf",
    "const res = await fetch(\"/api/projects\");",
    "const projects = await res.json();",
    "for (const p of projects) {",
    "  shelf.add(p.slug, p.title);",
    "}",
  ],
  [
    "// kopi break",
    "while (sleepy) {",
    "  await brew(\"kopi-o\", { sugar: 1 });",
    "  sleepy = false;",
    "}",
  ],
];
const LINES = BLOCKS.flatMap((b) => [...b, ""]);

const KEYWORDS =
  /^(const|let|function|return|async|await|for|of|in|if|else|while|def|import|from|export|new|SELECT|FROM|JOIN|ON|WHERE|GROUP|BY|ORDER|AS|DESC|COUNT)$/;
const COLORS = {
  keyword: "#c792ea",
  string: "#c3e88d",
  comment: "#6b7c99",
  number: "#f78c6c",
  fn: "#82aaff",
  text: "#d6deeb",
};

/** Split a line into coloured pieces (a tiny highlighter, good enough for the screen). */
function tokens(line: string): { t: string; c: string }[] {
  const out: { t: string; c: string }[] = [];
  const re = /(\/\/.*$|#.*$|--.*$)|("[^"]*"?|'[^']*'?)|(\b\d+\b)|([A-Za-z_]\w*)(?=\()|([A-Za-z_]\w*)|(\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) out.push({ t: m[1], c: COLORS.comment });
    else if (m[2]) out.push({ t: m[2], c: COLORS.string });
    else if (m[3]) out.push({ t: m[3], c: COLORS.number });
    else if (m[4]) out.push({ t: m[4], c: COLORS.fn });
    else if (m[5]) out.push({ t: m[5], c: KEYWORDS.test(m[5]) ? COLORS.keyword : COLORS.text });
    else out.push({ t: m[6] ?? "", c: COLORS.text });
  }
  return out;
}

const FONT = 7; // px (viewBox units)
const CHAR_W = FONT * 0.6; // monospace advance
const LINE_H = 9.6;
const TOP = 17; // below the title bar
const GUTTER = 16;

/**
 * The monitor's editor: real code typed one character at a time; when the
 * screen is full it scrolls up a line, and the blocks loop forever. Under
 * reduced motion it shows a still, full screen. Pauses while the tab is hidden.
 */
export default function CodeScreen({ h }: { h: number }) {
  const rows = Math.floor((h - TOP - 4) / LINE_H);
  // `line` counts every line ever typed (it keeps growing; the source loops).
  // `typing` is true while characters are going in (not during the pauses at line
  // ends and between blocks); the room's CSS uses it to move Akid's arms.
  const [{ line, chars, typing }, setPos] = useState({ line: 0, chars: 0, typing: false });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    if (reduced.matches) {
      // Still: show a full screen of code, no typing.
      timer = window.setTimeout(() => setPos({ line: rows - 1, chars: LINES[(rows - 1) % LINES.length].length, typing: false }), 0);
      return () => window.clearTimeout(timer);
    }
    const pos = { line: 0, chars: 0, typing: false };
    const tick = () => {
      let delay = 35 + Math.random() * 50; // uneven, like real typing
      if (!document.hidden) {
        const text = LINES[pos.line % LINES.length];
        if (pos.chars < text.length) {
          pos.chars++;
          pos.typing = true;
        } else {
          pos.typing = false;
          // Next line: a short pause, longer between blocks.
          pos.line++;
          pos.chars = 0;
          delay = text === "" ? 700 : 160;
        }
        setPos({ ...pos });
      } else if (pos.typing) {
        pos.typing = false; // tab hidden: stop typing (and the arms)
        setPos({ ...pos });
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 600);
    return () => window.clearTimeout(timer);
  }, [rows]);

  const first = Math.max(0, line - rows + 1);
  const scroll = first * LINE_H;
  const visible = Array.from({ length: line - first + 1 }, (_, k) => first + k);
  const current = LINES[line % LINES.length].slice(0, chars);

  return (
    <g className="code-screen" data-typing={typing ? "" : undefined}>
      <g style={{ transform: `translateY(${-scroll}px)`, transition: "transform 0.25s ease-out" }}>
        {[first - 1, ...visible]
          .filter((g) => g >= 0)
          .map((g) => {
            const text = g === line ? current : LINES[g % LINES.length];
            const y = TOP + (g + 1) * LINE_H - 2;
            return (
              <g key={g}>
                <text x={GUTTER - 4} y={y} fontSize={FONT * 0.85} textAnchor="end" fill="#4b5a78" fontFamily="ui-monospace, Menlo, Consolas, monospace">
                  {(g % 999) + 1}
                </text>
                <text x={GUTTER + 2} y={y} fontSize={FONT} fontFamily="ui-monospace, Menlo, Consolas, monospace" xmlSpace="preserve">
                  {tokens(text).map((tk, i) => (
                    <tspan key={i} fill={tk.c}>
                      {tk.t}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        {/* Cursor at the end of the line being typed */}
        <rect
          className="code-cursor"
          x={GUTTER + 2 + current.length * CHAR_W}
          y={TOP + line * LINE_H + 2}
          width={CHAR_W}
          height={LINE_H - 2}
          fill="#93c5fd"
        />
      </g>
    </g>
  );
}

