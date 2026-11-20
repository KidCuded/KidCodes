import type React from "react";
import { rand } from "../util";
import { P } from "../palette";
import Clock from "./Clock";
import CityView from "./CityView";
import ResumePaper, { RESUME_H, RESUME_W } from "./ResumePaper";
import Envelope, { ENVELOPE_H, ENVELOPE_W } from "./Envelope";
import { Stickers } from "./Stickers";
import type { Rect, WallLayout } from "../layouts";

/** A wall item's soft drop shadow (light from the right: down and to the left). */
function DropShadow({ x, y, w, h, rx = 0 }: Rect & { rx?: number }) {
  return <rect className="drop-shadow" x={x - 6} y={y + 8} width={w} height={h} rx={rx} fill="#000" />;
}

/* ------------------------------------------------------------------------ */

/** String lights along the top of the wall: warm at night, pale glass by day. */
export function FairyLights({ layout }: { layout: WallLayout }) {
  const { x0, x1, y, sag, bulbs, } = layout.fairy;
  const hooks = Math.max(2, Math.round((x1 - x0) / 230)) + 1;
  const span = (x1 - x0) / (hooks - 1);
  const yAt = (x: number) => y + sag * Math.sin(Math.PI * (((x - x0) % span) / span));
  const wire = Array.from({ length: 121 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / 120;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${yAt(x).toFixed(1)}`;
  }).join(" ");
  const halo = `${layout.id}-bulb-halo`;
  return (
    <g data-room="fairy-lights" aria-hidden="true">
      <defs>
        <radialGradient id={halo}>
          <stop offset="0" stopColor="#ffc879" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffc879" stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={wire} fill="none" stroke="#3b4660" strokeWidth={1.6} className="fairy-wire" />
      {Array.from({ length: hooks }, (_, i) => (
        <circle key={`h${i}`} cx={x0 + i * span} cy={y} r={2.5} fill="#3b4660" />
      ))}
      {Array.from({ length: bulbs }, (_, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / bulbs;
        const by = yAt(x) + 7;
        return (
          <g key={i} className="fairy-bulb" style={{ "--g": i % 3 } as React.CSSProperties}>
            <circle className="fairy-halo" cx={x} cy={by} r={22} fill={`url(#${halo})`} />
            <rect x={x - 2} y={by - 9} width={4} height={4} fill="#3b4660" />
            <circle className="fairy-glass" cx={x} cy={by} r={5.5} />
          </g>
        );
      })}
    </g>
  );
}

/** Kuala Lumpur wall clock (live KL time). */
export function WallClock({ layout }: { layout: WallLayout }) {
  const { cx, cy, r } = layout.clock;
  return (
    <g>
      <circle className="drop-shadow" cx={cx - 6} cy={cy + 8} r={r} fill="#000" />
      <Clock r={1} transform={`translate(${cx} ${cy}) scale(${r})`} />
    </g>
  );
}

/** Split aircon unit high on the wall (very KL). */
export function Aircon({ layout }: { layout: WallLayout }) {
  const { x, y, w, h } = layout.aircon;
  return (
    <g data-room="aircon" aria-hidden="true">
      <DropShadow x={x} y={y} w={w} h={h} rx={14} />
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#eceef2" />
      <rect x={x} y={y} width={w} height={10} rx={5} fill="#f7f8fa" />
      <rect x={x + 6} y={y + h - 22} width={w - 12} height={16} rx={7} fill="#cfd3db" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 14} y={y + h - 19 + i * 3.4} width={w - 28} height={1.2} fill="#9aa3b2" />
      ))}
      <rect x={x + w - 70} y={y + 22} width={44} height={8} rx={4} fill="#d9dde5" />
      <circle className="aircon-led" cx={x + w - 22} cy={y + 26} r={3.5} fill="#4ade80" />
    </g>
  );
}

/* ------------------------------------------------------------------------ */

// Painting art: a 100 × 70 night view of KL (Petronas-style towers + KL Tower).
function tower(cx: number) {
  const w = 9;
  const steps = [
    [w / 2, 70], [w / 2, 30], [w / 2 - 1, 30], [w / 2 - 1, 22], [w / 2 - 2, 22],
    [w / 2 - 2, 15], [w / 2 - 3, 15], [w / 2 - 3.6, 10], [0.5, 10], [0.2, 2],
  ];
  const right = steps.map(([dx, y]) => `${cx + dx},${y}`);
  const left = [...steps].reverse().map(([dx, y]) => `${cx - dx},${y}`);
  return [...right, ...left].join(" ");
}

/** Framed print of the KL skyline at night (decorative; tilts on hover). */
export function Painting({ layout }: { layout: WallLayout }) {
  const { x, y, w, h } = layout.painting;
  const F = 13; // frame
  const M = 14; // white mount
  const cw = w - (F + M) * 2;
  const ch = h - (F + M) * 2;
  const s = Math.max(cw / 100, ch / 70); // cover the canvas
  const ox = cw / 2 - 50 * s;
  const oy = ch - 70 * s;
  const sky = `${layout.id}-ptg-sky`;
  const clip = `${layout.id}-ptg-clip`;
  const far = Array.from({ length: 14 }, (_, i) => ({ x: i * 7.4 - 2, w: 5 + rand(i + 1) * 5, h: 18 + rand(i + 31) * 22 }));
  const near = Array.from({ length: 11 }, (_, i) => ({ x: i * 9.6 - 3, w: 7 + rand(i + 7) * 6, h: 10 + rand(i + 17) * 18 })).filter(
    (b) => (b.x + b.w < 36 || b.x > 64) && (b.x + b.w < 76 || b.x > 86),
  );
  const lit = [41, 43, 57, 59].flatMap((tx, i) => Array.from({ length: 9 }, (_, k) => ({ x: tx, y: 33 + k * 4, on: rand(i * 11 + k) > 0.3 })));
  return (
    <g data-room="painting">
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.skyTop} />
          <stop offset="1" stopColor={P.skyBottom} />
        </linearGradient>
        <clipPath id={clip}>
          <rect width={cw} height={ch} />
        </clipPath>
      </defs>
      <DropShadow x={x} y={y} w={w} h={h} />
      <rect x={x} y={y} width={w} height={h} fill={P.frame} />
      <rect x={x + F} y={y + F} width={w - F * 2} height={h - F * 2} fill="#f4f1ea" />
      <g transform={`translate(${x + F + M} ${y + F + M})`}>
        <g clipPath={`url(#${clip})`}>
          <g transform={`translate(${ox} ${oy}) scale(${s})`}>
            <rect x={-20} y={-60} width={140} height={130} fill={`url(#${sky})`} />
            <circle cx={31} cy={10} r={5} fill={P.moon} opacity={0.9} />
            {[[12, 8], [25, 18], [50, 6], [68, 22], [90, 30]].map(([sx, sy]) => (
              <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r={0.5} fill="#fff" opacity={0.7} />
            ))}
            <g fill={P.cityFar}>
              {far.map((b) => (
                <rect key={b.x} x={b.x} y={70 - b.h} width={b.w} height={b.h} />
              ))}
            </g>
            <g fill={P.city}>
              <polygon points={tower(42)} />
              <polygon points={tower(58)} />
              <rect x={44} y={40} width={12} height={1.6} />
              <rect x={79} y={24} width={2.4} height={46} />
              <path d="M75 26 Q80.2 19 85.4 26 L83.5 28.5 L77 28.5 Z" />
              <rect x={79.7} y={8} width={1} height={14} />
              {near.map((b) => (
                <rect key={b.x} x={b.x} y={70 - b.h} width={b.w} height={b.h} />
              ))}
            </g>
            <g fill={P.lampGlow}>
              {lit.filter((l) => l.on).map((l) => (
                <rect key={`${l.x}-${l.y}`} x={l.x} y={l.y} width={0.9} height={1.1} opacity={0.85} />
              ))}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------------ */

/** Pegboard contents are drawn in "board units": the board is 4 units tall. */
export function pegGeometry(layout: WallLayout) {
  const { x, y, w, h } = layout.pegboard;
  const s = h / 4;
  const bw = w / s; // board width in board units
  const resume = { bx: 0.35, by: 0.32 };
  const envelope = { bx: Math.max(bw * 0.55, 0.35 + RESUME_W + 0.35), by: 0.85 };
  const toPx = (bx: number, by: number, bwid: number, bh: number): Rect => ({ x: x + bx * s, y: y + by * s, w: bwid * s, h: bh * s });
  return {
    s,
    bw,
    resume,
    envelope,
    resumeRect: toPx(resume.bx, resume.by, RESUME_W, RESUME_H),
    envelopeRect: toPx(envelope.bx, envelope.by, ENVELOPE_W, ENVELOPE_H),
  };
}

/** Pegboard with the resume (opens the resume view), the contact envelope and tech stickers. */
export function Pegboard({ layout }: { layout: WallLayout }) {
  const { x, y, w, h } = layout.pegboard;
  const g = pegGeometry(layout);
  const holes: [number, number][] = [];
  for (let hx = 0.25; hx < g.bw - 0.1; hx += 0.32) for (let hy = 0.25; hy < 3.9; hy += 0.32) holes.push([hx, hy]);
  return (
    <g data-room="pegboard">
      <DropShadow x={x} y={y} w={w} h={h} rx={6} />
      <rect x={x} y={y} width={w} height={h} rx={6} fill={P.pegboard} />
      <rect x={x} y={y} width={w} height={5} rx={3} fill="#dcb88c" />
      <g transform={`translate(${x} ${y}) scale(${g.s})`}>
        <g fill={P.pegHole}>
          {holes.map(([hx, hy]) => (
            <circle key={`${hx}-${hy}`} cx={hx} cy={hy} r={0.045} />
          ))}
        </g>
        <Stickers w={g.bw} h={4} />
        <ResumePaper x={g.resume.bx} y={g.resume.by} />
        <Envelope x={g.envelope.bx} y={g.envelope.by} />
      </g>
    </g>
  );
}

/** Geometry of the LED strip mounted above the pegboard (shared with NightLights). */
export function stripGeometry(layout: WallLayout) {
  const { x, y, w } = layout.pegboard;
  return { x0: x + 8, x1: x + w - 8, y: y - 16, h: 9 };
}

/** A slim LED strip light on top of the pegboard. Its light only falls downward (NightLights). */
export function StripLight({ layout }: { layout: WallLayout }) {
  const s = stripGeometry(layout);
  return (
    <g data-room="strip-light" aria-hidden="true">
      <rect className="drop-shadow" x={s.x0 - 6} y={s.y + 8} width={s.x1 - s.x0} height={s.h} rx={3} fill="#000" />
      {/* Two small brackets into the wall */}
      <rect x={s.x0 + 14} y={s.y - 4} width={6} height={6} fill="#8a93a6" />
      <rect x={s.x1 - 20} y={s.y - 4} width={6} height={6} fill="#8a93a6" />
      <rect x={s.x0} y={s.y} width={s.x1 - s.x0} height={s.h} rx={3} fill="#d9dde5" />
      <rect x={s.x0} y={s.y} width={s.x1 - s.x0} height={2.5} rx={1.2} fill="#f4f6f9" />
      {/* Diffuser on the underside: lit at night, pale by day */}
      <rect className="strip-diffuser" x={s.x0 + 3} y={s.y + s.h - 3} width={s.x1 - s.x0 - 6} height={3} rx={1.5} />
    </g>
  );
}

/** Day/night light switch. Drawn in its own units (0.32 × 0.48), scaled to fit. */
export function LightSwitch({ layout }: { layout: WallLayout }) {
  const { x, y, w } = layout.lightSwitch;
  const s = w / 0.32;
  return (
    <g data-room="light-switch" transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-0.06} y={0.08} width={0.32} height={0.48} rx={0.04} fill="#000" opacity={0.15} />
      <rect width={0.32} height={0.48} rx={0.04} fill="#eef0f3" />
      <rect x={0.1} y={0.1} width={0.12} height={0.28} rx={0.03} fill="#c9ced8" />
      <rect data-part="switch-nub" x={0.11} y={0.24} width={0.1} height={0.12} rx={0.025} fill="#8a93a6" />
    </g>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * The window: a white frame and sill around the street view (CityView), with
 * both skies drawn; CSS shows the night or the day one by theme.
 */
export function Window({ layout }: { layout: WallLayout }) {
  const { x, y, w, h } = layout.window;
  const F = 14;
  const gx = x + F;
  const gy = y + F;
  const gw = w - F * 2;
  const gh = h - F * 2;
  const S = 100; // CityView and the skies are drawn in units of 100 px
  const vw = gw / S;
  const vh = gh / S;
  const night = `${layout.id}-win-night`;
  const day = `${layout.id}-win-day`;
  const clip = `${layout.id}-win-clip`;
  const barColor = "#e3e6ec";
  return (
    <g data-room="window">
      <defs>
        <linearGradient id={night} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081028" />
          <stop offset="1" stopColor="#24305f" />
        </linearGradient>
        <linearGradient id={day} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fb3ec" />
          <stop offset="1" stopColor="#cfe8fb" />
        </linearGradient>
        <clipPath id={clip}>
          <rect width={vw} height={vh} />
        </clipPath>
      </defs>
      <DropShadow x={x} y={y} w={w} h={h + 20} />
      <rect x={x} y={y} width={w} height={h} fill="#e9ecf1" />
      <g transform={`translate(${gx} ${gy}) scale(${S})`}>
        <g clipPath={`url(#${clip})`}>
          <g data-sky="night">
            <rect width={vw} height={vh} fill={`url(#${night})`} />
            <circle cx={vw * 0.3} cy={vh * 0.1} r={0.16} fill={P.moon} />
            <circle cx={vw * 0.3 + 0.06} cy={vh * 0.1 - 0.045} r={0.135} fill="#1a2550" />
            {[[0.15, 0.06], [0.55, 0.04], [0.8, 0.12], [0.65, 0.2], [0.1, 0.22]].map(([sx, sy]) => (
              <circle key={`${sx}-${sy}`} className="twinkle" cx={vw * sx} cy={vh * sy} r={0.022} fill="#fff" opacity={0.85} />
            ))}
          </g>
          <g data-sky="day">
            <rect width={vw} height={vh} fill={`url(#${day})`} />
            <circle cx={vw * 0.28} cy={vh * 0.1} r={0.16} fill="#ffd96b" />
            <circle cx={vw * 0.28} cy={vh * 0.1} r={0.26} fill="#ffd96b" opacity={0.25} />
            <g className="cloud-drift" fill="#fff" opacity={0.95}>
              <ellipse cx={vw * 0.62} cy={vh * 0.12} rx={0.3} ry={0.08} />
              <ellipse cx={vw * 0.7} cy={vh * 0.09} rx={0.16} ry={0.08} />
            </g>
          </g>
          <CityView w={vw} h={vh} />
        </g>
      </g>
      {/* Inner shadow along the top and left of the glass (the frame is deeper than the glass) */}
      <rect x={gx} y={gy} width={gw} height={5} fill="#000" opacity={0.18} />
      <rect x={gx + gw - 5} y={gy} width={5} height={gh} fill="#000" opacity={0.12} />
      <path d={`M${gx + gw * 0.12} ${gy + gh} L${gx + gw * 0.5} ${gy} L${gx + gw * 0.64} ${gy} L${gx + gw * 0.26} ${gy + gh} Z`} fill="#fff" opacity={0.06} />
      {/* Mullion and transom */}
      <rect x={x + w / 2 - 5} y={gy} width={10} height={gh} fill={barColor} />
      <rect x={gx} y={gy + gh * 0.42 - 5} width={gw} height={10} fill={barColor} />
      {/* Sill: a lit top face and a front edge */}
      <rect x={x - 14} y={y + h} width={w + 28} height={8} fill="#f4f6f9" />
      <rect x={x - 14} y={y + h + 8} width={w + 28} height={12} fill="#cfd4dd" />
    </g>
  );
}
