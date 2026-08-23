import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card.jsx';
import { Badge } from '../../../shared/components/ui/badge.jsx';

export const RoleProfile = ({ user }) => {
  if (!user) return null;

  const role = (user.role || 'CITIZEN').toUpperCase();
  const profile = user.profile || {};

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-slate-900">{user.fullName}</h2>
              <Badge variant={role === 'CITIZEN' ? 'info' : role === 'UNIVERSITY' ? 'ai' : 'success'}>
                {role}
              </Badge>
            </div>
            <p className="text-slate-500 text-xs mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Email: <strong className="text-slate-700">{user.email}</strong></span>
              <span>Phone: <strong className="text-slate-700">{user.mobileNumber}</strong></span>
            </p>
          </div>

          <div>
            <Badge variant={user.emailVerified ? 'success' : 'warning'}>
              {user.emailVerified ? 'Email Verified' : 'Email Unverified'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Role-Specific Details Grid */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            {role} Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {/* CITIZEN PROFILE DISPLAY */}
          {role === 'CITIZEN' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  District
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.location?.district || profile.district || 'Ranchi'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Block / ULB
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.location?.blockOrULB || profile.blockOrULB || 'Kanke'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Panchayat / Ward
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.location?.panchayatOrWard || profile.panchayatOrWard || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Preferred Language
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.preferredLanguage || 'HINDI'}
                </span>
              </div>
            </div>
          )}

          {/* UNIVERSITY PROFILE DISPLAY */}
          {role === 'UNIVERSITY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Institution Name
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.institutionName || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  AISHE Code
                </span>
                <span className="text-slate-900 font-mono font-bold text-sm">
                  {profile.aisheCode || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Institution Type
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.institutionType || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Nodal Officer Designation
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.nodalOfficerDesignation || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Academic Focus Domains
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.academicFocusDomains || []).map((domain) => (
                    <Badge key={domain} variant="default" className="bg-slate-200 text-slate-800 border-slate-300">
                      {domain}
                    </Badge>
                  ))}
                  {(!profile.academicFocusDomains || profile.academicFocusDomains.length === 0) && (
                    <span className="text-xs text-slate-400">None declared</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INDUSTRY PROFILE DISPLAY */}
          {role === 'INDUSTRY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Organization Name
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.organizationName || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Entity Type
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.entityType || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Primary Contact Designation
                </span>
                <span className="text-slate-900 font-bold text-sm">
                  {profile.primaryContactDesignation || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Registration ID (CIN / GSTIN / NGO ID)
                </span>
                <span className="text-slate-900 font-mono font-bold text-sm">
                  {profile.cin || profile.gstin || profile.ngoDarpanId || 'N/A'}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Support Sectors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(profile.supportSectors || []).map((sector) => (
                    <Badge key={sector} variant="default" className="bg-slate-200 text-slate-800 border-slate-300">
                      {sector}
                    </Badge>
                  ))}
                  {(!profile.supportSectors || profile.supportSectors.length === 0) && (
                    <span className="text-xs text-slate-400">None declared</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleProfile;
