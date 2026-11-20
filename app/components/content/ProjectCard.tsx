import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import type { ProjectSummary } from "@/app/lib/markdown";

// Cover colours for projects without a screenshot (same family as the books on the shelf).
const COVERS = ["#5b8def", "#e0a84f", "#5fb39a", "#d0687a", "#9b7be0"];

/** "KABO: Customer Loyalty & Review Platform" → ["KABO", "Customer Loyalty & Review Platform"] */
function splitTitle(title: string): [string, string] {
  const i = title.indexOf(":");
  return i === -1 ? [title, ""] : [title.slice(0, i).trim(), title.slice(i + 1).trim()];
}

/** A drawn cover: a little browser window with the project's name, on a tinted dotted backdrop. */
function DrawnCover({ name, tagline, color }: { name: string; tagline: string; color: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 85% 0%, ${color}55, transparent 60%), radial-gradient(90% 80% at 0% 100%, ${color}33, transparent 60%), #0d1626`,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
      />
      <div className="relative mt-6 w-[78%] rounded-xl border border-white/15 bg-[#0b1220]/90 shadow-2xl shadow-black/40 transition-transform duration-300 group-hover:-translate-y-1">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#f87171]" />
          <span className="h-2 w-2 rounded-full bg-[#fbbf24]" />
          <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
        </div>
        <div className="px-4 py-5">
          <p className="font-mono text-xs" style={{ color }}>
            ~/{name.toLowerCase()}
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">{name}</p>
          {tagline && <p className="mt-1 line-clamp-1 text-sm text-ink-muted">{tagline}</p>}
          <div className="mt-4 flex gap-2">
            <span className="h-2 w-16 rounded-full" style={{ background: color }} />
            <span className="h-2 w-10 rounded-full bg-white/15" />
            <span className="h-2 w-6 rounded-full bg-white/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A project card: cover (screenshot or drawn), optional "Featured" badge,
 * name, description, tech tags, and Live / Details links.
 */
export default function ProjectCard({ project, index }: { project: ProjectSummary; index: number }) {
  const [name, tagline] = splitTitle(project.title);
  const color = COVERS[index % COVERS.length];
  const details = `/projects/${project.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-xl hover:shadow-black/40">
      <Link href={details} tabIndex={-1} aria-hidden className="relative block aspect-[16/10] overflow-hidden border-b border-white/10">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            // The cover crops wide screenshots to 16:10, which scales them up to
            // about 2x the card's width, so ask for an image that big (or it's blurry).
            sizes="(max-width: 640px) 200vw, (max-width: 1024px) 100vw, 800px"
            quality={90}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <DrawnCover name={name} tagline={tagline} color={color} />
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-md border border-emerald-400/50 bg-black/60 px-2.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="mt-3 leading-relaxed text-ink-muted">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-1 text-ink-muted transition-colors hover:text-white"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Live <span className="sr-only">site for {name} (opens in a new tab)</span>
            </a>
          ) : (
            <span />
          )}
          <Link href={details} className="inline-flex items-center gap-2 py-1 text-ink-muted transition-colors hover:text-white">
            <Info className="h-4 w-4" aria-hidden />
            Details <span className="sr-only">about {name}</span>
          </Link>
        </div>
        </div>
      </div>
    </article>
  );
}
