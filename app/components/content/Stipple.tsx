/**
 * A stippled edge between two sections: a band of fine dots in `color`
 * that starts sparse and packs together until it's solid, so one section's
 * colour dissolves into the next, like a print halftone.
 *
 * How it works (one SVG filter, no images):
 * 1. A linear gradient paints a grey ramp across the band.
 * 2. Fractal noise adds a random speckle on top.
 * 3. Where ramp + noise passes a threshold a dot appears, so there are few
 *    dots where the ramp is dark and a solid fill where it's white.
 * 4. The dots are filled with `color`.
 *
 * The noise is in screen pixels, so dots stay the same size at any width.
 */
type Props = {
  id: string;
  color: string;
  /** Which edge is solid: "down" = solid at the bottom, "up" = solid at the top. */
  solid: "down" | "up";
  /** Grain: higher is finer. */
  grain?: number;
  className?: string;
};

export default function Stipple({ id, color, solid, grain = 0.38, className }: Props) {
  const g = (v: number) => {
    const c = Math.round(v * 255);
    return `rgb(${c},${c},${c})`;
  };
  const [y1, y2] = solid === "down" ? [0, 1] : [1, 0];
  return (
    <svg aria-hidden className={className} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-ramp`} x1={0} y1={y1} x2={0} y2={y2}>
          <stop offset="0" stopColor={g(0.3)} />
          <stop offset="0.5" stopColor={g(0.7)} />
          <stop offset="1" stopColor={g(1)} />
        </linearGradient>
        <filter id={`${id}-dots`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={grain} numOctaves={1} seed={7} result="noise" />
          {/* ramp + noise − 1: only the bright overlaps survive (clamped at 0) */}
          <feComposite in="SourceGraphic" in2="noise" operator="arithmetic" k1={0} k2={1} k3={1} k4={-1} result="sum" />
          {/* Sharpen into dots: alpha = 24 × red */}
          <feColorMatrix in="sum" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  24 0 0 0 0" result="mask" />
          {/* As a style so CSS variables work, e.g. var(--sky) */}
          <feFlood style={{ floodColor: color }} />
          <feComposite in2="mask" operator="in" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-ramp)`} filter={`url(#${id}-dots)`} />
    </svg>
  );
}
