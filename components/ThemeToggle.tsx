import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme, isDark }) => (
  <div className="fixed top-6 right-6 z-50 pointer-events-auto">
    <button 
      onClick={toggleTheme}
      className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-yellow-400 transition-all hover:scale-110"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  </div>
);

export default ThemeToggle;
