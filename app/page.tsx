import Link from 'next/link';
import Image from 'next/image';
import { getAllProjectsData } from '@/app/lib/markdown';
import { FileText, Mail } from 'lucide-react';

export default async function Home() {
  const projects = await getAllProjectsData();
  
  return (
    // Added horizontal padding (px-6) so content doesn't hug screen edges on mobile
    <main className="bg-black max-w-6xl mx-auto px-6 md:px-12 font-Plus_Jakarta_Sans text-gray-200">
      
      {/* 1. Hero Section: Swapped to flex-col for mobile, flex-row for desktop */}
      <section id="home" className="flex flex-col-reverse md:flex-row items-center justify-center min-h-[90vh] md:min-h-screen mb-20 gap-10 md:gap-4 pt-20 md:pt-0">
        <div className="w-full md:max-w-3xl text-center md:text-left">
          {/* Scaled headers down for mobile, bumped up at 'md' breakpoint */}
          <h1 className="text-5xl md:text-7xl tracking-wide mb-4">
            I'M AKID.
          </h1>
          <h2 className="text-xl md:text-4xl text-black tracking-wider bg-blue-300 p-2 md:p-3 mb-6 inline-block">
            SOFTWARE ENGINEER
          </h2>
          <p className="w-full text-base md:text-xl text-gray-300 leading-relaxed pb-5 md:pb-8 mx-auto md:mx-0 max-w-lg md:max-w-3xl">
            Based in Kuala Lumpur, Malaysia. I build softwares, websites, landing pages, full-stack applications, analyze data, you name it. 
          </p>
          {/* Stack buttons vertically on mobile, horizontally on screens 'sm' and up */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a 
              href="/#contact" 
              className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-300 text-black hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/30 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Contact Me
            </a>
            <a 
            href="/resume.pdf" 
            download="Akid_Resume.pdf"
            className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-4 py-3 border border-blue-300 text-gray-300 hover:text-white hover:border-blue-400 hover:bg-slate-800 font-semibold transition-all duration-300"
            >
              <FileText className="w-5 h-5" />
              Download Resume
            </a>
          </div>
        </div>
        
        {/* Replaced fixed w-120/h-120 with responsive dimensions to prevent overflow */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] rounded-tr-full rounded-tl-full overflow-hidden shrink-0 mt-10 md:mt-0">
          <Image
            src="/images/Akid_RAW.jpg" 
            alt="Akid"
            fill
            className="object-cover"
            priority 
          />
        </div>
      </section>

      {/* 3. Featured Work */}
      <section id="featured-work" className="min-h-[80vh] flex flex-col justify-center py-10">
        <h2 className="text-xl md:text-2xl text-blue-300 tracking-wider mb-4 md:mb-6 text-center md:text-left">
          FEATURED WORK
        </h2>
        <h3 className="text-3xl md:text-4xl text-gray-200 font-bold border-b border-gray-400 pb-6 mb-8 text-center md:text-left">
          Things I've built.
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => (
            <Link 
              href={`/${project.slug}`}
              key={project.slug} 
              className="group block border border-gray-800 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-blue-600 md:hover:translate-x-1 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h4 className="text-xl md:text-2xl font-bold text-blue-300">
                  {project.title}
                </h4>
                <span className="text-xs md:text-sm font-medium text-black bg-blue-400 px-3 py-1 rounded-full whitespace-nowrap">
                  Full-Stack
                </span>
              </div>
              
              <p className="text-gray-300 mb-6 text-base md:text-lg">
                {project.description}
              </p>
              
              <div className="inline-flex items-center text-blue-300 font-semibold text-sm md:text-base">
                Read the case study 
                <span className="ml-2 group-hover:translate-x-1 transition-transform"> &rarr; </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Call to Action */}
      <section id="contact" className="min-h-[80vh] flex flex-col items-center justify-center text-white py-20 font-sans">
        <span className="text-blue-300 font-semibold text-lg md:text-xl uppercase tracking-[0.2em] mb-4">
          CONTACT
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-6">
          Let's work together.
        </h2>

        <p className="text-gray-400 text-sm md:text-lg text-center max-w-xs sm:max-w-md md:max-w-lg mb-10 leading-relaxed font-normal">
          Have a project in mind? I'd love to hear about it — reach out and let's talk.
        </p>

        <a 
          href="mailto:akidsyazwan@gmail.com"
          className="inline-flex items-center justify-center bg-blue-300 hover:bg-[#6366f1] text-[#0a0a0a] font-semibold text-sm md:text-base px-6 py-4 rounded-full transition-all duration-300 shadow-lg md:hover:scale-105"
        >
          akidsyazwan@gmail.com
        </a>
      </section>

    </main>
  );
}