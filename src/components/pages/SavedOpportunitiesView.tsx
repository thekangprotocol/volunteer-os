import React from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../volunteer/OpportunityCard';
import { Button, EmptyState, Badge } from '../common/UIComponents';
import { Bookmark, Compass } from 'lucide-react';

export const SavedOpportunitiesView: React.FC = () => {
  const { opportunities, setSelectedOpportunity, setActiveTab } = useApp();

  const savedOpportunities = opportunities.filter((o) => o.saved);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Saved Opportunities
            </h1>
            <Badge variant="purple" icon={<Bookmark className="w-3.5 h-3.5" />}>
              {savedOpportunities.length} Bookmarked
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Keep track of projects you are interested in joining later.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setActiveTab('explore')}
          icon={<Compass className="w-4 h-4" />}
          className="text-xs"
        >
          Browse Directory
        </Button>
      </div>

      {savedOpportunities.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8 text-zinc-400" />}
          title="No Bookmarked Opportunities"
          description="When you find an event or cause you want to save for later, click the bookmark icon on any opportunity card."
          action={
            <Button variant="primary" onClick={() => setActiveTab('explore')}>
              Explore Opportunities
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onSelect={setSelectedOpportunity}
            />
          ))}
        </div>
      )}
    </div>
  );
};
