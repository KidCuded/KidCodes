import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import SiteNav from "@/app/components/nav/SiteNav";
import { getAllProjectsData, getProjectData } from "@/app/lib/markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Only the slugs in content/ exist; anything else is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjectsData();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) notFound();

  return (
    <div className="simple-site">
      <SiteNav variant="header" />
      <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-32 sm:px-6">
        <Link href="/portfolio#projects" className="mb-8 inline-block py-1 font-semibold text-[var(--pink)] hover:underline">
          Back to all projects
        </Link>

        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[var(--navy)]">
          {project.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Built with">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full bg-[var(--mist)] px-3 py-1 font-mono text-xs text-[var(--navy)]">
                {t}
              </li>
            ))}
          </ul>
        )}

        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-pink mt-8">
            <ExternalLink className="h-5 w-5" aria-hidden />
            Visit the live site <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}

        <hr className="my-10 border-t-2 border-[var(--line)]" />

        <article className="project-body" dangerouslySetInnerHTML={{ __html: project.contentHtml }} />
      </main>
    </div>
  );
}
