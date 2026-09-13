import React, { useState, useEffect } from 'react';
import { Droplet, ChevronDown, Check, ArrowRight, User, MapPin, Sliders, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Textarea } from '../../../../shared/components/ui/textarea.jsx';

export const OverrideWorkspace = ({ selectedIssue, issues = [], onSelectIssue, onApplyOverride }) => {
  const [targetDomain, setTargetDomain] = useState('Public Infrastructure');
  const [justification, setJustification] = useState('');
  const [retrainClassifier, setRetrainClassifier] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const issue = selectedIssue || (issues && issues.length > 0 ? issues[0] : null);

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
    if (!issue) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onApplyOverride?.({ issueId: issue.id, newDomain: targetDomain, justification, retrainClassifier });
    }, 2000);
  };

  if (!issue) {
    return (
      <Card className="bg-white border-slate-200 shadow-2xs p-8 text-center text-slate-400 text-xs">
        <Info className="w-6 h-6 mx-auto text-slate-300 mb-2" />
        <h4 className="font-bold text-slate-700 text-xs">No Issue Selected for Reclassification</h4>
        <p className="text-[11px] text-slate-400 mt-0.5">Select an issue from the live triage stream to modify its taxonomy domain.</p>
      </Card>
    );
  }

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
              <span className="font-mono text-slate-500 font-bold">{issue.id}</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Problem Statement</span>
              <h5 className="font-bold text-slate-900 mt-0.5 text-xs">{issue.title}</h5>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">Current Sector</span>
                <span className="font-extrabold text-[#007A61] text-xs mt-0.5 block">{issue.currentDomain || issue.domain}</span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-400 block font-medium">District</span>
                <span className="font-bold text-slate-700 text-xs mt-0.5 block">{issue.district || 'Jharkhand'}</span>
              </div>
            </div>

            {issue.description && (
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                {issue.description}
              </p>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                New Target Department Domain <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 pr-8 focus:outline-none focus:border-amber-500"
                >
                  {domainOptions.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.dept})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Officer Override Justification <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={2}
                required
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="State administrative justification for taxonomy override..."
                className="text-xs"
              />
            </div>

            <label className="flex items-center space-x-2 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={retrainClassifier}
                onChange={(e) => setRetrainClassifier(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700 text-xs font-semibold">
                Queue for AI fine-tuning dataset
              </span>
            </label>

            {isSuccess && (
              <div className="flex items-center text-emerald-700 text-xs font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Issue reclassified to {targetDomain} and logged in audit history.
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <Button
                type="submit"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
              >
                <span>Commit Reclassification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OverrideWorkspace;
