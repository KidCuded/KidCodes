import Link from "next/link";
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
  const links = (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm sm:text-base">
      {NAV_ITEMS.map((item) => (
        <li key={item.section}>
          <Link
            href={variant === "corner" ? item.roomHref : `/portfolio#${item.section}`}
            data-opens={variant === "corner" ? item.opens : undefined}
            className="py-2 text-ink transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (variant === "corner") {
    return (
      <nav id="main-nav" tabIndex={-1} aria-label="Main" className="absolute right-4 top-4 z-20 flex items-center gap-3 rounded-lg bg-room-wall/80 py-1 pl-4 pr-1.5 backdrop-blur-sm sm:right-6 sm:top-5">
        {links}
        <ThemeToggle />
      </nav>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-room-wall/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="py-2 font-semibold text-accent hover:underline">
          ← Back to room
        </Link>
        {links}
      </nav>
    </header>
  );
}
