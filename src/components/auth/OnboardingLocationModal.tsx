import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIComponents';
import { MapPin, Globe, Building2, Check, ArrowRight, Heart } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';

interface OnboardingLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingLocationModal: React.FC<OnboardingLocationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, updateUserProfile, showToast } = useApp();
  
  const [city, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [country, setCountry] = useState('United States');
  const [selectedCauses, setSelectedCauses] = useState<string[]>(['Environment', 'Food Security']);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const CAUSE_OPTIONS = [
    'Food Security',
    'Environment & Climate',
    'Tech & Education',
    'Youth Mentorship',
    'Animal Welfare',
    'Healthcare & Senior Care',
    'Disaster Relief',
    'Arts & Culture'
  ];

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(c => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fullLocation = `${city.trim() || 'San Francisco'}, ${stateProvince.trim() || 'CA'}, ${country.trim()}`;

    // Update local React App context
    updateUserProfile({
      location: fullLocation,
      causes: selectedCauses
    });

    // Sync to Supabase profiles table if connected
    if (isSupabaseConfigured && userProfile.id) {
      try {
        await supabase.from('profiles').upsert({
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          location: fullLocation,
          causes: selectedCauses
        });
      } catch (err) {
        console.warn('Supabase profile location update warning:', err);
      }
    }

    setSaving(false);
    showToast(`Location set to ${fullLocation}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Your Profile Location"
      subtitle="Help us match you with local volunteer opportunities near your city."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSaveLocation} className="space-y-5 pt-2">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              City
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                placeholder="e.g. San Francisco"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                State / Province
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. California"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cause Interests Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-zinc-400" />
            <span>Select Primary Cause Interests</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CAUSE_OPTIONS.map((cause) => {
              const isSelected = selectedCauses.includes(cause);
              return (
                <button
                  key={cause}
                  type="button"
                  onClick={() => toggleCause(cause)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  <span>{cause}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 mt-2"
          disabled={saving}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {saving ? 'Saving Location...' : 'Complete Profile & Launch Workspace'}
        </Button>
      </form>
    </Modal>
  );
};
