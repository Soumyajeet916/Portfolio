import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => (
  <section id="projects" className="min-h-screen w-full flex items-center relative py-20">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="order-2 md:order-1 grid grid-cols-1 gap-8">
        {PROJECTS.map((project) => (
          <div key={project.id} className="glass-panel p-6 rounded-2xl hover:translate-x-2 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
               <div className="flex gap-2">
                 <a href={project.github} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition text-slate-700 dark:text-white"><Github size={20} /></a>
                 <a href={project.link} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition text-slate-700 dark:text-white"><ExternalLink size={20} /></a>
               </div>
            </div>
            <p className="text-slate-600 dark:text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-500/30 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="order-1 md:order-2"></div> {/* Space for 3D Character (Right aligned) */}
    </div>
  </section>
);

export default Projects;
