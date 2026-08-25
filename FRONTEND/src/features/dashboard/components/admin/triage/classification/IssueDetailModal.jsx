import React from 'react';
import { X, MapPin, Calendar, User, Cpu, Sliders, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../../../shared/components/ui/button.jsx';

export const IssueDetailModal = ({ issue, onClose, onNavigateOverride, onNavigateEscalate }) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <Card className="bg-white border-slate-200 shadow-xl max-w-xl w-full p-4.5 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 text-sm">{issue.id}</span>
            <Badge variant="info" className="text-[10px] font-bold">
              {issue.domain}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title and Metadata */}
        <div>
          <h3 className="font-bold text-slate-900 text-base">{issue.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1 text-slate-400" />
              {issue.submittedBy}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
              {issue.district}, Jharkhand
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
              {issue.submittedOn}
            </span>
          </div>
        </div>

        {/* AI Confidence & NLP Explainability */}
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center font-bold text-slate-800">
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              JoharNLP Classification Reasoning
            </span>
            <Badge variant="success" className="font-extrabold text-xs">
              {issue.confidence}% Confidence
            </Badge>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            High semantic overlap detected for keywords relating to {issue.domain}. Model predicts
            primary jurisdiction under the Department of Drinking Water & Sanitation.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['water pipeline', 'leakage', 'drinking water', 'village tap', 'rural supply'].map(
              (tag, idx) => (
                <Badge key={idx} variant="default" className="text-[10px] font-medium">
                  #{tag}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateOverride(issue)}
            className="flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Manual Override</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateEscalate(issue)}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalate Priority</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IssueDetailModal;
