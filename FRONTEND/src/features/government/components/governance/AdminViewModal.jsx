import React from 'react';
import { X, ShieldCheck, Mail, Phone, MapPin, Calendar, Clock, User } from 'lucide-react';

export const AdminViewModal = ({ isOpen, onClose, admin }) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>
              <p className="text-[11px] text-slate-500 font-medium">Access details and jurisdiction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Main User Banner */}
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-xs">
              {admin.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                {admin.fullName}
              </h4>
              <p className="text-xs text-slate-500 font-mono truncate mt-0.5">{admin.email}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-100/70 text-blue-700 text-[10px] font-bold rounded-md">
                {admin.role}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Number</span>
              </span>
              <span className="font-bold text-slate-900">{admin.mobileNumber}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Assigned District</span>
              </span>
              <span className="font-bold text-slate-900">{admin.district}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Last Login Session</span>
              </span>
              <span className="font-medium text-slate-700">{admin.lastLogin}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Status</span>
              </span>
              <span
                className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                  admin.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : admin.status === 'Suspended'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {admin.status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewModal;
