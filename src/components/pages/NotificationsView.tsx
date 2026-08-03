import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge, EmptyState } from '../common/UIComponents';
import { Bell, CheckCheck, Clock, Award, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { NotificationItem, NavigationTab } from '../../types';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'shift': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'approval': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'system': return <Award className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Notification Inbox
            </h1>
            <Badge variant="purple" icon={<Bell className="w-3.5 h-3.5" />}>
              {notifications.filter((n) => !n.read).length} Unread
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Real-time updates on shift reminders, hour approvals, and team messages.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={markAllNotificationsAsRead}
          icon={<CheckCheck className="w-4 h-4" />}
          className="text-xs"
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {['all', 'shift', 'approval', 'message', 'system'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              filterType === cat
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-zinc-400" />}
          title="Inbox Empty"
          description="You are all caught up! No notifications matching this filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              hoverable
              className={`p-4 flex items-start justify-between gap-4 transition-all ${
                !item.read ? 'border-l-4 border-l-purple-500 bg-purple-500/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{item.title}</h3>
                    {!item.read && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-zinc-400 font-mono">{item.timestamp}</span>
                </div>
              </div>

              {item.linkTab && (
                <Button size="sm" variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>
                  View
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
