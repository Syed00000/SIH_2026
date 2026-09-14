import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  Send,
  Loader2,
  MapPin,
  Landmark,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const AiRouteConfirmModal = ({
  isOpen,
  onClose,
  challenge,
  routeType, // 'department' | 'university'
  targetData, // recommendedDepartment or recommendedHEI
  problemScope,
  onConfirm
}) => {
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !challenge || !targetData) return null;

  const isDept = routeType === 'department';
  const wardNo = challenge?.location?.panchayatOrWard || challenge?.wardNumber || '';
  const district = challenge?.location?.district || challenge?.district || 'Jharkhand';
  const block = challenge?.location?.block || '';
  const chlId = challenge?.challengeId || challenge?.id;

  const isWardCategory =
    targetData?.category === 'Ward Commissioner' ||
    targetData?.code?.startsWith?.('WARD') ||
    problemScope?.level === 'WARD';

  const isBlockCategory =
    targetData?.category === 'Block / Tehsil Office' ||
    targetData?.code?.startsWith?.('BLK') ||
    problemScope?.level === 'BLOCK';

  const isRoutineMaintenance =
    !problemScope?.isMacroChallenge || targetData?.isAcademicRequired === false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await onConfirm({
        type: routeType,
        department: isDept ? targetData : undefined,
        university: !isDept ? targetData : undefined,
        remarks: remarks.trim()
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch official routing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col text-slate-900"
        >
          {/* Header */}
          <div
            className={`px-5 py-4 border-b flex items-center justify-between ${
              isDept
                ? isWardCategory
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
                : isRoutineMaintenance
                ? 'bg-amber-50 border-amber-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2.5 text-white rounded-xl shadow-xs shrink-0 ${
                  isDept
                    ? isWardCategory
                      ? 'bg-[#007A61]'
                      : 'bg-slate-800'
                    : isRoutineMaintenance
                    ? 'bg-amber-600'
                    : 'bg-blue-600'
                }`}
              >
                {isDept ? (
                  isWardCategory ? (
                    <MapPin className="w-5 h-5 text-emerald-100" />
                  ) : (
                    <Landmark className="w-5 h-5" />
                  )
                ) : (
                  <GraduationCap className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <span>
                    {isDept
                      ? isWardCategory
                        ? 'Confirm Local Ward Routing'
                        : 'Confirm Line Ministry Routing'
                      : 'Confirm University Lab Allocation'}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isDept
                    ? isWardCategory
                      ? `Grassroots Ward Dispatch • Ward ${wardNo || 'Local'}`
                      : 'State Administrative Department Dispatch'
                    : isRoutineMaintenance
                    ? 'Academic R&D Discretionary Review'
                    : 'Academic Research & Prototyping Cell'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Content */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-medium flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Advisory for Routine Maintenance on Academic Lab */}
            {!isDept && isRoutineMaintenance && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Routine Ward Maintenance Notice</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-amber-800">
                  This issue is categorized as routine local maintenance. University academic R&D grants and student research cells are typically reserved for macro engineering innovations. You may still proceed if special academic study is desired.
                </p>
              </div>
            )}

            {/* Target Authority Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isDept ? 'Assigned Administrative Authority' : 'Assigned Academic Institution'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isWardCategory
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : isBlockCategory
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {targetData?.category || (isWardCategory ? 'Ward Commissioner' : isBlockCategory ? 'Block Office' : 'State Ministry')}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 capitalize">
                  {targetData?.name || 'Administrative Department'}
                </h4>
                {targetData?.confidence > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                    {targetData.confidence}% Fit
                  </span>
                )}
              </div>

              {targetData?.code && (
                <div className="text-[11px] text-slate-500 font-mono">
                  Official Code: <span className="font-semibold text-slate-700">{targetData.code}</span>
                </div>
              )}

              {targetData?.reasoning && (
                <div className="text-[11.5px] text-slate-600 bg-white border border-slate-200/80 rounded-lg p-2.5 leading-relaxed">
                  <span className="font-semibold text-slate-800">Statutory Justification: </span>
                  {targetData.reasoning}
                </div>
              )}
            </div>

            {/* Challenge Reference Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Problem Statement</span>
                <span className="font-mono text-xs font-bold text-slate-900">{chlId}</span>
              </div>
              <p className="text-xs font-semibold text-slate-900">{challenge.title}</p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 flex-wrap">
                <span>District: <strong className="text-slate-700">{district}</strong></span>
                {block && <span>• Block: <strong className="text-slate-700">{block}</strong></span>}
                {wardNo && <span>• Ward: <strong className="text-slate-700">{wardNo}</strong></span>}
              </div>
            </div>

            {/* Optional Directives / Remarks Input */}
            <div className="space-y-1.5">
              <label htmlFor="modal-remarks-field" className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Nodal Officer Instructions / Directives (Optional)</span>
                <span className="text-[10.5px] text-slate-400 font-normal">Dispatched to field team</span>
              </label>
              <textarea
                id="modal-remarks-field"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={
                  isWardCategory
                    ? `e.g., Direct ward maintenance technician to inspect Ward ${wardNo || 'locality'} and resolve within 48 hours.`
                    : 'e.g., Provide prompt field assessment report to State Nodal Desk.'
                }
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#007A61] focus:border-transparent text-slate-800 placeholder-slate-400 resize-none"
              />
            </div>

            {/* Real-time Notification Alert Banner */}
            <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-600 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#007A61] shrink-0" />
              <span>
                Real-time tracking and SMS notification will be dispatched to the citizen submitter upon confirmation.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                  isDept
                    ? 'bg-[#007A61] hover:bg-[#00634f]'
                    : isRoutineMaintenance
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isDept
                        ? isWardCategory
                          ? 'Confirm & Route to Ward'
                          : 'Confirm & Route to Department'
                        : 'Confirm Lab Allocation'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiRouteConfirmModal;
