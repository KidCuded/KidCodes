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
    <>
      <SiteNav variant="header" />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/portfolio#projects" className="mb-8 inline-block py-1 text-sm font-medium text-accent hover:underline">
          ← All projects
        </Link>

        <span className="block text-sm font-semibold text-ink-muted">{project.date}</span>
        <h1 className="mb-4 mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">{project.title}</h1>
        <p className="mb-8 text-lg leading-relaxed text-ink-muted">{project.description}</p>

        <hr className="mb-10 border-white/10" />

        <article className="project-body" dangerouslySetInnerHTML={{ __html: project.contentHtml }} />

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-bold text-room-wall transition-colors hover:bg-white"
          >
            <ExternalLink className="h-5 w-5" aria-hidden />
            Visit the live site <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </main>
    </>
  );
}
