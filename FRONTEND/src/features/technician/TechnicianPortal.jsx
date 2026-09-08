import React, { useState, useEffect, useMemo } from 'react';
import { TechnicianHeader } from './TechnicianHeader.jsx';
import { TechnicianSidebar } from './TechnicianSidebar.jsx';
import { TechnicianMobileNav } from './TechnicianMobileNav.jsx';
import { TechnicianOverview } from './TechnicianOverview.jsx';
import { TechnicianProblemsList } from './TechnicianProblemsList.jsx';
import { TechnicianProfileTab } from './TechnicianProfileTab.jsx';
import { TechnicianProblemDetailModal } from './TechnicianProblemDetailModal.jsx';
import { CompleteTaskModal } from './CompleteTaskModal.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { citizenService } from '../citizen/services/citizenService.js';
import apiClient from '../../infrastructure/api/client.js';
import { Sparkles } from 'lucide-react';

export const TechnicianPortal = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completingTask, setCompletingTask] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);
  const [bannerNotice, setBannerNotice] = useState('');

  const tId = (user?.technicianId || user?.id || user?._id || '').toUpperCase();
  const tName = (user?.fullName || user?.name || '').toLowerCase();

  const loadTasks = async (isRef = false) => {
    try {
      if (isRef) setRefreshing(true); else setLoading(true);
      const res = await citizenService.fetchChallenges({ limit: 200 });
      const all = res?.challenges || (Array.isArray(res) ? res : []) || [];
      const myTasks = all.filter((c) => {
        const at = c.assignedTechnician;
        if (!at) return false;
        const atId = (at.technicianId || at.id || '').toUpperCase();
        if (atId && (atId === tId || tId.includes(atId) || atId.includes(tId))) return true;
        const atName = (at.name || '').toLowerCase();
        return atName && (atName === tName || tName.includes(atName) || atName.includes(tName));
      });
      setTasks(myTasks);
    } catch {
      // Keep existing
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadTasks(); }, [tId, tName]);

  const handleAcceptTask = async (challenge) => {
    const targetId = challenge.challengeId || challenge.id || challenge._id;
    try {
      setAcceptingId(targetId);
      const payload = {
        assignedTechnician: { ...challenge.assignedTechnician, status: 'Accepted', acceptedAt: new Date() }
      };
      await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      setTasks((prev) => prev.map((t) => ((t.challengeId || t.id || t._id) === targetId ? { ...t, assignedTechnician: { ...t.assignedTechnician, status: 'Accepted' } } : t)));
      if (selectedChallenge && (selectedChallenge.challengeId || selectedChallenge.id) === targetId) {
        setSelectedChallenge((prev) => ({ ...prev, assignedTechnician: { ...prev.assignedTechnician, status: 'Accepted' } }));
      }
      setBannerNotice(`Problem ${targetId} accepted! Citizen coordinates unlocked.`);
      setTimeout(() => setBannerNotice(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept task');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleCompleteTask = async (challenge, remarks) => {
    const targetId = challenge.challengeId || challenge.id || challenge._id;
    try {
      setIsSubmittingComplete(true);
      const payload = {
        status: 'Resolved',
        assignedTechnician: {
          ...challenge.assignedTechnician,
          status: 'Completed',
          completedAt: new Date(),
          completionRemarks: remarks
        }
      };
      await apiClient.patch(`citizen/challenges/${targetId}/triage`, payload);
      setTasks((prev) => prev.map((t) => ((t.challengeId || t.id || t._id) === targetId ? { ...t, status: 'Resolved', assignedTechnician: { ...t.assignedTechnician, status: 'Completed', completionRemarks: remarks } } : t)));
      if (selectedChallenge && (selectedChallenge.challengeId || selectedChallenge.id) === targetId) {
        setSelectedChallenge((prev) => ({ ...prev, status: 'Resolved', assignedTechnician: { ...prev.assignedTechnician, status: 'Completed', completionRemarks: remarks } }));
      }
      setCompletingTask(null);
      setBannerNotice(`Problem ${targetId} marked as Done & Resolved!`);
      setTimeout(() => setBannerNotice(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete task');
    } finally {
      setIsSubmittingComplete(false);
    }
  };

  const counts = useMemo(() => {
    const pending = tasks.filter((t) => t.assignedTechnician?.status !== 'Accepted' && t.assignedTechnician?.status !== 'Completed' && t.status !== 'Resolved').length;
    const active = tasks.filter((t) => t.assignedTechnician?.status === 'Accepted' && t.status !== 'Resolved').length;
    const completed = tasks.filter((t) => t.assignedTechnician?.status === 'Completed' || t.status === 'Resolved').length;
    return { total: tasks.length, pending, active, completed };
  }, [tasks]);

  return (
    <div className="h-screen w-full flex flex-col bg-white text-slate-800 font-sans select-none overflow-hidden">
      <TechnicianHeader
        user={user} onLogout={onLogout} onRefresh={() => loadTasks(true)}
        refreshing={refreshing} onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <TechnicianSidebar
          activeTab={activeTab} setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout} counts={counts}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-white flex flex-col justify-between pb-24 md:pb-6">
          <div className="w-full max-w-[1500px] space-y-5">
            {bannerNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bannerNotice}</span>
              </div>
            )}

            {activeTab === 'home' && (
              <TechnicianOverview
                user={user} tasks={tasks} counts={counts} loading={loading}
                onNavigateTasks={() => setActiveTab('tasks')}
                onSelectChallenge={(t) => setSelectedChallenge(t)}
              />
            )}

            {activeTab === 'tasks' && (
              <TechnicianProblemsList
                tasks={tasks} loading={loading}
                onSelectChallenge={(t) => setSelectedChallenge(t)}
              />
            )}

            {activeTab === 'profile' && <TechnicianProfileTab user={user} counts={counts} />}
          </div>

          <div className="mt-8 pt-4">
            <GovernmentFooter />
          </div>
        </main>
      </div>

      <TechnicianMobileNav activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

      <TechnicianProblemDetailModal
        challenge={selectedChallenge}
        isOpen={Boolean(selectedChallenge)}
        onClose={() => setSelectedChallenge(null)}
        onAccept={handleAcceptTask}
        onOpenComplete={(t) => setCompletingTask(t)}
        acceptingId={acceptingId}
      />

      <CompleteTaskModal
        challenge={completingTask}
        isOpen={Boolean(completingTask)}
        onClose={() => setCompletingTask(null)}
        onConfirm={handleCompleteTask}
        completing={isSubmittingComplete}
      />
    </div>
  );
};

export default TechnicianPortal;
