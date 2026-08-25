import React, { useState, useEffect } from 'react';
import { Droplet, ChevronDown, Check, ArrowRight, User, MapPin, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Textarea } from '../../../../shared/components/ui/textarea.jsx';

export const OverrideWorkspace = ({ selectedIssue, issues, onSelectIssue, onApplyOverride }) => {
  const [targetDomain, setTargetDomain] = useState('Public Infrastructure');
  const [justification, setJustification] = useState('Cross-departmental road survey required before civil repair.');
  const [retrainClassifier, setRetrainClassifier] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const issue = selectedIssue || issues?.[0] || {
    id: 'IS-2026-00481',
    title: 'Solar Microgrid Inverter Failure affecting 120 tribal households',
    district: 'Khunti',
    currentDomain: 'Water Resources',
    confidence: 89,
    submittedBy: 'Birsa Munda SHG',
    description: 'The solar microgrid inverter feeding the borehole filtration setup malfunctioned.'
  };

  const domainOptions = [
    { name: 'Water Resources & Supply', dept: 'Drinking Water & Sanitation Dept' },
    { name: 'Public Infrastructure', dept: 'Road Construction Department' },
    { name: 'Agriculture & Irrigation', dept: 'Department of Agriculture' },
    { name: 'Healthcare & Public Hygiene', dept: 'Health & Family Welfare Dept' },
    { name: 'Energy & Rural Electrification', dept: 'Energy Department (JBVNL)' },
    { name: 'Solid Waste Management', dept: 'Urban Development & Housing Dept' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onApplyOverride?.({ issueId: issue.id, newDomain: targetDomain, justification, retrainClassifier });
    }, 2000);
  };

  return (
    <Card className="bg-white border-slate-200 shadow-2xs">
      <CardHeader className="p-3.5 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <CardTitle className="text-xs md:text-sm font-bold text-slate-900">
            Manual Taxonomy Reclassification Studio
          </CardTitle>
        </div>
        <Badge variant="warning" className="text-[10px] font-bold">
          Selected: {issue.id}
        </Badge>
      </CardHeader>

      <CardContent className="p-3.5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2.5 bg-slate-50/70 p-3 rounded border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Source Issue Details</span>
              <Badge variant="info" className="text-[10px] font-bold">Current: {issue.domain || issue.currentDomain || 'Water'}</Badge>
            </div>

            <h4 className="font-bold text-slate-900 text-xs">{issue.title}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{issue.description}</p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">District & Location</span>
                <span className="font-semibold text-slate-700 flex items-center mt-0.5">
                  <MapPin className="w-3 h-3 mr-1 text-slate-400" />{issue.district}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Reported By</span>
                <span className="font-semibold text-slate-700 flex items-center mt-0.5">
                  <User className="w-3 h-3 mr-1 text-slate-400" />{issue.submittedBy}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Select Target Domain Taxonomy <span className="text-red-500">*</span>
              </label>
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full h-8 text-xs border border-slate-300 rounded px-2 bg-white text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {domainOptions.map((opt, i) => (
                  <option key={i} value={opt.name}>{opt.name} — {opt.dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Override Justification & Officer Remark <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={2}
                required
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain the technical or departmental reason for rerouting..."
                className="text-xs"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={retrainClassifier}
                onChange={(e) => setRetrainClassifier(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-slate-700 text-xs font-semibold">
                Feed this correction to the DistilBERT AI fine-tuning loop (Zero-Shot Learning)
              </span>
            </label>

            {isSuccess && (
              <div className="flex items-center text-emerald-700 text-xs font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Override submitted successfully! Department routing updated.
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button type="submit" size="sm" variant="primary" className="flex items-center gap-1">
                <span>Confirm & Apply Override</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OverrideWorkspace;
