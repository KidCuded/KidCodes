# Portfolio Room: v1 Build Plan

Status: **waiting for Akid's approval. No code written yet.**
Source of every decision: `docs/room-redesign-plan.md` (Rounds 1, 2 and 5 answered by Akid) and `docs/room-redesign-answers.md` (Rounds 3 and 4, accepted).

## 1. Goal and guardrails

The landing page `/` is a one-screen, no-scroll, isometric night room. Each object is a link or button. The room is a **layer** over a plain, fast site.

- **Recruiters first.** Projects and the resume are reachable within 3 s on mobile, through the corner nav or the objects.
- Every room interaction also exists as a plain page: `/projects`, `/about`, `/resume`, `/contact`.
- After step (c) of the build order, the site is shippable with no animations at all.

## 2. Dependencies

| Add | Why |
|---|---|
| `motion` | Fly-to-screen zooms, bubble expansion, parallax |
| `@vercel/analytics` | Page views (Hobby plan, so no custom events in v1) |
| `@playwright/test`, `@axe-core/playwright` (dev) | Smoke tests and an accessibility scan |

Keep: `gray-matter`, `remark`, `remark-html`, `lucide-react`.
Remove from `app/layout.tsx`: the Geist, Geist Mono and Syne fonts. **Plus Jakarta Sans** is the only font.

## 3. Routes

| Route | Content | Notes |
|---|---|---|
| `/` | The room | Server-rendered SVG; interactive parts are client components |
| `/projects` | Project list (cards) | Slim header with "← Back to room" |
| `/projects/[slug]` | Project detail from Markdown | `slug` frontmatter field, falling back to the lowercased filename |
| `/about` | Intro text and photo | Reuses `AboutContent` |
| `/resume` | Page-1 image, Download and Open buttons | Reuses `ResumeView` |
| `/contact` | Contact card | Reuses `ContactCard` |
| `not-found` | Styled 404 with "Back to room" and the nav | |

**Delete:** `app/[slug]/`, `app/kidprojects/`, `app/header.tsx`. Replace the old `app/page.tsx` sections.

**Redirects** in `next.config.ts`, permanent (308), with an **explicit list** and no catch-all:
`/KABO` and `/kabo` → `/projects/kabo`; `/Bartr` and `/bartr` → `/projects/bartr`; `/POS` and `/pos` → `/projects/kidpos`; `/kidprojects` → `/projects`; `/kidprojects/:path*` → `/projects`.

**Frontmatter:** add `slug: kabo`, `slug: bartr` and `slug: kidpos` to the three files in `content/`. The text content stays the same.

## 4. Design tokens (`app/globals.css`, Tailwind 4 `@theme`)

| Token | Value | Use |
|---|---|---|
| `--room-wall` | `#0f1a2e` | Wall, page background |
| `--room-floor` | `#162238` | Floor, shadow faces |
| `--room-wood` | `#8a5a3b` | Desk, shelf (light and dark faces derived from it) |
| `--lamp-glow` | `#ffc879` | Lamp light, skyline windows (low opacity) |
| `--accent` | `#93c5fd` | Monitor glow, labels, focus ring, links |
| `--ink` | `#e5e7eb` | Text |

Text and focus rings must meet WCAG AA against `--room-wall`. Glows never sit behind text.

## 5. File and component layout

```
app/
  layout.tsx                 fonts trimmed, metadata, <Analytics/>, MotionConfig reducedMotion="user"
  page.tsx                   <Room/> + visually hidden H1 + intro text
  not-found.tsx
  projects/page.tsx
  projects/[slug]/page.tsx
  about/page.tsx  resume/page.tsx  contact/page.tsx
  lib/markdown.ts            slug support, newest-first ordering
  components/
    nav/SiteNav.tsx          variant="corner" | "header"; real <a> links; on "/" intercepts click → open dialog
    content/AboutContent.tsx  ResumeView.tsx  ContactCard.tsx  QuickLinks.tsx
    room/
      Room.tsx               server: renders BOTH layouts, CSS (max-aspect-ratio: 4/5) hides one
      RoomDesktop.tsx        viewBox 0 0 1600 900
      RoomPortrait.tsx       viewBox 0 0 900 1600
      RoomProvider.tsx       client: one-dialog-at-a-time state, focus return target
      RoomDialog.tsx         native <dialog> + showModal(), Esc, backdrop click, focus return
      useParallax.ts         pointer → layer offsets; off under reduced motion and on touch
      Labels.tsx             desktop: show 3 s then hover only; touch or reduced motion: always visible
      objects/
        Pegboard.tsx  ResumePaper.tsx  Envelope.tsx
        Desk.tsx  Computer.tsx  Lamp.tsx
        Person.tsx  SpeechBubble.tsx
        Painting.tsx (KL skyline)
        Bookshelf.tsx  Book.tsx
content/about/intro.md       2–3 sentence intro (Claude drafts it, Akid edits); in a subfolder so it isn't read as a project
public/images/resume-page1.webp   exported once (~1240 px wide); comment in code: re-export when resume.pdf changes
public/images/avatar.webp         small crop of Akid_RAW.jpg
public/og.png                     1200×630 screenshot of the finished room
tests/smoke.spec.ts
```

Every object component accepts `x`, `y` and `scale`, so the desktop and portrait layouts reuse the same art.

## 6. Composition

**Desktop (1600×900):** pegboard on the left wall (resume paper and envelope pinned to it); the desk in the centre with the computer, lamp and the person seated at three-quarter view facing the screen; the KL skyline painting above the desk; the bookshelf on the right. **The top-right corner is kept clear for the nav.** The speech bubble opens into empty wall space and never covers the painting.

**Portrait (900×1600):** from top to bottom: the nav, the pegboard high on the wall, the bookshelf in the middle, the painting off to one side, the person at the desk at the bottom. Every tap target is at least 44 px.

Leftover space at any aspect ratio is filled with the wall and floor colours (`xMidYMid meet`).

## 7. Interactions per object

| Object | Element | Hover / focus | Click / Enter | Accessible name |
|---|---|---|---|---|
| Resume paper | `<button>` (with JS) / `<a href="/resume">` | Paper lifts slightly and its corner curls | Flies to the screen in a dialog: page-1 image, **Download PDF**, **Open full PDF** | "Resume: view and download" |
| Envelope | `<button>` / `<a href="/contact">` | Jumps, flap opens | Flies to the screen, a card slides out: email as text plus **Copy** (`aria-live` "Copied"; selects the text if the clipboard is unavailable), `mailto:` link, LinkedIn, GitHub (new tab, `noopener noreferrer`) | "Contact details" |
| Person | `<button>` / `<a href="/about">` | Head turns toward the viewer; empty speech bubble appears | Bubble expands with the intro and a round avatar (loaded on open); closes on click outside or Esc | "About Akid" |
| Computer | `<button>` | Screen glow brightens | Zooms into the screen: quick links Projects / About / Resume / Contact. Choosing one **closes this view and opens that one** (only one dialog at a time) | "Quick links" |
| Project book (one per project) | `<a href="/projects/<slug>">` | Lifts and shows its title | Goes to the project page | "Project: KABO", etc. |
| "All projects" sign | `<a href="/projects">` | Underline | Goes to the list | "All projects" |
| Rest of the shelf | Mouse-only click area (not a tab stop) | Books hop in a CSS wave | `/projects` | (none; the sign covers keyboard users) |
| Filler books | Decorative, `aria-hidden` | Join the wave | (none) | (none) |
| Painting | Decorative, not focusable | Tilts a few degrees | (none) | (none) |

Shared rules:
- Keyboard focus triggers the same animation as hover, plus a focus ring in `--accent`.
- When a dialog closes, focus returns to the object that opened it.
- Tab order: nav, then resume, envelope, person, computer, then the books and "All projects".
- Under `prefers-reduced-motion`: no parallax and no hops; zooms become fades; labels stay visible.
- Without JavaScript, every object is a link to its plain page.

## 8. Art asset list (all hand-coded SVG, isometric, 3-tone shading, contact shadows)

1. Room shell: back wall, side wall, floor, skirting, soft lamp-light gradient
2. Pegboard with a hole grid
3. Resume paper (resting and curled-corner states)
4. Envelope (closed and open-flap states, plus a card for the slide-out)
5. Desk
6. Desk lamp with a glow cone
7. Computer: monitor, keyboard and screen-glow states
8. Chair
9. Person: seated, faceless, three-quarter view; separate head group for the turn
10. Speech bubble (empty and expanded)
11. Painting: frame and a KL night skyline with the Petronas Towers silhouette and warm windows
12. Bookshelf, project book template (spine shows the title, colour per project), 6–10 filler books
13. "All projects" sign
14. Small props for life, optional (plant, mug): decorative, `aria-hidden`

Parallax layers, from back to front: walls and painting → pegboard and shelf → desk, person and props.

## 9. SEO and metadata

- `title`: "Akid — Software Engineer"
- Visually hidden H1: "Akid — Software Engineer in Kuala Lumpur"
- `description`: "Portfolio of Akid, a Software Engineer based in Kuala Lumpur." (unchanged)
- The intro text and real `<a>` links to every project and `/resume` are in the server HTML.
- Open Graph and Twitter image: `public/og.png`. `metadataBase` = `https://kid-codes.vercel.app`.

## 10. Build order (each step leaves the site working)

| Step | Work | Done when |
|---|---|---|
| **a** | Tokens, font trim, `SiteNav`, routes, slugs, redirects, plain pages, 404, metadata and H1, delete old files, export the resume image and avatar, draft `content/about.md` | Every route renders; old URLs redirect; the site is usable without the room |
| **b** | Static room SVG, desktop and portrait, both layouts with CSS switching | It looks right at the 6 test sizes (§12) |
| **c** | Objects become real links and buttons with accessible names, labels, focus rings | **Minimum shippable version**: keyboard-only use works, each object reaches its page |
| **d** | Hovers, wave, head turn, painting tilt, parallax, reduced-motion handling | Smooth on a mid-range phone; nothing moves under reduced motion |
| **e** | `RoomProvider`, `RoomDialog`, resume, envelope, computer and bubble views with fly-in animations | One dialog at a time; Esc and backdrop close it; focus returns to the object |
| **f** | OG image, `<Analytics/>`, full accessibility and Lighthouse audit, fixes | Audit issues resolved |
| **g** | Done-bar check (§11), Vercel preview reviewed on Akid's phone, merge to `master` | All of §11 passes |

If time runs short, ship after (c) or after (e).

## 11. v1 done bar

- Lighthouse mobile: performance ≥ 90, accessibility ≥ 95, LCP < 2.5 s, low TBT. The nav and objects are clickable within 3 s.
- The room's own SVG and JavaScript total about 150 KB gzipped or less (Next.js and React excluded).
- Everything can be done with the keyboard alone.
- No old URL returns a 404.
- Playwright smoke tests and the axe scan pass.

## 12. Testing

**Sizes to check by hand:** 1366×768, 1920×1080, 2560×1080, 768×1024, 390×844, 844×390.

**`tests/smoke.spec.ts` (about 10 tests):**
1. `/`, `/projects`, `/about`, `/resume`, `/contact` load with status 200.
2. Each `/projects/<slug>` loads.
3. Every old-URL casing redirects to the right place (308).
4. An unknown URL shows the custom 404.
5. The nav links work on a non-room page.
6. On `/`, the resume, envelope, person and computer each open their view; Esc closes it; focus returns to the object.
7. Computer → "Resume" swaps the dialog (only one open).
8. Contact "Copy" shows "Copied".
9. A project book navigates to its project.
10. An axe scan of `/` and `/projects` finds no serious violations.

Run locally before merging (there's no CI yet).

**Feature checks Akid asked for explicitly** (each one must pass, in a test or by hand in a browser):
- **Books:** every project book and the "All projects" sign go to the right page, by mouse, by keyboard and by tap at the portrait size.
- **Resume download:** "Download PDF" (in the room view and on `/resume`) downloads `resume.pdf` with status 200 and a PDF content type; "Open full PDF" opens it.
- **PC usable:** the computer opens its quick-links view by click and by keyboard, each quick link reaches its view or page, Esc closes it, and focus returns to the computer.

## 15. Roles during the build

| Who | Role |
|---|---|
| **Builder** (this session, "griller") | Writes all app code, step by step from §10. Owns everything except `tests/` and `playwright.config.ts`. Installs dependencies, including the Playwright packages, in step (a). |
| **Decision maker and tester** (session `room-answerer`) | **Decides** any design or implementation question that comes up during the build which this plan doesn't settle, and logs it under `## Build decisions` in `docs/room-redesign-answers.md`. **Tests** each finished step: owns `tests/` and `playwright.config.ts`, runs the dev server on its own port (3100), and reports pass or fail with details. Doesn't edit app code. |
| **Akid** | Final say. Still decides anything about his voice or personal content (About text, photo choice), approves merging to `master` (production), and can overrule any decision. |

Loop per step: the builder finishes a step and messages the tester. The tester runs its checks and replies with results. The builder fixes any failures. Then the next step starts.

## 13. Not in v1 (v2 backlog)

Sound effects, light/dark switch, computer terminal easter egg, cursor-following head tracking, extra easter eggs, deep links to views (`/#resume`), custom analytics events (need Vercel Pro), a full redesign of the projects page, a CI workflow, commissioned art.

## 14. Open items before or during the build

- **Production domain:** `https://kid-codes.vercel.app` (Akid confirmed). This is the live old site; v1 is tested locally and on a Vercel preview, never against production.
- **About text:** Claude drafts `content/about.md` in step (a); Akid edits it before merging.
- Vercel analytics on Hobby: page views only. Confirm in Vercel's docs at build time.
