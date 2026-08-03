import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OpportunityCreatorModal } from './OpportunityCreatorModal';
import { AggregationImportModal } from './AggregationImportModal';
import { Card, StatCard, Badge, Button } from '../common/UIComponents';
import { 
  PlusCircle, 
  Link as LinkIcon, 
  Users, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  MessageSquare,
  BarChart3,
  Calendar,
  UserCheck,
  FileCheck,
  Building2,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  Pencil
} from 'lucide-react';

export const OrganizerStudio: React.FC = () => {
  const { 
    organizerStats, 
    applicants, 
    approveApplicant, 
    theme, 
    opportunities,
    setIsCreatorModalOpen,
    setEditingOpportunity,
    setIsImportModalOpen,
    setActiveTab,
    showToast
  } = useApp();

  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'upcoming' | 'completed'>('roster');

  const handleSimulateQRScan = () => {
    showToast('QR Check-In Scanner active. Checked in 4 volunteers at Metro Food Bank.');
  };

  const pendingApplicants = applicants.filter((a) => a.status === 'pending');
  const approvedApplicants = applicants.filter((a) => a.status === 'approved');
  const activeEvents = opportunities.filter((o) => o.status === 'active');
  const completedEventsCount = 24; // Mock completed events count

  // Monochrome chart data points
  const monthlyParticipationData = [
    { month: 'Mar', hours: 140, volunteers: 32 },
    { month: 'Apr', hours: 220, volunteers: 48 },
    { month: 'May', hours: 310, volunteers: 64 },
    { month: 'Jun', hours: 280, volunteers: 58 },
    { month: 'Jul', hours: 420, volunteers: 86 },
    { month: 'Aug', hours: 510, volunteers: 104 },
  ];

  const maxHours = Math.max(...monthlyParticipationData.map((d) => d.hours));

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-semibold">
                Non-Profit Command Center
              </span>
              <Badge variant="outline" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Verified Partner
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Urban Harvest Alliance
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Manage community project rosters, issue verified hours, and analyze volunteer participation trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              icon={<LinkIcon className="w-4 h-4" />}
              className="text-xs"
            >
              Import Social Post
            </Button>

            <Button
              variant="primary"
              onClick={() => setIsCreatorModalOpen(true)}
              icon={<PlusCircle className="w-4 h-4" />}
              className="text-xs"
            >
              Create Opportunity
            </Button>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">Total Volunteers</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{organizerStats.totalApplicantsCount}</div>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">+12% vs last month</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">Pending Apps</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{pendingApplicants.length}</div>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">Awaiting review</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">Upcoming Events</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{activeEvents.length}</div>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">Active on feed</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">Completed Events</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{completedEventsCount}</div>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">Past 12 months</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 block">Hours Issued</span>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">{organizerStats.verifiedHoursGranted} hrs</div>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">Cryptographically signed</span>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTIONS GRID --- */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-mono text-xs text-zinc-400">
          Organizer Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card 
            hoverable 
            onClick={() => setIsCreatorModalOpen(true)}
            className="p-4 flex flex-col items-start justify-between gap-3 border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Create Opportunity</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Publish new event listing</p>
            </div>
          </Card>

          <Card 
            hoverable 
            onClick={() => setActiveSubTab('roster')}
            className="p-4 flex flex-col items-start justify-between gap-3 border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">View Applicants</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Review roster & hours</p>
            </div>
          </Card>

          <Card 
            hoverable 
            onClick={() => setActiveTab('messages')}
            className="p-4 flex flex-col items-start justify-between gap-3 border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Team Messages</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Direct chat & event channels</p>
            </div>
          </Card>

          <Card 
            hoverable 
            onClick={handleSimulateQRScan}
            className="p-4 flex flex-col items-start justify-between gap-3 border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Check-in Scanner</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Simulate QR attendance</p>
            </div>
          </Card>
        </div>
      </div>

      {/* --- MONOCHROME ANALYTICS SECTION --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Analytics & Performance</h2>
            <Badge variant="outline">Monochrome Telemetry</Badge>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Last 6 Months</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bar Chart - Hours Issued */}
          <Card className="lg:col-span-2 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Monthly Verified Hours Issued</h3>
                <p className="text-xs text-zinc-500">Grayscale volume analysis of signed community credits</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-zinc-900 dark:text-white">1,880 hrs</span>
                <span className="text-[10px] text-zinc-400 font-mono block">6-Month Total</span>
              </div>
            </div>

            {/* Pure Monochrome SVG Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {monthlyParticipationData.map((d) => {
                const heightPercent = Math.round((d.hours / maxHours) * 100);
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">{d.hours}h</span>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-xl h-full flex items-end overflow-hidden">
                      <div 
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-zinc-900 dark:bg-white rounded-t-xl transition-all duration-500 group-hover:opacity-80"
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-zinc-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Side Summary Metric Card */}
          <Card className="p-6 space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Efficiency Metrics</h3>
              <p className="text-xs text-zinc-500">Overall organizer conversion telemetry.</p>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Applicant Attendance Rate</span>
                  <span className="font-bold text-zinc-900 dark:text-white">96.4%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-zinc-900 dark:bg-white w-[96.4%]" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Hour Audit Turnaround</span>
                  <span className="font-bold text-zinc-900 dark:text-white">&lt; 2 Hours</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-zinc-900 dark:bg-white w-[88%]" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Social Channel Conversion</span>
                  <span className="font-bold text-zinc-900 dark:text-white">74.2%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-zinc-900 dark:bg-white w-[74.2%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* --- MANAGED APPLICANTS ROSTER & UPCOMING EVENTS TABBED TABLE --- */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 overflow-hidden shadow-sm">
        {/* Table Sub-Tabs Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('roster')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === 'roster'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Applicant Roster ({applicants.length})
            </button>

            <button
              onClick={() => setActiveSubTab('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === 'upcoming'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Upcoming Events ({activeEvents.length})
            </button>
          </div>

          <span className="text-xs font-mono text-zinc-400">1-Click Hour Audit Active</span>
        </div>

        {/* Tab 1: Applicants Roster */}
        {activeSubTab === 'roster' && (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {applicants.map((app) => (
              <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{app.volunteerName}</h4>
                    <span className="text-xs font-mono text-zinc-400">• {app.volunteerEmail}</span>
                  </div>
                  <p className="text-xs text-zinc-500">{app.opportunityTitle}</p>
                  <span className="text-[10px] font-mono text-zinc-400 block">Applied {app.appliedDate}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {app.hoursClaimed} hrs claimed
                  </span>

                  {app.status === 'approved' ? (
                    <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      Verified & Granted
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => approveApplicant(app.id)}
                      icon={<FileCheck className="w-3.5 h-3.5" />}
                    >
                      Approve Hours
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Upcoming Events List */}
        {activeSubTab === 'upcoming' && (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {activeEvents.map((opp) => (
              <div key={opp.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {opp.cause}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">• {opp.venueType}</span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">{opp.title}</h4>
                  <p className="text-xs text-zinc-500">{opp.location} • {opp.date} ({opp.time})</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs font-mono">
                    <div className="font-bold text-zinc-900 dark:text-white">{opp.spotsFilled} / {opp.spotsTotal} Spots Filled</div>
                    <div className="text-[10px] text-zinc-400">{opp.durationHours} hrs credit</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingOpportunity(opp);
                      setIsCreatorModalOpen(true);
                    }}
                    icon={<Pencil className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <OpportunityCreatorModal />
      <AggregationImportModal />
    </div>
  );
};
