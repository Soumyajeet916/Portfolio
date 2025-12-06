import React from 'react';

const About: React.FC = () => (
  <section className="min-h-screen w-full flex items-center relative py-20">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="hidden md:block"></div> {/* Space for 3D Character (Left aligned) */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl border-l-4 border-blue-500 transition-colors duration-300">
        <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">About Me</h2>
        <p className="text-slate-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
          I'm a passionate developer with a knack for building immersive and scalable web experiences.
Currently specializing in the MERN Stack, React, and Tailwind, I love transforming ideas into fast, elegant interfaces.
Beyond web development, I explore deep learning, agentic AI systems, and IoT integrations—blending intelligence with real-world applications.
I believe code is an art form, the browser is my canvas, and great products are crafted with intention.
        </p>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Fresher</h3>
  <p className="text-sm text-slate-500 dark:text-gray-400">Experience</p>
</div>

<div>
  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Seeking Opportunities</h3>
  <p className="text-sm text-slate-500 dark:text-gray-400">Actively looking for a developer role</p>
</div>

        </div>
      </div>
    </div>
  </section>
);

export default About;
