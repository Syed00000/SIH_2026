import React from 'react';
import { Button } from '../../../../shared/components/ui/button.jsx';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  Check, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';

export const RegisterStepRole = ({ role, onRoleSelect, onNext, onNavigate }) => {
  const roles = [
    {
      id: 'CITIZEN',
      title: 'Citizen',
      subtitle: 'Public & Grassroots',
      description: 'Submit community & civic challenges',
      icon: Users,
    },
    {
      id: 'UNIVERSITY',
      title: 'University',
      subtitle: 'Higher Education & R&D',
      description: 'Propose institutional R&D projects',
      icon: GraduationCap,
    },
    {
      id: 'INDUSTRY',
      title: 'Industry',
      subtitle: 'Corporate & CSR',
      description: 'Sponsor challenges & CSR innovation',
      icon: Building2,
    }
  ];

  return (
    <div className="space-y-3.5 select-none">
      {/* Title Header */}
      <div className="text-center pb-0.5">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
          I want to join as
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Select your registration role to personalize your experience
        </p>
      </div>

      {/* 3 Modern Role Tiles in #007A61 Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roles.map((item) => {
          const Icon = item.icon;
          const isSelected = role === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onRoleSelect(item.id)}
              className={`relative rounded-xl p-3.5 sm:p-4 cursor-pointer border-2 transition-all duration-200 flex flex-col items-center text-center justify-between group ${
                isSelected
                  ? 'bg-[#007A61]/10 border-[#007A61] ring-2 ring-[#007A61]/15 shadow-xs scale-[1.01]'
                  : 'bg-white border-slate-200 hover:border-[#007A61] hover:bg-[#007A61]/5 shadow-2xs'
              }`}
            >
              {/* Top-right selection radio / check */}
              <div className="absolute top-2.5 right-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#007A61] bg-[#007A61] text-white shadow-2xs'
                      : 'border-slate-300 bg-transparent group-hover:border-[#007A61]'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              {/* Clean Standalone Icon */}
              <div className="mb-2 pt-0.5">
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${
                    isSelected
                      ? 'text-[#007A61] stroke-[2.2]'
                      : 'text-slate-500 stroke-[1.8] group-hover:text-[#007A61]'
                  }`}
                />
              </div>

              {/* Centered Title, Subtitle, and Description */}
              <div>
                <h4
                  className={`font-bold text-sm tracking-tight mb-0.5 ${
                    isSelected ? 'text-[#005a47]' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h4>
                <p
                  className={`text-[11px] font-semibold mb-0.5 ${
                    isSelected ? 'text-[#007A61]' : 'text-slate-600 group-hover:text-[#007A61]'
                  }`}
                >
                  {item.subtitle}
                </p>
                <p
                  className={`text-[10.5px] leading-snug ${
                    isSelected ? 'text-slate-700 font-medium' : 'text-slate-400'
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Banner for Industry Onboarding */}
      {role === 'INDUSTRY' && (
        <div className="p-2.5 bg-[#007A61]/10 border border-[#007A61]/30 rounded-xl text-xs text-[#005a47] flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fadeIn shadow-2xs">
          <div>
            <p className="font-bold text-[#005a47] text-xs">Official Industry & Partner Application</p>
            <p className="text-[#007A61] text-[10.5px] mt-0.5">
              Partner with state universities & student researchers. Credentials provisioned upon application review.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onNavigate
                ? onNavigate('/register/industry')
                : (window.location.href = '/register/industry')
            }
            className="bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white font-semibold text-xs px-3 py-1.5 rounded-lg shrink-0 transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Open Application</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Bottom CTA Button in #007A61 */}
      <div className="pt-1.5">
        <Button 
          onClick={onNext} 
          className="w-full py-2.5 bg-[#007A61] hover:bg-[#009677] active:bg-[#00604d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-md shadow-[#007A61]/20 hover:shadow-lg hover:shadow-[#009677]/30 transition-all duration-200 cursor-pointer group"
        >
          <span>Continue to Account Details</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default RegisterStepRole;
