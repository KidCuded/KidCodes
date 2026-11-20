import SiteNav from "@/app/components/nav/SiteNav";
import Wall from "@/app/components/wall/Wall";
import LabelsIntro from "@/app/components/wall/LabelsIntro";
import RoomProvider from "@/app/components/wall/RoomProvider";
import { getAllProjectsData } from "@/app/lib/markdown";
import { getAboutParagraphs } from "@/app/lib/about";

// The room: every object is a real link (step c); RoomProvider opens the
// in-room views for the resume, envelope, person and computer (step e). The H1 and intro text are
// visually hidden but in the HTML for search engines and screen readers; the
// books, the "All projects" sign and the nav are the project links.
export default async function Home() {
  const projects = await getAllProjectsData();
  const about = getAboutParagraphs();
  const shelfProjects = projects.map((p) => {
    const name = p.title.split(":")[0].trim();
    return { slug: p.slug, name, label: name.toUpperCase() };
  });

  return (
    <main id="room" className="relative h-dvh w-full overflow-hidden">
      <div className="sr-only">
        <h1>Akid — Software Engineer in Kuala Lumpur</h1>
        {about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <RoomProvider about={about}>
        {/* Nav first in the DOM so it's first in tab order; positioned in the corner. */}
        <SiteNav variant="corner" />
        <Wall projects={shelfProjects} />
      </RoomProvider>
      <LabelsIntro targetId="room" />
    </main>
  );
}
