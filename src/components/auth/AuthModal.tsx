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
  CheckCircle2,
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
  const [orgName, setOrgName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setRole(r);
    localStorage.setItem('volunteer_os_user_role', r);
    setStep(2);
  };

  const handleCompleteAuth = async (providerName: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      localStorage.setItem('volunteer_os_user_role', selectedRole);

      if (providerName === 'google') {
        const oauthResult = await authService.signInWithOAuth('google');
        if (oauthResult?.error) {
          setErrorMessage(oauthResult.error);
          setLoading(false);
          return;
        }
        return;
      }

      const userDisplayName = name.trim() || (email ? email.split('@')[0] : 'User');
      const userEmail = email.trim();

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
      }

      updateUserProfile({
        name: userDisplayName,
        email: userEmail || `${userDisplayName.toLowerCase().replace(/\s+/g, '')}@volunteer.os`,
        role: selectedRole,
        organizationName: selectedRole === 'organizer' ? orgName : undefined
      });

      localStorage.setItem('volunteer_os_user_role', selectedRole);
      localStorage.setItem('volunteer_os_auth_provider', providerName);

      setLoading(false);
      login(selectedRole);
    } catch (err: any) {
      console.error('Authentication Error:', err);
      setLoading(false);
      setErrorMessage(err?.message || 'Authentication error occurred.');
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
      title={step === 1 ? "Select Your Workspace Role" : `${mode === 'signup' ? 'Create Your' : 'Sign In to'} ${selectedRole === 'volunteer' ? 'Volunteer' : 'Organizer'} Account`}
      subtitle={step === 1 ? "Choose how you'll interact with VolunteerOS." : `Selected workspace: ${selectedRole === 'volunteer' ? 'Volunteer' : 'Organizer'}`}
      maxWidth={step === 1 ? "max-w-2xl" : "max-w-md"}
    >
      {step === 1 ? (
        /* --- STEP 1: SLEEK MONOCHROME ROLE CARDS --- */
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Volunteer Card */}
            <div
              onClick={() => handleSelectRole('volunteer')}
              className="group relative p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md">
                  <Heart className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                      Volunteer
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                      Member
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    Discover local causes, track service hours, earn badges, and export verified transcripts.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                    <span>Real-time shift discovery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                    <span>Verified service passport</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Continue as Volunteer</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Organizer Card */}
            <div
              onClick={() => handleSelectRole('organizer')}
              className="group relative p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                      Organizer
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300">
                      Host
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    Post community opportunities, manage roster attendance, and approve volunteer hours.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                    <span>Roster & check-in pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                    <span>Batch hour verification</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white group-hover:translate-x-1 transition-transform">
                <span>Continue as Organizer</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- STEP 2: REAL AUTHENTICATION --- */
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Change role (currently {selectedRole})</span>
          </button>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Google Login */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleCompleteAuth('google')}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-98 disabled:opacity-50"
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
              <span>{loading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[10px] uppercase font-mono text-zinc-400">
              or use email
            </span>
          </div>

          {/* Email Option */}
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
                <>
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

                  {selectedRole === 'organizer' && (
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Organization / Non-Profit Name</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-purple-500" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. San Francisco Food Bank"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </>
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

          {/* Direct Instant Session */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
            <button
              type="button"
              onClick={() => handleCompleteAuth('demo')}
              className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Or click here to launch Instant Session as {selectedRole}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
