import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { 
  Search, 
  Award, 
  LayoutDashboard, 
  Sparkles, 
  Moon, 
  Sun, 
  PlusCircle, 
  Link as LinkIcon, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const CommandMenu: React.FC = () => {
  const { 
    isCommandMenuOpen, 
    setIsCommandMenuOpen, 
    theme, 
    toggleTheme, 
    setActiveTab, 
    setRole,
    opportunities,
    setSelectedOpportunity,
    setIsCreatorModalOpen,
    setIsImportModalOpen,
    setIsAIModalOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const isDark = theme === 'dark';

  if (!isCommandMenuOpen) return null;

  const filteredOpps = query.trim()
    ? opportunities.filter(
        (o) =>
          o.title.toLowerCase().includes(query.toLowerCase()) ||
          o.cause.toLowerCase().includes(query.toLowerCase()) ||
          o.organizer.toLowerCase().includes(query.toLowerCase())
      )
    : opportunities.slice(0, 3);

  const handleSelectOpp = (opp: any) => {
    setSelectedOpportunity(opp);
    setIsCommandMenuOpen(false);
  };

  return (
    <Modal
      isOpen={isCommandMenuOpen}
      onClose={() => setIsCommandMenuOpen(false)}
      maxWidth="max-w-xl"
    >
      <div className="-mt-2">
        {/* Search Input Box */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search opportunities..."
            autoFocus
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-sans focus:outline-none border transition-all ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-600' 
                : 'bg-zinc-100 border-zinc-200 text-black placeholder-zinc-400 focus:border-zinc-400'
            }`}
          />
        </div>

        {/* Quick Command Actions */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 px-2 mb-2">
              System Shortcuts
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => {
                  setActiveTab('explore');
                  setIsCommandMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Compass className="w-4 h-4 opacity-70" />
                  <span>Explore Opportunity Engine</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('passport');
                  setIsCommandMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 opacity-70" />
                  <span>View Verified Volunteer Passport</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => {
                  setRole('organizer');
                  setActiveTab('organizer');
                  setIsCommandMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 opacity-70" />
                  <span>Switch to Organizer Studio</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => {
                  setIsCommandMenuOpen(false);
                  setIsAIModalOpen(true);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 opacity-70" />
                  <span>Run AI Opportunity Neural Match</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => {
                  setIsCommandMenuOpen(false);
                  setIsImportModalOpen(true);
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 opacity-70" />
                  <span>Import Social Event (Instagram / Facebook / URL)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-40" />
              </button>

              <button
                onClick={() => {
                  toggleTheme();
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDark ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
                  <span>Toggle Appearance ({isDark ? 'Switch to Light' : 'Switch to Dark'})</span>
                </div>
                <span className="font-mono text-[10px] opacity-40">THEME</span>
              </button>
            </div>
          </div>

          {/* Results List */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 px-2 mb-2">
              {query ? 'Matching Opportunities' : 'Recent Opportunities'}
            </p>
            <div className="space-y-1">
              {filteredOpps.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => handleSelectOpp(opp)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between border ${
                    isDark 
                      ? 'bg-zinc-900/50 border-zinc-800/60 hover:bg-zinc-900 hover:border-zinc-700' 
                      : 'bg-zinc-50 border-zinc-200/80 hover:bg-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-medium leading-snug">{opp.title}</h4>
                    <p className="text-[11px] opacity-60 font-mono mt-0.5">
                      {opp.organizer} • {opp.cause} • {opp.distance}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-500/20 opacity-70">
                      {opp.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
