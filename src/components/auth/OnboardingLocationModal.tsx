import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIComponents';
import { MapPin, Globe, Building2, Check, ArrowRight, Heart, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { LocationHelper } from '../../data/locationData';

interface OnboardingLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingLocationModal: React.FC<OnboardingLocationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, updateUserProfile, role, showToast } = useApp();
  
  const [organizationName, setOrganizationName] = useState(userProfile.organizationName || '');
  const [country, setCountry] = useState<string>('United States');
  const [stateProvince, setStateProvince] = useState<string>('California');
  const [city, setCity] = useState<string>('San Francisco');
  const [selectedCauses, setSelectedCauses] = useState<string[]>(['Environment', 'Food Security']);
  const [saving, setSaving] = useState(false);

  // Cascading update when country changes
  useEffect(() => {
    const states = LocationHelper.STATES_PROVINCES[country] || [];
    const firstState = states[0] || '';
    setStateProvince(firstState);
    const cities = LocationHelper.CITIES[firstState] || [];
    setCity(cities[0] || '');
  }, [country]);

  // Cascading update when state/province changes
  useEffect(() => {
    const cities = LocationHelper.CITIES[stateProvince] || [];
    setCity(cities[0] || '');
  }, [stateProvince]);

  if (!isOpen) return null;

  const isOrganizer = role === 'organizer' || userProfile.role === 'organizer';

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

    const fullLocation = `${city}, ${stateProvince}, ${country}`;

    // Update local React App context
    updateUserProfile({
      location: fullLocation,
      causes: selectedCauses,
      organizationName: isOrganizer ? (organizationName.trim() || userProfile.name || 'Community Partner Org') : undefined
    });

    // Sync to Supabase profiles table if connected
    if (isSupabaseConfigured && userProfile.id) {
      try {
        await supabase.from('profiles').upsert({
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          location: fullLocation,
          causes: selectedCauses,
          organization_name: isOrganizer ? (organizationName.trim() || userProfile.name) : null
        });
      } catch (err) {
        console.warn('Supabase profile location update warning:', err);
      }
    }

    setSaving(false);
    showToast(`Location set to ${fullLocation}`);
    onClose();
  };

  const availableStates = LocationHelper.STATES_PROVINCES[country] || [];
  const availableCities = LocationHelper.CITIES[stateProvince] || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isOrganizer ? "Configure Your Organization Profile" : "Complete Your Location Profile"}
      subtitle={isOrganizer ? "Select your organization location and enter your organization name." : "Select your location (US & Canada) to discover nearby shifts."}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSaveLocation} className="space-y-5 pt-2">
        <div className="space-y-4">
          {/* Organization Name for Organizers */}
          {isOrganizer && (
            <div>
              <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1">
                Your Organization / Non-Profit Name *
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-purple-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco Food Bank Foundation"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* 1. Country Dropdown */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Country</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              {LocationHelper.COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2. State / Province Dropdown */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{country === 'Canada' ? 'Province' : 'State'}</span>
              </label>
              <select
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                {availableStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. City Dropdown */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>City</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                {availableCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cause Interests Selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-zinc-400" />
            <span>Select Primary Cause Focus</span>
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
          {saving ? 'Saving Workspace Profile...' : 'Complete Profile & Launch Workspace'}
        </Button>
      </form>
    </Modal>
  );
};
