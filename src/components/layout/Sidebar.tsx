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
  Sparkles,
  Layers,
  FileSpreadsheet
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
    setIsImportModalOpen,
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

  // Separate Volunteer Navigation Items
  const volunteerNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'explore', label: 'Opportunity Feed', icon: <Compass className="w-4 h-4" /> },
    { id: 'passport', label: 'Volunteer Passport', icon: <Award className="w-4 h-4" /> },
    { id: 'hours', label: 'Logged Service Hours', icon: <Clock className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'saved', label: 'Saved Opportunities', icon: <Bookmark className="w-4 h-4" /> },
  ];

  // Separate Organizer Navigation Items
  const organizerNavItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'organizer', label: 'Organizer Studio', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'calendar', label: 'Events Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'hours', label: 'Hour Approvals', icon: <Clock className="w-4 h-4" /> },
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
          <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
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

      {/* Static Workspace Role Badge */}
      <div className="px-1 mb-3">
        <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            {role === 'volunteer' ? <UserCheck className="w-4 h-4 text-zinc-900 dark:text-white" /> : <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-white" />}
            <div className="flex flex-col text-left">
              <span className="font-semibold text-zinc-900 dark:text-white">{role === 'volunteer' ? 'Volunteer Workspace' : 'Organizer Studio'}</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Account Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Quick Actions */}
      {role === 'organizer' && (
        <div className="px-1 mb-3 flex flex-col gap-1.5">
          <button
            onClick={() => setIsCreatorModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs shadow-sm hover:opacity-90 transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import Social Event</span>
          </button>
        </div>
      )}

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar">
        {/* Core Workspace (Distinct per Role) */}
        <div>
          <div className="px-3 mb-1 text-[10px] font-semibold font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            {role === 'organizer' ? 'Organizer Workspace' : 'Volunteer Workspace'}
          </div>
          <div className="space-y-0.5">
            {role === 'organizer' ? organizerNavItems.map(renderNavItem) : volunteerNavItems.map(renderNavItem)}
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
