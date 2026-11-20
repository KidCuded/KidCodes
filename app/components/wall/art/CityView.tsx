import { rand } from "../util";

type Pt = [number, number];
const fmt = (list: Pt[]) => list.map(([x, y]) => `${Math.round(x * 1000) / 1000},${Math.round(y * 1000) / 1000}`).join(" ");
const mix = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/**
 * The view out of the window (2D, room units, w × h): looking down a city
 * street between tall buildings, with the street running off to a vanishing
 * point and a tall spire tower at the far end. All colours are CSS variables
 * (--wv-*, globals.css), so the same drawing works for day and night.
 */
export default function CityView({ w, h }: { w: number; h: number }) {
  const vp: Pt = [0.5 * w, 0.6 * h]; // vanishing point
  const nearBottom = 1.25 * h;

  /** A building face along one side of the street, between screen x a and b. */
  const facade = (nearX: number, topY: number, a: number, b: number) => {
    const at = (x: number) => (x - nearX) / (vp[0] - nearX);
    const top = (x: number): Pt => [x, topY + at(x) * (vp[1] - topY)];
    const bot = (x: number): Pt => [x, nearBottom + at(x) * (vp[1] - nearBottom)];
    // A point on the face: s = 0..1 from a to b (with perspective), t = 0..1 top to bottom.
    const point = (s: number, t: number): Pt => {
      const x = a + (b - a) * s;
      return mix(top(x), bot(x), t);
    };
    return { quad: [top(a), top(b), bot(b), bot(a)] as Pt[], point };
  };

  /** Windows on a facade: columns shrink with distance; some are lit at night. */
  const windows = (f: ReturnType<typeof facade>, cols: number, rows: number, seed: number, tMax = 0.86) => {
    const q = 0.82; // each column is this much narrower than the one before
    const total = (1 - q ** cols) / (1 - q);
    const out: { pts: string; lit: boolean }[] = [];
    let s0 = 0;
    for (let c = 0; c < cols; c++) {
      const sw = q ** c / total;
      const a = s0 + sw * 0.18;
      const b = s0 + sw * 0.78;
      for (let r = 0; r < rows; r++) {
        const t0 = 0.04 + (r / rows) * tMax;
        const t1 = t0 + (tMax / rows) * 0.62;
        out.push({
          pts: fmt([f.point(a, t0), f.point(b, t0), f.point(b, t1), f.point(a, t1)]),
          lit: rand(seed + c * 31 + r * 7) < 0.38,
        });
      }
      s0 += sw;
    }
    return out;
  };

  // Near buildings, tallest at the edges of the glass, stepping down toward the end of the street.
  const left = [facade(-0.02 * w, -0.15 * h, -0.02 * w, 0.36 * w), facade(-0.02 * w, 0.28 * h, 0.36 * w, 0.44 * w), facade(-0.02 * w, 0.1 * h, 0.44 * w, 0.475 * w)];
  const right = [facade(1.02 * w, -0.08 * h, 1.02 * w, 0.66 * w), facade(1.02 * w, 0.36 * h, 0.66 * w, 0.57 * w), facade(1.02 * w, 0.2 * h, 0.57 * w, 0.53 * w)];
  const leftWin = windows(left[0], 6, 10, 11);
  const rightWin = windows(right[0], 6, 10, 57);
  const leftWin2 = windows(left[1], 2, 6, 91, 0.8);
  const rightWin2 = windows(right[1], 2, 6, 133, 0.8);

  // Far skyline at the end of the street.
  const far = Array.from({ length: 11 }, (_, i) => {
    const x = 0.22 * w + i * 0.05 * w;
    const top = vp[1] - (0.08 + rand(i + 300) * 0.22) * h;
    return { x, w: 0.045 * w, top };
  });
  // Mid-rise blocks behind the near buildings (seen above their stepped roofs).
  const mid = Array.from({ length: 7 }, (_, i) => {
    const x = 0.12 * w + i * 0.11 * w;
    const top = (0.22 + rand(i + 420) * 0.18) * h;
    return { x, w: 0.1 * w, top };
  });

  // The spire tower at the end of the street.
  const tx = 0.56 * w;
  const tb = vp[1];
  const tower = fmt([
    [tx - 0.05 * w, tb],
    [tx - 0.035 * w, 0.2 * h],
    [tx - 0.012 * w, 0.1 * h],
    [tx + 0.012 * w, 0.1 * h],
    [tx + 0.035 * w, 0.2 * h],
    [tx + 0.05 * w, tb],
  ]);
  const towerLit = fmt([
    [tx, tb],
    [tx, 0.1 * h],
    [tx + 0.012 * w, 0.1 * h],
    [tx + 0.035 * w, 0.2 * h],
    [tx + 0.05 * w, tb],
  ]);

  // Street, pavements, lane markings, cars, trees and street lamps.
  const nearL: Pt = [-0.02 * w, nearBottom];
  const nearR: Pt = [1.02 * w, nearBottom];
  const street = fmt([nearL, vp, nearR]);
  const kerbL = fmt([nearL, vp, [0.16 * w, nearBottom]]);
  const kerbR = fmt([nearR, vp, [0.84 * w, nearBottom]]);
  const depth = [0.08, 0.14, 0.22, 0.33, 0.48, 0.7, 1];
  const dashes = depth.slice(0, -1).map((t, i) => {
    const a = mix(vp, [0.5 * w, nearBottom], t);
    const b = mix(vp, [0.5 * w, nearBottom], t + (depth[i + 1] - t) * 0.5);
    return { a, b, wd: 0.012 * w * (0.4 + t * 2) };
  });
  const cars = [
    { t: 0.3, lane: -0.18, c: 0 },
    { t: 0.45, lane: 0.2, c: 1 },
    { t: 0.62, lane: -0.2, c: 2 },
    { t: 0.2, lane: 0.16, c: 3 },
  ].map(({ t, lane, c }) => {
    const [x, yy] = mix(vp, [0.5 * w + lane * w * 1.2, nearBottom], t);
    const s = t * 0.22 * w;
    return { x, y: yy, s, c };
  });
  const trees = [0.32, 0.46, 0.62, 0.82].map((t) => {
    const [x, yy] = mix(vp, [0.08 * w, nearBottom], t);
    return { x, y: yy, r: t * 0.13 * w };
  });
  const lamps = [0.3, 0.5, 0.75].map((t) => {
    const [x, yy] = mix(vp, [0.92 * w, nearBottom], t);
    return { x, y: yy, hgt: t * 0.42 * h };
  });

  return (
    <g className="city-view">
      {mid.map((b) => (
        <rect key={b.x} x={b.x} y={b.top} width={b.w} height={vp[1] - b.top} style={{ fill: "var(--wv-mid)" }} />
      ))}
      {far.map((b) => (
        <rect key={b.x} x={b.x} y={b.top} width={b.w} height={vp[1] - b.top + 0.01} style={{ fill: "var(--wv-far)" }} />
      ))}
      <polygon points={tower} style={{ fill: "var(--wv-tower)" }} />
      <polygon points={towerLit} style={{ fill: "var(--wv-tower-lit)" }} />
      <line x1={tx} y1={0.1 * h} x2={tx} y2={0.01 * h} strokeWidth={0.012} style={{ stroke: "var(--wv-tower-lit)" }} />
      <circle className="twinkle" cx={tx} cy={0.012 * h} r={0.012} style={{ fill: "var(--wv-beacon)" }} />

      <polygon points={street} style={{ fill: "var(--wv-street)" }} />
      <polygon points={kerbL} style={{ fill: "var(--wv-walk)" }} />
      <polygon points={kerbR} style={{ fill: "var(--wv-walk)" }} />
      {dashes.map(({ a, b, wd }) => (
        <line key={a[1]} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeWidth={wd} style={{ stroke: "var(--wv-line)" }} />
      ))}
      {cars.map(({ x, y, s, c }) => (
        <g key={c}>
          <rect x={x - s / 2} y={y - s * 0.55} width={s} height={s * 0.45} rx={s * 0.08} style={{ fill: `var(--wv-car-${c})` }} />
          <rect x={x - s * 0.32} y={y - s * 0.78} width={s * 0.64} height={s * 0.28} rx={s * 0.08} style={{ fill: `var(--wv-car-${c})` }} />
          <rect x={x - s * 0.26} y={y - s * 0.74} width={s * 0.52} height={s * 0.18} style={{ fill: "var(--wv-glass)" }} />
          <circle cx={x - s * 0.36} cy={y - s * 0.3} r={s * 0.07} style={{ fill: "var(--wv-tail)" }} />
          <circle cx={x + s * 0.36} cy={y - s * 0.3} r={s * 0.07} style={{ fill: "var(--wv-tail)" }} />
        </g>
      ))}

      {/* Right side: lit by the sun by day */}
      <polygon points={fmt(right[2].quad)} style={{ fill: "var(--wv-right-far)" }} />
      <polygon points={fmt(right[1].quad)} style={{ fill: "var(--wv-right-mid)" }} />
      {rightWin2.map((wi) => (
        <polygon key={wi.pts} points={wi.pts} className={wi.lit ? "wv-lit" : "wv-win"} />
      ))}
      <polygon points={fmt(right[0].quad)} style={{ fill: "var(--wv-right)" }} />
      {rightWin.map((wi) => (
        <polygon key={wi.pts} points={wi.pts} className={wi.lit ? "wv-lit" : "wv-win"} />
      ))}
      {lamps.map((l) => (
        <g key={l.x}>
          <line x1={l.x} y1={l.y} x2={l.x} y2={l.y - l.hgt} strokeWidth={0.012} style={{ stroke: "var(--wv-pole)" }} />
          <circle cx={l.x} cy={l.y - l.hgt} r={0.02 + l.hgt * 0.04} style={{ fill: "var(--wv-lamp)" }} />
        </g>
      ))}

      {/* Left side: in shade */}
      <polygon points={fmt(left[2].quad)} style={{ fill: "var(--wv-left-far)" }} />
      <polygon points={fmt(left[1].quad)} style={{ fill: "var(--wv-left-mid)" }} />
      {leftWin2.map((wi) => (
        <polygon key={wi.pts} points={wi.pts} className={wi.lit ? "wv-lit" : "wv-win"} />
      ))}
      <polygon points={fmt(left[0].quad)} style={{ fill: "var(--wv-left)" }} />
      {leftWin.map((wi) => (
        <polygon key={wi.pts} points={wi.pts} className={wi.lit ? "wv-lit" : "wv-win"} />
      ))}
      {trees.map((t) => (
        <g key={t.x}>
          <line x1={t.x} y1={t.y} x2={t.x} y2={t.y - t.r * 1.2} strokeWidth={t.r * 0.18} style={{ stroke: "var(--wv-trunk)" }} />
          <circle cx={t.x} cy={t.y - t.r * 1.5} r={t.r} style={{ fill: "var(--wv-tree)" }} />
          <circle cx={t.x + t.r * 0.35} cy={t.y - t.r * 1.75} r={t.r * 0.6} style={{ fill: "var(--wv-tree-lit)" }} />
        </g>
      ))}
    </g>
  );
}
