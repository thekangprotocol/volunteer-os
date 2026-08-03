import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, theme } = useApp();
  const isDark = theme === 'dark';

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none px-4">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-full text-xs font-medium tracking-wide shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          isDark
            ? 'bg-zinc-900/90 text-white border border-zinc-700/80 shadow-black'
            : 'bg-zinc-900 text-white border border-zinc-800 shadow-zinc-400/20'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
