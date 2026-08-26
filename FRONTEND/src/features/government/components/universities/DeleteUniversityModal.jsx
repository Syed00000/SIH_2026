import React, { useState } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';

export const DeleteUniversityModal = ({ university, isOpen, onClose, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !university) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(university._id || university.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-md p-5 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <Trash2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-slate-900">Delete University Confirmation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete <strong className="text-slate-800">{university.name}</strong> ({university.code})?
            </p>
            <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>This will revoke portal access and permanently disable this HEI login.</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isDeleting ? 'Deleting...' : 'Delete University'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUniversityModal;
