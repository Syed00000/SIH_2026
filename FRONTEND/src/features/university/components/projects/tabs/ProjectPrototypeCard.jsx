import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { universityApiService } from '../../../services/universityApiService.js';

export const ProjectPrototypeCard = ({ project }) => {
  const [isShipping, setIsShipping] = useState(false);

  if (!project.prototypeStatus) return null;

  const handleShipToGov = async () => {
    setIsShipping(true);
    try {
      await universityApiService.forwardPrototypeToGovernment(project.projectId || project.id, 'RU001');
      project.sentToGovernment = true;
    } catch (e) {
      console.error(e);
    } finally {
      setIsShipping(false);
    }
  };

  return (
    <div className={`p-3.5 rounded-xl border space-y-2 shadow-2xs ${project.prototypeStatus === 'Approved' ? 'bg-emerald-50/70 border-emerald-300' : project.prototypeStatus === 'In Review' ? 'bg-blue-50/70 border-blue-200' : 'bg-amber-50/70 border-amber-200'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Prototype Lifecycle Status</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${project.prototypeStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : project.prototypeStatus === 'In Review' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}>
          {project.prototypeStatus === 'Approved' ? '✓ Prototype Done (Approved)' : project.prototypeStatus === 'In Review' ? '⏳ Under Review' : project.prototypeStatus}
        </span>
      </div>
      <p className="text-xs text-slate-700 font-medium">
        {project.prototypeStatus === 'Approved'
          ? 'Prototype blueprint has been approved by the University Authority and is ready for Industry CSR / Lab matching.'
          : project.prototypeStatus === 'In Review'
          ? 'Prototype blueprint has been submitted by the Faculty Mentor and is currently pending University evaluation.'
          : 'Prototype is in drafting / revision phase.'}
      </p>
      {project.prototypeData?.timeline && (
        <div className="text-[11px] text-[#007A61] font-bold">Target Timeline: {project.prototypeData.timeline}</div>
      )}
      {project.prototypeStatus === 'Approved' && (
        <div className="pt-2.5 border-t border-emerald-200/80 flex items-center justify-between">
          <span className="text-[10px] font-bold text-emerald-900">
            {project.sentToGovernment ? '✓ Forwarded to Government (DHTE)' : 'Ready to Ship for State Evaluation'}
          </span>
          <button
            type="button"
            onClick={handleShipToGov}
            disabled={isShipping}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
          >
            <Send className="w-3 h-3 text-blue-400" />
            <span>{project.sentToGovernment ? 'Resync with Government' : 'Ship to Government'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectPrototypeCard;
