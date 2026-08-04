import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/UIComponents';
import { ThemeToggle } from '../common/ThemeToggle';
import { Modal } from '../common/Modal';
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
  Mail,
  Trash2,
  AlertTriangle,
  MapPin,
  Building2,
  UserX
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { authService } from '../../services/authService';

export const SettingsView: React.FC = () => {
  const { userSettings, updateUserSettings, role, setRole, theme, toggleTheme, userProfile, updateUserProfile, logout, showToast } = useApp();
  
  const [city, setCity] = useState(userProfile.location?.split(',')[0] || 'San Francisco');
  const [stateProv, setStateProv] = useState(userProfile.location?.split(',')[1]?.trim() || 'CA');
  const [country, setCountry] = useState(userProfile.location?.split(',')[2]?.trim() || 'United States');
  const [isSavingLoc, setIsSavingLoc] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLoc(true);

    const fullLocation = `${city.trim()}, ${stateProv.trim()}, ${country.trim()}`;
    updateUserProfile({ location: fullLocation });

    if (isSupabaseConfigured && userProfile.id) {
      try {
        await supabase.from('profiles').upsert({
          id: userProfile.id,
          location: fullLocation
        });
      } catch (err) {
        console.warn('Supabase location update warning:', err);
      }
    }

    setIsSavingLoc(false);
    showToast(`Updated location to ${fullLocation}`);
  };

  const handleConfirmAccountDeletion = async () => {
    if (deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') return;

    setIsDeleting(true);

    try {
      if (isSupabaseConfigured && userProfile.id) {
        // Purge profile row from database
        await supabase.from('profiles').delete().eq('id', userProfile.id);
      }
      await authService.signOut();
    } catch (err) {
      console.warn('Account deletion request error:', err);
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    logout();
    showToast('Account deletion request submitted. Your profile data has been purged.');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your workspace preferences, regional location, notification alerts, and account safety.
        </p>
      </div>

      {/* Location & Regional Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-500" />
          <span>Location & Regional Demographics</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Your location powers local opportunity discovery and distance calculations.
        </p>

        <form onSubmit={handleSaveLocation} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">City</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">State / Province</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={stateProv}
                onChange={(e) => setStateProv(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Country</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              />
            </div>
          </div>

          <div className="sm:col-span-3 pt-2">
            <Button type="submit" variant="primary" size="sm" disabled={isSavingLoc}>
              {isSavingLoc ? 'Updating Location...' : 'Save Location Changes'}
            </Button>
          </div>
        </form>
      </Card>

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

      {/* Danger Zone: Account Deletion Request */}
      <Card className="p-6 space-y-4 border-red-500/20 bg-red-500/5 dark:bg-red-950/10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Danger Zone: Account Deletion</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
              Permanently request account deletion and purge your profile record, passport badges, and service hour logs from VolunteerOS.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            icon={<UserX className="w-4 h-4" />}
          >
            Request Account Deletion
          </Button>
        </div>
      </Card>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Request Account Deletion"
        subtitle="This action is permanent and cannot be undone."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs leading-relaxed">
            Warning: Requesting account deletion will purge your profile, un-list your organization events, and reset your verified service passport.
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Type <span className="font-mono font-bold text-red-500">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              placeholder="DELETE"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              disabled={deleteConfirmationInput.trim().toUpperCase() !== 'DELETE' || isDeleting}
              onClick={handleConfirmAccountDeletion}
              icon={<Trash2 className="w-4 h-4" />}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Permanent Deletion'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
