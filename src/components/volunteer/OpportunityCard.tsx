import React from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  UserCheck
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onSelect }) => {
  const { theme, toggleSaveOpportunity, applyOpportunity } = useApp();
  const isDark = theme === 'dark';

  const isSaved = opportunity.saved;
  const isApplied = opportunity.applied;
  const spotsLeft = Math.max(0, opportunity.spotsTotal - opportunity.spotsFilled);

  return (
    <div
      className={`group relative rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-zinc-400 dark:hover:border-zinc-700 ${
        isDark
          ? 'bg-zinc-900/80 border-zinc-800/80 text-white backdrop-blur-md'
          : 'bg-white border-zinc-200 text-zinc-950 backdrop-blur-md shadow-sm'
      }`}
    >
      <div>
        {/* Top Header Pill Row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Cause Category Badge */}
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {opportunity.cause}
            </span>

            {/* AI Match Pill */}
            {opportunity.aiMatchScore && opportunity.aiMatchScore >= 90 && (
              <span 
                title={opportunity.aiMatchReason}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{opportunity.aiMatchScore}% MATCH</span>
              </span>
            )}
          </div>

          {/* Bookmark Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveOpportunity(opportunity.id);
            }}
            className={`p-2 rounded-full border transition-all ${
              isSaved
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title={isSaved ? "Saved to Bookmarks" : "Save Opportunity"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Organization Name */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">
          <span>{opportunity.organizer}</span>
          {opportunity.organizerVerified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelect(opportunity)}
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white cursor-pointer group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2"
        >
          {opportunity.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {opportunity.description}
        </p>

        {/* Metadata Grid (Location, Date, Spots Left, Hours, Age, Distance) */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-mono">
          {/* Location & Distance */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-start gap-1.5 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
            <div className="truncate">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block">{opportunity.location}</span>
              <span className="text-[10px] text-zinc-400">{opportunity.distance}</span>
            </div>
          </div>

          {/* Date & Time */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate">{opportunity.date}</span>
          </div>

          {/* Estimated Hours */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{opportunity.durationHours} hrs</span>
          </div>

          {/* Volunteer Spots Left */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{spotsLeft} spots left</span>
          </div>

          {/* Required Age */}
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Age: {opportunity.requiredAge || 'All Ages'}</span>
          </div>
        </div>
      </div>

      {/* One Large Apply Button */}
      <div className="mt-6 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <button
          type="button"
          onClick={() => {
            if (!isApplied) applyOpportunity(opportunity.id);
          }}
          disabled={isApplied}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.98] ${
            isApplied
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
              : isDark
                ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-zinc-950/20'
                : 'bg-zinc-950 text-white hover:bg-zinc-800'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Applied & Shift Registered</span>
            </>
          ) : (
            <>
              <span>Apply Now ({opportunity.durationHours} hrs)</span>
              <ArrowUpRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
