import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import { 
  Compass, 
  Award, 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Bookmark, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  PlusCircle, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { Avatar } from '../common/UIComponents';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    role, 
    setRole, 
    userProfile,
    setIsCreatorModalOpen,
    setIsAIModalOpen,
    unreadNotificationsCount
  } = useApp();

  if (!isSidebarOpen) {
    return (
      <aside className="fixed left-3 top-24 z-30 hidden md:flex flex-col gap-2">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white shadow-lg backdrop-blur-md transition-all hover:scale-105"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  const mainNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: 'Opportunity Feed', icon: <Compass className="w-4 h-4" /> },
    { id: 'passport', label: 'Volunteer Passport', icon: <Award className="w-4 h-4" /> },
    { id: 'organizer', label: 'Organizer Studio', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const activityNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'hours', label: 'Volunteer Hours', icon: <Clock className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
  ];

  const communicationNavItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'messages', label: 'Messages & Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, badge: unreadNotificationsCount },
  ];

  const accountNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & OS', icon: <Settings className="w-4 h-4" /> },
  ];

  const renderNavItem = (item: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 group ${
          isActive
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-sm'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </div>
        {item.badge !== undefined && item.badge > 0 && (
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            isActive 
              ? 'bg-white text-zinc-950 dark:bg-zinc-900 dark:text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="fixed left-4 top-20 bottom-4 w-60 z-30 hidden md:flex flex-col bg-white/80 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl backdrop-blur-xl shadow-xl transition-all duration-300 p-3">
      {/* Sidebar Header / Collapse Toggle */}
      <div className="flex items-center justify-between px-2 py-2 mb-2 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            {role === 'organizer' ? 'Organizer Mode' : 'Volunteer Mode'}
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Role Switcher Banner */}
      <div className="px-1 mb-4">
        <button
          onClick={() => {
            const nextRole = role === 'volunteer' ? 'organizer' : 'volunteer';
            setRole(nextRole);
            setActiveTab(nextRole === 'organizer' ? 'organizer' : 'explore');
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-xs"
        >
          <div className="flex items-center gap-2">
            {role === 'volunteer' ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <ShieldCheck className="w-4 h-4 text-purple-500" />}
            <div className="flex flex-col text-left">
              <span className="font-semibold text-zinc-900 dark:text-white">{role === 'volunteer' ? 'Volunteer View' : 'Organizer View'}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Click to toggle role</span>
            </div>
          </div>
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-1 mb-4 flex flex-col gap-1.5">
        <button
          onClick={() => setIsCreatorModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium text-xs shadow-sm hover:opacity-90 transition-all active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>

        <button
          onClick={() => setIsAIModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-xs font-medium hover:bg-purple-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar">
        {/* Core Workspace */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-semibold font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Workspace
          </div>
          <div className="space-y-0.5">
            {mainNavItems.map(renderNavItem)}
          </div>
        </div>

        {/* Activity & Tracking */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-semibold font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Records & Schedule
          </div>
          <div className="space-y-0.5">
            {activityNavItems.map(renderNavItem)}
          </div>
        </div>

        {/* Communication */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-semibold font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Comm Hub
          </div>
          <div className="space-y-0.5">
            {communicationNavItems.map(renderNavItem)}
          </div>
        </div>

        {/* Account */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-semibold font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Account & OS
          </div>
          <div className="space-y-0.5">
            {accountNavItems.map(renderNavItem)}
          </div>
        </div>
      </div>

      {/* Footer Profile Snippet */}
      <div className="pt-3 mt-auto border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between px-2">
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
        >
          <Avatar name={userProfile.name} src={userProfile.avatar} size="sm" />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold truncate text-zinc-900 dark:text-white leading-tight">{userProfile.name}</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{userProfile.email}</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
