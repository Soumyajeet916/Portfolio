import React, { useRef, useState } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    // Simulate email sending
    setTimeout(() => {
        setStatus('Message Sent! I will get back to you soon.');
        if(form.current) form.current.reset();
    }, 1500);
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative py-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-5xl font-bold mb-8 text-slate-900 dark:text-white transition-colors">Let's Connect</h2>
        
        <div className="glass-panel p-8 rounded-3xl mb-12 transition-colors">
          <form ref={form} onSubmit={sendEmail} className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Name</label>
              <input type="text" required className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Email</label>
              <input type="email" required className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Message</label>
              <textarea rows={4} required className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-bold text-white hover:opacity-90 transition shadow-lg">
              Send Message
            </button>
            {status && <p className="text-center text-green-500 dark:text-green-400 mt-2">{status}</p>}
          </form>
        </div>

        <div className="flex justify-center gap-8">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:scale-125 transition-all"><Github size={32} /></a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 transition-all"><Linkedin size={32} /></a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-sky-400 hover:scale-125 transition-all" aria-label="X (Twitter)">
            <Twitter size={32} />
          </a>
          <a href={SOCIAL_LINKS.email} className="text-slate-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-125 transition-all"><Mail size={32} /></a>
        </div>
        
        <footer className="mt-20 text-slate-500 dark:text-gray-600 text-sm">
          © {new Date().getFullYear()} Soumyajeet Das. All rights reserved.
        </footer>
      </div>
    </section>
  );
};

export default Contact;
