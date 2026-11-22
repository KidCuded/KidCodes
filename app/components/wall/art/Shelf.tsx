import type React from "react";
import { rand, shade } from "../util";
import { P } from "../palette";
import type { Rect, WallLayout } from "../layouts";

export type ShelfProject = {
  slug: string;
  /** Short name, e.g. "Bartr" (the accessible name and hover label). */
  name: string;
  /** Spine text, e.g. "BARTR". */
  label: string;
};

const T = 12; // frame thickness
const TOP = 10; // visible top face of the shelf (seen slightly from above)

export type Cube = Rect & { kind: "project" | "all" | "books" | "binders" | "door"; project?: ShelfProject; index: number };

/** Every cube of the shelf and what it holds (shared by the art and the links). */
export function shelfGeometry(layout: WallLayout, projects: ShelfProject[]) {
  const { x, y, w, h, cols, rows } = layout.shelf;
  const cw = (w - T * (cols + 1)) / cols;
  const ch = (h - T * (rows + 1)) / rows;
  const allIndex = (rows - 1) * cols; // first cube of the bottom row
  const fillers: Cube["kind"][] = ["binders", "books", "door"];
  let f = 0;
  const cubes: Cube[] = Array.from({ length: cols * rows }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const rect = { x: x + T + c * (cw + T), y: y + T + r * (ch + T), w: cw, h: ch };
    if (i === allIndex) return { ...rect, kind: "all" as const, index: i };
    // Projects fill every cube in order, skipping the "All projects" box, so
    // a layout with fewer top-row cubes still shows them all.
    const p = projects[i < allIndex ? i : i - 1];
    if (p) return { ...rect, kind: "project" as const, project: p, index: i };
    return { ...rect, kind: i < allIndex ? ("books" as const) : fillers[f++ % fillers.length], index: i };
  });
  return { cubes };
}

/** A row of filler books standing in a cube from x0, up to width `room`. */
function FillerBooks({ x0, room, bottom, maxH, seed }: { x0: number; room: number; bottom: number; maxH: number; seed: number }) {
  const out: React.ReactNode[] = [];
  let bx = x0;
  let i = 0;
  while (bx < x0 + room - 14) {
    const bw = 12 + rand(seed + i * 3) * 10;
    const bh = maxH * (0.62 + rand(seed + i * 5 + 1) * 0.36);
    if (bx + bw > x0 + room) break;
    const color = P.fillerBooks[(seed + i) % P.fillerBooks.length];
    out.push(
      <g key={i} className="book-art" style={{ "--i": seed + i } as React.CSSProperties}>
        <rect x={bx} y={bottom - bh} width={bw} height={bh} fill={color} />
        <rect x={bx} y={bottom - bh + 6} width={bw} height={3} fill={shade(color, 0.25)} />
        <rect x={bx + bw - 2} y={bottom - bh} width={2} height={bh} fill={shade(color, -0.25)} />
      </g>,
    );
    bx += bw + 1.5;
    i++;
  }
  return <>{out}</>;
}

function ProjectBook({ c }: { c: Cube }) {
  const color = P.projectBooks[c.index % P.projectBooks.length];
  const bottom = c.y + c.h;
  const bw = Math.min(40, c.w * 0.3);
  const bh = c.h * 0.86;
  const bx = c.x + 12;
  const label = c.project?.label ?? "";
  const fs = Math.min(bw * 0.62, (bh - 16) / (Math.max(label.length, 1) * 0.68));
  return (
    <>
      <g className="book-art" data-slug={c.project?.slug} style={{ "--i": c.index } as React.CSSProperties}>
        <rect x={bx} y={bottom - bh} width={bw} height={bh} rx={2} fill={color} />
        <rect x={bx} y={bottom - bh + 8} width={bw} height={4} fill={shade(color, 0.3)} />
        <rect x={bx} y={bottom - 14} width={bw} height={4} fill={shade(color, 0.3)} />
        <text
          transform={`translate(${bx + bw / 2} ${bottom - bh / 2}) rotate(-90)`}
          fontSize={fs}
          fontWeight={800}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#0f1a2e"
          letterSpacing={1}
        >
          {label}
        </text>
      </g>
      <FillerBooks x0={bx + bw + 4} room={Math.min(c.w - bw - 30, 80)} bottom={bottom} maxH={c.h * 0.78} seed={c.index * 7} />
    </>
  );
}

/**
 * A low cube shelf: one project book in each of the first cubes, an
 * "ALL PROJECTS →" box, then binders, books and doors.
 */
export function Shelf({ layout, projects }: { layout: WallLayout; projects: ShelfProject[] }) {
  const { x, y, w, h, props } = layout.shelf;
  const wood = P.wood;
  const { cubes } = shelfGeometry(layout, projects);
  return (
    <g data-room="bookshelf">
      <rect x={x + 4} y={y - TOP} width={w - 8} height={TOP} fill={shade(wood, 0.18)} />
      <rect x={x} y={y} width={w} height={h} fill={wood} />
      <rect x={x} y={y + h - 6} width={w} height={6} fill={shade(wood, -0.3)} />
      {cubes.map((c) => {
        const bottom = c.y + c.h;
        return (
          <g key={c.index}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={shade(wood, -0.55)} />
            <rect x={c.x} y={c.y} width={c.w} height={6} fill="#000" opacity={0.25} />
            {c.kind === "project" && <ProjectBook c={c} />}
            {c.kind === "books" && <FillerBooks x0={c.x + 8} room={c.w - 16} bottom={bottom} maxH={c.h * 0.85} seed={c.index * 11} />}
            {c.kind === "binders" &&
              Array.from({ length: Math.min(6, Math.max(2, Math.floor((c.w - 16) / 30))) }, (_, k) => {
                const bw = 26;
                const bx = c.x + 8 + k * (bw + 3);
                const bh = c.h * 0.82;
                return (
                  <g key={k} className="book-art" style={{ "--i": c.index + k } as React.CSSProperties}>
                    <rect x={bx} y={bottom - bh} width={bw} height={bh} rx={2} fill="#eef0f3" />
                    <rect x={bx + 5} y={bottom - bh + 10} width={bw - 10} height={14} rx={2} fill="#fff" stroke="#c9ced8" strokeWidth={1} />
                    <circle cx={bx + bw / 2} cy={bottom - bh * 0.35} r={4} fill="#c9ced8" />
                  </g>
                );
              })}
            {c.kind === "door" && (
              <g>
                <rect x={c.x + 1} y={c.y + 1} width={c.w - 2} height={c.h - 2} fill={shade(wood, 0.06)} />
                <rect x={c.x + 1} y={c.y + 1} width={c.w - 2} height={3} fill={shade(wood, 0.2)} />
                <rect x={c.x + c.w / 2 - 14} y={c.y + 12} width={28} height={6} rx={3} fill={shade(wood, -0.35)} />
              </g>
            )}
            {c.kind === "all" && (
              <g data-part="all-projects-box">
                {/* Inside the drawer, seen when the front slides out (shelf hover) */}
                <rect x={c.x + 7} y={c.y + 8} width={c.w - 14} height={24} fill="#2a1d14" />
                {[0.14, 0.3, 0.5, 0.68].map((u, k) => (
                  <rect
                    key={u}
                    x={c.x + 7 + (c.w - 14) * u}
                    y={c.y + 12 + (k % 2) * 3}
                    width={(c.w - 14) * 0.16}
                    height={14}
                    rx={2}
                    fill={["#7dd3fc", "#fbcfe8", "#fde68a", "#c4b5fd"][k]}
                  />
                ))}
                <g data-part="drawer-front">
                <rect x={c.x + 5} y={c.y + 8} width={c.w - 10} height={c.h - 8} rx={4} fill="#e9e4d8" />
                <rect x={c.x + 5} y={c.y + 8} width={c.w - 10} height={6} rx={3} fill="#f4f1ea" />
                <rect x={c.x + c.w / 2 - 16} y={c.y + 18} width={32} height={8} rx={4} fill="#bdb5a3" />
                <rect x={c.x + 12} y={c.y + c.h * 0.42} width={c.w - 24} height={Math.min(30, c.h * 0.36)} rx={3} fill={P.signFace} stroke="#0f1a2e" strokeWidth={1.5} />
                <text
                  x={c.x + c.w / 2}
                  y={c.y + c.h * 0.42 + Math.min(30, c.h * 0.36) / 2}
                  fontSize={Math.min(14, (c.w - 34) / 9)}
                  fontWeight={800}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={P.signText}
                  letterSpacing={1.2}
                >
                  ALL PROJECTS
                </text>
                </g>
              </g>
            )}
          </g>
        );
      })}
      {props && (
        <g aria-hidden="true">
          {/* Cactus in a white pot */}
          <rect x={x + 54} y={y - TOP - 62} width={14} height={38} rx={7} fill={P.leaf} />
          <rect x={x + 44} y={y - TOP - 54} width={7} height={16} rx={3.5} fill={P.leaf} />
          <rect x={x + 46} y={y - TOP - 42} width={10} height={6} rx={3} fill={P.leaf} />
          <rect x={x + 71} y={y - TOP - 48} width={7} height={13} rx={3.5} fill={P.leafDark} />
          <rect x={x + 66} y={y - TOP - 38} width={10} height={6} rx={3} fill={P.leafDark} />
          <rect x={x + 46} y={y - TOP - 28} width={30} height={28} rx={3} fill="#eef0f3" />
          <rect x={x + 46} y={y - TOP - 28} width={30} height={5} rx={2} fill="#ffffff" />
          {/* A stack of two books */}
          <rect x={x + w - 150} y={y - TOP - 14} width={90} height={14} rx={2} fill="#4e6a7a" />
          <rect x={x + w - 144} y={y - TOP - 26} width={78} height={12} rx={2} fill="#9a6b4f" />
          {/* Small framed photo */}
          <rect x={x + w - 215} y={y - TOP - 46} width={38} height={46} rx={2} fill="#2a1f17" />
          <rect x={x + w - 210} y={y - TOP - 41} width={28} height={36} fill="#93c5fd" opacity={0.7} />
        </g>
      )}
    </g>
  );
}
