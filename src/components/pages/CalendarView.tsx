import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, Badge } from '../common/UIComponents';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Download, CheckCircle, ExternalLink } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { opportunities, setSelectedOpportunity, showToast } = useApp();
  const [currentMonth, setCurrentMonth] = useState('August 2026');
  const [calendarMode, setCalendarMode] = useState<'month' | 'agenda'>('month');

  const registeredShifts = opportunities.filter((o) => o.applied || o.saved);

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map events to specific calendar days
  const eventsByDay: Record<number, typeof registeredShifts> = {
    1: registeredShifts.filter((_, i) => i % 4 === 0),
    3: registeredShifts.filter((_, i) => i % 3 === 0),
    8: registeredShifts.slice(0, 1),
    9: registeredShifts.slice(1, 2),
    15: registeredShifts.slice(2, 3),
  };

  const handleSyncCalendar = () => {
    showToast('Exported iCal feed (.ics). Subscribed to Google Calendar sync!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Shift Schedule & Calendar
            </h1>
            <Badge variant="info" icon={<CalendarIcon className="w-3.5 h-3.5" />}>
              Synced Live
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            View your upcoming shift commitments, event times, and location directions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setCalendarMode('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                calendarMode === 'month' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'text-zinc-500'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setCalendarMode('agenda')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                calendarMode === 'agenda' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm' : 'text-zinc-500'
              }`}
            >
              Agenda List
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleSyncCalendar}
            icon={<Download className="w-4 h-4" />}
            className="text-xs"
          >
            Sync iCal / Google
          </Button>
        </div>
      </div>

      {calendarMode === 'month' ? (
        <Card className="p-6 space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-semibold text-zinc-400">
            {dayNames.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayEvents = eventsByDay[day] || [];
              const isToday = day === 3;
              return (
                <div
                  key={day}
                  className={`min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${isToday ? 'text-emerald-500' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {day}
                    </span>
                    {isToday && <span className="text-[9px] font-mono px-1 rounded bg-emerald-500 text-white font-bold">TODAY</span>}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedOpportunity(ev)}
                        className="p-1 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-medium truncate cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* Agenda List View */
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Upcoming Shift Commitments</h2>
          <div className="space-y-3">
            {registeredShifts.map((opp) => (
              <Card key={opp.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Confirmed Shift</Badge>
                    <span className="text-xs text-zinc-400 font-mono">• {opp.date} ({opp.time})</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-white">{opp.title}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{opp.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setSelectedOpportunity(opp)} icon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Shift Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
