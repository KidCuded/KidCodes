import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

type ProjectFrontmatter = {
  title: string;
  date: string;
  description: string;
  slug?: string;
  liveUrl?: string;
  /** Tech used, shown as chips on the project card. */
  tags?: string[];
  /** Shows a "Featured" badge on the card. */
  featured?: boolean;
  /** Cover image for the card, e.g. "/images/projects/kabo.webp". Optional: a drawn cover is used without one. */
  image?: string;
};

export type ProjectSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  liveUrl: string | null;
  tags: string[];
  featured: boolean;
  image: string | null;
};

export type Project = ProjectSummary & { contentHtml: string };

// Project files are content/*.md. The about text lives in content/about/, not here.
function projectFileNames() {
  return fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);
}

function readProjectFile(fileName: string) {
  const fileContents = fs.readFileSync(path.join(contentDirectory, fileName), 'utf8');
  const { data, content } = matter(fileContents);
  const fm = data as ProjectFrontmatter;
  // Slug: the frontmatter `slug` field, falling back to the lowercased filename.
  const slug = (fm.slug ?? fileName.replace(/\.md$/, '')).toLowerCase();
  const summary: ProjectSummary = {
    slug,
    title: fm.title,
    date: fm.date,
    description: fm.description,
    liveUrl: fm.liveUrl ?? null,
    tags: fm.tags ?? [],
    featured: fm.featured ?? false,
    image: fm.image ?? null,
  };
  return { summary, content };
}

/** All projects, newest first. */
export async function getAllProjectsData(): Promise<ProjectSummary[]> {
  return projectFileNames()
    .map((fileName) => readProjectFile(fileName).summary)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** One project by slug, or null if no file has that slug. */
export async function getProjectData(slug: string): Promise<Project | null> {
  const match = projectFileNames()
    .map(readProjectFile)
    .find(({ summary }) => summary.slug === slug.toLowerCase());
  if (!match) return null;

  const processed = await remark().use(html).process(match.content);
  return { ...match.summary, contentHtml: processed.toString() };
}
