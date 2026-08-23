import React, { useState } from 'react';
import { User, Building2, Briefcase, Mail, Phone, MapPin, Award, ShieldCheck, Globe, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';

export const RoleProfile = ({ user, onRefresh }) => {
  if (!user) return null;

  const role = (user.role || 'CITIZEN').toUpperCase();
  const profile = user.profile || {};

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-blue-500/20">
              {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    role === 'CITIZEN'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : role === 'UNIVERSITY'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {role}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.mobileNumber}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 ${
                user.emailVerified
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {user.emailVerified ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
              <span>{user.emailVerified ? 'Email Verified' : 'Email Unverified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Details Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            {role === 'CITIZEN' && <MapPin className="w-5 h-5 text-blue-600" />}
            {role === 'UNIVERSITY' && <Building2 className="w-5 h-5 text-purple-600" />}
            {role === 'INDUSTRY' && <Briefcase className="w-5 h-5 text-emerald-600" />}
            <span>{role} Profile Information</span>
          </h3>
        </div>

        {/* CITIZEN PROFILE DISPLAY */}
        {role === 'CITIZEN' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">District</span>
              <span className="text-slate-900 font-bold text-sm">{profile.location?.district || profile.district || 'Ranchi'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Block / ULB</span>
              <span className="text-slate-900 font-bold text-sm">{profile.location?.blockOrULB || profile.blockOrULB || 'Kanke'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Panchayat / Ward</span>
              <span className="text-slate-900 font-bold text-sm">{profile.location?.panchayatOrWard || profile.panchayatOrWard || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Preferred Language</span>
              <span className="text-blue-600 font-bold text-sm">{profile.preferredLanguage || 'HINDI'}</span>
            </div>
          </div>
        )}

        {/* UNIVERSITY PROFILE DISPLAY */}
        {role === 'UNIVERSITY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Institution Name</span>
              <span className="text-slate-900 font-bold text-sm">{profile.institutionName || 'BIT Mesra'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">AISHE Code</span>
              <span className="text-purple-600 font-mono font-bold text-sm">{profile.aisheCode || 'U-0205'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Institution Type</span>
              <span className="text-slate-900 font-bold text-sm">{profile.institutionType || 'STATE_UNIVERSITY'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Nodal Officer Designation</span>
              <span className="text-slate-900 font-bold text-sm">{profile.nodalOfficerDesignation || 'Dean R&D'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Academic Focus Domains</span>
              <div className="flex flex-wrap gap-1.5">
                {(profile.academicFocusDomains || ['AI_IT', 'WATER', 'CIVIL']).map((domain) => (
                  <span key={domain} className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INDUSTRY PROFILE DISPLAY */}
        {role === 'INDUSTRY' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Organization Name</span>
              <span className="text-slate-900 font-bold text-sm">{profile.organizationName || 'Tata Steel CSR'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Entity Type</span>
              <span className="text-emerald-700 font-bold text-sm">{profile.entityType || 'CORPORATE'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">Primary Contact Designation</span>
              <span className="text-slate-900 font-bold text-sm">{profile.primaryContactDesignation || 'Head of CSR'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-1">CIN / GSTIN / NGO Darpan</span>
              <span className="text-slate-900 font-mono text-sm">{profile.cin || profile.gstin || profile.ngoDarpanId || 'N/A'}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
              <span className="text-xs font-semibold uppercase text-slate-500 block mb-2">Support Sectors</span>
              <div className="flex flex-wrap gap-1.5">
                {(profile.supportSectors || ['WATER', 'INFRASTRUCTURE', 'EDUCATION']).map((sector) => (
                  <span key={sector} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleProfile;
