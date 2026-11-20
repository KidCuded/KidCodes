import { P } from "../palette";

/**
 * The contact envelope pinned to the pegboard (closed state). Drawn in the
 * pegboard face's 2D coordinates. On hover the flap flips open and a card
 * slides out (CSS in globals.css).
 */
export const ENVELOPE_W = 1.45;
export const ENVELOPE_H = 0.95;

export default function Envelope({ x, y }: { x: number; y: number }) {
  const W = ENVELOPE_W;
  const H = ENVELOPE_H;
  return (
    <g transform={`translate(${x} ${y}) rotate(4 ${W / 2} 0)`}>
    <g data-room="envelope">
      <rect x={0.05} y={0.06} width={W} height={H} fill="#000" opacity={0.25} />
      <rect width={W} height={H} fill={P.envelope} />
      {/* Bottom folds */}
      <path d={`M0 ${H} L${W / 2} ${H * 0.45} L${W} ${H}`} fill="none" stroke="#c9b083" strokeWidth={0.03} />
      {/* Flap: closed by default; flips up on hover (step d) */}
      <g data-part="flap">
        <path d={`M0 0 L${W / 2} ${H * 0.55} L${W} 0 Z`} fill={P.envelopeFlap} />
        <circle cx={W / 2} cy={H * 0.52} r={0.1} fill={P.seal} />
      </g>
      {/* Card: hidden while closed; slides up out of the envelope on hover (step d) */}
      <g data-part="card" opacity={0}>
        <rect x={0.12} y={0.08} width={W - 0.24} height={H - 0.2} fill={P.paper} />
        <rect x={0.25} y={0.2} width={0.6} height={0.06} fill={P.accent} />
        <rect x={0.25} y={0.33} width={0.85} height={0.04} fill={P.ink} />
      </g>
      {/* Pin */}
      <circle cx={0.18} cy={0.12} r={0.07} fill={P.accent} />
    </g>
    </g>
  );
}
