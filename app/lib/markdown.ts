import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export async function getProjectData(slug: string) {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Parse the frontmatter
  const matterResult = matter(fileContents);
  
  // Convert markdown to HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
    
  return {
    slug,
    contentHtml: processedContent.toString(),
    // Add the type assertion below to tell TypeScript what fields exist
    ...(matterResult.data as { title: string; date: string; description: string }),
  };
}

export async function getAllProjectsData() {
  // Read all file names in the content directory
  const fileNames = fs.readdirSync(contentDirectory);

  const allProjectsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id (slug)
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      slug,
      ...(matterResult.data as { title: string; date: string; description: string }),
    };
  });

  // Sort projects by date
  return allProjectsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}