import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { AdminFormPersonalSection } from './AdminFormPersonalSection.jsx';
import { AdminFormRoleSection } from './AdminFormRoleSection.jsx';

export const AdminFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    role: 'Nodal Officer',
    primaryRole: 'District Nodal Lead',
    accessLevel: 'District Level Access',
    district: 'Select district',
    assignedDepartment: 'Higher & Technical Education',
    employeeId: '',
    dateOfJoining: '2026-05-24',
    address: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        username: initialData.username || initialData.email?.split('@')[0] || '',
        email: initialData.email || '',
        password: '',
        confirmPassword: '',
        mobileNumber: initialData.mobileNumber || '',
        role: initialData.role || 'Nodal Officer',
        primaryRole: initialData.primaryRole || 'District Nodal Lead',
        accessLevel: initialData.accessLevel || 'District Level Access',
        district: initialData.district || 'Select district',
        assignedDepartment: initialData.assignedDepartment || 'Higher & Technical Education',
        employeeId: initialData.employeeId || '',
        dateOfJoining: initialData.dateOfJoining || '2026-05-24',
        address: initialData.address || '',
        status: initialData.status || 'Active'
      });
    } else {
      setForm({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        role: 'Nodal Officer',
        primaryRole: 'District Nodal Lead',
        accessLevel: 'District Level Access',
        district: 'Select district',
        assignedDepartment: 'Higher & Technical Education',
        employeeId: '',
        dateOfJoining: '2026-05-24',
        address: '',
        status: 'Active'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return setError('Please enter full name');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Please enter a valid email address');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!initialData && !form.password) {
      return setError('Password is required for new administrator');
    }
    if (form.district === 'Select district') return setError('Please select a district');

    const targetId = initialData?.id || initialData?._id;
    const payload = {
      ...form,
      role: form.role || 'Nodal Officer',
      primaryRole: form.primaryRole || 'District Nodal Lead',
      id: targetId,
      _id: targetId
    };

    if (initialData && !form.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">{initialData ? 'Edit Administrator' : 'Add New Administrator'}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-md font-semibold border border-red-200">
              {error}
            </div>
          )}

          <AdminFormPersonalSection
            form={form}
            onChange={handleFieldChange}
            isEdit={Boolean(initialData)}
          />

          <AdminFormRoleSection
            form={form}
            onChange={handleFieldChange}
          />

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer text-xs shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-md font-semibold transition-colors cursor-pointer text-xs shadow-xs"
            >
              {initialData ? 'Save Changes' : 'Create Administrator'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;
