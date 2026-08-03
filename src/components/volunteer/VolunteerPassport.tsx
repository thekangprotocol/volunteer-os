import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Clock, 
  Download, 
  Share2, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  QrCode,
  FileCheck
} from 'lucide-react';

export const VolunteerPassport: React.FC = () => {
  const { passport, theme, showToast } = useApp();
  const isDark = theme === 'dark';
  const [downloading, setDownloading] = useState(false);

  const handleExportPDF = () => {
    setDownloading(true);
    showToast('Generating cryptographically signed Impact Certificate...');
    setTimeout(() => {
      setDownloading(false);
      showToast('Downloaded "VolunteerOS_Impact_Passport_ZTaylor.pdf".');
    }, 1800);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Passport Hero Header */}
      <div className={`p-8 md:p-10 rounded-4xl border relative overflow-hidden transition-all duration-500 ${
        isDark ? 'glass-card-dark border-zinc-800' : 'glass-card-light border-zinc-200'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-60 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Verified Impact Protocol</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight">{passport.name}</h1>
            <p className="text-sm font-mono opacity-60 mt-1">{passport.handle} • Member since {passport.joinDate}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              disabled={downloading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border transition-all ${
                isDark 
                  ? 'bg-white text-black hover:bg-zinc-200 border-white' 
                  : 'bg-black text-white hover:bg-zinc-800 border-black'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Exporting...' : 'Export Verified PDF'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-500/10">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100/70 border-zinc-200'}`}>
            <p className="text-xs font-mono opacity-50 uppercase">VERIFIED HOURS</p>
            <p className="text-3xl md:text-4xl font-light tracking-tight mt-1">{passport.totalHours} hrs</p>
            <p className="text-[11px] opacity-60 font-mono mt-1">+12.5 hrs this month</p>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100/70 border-zinc-200'}`}>
            <p className="text-xs font-mono opacity-50 uppercase">IMPACT SCORE</p>
            <p className="text-3xl md:text-4xl font-light tracking-tight mt-1">{passport.impactScore}</p>
            <p className="text-[11px] opacity-60 font-mono mt-1">Top 2% Regional Rank</p>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100/70 border-zinc-200'}`}>
            <p className="text-xs font-mono opacity-50 uppercase">COMPLETED INITIATIVES</p>
            <p className="text-3xl md:text-4xl font-light tracking-tight mt-1">{passport.eventsCompleted}</p>
            <p className="text-[11px] opacity-60 font-mono mt-1">Across 6 Non-Profits</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-light tracking-tight">Earned Impact Credentials</h2>
          <span className="text-xs font-mono opacity-50">{passport.badges.length} Verified Badges</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {passport.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all hover:-translate-y-1 ${
                isDark 
                  ? 'glass-card-dark border-zinc-800 hover:border-zinc-700' 
                  : 'glass-card-light border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 border ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-200 border-zinc-300 text-black'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-light tracking-tight leading-snug">{badge.title}</h3>
              <p className="text-xs font-mono opacity-50 mt-1">{badge.category}</p>
              <p className="text-xs opacity-70 mt-3 font-light leading-relaxed">{badge.description}</p>
              <div className="mt-4 pt-3 border-t border-zinc-500/10 flex items-center justify-between text-[11px] font-mono opacity-60">
                <span>{badge.hoursRequired} hrs req</span>
                <span>Earned {badge.dateEarned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Hours Timeline */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-light tracking-tight">Verified Activity Ledger</h2>
          <span className="text-xs font-mono opacity-50">Immutable Records</span>
        </div>

        <div className={`rounded-3xl border overflow-hidden ${
          isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="divide-y divide-zinc-500/10">
            {passport.recentActivities.map((act) => (
              <div key={act.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-500/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                  }`}>
                    <FileCheck className="w-4 h-4 opacity-70" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{act.opportunityTitle}</h4>
                    <p className="text-xs opacity-60 font-mono mt-0.5">{act.organizer} • {act.dateCompleted}</p>
                    <p className="text-[10px] font-mono opacity-40 mt-1">HASH: {act.verificationHash}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:self-center self-end">
                  <span className="text-xs font-mono font-medium px-3 py-1 rounded-full border border-zinc-500/20">
                    +{act.hours} Hours
                  </span>
                  <button 
                    onClick={() => showToast(`Verified record ${act.verificationHash} confirmed on VolunteerOS chain.`)}
                    className="p-1.5 rounded-full hover:bg-zinc-500/10 text-xs font-mono opacity-60 hover:opacity-100"
                    title="Inspect Proof Hash"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
