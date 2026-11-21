import Link from "next/link";
import { DoorOpen } from "lucide-react";
import ThemeToggle from "@/app/components/wall/ThemeToggle";

// Every section lives on the one-page site (/portfolio). In the room, About,
// Resume and Contact open in-room views instead (RoomProvider, data-opens);
// their hrefs are the old paths, which redirect to the right section when
// JavaScript is off.
export const NAV_ITEMS = [
  { section: "about", label: "About", roomHref: "/about", opens: "about" },
  { section: "projects", label: "Projects", roomHref: "/portfolio#projects", opens: undefined },
  { section: "resume", label: "Resume", roomHref: "/resume", opens: "resume" },
  { section: "contact", label: "Contact", roomHref: "/contact", opens: "contact" },
] as const;

type Props = {
  /** "corner" sits over the room on `/`; "header" is the sticky bar on the one-page site and project pages. */
  variant: "corner" | "header";
};

export default function SiteNav({ variant }: Props) {
  if (variant === "corner") {
    // The room: the same floating glass bar as the one-page site, with Resume
    // and the day/night switch. Its tint follows the room's theme (.room-glass).
    return (
      <nav
        id="main-nav"
        tabIndex={-1}
        aria-label="Main"
        className="glass-nav room-glass absolute inset-x-3 top-3 z-20 mx-auto flex max-w-6xl items-center gap-3 py-1.5 pl-4 pr-1.5 sm:inset-x-5 sm:top-4 sm:gap-6 sm:py-2 sm:pl-5 sm:pr-2"
      >
        <Link href="/" className="hidden font-display text-xl font-extrabold tracking-tight text-ink min-[420px]:block sm:text-2xl">
          akid
        </Link>
        <ul className="ml-auto flex items-center gap-x-3.5 text-sm font-semibold min-[420px]:gap-x-4 sm:gap-x-5 sm:text-[0.95rem]">
          {NAV_ITEMS.map((item) => (
            <li key={item.section}>
              <Link href={item.roomHref} data-opens={item.opens} className="nav-link text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    );
  }

  // One-page site: a floating frosted-glass bar with the name, the section links and a way back to the room.
  // Resume isn't a section here (it's the Download CV button in the hero).
  return (
    <header className="glass-nav fixed inset-x-3 top-3 z-30 mx-auto max-w-6xl sm:inset-x-5 sm:top-4">
      <nav aria-label="Main" className="flex items-center gap-3 py-2 pl-4 pr-2 sm:gap-6 sm:px-5 sm:py-2.5">
        <Link href="/portfolio#about" className="font-display text-xl font-extrabold tracking-tight text-[var(--navy)] sm:text-2xl">
          akid
        </Link>
        <ul className="ml-auto flex items-center gap-x-4 text-sm font-semibold sm:gap-x-5 sm:text-[0.95rem]">
          {NAV_ITEMS.filter((item) => item.section !== "resume").map((item) => (
            <li key={item.section}>
              <Link href={`/portfolio#${item.section}`} className="nav-link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--sky)] p-2.5 text-sm font-bold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white sm:px-4 sm:py-2"
        >
          <DoorOpen className="h-4 w-4" aria-hidden />
          <span className="sr-only sm:not-sr-only">Back to the room</span>
        </Link>
      </nav>
    </header>
  );
}
