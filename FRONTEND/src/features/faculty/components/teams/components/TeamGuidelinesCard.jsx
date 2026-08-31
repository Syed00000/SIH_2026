import React from 'react';

export const TeamGuidelinesCard = () => {
  return (
    <div className="space-y-3.5">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Team Guidelines
        </h3>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • Set a distinctive <strong>Team Name</strong> representing your innovation lab or project focus.
          </p>
          <p>
            • Teams typically consist of <strong>3 to 5 student researchers</strong> under 1 Lead Faculty Mentor.
          </p>
          <p>
            • Designate 1 <strong>Student Team Leader</strong> who coordinates lab fabrication and field telemetry.
          </p>
          <p>
            • Interdisciplinary teams receive priority consideration during Government grant sanction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamGuidelinesCard;
