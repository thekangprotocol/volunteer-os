import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';

interface MapViewProps {
  opportunities: Opportunity[];
  onSelect: (opp: Opportunity) => void;
}

export const MapView: React.FC<MapViewProps> = ({ opportunities, onSelect }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [activePinId, setActivePinId] = useState<string | null>(opportunities[0]?.id || null);

  const activeOpp = opportunities.find((o) => o.id === activePinId) || opportunities[0];

  return (
    <div className={`relative w-full h-[520px] rounded-3xl overflow-hidden border shadow-2xl transition-colors duration-500 ${
      isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
    }`}>
      {/* Simulated Map Canvas Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: isDark 
            ? 'radial-gradient(#52525b 1px, transparent 1px), radial-gradient(#3f3f46 1px, #09090b 1px)' 
            : 'radial-gradient(#a1a1aa 1px, transparent 1px), radial-gradient(#d4d4d8 1px, #f4f4f5 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      />

      {/* Simulated Roads / Rivers lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none stroke-current" strokeWidth="2" fill="none">
        <path d="M 0 100 Q 250 180 500 120 T 1000 300" strokeDasharray="6 6" />
        <path d="M 150 0 Q 200 300 450 600" />
        <path d="M 600 0 Q 550 250 800 600" />
        <circle cx="350" cy="220" r="80" strokeDasharray="4 4" />
      </svg>

      {/* Map Control Bar Top Left */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono backdrop-blur-md shadow-lg ${
          isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white/80 border-zinc-200 text-zinc-700'
        }`}>
          <Navigation className="w-3.5 h-3.5" />
          <span>Metro District Grid • {opportunities.length} Live Pins</span>
        </div>
      </div>

      {/* Pins Rendered on Map */}
      <div className="absolute inset-0 p-12 flex items-center justify-around flex-wrap">
        {opportunities.map((opp, idx) => {
          const isActive = opp.id === activePinId;
          // Position simulation offsets
          const positions = [
            { top: '25%', left: '20%' },
            { top: '35%', left: '60%' },
            { top: '65%', left: '30%' },
            { top: '55%', left: '75%' },
            { top: '75%', left: '50%' },
            { top: '30%', left: '40%' }
          ];
          const pos = positions[idx % positions.length];

          return (
            <div
              key={opp.id}
              onClick={() => setActivePinId(opp.id)}
              style={{ position: 'absolute', top: pos.top, left: pos.left }}
              className="z-20 cursor-pointer group -translate-x-1/2 -translate-y-1/2"
            >
              <div className={`relative flex items-center justify-center p-2 rounded-full border transition-all duration-300 ${
                isActive 
                  ? isDark 
                    ? 'bg-white text-black border-white scale-125 shadow-glow-white z-30' 
                    : 'bg-black text-white border-black scale-125 shadow-glow-dark z-30'
                  : isDark
                    ? 'bg-zinc-900 text-white border-zinc-700 hover:scale-110'
                    : 'bg-white text-black border-zinc-300 hover:scale-110'
              }`}>
                <MapPin className="w-4 h-4" />
                <span className="sr-only">{opp.title}</span>
              </div>
              
              {/* Pin Tooltip label */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border pointer-events-none transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'
              }`}>
                {opp.title.substring(0, 24)}...
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Opportunity Floating Card Bottom Right */}
      {activeOpp && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-30 animate-fade-in">
          <div className={`p-5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
            isDark ? 'bg-zinc-900/90 border-zinc-800 text-white' : 'bg-white/90 border-zinc-200 text-black'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono opacity-60 mb-1">
              <span>{activeOpp.distance}</span>
              <span>{activeOpp.cause}</span>
            </div>
            <h4 className="font-light text-base leading-snug">{activeOpp.title}</h4>
            <p className="text-xs opacity-70 mt-1">{activeOpp.organizer} • {activeOpp.date}</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-mono opacity-80">
                {activeOpp.spotsTotal - activeOpp.spotsFilled} spots remaining
              </span>
              <button
                onClick={() => onSelect(activeOpp)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isDark 
                    ? 'bg-white text-black hover:bg-zinc-200' 
                    : 'bg-black text-white hover:bg-zinc-800'
                }`}
              >
                Inspect & RSVP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
