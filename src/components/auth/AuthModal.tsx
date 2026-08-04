import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button, cn } from '../common/UIComponents';
import { 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  User, 
  ChevronLeft, 
  Heart, 
  Award, 
  Compass, 
  Building2, 
  CheckCircle2,
  Check,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, role, setRole, updateUserProfile, showToast } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  const [authMethod, setAuthMethod] = useState<'social' | 'email'>('social');
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setRole(r);
    setStep(2);
  };

  const handleCompleteAuth = async (providerName: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      let userDisplayName = name.trim();
      let userEmail = email.trim();

      if (providerName === 'google') {
        userDisplayName = userDisplayName || 'Google Volunteer';
        userEmail = userEmail || 'volunteer@gmail.com';
      } else if (providerName === 'apple') {
        userDisplayName = userDisplayName || 'Apple Volunteer';
        userEmail = userEmail || 'volunteer@icloud.com';
      } else {
        userDisplayName = userDisplayName || (email ? email.split('@')[0] : 'User');
        userEmail = userEmail || `${userDisplayName.toLowerCase().replace(/\s+/g, '')}@example.com`;
      }

      if (authMethod === 'email' && email && password) {
        if (mode === 'signup') {
          const result = await authService.signUp(userEmail, password, userDisplayName, selectedRole);
          if (result.error) {
            setErrorMessage(result.error);
            setLoading(false);
            return;
          }
        } else {
          const result = await authService.signIn(userEmail, password);
          if (result.error) {
            setErrorMessage(result.error);
            setLoading(false);
            return;
          }
        }
      } else if (providerName === 'google' || providerName === 'apple') {
        showToast(`Signed in as ${providerName === 'google' ? 'Google' : 'Apple'} user. Enable ${providerName.toUpperCase()} in Supabase for OAuth redirect.`);
      }

      updateUserProfile({
        name: userDisplayName,
        email: userEmail,
        role: selectedRole
      });

      localStorage.setItem('volunteer_os_user_role', selectedRole);
      localStorage.setItem('volunteer_os_auth_provider', providerName);

      setLoading(false);
      login(selectedRole);
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setLoading(false);
      setErrorMessage(err?.message || 'Authentication process encountered an issue. Signed in locally.');
      
      // Fallback graceful sign-in so user is never locked out
      login(selectedRole);
    }
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    handleCompleteAuth('email');
  };

  const resetModal = () => {
    setStep(1);
    setIsAuthModalOpen(false);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={resetModal}
      title={step === 1 ? "How would you like to use VolunteerOS?" : `${mode === 'signup' ? 'Create Your' : 'Sign In to'} ${selectedRole === 'volunteer' ? 'Volunteer' : 'Organizer'} Account`}
      subtitle={step === 1 ? "Choose your workspace role to personalize your impact dashboard." : `Selected role: ${selectedRole === 'volunteer' ? 'Volunteer' : 'Organizer'}`}
      maxWidth={step === 1 ? "max-w-2xl" : "max-w-md"}
    >
      {step === 1 ? (
        /* --- STEP 1: CINEMATIC ROLE SELECTION CARDS --- */
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Volunteer Card */}
            <div
              onClick={() => handleSelectRole('volunteer')}
              className="group relative p-6 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-zinc-900/40 to-zinc-900/80 dark:from-emerald-500/15 dark:to-zinc-900/90 border border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cinematic Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-emerald-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                      Volunteer
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">
                      Impact Seeker
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    Discover community events, log verified service hours, earn cryptographic passport badges, and connect with cause leaders.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 pt-2 border-t border-emerald-500/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time shift discovery & AI matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Verified cryptographic hour passport</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Downloadable official service transcripts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-emerald-500 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Continue as Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Organizer Card */}
            <div
              onClick={() => handleSelectRole('organizer')}
              className="group relative p-6 rounded-3xl bg-gradient-to-b from-purple-500/10 via-zinc-900/40 to-zinc-900/80 dark:from-purple-500/15 dark:to-zinc-900/90 border border-purple-500/30 dark:border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Cinematic Icon Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:rotate-3 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-purple-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white group-hover:text-purple-400 transition-colors">
                      Organizer
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400">
                      Community Lead
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    Host community projects, manage applicant rosters, approve verified volunteer hours, and import social events.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300 pt-2 border-t border-purple-500/10">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Applicant roster & check-in pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>1-Click batch hour verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Social event importer (FB/IG/City)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-purple-500 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Continue as Organizer</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- STEP 2: AUTHENTICATION (GOOGLE, APPLE, EMAIL) --- */
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Change role (currently {selectedRole})</span>
          </button>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Login Options */}
          <div className="space-y-2.5">
            {/* Google Sign-In */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleCompleteAuth('google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 font-semibold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
            </button>

            {/* Apple Sign-In */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleCompleteAuth('apple')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-all shadow-sm active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.07-3.67-2.85-7.73-7.76-12.19-14.73-6.07-9.5-10.74-19.8-14.01-30.91-3.27-11.11-4.91-21.73-4.91-31.86 0-14.74 3.73-26.83 11.19-36.27 7.46-9.44 16.92-14.28 28.38-14.52 4.79 0 9.87 1.18 15.23 3.54 5.37 2.36 9.17 3.54 11.41 3.54 1.83 0 5.76-1.24 11.78-3.72 6.03-2.48 11.14-3.6 15.34-3.37 10.02.59 18.52 4.19 25.49 10.79-9.18 5.56-13.68 13.43-13.51 23.63.18 10.19 4.29 18.25 12.33 24.18 3.54 2.65 7.48 4.6 11.83 5.86-2.52 7.29-6.01 14.88-10.47 22.78zM119.22 31.42c0-6.42 2.35-12.63 7.05-18.63 4.7-6 10.59-9.66 17.67-10.98.59 7.02-1.6 13.64-6.57 19.86-4.97 6.22-10.95 9.77-17.94 10.65-.05-.3-.12-.6-.21-.9z"/>
              </svg>
              <span>{loading ? 'Connecting Apple Account...' : 'Continue with Apple'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[10px] uppercase font-mono text-zinc-400">
              or use email
            </span>
          </div>

          {/* Email Login / Signup Option */}
          {authMethod === 'social' ? (
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Continue with Email & Password</span>
            </button>
          ) : (
            <form onSubmit={handleSubmitEmail} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder="Zachary Taylor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@organization.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" icon={<ArrowRight className="w-4 h-4" />}>
                {mode === 'signup' ? `Sign Up as ${selectedRole}` : `Sign In as ${selectedRole}`}
              </Button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
            <button
              type="button"
              onClick={() => handleCompleteAuth('demo')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Or click here to launch 1-Click Instant Demo as {selectedRole}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
