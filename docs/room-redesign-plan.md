# Portfolio Room Redesign — Plan

Status: **planning only, nothing built yet.** Decisions below were made by Akid (the owner).
Later rounds are being answered by a second Claude session ("answerer") on Akid's behalf;
those answers live in `docs/room-redesign-answers.md` and still need Akid's final approval.

## Concept

The landing page (`/`) is one screen, no scroll: an illustrated, interactive room. Each object
is a navigation element with its own hover and click interaction.

## Owner priorities (tie-breakers for every decision)

1. **Recruiters first.** Projects and resume must be reachable in about 3 seconds. When fun and speed conflict, speed wins.
2. **The room is a layer**, not the only way in: an always-visible text nav in a corner, and every section also exists as a normal page.
3. **Ship v1 ASAP** (no fixed deadline, but as soon as possible). Polish goes to v2.
4. Keep the existing content (Markdown projects, resume) and rebuild only the UI.

## Current codebase facts

- Next.js 16, React 19, Tailwind CSS 4, TypeScript. Dark theme, blue accents (`blue-300`).
- Dependencies: `lucide-react`, `gray-matter`, `remark`, `remark-html`. No animation library yet.
- Projects: `content/KABO.md`, `content/Bartr.md`, `content/POS.md`, parsed by `app/lib/markdown.ts`.
- Project detail pages: `app/[slug]/page.tsx` (URLs like `/kabo`).
- `app/kidprojects/page.tsx`: a gallery whose links point to `/kidprojects/<slug>`, which doesn't exist (broken).
- `app/header.tsx`: a sticky header linking to `/#featured-work` and `/#contact`.
- `app/page.tsx`: the current scrolling home page (hero, featured work, contact).
- Assets: `public/images/Akid_RAW.jpg` (photo), `public/resume.pdf`.

## Decisions so far

| # | Topic | Decision |
|---|---|---|
| 1 | Audience | Recruiters and hiring managers first. The room is the delight layer. |
| 2 | Room as a layer | Yes: a persistent corner text nav, and each section is a real page. |
| 3 | Art style | Isometric flat-vector SVG with 3-tone face shading, gradients and contact shadows, so it reads as 3D ("2.5D"). Plus subtle mouse parallax between layers. No Three.js. |
| 4 | Art source | Hand-coded SVG for all objects. The person is a simple stylised, faceless character in the same style (can be swapped for commissioned art later). |
| 5 | Projects | Bookshelf leads to `/projects`, a full page with a "← Back to room" button. Detail pages at `/projects/<slug>`. Old `/<slug>` URLs redirect there. The broken `/kidprojects` page is removed. |
| 6 | About (person) | Hover shows an empty speech bubble and the head moves. Click expands the bubble with a 2–3 sentence intro (who I am, where I'm from, what I do). Clicking outside or pressing Esc closes it. Claude drafts the text from the current hero copy; Akid edits it. |
| 7 | Resume (pegboard paper) | Click flies the paper toward the screen, showing an **image of page 1** with "Download PDF" and "Open full PDF" buttons. No embedded PDF viewer. |
| 8 | Contact (envelope on pegboard) | Hover makes the envelope jump and its flap open. Click flies it toward the screen and a card slides out with Email (`mailto:akidsyazwan@gmail.com`), LinkedIn (`https://www.linkedin.com/in/akid-syazwan-nor-azman-shah-621752236`) and GitHub (`https://github.com/KidCuded`). |
| 9 | Desk computer | Click zooms into the screen, showing a quick-links menu (Projects, About, Resume, Contact). A terminal easter egg is v2. |
| 10 | Painting | Decoration only: an illustrated portrait that tilts on hover. |
| 11 | Animation | Add **Motion** (formerly Framer Motion) for fly-to-screen zooms, bubble expansion and parallax. Simple hover jumps use CSS. |
| 12 | Clickable hints | Desktop: labels show on first load, fade after about 3s, then hover only. Touch: labels always visible. |
| 13 | Mobile | A rearranged portrait scene reusing the same object components in different positions (e.g. pegboard high, bookshelf middle, person at desk bottom). |
| 14 | v1 scope | The room with the objects above, hover animations, labels, routes and the mobile layout. **v2:** sound, light/dark switch, terminal, extra easter eggs, head-tracking. |
| 15 | Content | Keep the current Markdown content and resume as they are. |

## Round 3 questions (open; for the answerer)

1. **Palette and lighting.** Should the room be at **night**, with dark navy walls, a warm desk-lamp glow and a cool blue monitor glow, using the site's existing `blue-300` accent? This would match the current dark theme. Alternatives: a daytime room, or a neutral grey.
   *Griller's recommendation:* night room. Give 4–6 named colour tokens.
2. **Desktop room composition.** Left wall: pegboard (resume paper and envelope). Centre: desk with computer, the person sitting at it, the painting above. Right: bookshelf. Is that layout right?
   *Recommendation:* yes, with the bookshelf on the right and the pegboard on the left, so the two most important items for recruiters (resume and projects) frame the scene.
3. **Bookshelf mapping.** Should there be one labelled book per project (KABO, KIDPOS, Bartr) plus unlabelled filler books? Hovering the shelf makes the books hop in a wave; hovering one book lifts it and shows its title; clicking a project book goes straight to `/projects/<slug>`; clicking anywhere else on the shelf goes to `/projects`.
   *Recommendation:* yes.
4. **Corner nav behaviour.** Should the nav read Projects · About · Resume · Contact? On the room page, About, Resume and Contact would trigger the in-room interactions; on other pages they link to plain pages.
   *Recommendation:* yes, plus plain fallback pages `/about`, `/resume` and `/contact` for direct visits, search engines and sharing.
5. **Projects page styling.** Should `/projects` and `/projects/<slug>` be restyled to match the room's palette (same tokens, simple cards)? The alternative is keeping the current look.
   *Recommendation:* restyle lightly with the shared tokens. No room art on those pages.
6. **Header.** Should the old `app/header.tsx` be removed? The room page would use the corner nav, and other pages a slim header with "← Back to room" plus the nav.
   *Recommendation:* yes.
7. **Keyboard and screen readers.** Should each object be a real `<a>` or `<button>` with an accessible name? Tab order would be: nav, then objects left to right. Keyboard focus would trigger the same hover animation and a visible focus ring. Zoomed views would trap focus, close on Esc and return focus to the object.
   *Recommendation:* yes.
8. **Reduced motion.** When `prefers-reduced-motion` is set, should parallax and the hops be disabled, and zooms become simple fades?
   *Recommendation:* yes.
9. **SEO on the room page.** Should the room page include a visually hidden `<h1>` ("Akid, Software Engineer, Kuala Lumpur") plus the intro text in the HTML? Also proper `metadata` and an Open Graph image (a screenshot of the room).
   *Recommendation:* yes.
10. **The resume page-1 image.** Should page 1 of `resume.pdf` be exported once to `public/images/resume-page1.png` and committed (re-exported by hand whenever the resume changes)? The alternative is generating it at build time.
    *Recommendation:* export once and commit it. Simpler, and the resume rarely changes.
11. **Loading.** Should the room SVG render inline from the server with no loading screen or intro animation, so first paint is the room itself?
    *Recommendation:* yes.

## Round 4 questions (open; for the answerer)

Round 3 answers (in `docs/room-redesign-answers.md`) are adopted provisionally. Items marked ⚠️ wait for Akid. This round settles the "Missing questions" the answerer raised, plus the decisions that Round 3 opened up.

1. **Slugs.** Should slugs be lowercase, taken from a new `slug` field in the frontmatter (falling back to the lowercased filename)? KIDPOS would get the slug `kidpos`. Every old URL (`/KABO`, `/kabo`, `/POS`, `/kidprojects`, ...) would 308-redirect to `/projects/<slug>` or `/projects`, via `redirects()` in `next.config.ts`.
   *Griller's recommendation:* yes. Use the frontmatter field rather than renaming files, so filenames don't matter.
2. **Fitting one screen.** Should the room use one `viewBox` per layout with `preserveAspectRatio="xMidYMid meet"`, with the wall and floor colours filling the leftover space? The portrait layout would switch on by `(max-aspect-ratio: 4/5)` rather than by width. On phones held sideways, the landscape room would show.
   *Recommendation:* yes. Test on 1366×768, 1920×1080, 2560×1080, 390×844 and 844×390.
3. **Real photo.** Should the photo appear on `/about`, and also as a small round avatar in the expanded About bubble?
   *Recommendation:* yes to both. The bubble avatar puts a real face one click from landing.
4. **Contact card.** Should the email show as visible text with a "Copy" button (showing a "Copied" confirmation), next to the `mailto:` link? LinkedIn and GitHub would open in a new tab.
   *Recommendation:* yes.
5. **v1 "done" bar.** Should the answerer's proposed bar be adopted: Resume and Projects reachable within 3 seconds on a mid-range phone on 4G, Lighthouse accessibility ≥ 95, everything works by keyboard alone, and no old URL returns a 404? Add: Lighthouse performance ≥ 90 on mobile, and the room's SVG and JavaScript under about 150 KB gzipped.
   *Recommendation:* yes, with those additions.
6. **Painting subject.** Round 2 made the painting decoration only, an "illustrated portrait". With a faceless character in the room, a portrait could look odd. Should it be a **Kuala Lumpur night skyline** (Petronas Towers silhouette) instead? That quietly answers "where I'm from".
   *Recommendation:* yes, the KL skyline.
7. **Person's hover in v1.** Round 2 says "head moves" on hover, but cursor-following head tracking is v2. Should the v1 hover be a simple head turn toward the viewer plus the empty speech bubble?
   *Recommendation:* yes.
8. **Measuring whether the room drives people away.** Should v1 add lightweight, privacy-friendly analytics with custom events: which object or nav item was clicked first, and Resume download and Contact link clicks? This shows whether visitors use the room or the nav, and would guide v2.
   *Recommendation:* yes, if hosting is Vercel: `@vercel/analytics` with about 6 events and no cookies. Otherwise skip it for v1.
9. **Hosting and rollout.** The repo has no hosting config. Should we assume Vercel, with the redesign built on a branch, reviewed on a preview deployment, and merged to `master` only when the done bar (Q5) passes?
   *Recommendation:* yes. ⚠️ Akid should confirm where the site is hosted.
10. **Build order.** Should v1 be built in this order: (a) routes, redirects, slugs, tokens, shared nav and plain pages; (b) the static room SVG, desktop and portrait; (c) links and labels; (d) hovers and parallax; (e) zoom dialogs (resume, envelope, computer, bubble); (f) accessibility, reduced motion, SEO and the OG image; (g) the done-bar check? After (a)–(c), the site is shippable even with no animation.
    *Recommendation:* yes. If time runs short, ship after (c) or (e).
11. **Testing.** Should v1 add a small Playwright smoke test (every route loads, old URLs redirect, nav links work, dialogs open and close with Esc), with no unit tests for the art?
    *Recommendation:* yes, about 10 tests run before merging.

## Status after Round 4

The griller accepts Round 3 and Round 4 answers as written, including the answerer's three Round 4 gaps: one dialog open at a time, a custom 404 in step (a), and trimming the fonts. The answerer-driven rounds are closed. Remaining open items are owner-only (⚠️) and are put to Akid directly:

- Colour tokens (Round 3, Q1)
- H1 text, site title and meta description (Round 3, Q9)
- Whether `resume.pdf` is final (Round 3, Q10)
- The KIDPOS URL `/projects/kidpos` (Round 3, missing question 1)
- Photo on `/about` and an avatar in the About bubble (Round 4, Q3)
- KL skyline painting (Round 4, Q6)
- Hosting, domain and Vercel plan (Round 4, Q8–9). Check at build time whether Vercel custom analytics events need the Pro plan.
- UI font (Round 4, missing question 1)

## Round 5: owner answers (all accepted)

1. Colours: the night palette `#0f1a2e` / `#162238` / `#8a5a3b` / `#ffc879` / `#93c5fd` / `#e5e7eb`.
2. Site title "Akid — Software Engineer"; H1 "Akid — Software Engineer in Kuala Lumpur"; keep the current meta description.
3. The current `public/resume.pdf` is final. Export page 1.
4. KIDPOS at `/projects/kidpos`.
5. Real photo on `/about`, plus a round avatar in the About bubble.
6. Painting: Kuala Lumpur night skyline with the Petronas Towers.
7. Hosted on **Vercel Hobby**. v1 gets page-view analytics only; custom click events are v2. The production domain still needs to be read from the Vercel dashboard (for `metadataBase`).
8. Plus Jakarta Sans is the only font. Remove Geist, Geist Mono and Syne.

**Planning is complete. Nothing is built yet.**
