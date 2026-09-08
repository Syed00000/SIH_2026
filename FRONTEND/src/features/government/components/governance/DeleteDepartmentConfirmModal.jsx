import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteDepartmentConfirmModal = ({ isOpen, onClose, onConfirm, department }) => {
  if (!isOpen || !department) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-900 leading-tight">Delete Department</h3>
          <p className="text-xs text-slate-600 mt-1">
            Are you sure you want to delete <strong className="text-slate-900">{department.name}</strong> ({department.deptId || department.code})? This will remove the department record from the state database.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(department.deptId || department.id || department._id)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDepartmentConfirmModal;
