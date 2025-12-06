import React from 'react';
import { ArrowDown, Download } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { SOCIAL_LINKS } from '../constants'
const Hero: React.FC = () => (
  <section className="h-screen w-full flex flex-col justify-center items-center relative pointer-events-none">
    <div className="text-center z-10 pointer-events-auto px-4">
      <h2 className="text-lg md:text-2xl text-blue-500 font-semibold tracking-widest mb-4">
  <Typewriter
    options={{
      strings: ["HELLO WORLD !!", "WELCOME !!", "MERN DEVELOPER","PASSIONATE CODER"],
      autoStart: true,
      loop: true,
      deleteSpeed: 30
    }}
  />
</h2>
      <h1 className="text-5xl md:text-8xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tighter drop-shadow-sm dark:drop-shadow-lg transition-colors duration-300">
        SOUMYAJEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400">DAS</span>
      </h1>
      <p className="text-slate-600 dark:text-gray-200 text-lg md:text-xl max-w-lg mx-auto mb-8 font-medium transition-colors duration-300">
        Full Stack Developer creating engaging interfaces and architecting performant, scalable systems.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
          View Work
        </button>
        <a href={SOCIAL_LINKS.cv} download className="px-8 py-3 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-full font-bold transition-all flex items-center justify-center gap-2">
          <Download size={18} /> Resume
        </a>
      </div>
    </div>
    <div className="absolute bottom-10 animate-bounce text-slate-400 dark:text-white/50">
      <ArrowDown size={32} />
    </div>
  </section>
);

export default Hero;
