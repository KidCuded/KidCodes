import { shade } from "../util";
import { P } from "../palette";
import { ST } from "../layouts";
import { ContactShadow } from "./Backdrop";
import CodeScreen from "./CodeScreen";
import { Racket, RunningShoes } from "./Sports";

// The workstation, drawn in desktop coordinates (layouts.ts → ST). Each
// layout places it with its `station` transform.

const { desk, screen: SCR, head: HEAD } = ST;
const TOP = desk.top;

/** Click areas for the workstation, in desktop coordinates. */
export const stationHits = {
  person: [
    [HEAD.cx - 95, HEAD.cy - 40],
    [HEAD.cx + 95, HEAD.cy - 40],
    [HEAD.cx + 95, ST.floorY + 15],
    [HEAD.cx - 95, ST.floorY + 15],
  ] as [number, number][],
  personLabel: [HEAD.cx + HEAD.r + 12, HEAD.cy] as [number, number], // right of the head, away from Quick links
  // The laptop is the computer (the monitor is behind Akid now)
  computer: { x: ST.laptop.x0 - 8, y: TOP - 92, w: ST.laptop.x1 - ST.laptop.x0 + 16, h: 98 },
  computerLabel: [(ST.laptop.x0 + ST.laptop.x1) / 2, TOP - 46] as [number, number],
};

/* ------------------------------------------------------------------------ */

/** White metal standing-desk frame. */
const METAL = "#eef0f3";
const METAL_SHADE = "#cfd4db";
const METAL_DARK = "#aab2bd";

/** One height-adjustable leg: a T-foot, a wide lower column, and a narrower upper column that slides into it. */
function DeskLeg({ x }: { x: number }) {
  const floor = ST.floorY;
  const joint = 655; // where the upper column enters the lower one
  return (
    <g>
      {/* Upper column (inner stage) */}
      <rect x={x - 7} y={TOP + 16} width={14} height={joint - TOP - 12} fill={METAL_SHADE} />
      {/* Lower column (outer stage), lit on the left */}
      <rect x={x - 10} y={joint} width={20} height={floor - joint - 8} rx={2} fill={METAL} />
      <rect x={x + 4} y={joint} width={6} height={floor - joint - 8} fill={METAL_SHADE} />
      <rect x={x - 10} y={joint} width={20} height={3} fill={METAL_DARK} />
      {/* T-foot with levelling pads */}
      <rect x={x - 40} y={floor - 10} width={80} height={9} rx={4.5} fill={METAL} />
      <rect x={x - 40} y={floor - 4} width={80} height={3} rx={1.5} fill={METAL_SHADE} />
      <rect x={x - 36} y={floor - 1} width={8} height={2} fill={METAL_DARK} />
      <rect x={x + 28} y={floor - 1} width={8} height={2} fill={METAL_DARK} />
    </g>
  );
}

function Desk() {
  const legL = desk.x0 + 55;
  const legR = desk.x1 - 50;
  return (
    <g data-room="desk">
      <ContactShadow cx={(desk.x0 + desk.x1) / 2} cy={ST.floorY + 2} rx={(desk.x1 - desk.x0) / 2 + 10} ry={9} />
      {/* Frame: a beam under the top joining the legs, then the legs */}
      <rect x={legL - 4} y={TOP + 14} width={legR - legL + 8} height={9} rx={2} fill={METAL_SHADE} />
      <DeskLeg x={legL} />
      <DeskLeg x={legR} />
      {/* Height controller under the front edge */}
      <rect x={desk.x1 - 112} y={TOP + 16} width={30} height={8} rx={2} fill="#374151" />
      <circle cx={desk.x1 - 102} cy={TOP + 20} r={1.6} fill="#93c5fd" />
      {/* Thin top with rounded corners: the top face (seen slightly from above), then the front edge */}
      <rect x={desk.x0} y={TOP} width={desk.x1 - desk.x0} height={16} rx={7} fill={P.wood} />
      <rect x={desk.x0} y={TOP} width={desk.x1 - desk.x0} height={8} rx={4} fill={shade(P.wood, 0.16)} />
      <rect x={desk.x0 + 3} y={TOP + 14} width={desk.x1 - desk.x0 - 6} height={2} rx={1} fill={shade(P.wood, -0.3)} />
    </g>
  );
}

/** Monitor with the editor and its self-typing code (CSS steps()), webcam and sticky note. */
function Monitor({ id }: { id: string }) {
  const clip = `${id}-screen-clip`;
  const cx = SCR.x + SCR.w / 2;
  return (
    <g data-room="computer">
      <defs>
        <clipPath id={clip}>
          <rect width={SCR.w} height={SCR.h} />
        </clipPath>
      </defs>
      {/* Stand */}
      <ContactShadow cx={cx} cy={TOP + 1} rx={55} ry={4} />
      <rect x={cx - 48} y={TOP - 7} width={96} height={7} rx={3} fill={shade(P.bezel, 0.15)} />
      <rect x={cx - 9} y={SCR.y + SCR.h + 10} width={18} height={TOP - SCR.y - SCR.h - 15} fill={P.bezel} />
      {/* Body, webcam */}
      <rect x={SCR.x - 12} y={SCR.y - 12} width={SCR.w + 24} height={SCR.h + 24} rx={8} fill={P.bezel} />
      <rect x={cx - 13} y={SCR.y - 20} width={26} height={9} rx={3} fill="#11151d" />
      <circle cx={cx} cy={SCR.y - 15.5} r={2} fill="#3a4458" />
      {/* The editor: live code that types and scrolls (CodeScreen), under a title bar */}
      <g transform={`translate(${SCR.x} ${SCR.y})`}>
        <rect width={SCR.w} height={SCR.h} fill={P.screen} />
        <g clipPath={`url(#${clip})`}>
          <rect y={13} width={14} height={SCR.h - 13} fill="#000" opacity={0.2} />
          <CodeScreen h={SCR.h} />
          <rect width={SCR.w} height={13} fill="#13223f" />
          {["#f87171", "#fbbf24", "#4ade80"].map((c, i) => (
            <circle key={c} cx={7 + i * 6.5} cy={6.5} r={2.2} fill={c} opacity={0.85} />
          ))}
          <rect x={30} y={3} width={46} height={7} rx={1.5} fill={P.accent} opacity={0.3} />
          <text x={34} y={8.6} fontSize={5} fill="#d6deeb" fontFamily="ui-monospace, Menlo, Consolas, monospace">
            room.tsx
          </text>
        </g>
        <rect data-part="screen-light" width={SCR.w} height={SCR.h} fill={P.accent} opacity={0} />
      </g>
      {/* Power light and a sticky note on the bezel */}
      <circle cx={SCR.x + SCR.w + 3} cy={SCR.y + SCR.h + 6} r={2.2} fill="#4ade80" />
      <g transform={`translate(${SCR.x + SCR.w - 14} ${SCR.y - 16}) rotate(7)`}>
        <rect width={30} height={30} fill="#fde68a" />
        <rect width={30} height={6} fill="#fcd34d" />
        <rect x={5} y={12} width={18} height={2.5} fill="#a16207" opacity={0.6} />
        <rect x={5} y={18} width={13} height={2.5} fill="#a16207" opacity={0.6} />
      </g>
    </g>
  );
}

/** Kopi mug with steam. */
/**
 * The laptop, open on the left of the desk and turned toward Akid: its right
 * side is further away, so the lid narrows and we see a sliver of its left
 * edge. The screen (an editor) is drawn through `q`, which maps flat screen
 * coordinates onto the turned lid. A cable runs along the desk to the monitor.
 */
function Laptop() {
  const { x0, x1 } = ST.laptop;
  const lidTop = TOP - 86;
  // The lid's corners: the right edge is further away, so it's shorter.
  const L = x0 + 6;
  const R = x1 - 16;
  const TL: [number, number] = [L, lidTop];
  const TR: [number, number] = [R, lidTop + 6];
  const BR: [number, number] = [R, TOP - 8];
  const BL: [number, number] = [L, TOP - 5];
  const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  /** A point on the lid, from u (0 left → 1 right) and v (0 top → 1 bottom). */
  const q = (u: number, v: number) => lerp(lerp(TL, TR, u), lerp(BL, BR, u), v);
  /** A rectangle on the lid, given in lid units. */
  const quad = (u0: number, v0: number, u1: number, v1: number) =>
    [q(u0, v0), q(u1, v0), q(u1, v1), q(u0, v1)].map((p) => p.map((n) => n.toFixed(2)).join(",")).join(" ");
  // The screen area inside the bezel, and a helper to place things on it.
  const S = { u0: 0.055, v0: 0.075, u1: 0.945, v1: 0.93 };
  const sq = (u0: number, v0: number, u1: number, v1: number) =>
    quad(S.u0 + (S.u1 - S.u0) * u0, S.v0 + (S.v1 - S.v0) * v0, S.u0 + (S.u1 - S.u0) * u1, S.v0 + (S.v1 - S.v0) * v1);
  const sp = (u: number, v: number) => q(S.u0 + (S.u1 - S.u0) * u, S.v0 + (S.v1 - S.v0) * v);

  // Editor lines: [indent, [width, colour]...] in screen units
  const code: [number, [number, string][]][] = [
    [0, [[0.14, "#ff7b72"], [0.2, "#d2a8ff"], [0.08, "#c9d1d9"]]],
    [1, [[0.1, "#ff7b72"], [0.16, "#79c0ff"], [0.12, "#a5d6ff"]]],
    [1, [[0.18, "#c9d1d9"], [0.1, "#ffa657"]]],
    [2, [[0.08, "#ff7b72"], [0.22, "#a5d6ff"]]],
    [1, [[0.06, "#c9d1d9"]]],
    [0, [[0.04, "#c9d1d9"]]],
    [0, [[0.12, "#8b949e"], [0.18, "#8b949e"]]],
  ];
  const monitorFoot = SCR.x + SCR.w / 2 - 48;
  return (
    <g data-room="laptop" aria-hidden="true">
      {/* The base turns with the lid: the deck runs out from the hinge toward
          Akid (right, and nearer to us), so it's a parallelogram on the desk. */}
      {(() => {
        const dx = 30; // how far the deck reaches toward Akid
        const dy = 5; // ...and toward us
        const hl: [number, number] = [L, TOP - 5]; // hinge, left end
        const hr: [number, number] = [R, TOP - 8]; // hinge, right end (further away)
        const fl: [number, number] = [L + dx, TOP - 5 + dy]; // front edge, left
        const fr: [number, number] = [R + dx, TOP - 8 + dy]; // front edge, right
        const pt = (...ps: [number, number][]) => ps.map((p) => p.join(",")).join(" ");
        const mix = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        // A patch of the deck: u along the hinge (0 left → 1 right), w from the hinge (0) to the front (1)
        const at = (u: number, w: number) => mix(mix(hl, hr, u), mix(fl, fr, u), w);
        const patch = (u0: number, w0: number, u1: number, w1: number) => pt(at(u0, w0), at(u1, w0), at(u1, w1), at(u0, w1));
        const thick = 2.5;
        return (
          <>
            {/* Cable from the base's right side, along the desk, to the monitor */}
            <path d={`M${fr[0] - 2} ${fr[1] - 1} C${fr[0] + 30} ${TOP} ${monitorFoot - 30} ${TOP - 1} ${monitorFoot + 6} ${TOP - 6}`} fill="none" stroke="#2b313c" strokeWidth={2.2} strokeLinecap="round" />
            <ContactShadow cx={(L + fr[0]) / 2 + 6} cy={TOP + 1} rx={(fr[0] - L) / 2 + 10} ry={3.5} />
            {/* Left side (with ports), then the front edge's thickness, then the top */}
            <polygon points={pt(hl, fl, [fl[0], fl[1] + thick], [hl[0], hl[1] + thick])} fill="#9aa2ad" />
            {[0.3, 0.55].map((t) => {
              const a = mix(hl, fl, t);
              const b = mix(hl, fl, t + 0.15);
              return <polygon key={t} points={pt([a[0], a[1] + 0.6], [b[0], b[1] + 0.6], [b[0], b[1] + 1.8], [a[0], a[1] + 1.8])} fill="#2b313c" />;
            })}
            <polygon points={pt(fl, fr, [fr[0], fr[1] + thick], [fl[0], fl[1] + thick])} fill="#aab1bb" />
            <polygon points={pt(hl, hr, fr, fl)} fill="#dfe3e8" />
            {/* Keyboard well and trackpad */}
            <polygon points={patch(0.08, 0.12, 0.92, 0.52)} fill="#2b313c" opacity={0.85} />
            {[0.22, 0.34, 0.46].map((w) => (
              <polygon key={w} points={patch(0.1, w - 0.04, 0.9, w)} fill="#4b5563" />
            ))}
            <polygon points={patch(0.36, 0.62, 0.64, 0.92)} fill="#cbd0d7" />
            <circle cx={at(0.95, 0.85)[0]} cy={at(0.95, 0.85)[1]} r={0.8} fill="#34d399" />
            {/* Hinge */}
            <polygon points={patch(0.04, 0, 0.96, 0.08)} fill="#8e96a2" />
          </>
        );
      })()}

      {/* Lid: the left edge's thickness, the aluminium shell, the black bezel */}
      <polygon points={`${L - 3.5},${lidTop + 1.5} ${L},${lidTop} ${L},${TOP - 5} ${L - 3.5},${TOP - 3.5}`} fill="#a9b0ba" />
      <polygon points={quad(0, 0, 1, 1)} fill="#c9ced6" />
      <polygon points={quad(0.025, 0.025, 0.975, 0.975)} fill="#14171c" />
      <circle cx={q(0.5, 0.04)[0]} cy={q(0.5, 0.04)[1]} r={1} fill="#3a404a" />

      {/* Screen: an editor window */}
      <polygon className="laptop-screen" points={sq(0, 0, 1, 1)} fill="#0d1117" />
      {/* title bar with window buttons */}
      <polygon points={sq(0, 0, 1, 0.1)} fill="#1c2128" />
      {["#ff5f57", "#febc2e", "#28c840"].map((c, k) => {
        const [px, py] = sp(0.05 + k * 0.045, 0.05);
        return <circle key={c} cx={px} cy={py} r={1.3} fill={c} />;
      })}
      {/* file tree */}
      <polygon points={sq(0, 0.1, 0.22, 0.92)} fill="#161b22" />
      {[0.18, 0.28, 0.38, 0.48, 0.58].map((v, k) => (
        <polygon key={v} points={sq(k === 2 ? 0.02 : 0.04, v, k === 1 ? 0.18 : 0.15, v + 0.045)} fill={k === 2 ? "#388bfd" : "#6e7681"} opacity={k === 2 ? 0.9 : 0.7} />
      ))}
      {/* tabs: the open file is lit */}
      <polygon points={sq(0.22, 0.1, 1, 0.19)} fill="#161b22" />
      <polygon points={sq(0.22, 0.1, 0.46, 0.19)} fill="#0d1117" />
      <polygon points={sq(0.22, 0.1, 0.46, 0.115)} fill="#f78166" />
      {/* code, with line numbers */}
      {code.map(([indent, tokens], row) => {
        const v = 0.25 + row * 0.085;
        let u = 0.31 + indent * 0.05;
        return (
          <g key={row}>
            <polygon points={sq(0.25, v, 0.28, v + 0.04)} fill="#484f58" />
            {tokens.map(([w, c], t) => {
              const el = <polygon key={t} points={sq(u, v, u + w, v + 0.04)} fill={c} />;
              u += w + 0.02;
              return el;
            })}
          </g>
        );
      })}
      {/* cursor and status bar */}
      <polygon points={sq(0.36, 0.765, 0.375, 0.815)} fill="#c9d1d9" />
      <polygon points={sq(0, 0.92, 1, 1)} fill="#1f6feb" />
      {/* glass reflection */}
      <polygon points={`${sp(0.55, 0)} ${sp(0.8, 0)} ${sp(0.45, 1)} ${sp(0.2, 1)}`} fill="#ffffff" opacity={0.05} />
    </g>
  );
}

function DeskThings() {
  const { x0, x1 } = ST.keyboard;
  const m = ST.mouse;
  const d = ST.duck.cx;
  const ph = ST.phone;
  const mx = m.x + m.w / 2;
  return (
    <g>
      {/* Keyboard: top face with three rows of keys, then the front edge */}
      <ContactShadow cx={(x0 + x1) / 2} cy={TOP + 3} rx={(x1 - x0) / 2 + 4} ry={3} />
      <polygon points={`${x0 + 5},${TOP - 10} ${x1 - 5},${TOP - 10} ${x1},${TOP} ${x0},${TOP}`} fill={P.keyboard} />
      {[0, 1, 2].map((r) =>
        Array.from({ length: Math.floor((x1 - x0 - 14) / 7) }, (_, k) => (
          <rect key={`${r}-${k}`} x={x0 + 7 + r * 1.5 + k * 7} y={TOP - 8.5 + r * 2.8} width={5} height={1.9} fill="#eef1f6" />
        )),
      )}
      <rect x={x0} y={TOP} width={x1 - x0} height={4} fill={shade(P.keyboard, -0.25)} />
      {/* Mouse pad: a thin mat with a visible edge */}
      <polygon points={`${m.x - 12},${TOP - 8} ${m.x + m.w + 14},${TOP - 8} ${m.x + m.w + 19},${TOP} ${m.x - 17},${TOP}`} fill="#2a3347" />
      <rect x={m.x - 17} y={TOP} width={m.w + 36} height={2.5} fill="#171d2b" />
      {/* Cable */}
      <path d={`M${mx} ${TOP - 14} Q${mx - 6} ${TOP - 32} ${SCR.x + SCR.w / 2 + 20} ${TOP - 6}`} fill="none" stroke="#3a4458" strokeWidth={1.5} />
      {/* Mouse: a dome with a shaded underside, a lit top, a button seam and a scroll wheel */}
      <ellipse cx={mx + 3} cy={TOP - 1} rx={m.w * 0.62} ry={3.5} fill="#000" opacity={0.45} />
      <ellipse cx={mx} cy={TOP - 5} rx={m.w * 0.55} ry={6.5} fill="#7d8798" />
      <ellipse cx={mx} cy={TOP - 8} rx={m.w * 0.52} ry={7} fill="#cfd6e0" />
      <ellipse cx={mx + 3} cy={TOP - 7} rx={m.w * 0.42} ry={5} fill="#b9c2cf" />
      <ellipse cx={mx - 4} cy={TOP - 10.5} rx={m.w * 0.24} ry={2.6} fill="#ffffff" opacity={0.8} />
      <line x1={mx} y1={TOP - 15} x2={mx} y2={TOP - 9} stroke="#7d8798" strokeWidth={1} />
      <rect x={mx - 1.6} y={TOP - 14.5} width={3.2} height={4.5} rx={1.6} fill="#3a4458" />

      {/* Phone lying face up: a slab with a dark edge, a glossy lit screen and a camera */}
      <ellipse cx={(ph.x0 + ph.x1) / 2 + 3} cy={TOP + 1} rx={(ph.x1 - ph.x0) * 0.6} ry={3} fill="#000" opacity={0.45} />
      <polygon points={`${ph.x0 + 2},${TOP - 1} ${ph.x1},${TOP - 1} ${ph.x1},${TOP + 2} ${ph.x0 + 2},${TOP + 2}`} fill="#0b0f16" />
      <polygon points={`${ph.x1 - 4},${TOP - 10} ${ph.x1},${TOP - 1} ${ph.x1},${TOP + 2} ${ph.x1 - 4},${TOP - 7}`} fill="#121822" />
      <polygon points={`${ph.x0 + 6},${TOP - 10} ${ph.x1 - 4},${TOP - 10} ${ph.x1},${TOP - 1} ${ph.x0 + 2},${TOP - 1}`} fill="#1f2633" />
      <polygon className="phone-screen" points={`${ph.x0 + 9},${TOP - 9} ${ph.x1 - 6},${TOP - 9} ${ph.x1 - 3},${TOP - 2} ${ph.x0 + 5},${TOP - 2}`} />
      <polygon points={`${ph.x0 + 12},${TOP - 7.5} ${ph.x0 + 30},${TOP - 7.5} ${ph.x0 + 31},${TOP - 5.5} ${ph.x0 + 11},${TOP - 5.5}`} fill="#ffffff" opacity={0.75} />
      <polygon points={`${ph.x0 + 10},${TOP - 4.5} ${ph.x0 + 24},${TOP - 4.5} ${ph.x0 + 25},${TOP - 3} ${ph.x0 + 9},${TOP - 3}`} fill="#ffffff" opacity={0.45} />
      <polygon points={`${ph.x1 - 16},${TOP - 9} ${ph.x1 - 8},${TOP - 9} ${ph.x1 - 13},${TOP - 2} ${ph.x1 - 21},${TOP - 2}`} fill="#ffffff" opacity={0.14} />
      <line x1={ph.x0 + 6} y1={TOP - 10} x2={ph.x1 - 4} y2={TOP - 10} stroke="#4b5567" strokeWidth={1} />
      {/* Claude Code's pixel mascot (wobbles on hover): a wide orange body,
          two tall eyes, stubby arms and four little legs, all on a pixel grid */}
      <g data-room="duck" aria-hidden="true">
        <g data-part="duck-body">
          <ellipse cx={d} cy={TOP - 0.5} rx={17} ry={2.2} fill="#000" opacity={0.25} />
          {[-11.7, -6.5, 3.9, 9.1].map((lx) => (
            <rect key={lx} x={d + lx} y={TOP - 7} width={2.6} height={6.5} fill="#c4664a" />
          ))}
          <rect x={d - 13} y={TOP - 21} width={26} height={14.5} fill="#d97757" />
          <rect x={d - 17} y={TOP - 15.8} width={4} height={4} fill="#d97757" />
          <rect x={d + 13} y={TOP - 15.8} width={4} height={4} fill="#d97757" />
          <rect x={d - 13} y={TOP - 21} width={26} height={2} fill="#e8957a" />
          <rect x={d - 7.8} y={TOP - 18.4} width={2.6} height={5.2} fill="#1b1410" />
          <rect x={d + 5.2} y={TOP - 18.4} width={2.6} height={5.2} fill="#1b1410" />
        </g>
      </g>
    </g>
  );
}

/** Waste bin under the desk. */
function Bin() {
  const { x, w } = ST.bin;
  const top = 700;
  return (
    <g aria-hidden="true">
      <ContactShadow cx={x + w / 2} cy={ST.floorY + 1} rx={w * 0.6} ry={5} />
      <polygon points={`${x},${top} ${x + w},${top} ${x + w - 7},${ST.floorY} ${x + 7},${ST.floorY}`} fill="#e5e7eb" />
      <polygon points={`${x + w * 0.6},${top} ${x + w},${top} ${x + w - 7},${ST.floorY} ${x + w * 0.62},${ST.floorY}`} fill="#d3d7de" />
      <circle cx={x + w / 2 - 6} cy={top - 3} r={9} fill="#f7f8fa" />
      <rect x={x - 2} y={top - 2} width={w + 4} height={7} rx={3} fill="#f3f4f6" />
    </g>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Akid at the desk, from behind, in the style of the character sheet: a big
 * round head of curly hair, narrow rounded shoulders, slim arms, and a
 * football jersey with his name and number on the back. Right hand on the
 * mouse. On hover the hair slides inside the head's outline (CSS), so the head
 * seems to turn toward the viewer.
 */
const JERSEY = "#e63946";
const TRIM = "#ffffff";

export function Person() {
  const { cx, cy, r } = HEAD;
  const skin = P.skin;
  const hand: [number, number] = [ST.keyboard.x0 + 118, TOP - 7]; // right hand on the keyboard
  const arm = (pts: [number, number][], color: string, w: number, cap: "round" | "butt" = "round") => (
    <path d={`M${pts.map((p) => p.join(" ")).join(" L")}`} fill="none" stroke={color} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" />
  );

  /**
   * A short sleeve: a band from the shoulder (top) to the cuff (bottom), with
   * its outer top corner rounded off so the shoulder reads as round.
   * s = 1 for the right arm, -1 for the left.
   */
  const sleeve = (s: 1 | -1) => {
    const T = [cx + s * 56, 470]; // centre of the top end
    const B = [cx + s * 71, 520]; // centre of the bottom end (the cuff)
    const half = 17.5; // half the sleeve width
    const R = 16; // how round the shoulder is (0 = square corner)
    const len = Math.hypot(B[0] - T[0], B[1] - T[1]);
    const d = [(B[0] - T[0]) / len, (B[1] - T[1]) / len]; // down the sleeve
    const n = [s * d[1], -s * d[0]]; // outward, away from the body
    const at = (p: number[], a: number[], k: number) => [p[0] + a[0] * k, p[1] + a[1] * k];
    const TO = at(T, n, half); // outer top corner (gets rounded)
    const TI = at(T, n, -half); // inner top corner (hidden by the body)
    const BO = at(B, n, half);
    const BI = at(B, n, -half);
    const start = at(TO, n, -R); // where the curve leaves the top edge
    const end = at(TO, d, R); // where it joins the outer edge
    const f = (p: number[]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    return <path d={`M${f(BI)} L${f(TI)} L${f(start)} Q${f(TO)} ${f(end)} L${f(BO)} Z`} fill={JERSEY} />;
  };

  // Curly hair: a scalloped outline over the top and sides, ending at a wavy nape line.
  const hy = cy - r * 0.06;
  const R = r * 1.04;
  const N = 11;
  const ang = (k: number) => ((205 - (230 * k) / N) * Math.PI) / 180;
  const at = (a: number, rr: number) => [cx + rr * Math.cos(a), hy - rr * Math.sin(a)].map((n) => n.toFixed(1)).join(" ");
  let hair = `M${at(ang(0), R)}`;
  for (let k = 0; k < N; k++) hair += ` Q${at((ang(k) + ang(k + 1)) / 2, R * 1.2)} ${at(ang(k + 1), R)}`;
  hair += ` L${cx + r * 0.92} ${cy + r * 0.45}`;
  hair += ` Q${cx + r * 0.55} ${cy + r * 0.92} ${cx} ${cy + r * 0.8} Q${cx - r * 0.55} ${cy + r * 0.92} ${cx - r * 0.92} ${cy + r * 0.45} Z`;
  const curls: [number, number][] = [
    [-0.5, -0.55], [0, -0.75], [0.48, -0.55], [-0.62, -0.05], [-0.15, -0.2], [0.32, -0.12], [0.66, 0.1], [-0.35, 0.3], [0.15, 0.4], [0.6, 0.45], [-0.62, 0.45],
  ];

  // Jersey: rounded shoulders, a gentle taper, white side piping.
  const sh = 64; // half-width at the shoulders
  const wa = 54; // half-width at the hem
  const yS = 468; // top of the shoulders
  const yH = 640; // hem
  const body = `M${cx - wa} ${yH} L${cx - sh} 505 Q${cx - sh} ${yS + 2} ${cx - 36} ${yS} L${cx + 36} ${yS} Q${cx + sh} ${yS + 2} ${cx + sh} 505 L${cx + wa} ${yH} Z`;

  return (
    <g data-room="person">
      {/* Akid's legs, seen from behind under the seat: dark trousers and white
          sneakers, going forward under the desk (the chair is drawn over them) */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          {arm([[cx + sd * 34, 672], [cx + sd * 40, 728], [cx + sd * 44, 764]], "#2b3548", 26)}
          <rect x={cx + sd * 44 - 15} y={760} width={30} height={13} rx={6} fill="#f4f5f7" />
          <rect x={cx + sd * 44 - 15} y={769} width={30} height={4} rx={2} fill="#c9ced6" />
        </g>
      ))}
      {/* Chair base: wheels, legs and gas post */}
      <ContactShadow cx={cx + 2} cy={ST.floorY + 12} rx={100} ry={10} />
      {[
        [cx - 82, 782],
        [cx + 82, 782],
        [cx - 48, 794],
        [cx + 48, 794],
        [cx, 798],
      ].map(([fx, fy]) => (
        <g key={fx}>
          {arm([[cx, 762], [fx, fy]], "#3b4456", 8)}
          <circle cx={fx} cy={fy + 5} r={7} fill="#141820" />
        </g>
      ))}
      {/* Seat raised: a longer gas post, the seat and backrest higher (Akid stays put) */}
      <rect x={cx - 6} y={677} width={12} height={87} fill={P.metal} />
      <rect x={cx - 9} y={677} width={18} height={34} fill="#2a3140" />
      <rect x={cx - 74} y={662} width={148} height={26} rx={12} fill={shade(P.chair, -0.15)} />

      {/* Forearms and hands reach forward to the keyboard, so from behind they
          go behind the body (drawn before the jersey); only the upper arms show */}
      {arm([[cx - 76, 580], [ST.keyboard.x0 + 40, TOP - 6]], skin, 20)}
      {arm([[cx + 80, 580], hand], skin, 20)}
      <ellipse cx={hand[0] + 2} cy={hand[1]} rx={12} ry={8.5} fill={shade(skin, -0.06)} />

      {/* Jersey */}
      <g data-part="torso">
        <path d={body} fill={JERSEY} />
        <path d={`M${cx - wa} ${yH} L${cx - sh} 505 Q${cx - sh} ${yS + 2} ${cx - 36} ${yS} L${cx - 30} ${yS} Q${cx - 52} ${yS + 6} ${cx - 52} 505 L${cx - wa + 10} ${yH} Z`} fill={shade(JERSEY, -0.18)} />
        <path d={`M${cx - sh + 3} 512 L${cx - wa + 3} ${yH}`} stroke={TRIM} strokeWidth={4} />
        <path d={`M${cx + sh - 3} 512 L${cx + wa - 3} ${yH}`} stroke={TRIM} strokeWidth={4} />
        <text x={cx} y={497} fontSize={15} fontWeight={800} letterSpacing={2.5} textAnchor="middle" fill={TRIM}>
          {"Kid"}
        </text>
        <text x={cx} y={535} fontSize={36} fontWeight={900} textAnchor="middle" fill={TRIM} stroke={shade(JERSEY, -0.35)} strokeWidth={1.5} paintOrder="stroke">
          10
        </text>
        {/* Collar: a white rib around the neck */}
        <ellipse cx={cx} cy={yS + 2} rx={21} ry={6.5} fill={TRIM} />
        <ellipse cx={cx} cy={yS + 1} rx={16} ry={4} fill={shade(skin, -0.2)} />
      </g>
      {/* Neck */}
      <rect x={cx - 14} y={448} width={28} height={22} rx={8} fill={skin} />
      <rect x={cx - 11} y={448} width={25} height={7} fill={shade(skin, -0.15)} />

      {/* Arms: slim, with short jersey sleeves and white cuffs */}
      {arm([[cx - 71, 515], [cx - 76, 580]], skin, 21)}
      {sleeve(-1)}
      {arm([[cx - 69.2, 514], [cx - 71, 520]], TRIM, 35, "butt")}
      {arm([[cx + 71, 515], [cx + 80, 580]], skin, 21)}
      {sleeve(1)}
      {arm([[cx + 69.2, 514], [cx + 71, 520]], TRIM, 35, "butt")}

      {/* Head: big and round, curly hair from behind */}
      <g data-part="head">
        <ellipse cx={cx - r + 1} cy={cy + 8} rx={7} ry={11} fill={shade(skin, -0.05)} />
        <ellipse data-part="ear" cx={cx + r - 1} cy={cy + 8} rx={7} ry={11} fill={shade(skin, -0.05)} />
        <circle cx={cx} cy={cy} r={r} fill={skin} />
        <g data-part="hair">
          <path d={hair} fill={P.hair} />
          {curls.map(([dx, dy]) => (
            <path
              key={`${dx}${dy}`}
              d={`M${cx + r * dx - 5} ${cy + r * dy + 2} q5 -9 10 0`}
              fill="none"
              stroke="#3a2a20"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* Chair back, nearest the viewer */}
      <rect x={cx - 6} y={667} width={12} height={20} fill="#3b4456" />
      <rect x={cx - 60} y={548} width={120} height={130} rx={24} fill={P.chair} />
      <rect x={cx - 60} y={548} width={120} height={10} rx={5} fill={shade(P.chair, 0.12)} />
      <rect x={cx - 50} y={562} width={100} height={106} rx={18} fill="none" stroke={shade(P.chair, 0.14)} strokeWidth={2.5} />
      <path d={`M${cx - 48} 618 Q${cx} 627 ${cx + 48} 618`} fill="none" stroke={shade(P.chair, -0.18)} strokeWidth={2.5} />
    </g>
  );
}

/** The speech bubble that pops up from the head on hover or focus. */
export function SpeechBubble() {
  const { x, y, w, h } = ST.bubble;
  const { cx, cy, r } = HEAD;
  return (
    <g data-part="bubble" aria-hidden="true">
      <rect x={x} y={y} width={w} height={h} rx={34} fill={P.paper} />
      <path d={`M${x + w * 0.62} ${y + h - 2} L${cx - r * 0.5} ${cy - r * 0.75} L${x + w * 0.86} ${y + h - 2} Z`} fill={P.paper} />
      {[-1, 0, 1].map((k) => (
        <circle key={k} cx={x + w / 2 + k * 26} cy={y + h / 2} r={7} fill="#9aa3b2" />
      ))}
    </g>
  );
}

/** Everything at the desk, back to front (the person and bubble are drawn later, on top). */
export default function Station({ id }: { id: string }) {
  return (
    <g>
      <Desk />
      <RunningShoes />
      <Racket id={id} />
      <Bin />
      <Monitor id={id} />
      <Laptop />
      <DeskThings />
    </g>
  );
}
