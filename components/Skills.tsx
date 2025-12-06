import React from 'react';
import { SKILLS } from '../constants';

const Skills: React.FC = () => (
  <section className="min-h-screen w-full flex items-center justify-center relative py-20">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <h2 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white transition-colors duration-300">Technical Skills</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SKILLS.map((skill, index) => (
          <div key={index} className="glass-panel p-6 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all group">
            <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{skill.name}</h3>
            <span className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-wider">{skill.category}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
