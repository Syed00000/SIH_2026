import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { AdminFormPersonalSection } from './AdminFormPersonalSection.jsx';
import { AdminFormRoleSection } from './AdminFormRoleSection.jsx';

export const AdminEditPanel = ({ admin, onBack, onSave }) => {
  const isEditing = Boolean(admin);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (admin) {
      setForm({
        fullName: admin.fullName || '',
        username: admin.username || admin.email?.split('@')[0] || '',
        email: admin.email || '',
        password: '',
        confirmPassword: '',
        mobileNumber: admin.mobileNumber || '',
        role: admin.role || 'Nodal Officer',
        primaryRole: admin.primaryRole || 'District Nodal Lead',
        accessLevel: admin.accessLevel || 'District Level Access',
        district: admin.district || 'Select district',
        assignedDepartment: admin.assignedDepartment || 'Higher & Technical Education',
        employeeId: admin.employeeId || '',
        dateOfJoining: admin.dateOfJoining || '2026-05-24',
        address: admin.address || '',
        status: admin.status || 'Active'
      });
    }
    setError('');
  }, [admin]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return setError('Please enter full name');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Please enter a valid email address');
    if (form.password && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!admin && !form.password) {
      return setError('Password is required for new administrator');
    }
    if (form.district === 'Select district') return setError('Please select a district');

    const targetId = admin?.id || admin?._id;
    const payload = {
      ...form,
      role: form.role || 'Nodal Officer',
      primaryRole: form.primaryRole || 'District Nodal Lead',
      id: targetId,
      _id: targetId
    };

    if (admin && !form.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    setIsSubmitting(true);
    try {
      await onSave(payload);
    } catch (err) {
      setError(err.message || 'Failed to save administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 select-none max-w-[1200px] mx-auto pb-10">
      {/* Top Header Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to Admin Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {isEditing ? `Edit: ${admin?.fullName || 'Administrator'}` : 'Register New System Administrator'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">Configure credentials, role scopes, and jurisdictional access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="admin-edit-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Saving...' : 'Save Administrator'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <form id="admin-edit-form" onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 text-xs">
        <AdminFormPersonalSection form={form} onChange={handleFieldChange} isEdit={isEditing} />

        <div className="pt-2 border-t border-slate-100">
          <AdminFormRoleSection form={form} onChange={handleFieldChange} />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-xs mb-2">Account Status</h4>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Active"
                checked={form.status === 'Active'}
                onChange={() => handleFieldChange('status', 'Active')}
              />
              <span className="text-emerald-700 font-bold">Active</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Suspended"
                checked={form.status === 'Suspended'}
                onChange={() => handleFieldChange('status', 'Suspended')}
              />
              <span className="text-amber-700 font-bold">Suspended</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Removed"
                checked={form.status === 'Removed'}
                onChange={() => handleFieldChange('status', 'Removed')}
              />
              <span className="text-red-700 font-bold">Removed</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditPanel;
