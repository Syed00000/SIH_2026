import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Calendar } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';
import { ADMIN_ROLES_LIST } from '../../data/mockAdminData.js';

const DEPARTMENTS = ['Select department', 'Higher & Technical Education', 'Science & Technology', 'IT & e-Governance', 'Tribal Welfare', 'Urban Development'];
const PRIMARY_ROLES = ['Select primary role', 'Administrator', 'Department Head', 'Technical Officer', 'District Nodal Lead', 'Inspector'];
const ACCESS_LEVELS = ['Select access level', 'Full System Access', 'District Level Access', 'Read & Write', 'Audit Only'];

export const AdminFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
    mobileNumber: '', role: 'Select role', primaryRole: 'Select primary role',
    accessLevel: 'Select access level', district: 'Select district',
    assignedDepartment: 'Select department', employeeId: '', dateOfJoining: '',
    address: '', status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || '', username: initialData.username || initialData.email?.split('@')[0] || '',
        email: initialData.email || '', password: '', confirmPassword: '',
        mobileNumber: initialData.mobileNumber || '', role: initialData.role || 'Select role',
        primaryRole: initialData.primaryRole || 'Administrator', accessLevel: initialData.accessLevel || 'Full System Access',
        district: initialData.district || 'Select district', assignedDepartment: initialData.assignedDepartment || 'Higher & Technical Education',
        employeeId: initialData.employeeId || '', dateOfJoining: initialData.dateOfJoining || '2026-05-24',
        address: initialData.address || '', status: initialData.status || 'Active'
      });
    } else {
      setForm({
        fullName: '', username: '', email: '', password: '', confirmPassword: '',
        mobileNumber: '', role: 'Select role', primaryRole: 'Select primary role',
        accessLevel: 'Select access level', district: 'Select district',
        assignedDepartment: 'Select department', employeeId: '', dateOfJoining: '2026-05-24',
        address: '', status: 'Active'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return setError('Please enter full name');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Please enter a valid email address');
    if (!initialData && form.password && form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.role === 'Select role') return setError('Please select a role');
    if (form.district === 'Select district') return setError('Please select a district');

    onSubmit({ ...form, id: initialData?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-base font-bold text-slate-900">{initialData ? 'Edit Admin' : 'Add New Admin'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {error && <div className="p-2.5 bg-red-50 text-red-700 rounded-lg font-semibold border border-red-200">{error}</div>}

          {/* Section 1: Personal Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter full name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Username <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email ID <span className="text-red-500">*</span></label>
                <input type="email" placeholder="Enter email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
              </div>
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 pr-8 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-7 text-slate-400 cursor-pointer">{showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter phone number" value={form.mobileNumber} onChange={e => setForm({...form, mobileNumber: e.target.value})} required className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
              </div>
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                <input type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="w-full px-3 py-2 pr-8 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none" />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-2.5 top-7 text-slate-400 cursor-pointer">{showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              </div>
            </div>
          </div>

          {/* Section 2: Role & Access */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">Role & Access</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role <span className="text-red-500">*</span></label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-700 outline-none">
                  {['Select role', ...ADMIN_ROLES_LIST.filter(r => r !== 'All Roles')].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Primary Role <span className="text-red-500">*</span></label>
                <select value={form.primaryRole} onChange={e => setForm({...form, primaryRole: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-700 outline-none">
                  {PRIMARY_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Access Level <span className="text-red-500">*</span></label>
                <select value={form.accessLevel} onChange={e => setForm({...form, accessLevel: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-700 outline-none">
                  {ACCESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Administrative Details */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">Administrative Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">District <span className="text-red-500">*</span></label>
                <select value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-700 outline-none">
                  {['Select district', ...JHARKHAND_DISTRICTS_LIST.filter(d => d !== 'All')].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Department</label>
                <select value={form.assignedDepartment} onChange={e => setForm({...form, assignedDepartment: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-700 outline-none">
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employee ID</label>
                <input type="text" placeholder="Enter employee ID (optional)" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                <input type="date" value={form.dateOfJoining} onChange={e => setForm({...form, dateOfJoining: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Address (Optional)</label>
                <input type="text" placeholder="Enter address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl outline-none" />
              </div>
            </div>
          </div>

          {/* Section 4: Status Radio Buttons */}
          <div className="space-y-1.5 pt-1">
            <h4 className="font-bold text-slate-900 text-xs tracking-tight">Status</h4>
            <span className="text-[11px] text-slate-400 block mb-1">Initial Status <span className="text-red-500">*</span></span>
            <div className="flex items-center space-x-5">
              {['Active', 'Suspended', 'Restricted'].map(st => (
                <label key={st} className="flex items-center space-x-2 cursor-pointer text-slate-700 font-medium">
                  <input type="radio" name="admin_status" value={st} checked={form.status === st} onChange={() => setForm({...form, status: st})} className="accent-blue-600 w-3.5 h-3.5" />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs">Save Admin</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminFormModal;
