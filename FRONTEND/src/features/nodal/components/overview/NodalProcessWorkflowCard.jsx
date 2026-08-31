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
    <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-3.5">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        State Innovation Triage & Allocation Workflow
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-3xs text-slate-900">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {step.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
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
