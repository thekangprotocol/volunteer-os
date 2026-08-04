import React from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { 
  Search, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  Bell, 
  MessageSquare, 
  PanelLeft,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { Avatar } from '../common/UIComponents';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    role, 
    setRole, 
    activeTab, 
    setActiveTab, 
    setIsCommandMenuOpen,
    setIsAIModalOpen,
    unreadNotificationsCount,
    isAuthenticated,
    setIsAuthModalOpen,
    logout,
    userProfile,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  const isDark = theme === 'dark';

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-40 transition-all duration-300">
      <div
        className={`flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-500 ${
          isDark 
            ? 'bg-zinc-950/80 border-zinc-800/80 shadow-black/80 text-white' 
            : 'bg-white/80 border-zinc-200 shadow-zinc-300/30 text-zinc-900'
        }`}
      >
        {/* Left Side: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button 
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => setActiveTab(isAuthenticated ? 'explore' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-transform duration-300 group-hover:scale-105 ${
              isDark ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'
            }`}>
              vOS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none">
                Volunteer<span className="font-light opacity-70">OS</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase opacity-40 font-mono mt-0.5">
                Workspace v2.5
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search & AI Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommandMenuOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
              isDark 
                ? 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700' 
                : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:border-zinc-300'
            }`}
            title="Open Command Launcher"
          >
            <Search className="w-3.5 h-3.5 opacity-60" />
            <span className="hidden md:inline opacity-70">Search OS...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-500/20 text-[10px] opacity-70">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match</span>
          </button>
        </div>

        {/* Right Side: Role Toggle, Notifications, Messages, Theme, User */}
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              {/* Static Locked Role Badge */}
              <div className={`hidden lg:flex items-center px-3 py-1 rounded-xl border text-xs font-mono font-bold tracking-wider uppercase ${
                isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
              }`}>
                <span className="flex items-center gap-1.5">
                  {role === 'volunteer' ? <UserCheck className="w-3.5 h-3.5 text-zinc-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{role === 'organizer' ? 'Organizer Studio' : 'Volunteer Mode'}</span>
                </span>
              </div>

              {/* Messages Quick Button */}
              <button
                onClick={() => setActiveTab('messages')}
                className={`p-2 rounded-xl border transition-colors relative ${
                  activeTab === 'messages'
                    ? isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-200 border-zinc-300 text-zinc-950'
                    : isDark ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
                title="Messages"
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              {/* Notifications Quick Button */}
              <button
                onClick={() => setActiveTab('notifications')}
                className={`p-2 rounded-xl border transition-colors relative ${
                  activeTab === 'notifications'
                    ? isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-200 border-zinc-300 text-zinc-950'
                    : isDark ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile / Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-1">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="View Profile"
              >
                <Avatar name={userProfile.name} src={userProfile.avatar} size="sm" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium text-xs shadow-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
