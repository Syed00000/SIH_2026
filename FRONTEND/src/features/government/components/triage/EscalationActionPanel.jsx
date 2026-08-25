import React, { useState } from 'react';
import { AlertTriangle, Check, User, MapPin } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { Textarea } from '../../../../shared/components/ui/textarea.jsx';

export const EscalationActionPanel = ({ selectedIssue }) => {
  const [priorityLevel, setPriorityLevel] = useState('Critical');
  const [remarks, setRemarks] = useState(
    'Potential public health and drinking water contamination hazard. Immediate inspection required.'
  );
  const [notifyDistrict, setNotifyDistrict] = useState(true);
  const [isEscalated, setIsEscalated] = useState(false);

  const priorityOptions = [
    { id: 'Normal', label: 'Normal' },
    { id: 'High', label: 'High' },
    { id: 'Urgent', label: 'Urgent' },
    { id: 'Critical', label: 'Critical' }
  ];

  const handleEscalate = (e) => {
    e.preventDefault();
    setIsEscalated(true);
    setTimeout(() => setIsEscalated(false), 3000);
  };

  return (
    <Card className="bg-white border-slate-200 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-slate-900 text-sm">
            {selectedIssue?.id || 'IS-2026-00521'}
          </span>
          <Badge variant="info" className="text-[10px] font-bold">
            Current: Normal
          </Badge>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Issue Escalation Console</span>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 text-sm">
          {selectedIssue?.title || 'Contaminated Drinking Water in Village'}
        </h4>
        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
          <span className="flex items-center"><User className="w-3 h-3 mr-1 text-slate-400" />{selectedIssue?.submittedBy || 'Ramesh Mahto'}</span>
          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-400" />{selectedIssue?.district || 'Dhanbad'}</span>
        </div>
      </div>

      <form onSubmit={handleEscalate} className="space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
            Select Escalated Priority Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {priorityOptions.map((opt) => {
              const isSelected = priorityLevel === opt.id;
              return (
                <Button
                  key={opt.id}
                  type="button"
                  size="sm"
                  variant={isSelected ? 'primary' : 'outline'}
                  onClick={() => setPriorityLevel(opt.id)}
                  className={`flex items-center justify-center space-x-1.5 py-1.5 px-1 text-xs font-bold ${
                    isSelected && opt.id === 'Critical' ? 'bg-red-600 hover:bg-red-700 border-red-600' : ''
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-300'}`} />
                  <span className="text-[11px]">{opt.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            Escalation Remarks & Technical Directives <span className="text-red-500">*</span>
          </label>
          <Textarea
            rows={2}
            required
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter reason for urgent priority routing..."
            className="text-xs"
          />
        </div>

        <label className="flex items-center space-x-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={notifyDistrict}
            onChange={(e) => setNotifyDistrict(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700 text-xs font-semibold">
            Send instant SMS/WhatsApp emergency alert to Deputy Commissioner (DC) Office
          </span>
        </label>

        {isEscalated && (
          <div className="flex items-center text-red-700 text-xs font-semibold bg-red-50 p-2 rounded border border-red-200">
            <Check className="w-3.5 h-3.5 mr-1 text-red-600" />
            Issue escalated to {priorityLevel}! District emergency alerts dispatched.
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <Button
            type="submit"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalate Priority Now</span>
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EscalationActionPanel;
