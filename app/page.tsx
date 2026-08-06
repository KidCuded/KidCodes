import Link from 'next/link';
import Image from 'next/image';
import { getAllProjectsData } from '@/app/lib/markdown';

export default async function Home() {
  // Fetch all projects so you can map over them
  const projects = await getAllProjectsData();
  return (
    <main className="max-w-6xl mx-auto font-Plus_Jakarta_Sans text-gray-200">
      
      {/* 1. Hero Section: Introduction */}
      <section id="home" className="flex items-center min-h-screen mb-20 ">
        <div className="max-w-3xl mb-8">
          <h1 className="text-7xl tracking-wide mb-4">
            I'M AKID.
          </h1>
          <h2 className="text-4xl text-black tracking-wider bg-blue-300 justify p-3 mb-6 inline-block">
            SOFTWARE ENGINEER
          </h2>
          <p className="max-w-3xl text-xl text-gray-300 justify leading-relaxed">
            Based in Kuala Lumpur, Malaysia. I build softwares, websites, landing pages, full-stack applications, analyze data, you name it. 
          </p>
        </div>
        <div className="relative w-120 h-120 rounded-tr-full rounded-tl-full overflow-hidden m-10">
          <Image
            src="/images/Akid_RAW.jpg" 
            alt="Akid"
            fill
            className="object-cover"
            priority // Loads the image immediately since it's on the homepage
          />
        </div>
      </section>

      {/* 2. Skills Section: Technical Arsenal */}

      {/* <section id="skills" className="mb-24">
        <h3 className="text-3xl text-blue-300 font-bold mb-6 border-gray-500 border-b pb-4">
          Technical Arsenal</h3>
        <div className="flex flex-wrap gap-3">
          {['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'React', 'Next.js', 'JavaFX'].map((tech) => (
            <span 
              key={tech} 
              className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section> */}

      {/* 3. Featured Work: Highlighting main projects */}
      <section id="featured-work" className="min-h-[80vh] flex flex-col justify-center">
        <h2 className="text-2xl text-blue-300 tracking-wider mb-6">
          FEATURED WORK
        </h2>
        <h3 className="text-4xl text-gray-200 font-bold border-b border-gray-400 pb-8 mb-8">
          Things I've built.
        </h3>
        
        <div className="grid gap-8">
          {projects.map((project) => (
            <div 
              key={project.slug} 
              className="group border border-gray-800 rounded-2xl p-8 hover:shadow-xl hover:border-blue-600 hover:translate-x-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-bold text-blue-300">
                  {project.title}
                </h4>
                <span className="text-sm font-medium text-black bg-blue-400 px-3 py-1 rounded-full">
                  Full-Stack
                </span>
              </div>
              
              <p className="text-white mb-6 text-lg">
                {project.description}
              </p>
              
              <Link 
                href={`/${project.slug}`}
                className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300"
              >
                Read the case study 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </Link>
            </div>
          ))}
        </div>
        
      </section>

      {/* 4. Call to Action: Encouraging users to explore more */}
      <section id="contact" className="min-h-[90vh] flex flex-col items-center justify-center text-white pb-24 font-sans">
  
      <span className="text-blue-300 font-semibold text-xl uppercase tracking-[0.2em] mb-4">
        CONTACT
      </span>

      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-6">
        Let's work together.
      </h2>

      <p className="text-gray-400 text-base md:text-lg text-center max-w-lg mb-10 leading-relaxed font-normal">
        Have a project in mind? I'd love to hear about it — reach out and let's talk.
      </p>

      <a 
        href="mailto:akidsyazwan@gmail.com"
        className="inline-flex items-center justify-center bg-blue-300 hover:bg-[#6366f1] text-[#0a0a0a] font-semibold text-sm md:text-base px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:scale-105"
      >
        akidsyazwan@gmail.com
      </a>

    </section>


    </main>
  );
}