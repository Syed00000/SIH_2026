import React, { useState, useEffect } from 'react';
import { X, Landmark, Send, Loader2, Building } from 'lucide-react';
import { departmentService } from '../../../government/services/departmentService.js';
import { universityApiService } from '../../../university/services/universityApiService.js';

import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const PrototypeHandoverModal = ({ isOpen, onClose, project, onHandoverSuccess }) => {
  const [departments, setDepartments] = useState([]);
  const [departmentLevel, setDepartmentLevel] = useState('State Ministry');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDepartmentLevel('State Ministry');
      setSelectedDeptId('');
      setError('');
      fetchDepartments();
    }
  }, [isOpen]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const resDepts = await departmentService.getDepartments({ limit: 100 });
      const depts = resDepts?.data || (Array.isArray(resDepts) ? resDepts : []) || [];
      setDepartments(depts);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(d => d.category === departmentLevel);
  const displayedDepartments = filteredDepartments.length > 0 ? filteredDepartments : departments;

  const handleSubmit = async () => {
    if (!selectedDeptId) {
      setError('Please select a department to handover the prototype.');
      return;
    }

    const selectedDeptObj = departments.find(d => (d.deptId || d.id || d._id) === selectedDeptId);
    if (!selectedDeptObj) return;

    const deptName = selectedDeptObj.district ? `${selectedDeptObj.name} (${selectedDeptObj.district})` : selectedDeptObj.name;

    setIsSubmitting(true);
    setError('');

    try {
      const pId = project.projectId || project.id || project.challengeId || project._id;
      // Triggers 'Deployed' state internally when status is 'Approved'
      const res = await universityApiService.updateGovernmentPrototypeStatus(
        pId,
        'Approved',
        'TRL-9',
        'Handed over to department by Government Admin.',
        'RU001',
        { department: deptName, sendToDepartment: true }
      );
      
      if (res && res.success === false) {
        throw new Error(res.error || 'Failed to update backend status');
      }

      // Sync local frontend memory service
      projectCsrSyncService.deployPrototype(pId, deptName);

      onHandoverSuccess(pId, deptName);
      onClose();
    } catch (err) {
      console.error('Handover error:', err);
      setError(err.message || 'Failed to handover prototype. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Building className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Handover Prototype
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {project.title || 'Prototype Solution'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <p className="text-xs text-emerald-800 font-medium">
              You are about to officially hand over this certified prototype to a specific State Department for public deployment. Once handed over, it will appear in their Department Dashboard.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Landmark className="w-4 h-4 text-[#007A61]" />
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Target Department & Institutional Allocation
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1.5">
                  Administrative Level
                </label>
                <select
                  value={departmentLevel}
                  onChange={(e) => {
                    setDepartmentLevel(e.target.value);
                    setSelectedDeptId('');
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-hidden focus:border-[#007A61] cursor-pointer"
                >
                  <option value="State Ministry">State Ministry</option>
                  <option value="District Department">District Department</option>
                  <option value="Block / Tehsil Office">Block / Tehsil Office</option>
                  <option value="Ward Commissioner">Ward Commissioner</option>
                  <option value="Gram Panchayat">Gram Panchayat</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 mb-1.5">
                  Assign Specific Department
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-hidden focus:border-[#007A61] cursor-pointer"
                  disabled={loading}
                >
                  <option value="">— Select {departmentLevel} —</option>
                  {displayedDepartments.map((d) => {
                    const id = d.deptId || d.id || d._id;
                    const location = d.district ? `(${d.district})` : '';
                    return (
                      <option key={id} value={id}>
                        {d.name} {location}
                      </option>
                    );
                  })}
                </select>
                {loading && <p className="text-[10px] text-slate-500 mt-1">Loading departments...</p>}
                {!loading && displayedDepartments.length === 0 && (
                  <p className="text-[10px] text-amber-600 mt-1 font-medium">
                    No departments registered for this level.
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedDeptId}
            className="px-5 py-2 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00604c] rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Save & Synchronize</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrototypeHandoverModal;
