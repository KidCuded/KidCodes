import fs from 'fs';
import path from 'path';

/** Paragraphs of content/about/intro.md (HTML comments removed). */
export function getAboutParagraphs(): string[] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'content', 'about', 'intro.md'), 'utf8');
  return raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
