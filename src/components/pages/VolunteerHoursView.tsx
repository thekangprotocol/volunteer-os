import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Card, StatCard, Badge, ProgressBar } from '../common/UIComponents';
import { Clock, ShieldCheck, Download, PlusCircle, CheckCircle, FileText, Lock, Award, Sparkles, Building } from 'lucide-react';
import { CauseCategory } from '../../types';

export const VolunteerHoursView: React.FC = () => {
  const { hoursLogs, passport, logManualHours, showToast } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [hours, setHours] = useState('3.0');
  const [category, setCategory] = useState<CauseCategory>('Food Security');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supervisorName, setSupervisorName] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [notes, setNotes] = useState('');

  const totalVerifiedHours = hoursLogs
    .filter((l) => l.status === 'verified')
    .reduce((sum, l) => sum + l.hours, 0);

  const pendingHours = hoursLogs
    .filter((l) => l.status === 'pending')
    .reduce((sum, l) => sum + l.hours, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logManualHours({
      opportunityTitle: title,
      organizer,
      category,
      hours: parseFloat(hours) || 1,
      date,
      supervisorName,
      supervisorEmail,
      notes
    });
    setIsLogModalOpen(false);
    setTitle('');
    setOrganizer('');
  };

  const handleExportPDF = () => {
    showToast('Generating official signed PDF transcript certificate...');
    setTimeout(() => {
      showToast('Transcript downloaded: VolunteerOS_Official_Transcript_ZT.pdf');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-100/90 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Verified Volunteer Hours
            </h1>
            <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              Cryptographically Audited
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Track, verify, and export official community service certificates signed by non-profit leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            icon={<Download className="w-4 h-4" />}
            className="text-xs"
          >
            Export PDF Transcript
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsLogModalOpen(true)}
            icon={<PlusCircle className="w-4 h-4" />}
            className="text-xs"
          >
            Log Hours Manually
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Verified Hours"
          value={`${totalVerifiedHours} hrs`}
          subtitle="100% Verified by Organizers"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Pending Verification"
          value={`${pendingHours} hrs`}
          subtitle="Awaiting Supervisor Sign-off"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
        <StatCard
          title="Milestone Target"
          value="150 hrs"
          subtitle="7.5 hrs remaining to next badge"
          icon={<Award className="w-5 h-5 text-purple-500" />}
        />
      </div>

      {/* Milestone Progress Bar Card */}
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-900 dark:text-white">Centurion Badge II Progress (150 Hours Goal)</span>
          <span className="text-zinc-500">{totalVerifiedHours} / 150 hrs ({Math.round((totalVerifiedHours / 150) * 100)}%)</span>
        </div>
        <ProgressBar value={totalVerifiedHours} max={150} color="bg-emerald-500" />
      </Card>

      {/* Verified Hours Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            <span>Service Audit Trail</span>
          </h2>
          <span className="text-xs text-zinc-500 font-mono">SHA-256 Hash Guard Active</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 font-mono uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4">Opportunity & Organization</th>
                <th className="p-4">Cause Category</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Date</th>
                <th className="p-4">Verification Certificate Hash</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-900 dark:text-zinc-200">
              {hoursLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-semibold">
                    <div>{log.opportunityTitle}</div>
                    <div className="text-[11px] text-zinc-400 font-normal">{log.organizer} {log.supervisorName ? `• Sup: ${log.supervisorName}` : ''}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-sm">{log.hours} hrs</td>
                  <td className="p-4 text-zinc-500 font-mono">{log.date}</td>
                  <td className="p-4 font-mono text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>{log.verificationHash}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {log.status === 'verified' ? (
                      <Badge variant="success" icon={<CheckCircle className="w-3 h-3" />}>Verified</Badge>
                    ) : (
                      <Badge variant="warning" icon={<Clock className="w-3 h-3" />}>Pending Audit</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Hours Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Log External Volunteer Hours</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Submit your hours performed outside of VolunteerOS. An automated sign-off email will be dispatched to your supervisor.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Activity / Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Garden Clean-up"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Cross Chapter"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Hours Completed</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Supervisor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Supervisor Email</label>
                  <input
                    type="email"
                    placeholder="supervisor@org.com"
                    value={supervisorEmail}
                    onChange={(e) => setSupervisorEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-medium">Notes & Key Impact</label>
                <textarea
                  rows={2}
                  placeholder="Describe your role and impact..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsLogModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Submit Hours for Audit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
