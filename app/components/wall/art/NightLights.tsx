import { P } from "../palette";
import { ST, type WallLayout } from "../layouts";
import { stripGeometry } from "./WallItems";

const BLEED = 3000;
const BLUE = "#9cc7ff";
const WARM = P.lampGlow;

/**
 * Night lighting, drawn over the room (and under the links). It does two jobs:
 *
 * 1. Darkness: a dark wash over everything, masked so the lit areas stay
 *    bright: the monitor, the lamp's pool, the phone, the string lights and
 *    the window.
 * 2. Light: glows on top: blue screen light on the wall and catching the
 *    edges of Akid's hair, shoulders and arms; the lamp's warm pool on the
 *    desk and a warm rim on the near arm; the phone's glow; a warm wash under
 *    the string lights.
 *
 * Both fade out by day (CSS: .night-dim, .night-glow).
 */
export default function NightLights({ layout }: { layout: WallLayout }) {
  const { id, width, height, fairy, window: win } = layout;
  const st = layout.station;
  const stationTransform = `translate(${st.dx} ${st.dy}) scale(${st.s})`;
  const mask = `${id}-night-mask`;
  const hole = `${id}-night-hole`;
  const blue = `${id}-night-blue`;
  const warm = `${id}-night-warm`;
  const scr = ST.screen;
  const mx = scr.x + scr.w / 2;
  const phoneX = (ST.phone.x0 + ST.phone.x1) / 2;
  const top = ST.desk.top;
  const strip = stripGeometry(layout);
  const peg = layout.pegboard;
  const down = `${id}-night-down`;
  const downHole = `${id}-night-down-hole`;
  // The strip's light: a fan that only spreads downward over the pegboard.
  const fan = `${strip.x0},${strip.y + strip.h} ${strip.x1},${strip.y + strip.h} ${peg.x + peg.w + 30},${peg.y + peg.h + 25} ${peg.x - 30},${peg.y + peg.h + 25}`;
  // Screen and phone light: cool white, 15% softer than before.
  const k = 0.85;

  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={hole}>
          <stop offset="0" stopColor="#000" />
          <stop offset="0.45" stopColor="#000" stopOpacity={0.85} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={blue}>
          <stop offset="0" stopColor={BLUE} stopOpacity={0.55} />
          <stop offset="1" stopColor={BLUE} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={warm}>
          <stop offset="0" stopColor={WARM} stopOpacity={0.7} />
          <stop offset="1" stopColor={WARM} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={down} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6dc" stopOpacity={0.5} />
          <stop offset="1" stopColor="#fff6dc" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={downHole} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.7" stopColor="#000" stopOpacity={0.6} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x={-BLEED} y={-BLEED} width={width + BLEED * 2} height={height + BLEED * 2}>
          <rect x={-BLEED} y={-BLEED} width={width + BLEED * 2} height={height + BLEED * 2} fill="#fff" />
          {/* Holes where light falls (black = no darkening) */}
          <ellipse cx={(fairy.x0 + fairy.x1) / 2} cy={fairy.y + 20} rx={(fairy.x1 - fairy.x0) / 2 + 60} ry={70} fill={`url(#${hole})`} />
          <ellipse cx={win.x + win.w / 2} cy={win.y + win.h / 2} rx={win.w * 0.62} ry={win.h * 0.6} fill={`url(#${hole})`} />
          <polygon points={fan} fill={`url(#${downHole})`} />
          <g transform={stationTransform}>
            {/* The screen itself, and its light on the desk in front (not the wall behind) */}
            <rect x={scr.x - 4} y={scr.y - 4} width={scr.w + 8} height={scr.h + 8} rx={6} fill="#000" />
            <ellipse cx={mx} cy={top + 4} rx={150} ry={34} fill={`url(#${hole})`} />
            <ellipse cx={phoneX} cy={top - 4} rx={45} ry={28} fill={`url(#${hole})`} />
          </g>
        </mask>
      </defs>

      {/* 1. The dark */}
      <rect
        className="night-dim"
        x={-BLEED}
        y={-BLEED}
        width={width + BLEED * 2}
        height={height + BLEED * 2}
        fill="#03060f"
        mask={`url(#${mask})`}
      />

      {/* 2. The light */}
      <g className="night-glow">
        {/* Warm wash under the string lights */}
        <ellipse cx={(fairy.x0 + fairy.x1) / 2} cy={fairy.y + 30} rx={(fairy.x1 - fairy.x0) / 2 + 30} ry={60} fill={`url(#${warm})`} opacity={0.22} />

        {/* Strip light: a soft fan of light down over the pegboard only */}
        <polygon points={fan} fill={`url(#${down})`} style={{ mixBlendMode: "screen" }} />

        <g transform={stationTransform}>
          {/* Screen light falls forward onto the desk (the wall behind the monitor stays dark) */}
          <ellipse cx={mx} cy={top + 2} rx={130} ry={16} fill={`url(#${blue})`} opacity={0.6 * k} style={{ mixBlendMode: "screen" }} />
          {/* Lamp: warm pool on the desk and a soft glow around the shade */}

          {/* Phone: a cool glow lifting off the screen */}
          <ellipse cx={phoneX} cy={top - 4} rx={32} ry={9} fill={`url(#${blue})`} opacity={0.9 * k} />
          <ellipse cx={phoneX} cy={top - 22} rx={22} ry={24} fill={`url(#${blue})`} opacity={0.3 * k} />
        </g>
      </g>
    </g>
  );
}

/**
 * The light on Akid at night (right side only): a soft cool wash from the
 * screen and rim highlights. Drawn right after the person, in workstation
 * coordinates. The hair and torso highlights sit in data-part groups so they
 * move with the head turn and breathing.
 */
export function PersonLights({ id }: { id: string }) {
  const blue = `${id}-person-blue`;
  const { cx, cy, r } = ST.head;
  const k = 0.85;
  return (
    <g className="night-glow" aria-hidden="true">
      <defs>
        <radialGradient id={blue}>
          <stop offset="0" stopColor={BLUE} stopOpacity={0.55} />
          <stop offset="1" stopColor={BLUE} stopOpacity={0} />
        </radialGradient>
      </defs>
          {/* ...and on Akid's right side (the lamp side): a soft cool light over the head and shoulder */}
          <ellipse cx={cx + 50} cy={cy + 35} rx={80} ry={85} fill={`url(#${blue})`} opacity={0.3 * k} style={{ mixBlendMode: "screen" }} />
          {/* Rim light on the right edges only. Hair highlights sit in a data-part="hair"
              group so they slide with the hair when the head turns on hover. */}
          <g fill="none" strokeLinecap="round" style={{ mixBlendMode: "screen" }}>
            <g data-part="hair">
              {[
                [0.38, -0.92],
                [0.72, -0.5],
              ].map(([dx, dy]) => (
                <path key={dx} d={`M${cx + r * dx - 6} ${cy + r * dy + 3} q6 -6 12 0`} stroke={BLUE} strokeWidth={2.2} opacity={0.45 * k} />
              ))}
              <path d={`M${cx + r * 0.55} ${cy - r * 0.95} Q${cx + r * 1.15} ${cy - r * 0.5} ${cx + r * 1.05} ${cy + r * 0.2}`} stroke={BLUE} strokeWidth={2.5} opacity={0.3} />
            </g>
            <g data-part="torso">
              <path d={`M${cx + 10} 468 L${cx + 36} 468 Q${cx + 62} 471 ${cx + 62} 475`} stroke={BLUE} strokeWidth={3} opacity={0.5 * k} />
              <path d={`M${cx + 74} 478 L${cx + 85} 512`} stroke={BLUE} strokeWidth={3} opacity={0.4} />
              <path d={`M${cx + 82} 526 L${cx + 89} 574`} stroke={BLUE} strokeWidth={2.5} opacity={0.35} />
            </g>
          </g>

    </g>
  );
}
