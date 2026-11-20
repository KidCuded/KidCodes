import { P } from "../palette";

/**
 * The resume sheet pinned to the pegboard. Drawn in the pegboard face's 2D
 * coordinates (room units), so it sits flat on the board.
 */
export const RESUME_W = 1.35;
export const RESUME_H = 1.8;

export default function ResumePaper({ x, y }: { x: number; y: number }) {
  const W = RESUME_W;
  const H = RESUME_H;
  const lines = [0.62, 0.78, 0.94, 1.1, 1.26, 1.42, 1.58];
  return (
    <g transform={`translate(${x} ${y}) rotate(-3 ${W / 2} 0)`}>
    <g data-room="resume">
      <rect data-part="shadow" x={0.05} y={0.06} width={W} height={H} fill="#000" opacity={0.25} />
      <rect width={W} height={H} fill={P.paper} />
      {/* Name and heading */}
      <rect x={0.14} y={0.16} width={0.85} height={0.12} fill="#2b4a7a" />
      <rect x={0.14} y={0.34} width={0.55} height={0.06} fill={P.ink} />
      <rect x={0.14} y={0.47} width={W - 0.28} height={0.02} fill="#5b7fb8" />
      {lines.map((ly, i) => (
        <rect key={ly} x={0.14} y={ly} width={(W - 0.28) * (i % 3 === 2 ? 0.6 : 0.95)} height={0.045} fill={P.ink} />
      ))}
      {/* Pin */}
      <circle cx={W / 2} cy={0.05} r={0.08} fill={P.pin} />
      <circle cx={W / 2 - 0.025} cy={0.025} r={0.025} fill="#fff" opacity={0.6} />
      {/* Curled corner, shown on hover (step d) */}
      <path data-part="curl" d={`M${W} ${H - 0.38} L${W - 0.38} ${H} L${W} ${H} Z`} fill={P.paper} opacity={0} />
      <path data-part="curl" d={`M${W} ${H - 0.38} L${W - 0.38} ${H} L${W - 0.3} ${H - 0.3} Z`} fill="#d9d4c7" opacity={0} />
    </g>
    </g>
  );
}
