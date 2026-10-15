import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getProjectData } from '@/app/lib/markdown'; // Adjust path if needed depending on where /lib is relative to app/

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  // Await the dynamic parameters (Next.js App Router standard)
  const { slug } = await params;

  try {
    // Fetch the specific markdown data for this slug
    const project = await getProjectData(slug);

    return (
      <main className="max-w-3xl mx-auto px-6 py-16 font-sans text-gray-200">
        {/* Back button or breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          &larr; Back to home
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-gray-400">{project.date}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-2 mb-4 text-white">
            {project.title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        <hr className="border-gray-800 mb-10" />

        {/* Rendered Markdown Body Content */}
        <article 
          className="prose prose-invert max-w-none prose-blue leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: project.contentHtml }} 
        />

        {/* Project Site button, Render the button ONLY if liveUrl exists in the markdown */}
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 mt-4 bg-blue-300 text-black hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/30 transition-all duration-300"
          >
            <ExternalLink className="w-5 h-5" />
            To KABO
          </a>
        )}
      </main>
    );
  } catch (error) {
    // If the markdown file doesn't exist for this slug, trigger a 404 page
    notFound();
  }
}