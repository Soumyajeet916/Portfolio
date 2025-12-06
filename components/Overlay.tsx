import React from 'react';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contact';
import ThemeToggle from './ThemeToggle';

interface OverlayProps {
    toggleTheme: () => void;
    isDark: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ toggleTheme, isDark }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
       {/* Fixed Theme Toggle Button */}
       <ThemeToggle toggleTheme={toggleTheme} isDark={isDark} />

       {/* Pointer events auto is set on specific interactive children */}
       <div className="pointer-events-auto">
         <Hero />
         <About />
         <Skills />
         <Projects />
         <Contact />
       </div>
    </div>
  );
};