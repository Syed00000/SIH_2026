import React, { useState, useEffect, useMemo } from 'react';
import { BudgetOfficerHeader } from './BudgetOfficerHeader.jsx';
import { BudgetOfficerSidebar } from './BudgetOfficerSidebar.jsx';
import { BudgetOfficerTasksPanel } from './BudgetOfficerTasksPanel.jsx';
import { projectCsrSyncService } from '../government/services/projectCsrSyncService.js';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const BudgetOfficerPortal = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerNotice, setBannerNotice] = useState('');

  const officerId = user?.officerId || user?.id || user?._id || 'BO-1';
  
  const loadTasks = async (isRef = false) => {
    try {
      if (isRef) setRefreshing(true); else setLoading(true);
      await projectCsrSyncService.initializeFromBackend();
      const allProjects = projectCsrSyncService.getActiveProjects();
      
      // Filter projects assigned to this budget officer by ID or Name
      const myTasks = allProjects.filter(p => {
        const b = p.assignedBudgetOfficer;
        if (!b) return false;
        
        const assignedId = b.officerId || b.id || b._id;
        const assignedName = b.name;
        
        const matchesId = assignedId && (assignedId === officerId || assignedId === user?.id || assignedId === user?._id);
        const matchesName = assignedName && (assignedName.toLowerCase() === (user?.fullName || '').toLowerCase() || assignedName.toLowerCase() === (user?.name || '').toLowerCase());
        
        return matchesId || matchesName;
      });
      setTasks(myTasks);
    } catch (e) {
      console.warn("Failed to load budgets", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const unsubscribe = projectCsrSyncService.subscribe((_, data) => {
        if (data?.updatedProjects) {
          const myTasks = data.updatedProjects.filter(p => {
            const b = p.assignedBudgetOfficer;
            if (!b) return false;
            
            const assignedId = b.officerId || b.id || b._id;
            const assignedName = b.name;
            
            const matchesId = assignedId && (assignedId === officerId || assignedId === user?.id || assignedId === user?._id);
            const matchesName = assignedName && (assignedName.toLowerCase() === (user?.fullName || '').toLowerCase() || assignedName.toLowerCase() === (user?.name || '').toLowerCase());
            
            return matchesId || matchesName;
          });
          setTasks(myTasks);
        }
    });
    return unsubscribe;
  }, [officerId]);

  const handleSubmitBudget = async (task, actualBudgetDetails) => {
    try {
      projectCsrSyncService.submitActualBudget(task.id || task.challengeId || task._id, actualBudgetDetails);
      const updatedProjects = projectCsrSyncService.getActiveProjects();
      const myTasks = updatedProjects.filter(p => p.assignedBudgetOfficer?.officerId === officerId);
      setTasks(myTasks);
      
      setBannerNotice(`Actual budget for ${task.challengeId || 'task'} prepared and sent to Department!`);
      setTimeout(() => setBannerNotice(''), 5000);
    } catch (err) {
      alert("Failed to submit actual budget");
    }
  };

  const counts = useMemo(() => {
    const pending = tasks.filter(t => t.assignedBudgetOfficer?.status !== 'Submitted').length;
    const completed = tasks.filter(t => t.assignedBudgetOfficer?.status === 'Submitted').length;
    return { total: tasks.length, pending, completed };
  }, [tasks]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-800 font-sans select-none overflow-hidden">
      <BudgetOfficerHeader
        user={user} 
        onLogout={onLogout} 
        onRefresh={() => loadTasks(true)}
        refreshing={refreshing} 
        onMenuClick={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <BudgetOfficerSidebar
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSidebarExpanded={isSidebarExpanded} 
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout} 
          counts={counts}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-50 flex flex-col justify-between pb-24 md:pb-6 custom-scrollbar">
          <div className="w-full max-w-[1500px] space-y-5">
            {bannerNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-slideUp">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{bannerNotice}</span>
              </div>
            )}

            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome, {user?.fullName || 'Budget Officer'}</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Review preliminary estimates and prepare actual budgets for assigned civic problems.</p>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-[#007A61]/10 rounded-full items-center justify-center border border-[#007A61]/20">
                    <ShieldCheck className="w-6 h-6 text-[#007A61]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setActiveTab('tasks')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-[#007A61]/50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Pending Budgets</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{counts.pending}</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                      <span className="text-amber-600 font-bold">!</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setActiveTab('tasks')}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-[#007A61]/50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Prepared & Submitted</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{counts.completed}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#007A61]/10 rounded-full flex items-center justify-center border border-[#007A61]/20">
                      <span className="text-[#007A61] font-bold">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <BudgetOfficerTasksPanel
                tasks={tasks} 
                loading={loading}
                onSubmitBudget={handleSubmitBudget}
              />
            )}
          </div>

          <div className="mt-8 pt-4">
            <GovernmentFooter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BudgetOfficerPortal;
