import type React from "react";
import { shade } from "../util";
import { P } from "../palette";
import { ST } from "../layouts";
import { ContactShadow } from "./Backdrop";
import CodeScreen from "./CodeScreen";

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
  personLabel: [HEAD.cx - HEAD.r - 12, HEAD.cy] as [number, number],
  computer: { x: SCR.x - 12, y: SCR.y - 22, w: SCR.w + 24, h: TOP - SCR.y + 22 },
  computerLabel: [SCR.x + SCR.w / 2 + 20, SCR.y + SCR.h / 2] as [number, number],
};

/* ------------------------------------------------------------------------ */

function Desk() {
  return (
    <g data-room="desk">
      <ContactShadow cx={(desk.x0 + desk.x1) / 2} cy={ST.floorY + 2} rx={(desk.x1 - desk.x0) / 2 + 10} ry={9} />
      {/* Legs (side panels) and a back rail */}
      <rect x={desk.x0 + 12} y={TOP + 40} width={20} height={ST.floorY - TOP - 40} fill={P.woodDark} />
      <rect x={desk.x1 - 32} y={TOP + 40} width={20} height={ST.floorY - TOP - 40} fill={P.woodDark} />
      <rect x={desk.x0 + 32} y={TOP + 60} width={desk.x1 - desk.x0 - 64} height={40} fill={shade(P.woodDark, -0.25)} />
      {/* Top face (seen slightly from above), then the front edge */}
      <rect x={desk.x0} y={TOP} width={desk.x1 - desk.x0} height={15} fill={shade(P.wood, 0.16)} />
      <rect x={desk.x0} y={TOP + 15} width={desk.x1 - desk.x0} height={25} fill={P.wood} />
      <rect x={desk.x0} y={TOP + 36} width={desk.x1 - desk.x0} height={4} fill={shade(P.wood, -0.3)} />
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
function Mug() {
  const { x, w } = ST.mug;
  const top = TOP - 36;
  return (
    <g data-room="mug" aria-hidden="true">
      <ContactShadow cx={x + w / 2} cy={TOP + 1} rx={w * 0.7} ry={3.5} />
      <path d={`M${x + w - 2} ${top + 8} q14 2 10 16 q-3 8 -10 4`} fill="none" stroke="#d9dde5" strokeWidth={4} />
      <rect x={x} y={top} width={w} height={36} rx={5} fill="#eceef2" />
      <rect x={x} y={top + 15} width={w} height={6} fill="#c2453d" opacity={0.85} />
      <ellipse cx={x + w / 2} cy={top} rx={w / 2} ry={4} fill="#f7f8fa" />
      <ellipse cx={x + w / 2} cy={top} rx={w / 2 - 3} ry={2.6} fill="#6b4a33" />
      {[-6, 6].map((dx, i) => (
        <path
          key={dx}
          className="steam"
          style={{ "--i": i } as React.CSSProperties}
          d={`M${x + w / 2 + dx} ${top - 4} q-5 -9 0 -17 q5 -8 0 -16`}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function DeskThings() {
  const { x0, x1 } = ST.keyboard;
  const m = ST.mouse;
  const d = ST.duck.cx;
  const ph = ST.phone;
  const mx = m.x + m.w / 2;
  const u = 60;
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
      {/* Rubber duck (wobbles on hover) */}
      <g data-room="duck" aria-hidden="true">
        <g data-part="duck-body">
          <ellipse cx={d} cy={TOP - 1} rx={u * 0.26} ry={u * 0.05} fill="#000" opacity={0.2} />
          <ellipse cx={d} cy={TOP - u * 0.12} rx={u * 0.24} ry={u * 0.13} fill="#f7c948" />
          <circle cx={d + u * 0.1} cy={TOP - u * 0.31} r={u * 0.12} fill="#f7c948" />
          <path d={`M${d + u * 0.2} ${TOP - u * 0.31} l${u * 0.12} ${u * 0.02} l${-u * 0.11} ${u * 0.05} Z`} fill="#f08a24" />
          <circle cx={d + u * 0.14} cy={TOP - u * 0.34} r={u * 0.02} fill="#1b2235" />
          <path d={`M${d - u * 0.13} ${TOP - u * 0.16} q${u * 0.1} ${-u * 0.08} ${u * 0.19} 0`} fill="none" stroke="#e0ad2a" strokeWidth={u * 0.03} />
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
      <rect x={cx - 6} y={705} width={12} height={59} fill={P.metal} />
      <rect x={cx - 9} y={705} width={18} height={28} fill="#2a3140" />
      <rect x={cx - 74} y={690} width={148} height={26} rx={12} fill={shade(P.chair, -0.15)} />

      {/* Left forearm, reaching to the keyboard (mostly behind the body) */}
      {arm([[cx - 76, 580], [ST.keyboard.x0 + 40, TOP - 6]], skin, 20)}

      {/* Jersey */}
      <g data-part="torso">
        <path d={body} fill={JERSEY} />
        <path d={`M${cx - wa} ${yH} L${cx - sh} 505 Q${cx - sh} ${yS + 2} ${cx - 36} ${yS} L${cx - 30} ${yS} Q${cx - 52} ${yS + 6} ${cx - 52} 505 L${cx - wa + 10} ${yH} Z`} fill={shade(JERSEY, -0.18)} />
        <path d={`M${cx - sh + 3} 512 L${cx - wa + 3} ${yH}`} stroke={TRIM} strokeWidth={4} />
        <path d={`M${cx + sh - 3} 512 L${cx + wa - 3} ${yH}`} stroke={TRIM} strokeWidth={4} />
        <text x={cx} y={497} fontSize={13} fontWeight={800} letterSpacing={2.5} textAnchor="middle" fill={TRIM}>
          {"<dev>"}
        </text>
        <text x={cx} y={537} fontSize={36} fontWeight={900} textAnchor="middle" fill={TRIM} stroke={shade(JERSEY, -0.35)} strokeWidth={1.5} paintOrder="stroke">
          10
        </text>
        {/* Collar: a white rib around the neck */}
        <ellipse cx={cx} cy={yS + 2} rx={21} ry={6.5} fill={TRIM} />
        <ellipse cx={cx} cy={yS + 1} rx={16} ry={4} fill={shade(skin, -0.2)} />
      </g>
      {/* Neck */}
      <rect x={cx - 11} y={448} width={22} height={22} rx={8} fill={skin} />
      <rect x={cx - 11} y={448} width={22} height={7} fill={shade(skin, -0.15)} />

      {/* Arms: slim, with short jersey sleeves and white cuffs */}
      {arm([[cx - 71, 515], [cx - 76, 580]], skin, 21)}
      {sleeve(-1)}
      {arm([[cx - 69.2, 514], [cx - 71, 520]], TRIM, 35, "butt")}
      {arm([[cx + 71, 515], [cx + 80, 580], hand], skin, 21)}
      <ellipse cx={hand[0] + 2} cy={hand[1]} rx={12} ry={8.5} fill={shade(skin, -0.06)} />
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
      <rect x={cx - 6} y={695} width={12} height={20} fill="#3b4456" />
      <rect x={cx - 60} y={566} width={120} height={140} rx={24} fill={P.chair} />
      <rect x={cx - 60} y={566} width={120} height={10} rx={5} fill={shade(P.chair, 0.12)} />
      <rect x={cx - 50} y={580} width={100} height={116} rx={18} fill="none" stroke={shade(P.chair, 0.14)} strokeWidth={2.5} />
      <path d={`M${cx - 48} 640 Q${cx} 649 ${cx + 48} 640`} fill="none" stroke={shade(P.chair, -0.18)} strokeWidth={2.5} />
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
      <Bin />
      <Monitor id={id} />
      <Mug />
      <DeskThings />
    </g>
  );
}
