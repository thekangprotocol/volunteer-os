import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button, Badge, cn } from '../common/UIComponents';
import { Opportunity, CauseCategory, VenueType } from '../../types';
import { 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Image, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Eye, 
  Save, 
  FileText, 
  UserCheck, 
  Briefcase, 
  ShoppingBag, 
  Mail, 
  Phone,
  Upload,
  ArrowRight
} from 'lucide-react';

export const OpportunityCreatorModal: React.FC = () => {
  const { 
    isCreatorModalOpen, 
    setIsCreatorModalOpen, 
    addNewOpportunity, 
    updateOpportunity, 
    editingOpportunity, 
    setEditingOpportunity, 
    userProfile, 
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState(userProfile.organizationName || 'Urban Harvest Alliance');
  const [cause, setCause] = useState<CauseCategory>('Food Security');
  const [venueType, setVenueType] = useState<VenueType>('In-Person');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800');

  // Step 2 Fields
  const [date, setDate] = useState('This Saturday, Aug 8');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('01:00 PM');
  const [durationHours, setDurationHours] = useState(4);
  const [location, setLocation] = useState('Downtown Community Hub, 420 5th Ave');
  const [spotsTotal, setSpotsTotal] = useState(20);
  const [minimumAge, setMinimumAge] = useState('18+');

  // Step 3 Fields
  const [description, setDescription] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [requirementsText, setRequirementsText] = useState('Closed-toe shoes, Comfortable outdoor attire');
  const [skillsText, setSkillsText] = useState('Event Support, Teamwork');
  const [bringText, setBringText] = useState('Reusable water bottle, Work gloves');
  const [contactName, setContactName] = useState(userProfile.name);
  const [contactEmail, setContactEmail] = useState(userProfile.email);
  const [contactPhone, setContactPhone] = useState('(415) 892-0192');

  // Prefill if editing existing opportunity
  useEffect(() => {
    if (editingOpportunity) {
      setTitle(editingOpportunity.title);
      setOrganizer(editingOpportunity.organizer);
      setCause(editingOpportunity.cause);
      setVenueType(editingOpportunity.venueType);
      setLocation(editingOpportunity.location);
      setDate(editingOpportunity.date);
      setDurationHours(editingOpportunity.durationHours);
      setSpotsTotal(editingOpportunity.spotsTotal);
      setDescription(editingOpportunity.description);
      setImpactSummary(editingOpportunity.impactSummary || '');
      setRequirementsText(editingOpportunity.requirements?.join(', ') || '');
      setMinimumAge(editingOpportunity.requiredAge || '18+');
      if (editingOpportunity.bannerImage) setBannerImage(editingOpportunity.bannerImage);
      if (editingOpportunity.skills) setSkillsText(editingOpportunity.skills.join(', '));
      if (editingOpportunity.itemsToBring) setBringText(editingOpportunity.itemsToBring.join(', '));
      if (editingOpportunity.contactInfo) {
        setContactName(editingOpportunity.contactInfo.name);
        setContactEmail(editingOpportunity.contactInfo.email);
        if (editingOpportunity.contactInfo.phone) setContactPhone(editingOpportunity.contactInfo.phone);
      }
    }
  }, [editingOpportunity]);

  // Auto-Save Draft logic
  useEffect(() => {
    if (!isCreatorModalOpen) return;
    const draft = localStorage.getItem('volunteer_os_opportunity_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.organizer) setOrganizer(parsed.organizer);
        if (parsed.cause) setCause(parsed.cause);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.durationHours) setDurationHours(parsed.durationHours);
        if (parsed.spotsTotal) setSpotsTotal(parsed.spotsTotal);
      } catch (err) {
        // ignore
      }
    }
  }, [isCreatorModalOpen]);

  useEffect(() => {
    if (!title && !description) return;
    const timeout = setTimeout(() => {
      const draftData = {
        title,
        organizer,
        cause,
        venueType,
        date,
        startTime,
        endTime,
        durationHours,
        location,
        spotsTotal,
        minimumAge,
        description,
        impactSummary,
        requirementsText,
        skillsText,
        bringText,
        contactName,
        contactEmail
      };
      localStorage.setItem('volunteer_os_opportunity_draft', JSON.stringify(draftData));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [title, description, cause, date, location, spotsTotal, durationHours]);

  if (!isCreatorModalOpen) return null;

  const handlePublish = () => {
    if (!title.trim() || !description.trim()) {
      showToast('Please enter an Opportunity Title and Description before publishing.');
      return;
    }

    if (editingOpportunity) {
      updateOpportunity(editingOpportunity.id, {
        title,
        organizer,
        cause,
        venueType,
        location: location || 'Downtown Community Hub',
        date,
        time: `${startTime} - ${endTime}`,
        durationHours,
        spotsTotal,
        description,
        impactSummary: impactSummary || 'Direct community service impact.',
        requirements: requirementsText.split(',').map((s) => s.trim()).filter(Boolean),
        requiredAge: minimumAge,
        skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
        itemsToBring: bringText.split(',').map((s) => s.trim()).filter(Boolean),
        contactInfo: { name: contactName, email: contactEmail, phone: contactPhone },
        bannerImage
      });
      setEditingOpportunity(null);
    } else {
      const newOpp: Opportunity = {
        id: `vos-${Date.now()}`,
        title,
        organizer,
        organizerVerified: true,
        cause,
        venueType,
        location: location || 'Downtown Community Hub',
        distance: '1.0 miles away',
        date,
        time: `${startTime} - ${endTime}`,
        durationHours,
        spotsTotal,
        spotsFilled: 0,
        description,
        impactSummary: impactSummary || 'Direct community service impact.',
        requirements: requirementsText.split(',').map((s) => s.trim()).filter(Boolean),
        requiredAge: minimumAge,
        skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
        itemsToBring: bringText.split(',').map((s) => s.trim()).filter(Boolean),
        contactInfo: { name: contactName, email: contactEmail, phone: contactPhone },
        bannerImage,
        shifts: [
          {
            id: `s-${Date.now()}`,
            date,
            time: `${startTime} - ${endTime}`,
            spotsTotal,
            spotsFilled: 0
          }
        ],
        source: 'VolunteerOS Native',
        status: 'active'
      };
      addNewOpportunity(newOpp);
    }

    localStorage.removeItem('volunteer_os_opportunity_draft');
    setIsCreatorModalOpen(false);
    setCurrentStep(1);
    setTitle('');
    setDescription('');
  };

  const steps = [
    { num: 1, label: 'Identity & Banner' },
    { num: 2, label: 'Schedule & Capacity' },
    { num: 3, label: 'Details & Requirements' },
    { num: 4, label: 'Preview & Publish' },
  ];

  return (
    <Modal
      isOpen={isCreatorModalOpen}
      onClose={() => setIsCreatorModalOpen(false)}
      title="Create New Opportunity Page"
      subtitle="Notion-style page editor with auto-saved draft."
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Notion-Style Banner Cover Preview */}
        <div className="relative h-32 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 group">
          <img src={bannerImage} alt="Banner Cover" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-extrabold text-sm text-white truncate max-w-md">
                {title || 'Untitled Opportunity Page'}
              </span>
            </div>
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 text-white text-xs font-medium flex items-center gap-1.5 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Change Cover</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    setBannerImage(url);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Step Indicator & Auto-Save Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          {/* Breadcrumb Steps */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num as any)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                  currentStep === s.num
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <span className="w-4 h-4 rounded-full bg-zinc-500/20 text-[10px] flex items-center justify-center font-mono">
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Auto-Save Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 shrink-0">
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Draft Saved {lastSavedTime ? `at ${lastSavedTime}` : 'live'}</span>
          </div>
        </div>

        {/* --- STEP 1: BASICS & IDENTITY --- */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Opportunity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Metro Food Bank Midnight Redistribution"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Volunteer Category</label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value as CauseCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none"
                >
                  <option value="Food Security">Food Security</option>
                  <option value="Tech Education">Tech Education</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Crisis Support">Crisis Support</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Senior Care">Senior Care</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Banner Image Preset / URL</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* --- STEP 2: SCHEDULE & LOGISTICS --- */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Date</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Saturday, Aug 8"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">End Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="01:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Volunteer Hours</label>
                <input
                  type="number"
                  min={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Max Volunteers</label>
                <input
                  type="number"
                  min={1}
                  value={spotsTotal}
                  onChange={(e) => setSpotsTotal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Minimum Age</label>
                <select
                  value={minimumAge}
                  onChange={(e) => setMinimumAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
                >
                  <option value="All Ages">All Ages</option>
                  <option value="16+">16+</option>
                  <option value="18+">18+</option>
                  <option value="21+">21+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Location / Venue</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Address or Remote WebRTC link..."
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
              />
            </div>
          </div>
        )}

        {/* --- STEP 3: DETAILS & PREPARATION --- */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Description & Key Tasks</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what volunteers will be doing during the event..."
                className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Requirements (comma-separated)</label>
                <input
                  type="text"
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  placeholder="Closed-toe shoes, Background check"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Skills Needed (comma-separated)</label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="Mentorship, JavaScript, First Aid"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Bring Anything? (items to bring)</label>
              <input
                type="text"
                value={bringText}
                onChange={(e) => setBringText(e.target.value)}
                placeholder="Work gloves, Reusable water bottle, Laptop"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 4: PREVIEW & PUBLISH --- */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Opportunity Page Live Preview</span>
              </span>
              <Badge variant="purple">Ready to Publish</Badge>
            </div>

            {/* Preview Card */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-white space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="success">{cause}</Badge>
                <span className="text-xs font-mono text-zinc-400">{spotsTotal} spots total</span>
              </div>

              <div>
                <h3 className="text-xl font-bold">{title || 'Untitled Opportunity'}</h3>
                <p className="text-xs text-zinc-400 mt-1">{organizer} • {location}</p>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{description || 'No description provided.'}</p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                <div>📅 Date: {date} ({startTime} - {endTime})</div>
                <div>⏳ Hours: {durationHours} hrs credit</div>
                <div>🎂 Minimum Age: {minimumAge}</div>
                <div>🎒 Items to bring: {bringText || 'None'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setIsCreatorModalOpen(false)}>
              Cancel
            </Button>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setCurrentStep((currentStep + 1) as any)}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handlePublish}
              icon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-2.5"
            >
              Publish Opportunity Page
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
