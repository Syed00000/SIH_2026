import React from 'react';
import { Send, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

export const NodalProcessWorkflowCard = () => {
  const steps = [
    {
      icon: Send,
      title: '1. Citizen Problem Submission',
      desc: 'Grassroots challenges submitted with GPS coordinates, photos & audio evidence across 24 Jharkhand districts.'
    },
    {
      icon: ShieldCheck,
      title: '2. State Nodal Triage & Verification',
      desc: 'Nodal Cell screens ground validity, sets research priority, domain categorization, and institutional targeting.'
    },
    {
      icon: GraduationCap,
      title: '3. HEI Faculty & Student Allocation',
      desc: 'Assigned University reviews scope, accepts the challenge, and provisions specialized faculty mentors.'
    },
    {
      icon: CheckCircle2,
      title: '4. Prototype Solution & Grant Sanction',
      desc: 'Student innovator teams build TRL prototypes, unlock CSR co-funding, and deploy real societal solutions.'
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-md p-5 shadow-2xs space-y-4">
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
        State Innovation Triage & Allocation Workflow
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-4 bg-slate-50/70 rounded-md border border-slate-200/80 space-y-2 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4 text-[#0f4b3a] shrink-0 stroke-[2.2]" />
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {step.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodalProcessWorkflowCard;
