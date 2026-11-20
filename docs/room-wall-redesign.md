# One-wall room: design decisions

Decided by the designer session (2026-11-20) from Akid's reference photo: a straight-on view of one wall, behind the person at the desk. Everything in the isometric room survives, with the same items, interactions, link names and tab order.

Positions are viewBox units: x runs left to right, y runs top to bottom.

## 1. Camera and person

- **Flat front view, slightly from above.**
  - Wall items are drawn straight-on.
  - Furniture shows its front face plus a thin top band, as tall as the object's depth × 0.25.
  - Shading uses three tones: the top lightest, the front mid, the lower edge darkest.
- **The person sits at the desk with their back to us.**
  - They sit a little left of the monitor's centre, so the typing stays visible.
  - On hover or focus, the head turns three-quarters toward the viewer and the speech bubble opens.
- **Depth:**
  - Every object casts a contact shadow: an ellipse at 0.25 opacity at night, 0.12 by day.
  - Wall items get a drop shadow offset (−6, +8) at opacity 0.15. Light comes from the window and lamp on the right.

## 2. Desktop layout (viewBox 1600×900)

**Screen fit:**
- One SVG fills the screen, using `preserveAspectRatio="xMidYMax meet"`.
- The wall, skirting, floor and rug are drawn far past the viewBox, so any leftover space reads as more wall and floor.
- Interactive items stay inside the viewBox, so none is ever cropped.
- The nav corner (x > 1250, y < 140) stays clear.

**Wall and floor bands:** the skirting runs y 760–780 and the floor from y 780 down.

| Item | Position |
|---|---|
| Fairy lights | y ≈ 45, x 40–1180, sag 18 |
| Clock (KL time) | centre (190, 175), r 55 |
| Aircon | x 640–940, y 80–155 |
| Painting (KL skyline) | x 90–300, y 260–470 |
| Pegboard | x 330–600, y 240–480: resume on the left, envelope on the right, a sticker strip along the bottom |
| Cube shelf (4×2) | x 80–560, y 545–780. Top row: KABO, KIDPOS, Bartr, filler. Bottom row: an "ALL PROJECTS →" box, binders, filler |
| On top of the shelf | small props, at most 55 tall |
| Light switch | x 618–648, y 430–480 (hit area 102×102) |
| Speech bubble | x 610–800, y 245–370 |
| Desk | top y 545–560, front edge 560–585, legs to 780, x 680–1240 |
| Monitor | screen x 860–1080, y 360–500, with a stand down to 545 |
| Desk items | mug x 760–800; keyboard 880–1060; mouse 1080–1110; duck 1135–1170; phone 1180–1225; lamp base 1185–1235 with the shade over 1110–1170, top y 395 |
| Person + chair | head x 760–830, y 395–470; torso 720–880, y 465–620; chair back y 540–700; wheels to y 800 |
| Bin | x 1150–1210, y 700–780 |
| Window (city view) | x 1280–1540, y 170–560, with the sill at y 560–580 |
| Bush | x 1310–1520, y 600–790: a floor planter under the window |
| Rug | x 560–1180, y 800–875 |

**Hit areas and labels:**
- The minimum hit area is 102 units, which is 44 px at 844×390.
- Each project's hit area is its whole cube.
- Labels sit just above their objects.

**Dropped from the photo:** the radiator (the bush takes its place), the cardboard tubes and the foreground chair corner.

## 3. Colour

| | Night (default) | Day |
|---|---|---|
| Wall | navy `#1b2c4b` → `#15233d` at the top | sage `#aebda3` → `#a3b398` at the top |
| Skirting | `#24365a` | `#f3f1ea` |
| Floor | `#3b2a20`, planks `#33241b` | `#c9a57a`, planks `#b8936a` |
| Rug | `#253a60`, border `#3a5585` | `#5b7bb0`, border `#3f5f95` |
| Lights | lamp, monitor glow and fairy lights on | lamp and fairy lights off |

The nav pill stays navy in both themes. On sage, the focus ring uses `#1d4ed8`.

## 4. Mobile: a separate portrait arrangement

- Portrait is used when the screen is at most as wide as it is tall: `(max-aspect-ratio: 1/1)`. Its viewBox is 900×1700, with the same bleed and the same 102-unit minimum hit area.
- Swiping or panning a wide wall would hide items and fight with page scroll; cropping it would lose items outright. A flat wall stacks well into a tall layout instead.
- The skirting runs y 1560–1580 and the floor y 1580–1700.

| Item | Position |
|---|---|
| Fairy lights | y ≈ 40, x 40–860 |
| Clock | centre (150, 160), r 60 |
| Aircon | x 360–740, y 95–170 |
| Painting | x 70–300, y 240–520 |
| Light switch | x 455–490, y 470–520 |
| Window | x 560–840, y 230–560 |
| Pegboard | x 70–540, y 600–900 |
| Bush | x 600–840, y 640–900, on a short stand |
| Cube shelf (3×2) | x 60–840, y 920–1160. Top row: KABO, KIDPOS, Bartr. Bottom row: "ALL PROJECTS →", binders, filler |
| Desk | top y 1290–1305, legs to 1560, x 200–860 |
| Monitor | screen x 450–720, y 1170–1280 |
| Person + chair | head x 330–410, y 1215–1295; chair to 1590 |
| Speech bubble | x 60–330, y 1060–1190 |
| Rug | x 150–750, y 1600–1680 |

## 5. Interactions

- **Layered 2D parallax**, for a fine pointer only and off under reduced motion. Layers:
  - wall: 0
  - wall items: ±4 px
  - furniture: ±9 px
  - floor and rug: ±13 px

  Each object's link and hit area moves with its own layer.
- **Added:**
  - window light spills onto the wall and floor: warm by day, pale blue at night;
  - the lamp throws a warm glow on the wall at night.
- **Kept, unchanged:**
  - every link, dialog, accessible name and the tab order (nav, resume, envelope, person, computer, KABO, KIDPOS, Bartr, All projects);
  - the light switch and the shelf body stay mouse-only;
  - the bush stays pointer-only.
- **Dropped:**
  - the "All projects" wall sign, now the labelled box in the shelf;
  - the side walls and the room corner.
- **Kept for the tests:**
  - the classes `.room-desktop`, `.room-portrait`, `.book-art`, `.room-shelf-hit`, `.room-tilt`;
  - the attributes `data-room`, `data-part`, `data-slug`.
