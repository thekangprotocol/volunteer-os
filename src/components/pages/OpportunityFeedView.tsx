import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../volunteer/OpportunityCard';
import { MapView } from '../volunteer/MapView';
import { OpportunityDetailModal } from '../volunteer/OpportunityDetailModal';
import { Opportunity, CauseCategory, VenueType } from '../../types';
import { Search, Filter, LayoutGrid, List, MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Button, cn } from '../common/UIComponents';

export const OpportunityFeedView: React.FC = () => {
  const { opportunities, selectedOpportunity, setSelectedOpportunity, setIsAIModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCause, setSelectedCause] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const causeCategories: string[] = [
    'All',
    'Food Security',
    'Tech Education',
    'Disaster Relief',
    'Environmental',
    'Crisis Support',
    'Animal Welfare'
  ];

  const venueTypes: string[] = ['All', 'In-Person', 'Remote', 'Hybrid'];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCause = selectedCause === 'All' || opp.cause === selectedCause;
    const matchesVenue = selectedVenue === 'All' || opp.venueType === selectedVenue;

    return matchesSearch && matchesCause && matchesVenue;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Opportunity Directory
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
              {filteredOpportunities.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Discover verified community service projects, emergency relief packing lines, and tech mentorships.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setIsAIModalOpen(true)}
          icon={<Sparkles className="w-4 h-4 text-purple-400" />}
          className="shrink-0 text-xs"
        >
          AI Match Recommendation
        </Button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by title, organization, cause, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition-all shadow-sm"
            />
          </div>

          {/* Venue Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full sm:w-auto">
            {venueTypes.map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVenue(v)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                  selectedVenue === v
                    ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Layout Toggle (Grid, List, Map) */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-xl text-xs transition-all",
                viewMode === 'grid' ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-zinc-500"
              )}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-xl text-xs transition-all",
                viewMode === 'list' ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-zinc-500"
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "p-2 rounded-xl text-xs transition-all",
                viewMode === 'map' ? "bg-white text-zinc-950 dark:bg-zinc-800 dark:text-white shadow-sm" : "text-zinc-500"
              )}
              title="Map View"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cause Category Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {causeCategories.map((cause) => (
            <button
              key={cause}
              onClick={() => setSelectedCause(cause)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
                selectedCause === cause
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-sm font-semibold"
                  : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {cause}
            </button>
          ))}
        </div>
      </div>

      {/* Main Opportunity Display (Grid / List / Map) */}
      {viewMode === 'map' ? (
        <MapView opportunities={filteredOpportunities} onSelectOpportunity={setSelectedOpportunity} />
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredOpportunities.map((opp) => (
            <div 
              key={opp.id}
              onClick={() => setSelectedOpportunity(opp)}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all cursor-pointer gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {opp.cause}
                  </span>
                  <span className="text-xs text-zinc-400">• {opp.venueType}</span>
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">{opp.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{opp.organizer} • {opp.location}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-white">{opp.date}</div>
                  <div className="text-zinc-500">{opp.durationHours} hrs</div>
                </div>
                <Button size="sm" variant={opp.applied ? "secondary" : "primary"}>
                  {opp.applied ? "Registered" : "View Details"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      )}

      {/* Modal for Details */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
};
