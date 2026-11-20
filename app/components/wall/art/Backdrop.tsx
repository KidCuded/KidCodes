import { FLOOR_GAP, type WallLayout } from "../layouts";

// Far beyond the viewBox, so any spare screen space is more wall and floor.
const BLEED = 3000;

/** Wall, skirting and floor (parallax layer 0). Colours follow the theme (--wl-*). */
export function WallAndFloor({ layout }: { layout: WallLayout }) {
  const { width, height, skirtY, id } = layout;
  const floorY = skirtY + FLOOR_GAP;
  const grad = `${id}-wall-grad`;
  // Plank seams: rows get taller toward the viewer (a hint of perspective).
  const rows: number[] = [];
  for (let y = floorY, step = 14; y < height + 600; step *= 1.35, y += step) rows.push(y);
  return (
    <g data-room="wall">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2={skirtY} gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--wl-wall-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--wl-wall)" }} />
        </linearGradient>
      </defs>
      <rect x={-BLEED} y={-BLEED} width={width + BLEED * 2} height={skirtY + BLEED} fill={`url(#${grad})`} />
      {/* Floor */}
      <rect x={-BLEED} y={floorY} width={width + BLEED * 2} height={height - floorY + BLEED} style={{ fill: "var(--wl-floor)" }} />
      {rows.map((y, i) => (
        <g key={y}>
          <line x1={-BLEED} y1={y} x2={width + BLEED} y2={y} strokeWidth={1.5} style={{ stroke: "var(--wl-plank)" }} />
          {Array.from({ length: Math.ceil(width / 260) + 2 }, (_, k) => {
            const x = k * 260 - 130 + (i % 2) * 130;
            const next = rows[i + 1] ?? y + 40;
            return <line key={x} x1={x} y1={y} x2={x} y2={next} strokeWidth={1.5} style={{ stroke: "var(--wl-plank)" }} />;
          })}
        </g>
      ))}
      {/* Skirting board with a lit top lip */}
      <rect x={-BLEED} y={skirtY} width={width + BLEED * 2} height={FLOOR_GAP} style={{ fill: "var(--wl-skirt)" }} />
      <rect x={-BLEED} y={skirtY} width={width + BLEED * 2} height={3} style={{ fill: "var(--wl-skirt-top)" }} />
    </g>
  );
}

/** The rug and the window's light on the floor (parallax layer 3, nearest). */
export function Rug({ layout }: { layout: WallLayout }) {
  const { x, y, w, h } = layout.rug;
  const inset = h * 0.45;
  const outer = `${x + inset},${y} ${x + w - inset},${y} ${x + w},${y + h} ${x},${y + h}`;
  const b = 9;
  const inner = `${x + inset + b},${y + b * 0.6} ${x + w - inset - b},${y + b * 0.6} ${x + w - b * 1.6},${y + h - b} ${x + b * 1.6},${y + h - b}`;
  return (
    <g data-room="rug">
      <polygon points={outer} style={{ fill: "var(--wl-rug-border)" }} />
      <polygon points={inner} style={{ fill: "var(--wl-rug)" }} />
    </g>
  );
}

/** Light from the window on the floor: warm by day, pale blue moonlight at night. */
export function WindowLight({ layout }: { layout: WallLayout }) {
  const { x, w } = layout.window;
  const floorY = layout.skirtY + FLOOR_GAP;
  const pts = `${x + 10},${floorY + 4} ${x + w - 10},${floorY + 4} ${x + w - 50},${floorY + 105} ${x - 90},${floorY + 105}`;
  return (
    <g aria-hidden="true">
      <polygon className="window-beam window-beam-day" points={pts} fill="#fff1bf" />
      <polygon className="window-beam window-beam-night" points={pts} fill="#bcd4ff" />
    </g>
  );
}

/** A soft contact shadow (an ellipse) under something standing on the floor or desk. */
export function ContactShadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse className="contact-shadow" cx={cx} cy={cy} rx={rx} ry={ry} fill="#000" />;
}
