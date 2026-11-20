import type { Metadata } from "next";
import SiteNav from "@/app/components/nav/SiteNav";
import AboutContent from "@/app/components/content/AboutContent";
import ContactCard from "@/app/components/content/ContactCard";
import ResumeView from "@/app/components/content/ResumeView";
import ProjectCard from "@/app/components/content/ProjectCard";
import { getAboutParagraphs } from "@/app/lib/about";
import { getAllProjectsData } from "@/app/lib/markdown";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Akid, Software Engineer in Kuala Lumpur: about, projects, resume and contact, on one page.",
};

/**
 * The simple version of the site: one scrolling page with every section. The
 * nav at the top jumps to each section (#about, #projects, #resume, #contact).
 * /about, /projects, /resume and /contact redirect here (next.config.ts).
 */
export default async function PortfolioPage() {
  const projects = await getAllProjectsData();
  const about = getAboutParagraphs();

  return (
    <>
      <SiteNav variant="header" />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <section id="about" className="page-section py-16">
          <p className="mb-2 font-mono text-sm text-accent">Software Engineer · Kuala Lumpur</p>
          <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-white md:text-5xl">Hi, I&apos;m Akid.</h1>
          <AboutContent paragraphs={about} variant="page" />
        </section>

        <section id="projects" className="page-section border-t border-white/10 py-16">
          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white">Projects</h2>
          <p className="mb-10 text-ink-muted">Things I&apos;ve built.</p>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.slug}>
                <ProjectCard project={project} index={i} />
              </li>
            ))}
          </ul>
        </section>

        <section id="resume" className="page-section border-t border-white/10 py-16">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white">Resume</h2>
          <div className="flex flex-col items-center">
            <ResumeView />
          </div>
        </section>

        <section id="contact" className="page-section border-t border-white/10 py-16">
          <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-white">Contact</h2>
          <div className="flex flex-col items-center">
            <ContactCard />
          </div>
        </section>
      </main>
    </>
  );
}
