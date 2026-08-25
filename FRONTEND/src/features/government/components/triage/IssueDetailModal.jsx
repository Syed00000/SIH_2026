import React from 'react';
import { X, MapPin, Calendar, User, Cpu, Sliders, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../../shared/components/ui/card.jsx';
import { Badge } from '../../../../shared/components/ui/badge.jsx';
import { Button } from '../../../../shared/components/ui/button.jsx';

export const IssueDetailModal = ({ issue, onClose, onNavigateOverride, onNavigateEscalate }) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
      <Card className="bg-white border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="p-4 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="info" className="font-extrabold">{issue.id}</Badge>
            <CardTitle className="text-sm md:text-base font-bold text-slate-900">
              AI Explainability & Classification Breakdown
            </CardTitle>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </CardHeader>

        <CardContent className="p-4 space-y-3.5 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{issue.title}</h3>
            <div className="flex items-center space-x-3 text-slate-500 mt-1 text-[11px]">
              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{issue.district}</span>
              <span className="flex items-center"><User className="w-3 h-3 mr-1" />{issue.submittedBy}</span>
              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{issue.date}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Identified Primary Domain:</span>
              <Badge variant="success" className="font-bold text-xs">{issue.domain} ({issue.confidence}%)</Badge>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">{issue.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-blue-50/60 border border-blue-200">
              <span className="font-bold text-blue-900 block mb-1">Top Keyphrase Triggers</span>
              <div className="flex flex-wrap gap-1">
                {issue.keywords?.map((kw, i) => (
                  <span key={i} className="bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-800 text-[10.5px]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200">
              <span className="font-bold text-emerald-900 block mb-1">Target Nodal Department</span>
              <p className="text-emerald-800 font-semibold text-xs">{issue.assignedDepartment}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 border-t border-slate-100 flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={onClose}>Close Window</Button>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="secondary" onClick={() => onNavigateOverride(issue)} className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Reclassify
            </Button>
            <Button size="sm" variant="primary" onClick={() => onNavigateEscalate(issue)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Escalate
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssueDetailModal;
