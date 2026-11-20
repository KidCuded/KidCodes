import type React from "react";
import { rand, shade } from "../util";
import { P } from "../palette";
import type { WallLayout } from "../layouts";
import { ContactShadow } from "./Backdrop";

/** The bush's bounding box (for its click area and label). */
export function bushGeometry(layout: WallLayout) {
  const { cx, baseY, s } = layout.bush;
  return { x: cx - s * 1.35, y: baseY - s * 2.35, w: s * 2.7, h: s * 2.35, top: [cx, baseY - s * 2.3] as [number, number] };
}

/**
 * A leafy bush in a terracotta pot. Hover rustles the leaves; a click waters
 * it (drops fall, it flowers; click again and it closes up). RoomProvider
 * handles the click (`data-action="water-plant"`).
 */
export function Bush({ layout }: { layout: WallLayout }) {
  const { cx, baseY, s, bracket } = layout.bush;
  const potH = s * 0.78;
  const potTopW = s * 0.95;
  const potBotW = s * 0.7;
  const top = baseY - potH;
  const N = 17;
  const leaves = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const angle = -78 + 156 * t + (rand(i + 7) - 0.5) * 14;
    const len = (1.05 + rand(i + 40) * 0.55 - Math.abs(angle) / 260) * s;
    const lift = rand(i + 90) * 0.3 * s;
    const dx = (rand(i + 120) - 0.5) * 0.35 * s;
    return { i, angle, len, lift, dx, back: i % 2 === 0 };
  }).sort((a, b) => Number(b.back) - Number(a.back));
  const flowers: [number, number][] = [
    [-0.4, -1.25], [0.32, -1.4], [0.0, -1.6], [-0.78, -0.8], [0.72, -0.9],
  ];
  return (
    <g data-room="plant" aria-hidden="true">
      {bracket ? (
        <g>
          {/* A wall shelf on two brackets */}
          <rect className="drop-shadow" x={cx - s * 1.4 - 6} y={baseY + 8} width={s * 2.8} height={12} fill="#000" />
          <rect x={cx - s * 1.4} y={baseY} width={s * 2.8} height={12} fill={P.wood} />
          <rect x={cx - s * 1.4} y={baseY} width={s * 2.8} height={4} fill={shade(P.wood, 0.18)} />
          {[-0.9, 0.9].map((k) => (
            <path key={k} d={`M${cx + k * s} ${baseY + 12} l0 ${s * 0.45} l${-k * 10} -8 l0 ${-s * 0.45 + 8} Z`} fill={shade(P.wood, -0.3)} />
          ))}
        </g>
      ) : (
        <ContactShadow cx={cx} cy={baseY + 2} rx={potTopW * 0.75} ry={7} />
      )}
      {/* Pot: tapered front, a rim band and soil */}
      <polygon points={`${cx - potTopW / 2},${top} ${cx + potTopW / 2},${top} ${cx + potBotW / 2},${baseY} ${cx - potBotW / 2},${baseY}`} fill={P.pot} />
      <polygon points={`${cx + potTopW * 0.15},${top} ${cx + potTopW / 2},${top} ${cx + potBotW / 2},${baseY} ${cx + potBotW * 0.15},${baseY}`} fill={shade(P.pot, 0.08)} />
      <rect x={cx - potTopW / 2 - 4} y={top - 4} width={potTopW + 8} height={s * 0.16} rx={3} fill={shade(P.pot, 0.1)} />
      <ellipse cx={cx} cy={top - 4} rx={potTopW / 2} ry={s * 0.06} fill="#3b2a1e" />

      <g className="plant-drops">
        {[-0.3, 0, 0.28, -0.12, 0.15].map((ox, i) => (
          <path
            key={ox}
            style={{ "--i": i } as React.CSSProperties}
            d={`M${cx + ox * s} ${top - s * (2.0 + (i % 2) * 0.2)} q4 7 0 10 q-4 -2 0 -10 Z`}
            fill="#7cc4ff"
          />
        ))}
      </g>

      {leaves.map(({ i, angle, len, lift, dx, back }) => {
        const wd = len * 0.3;
        const color = back ? P.leafDark : i % 3 === 0 ? "#4fa36f" : P.leaf;
        return (
          <g key={i} transform={`translate(${cx + dx} ${top - 4 - lift}) rotate(${angle})`}>
            <g className="leaf" style={{ "--i": i } as React.CSSProperties}>
              <path d={`M0 0 C${wd} ${-len * 0.3} ${wd * 0.8} ${-len * 0.78} 0 ${-len} C${-wd * 0.8} ${-len * 0.78} ${-wd} ${-len * 0.3} 0 0 Z`} fill={color} />
              <path d={`M0 ${-len * 0.05} Q${wd * 0.15} ${-len * 0.5} 0 ${-len * 0.88}`} fill="none" stroke={shade(color, -0.22)} strokeWidth={1.2} />
            </g>
          </g>
        );
      })}

      <g data-part="flowers">
        {flowers.map(([fx, fy]) => {
          const x = cx + fx * s;
          const y = top + fy * s;
          const pr = s * 0.07;
          return (
            <g key={`${fx}${fy}`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * pr * 1.1} cy={y + Math.sin((a * Math.PI) / 180) * pr * 1.1} r={pr} fill="#f9a8d4" />
              ))}
              <circle cx={x} cy={y} r={pr * 0.8} fill="#fde047" />
            </g>
          );
        })}
      </g>
    </g>
  );
}
