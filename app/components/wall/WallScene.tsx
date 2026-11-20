import { Fragment } from "react";
import Link from "next/link";
import type { ShelfProject } from "./art/Shelf";
import type { Rect, WallLayout } from "./layouts";
import { ContactShadow, Rug, WallAndFloor, WindowLight } from "./art/Backdrop";
import { Aircon, FairyLights, LightSwitch, Painting, Pegboard, StripLight, WallClock, Window, pegGeometry } from "./art/WallItems";
import { Shelf, shelfGeometry } from "./art/Shelf";
import Station, { Person, SpeechBubble, stationHits } from "./art/Station";
import { Bush, bushGeometry } from "./art/Bush";
import NightLights, { PersonLights } from "./art/NightLights";

type Props = { layout: WallLayout; projects: ShelfProject[]; className?: string };

/** A rectangle grown around its centre to at least `min` × `min`. */
function atLeast({ x, y, w, h }: Rect, min: number): Rect {
  const W = Math.max(w, min);
  const H = Math.max(h, min);
  return { x: x + w / 2 - W / 2, y: y + h / 2 - H / 2, w: W, h: H };
}
const box = (r: Rect) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

type LabelProps = { x: number; y: number; text: string; size: number; intro: boolean; anchor?: "above" | "below" | "center" | "left" };

function Label({ x, y, text, size, intro, anchor = "above" }: LabelProps) {
  const h = size * 1.75;
  const w = text.length * size * 0.6 + size * 1.3;
  const top = anchor === "above" ? y - h : anchor === "below" ? y : y - h / 2;
  const cx = anchor === "left" ? x - w / 2 : x;
  return (
    <g className="room-label" data-intro={intro} aria-hidden="true">
      <rect x={cx - w / 2} y={top} width={w} height={h} rx={h / 2} className="room-label-pill" />
      <text x={cx} y={top + h / 2} fontSize={size} textAnchor="middle" dominantBaseline="central" className="room-label-text">
        {text}
      </text>
    </g>
  );
}

/**
 * One full drawing of the wall for a layout. The art (hidden from screen
 * readers) is in parallax layers: 0 wall, 1 wall items, 3 floor/rug, 2
 * furniture. The links sit on top, in the same layers as their art so they
 * move together, in the tab order: resume, envelope, person, computer,
 * project books, All projects.
 */
export default function WallScene({ layout, projects, className }: Props) {
  const { width, height, id, hitMin, labelSize: size } = layout;
  const gap = size * 0.5;
  const st = layout.station;
  const stationTransform = `translate(${st.dx} ${st.dy}) scale(${st.s})`;
  const peg = pegGeometry(layout);
  const { cubes } = shelfGeometry(layout, projects);
  const bush = bushGeometry(layout);
  const sw = atLeast(layout.lightSwitch, hitMin);
  const resume = atLeast(peg.resumeRect, hitMin);
  const envelope = atLeast(peg.envelopeRect, hitMin);
  const { shelf } = layout;
  const computer = atLeast(stationHits.computer, hitMin / st.s);

  return (
    <svg
      className={`room-svg wall-svg ${className ?? ""}`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      role="group"
      aria-label="Akid's room"
    >
      {/* Each project book lifts when its link is hovered or focused
          (generated per slug: CSS can't match one attribute to another). */}
      <style>
        {projects
          .map(
            (p) =>
              `.room-svg:has(.room-link[data-slug="${p.slug}"]:is(:hover,:focus-visible)) .book-art[data-slug="${p.slug}"]{transform:translateY(-12px)}`,
          )
          .join("\n")}
      </style>

      <g aria-hidden="true">
        <g className="wl-l0">
          <WallAndFloor layout={layout} />
        </g>
        <g className="wl-l1">
          <FairyLights layout={layout} />
          <WallClock layout={layout} />
          <Aircon layout={layout} />
          <Painting layout={layout} />
          <Pegboard layout={layout} />
          <StripLight layout={layout} />
          <LightSwitch layout={layout} />
          <Window layout={layout} />
        </g>
        <g className="wl-l3">
          <WindowLight layout={layout} />
          <Rug layout={layout} />
          <ContactShadow cx={shelf.x + shelf.w / 2} cy={layout.skirtY + 22} rx={shelf.w / 2 + 12} ry={8} />
        </g>
        <g className="wl-l2">
          <Shelf layout={layout} projects={projects} />
          <Bush layout={layout} />
          <g transform={stationTransform}>
            <Station id={id} />
          </g>
        </g>
        {/* Night: darkness with lit areas, then glows (fades out by day) */}
        <g className="wl-l2">
          <NightLights layout={layout} />
        </g>
        {/* Akid and the chair in front of everything, so no light shows through them.
            At night they're dimmed with a filter (CSS .person-layer), then lit from the right. */}
        <g className="wl-l2">
          <g transform={stationTransform}>
            <g className="person-layer">
              <Person />
            </g>
            <PersonLights id={id} />
            <SpeechBubble />
          </g>
        </g>
      </g>

      <g className="room-links">
        <g className="wl-l1">
          <Link href="/resume" role="button" data-opens="resume" aria-label="Resume: view and download" className="room-link" data-target="resume">
            <rect {...box(resume)} className="room-hit" />
          </Link>
          <Label x={resume.x + resume.w / 2} y={resume.y - gap * 0.3} text="Resume" size={size} intro />
          <Link href="/contact" role="button" data-opens="contact" aria-label="Contact details" className="room-link" data-target="envelope">
            <rect {...box(envelope)} className="room-hit" />
          </Link>
          <Label x={envelope.x + envelope.w / 2} y={envelope.y + envelope.h + gap * 0.3} text="Contact" size={size} intro anchor="below" />
        </g>

        <g className="wl-l2">
          <g transform={stationTransform}>
            <Link href="/about" role="button" data-opens="about" aria-label="About Akid" className="room-link" data-target="person">
              <polygon points={stationHits.person.map((p) => p.join(",")).join(" ")} className="room-hit" />
            </Link>
            <Label x={stationHits.personLabel[0]} y={stationHits.personLabel[1]} text="About me" size={size / st.s} intro anchor="left" />
            {/* Opens the quick-links view. Without JavaScript it jumps to the corner nav instead. */}
            <a href="#main-nav" role="button" data-opens="quick" aria-label="Quick links" className="room-link" data-target="computer">
              <rect {...box(computer)} className="room-hit" />
            </a>
            <Label x={stationHits.computerLabel[0]} y={stationHits.computerLabel[1]} text="Quick links" size={size / st.s} intro anchor="center" />
          </g>

          {/* The shelf body: a mouse-only link to /projects (the box in the shelf is the accessible one). */}
          <Link href="/portfolio#projects" tabIndex={-1} aria-hidden="true" className="room-link room-shelf-hit" data-target="bookshelf">
            <rect x={shelf.x} y={shelf.y - 10} width={shelf.w} height={shelf.h + 10} className="room-hit" />
          </Link>
          {cubes
            .filter((c) => c.kind === "project" && c.project)
            .map((c) => {
              const r = atLeast(c, hitMin);
              return (
                <Fragment key={c.project!.slug}>
                  <Link href={`/projects/${c.project!.slug}`} aria-label={`Project: ${c.project!.name}`} className="room-link" data-target="book" data-slug={c.project!.slug}>
                    <rect {...box(r)} className="room-hit" />
                  </Link>
                  <Label x={c.x + c.w / 2} y={c.y - gap * 0.3} text={c.project!.name} size={size * 0.85} intro={false} />
                </Fragment>
              );
            })}
          {cubes
            .filter((c) => c.kind === "all")
            .map((c) => {
              const r = atLeast(c, hitMin);
              return (
                <Fragment key="all">
                  <Link href="/portfolio#projects" aria-label="All projects" className="room-link" data-target="all-projects">
                    <rect {...box(r)} className="room-hit" />
                  </Link>
                  <Label x={c.x + c.w / 2} y={c.y - gap * 0.3} text="All projects" size={size * 0.85} intro={false} />
                </Fragment>
              );
            })}

          {/* The bush: pointer only, just for fun (hover rustles, click waters). */}
          <g aria-hidden="true" data-action="water-plant" className="room-link" data-target="plant">
            <rect {...box(bush)} className="room-hit" />
          </g>
        </g>

        {/* Day/night light switch: pointer only. The nav's sun/moon button is the accessible control. */}
        <g className="wl-l1">
          <g aria-hidden="true" data-action="toggle-theme" className="room-link" data-target="light-switch">
            <rect {...box(sw)} className="room-hit" />
          </g>
          <Label x={sw.x + sw.w / 2} y={sw.y - gap * 0.3} text="Lights" size={size * 0.85} intro={false} />
        </g>
      </g>
    </svg>
  );
}

