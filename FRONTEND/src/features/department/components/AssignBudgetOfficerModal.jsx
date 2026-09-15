import React, { useState, useEffect } from 'react';
import { X, Search, Calculator, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { budgetOfficerService } from '../../government/services/budgetOfficerService.js';

export const AssignBudgetOfficerModal = ({ isOpen, onClose, problem, officers = [], onAssign }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [liveOfficers, setLiveOfficers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedOfficer(null);
      setSearchQuery('');
      if (officers && officers.length > 0) {
        setLiveOfficers(officers);
      } else {
        fetchLiveOfficers();
      }
    }
  }, [isOpen, officers, problem]);

  const fetchLiveOfficers = async () => {
    try {
      setLoading(true);
      const targetDept = problem?.resolutionDossier?.department || problem?.handoverDepartment;
      const res = await budgetOfficerService.getOfficers(targetDept ? { departmentName: targetDept } : {});
      const list = res?.data?.data || res?.data || (Array.isArray(res) ? res : []) || [];
      setLiveOfficers(list);
    } catch (err) {
      console.warn('Failed to fetch live budget officers:', err);
      setLiveOfficers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !problem) return null;

  const displayOfficers = officers && officers.length > 0 ? officers : liveOfficers;

  const filteredOfficers = displayOfficers.filter(o => {
    const officerName = o.fullName || o.name || '';
    const officerIdStr = o.officerId || o.id || o._id || '';
    const isStatusActive = !o.status || o.status === 'Active';
    return isStatusActive && 
      (officerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
       officerIdStr.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleAssign = () => {
    if (selectedOfficer) {
      onAssign(problem, selectedOfficer);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#007A61]/10 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#007A61]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Assign Budget Officer</h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prototype Budgeting</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                Deployed Prototype
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {problem.challengeId || problem.id}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{problem.title}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{problem.description || problem.problemStatement}</p>
            {(problem.resolutionDossier?.department || problem.handoverDepartment) && (
              <p className="text-[11px] font-semibold text-slate-600 mt-3 flex items-center gap-1.5">
                <span className="text-slate-400">Handed over by:</span> 
                {problem.resolutionDossier?.department || problem.handoverDepartment}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search active budget officers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Available Officers</div>
            
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium text-xs flex items-center justify-center space-x-2 border border-slate-200 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-[#007A61]" />
                <span>Loading budget officers from database...</span>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {filteredOfficers.map(officer => {
                  const oId = officer._id || officer.id || officer.officerId;
                  const isSelected = selectedOfficer?._id === oId || selectedOfficer?.officerId === oId || selectedOfficer?.id === oId;
                  const name = officer.fullName || officer.name || 'Budget Officer';
                  const designation = officer.designation || 'Budget Officer';
                  const pending = typeof officer.pendingTasks === 'number' ? officer.pendingTasks : 0;

                  return (
                    <li 
                      key={oId}
                      onClick={() => setSelectedOfficer(officer)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-emerald-50 border-l-4 border-l-[#007A61]' 
                          : 'bg-white hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isSelected ? 'text-[#007A61]' : 'text-slate-900'}`}>
                            {name}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                            {designation} <span className="text-slate-300 mx-1">•</span> {pending} Pending
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#007A61] mr-2" />
                      )}
                    </li>
                  );
                })}
                
                {filteredOfficers.length === 0 && (
                  <li className="text-center py-8 text-slate-500 text-xs font-medium bg-white px-4 space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="font-bold text-slate-700">No registered budget officers found</p>
                    <p className="text-[11px] text-slate-400">
                      There are currently no active budget officers in the database for this department. Add a Budget Officer under the 'Budget Officers' menu tab.
                    </p>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedOfficer}
            className="px-6 py-2 bg-[#007A61] hover:bg-[#006651] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Assign Officer
          </button>
        </div>

      </div>
    </div>
  );
};
