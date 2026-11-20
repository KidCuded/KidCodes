# Room design ideas

Written by the designer session for the builder to choose from. Nothing here is built.

## How to read this

- **Coordinates** are in room units (see `iso.ts`):
  - `x` runs along the **right wall** (the plane y = 0);
  - `y` runs along the **left wall** (the plane x = 0);
  - `z` is height.
- **Room sizes:** desktop is L=12 × D=10 × H=6.6; portrait is L=7.4 × D=6 × H=10.6.
- **What's already placed** (from `layouts.ts`):
  - Desktop: pegboard on the left wall at y 2.4–6.6; painting on the right wall at x 0.7–3.0; desk at x 3.5–8.1; shelf at x 8.8–11.6; sign above the shelf; lamp at x ≈ 7.35, y 0.55; mug at x 4.0, y 0.9. The new window is on the left wall, near the back corner (about y 0.4–2.2).
  - Portrait: pegboard on the left wall at y 1.0–4.8, z 5.6–8.6; painting on the right wall at x 0.4–2.2, z 6.9–8.4; shelf at x 2.4–7.25, z 5.3–8.3; desk at x 1.6–6.0.
  - Coordinates are suggestions; adjust them to the cropped room.
- **Effort:** S = under an hour, M = a few hours, L = a day or more.
- **Ground rules for every idea:**
  1. **Decorative by default.** The new art goes inside the `aria-hidden` art group, with no new tab stops. Anything clickable is either a duplicate of a link that already exists (a mouse-only `aria-hidden` `tabindex=-1` hit area, like the shelf), or a real `<button>` placed **after** "All projects" in the tab order, so recruiters' Tab paths don't change.
  2. **All ambient motion goes inside `@media (prefers-reduced-motion: no-preference)`.** Use CSS only: `transform`/`opacity` keyframes, no JavaScript loops, no SVG blur filters (use radial gradients for glows, as the lamp does).
  3. **Day and night through CSS variables.** Colours become `fill="var(--room-x)"`, switched by `[data-room-theme]`, so the SVG isn't duplicated per theme. Remember both layouts are in the HTML, so every new object costs twice. Keep `/` under about 70 KB gzipped; it's 50.7 KB now.
  4. **Nothing sits over the resume, envelope, person, computer, books or sign,** or near the corner nav.

## Ranked ideas

### 1. Monitor: live typing and a blinking cursor (must, S)

- **What and where:**
  - The code lines on the existing screen "type out" one line at a time, then hold, on a loop of about 8 s.
  - A cursor block blinks at the end of the last line.
  - It needs no new position: the lines become `<rect>`s with a `scaleX` keyframe from the left edge.
- **Behaviour:** decorative. Under reduced motion, show the lines fully written and hide the cursor.
- **Night and day:** at night the screen is the brightest thing in the room and its glow spills onto the desk. By day the screen is lighter and the glow drops to about 0.3.
- **Why:** it says "software engineer" instantly and makes the room feel alive at a glance.
- **Risk:** none. Keep it to 6 or fewer animated elements per layout.

### 2. Kopi mug with steam (must, S)

- **What and where:**
  - Replace the white cube mug (Computer.tsx, at x0+0.5, y 0.9) with a short cylinder with a handle.
  - Two steam wisps (curved paths) rise and fade, on a loop of about 3 s.
  - Desktop position: x ≈ 4.0, y 0.9, z 2.5. Portrait: x ≈ 2.0, y 0.9, z 2.5.
  - Optional: a tiny "kopi" label or a batik-pattern band on the mug.
- **Behaviour:** decorative. Under reduced motion, show the steam as static at 0.5 opacity.
- **Night and day:** the steam is more visible at night against the dark wall. By day it's subtler (lower opacity on cream walls).
- **Why:** it's a KL touch and fixes the current cube, which reads as a box, not a mug.
- **Risk:** none.

### 3. Day/night contrast and theme-switch polish (must, S–M)

This isn't a prop, but it's the most important item on this list. See the "things to fix" section, issues A–C, for the risks.

- Cross-fade the sky, walls and lamp glow over 0.6 s when the theme changes (instant under reduced motion).
- The light switch on the wall flips its rocker; the nav button swaps its sun and moon icons.
- **Night:** the lamp is on, the monitor glows, moonlight comes through the window.
- **Day:** the lamp is off (no glow cone, shade unlit), there's a sunbeam, and the monitor is dimmer.

### 4. Wall-mounted air-conditioner unit (nice, S)

- **What and where:** a white split-unit aircon, high on the wall, with a small status LED and a remote resting on the desk.
  - Desktop: right wall, x 4.0–6.4, z 5.5–6.2, sticking out about 0.5 from the wall (above the desk, between the painting and the shelf sign).
  - Portrait: right wall, x 3.8–6.2, z 9.6–10.3 (above the "All projects" sign).
- **Behaviour:** decorative. Optional ambient effect: a faint airflow line drifting down once every 6 s (reduced motion: none).
- **Night and day:** the LED glows green at night (a tiny radial gradient); by day it's just white plastic.
- **Why:** very Malaysian, and it reads instantly to anyone who has been to KL. It also fills the empty wall above the desk.
- **Risk:** none. Keep it clear of the sign and the corner nav in portrait.

### 5. Recognisable KL skyline in the painting (must, S)

- **What and where:** redraw the existing painting so the **Petronas Twin Towers** read clearly: two identical stepped towers, a skybridge at about 40% of their height, and tall pinnacles. Add **KL Tower** (a slim mast with a pod) to one side. No new position needed.
- **Behaviour:** decorative; it keeps its hover tilt.
- **Night and day:** in night mode the painting shows night (warm windows, moon). It should stay a night scene in day mode too: it's a painting, not a window, and keeping it as night tells it apart from the real window.
- **Why:** right now the spires read as a generic city. "From Kuala Lumpur" is one of the three facts in the intro.
- **Risk:** none.

### 6. Tech-stack stickers on the pegboard (nice, S)

- **What and where:** 4–6 small rounded "sticker" pills with plain text (Next.js, React, Java, Flask, Supabase, MySQL), taken from the project Markdown. Use no brand logos (trademark risk and extra weight).
  - Put them in the free strip along the bottom of the pegboard: board-face 2D y between 0.80h and 0.95h.
  - Desktop: about y 2.6–6.4, z 2.2–2.8. Portrait: y 1.2–4.6, z 5.7–6.2.
  - Use `planeMatrix(v, "left", …)` like the resume.
- **Behaviour:** decorative (`aria-hidden`). The skills are already in the project pages' text, so screen readers lose nothing.
- **Night and day:** desaturated pastels at night (lit slightly by the lamp), full colour by day.
- **Why:** recruiters scanning the room see the stack in about 1 s, without clicking.
- **Risk:** at 390×844 the text is tiny (about 7 px). Treat it as texture, not information. Don't let it touch the resume or envelope hit areas.

### 7. Moonlight and sunbeam patches on the floor, plus window ambience (nice, S)

The builder already has the sunbeam for day.

- **Night:** a pale blue parallelogram of moonlight on the floor in front of the window. Desktop: about x 0.3–2.0, y 0.6–2.4. Portrait: about x 0.3–1.4, y 0.5–1.8, at opacity 0.10–0.15.
- **Inside the window:**
  - Night: 3–5 stars twinkle with opacity keyframes, each on its own timing (4–9 s).
  - Day: 1–2 clouds drift a little sideways (translateX ±0.3 units, about 20 s, alternating), clipped to the window frame.
  - Optional: one plane blinking across the night sky every 30 s.
- **Behaviour:** decorative. Under reduced motion, everything is static.
- **Why:** the window becomes the room's clock, alive without being busy.
- **Risk:** use a `clipPath` for the drifting clouds. Don't animate the clip itself.

### 8. String fairy lights along the top of the walls (nice, S–M)

- **What and where:** a slack wire with 12–16 small bulbs.
  - Desktop: along the top edge of the right wall, x 0.3–8.5 at z ≈ 6.25, sagging 0.15 between hooks. Stop before the shelf sign.
  - Portrait: right wall, x 0.3–3.4 at z ≈ 10.3.
- **Behaviour:** decorative. Ambient effect: a slow "breathing" glow at night, with bulbs fading in alternating groups of 3 over a 6 s cycle. Reduced motion: steady glow.
- **Night and day:** at night the bulbs are warm `--lamp-glow` with tiny radial-gradient halos (shared via one `<defs>` gradient). By day, the bulbs are off (pale glass) and the wire is barely visible.
- **Why:** it adds warmth and makes night mode the "cosy" mode.
- **Risk:** don't use filter blur (it's expensive when the room tilts). Use one gradient and reuse it.

### 9. Person: idle animation and better arms (must for the arms, S)

- **What:**
  - The arms are currently straight stiff rods to the keyboard. Bend them at the elbow: upper arm down along the body, forearm forward to the keyboard.
  - Add a subtle idle animation: a breathing scale on the torso (1 → 1.01, 4 s) and an occasional head bob or typing hand jitter (a 0.6 s burst every 5 s).
- **Behaviour:** the person is already interactive (About), and the hover head turn stays. The idle animation **pauses on hover and focus**, so the head turn reads cleanly.
- **Night and day:** no difference, apart from lamp light on the shirt at night (an optional warm overlay, opacity 0.08).
- **Why:** the person is the focal point, and stiff arms are the most noticeable flaw in the drawing.
- **Risk:** the idle animation is off under reduced motion.

### 10. Rubber duck on the desk (nice, S; an easter egg for engineers)

- **What and where:** a small yellow duck next to the monitor. Desktop: about x 6.6, y 1.5, z 2.5 (between the keyboard and the lamp; check it's clear of the lamp base at x ≈ 7.35). Portrait: about x 4.9, y 1.4, z 2.5.
- **Behaviour:** decorative. Hovering the duck (pointer only) makes it wobble (rotate ±8°, 0.5 s). No click action, no tab stop, `aria-hidden`.
- **Night and day:** at night it catches the lamp light (a warm highlight on top); by day it's plain yellow.
- **Why:** rubber-duck debugging is an insider joke that engineers and technical recruiters get.
- **Risk:** none.

### 11. Wall clock showing real KL time (nice, M)

- **What and where:** a round clock on the wall.
  - Desktop: left wall, y 7.4–8.4, z 4.3–5.3 (after the pegboard).
  - Portrait: right wall, x 0.8–1.8, z 9.0–10.0 (above the painting).
  - Draw it flat with `planeMatrix`, as an ellipse in isometric view.
- **Behaviour:** decorative. The hands show the current time in `Asia/Kuala_Lumpur`, set **after mount** in a small client effect: render 10:10 on the server to avoid a hydration mismatch, then rotate the hands. The minute hand updates once a minute. Reduced motion: hands jump with no transition (they're still correct).
- **Night and day:** the face glows faintly at night (lume dots); by day it's plain.
- **Optional:** the theme could *default* from KL time on a visitor's first visit. **I'd skip that.** The default should follow `prefers-color-scheme`, then the visitor's own choice.
- **Why:** it says "KL" again, quietly, and it's alive.
- **Risk:** this would be the only new JavaScript, about 0.5 KB. It's cheap, but it's JS, which is why it's ranked below the CSS-only ideas.

### 12. "Open to work" neon sign (nice, S) ⚠️ Akid should confirm the wording, and whether he is actually open to work

- **What and where:** a small neon script sign reading "open to work" (or "let's build").
  - Desktop: right wall, x 0.7–3.0, z 5.3–5.9 (above the painting).
  - Portrait: left wall, y 1.4–4.4, z 9.2–9.9 (above the pegboard).
- **Behaviour:** pointer-only mouse hit area to `/contact`, `aria-hidden` with `tabindex=-1` (like the shelf). Keyboard users already have the envelope and the nav. Optional: one flicker every 12 s (reduced motion: steady).
- **Night and day:** glowing accent-blue or pink tube at night; by day the tube is unlit with a faint colour.
- **Why:** the strongest recruiter signal you can put in a room, and it points straight at Contact.
- **Risk:** it states a fact about Akid's job search, so don't ship it without his OK.

### 13. Sleeping cat (later, M)

- **What and where:** a curled-up cat on the rug or the chair. Desktop rug: about x 7.6–8.6, y 5.8–6.6. Portrait rug: about x 4.6–5.6, y 4.4–5.2.
- **Behaviour:** decorative breathing (scale 1 → 1.02, 3 s). On pointer hover, the tail flicks and one ear twitches. No click, no tab stop.
- **Night and day:** asleep at night with "z z z" (optional). By day it's lying in the sunbeam: move it into the beam's area.
- **Why:** it's charming and makes people linger. But it's the most "art-heavy" item (a new silhouette in both layouts), so it's ranked later.
- **Risk:** keep it clear of the person's hit area and the rug-front labels.

### 14. Monsoon rain at night (later, L)

- **What:** occasional rain streaks on the window glass at night, plus faint drops on the sill.
- **Behaviour:** decorative, optional, maybe one in 3 visits. Reduced motion: none.
- **Why:** KL evening storms are iconic.
- **Risk:** many animated elements; it needs careful performance testing on mid-range phones. Do it in v2.

### 15. Keyboard easter egg (later, M)

- **What:** typing `kopi` anywhere on `/`, with no input focused, steams the mug harder and turns the monitor text green for 3 s.
- **Behaviour:** global `keydown` listener. It must ignore keystrokes with modifiers and keystrokes inside inputs and dialogs, and it must never intercept Tab, Enter, Esc or Space.
- **Why:** fun for people who poke around.
- **Risk:** it's small, but it's another global listener. It fits better with the terminal easter egg in v2.

## Things in the current room to fix or improve

**A. Day-mode contrast (must).**
- The corner nav uses `bg-room-wall/80` with `--ink` text. If day mode redefines `--room-wall` as cream, the nav text (`#e5e7eb`) on cream fails WCAG AA.
- Either keep the nav pill navy in both themes, or switch its text to dark in day mode.
- The same applies to the focus ring (`--accent` `#93c5fd` on cream is about 1.6:1, a fail): use a darker accent in day mode, such as `#1d4ed8`.
- The label pills are already dark, so they're fine.

**B. Theme flash on load (must).**
- A theme saved in localStorage must be applied before first paint. Use a tiny inline `<script>` in `<head>` that sets `data-room-theme` from localStorage, falling back to `prefers-color-scheme`.
- Add `suppressHydrationWarning` on `<html>`.
- Without this, day-mode visitors see a night flash and a layout-shift-free but jarring repaint.

**C. Two theme controls (must).**
- The nav toggle is the accessible one: a `<button aria-pressed>` named "Night mode", or one whose label changes between "Switch to day" and "Switch to night".
- Make the **wall light switch a mouse-only duplicate** (`aria-hidden`, `tabindex=-1`), like the shelf area. That way the tab order and the screen-reader output don't gain a second control that does the same thing.
- Both controls must stay in sync.

**D. Lamp shade.** It's an orange cube (`IsoBox` 0.6×0.45×0.35). It reads as a box. Use a cone or trapezoid shade (a flared bottom) angled down, with the glow coming out of the opening. Effort S.

**E. Mug.** A white cube. See idea 2.

**F. Painting.** Generic spires. See idea 5.

**G. Arms.** Stiff rods. See idea 9.

**H. Book spine text.** At 1366×768, the KABO, KIDPOS and Bartr spine text is about 8–9 px. That's fine because the hover label shows the title, but give spines a slightly lighter colour so the three project books stand out from the filler books. Effort S.

**I. Phone held sideways (844×390).** The room is small: the content box was about 345×227 px at step (b). After the crop, check that the bookshelf and pegboard are still legible; the nav remains the fallback.

**J. Size budget.** Each idea adds markup to both layouts. Re-measure `/` gzipped after each batch; the budget is about 150 KB for the room's own code, and HTML is 50.7 KB now. The stickers, fairy lights and clock are the cheapest per visual payoff.

**K. Social preview image (OG).** Take it in night mode: it matches the brand, and the monitor glow is the hero.

## Suggested pick for this round

Ideas 1, 2, 3, 5 and 9, plus fixes A–D: about 1 day in total. They're all CSS or art, add no new tab stops, and give the biggest boost to "alive" and "from KL". Then ideas 4, 6, 7 and 8 if time allows. Ideas 12–15 need Akid's input or belong in v2.
