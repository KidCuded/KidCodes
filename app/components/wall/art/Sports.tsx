import { ST } from "../layouts";
import { ContactShadow } from "./Backdrop";

/*
 * Running shoes by the desk and a badminton racket leaning on its right end.
 * Drawn in desktop station coordinates (ST), like the rest of the station,
 * so they move with it in the portrait layout.
 */

/** One racing shoe facing right: white upper, thick rocker midsole fading to red, red side stripes. (x, y) is the heel's bottom. */
function Shoe({ x, y, back = false }: { x: number; y: number; back?: boolean }) {
  const dim = back ? 0.72 : 1; // the far shoe sits a little in shadow
  const W = back ? "#d9dde3" : "#f8fafc";
  const LINE = back ? "#b9bfc8" : "#d5dae1";
  return (
    <g transform={`translate(${x} ${y})`} opacity={back ? 0.95 : 1}>
      {/* Upper: low heel collar, tongue, then a long slope down to a pointed toe */}
      <path
        d="M11 -23 C8 -32 11 -40 17 -43 L27 -39 C33 -38 37 -41 41 -47 L47 -47 C58 -38 74 -29 88 -21 C95 -18 98 -13 97 -10 L70 -17 Z"
        fill={W}
        stroke={LINE}
        strokeWidth={1}
      />
      {/* Red heel counter */}
      <path d="M11 -23 C8 -32 11 -40 17 -43 L21 -41 C17 -35 17 -28 20 -23 Z" fill="#e11d48" opacity={dim} />
      {/* Side stripes */}
      <path d="M30 -24 C40 -30 52 -37 60 -43" fill="none" stroke="#e11d48" strokeWidth={3.2} strokeLinecap="round" opacity={dim} />
      <path d="M40 -22 C50 -27 60 -32 68 -37" fill="none" stroke="#e11d48" strokeWidth={3.2} strokeLinecap="round" opacity={dim} />
      {/* Laces */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={48 + i * 8} y1={-44 + i * 5} x2={53 + i * 8} y2={-40 + i * 5} stroke={LINE} strokeWidth={1.8} strokeLinecap="round" />
      ))}
      {/* Thick midsole with a rocker toe */}
      <path d="M0 -7 C0 -19 5 -24 13 -24 L70 -17 C84 -15 95 -12 98 -6 C99 -2 96 0 91 0 L8 0 C3 0 0 -3 0 -7 Z" fill={W} stroke={LINE} strokeWidth={1} />
      {/* The red fade, strongest at the bottom of the heel */}
      <path d="M0 -7 C0 -14 2 -18 6 -20 C30 -14 60 -8 92 -2 C93 0 92 0 91 0 L8 0 C3 0 0 -3 0 -7 Z" fill="#fb7185" opacity={0.55 * dim} />
      <path d="M0 -7 C0 -10 1 -12 3 -13 C25 -8 45 -4 66 0 L8 0 C3 0 0 -3 0 -7 Z" fill="#e11d48" opacity={0.85 * dim} />
      {/* Thin black outsole under the forefoot */}
      <path d="M52 0 L91 0 C95 0 98 -2 98 -5 C93 -1 70 -1 52 -1 Z" fill="#111827" />
    </g>
  );
}

/** The pair, on the floor between the shelf and the desk (under the light switch). */
export function RunningShoes() {
  const x = 582;
  const y = ST.floorY;
  return (
    <g aria-hidden transform={`translate(${x} ${y}) scale(0.88) translate(${-x} ${-y})`}>
      <ContactShadow cx={x + 42} cy={y + 1} rx={64} ry={5} />
      <Shoe x={x - 18} y={y - 5} back />
      <Shoe x={x} y={y} />
    </g>
  );
}

/** A badminton racket leaning against the right end of the desk. */
export function Racket({ id }: { id: string }) {
  // Each layout draws its own copy, so the clip id must be unique per layout
  // (a shared id made the strings use the hidden copy's clip on mobile).
  const clip = `${id}-racket-head`;
  const base = { x: 1292, y: ST.floorY };
  const FRAME = "#111827";
  const headY = -172;
  return (
    <g aria-hidden>
      <ContactShadow cx={base.x - 4} cy={base.y + 1} rx={12} ry={3} />
      <g transform={`translate(${base.x} ${base.y}) rotate(-13.5)`}>
        {/* Head: strings, then the frame over them */}
        <clipPath id={clip}>
          <ellipse cx={0} cy={headY} rx={27} ry={39} />
        </clipPath>
        <g clipPath={`url(#${clip})`} stroke="#e5e7eb" strokeWidth={0.9} opacity={0.75}>
          {Array.from({ length: 11 }, (_, i) => -25 + i * 5).map((v) => (
            <line key={`v${v}`} x1={v} y1={headY - 42} x2={v} y2={headY + 42} />
          ))}
          {Array.from({ length: 16 }, (_, i) => headY - 38 + i * 5).map((v) => (
            <line key={`h${v}`} x1={-30} y1={v} x2={30} y2={v} />
          ))}
        </g>
        <ellipse cx={0} cy={headY} rx={29} ry={41} fill="none" stroke={FRAME} strokeWidth={5} />
        {/* Throat, shaft and grip */}
        <path d={`M-8 ${headY + 37} L0 ${headY + 52} L8 ${headY + 37}`} fill="none" stroke={FRAME} strokeWidth={3.5} strokeLinejoin="round" />
        <rect x={-1.8} y={headY + 50} width={3.6} height={-headY - 50 - 58} fill="#9ca3af" />
        <rect x={-5} y={-60} width={10} height={58} rx={3} fill={FRAME} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={-5} y1={-54 + i * 9} x2={5} y2={-58 + i * 9} stroke="#f9fafb" strokeWidth={1.6} opacity={0.85} />
        ))}
        <rect x={-6} y={-6} width={12} height={6} rx={2} fill={FRAME} />
      </g>
    </g>
  );
}
