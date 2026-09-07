import React from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  LogOut,
  Layers,
  Landmark,
  BadgeCheck,
  Clock,
  KeyRound,
  FileText,
  UserCheck,
  Hash
} from 'lucide-react';

export const NodalProfilePanel = ({
  user,
  onLogout,
  onNavigateChallenges,
  onNavigateUniversities
}) => {
  // Real data strictly from authenticated user / database - no hardcoded fallbacks
  const fullName = user?.fullName || user?.name || '—';
  const email = user?.email || '—';
  const mobile = user?.mobileNumber || user?.phone || '—';
  const role = user?.role ? String(user.role).toUpperCase() : '—';
  const district = user?.district || user?.profile?.district || user?.profile?.location?.district || '—';
  const institution = user?.profile?.institutionName || user?.profile?.organizationName || user?.profile?.adminDetails?.assignedDepartment || user?.department || '—';
  const designation = user?.profile?.designation || user?.profile?.nodalOfficerDesignation || user?.profile?.adminDetails?.primaryRole || user?.designation || '—';
  const employeeId = user?.profile?.adminDetails?.employeeId || '—';
  const assignedDepartment = user?.profile?.adminDetails?.assignedDepartment || user?.department || '—';
  const accessLevel = user?.profile?.adminDetails?.accessLevel || '—';
  const accountStatus = user?.accountStatus || (user?.isActive ? 'ACTIVE' : '—');
  const isVerified = Boolean(user?.emailVerified ?? user?.isEmailVerified);
  const recordId = user?.id || user?._id || '—';

  const avatarInitials = fullName !== '—'
    ? fullName
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-12 text-left select-none animate-in fade-in duration-150">
      {/* 1. Official Officer Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-slate-100">
          <div className="flex items-start sm:items-center space-x-4">
            {/* Officer Avatar Initials */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-2xs">
              {avatarInitials}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {fullName}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#047857]/10 text-[#047857] border border-[#047857]/20">
                    <BadgeCheck className="w-3.5 h-3.5 text-[#047857]" />
                    Verified
                  </span>
                )}
                <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ROLE: {role}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {designation}
              </p>

              {district !== '—' && (
                <p className="text-[11.5px] text-slate-500 font-normal flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{district} District &bull; Government of Jharkhand</span>
                </p>
              )}
            </div>
          </div>

          {/* Right Action: Sign Out */}
          {onLogout && (
            <div className="shrink-0">
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                title="Sign Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Header Metadata Ribbon (Real DB Values) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500">Institution:</span>
            <span className="font-semibold text-slate-900">{institution}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500">Email:</span>
            <span className="font-semibold text-slate-900">{email}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500">Contact:</span>
            <span className="font-semibold text-slate-900">{mobile}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-500">Account:</span>
            <span className="font-bold text-emerald-700 uppercase">{accountStatus}</span>
          </div>
        </div>
      </div>

      {/* 2. Structured Information Grid (Real Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Official Credentials */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#047857]" />
                Official Credentials
              </h2>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                {accountStatus}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Designated Official</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{fullName}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Registered Email</span>
                <span className="font-medium text-slate-800 block mt-0.5">{email}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Phone Verification</span>
                <span className="font-medium text-slate-800 block mt-0.5">{mobile}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">System Role</span>
                <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-slate-800">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>{role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Authenticated via State Government Database
          </div>
        </div>

        {/* Card 2: Administrative Jurisdiction */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#047857]" />
                Jurisdiction & Office
              </h2>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Government
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Assigned District</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {district !== '—' ? `${district} District` : '—'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Institution / Department</span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {institution}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Designation</span>
                <span className="font-medium text-slate-800 block mt-0.5">
                  {designation}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Database Record ID</span>
                <span className="font-mono text-[11px] text-slate-600 block mt-0.5 truncate">
                  {recordId}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Government of Jharkhand Registry
          </div>
        </div>

        {/* Card 3: Operations & Shortcuts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#047857]" />
                Portal Operations
              </h2>
              <span className="text-[10px] font-bold text-[#047857] bg-[#047857]/10 px-2 py-0.5 rounded">
                Navigation
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {onNavigateChallenges && (
                <button
                  onClick={() => onNavigateChallenges('All Status')}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-[#047857] transition-colors">
                      Citizen Challenges
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      District submissions waiting for triage
                    </span>
                  </div>
                  <Layers className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" />
                </button>
              )}

              {onNavigateUniversities && (
                <button
                  onClick={onNavigateUniversities}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-[#047857] transition-colors">
                      HEI Directory
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Accredited universities & problem allocations
                    </span>
                  </div>
                  <Landmark className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 ml-2" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Quick links to operational modules
          </div>
        </div>
      </div>

      {/* 3. Official Department Security & Verification Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3 text-xs text-slate-600">
        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          <strong>Official Record:</strong> Profile data retrieved directly from the authenticated Government of Jharkhand session and JoharSetu database.
        </span>
      </div>
    </div>
  );
};

export default NodalProfilePanel;
