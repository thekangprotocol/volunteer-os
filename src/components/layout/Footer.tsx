import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <footer className={`mt-24 border-t py-14 px-6 transition-colors duration-500 ${
      isDark ? 'border-zinc-900 bg-black text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-600'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}>
            vOS
          </div>
          <div>
            <p className="font-medium tracking-tight text-sm text-current">VolunteerOS Protocol</p>
            <p className="opacity-60 text-[11px]">The Operating System for Human Impact</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] opacity-70">
          <span>Aggregating 1,400+ feeds</span>
          <span>•</span>
          <span>Zero-friction RSVP</span>
          <span>•</span>
          <span>Encrypted Hour Verification</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] opacity-60">
          <Shield className="w-3.5 h-3.5" />
          <span>Non-profit Open Kernel standard</span>
        </div>
      </div>
    </footer>
  );
};
