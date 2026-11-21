import type { NextConfig } from "next";

// Old URLs from the previous site. This is an explicit list on purpose: a
// catch-all "/:slug" rule would also swallow /about, /resume, /contact,
// /projects and /portfolio. Only these three projects ever had root-level URLs.
const oldProjectUrls: Record<string, string> = {
  "/KABO": "/projects/kabo",
  "/kabo": "/projects/kabo",
  "/Bartr": "/projects/bartr",
  "/bartr": "/projects/bartr",
  "/BARTR": "/projects/bartr",
  "/POS": "/projects/kidpos",
  "/pos": "/projects/kidpos",
  "/kidpos": "/projects/kidpos",
  "/KIDPOS": "/projects/kidpos",
};

const nextConfig: NextConfig = {
  images: {
    // 90 is used for the project card covers (screenshots look soft at the default 75).
    qualities: [75, 90],
  },
  async redirects() {
    return [
      ...Object.entries(oldProjectUrls).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      { source: "/kidprojects", destination: "/portfolio#projects", permanent: true },
      { source: "/kidprojects/:path*", destination: "/portfolio#projects", permanent: true },
      // The old single pages are now sections of the one-page site. Not permanent,
      // so they can become pages again later. (In the room, About / Resume /
      // Contact open in-room views; these are their no-JavaScript fallbacks.)
      { source: "/about", destination: "/portfolio#about", permanent: false },
      { source: "/projects", destination: "/portfolio#projects", permanent: false },
      { source: "/resume", destination: "/resume.pdf", permanent: false },
      { source: "/contact", destination: "/portfolio#contact", permanent: false },
    ];
  },
};

export default nextConfig;
