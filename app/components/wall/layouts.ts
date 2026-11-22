// The one-wall room: where everything sits, in viewBox units (x right, y down).
// Decisions: docs/room-wall-redesign.md. One config per layout; the art and the
// links share these numbers, so they always line up.

export type Rect = { x: number; y: number; w: number; h: number };

export type WallLayout = {
  id: "desktop" | "portrait";
  width: number;
  height: number;
  /** Top of the skirting board; the floor starts 20 below it. */
  skirtY: number;
  fairy: { x0: number; x1: number; y: number; sag: number; bulbs: number };
  clock: { cx: number; cy: number; r: number };
  aircon: Rect;
  painting: Rect;
  pegboard: Rect;
  shelf: Rect & { cols: number; rows: number; props: boolean };
  lightSwitch: Rect;
  window: Rect;
  /** The bush: centre of the pot's base, leaf scale, and an optional wall bracket under it. */
  bush: { cx: number; baseY: number; s: number; bracket: boolean };
  rug: Rect;
  /**
   * The workstation (desk, computer, person, chair, lamp, bin, speech bubble)
   * is drawn once in desktop coordinates and placed with this transform.
   */
  station: { dx: number; dy: number; s: number };
  /** Minimum size of a click area (viewBox units): 44 CSS px at the smallest supported size. */
  hitMin: number;
  labelSize: number;
};

export const FLOOR_GAP = 20; // skirting height

export const desktopLayout: WallLayout = {
  id: "desktop",
  width: 1600,
  height: 900,
  skirtY: 760,
  fairy: { x0: 40, x1: 1180, y: 45, sag: 18, bulbs: 22 },
  clock: { cx: 190, cy: 160, r: 55 },
  aircon: { x: 640, y: 80, w: 300, h: 75 },
  painting: { x: 90, y: 260, w: 210, h: 210 },
  pegboard: { x: 330, y: 240, w: 270, h: 240 },
  shelf: { x: 80, y: 545, w: 480, h: 235, cols: 4, rows: 2, props: true },
  lightSwitch: { x: 618, y: 430, w: 30, h: 50 },
  window: { x: 1280, y: 170, w: 260, h: 390 },
  bush: { cx: 1415, baseY: 790, s: 85, bracket: false },
  rug: { x: 560, y: 800, w: 620, h: 75 },
  station: { dx: 0, dy: 0, s: 1 },
  hitMin: 102,
  labelSize: 24,
};

export const portraitLayout: WallLayout = {
  id: "portrait",
  width: 900,
  height: 1700,
  skirtY: 1560,
  fairy: { x0: 40, x1: 860, y: 40, sag: 16, bulbs: 15 },
  // Short phones crop the top of the scene (it's pinned to the bottom), so the
  // top row sits low. The clock sits between the painting and the window, above
  // the light switch; the aircon is centred.
  clock: { cx: 418, cy: 330, r: 46 },
  aircon: { x: 270, y: 130, w: 360, h: 70 },
  painting: { x: 70, y: 250, w: 210, h: 240 },
  pegboard: { x: 70, y: 545, w: 470, h: 260 },
  // Taller shelf (200 → 285); its bottom stays clear of the monitor.
  shelf: { x: 60, y: 845, w: 780, h: 285, cols: 3, rows: 2, props: false },
  lightSwitch: { x: 400, y: 420, w: 35, h: 50 },
  // Window right above the plant: tall and narrow (bottom kept above the leaves).
  window: { x: 580, y: 215, w: 240, h: 385 },
  bush: { cx: 700, baseY: 800, s: 66, bracket: true },
  rug: { x: 150, y: 1600, w: 600, h: 80 },
  // Desktop desk spans x 680–1240 with its floor at 780: move it to x 170–730, floor 1580.
  station: { dx: -510, dy: 800, s: 1 },
  hitMin: 102,
  labelSize: 30,
};

/** Where the workstation's pieces are, in desktop coordinates (before `station`). */
export const ST = {
  floorY: 780,
  desk: { x0: 680, x1: 1240, top: 545 },
  screen: { x: 860, y: 360, w: 220, h: 140 },
  head: { cx: 900, cy: 416, r: 42 }, // Akid sits in front of the monitor, a little left of its centre
  laptop: { x0: 690, x1: 820 }, // the computer: wired to the monitor, opens Quick links
  keyboard: { x0: 835, x1: 975 },
  mouse: { x: 1004, w: 28 },
  duck: { cx: 1140 }, // the Claude mascot (kept as "duck" for the hover CSS)
  phone: { x0: 1172, x1: 1230 },
  lamp: { baseX: 1216, shadeX: 1140 },
  bin: { x: 1078, w: 60 },
  bubble: { x: 690, y: 250, w: 190, h: 120 },
} as const;

/** Map a desktop-station point into a layout's viewBox. */
export function stationPoint(layout: WallLayout, x: number, y: number): [number, number] {
  const { dx, dy, s } = layout.station;
  return [x * s + dx, y * s + dy];
}
