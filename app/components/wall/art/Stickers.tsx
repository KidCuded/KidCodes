// Tech stack from the project write-ups, as plain-text "stickers" (no logos).
// Decorative texture: the skills are also in the project pages' text.
const STACK = [
  { t: "Next.js", c: "#e5e7eb", ink: "#111827" },
  { t: "React", c: "#a5e3f5", ink: "#0c4a6e" },
  { t: "Java", c: "#f8c9a0", ink: "#7c2d12" },
  { t: "Flask", c: "#c7d2fe", ink: "#312e81" },
  { t: "Supabase", c: "#a7f3d0", ink: "#065f46" },
  { t: "MySQL", c: "#fde68a", ink: "#78350f" },
];

/** Stickers along the free strip at the bottom of the board, wrapped to fit. */
export function Stickers({ w, h }: { w: number; h: number }) {
  const fs = 0.14;
  const ph = 0.24;
  const maxX = w - 0.15;
  const rows: { x: number; y: number; s: (typeof STACK)[number]; pw: number; rot: number }[] = [];
  let x = 0.15;
  let y = h - 0.62;
  STACK.forEach((s, i) => {
    const pw = s.t.length * fs * 0.62 + 0.2;
    if (x + pw > maxX) {
      x = 0.35;
      y += ph + 0.07;
    }
    rows.push({ x, y, s, pw, rot: i % 2 ? 3 : -3 });
    x += pw + 0.07;
  });
  return (
    <g className="stickers" aria-hidden="true">
      {rows.map(({ x: sx, y: sy, s, pw, rot }) => (
        <g key={s.t} transform={`rotate(${rot} ${sx + pw / 2} ${sy + ph / 2})`}>
          <rect x={sx + 0.02} y={sy + 0.03} width={pw} height={ph} rx={ph / 2} fill="#000" opacity={0.18} />
          <rect x={sx} y={sy} width={pw} height={ph} rx={ph / 2} fill={s.c} />
          <text x={sx + pw / 2} y={sy + ph / 2} fontSize={fs} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={s.ink}>
            {s.t}
          </text>
        </g>
      ))}
    </g>
  );
}
