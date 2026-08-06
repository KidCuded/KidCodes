import Link from 'next/link';
import { getAllProjectsData } from '@/app/lib/markdown';

export default async function ProjectsGallery() {
  // Fetch all the projects we just parsed
  const projects = await getAllProjectsData();

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans text-gray-200">
      <h1 className="text-4xl font-extrabold tracking-tight mb-12">All Projects</h1>
      
      <div className="grid gap-8">
        {projects.map((project) => (
          <div key={project.slug} className="group border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                {project.title}
              </h2>
              <span className="text-sm font-medium text-gray-500">
                {project.date}
              </span>
            </div>
            
            <p className="text-gray-500 mb-6 text-lg">
              {project.description}
            </p>
            
            <Link href={`/kidprojects/${project.slug}`} 
              className="inline-flex items-center text-blue-300 font-semibold hover:text-blue-800"
            >
              Read the case study 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}