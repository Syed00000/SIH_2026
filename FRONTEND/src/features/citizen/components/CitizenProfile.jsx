import React from 'react';
import {
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';

export const CitizenProfile = ({ user, onChangeTab, onLogout }) => {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
      window.location.href = '/login';
    }
  };

  const citizenName = user?.fullName || 'Tauqueer Wasi';
  const citizenRole = user?.role || 'CITIZEN';
  const citizenPhone = user?.mobileNumber || '9876543210';
  const citizenEmail = user?.email || 'tauqueer.citizen@joharsetu.gov.in';

  return (
    <div className="space-y-4 text-left pb-20">
      {/* Citizen ID Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#065f46] text-white p-5 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xl font-black">
            {citizenName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-extrabold tracking-tight">{citizenName}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-emerald-100 font-medium">Role: {citizenRole}</p>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-200 mt-1">
              <MapPin className="w-3 h-3" />
              <span>Ranchi, Jharkhand</span>
            </div>
          </div>
        </div>

        {/* Badges / Impact Points */}
        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="block text-xs font-bold text-emerald-200">Community Rank</span>
            <span className="text-sm font-black text-white flex items-center justify-center space-x-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Active Citizen</span>
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <span className="block text-xs font-bold text-emerald-200">Issues Solved</span>
            <span className="text-sm font-black text-white flex items-center justify-center space-x-1 mt-0.5">
              <Award className="w-3.5 h-3.5 text-emerald-300" />
              <span>1 Resolved</span>
            </span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Registered Information
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Mobile
            </span>
            <span className="font-bold text-slate-800">{citizenPhone}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Email
            </span>
            <span className="font-bold text-slate-800 truncate max-w-[200px]">{citizenEmail}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              State Jurisdiction
            </span>
            <span className="font-bold text-emerald-800">Government of Jharkhand</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Options */}
      <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-2xs divide-y divide-slate-50">
        <button
          onClick={() => onChangeTab('challenges')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>My Submitted Problems</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onChangeTab('updates')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>State Innovation Guidelines</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => alert('Support helpline: 1800-345-6789 (Jharkhand State Innovation Council)')}
          className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-4 h-4 text-sky-700" />
            <span>Help Center & FAQs</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={handleSignOut}
          className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Portal</span>
        </button>
      </div>
    </div>
  );
};

export default CitizenProfile;
