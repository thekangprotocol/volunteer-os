import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button, Badge, Avatar, ProgressBar } from '../common/UIComponents';
import { OpportunityCard } from './OpportunityCard';
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Check, 
  Sparkles,
  Award,
  UserCheck,
  Briefcase,
  ShoppingBag,
  Mail,
  Phone,
  ArrowUpRight,
  ChevronRight,
  Compass
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
}) => {
  const { opportunities, theme, applyOpportunity, setSelectedOpportunity, showToast } = useApp();
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(
    opportunity?.shifts[0]?.id || null
  );
  const [copied, setCopied] = useState(false);

  if (!opportunity) return null;

  const isDark = theme === 'dark';
  const isApplied = opportunity.applied;
  const spotsLeft = Math.max(0, opportunity.spotsTotal - opportunity.spotsFilled);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    showToast('Copied event link to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  // Find similar opportunities based on cause or venue
  const similarOpportunities = opportunities
    .filter((o) => o.id !== opportunity.id && (o.cause === opportunity.cause || o.venueType === opportunity.venueType))
    .slice(0, 2);

  const heroBanner = opportunity.bannerImage || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200';

  return (
    <Modal
      isOpen={!!opportunity}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 max-h-[82vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* --- 1. LARGE HERO IMAGE & ORGANIZER LOGO --- */}
        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 group">
          <img 
            src={heroBanner} 
            alt={opportunity.title} 
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top Floating Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/20 hover:bg-black/80 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>

          {/* Bottom Banner Info: Organization Logo & Verified Badge */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Organization Logo */}
              <Avatar name={opportunity.organizer} src={opportunity.organizerLogo} size="lg" className="border-2 border-white shadow-xl" />
              <div>
                <div className="flex items-center gap-1.5 text-white font-bold text-base">
                  <span>{opportunity.organizer}</span>
                  {opportunity.organizerVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <span className="text-xs text-zinc-300 font-mono">Verified Non-Profit Partner</span>
              </div>
            </div>

            <Badge variant="purple" icon={<Sparkles className="w-3.5 h-3.5" />}>
              {opportunity.cause}
            </Badge>
          </div>
        </div>

        {/* --- 2. VOLUNTEER TITLE & DATE/TIME BADGES --- */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
            {opportunity.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Date */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>{opportunity.date}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>{opportunity.time} ({opportunity.durationHours} hrs)</span>
            </div>

            {/* Venue Format */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>{opportunity.venueType}</span>
            </div>

            {/* Required Age */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span>Age: {opportunity.requiredAge || 'All Ages'}</span>
            </div>
          </div>
        </div>

        {/* --- 3. REMAINING SPOTS & LARGE APPLY BUTTON --- */}
        <div className="p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                  {spotsLeft} Spots Remaining
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {opportunity.spotsFilled} of {opportunity.spotsTotal} volunteer positions filled.
              </p>
            </div>

            <Badge variant="success">Instant Confirmation</Badge>
          </div>

          <ProgressBar value={opportunity.spotsFilled} max={opportunity.spotsTotal} color="bg-emerald-500" />

          {/* Large Apply Button */}
          <button
            type="button"
            onClick={() => {
              if (!isApplied) applyOpportunity(opportunity.id, selectedShiftId || undefined);
            }}
            disabled={isApplied}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xl active:scale-[0.98] ${
              isApplied
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
                : isDark
                  ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/10'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-black/10'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Shift Confirmed & Registered</span>
              </>
            ) : (
              <>
                <span>Apply Now & Reserve Shift ({opportunity.durationHours} hrs)</span>
                <ArrowUpRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* --- 4. MAP & LOCATION CARD --- */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>Location & Directions</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">{opportunity.distance}</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
            <p className="font-semibold text-sm text-zinc-900 dark:text-white">{opportunity.location}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {opportunity.venueType === 'In-Person' 
                ? 'On-site check-in at main volunteer station. Show your VolunteerOS app QR code on arrival.' 
                : 'Remote WebRTC link dispatched 30 mins prior to shift start.'}
            </p>
          </div>
        </div>

        {/* --- 5. DESCRIPTION & IMPACT OUTCOME --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-500" />
            <span>About This Opportunity & Impact</span>
          </h3>

          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              {opportunity.description}
            </p>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs">
              <span className="font-bold block mb-1">Target Community Outcome:</span>
              <p>{opportunity.impactSummary}</p>
            </div>
          </div>
        </div>

        {/* --- 6. VOLUNTEER REQUIREMENTS & ITEMS TO BRING --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Requirements */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Volunteer Requirements</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              {opportunity.requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Items to Bring / Skills */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-500" />
              <span>Bring Anything? & Skills</span>
            </h4>
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white block mb-1">Recommended Items:</span>
                <p>{opportunity.itemsToBring ? opportunity.itemsToBring.join(', ') : 'Standard work attire, Reusable water bottle'}</p>
              </div>
              {opportunity.skills && opportunity.skills.length > 0 && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-900 dark:text-white block mb-1">Helpful Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {opportunity.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono text-zinc-600 dark:text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- 7. ORGANIZER INFORMATION --- */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Organizer Host Information</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <Avatar name={opportunity.organizer} src={opportunity.organizerLogo} size="md" />
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{opportunity.organizer}</h4>
                <p className="text-xs text-zinc-500 font-mono">OS Partner Node #049 • Verified</p>
              </div>
            </div>

            {opportunity.contactInfo && (
              <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-0.5 text-right font-mono">
                <div>Lead: {opportunity.contactInfo.name}</div>
                <div>{opportunity.contactInfo.email}</div>
              </div>
            )}
          </div>
        </div>

        {/* --- 8. SIMILAR OPPORTUNITIES BELOW --- */}
        {similarOpportunities.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>Similar Opportunities You May Like</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {similarOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onSelect={(selectedOpp) => {
                    setSelectedOpportunity(selectedOpp);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
