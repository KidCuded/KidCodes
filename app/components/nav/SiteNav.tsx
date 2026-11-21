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
    return (
      <nav id="main-nav" tabIndex={-1} aria-label="Main" className="absolute right-4 top-4 z-20 flex items-center gap-3 rounded-lg bg-room-wall/80 py-1 pl-4 pr-1.5 backdrop-blur-sm sm:right-6 sm:top-5">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm sm:text-base">
          {NAV_ITEMS.map((item) => (
            <li key={item.section}>
              <Link href={item.roomHref} data-opens={item.opens} className="py-2 text-ink transition-colors hover:text-accent">
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
