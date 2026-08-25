"use client"; // Required for using React hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls down more than 10 pixels, set isScrolled to true
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Listen to scroll events on the window
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener when component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-md bg-gray/80 border-b-[0.5px] border-gray-500 shadow-sm" // Shown when scrolled
          : "bg-transparent border-b border-transparent" // Blended seamlessly when at top
      }`}
    >
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="group font-extrabold text-2xl tracking-tight text-gray-100 hover:text-blue-600 transition-colors"
        >
          Kid<span className="text-blue-300 group-hover:text-blue-600 transition-colors">Codes</span>
        </Link>
        <div className="flex space-x-8 text-lg font-semibold text-gray-200 ">
          <Link href="/#featured-work" className="hover:text-blue-600 transition-colors">
            Projects
          </Link>
          <Link href="/#contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </div>
        
      </div>
    </header>
  );
}