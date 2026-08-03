import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/UIComponents';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Settings, 
  Bell, 
  Lock, 
  Moon, 
  Sun, 
  UserCheck, 
  ShieldCheck, 
  Globe, 
  Check, 
  Share2, 
  Smartphone,
  Mail
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { userSettings, updateUserSettings, role, setRole, theme, toggleTheme } = useApp();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your workspace experience, notification alerts, privacy safeguards, and connected social networks.
        </p>
      </div>

      {/* Role Workspace Selection */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-500" />
          <span>Default Workspace Role</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setRole('volunteer')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              role === 'volunteer'
                ? 'border-emerald-500 bg-emerald-500/5 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <UserCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Volunteer Workspace</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Explore opportunity feeds, log verified hours, earn passport badges, and register for shifts.
              </p>
            </div>
          </div>

          <div
            onClick={() => setRole('organizer')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              role === 'organizer'
                ? 'border-purple-500 bg-purple-500/5 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Organizer Studio</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Publish events, manage applicant rosters, approve hours, and import social events.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Appearance & Theme */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span>Appearance & Color Theme</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Toggle between dark and light modes styled for high-end Apple glass aesthetic.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <span>Notification Channels</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">Email Digest & Shift Reminders</span>
                <p className="text-[11px] text-zinc-500">Receive 24-hr shift reminders and approval digests.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={userSettings.emailNotifications}
              onChange={(e) => updateUserSettings({ emailNotifications: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">In-App Push Alerts</span>
                <p className="text-[11px] text-zinc-500">Real-time alerts for organizer messages and approvals.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={userSettings.pushNotifications}
              onChange={(e) => updateUserSettings({ pushNotifications: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-500" />
          <span>Privacy & Passport Visibility</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white">Public Volunteer Passport</span>
              <p className="text-[11px] text-zinc-500">Allow non-profits and schools to view your verified hours badge.</p>
            </div>
            <input
              type="checkbox"
              checked={userSettings.publicProfile}
              onChange={(e) => updateUserSettings({ publicProfile: e.target.checked })}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
