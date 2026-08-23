import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { RoleProfile } from './RoleProfile.jsx';
import { AccountSettings } from './AccountSettings.jsx';
import {
  LayoutDashboard,
  User,
  FileText,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const DashboardContainer = ({ onNavigate }) => {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-500">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-semibold text-sm">Loading JoharSetu Dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Authentication Required</h2>
          <p className="text-slate-500 text-xs">Please sign in to access your JoharSetu role dashboard.</p>
          <button
            onClick={() => onNavigate ? onNavigate('/login') : (window.location.href = '/login')}
            className="w-full btn-primary py-3 rounded-xl font-semibold text-sm shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const role = (user.role || 'CITIZEN').toUpperCase();

  const handleLogout = async () => {
    await logout();
    if (onNavigate) {
      onNavigate('/login');
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between flex-shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">JoharSetu</h1>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Jharkhand Portal</span>
            </div>
          </div>

          {/* User Brief Badge */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 truncate block">{user.fullName}</span>
              <span
                className={`inline-block text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  role === 'CITIZEN'
                    ? 'bg-blue-100 text-blue-700'
                    : role === 'UNIVERSITY'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {role}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Challenges</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Email Unverified Alert Bar */}
        {!user.emailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Your email address is unverified. Please verify to enable full portal privileges.</span>
            </div>
            <button
              onClick={() => onNavigate ? onNavigate('/verify-email', { email: user.email }) : (window.location.href = `/verify-email?email=${encodeURIComponent(user.email)}`)}
              className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-amber-700 transition-colors ml-4"
            >
              Verify Email
            </button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user.fullName} 👋
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              Role: <span className="font-bold text-blue-600">{role}</span> | Societal Innovation Hub
            </p>
          </div>

          <button
            onClick={() => setActiveTab('challenges')}
            className="btn-primary text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Challenge</span>
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Submitted Challenges</span>
                <span className="text-3xl font-extrabold text-slate-900">0</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">In Review</span>
                <span className="text-3xl font-extrabold text-amber-600">0</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Solved & Deployed</span>
                <span className="text-3xl font-extrabold text-emerald-600">0</span>
              </div>
            </div>

            {/* Quick Profile Summary */}
            <RoleProfile user={user} />

            {/* My Challenges Placeholder */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">No Challenges Submitted Yet</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Submit local societal challenges or academic/CSR solutions to kickstart university matching.
              </p>
              <button
                onClick={() => setActiveTab('challenges')}
                className="btn-primary text-xs font-semibold px-5 py-2.5 rounded-xl inline-flex items-center space-x-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Your First Challenge</span>
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && <RoleProfile user={user} />}

        {/* MY CHALLENGES TAB (Future Module Placeholder) */}
        {activeTab === 'challenges' && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Challenge Execution Module</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Challenge submission, evidence validation, AI classification, and HEI matching features will connect here upon backend challenge module enablement.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-sm mx-auto">
              Status: <span className="text-emerald-600 font-bold">Ready for API integration</span>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
            <Bell className="w-12 h-12 text-purple-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
            <p className="text-slate-500 text-xs">No new notifications at this time.</p>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && <AccountSettings user={user} />}
      </main>
    </div>
  );
};

export default DashboardContainer;
