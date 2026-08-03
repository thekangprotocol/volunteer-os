import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, StatCard, Badge, Avatar } from '../common/UIComponents';
import { VolunteerPassport } from '../volunteer/VolunteerPassport';
import { User, ShieldCheck, Award, MapPin, Mail, Edit3, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, updateUserProfile, passport, role } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile.bio);
  const [location, setLocation] = useState(userProfile.location);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ bio, location });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Banner */}
      <Card className="p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar name={userProfile.name} src={userProfile.avatar} size="xl" className="shadow-lg" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {userProfile.name}
                </h1>
                <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Verified {role === 'organizer' ? 'Organizer' : 'Volunteer'}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{userProfile.location}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{userProfile.email}</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            icon={<Edit3 className="w-4 h-4" />}
            className="text-xs"
          >
            Edit Profile
          </Button>
        </div>

        {/* Bio */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-3xl leading-relaxed border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4">
          {userProfile.bio}
        </p>

        {/* Skills & Causes */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-mono font-semibold uppercase text-zinc-400 mr-2">Skills:</span>
          {userProfile.skills.map((skill) => (
            <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* Volunteer Passport Component Integration */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Volunteer Passport & Verified Achievements</span>
        </h2>
        <VolunteerPassport />
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Profile Details</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
