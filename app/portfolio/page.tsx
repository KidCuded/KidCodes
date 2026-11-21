import type { Metadata } from "next";
import Image from "next/image";
import { Download, Mail } from "lucide-react";
import SiteNav from "@/app/components/nav/SiteNav";
import ContactCard from "@/app/components/content/ContactCard";
import ProjectCard from "@/app/components/content/ProjectCard";
import Stipple from "@/app/components/content/Stipple";
import { getAboutParagraphs } from "@/app/lib/about";
import { getAllProjectsData } from "@/app/lib/markdown";
import { CONTACT } from "@/app/lib/contact";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Akid, Software Engineer in Kuala Lumpur: about, projects, resume and contact, on one page.",
};

/**
 * A stippled edge where two sections meet: dots of the next section's colour
 * that start sparse and pack together until they're solid.
 */
function StippleEdge({ id, color, at }: { id: string; color: string; at: "bottom" | "top" }) {
  return (
    <Stipple
      id={id}
      color={color}
      solid={at === "bottom" ? "down" : "up"}
      className={`pointer-events-none absolute inset-x-0 h-40 sm:h-52 ${at === "bottom" ? "bottom-0" : "top-0"}`}
    />
  );
}

/**
 * The simple version of the site: one scrolling page. The nav jumps to each
 * section (#about, #projects, #contact). /about, /projects and /contact
 * redirect here, and /resume to the PDF (next.config.ts).
 */
export default async function PortfolioPage() {
  const projects = await getAllProjectsData();
  const about = getAboutParagraphs();

  return (
    <div className="simple-site">
      <SiteNav variant="header" />
      <main>
        {/* About: the hero, on a plain sky */}
        <section id="about" className="page-section relative isolate flex min-h-svh items-center overflow-hidden bg-[var(--sky)]">
          {/* Sky blue, dissolving into the white Projects section */}
          <StippleEdge id="edge-hero" color="#ffffff" at="bottom" />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-44 pt-28 sm:px-6 sm:pb-52 md:grid-cols-[1.25fr_1fr] md:pb-20">
            <div>
              <h1 className="font-[family-name:var(--font-geist)] text-[clamp(3.25rem,9vw,6.75rem)] font-bold leading-[0.95] tracking-[-0.045em] text-[var(--navy)]">
                Hi, I&apos;m <span className="text-[var(--pink)]">Akid</span>.
              </h1>
              <div className="mt-8 max-w-[34rem] space-y-4 text-lg leading-relaxed text-[var(--navy)] md:text-xl">
                {about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projects" className="btn-pink">
                  See my projects
                </a>
                <a href={`mailto:${CONTACT.email}`} className="btn-white">
                  <Mail className="h-5 w-5" aria-hidden />
                  Email me
                </a>
                <a href="/resume.pdf" download="Akid_Resume.pdf" className="btn-white">
                  <Download className="h-5 w-5" aria-hidden />
                  Download CV
                </a>
              </div>
            </div>

            {/* Photo in an arched window, like the one in the room */}
            <div className="relative mx-auto w-full max-w-[22rem]">
              <div className="arch-window">
                <Image
                  src="/images/Akid_RAW.jpg"
                  alt="Photo of Akid"
                  width={1080}
                  height={1920}
                  sizes="(max-width: 768px) 80vw, 352px"
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <span className="kl-sticker">Kuala Lumpur</span>
            </div>
          </div>
        </section>

        <section id="projects" className="page-section bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="section-title">Projects</h2>
            <p className="mt-3 max-w-xl text-lg text-[var(--muted)]">Things I&apos;ve built, from loyalty apps to an online store.</p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <li key={project.slug}>
                  <ProjectCard project={project} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="page-section relative isolate bg-[var(--sky)]">
          {/* White from Projects, dissolving into the sky */}
          <StippleEdge id="edge-contact" color="#ffffff" at="top" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 relative px-4 pb-20 pt-44 sm:px-6 sm:pt-52 md:grid-cols-2">
            <div>
              <h2 className="section-title">Contact</h2>
              <p className="mt-4 max-w-md text-lg text-[var(--navy)]">
                Have a project, a role or a question? Send me an email or find me on LinkedIn.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <ContactCard />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
