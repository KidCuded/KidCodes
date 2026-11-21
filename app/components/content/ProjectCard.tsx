import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import type { ProjectSummary } from "@/app/lib/markdown";

/** "KABO: Customer Loyalty & Review Platform" → ["KABO", "Customer Loyalty & Review Platform"] */
function splitTitle(title: string): [string, string] {
  const i = title.indexOf(":");
  return i === -1 ? [title, ""] : [title.slice(0, i).trim(), title.slice(i + 1).trim()];
}

/** A drawn cover for projects without a screenshot: a little white browser window on a sky backdrop. */
function DrawnCover({ name, tagline }: { name: string; tagline: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--sky)]">
      <div className="relative mt-6 w-[78%] rounded-xl border-2 border-[var(--navy)] bg-white">
        <div className="flex items-center gap-1.5 border-b-2 border-[var(--navy)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[var(--pink)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--sky)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--line)]" />
        </div>
        <div className="px-4 py-4">
          <p className="font-display text-2xl font-extrabold tracking-tight text-[var(--navy)]">{name}</p>
          {tagline && <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{tagline}</p>}
        </div>
      </div>
    </div>
  );
}

/**
 * A project card: cover (screenshot or drawn), optional "Featured" badge,
 * name, description, tech tags, and Live / Details links. Styled for the
 * one-page site (.simple-site tokens).
 */
export default function ProjectCard({ project }: { project: ProjectSummary; index?: number }) {
  const [name, tagline] = splitTitle(project.title);
  const details = `/projects/${project.slug}`;

  return (
    <article className="project-card flex h-full flex-col overflow-hidden rounded-[1.25rem] border-2 border-[var(--line)] bg-white">
      <Link href={details} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden border-b-2 border-[var(--line)]">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            // The cover crops wide screenshots to 16:10, which scales them up to
            // about 2x the card's width, so ask for an image that big (or it's blurry).
            sizes="(max-width: 640px) 200vw, (max-width: 1024px) 100vw, 800px"
            quality={90}
            className="object-cover"
          />
        ) : (
          <DrawnCover name={name} tagline={tagline} />
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--pink)] px-3 py-1 text-xs font-bold text-white">Featured</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-extrabold tracking-tight text-[var(--navy)]">{name}</h3>
        <p className="mt-2 leading-relaxed text-[var(--muted)]">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full bg-[var(--mist)] px-3 py-1 font-mono text-xs text-[var(--navy)]">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between border-t-2 border-[var(--line)] pt-4 text-sm font-semibold">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="card-link">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Live <span className="sr-only">site for {name} (opens in a new tab)</span>
              </a>
            ) : (
              <span />
            )}
            <Link href={details} className="card-link">
              <Info className="h-4 w-4" aria-hidden />
              Details <span className="sr-only">about {name}</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
