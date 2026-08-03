import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`relative inline-flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
        isDark 
          ? 'bg-zinc-800/90 border border-zinc-700/60 shadow-inner' 
          : 'bg-zinc-200 border border-zinc-300 shadow-inner'
      }`}
    >
      <span className="sr-only">Toggle Dark and Light Mode</span>
      
      {/* Sliding Knob */}
      <span
        className={`pointer-events-none flex h-7 w-7 transform items-center justify-center rounded-full shadow-md transition-transform duration-500 ease-out ${
          isDark 
            ? 'translate-x-7 bg-zinc-950 text-zinc-100 border border-zinc-700' 
            : 'translate-x-0 bg-white text-zinc-900 border border-zinc-200'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 transition-transform duration-500 rotate-0" />
        ) : (
          <Sun className="h-4 w-4 transition-transform duration-500 rotate-0" />
        )}
      </span>
    </button>
  );
};
