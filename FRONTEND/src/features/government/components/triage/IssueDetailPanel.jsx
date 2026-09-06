import React from 'react';
import { MapPin, Calendar, User, Cpu, Sliders, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const IssueDetailPanel = ({ issue, onClose, onNavigateOverride, onNavigateEscalate }) => {
  if (!issue) return null;

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to AI Classification Queue"
      breadcrumbs={['Citizen AI Triage', 'Domain Classification', issue.id]}
      idBadge={issue.id}
      statusBadge={
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
          AI Confidence: {issue.confidence}% · {issue.status}
        </span>
      }
      title={issue.title}
      subtitle={`Reported in ${issue.district} District by ${issue.submittedBy} · Sub-Sector: ${issue.subSector || issue.domain}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs font-bold">
            Back to Queue
          </Button>
          <div className="flex items-center space-x-2.5">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onNavigateOverride(issue)}
              className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Override Classification</span>
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigateEscalate(issue)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 text-xs font-bold rounded-xl shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Escalate Issue</span>
            </Button>
          </div>
        </div>
      }
    >
      {/* Citizen Problem Statement Dossier */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400">Citizen Problem Statement Dossier</span>
        <h2 className="text-base font-extrabold text-slate-900">{issue.title}</h2>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">{issue.description || 'Full statement details logged in state database.'}</p>
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />{issue.district} District</span>
          <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1 text-slate-400" />{issue.submittedBy}</span>
          <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />{issue.date}</span>
        </div>
      </div>

      {/* AI Inference & Domain Classification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Identified Primary Domain</span>
            <Badge variant="success" className="font-extrabold text-xs">{issue.domain} ({issue.confidence}%)</Badge>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <p className="font-bold">NLP Semantic Match Confirmed</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">High semantic correlation with Jharkhand State Infrastructure & Governance ontology.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Nodal Department</span>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs font-bold text-slate-900">
            <Building2 className="w-4 h-4 text-[#007A61]" />
            <span>{issue.assignedDepartment || 'Department of Higher & Technical Education'}</span>
          </div>
        </div>
      </div>

      {/* Keyphrase Triggers */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Extracted Keyphrase Triggers</span>
        <div className="flex flex-wrap gap-2">
          {issue.keywords?.map((kw, i) => (
            <span key={i} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </FullPageDetailPanel>
  );
};

export default IssueDetailPanel;
