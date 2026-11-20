# Portfolio Room Redesign — Answers

Answers written by the answerer session on Akid's behalf. **All of these still need Akid's final approval.**
Items marked ⚠️ are taste, Akid's own wording, or facts only Akid knows.

## Round 3 answers

### 1. Palette and lighting

- **Answer:** Accept the night room, with one change: every text label, the corner nav and the focus rings must meet WCAG AA contrast against the wall colour. The glows are only for atmosphere and must never sit behind text. Starting tokens:
  - `--room-wall` `#0f1a2e` (deep navy wall)
  - `--room-floor` `#162238` (floor and desk shadow side)
  - `--room-wood` `#8a5a3b` (desk and bookshelf, mid tone; derive the light and dark faces from it)
  - `--lamp-glow` `#ffc879` (warm lamp light, used at low opacity)
  - `--screen-glow` / `--accent` `#93c5fd` (Tailwind `blue-300`, the existing accent; monitor glow, labels, focus ring)
  - `--ink` `#e5e7eb` (text, close to the current `gray-200`)
- **Why:** It keeps the site's current dark theme and `blue-300` accent, so the room and the plain pages feel like one site. Six tokens are enough to restyle the other pages (Q5) without extra design work.
- **Confidence:** Medium. Night is clearly right, but the exact hex values are taste. ⚠️ Akid should confirm the colours.

### 2. Desktop room composition

- **Answer:** Accept: pegboard on the left, desk, person and computer in the centre with the painting above, bookshelf on the right. Two additions:
  1. Keep the corner the nav sits in (top-right, above the bookshelf) clear of art, so the nav never overlaps an object.
  2. The person should sit at the desk facing the computer at three-quarter view, so the person, the screen and the speech bubble (Q6 of round 2) are all visible and the bubble opens into empty wall space and doesn't cover the painting.
- **Why:** The resume and projects frame the scene, and they're the first things a recruiter's eye lands on when reading left to right. A reserved nav corner keeps the 3-second text path clear.
- **Confidence:** High.

### 3. Bookshelf mapping

- **Answer:** Accept, with these changes:
  - **No nested links.** A link can't sit inside another link, so the shelf can't be one big link with book links inside it. Instead, each project book is its own link to `/projects/<slug>`. A small visible sign on the shelf, "All projects", is a separate link to `/projects`. The rest of the shelf can be clickable with the mouse (it goes to `/projects`), but it isn't a second keyboard target.
  - **Data-driven.** Project books come from `getAllProjectsData()`, ordered newest first, so adding a Markdown file adds a book with no art changes. Filler books are decorative (`aria-hidden`, not focusable).
  - **Touch:** tapping a book goes straight to its project, because touch screens have no hover-to-preview step. Titles are always visible on touch (round 2, decision 12).
  - The wave hop is CSS only, and it's dropped under reduced motion (Q8).
- **Why:** It keeps one-click access to each project for recruiters, stays valid for keyboard and screen-reader users, and doesn't need art changes when Akid adds projects.
- **Confidence:** High.

### 4. Corner nav behaviour

- **Answer:** Accept "Projects · About · Resume · Contact" and the fallback pages `/about`, `/resume` and `/contact`, built in the simplest way: each nav item is a **real link** to its page. On the room page, a click handler stops the navigation and opens the in-room view instead. Without JavaScript, or on any other page, the link simply opens the plain page. The URL doesn't change while a room view is open (deep links like `/#resume` are v2). The fallback pages are minimal and reuse the same components as the room views:
  - `/resume`: the page-1 image plus the Download and Open buttons.
  - `/contact`: the same card as the envelope.
  - `/about`: the intro text, plus the real photo `Akid_RAW.jpg` (see the missing questions).
- **Why:** Round 2 (decision 2) already said every section is a real page. Real links give a working fallback for free, and shared components mean the extra pages cost little v1 time.
- **Confidence:** High.

### 5. Projects page styling

- **Answer:** Accept, limited to swapping in the tokens: the same colours, fonts and simple cards, with no layout redesign and no room art. The move to `/projects/<slug>` and the redirects happen anyway, so the restyle rides along with that work.
- **Why:** A recruiter clicking from the room into a page that looks like a different site feels broken, and swapping tokens is cheap. A real redesign of these pages is v2.
- **Confidence:** High.

### 6. Header

- **Answer:** Accept. Remove `app/header.tsx` from the root layout. Use one nav component in two forms: the corner nav on `/`, and a slim header on every other page with "← Back to room" on the left and the same nav on the right. Make sure nothing still links to `/#featured-work` or `/#contact`, because those anchors disappear.
- **Why:** One nav component means less code and the same labels everywhere. It also prevents dead anchor links.
- **Confidence:** High.

### 7. Keyboard and screen readers

- **Answer:** Accept, with these changes:
  - **Native `<dialog>` for zoomed views.** Open zoomed views with `showModal()`. This gives Esc-to-close, an inert background and a top layer for free, instead of a hand-written focus trap. On close, return focus to the object that opened the view.
  - **Tab order:** nav, then resume, envelope, person, computer, then the project books and "All projects". The painting is decorative and not focusable.
  - **Accessible names say what happens,** for example "Resume: view and download", "Contact details", "About Akid", "Quick links", or "Project: KABO".
  - Keyboard focus triggers the same animation as hover, plus a visible focus ring in `--accent`.
- **Why:** Native dialogs are less code and fewer bugs than a custom focus trap, which suits shipping v1 fast. Clear names help screen-reader users and anyone tabbing through quickly.
- **Confidence:** High.

### 8. Reduced motion

- **Answer:** Accept, plus one more change: under reduced motion, the desktop labels **stay visible** instead of fading out after 3 seconds. Use Motion's `<MotionConfig reducedMotion="user">` for the Motion animations and a `@media (prefers-reduced-motion: reduce)` block for the CSS hops.
- **Why:** If nothing moves on hover, the labels are the only sign of what's clickable, so they shouldn't disappear.
- **Confidence:** High.

### 9. SEO on the room page

- **Answer:** Modify. Accept the visually hidden `<h1>`, the intro text in the HTML and proper `metadata`. Also:
  - Put links to the project pages and `/resume` in the server-rendered HTML. The books and nav already do this if they're real links (Q3, Q4).
  - **OG image:** take one manual screenshot of the finished room and commit it as `public/og.png` (1200×630). Don't generate it with `next/og` in v1.
  - The H1 wording and the site title are Akid's call. The current title is "KidCodes", and the hero says "I'm Akid", "Software Engineer" and "Based in Kuala Lumpur, Malaysia". Suggested H1: "Akid — Software Engineer in Kuala Lumpur".
- **Why:** Recruiters often find or share the link through search and LinkedIn previews, so a good title, description and preview image count. A manual screenshot is the fastest way to get one.
- **Confidence:** Low on the wording and the title, high on the approach. ⚠️ Akid should confirm the H1 text, the site title ("KidCodes" or his name) and the meta description.

### 10. Resume page-1 image

- **Answer:** Accept: export once and commit it. Export at about 1240px wide as PNG or WebP, show it with `next/image`, and give it alt text such as "Page 1 of Akid's resume". Add a one-line comment next to where the image is used: "re-export when resume.pdf changes".
- **Why:** It's the simplest option, with no build tooling, and the resume rarely changes. The comment lowers the risk of the image going out of date.
- **Confidence:** High. ⚠️ Akid should confirm that the current `resume.pdf` is final before the export.

### 11. Loading

- **Answer:** Accept: the room renders inline from the server, with no loading screen and no intro animation. Only the interactive parts (objects, nav handler, dialogs) are client components. Parallax starts after hydration and must not shift the layout on first paint. Load the zoom and dialog code lazily if that's easy, but don't spend v1 time optimising it.
- **Why:** Getting the first paint and a clickable nav up quickly is the 3-second rule in practice. A loading screen would work directly against the recruiters-first priority.
- **Confidence:** High.

### Missing questions

1. **Project slugs and casing.** Slugs come from the filenames: `KABO`, `Bartr` and `POS`. URLs are case-sensitive on the production host, so `/kabo` and `/KABO` aren't the same page. Also, the "KIDPOS" book would point to `/projects/POS`. Proposal: make slugs lowercase in `markdown.ts`, and either rename `POS.md` to `kidpos.md` or add a `slug` field to the frontmatter. Redirect every old casing and `/<slug>` to `/projects/<slug>`. This doesn't change any content text. ⚠️ Akid should confirm the KIDPOS URL.
2. **Fitting one screen with no scroll.** How does the room scale on short laptop screens (1366×768), on ultrawide monitors and on phones held sideways? Proposal: one SVG `viewBox` with `preserveAspectRatio="xMidYMid meet"`, with the wall and floor colours filling the leftover space. Switch to the portrait layout by aspect ratio (taller than wide) rather than by width alone.
3. **Where does the real photo go?** The room uses a faceless character, so the current `Akid_RAW.jpg` photo would vanish. Recruiters often like to see a real face. Proposal: show it on `/about`, and optionally as a small framed photo in the About bubble. ⚠️ Akid should confirm.
4. **Email shown as text.** The contact card should show the email address as visible, copyable text, maybe with a copy button, as well as the `mailto:` link. Many recruiters use webmail, where `mailto:` does nothing.
5. **v1 "done" bar.** What has to pass before v1 ships? Proposal: the Resume and Projects nav links work within 3 seconds on a mid-range phone on 4G, the Lighthouse accessibility score is at least 95, everything can be done with the keyboard alone, and no old URL returns a 404.

## Round 4 answers

### 1. Slugs

- **Answer:** Accept lowercase slugs from a frontmatter `slug` field, falling back to the lowercased filename, with KIDPOS as `kidpos`. Three changes:
  - **Delete `app/[slug]/page.tsx` and `app/kidprojects/`.** If the root-level `[slug]` route stays, it would catch `/about`, `/resume` and so on.
  - **List the old URLs explicitly in `redirects()`.** Hard-code the old URLs (`/KABO`, `/kabo`, `/Bartr`, `/bartr`, `/POS`, `/pos`, plus `/kidprojects` and `/kidprojects/:path*`) instead of a catch-all `/:slug` rule. A catch-all would also swallow `/about`, `/resume`, `/contact` and `/projects`. Only these three projects ever had old URLs, so a fixed list is correct and never needs updating.
  - **Test every casing** in the smoke test (Q11). Don't rely on redirect matching being case-insensitive.
- **Why:** Old links already shared with recruiters keep working. The explicit list can't accidentally redirect the new pages.
- **Confidence:** High.

### 2. Fitting one screen

- **Answer:** Accept the `viewBox` with `preserveAspectRatio="xMidYMid meet"` and switching layout by aspect ratio. Changes:
  - **Switch layouts with CSS, not JavaScript.** Render both SVG layouts and hide one with the `(max-aspect-ratio: 4/5)` media query, so there's no wrong-layout flash before the page becomes interactive. Count both layouts in the size budget (Q5).
  - **Add 768×1024 (tablet portrait) to the test sizes.** At 0.75 it's below 4/5, so it gets the portrait layout. Check that this looks right.
  - **Touch targets at 844×390.** On a phone held sideways, every object must still be at least 44 px tall. If that isn't possible, the corner nav is the main way in at that size, which is acceptable.
- **Why:** Making it work on mobile and short laptop screens without scrolling is the riskiest part of the "one screen" idea, so it needs explicit test sizes and a fallback.
- **Confidence:** High.

### 3. Real photo

- **Answer:** Accept: the photo on `/about`, plus a small round avatar in the expanded About bubble. Serve it with `next/image` at the size it's shown, because `Akid_RAW.jpg` is the raw file. Load it only when the bubble opens, not on first paint.
- **Why:** It puts a real face one click from the landing page, at no cost to load time.
- **Confidence:** Medium. Putting a real face next to a faceless character is a matter of taste. ⚠️ Akid should confirm he's happy with the avatar in the bubble, and which photo to use.

### 4. Contact card

- **Answer:** Accept. Details:
  - The "Copied" confirmation goes into an `aria-live="polite"` region, so screen-reader users hear it too.
  - If the clipboard isn't available, the button selects the email text instead.
  - LinkedIn and GitHub open in a new tab with `rel="noopener noreferrer"`.
  - The same card is used on `/contact`.
- **Why:** Recruiters using webmail can copy the address, where `mailto:` does nothing. The extras are small.
- **Confidence:** High.

### 5. v1 "done" bar

- **Answer:** Modify two items so they can be measured:
  - "Reachable in 3 seconds" means: on Lighthouse's mobile run (which simulates a mid-range phone on a slow connection), the nav and the room objects are visible and clickable within 3 seconds. In practice that's a Largest Contentful Paint under 2.5 s and a low Total Blocking Time.
  - **The ~150 KB budget covers only the room's own SVG and JavaScript.** Next.js and React already take roughly 90–100 KB gzipped on their own, so a whole-page 150 KB budget would fail before any room code is added.
  - Keep the rest: Lighthouse accessibility ≥ 95, Lighthouse mobile performance ≥ 90, everything works by keyboard alone, and no old URL returns a 404.
- **Why:** A bar that can't be measured, or one that fails by design, would block v1 from shipping for no benefit.
- **Confidence:** High.

### 6. Painting subject

- **Answer:** Accept the Kuala Lumpur night skyline with the Petronas Towers silhouette. It fits the night palette, with the lamp-glow colour in the windows.
- **Why:** It quietly says where Akid is from without another face, and it's simple to draw in flat vector.
- **Confidence:** Low, because the subject is personal taste. ⚠️ Akid should confirm.

### 7. Person's hover in v1

- **Answer:** Accept: a simple head turn toward the viewer plus the empty speech bubble. Cursor-following head tracking stays in v2.
- **Why:** It keeps the charm with a single CSS or Motion transform, so v1 stays small.
- **Confidence:** High.

### 8. Analytics

- **Answer:** Modify. If the site is on Vercel, add `@vercel/analytics` page views in v1: they're tiny, cookie-free and available on the free plan. Custom events (first object clicked, resume download, contact clicks) depend on the plan: as far as I know they need Vercel Pro. If Akid is on the free Hobby plan, leave custom events for v2. For a cheap signal in the meantime, compare `/resume` and `/projects` page views with visits to `/`.
- **Why:** It answers "does the room drive people away?" without adding a paid service or a cookie banner to v1.
- **Confidence:** Medium. ⚠️ Akid should confirm the hosting and the Vercel plan. (Akid or the griller should also check the custom-events plan rule in Vercel's docs.)

### 9. Hosting and rollout

- **Answer:** Accept the assumption: Vercel, with the work on a branch, review on a preview deployment, and a merge to `master` only once the done bar passes. The repo's remote is `github.com/KidCuded/KidCodes`, which fits Vercel's Git integration, but nothing in the repo confirms the host.
- **Why:** Preview deployments let Akid check the real site on his phone before recruiters see it.
- **Confidence:** Low. ⚠️ Akid should confirm the host and the production domain.

### 10. Build order

- **Answer:** Modify. Build accessibility and reduced motion as each step is built, rather than in a separate step (f):
  - (a) Routes, redirects, slugs, tokens, the font choice (see the missing questions), shared nav, plain pages, `metadata` and the H1.
  - (b) The static room SVG, desktop and portrait.
  - (c) Links and labels: real `<a>` and `<button>` elements with accessible names and focus rings. **This step is the minimum shippable site.** Each object links to its plain page.
  - (d) Hovers and parallax, with reduced-motion handling.
  - (e) Zoom dialogs using native `<dialog>`, with reduced-motion fades.
  - (f) The OG image, analytics, and a full accessibility and Lighthouse audit.
  - (g) The done-bar check.
- **Why:** If v1 ships after (c), it must already be accessible and searchable. Deferring that to (f) would make the "shippable after (c)" claim false.
- **Confidence:** High.

### 11. Testing

- **Answer:** Accept: about 10 Playwright smoke tests, run locally before merging (the repo has no CI yet). Include every old-URL casing from Q1. Optionally add one `@axe-core/playwright` scan of `/` and `/projects` to check the accessibility part of the done bar automatically.
- **Why:** Redirects and dialogs are what break silently, and these tests are cheap. Unit tests for the art would add nothing.
- **Confidence:** Medium. Adding a CI workflow is a separate, later decision.

### Missing questions

Most decisions are now covered. Three small gaps remain:

1. **Fonts.** `app/layout.tsx` loads four Google fonts (Geist, Geist Mono, Syne and Plus Jakarta Sans), but the `font-Plus_Jakarta_Sans` class on the home page doesn't apply any of them. Proposal: pick one font for UI and labels (Plus Jakarta Sans, the one the current page tries to use) and at most one display font, and drop the rest. That helps the performance bar. ⚠️ Akid should confirm the font.
2. **Moving from the computer menu to another view.** On the room page, clicking "Resume" in the computer's quick-links menu should close the computer view and open the resume view, not stack one dialog on another. When the resume view closes, focus goes back to the computer object. Proposal: only one dialog open at a time.
3. **Custom 404 page.** Add a `not-found.tsx` in the new style with "← Back to room" and the nav, so a mistyped URL still gets a recruiter to the projects in one click. Cheap; belongs in step (a).

## Build decisions

Decided by the tester and decision maker during the build. Akid can overrule any of them.

| # | Question | Decision | Why |
|---|---|---|---|
| B1 | How are tests for unbuilt steps skipped? | Each step's tests are marked `test.fixme` until that step is built. `CURRENT_STEP` in `tests/helpers.ts`, or the `ROOM_STEP` environment variable, says which step is reached. The tester raises it after each "step X ready" message. | One switch, no edits inside the tests, and the same files serve every step. |
| B2 | Who starts the test dev server? | `playwright.config.ts` uses `webServer` with `npx next dev -p 3100` and `reuseExistingServer: true`. Playwright starts it and stops it after the run. | Meets "own server on 3100, stop when done" with no stray processes. |
| B3 | Accessible names are a contract | Tests find elements by the names in build plan §7 and the nav labels (Projects, About, Resume, Contact, "← Back to room", "All projects", "Project: <TITLE>…", "Download PDF", "Open full PDF", "Copy"/"Copied"). The builder keeps these exact or tells the tester first. | Names are what screen-reader users hear, so tests that use them double as accessibility checks. |
| B4 | Quick link → view, then Esc | After the computer opens another view, Esc on that view returns focus to the **computer**. | It's the object the user actually activated. This matches Round 4's missing question 2. |
| B5 | Tap-target check | Portrait tap tests also assert that each book and the "All projects" sign are at least 44×44 CSS px. | Round 4, Q2 made 44 px a requirement; testing it catches regressions early. |
| B6 | The step (b) portrait layout is a compact isometric room, not the stacked order in plan §6 (pegboard top, shelf middle, desk bottom). Is that OK? | Accept it as built. | It fits 390×844 with no scroll, every object is visible, and it reuses the same art. |
| B7 | From step (b), the project links on `/` are visually hidden but still focusable, so keyboard users tab onto links they can't see (WCAG 2.4.7). | In step (c), remove the hidden duplicate project links from `/`. The books, the "All projects" sign and the nav become the real links, and they're in the server HTML. Keep the hidden H1 and intro text. | Prevents invisible focus stops, and the books already cover SEO and screen readers. |
| B8 | Book spines are about 10 px wide at 390×844 and about 6 px at 844×390, well under 44 px. | In step (c), give each book and the sign an invisible hit area of at least 44×44 CSS px at 390×844 (for example a transparent `<rect>` inside the link; neighbouring books' hit areas may touch but must not overlap). At 844×390, the corner nav is the accepted fallback (Round 4, Q2), so the tap test runs at 390×844 only. | Meets the 44 px rule without changing the art. |
| B10 | On touch, tapping the shelf body (not a book) also goes to `/projects`, through the mouse-only shelf area. Is that OK? | Accept. | On a phone, a tap that misses a book still lands on the project list, which is what a recruiter wants. Keyboard and screen-reader users have the "All projects" sign. |
| B9 | Until step (e), what does the computer do? | Accept the interim: "Quick links" is a link to `#main-nav` that moves focus to the corner nav. It's tested in step (c) and skipped once step (e) is built. | Every object does something useful at the minimum shippable step (c), and the nav *is* the quick links. |
