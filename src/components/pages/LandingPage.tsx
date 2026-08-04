import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge } from '../common/UIComponents';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Award, 
  Users, 
  Globe2, 
  Building2, 
  Share2,
  Lock,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setIsAuthModalOpen, login, setActiveTab } = useApp();

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-xs font-mono mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
          <span>VolunteerOS Protocol v2.5</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          The Operating System for <br />
          <span className="text-zinc-950 dark:text-white underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-8">
            Community Impact & Action
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Unifying volunteers, organizers, and verified hour tracking into one sleek, Apple-meets-Notion workspace. Automate shift management, earn cryptographic passports, and aggregate social causes.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => setIsAuthModalOpen(true)}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch VolunteerOS
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => login('volunteer')}
            icon={<Compass className="w-4 h-4" />}
          >
            Explore Live Demo
          </Button>
        </div>

        {/* Community Ticker */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">142,500+</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verified Hours Logged</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">1,280</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verified Non-Profits</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">99.8%</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Shift Attendance Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">100%</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Encrypted Hash Audit</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="purple" className="mb-2">Unified Platform</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Designed for Simplicity & Speed
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Every module in VolunteerOS is built to eliminate friction for both volunteers and event coordinators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Volunteer Passport</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your portable digital identity. Earn verifiable milestone badges, log hours automatically, and export signed PDFs for schools or employers.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Organizer Studio</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Manage rosters, review applications, aggregate events from social channels, and grant verified hours in 1-click batch approvals.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">AI-Powered Matching</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Smart algorithms analyze your skills, schedule, and cause preferences to surface high-affinity opportunities near you.
            </p>
          </Card>
        </div>
      </section>

      {/* Notion + Apple Navigation Highlight */}
      <section className="p-8 sm:p-12 rounded-3xl bg-zinc-900 text-white dark:bg-zinc-900/90 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Badge variant="info">Notion x Apple Interface</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight">
              A Navigation System That Feels Natural
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Collapsible sidebar navigation inspired by Notion, paired with floating Apple glass top controls, command menu (⌘K), and instant workspace role switching.
            </p>

            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Command Palette (⌘K) for quick navigation & search</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant toggle between Volunteer and Organizer workspace views</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dual Light & Dark themes tailored for visual comfort</span>
              </li>
            </ul>

            <div className="pt-2">
              <Button variant="primary" onClick={() => login('volunteer')}>
                Test Workspace Experience
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3 font-mono text-xs text-zinc-300 shadow-inner">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">// VolunteerOS Navigation State</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div><span className="text-purple-400">const</span> workspace = <span className="text-amber-300">'VolunteerOS Kernel'</span>;</div>
              <div><span className="text-purple-400">const</span> theme = <span className="text-amber-300">'Apple Glass Dark'</span>;</div>
              <div><span className="text-purple-400">const</span> sidebar = <span className="text-amber-300">'Notion Collapsible'</span>;</div>
              <div><span className="text-purple-400">const</span> verifications = <span className="text-emerald-400">['SHA-256 Certificates', 'PDF Export']</span>;</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
