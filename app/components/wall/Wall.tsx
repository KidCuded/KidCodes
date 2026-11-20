import WallScene from "./WallScene";
import Parallax from "./Parallax";
import { desktopLayout, portraitLayout } from "./layouts";
import type { ShelfProject } from "./art/Shelf";

/**
 * The one-wall room. Renders BOTH layouts on the server; CSS shows one by
 * aspect ratio (.room-desktop / .room-portrait), so there's no wrong-layout
 * flash before hydration.
 */
export default function Wall({ projects }: { projects: ShelfProject[] }) {
  return (
    <Parallax>
      <WallScene layout={desktopLayout} projects={projects} className="room-desktop h-full w-full" />
      <WallScene layout={portraitLayout} projects={projects} className="room-portrait h-full w-full" />
    </Parallax>
  );
}
