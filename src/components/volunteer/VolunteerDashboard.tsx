import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { Button, Card, StatCard, Badge, ProgressBar } from '../common/UIComponents';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Activity,
  ArrowRight,
  UserCheck,
  Compass,
  Lock,
  ChevronRight,
  Target,
  Zap,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { CauseCategory, VenueType } from '../../types';

export const VolunteerDashboard: React.FC = () => {
  const { 
    opportunities, 
    userProfile, 
    passport, 
    selectedOpportunity, 
    setSelectedOpportunity, 
    toggleSaveOpportunity,
    applyOpportunity,
    setIsAIModalOpen,
    setActiveTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const causesList = [
    'All',
    'Food Security',
    'Tech Education',
    'Disaster Relief',
    'Environmental',
    'Crisis Support',
    'Animal Welfare',
  ];

  const venuesList = ['All', 'In-Person', 'Remote', 'Hybrid'];

  // Filtered dataset
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCause = selectedCause === 'All' || opp.cause === selectedCause;
    const matchesVenue = selectedVenue === 'All' || opp.venueType === selectedVenue;

    return matchesSearch && matchesCause && matchesVenue;
  });

  // 1. 🎯 Best Match for You (Highest AI Match Score)
  const bestMatch = [...filteredOpportunities].sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0))[0];

  // 2. ⏰ Ending Soon (Urgent / Few Spots Left)
  const endingSoonList = filteredOpportunities
    .filter((o) => (o.spotsTotal - o.spotsFilled) <= 5 || o.date.toLowerCase().includes('tonight') || o.date.toLowerCase().includes('saturday'))
    .slice(0, 3);

  // 3. 📍 Near You (< 2.0 miles)
  const nearYouList = filteredOpportunities
    .filter((o) => o.distance.includes('0.') || o.distance.includes('1.') || o.distance.includes('2.'))
    .slice(0, 3);

  // 4. ⭐ Based on Your Interests
  const interestsList = filteredOpportunities
    .filter((o) => userProfile.causes.includes(o.cause))
    .slice(0, 3);

  const upcomingEvents = opportunities.filter((o) => o.applied);
  const savedOpportunities = opportunities.filter((o) => o.saved);

  return (
    <div className="space-y-12">
      {/* --- HERO QUESTION BANNER: "What should I volunteer for next?" --- */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 sm:p-10 border border-zinc-800 shadow-2xl space-y-6">
        {/* Subtle Background Radial Accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

        {/* Header Top Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="purple" icon={<Sparkles className="w-3.5 h-3.5" />}>
              Personalized Decision Engine
            </Badge>
            <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Verified Protocol
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isFilterPanelOpen
                  ? 'bg-white text-zinc-950 border-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Question Headline */}
        <div className="relative z-10 space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Welcome back, {userProfile.name.split(' ')[0]}</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white leading-tight">
            What should I volunteer for next?
          </h1>
          <p className="text-sm font-light text-zinc-400 max-w-2xl">
            VolunteerOS analyzes your skills, past verified service, physical distance, and schedule fit to present your top 4 action cards.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative z-10">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, organization, cause, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-inner"
          />
        </div>

        {/* Filter Expandable Panel */}
        {isFilterPanelOpen && (
          <div className="relative z-10 pt-4 border-t border-zinc-800 space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2 block">
                Cause Categories:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {causesList.map((cause) => (
                  <button
                    key={cause}
                    onClick={() => setSelectedCause(cause)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCause === cause
                        ? 'bg-white text-zinc-950 border-white font-semibold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- 🎯 SECTION 1: BEST MATCH FOR YOU --- */}
      {bestMatch && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">🎯 Best Match for You</h2>
              <Badge variant="purple">{bestMatch.aiMatchScore || 98}% Neural Match</Badge>
            </div>
            <span className="text-xs font-mono text-zinc-400">#1 Highest Score Fit</span>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-zinc-900/5 to-zinc-900/40 border border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="purple">{bestMatch.cause}</Badge>
                  <span className="text-xs text-zinc-400 font-mono">• {bestMatch.venueType}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-zinc-950 dark:text-white">{bestMatch.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{bestMatch.organizer} • {bestMatch.location}</p>
              </div>

              <Button
                variant="primary"
                onClick={() => setSelectedOpportunity(bestMatch)}
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="px-6 py-3"
              >
                View Best Match
              </Button>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 shrink-0 text-purple-400" />
              <span>{bestMatch.aiMatchReason || `Matches your ${userProfile.skills.join(', ')} skills & ${bestMatch.cause} track record.`}</span>
            </div>
          </div>
        </section>
      )}

      {/* --- ⏰ SECTION 2: ENDING SOON --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">⏰ Ending Soon / Limited Spots</h2>
            <Badge variant="warning">High Priority</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {endingSoonList.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      </section>

      {/* --- 📍 SECTION 3: NEAR YOU --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">📍 Near You</h2>
            <span className="text-xs font-mono text-zinc-400">• &lt; 2.0 miles away</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearYouList.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      </section>

      {/* --- ⭐ SECTION 4: BASED ON YOUR INTERESTS --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">⭐ Based on Your Interests</h2>
            <Badge variant="info">{userProfile.causes.join(', ')}</Badge>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-medium flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interestsList.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      </section>

      {/* --- SECTION 5: UPCOMING EVENTS & SHIFTS --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Upcoming Confirmed Shifts</h2>
            <Badge variant="success">{upcomingEvents.length} Confirmed</Badge>
          </div>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">No registered shifts yet. Choose a match above and click Apply Now!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingEvents.map((opp) => (
              <Card key={opp.id} className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-500">Confirmed Shift</span>
                  <h3 className="font-bold text-sm text-zinc-950 dark:text-white">{opp.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{opp.organizer} • {opp.date} ({opp.time})</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelectedOpportunity(opp)}>
                  Shift Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- SECTION 6: MY VOLUNTEER HOURS & IMPACT --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-zinc-950 dark:text-white">My Volunteer Hours</h2>
            <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>Verified Protocol</Badge>
          </div>
          <button
            onClick={() => setActiveTab('hours')}
            className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-medium flex items-center gap-1"
          >
            <span>Service Audit Trail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white">{passport.totalHours} Verified Hours</div>
              <p className="text-xs font-light text-zinc-500 dark:text-zinc-400 mt-0.5">{passport.eventsCompleted} completed community projects</p>
            </div>
            <Button size="sm" variant="primary" onClick={() => setActiveTab('hours')}>
              Log External Hours
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-950 dark:text-white">Centurion Badge II Progress (150 Hours Goal)</span>
              <span className="text-zinc-500 font-mono">{passport.totalHours} / 150 hrs ({Math.round((passport.totalHours / 150) * 100)}%)</span>
            </div>
            <ProgressBar value={passport.totalHours} max={150} color="bg-emerald-500" />
          </div>
        </Card>
      </section>

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
};
