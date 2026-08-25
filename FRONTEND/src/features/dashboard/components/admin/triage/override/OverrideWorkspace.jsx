import React, { useState, useEffect } from 'react';
import { Droplet, ChevronDown, Check, ArrowRight, User, MapPin, Sliders } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../../../shared/components/ui/button.jsx';
import { Textarea } from '../../../../../../shared/components/ui/textarea.jsx';

export const OverrideWorkspace = ({ selectedIssue, issues, onSelectIssue, onApplyOverride }) => {
  const [targetDomain, setTargetDomain] = useState('Public Infrastructure');
  const [targetSubDomain, setTargetSubDomain] = useState('Drainage & Culverts');
  const [overrideReason, setOverrideReason] = useState(
    'Misclassified by NLP. This issue is primarily related to drainage culvert blockages affecting local roads.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (selectedIssue?.domain === 'Water') {
      setTargetDomain('Public Infrastructure');
      setTargetSubDomain('Drainage & Culverts');
    } else {
      setTargetDomain('Water Resources');
      setTargetSubDomain('Piped Drinking Supply');
    }
  }, [selectedIssue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIssue && onApplyOverride) {
      onApplyOverride(selectedIssue.id, targetDomain, overrideReason);
    }
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
      {/* Left: Original Issue Preview */}
      <Card className="bg-white border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 text-sm">
              {selectedIssue?.id || 'IS-2026-00521'}
            </span>
            <Badge variant="info" className="text-[10px] font-bold">
              AI: {selectedIssue?.domain || 'Water'} ({selectedIssue?.confidence || 94}%)
            </Badge>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Original Submission</span>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-sm">{selectedIssue?.title || 'Contaminated Drinking Water in Village'}</h4>
          <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center"><User className="w-3 h-3 mr-1 text-slate-400" />{selectedIssue?.submittedBy || 'Ramesh Mahto'}</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-400" />{selectedIssue?.district || 'Dhanbad'}</span>
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
          The main water pipeline running near the village community center is broken, causing foul water to mix with open drainage channels. Immediate inspection needed.
        </div>

        {/* Quick Issue Picker */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Select Another Issue to Override</span>
          <div className="flex flex-wrap gap-1.5">
            {issues.map((iss) => (
              <Button
                key={iss.id}
                size="sm"
                variant={selectedIssue?.id === iss.id ? 'primary' : 'outline'}
                onClick={() => onSelectIssue(iss)}
                className="py-1 px-2 text-[11px] font-bold h-7"
              >
                {iss.id}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Right: Reclassification Form */}
      <Card className="bg-white border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 mb-3">
          <Sliders className="w-3.5 h-3.5 text-blue-600" />
          <h4 className="font-bold text-slate-900 text-sm">Taxonomy Override Studio</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Select Correct Target Domain <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={targetDomain}
                onChange={(e) => setTargetDomain(e.target.value)}
                className="w-full appearance-none border border-slate-200 rounded-md pl-3 pr-8 py-1.5 bg-white text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:ring-1 focus:ring-slate-900"
              >
                <option value="Public Infrastructure">Public Infrastructure</option>
                <option value="Water Resources">Water Resources</option>
                <option value="Agriculture & Farming">Agriculture & Farming</option>
                <option value="Public Health">Public Health</option>
                <option value="Sanitation & Waste">Sanitation & Waste</option>
                <option value="Education & Skills">Education & Skills</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Sub-Domain Specific Taxonomy
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Drainage & Culverts', 'Rural Roads', 'Bridge Repair', 'Piped Drinking Supply'].map((sub) => (
                <Button
                  type="button"
                  key={sub}
                  size="sm"
                  variant={targetSubDomain === sub ? 'primary' : 'outline'}
                  onClick={() => setTargetSubDomain(sub)}
                  className={`py-0.5 px-2 text-[10px] h-6 ${targetSubDomain === sub ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  {sub}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Override Justification Notes <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={2}
              required
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="State reason for manual reclassification..."
              className="text-xs"
            />
          </div>

          {isSuccess && (
            <div className="flex items-center text-emerald-700 text-xs font-semibold bg-emerald-50 p-2 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5 mr-1" />
              Override applied! Issue re-indexed under {targetDomain}.
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
            >
              <span>Apply Override</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OverrideWorkspace;
