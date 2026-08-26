import React from 'react';
import {
  Users,
  Radio,
  Trash2,
  Building2,
  Award,
  ChevronRight,
  Sparkles,
  Lightbulb,
  Settings,
  FileText,
  FileCheck,
  Cpu,
  ShieldCheck,
  Rocket,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export const HeiNetworkPipelineView = ({
  partners = [],
  pipelineSteps = [],
  onSelectPartner
}) => {
  const getStepIcon = (index) => {
    switch (index) {
      case 0:
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 1:
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 2:
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 3:
        return <FileCheck className="w-4 h-4 text-indigo-600" />;
      case 4:
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 5:
        return <Cpu className="w-4 h-4 text-slate-800" />;
      case 6:
        return <Rocket className="w-4 h-4 text-blue-600" />;
      case 7:
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-5 select-none">
      {/* 1. Top Impact & Regional Coordination Grid matching Image 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* HEI Partner Network & Direct Impact (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              HEI Partner Network & Direct Impact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Citizens Impacted */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-slate-900">45k+</div>
                <div className="text-[11px] font-medium text-slate-500">Citizens Impacted</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>

            {/* Water Sensors */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-slate-900">140+</div>
                <div className="text-[11px] font-medium text-slate-500">Water Sensors</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            {/* Waste Managed */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <div className="text-xl font-black text-slate-900">12 T</div>
                <div className="text-[11px] font-medium text-slate-500">Waste Managed</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Coordination (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Regional Coordination
            </h3>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <div className="text-sm font-bold text-slate-900">BIT Sindri - 12 Active Solutions</div>
            <div className="text-[11px] font-medium text-amber-800 mt-0.5">Top contributing institute</div>
          </div>
        </div>
      </div>

      {/* 2. Innovation Lifecycle Pipeline matching Image 4 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Innovation Lifecycle Pipeline
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Stage-gate workflow from grassroots problem identification to statewide scaling
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
          {[
            { step: 1, label: 'Problem Identified' },
            { step: 2, label: 'Challenge Created' },
            { step: 3, label: 'Solution Proposed' },
            { step: 4, label: 'Evaluation' },
            { step: 5, label: 'Approved' },
            { step: 6, label: 'Implementation' },
            { step: 7, label: 'Deployed' },
            { step: 8, label: 'Impact & Scale' }
          ].map((item, idx) => {
            return (
              <div
                key={item.step}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center flex flex-col items-center justify-between min-h-[95px] relative group hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <span className="text-[10px] font-bold text-slate-400 self-start">{item.step}.</span>
                <div className="my-1">{getStepIcon(idx)}</div>
                <div className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom HEI Partner Cards matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
              NIT
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">NIT Jamshedpur</div>
              <div className="text-[11px] text-slate-500 font-medium">8 Active Proposals</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Partner
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">
              RU
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Ranchi University</div>
              <div className="text-[11px] text-slate-500 font-medium">10 Active Proposals</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Partner
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold text-xs">
              IIT
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">IIT (ISM) Dhanbad</div>
              <div className="text-[11px] text-slate-500 font-medium">15 Active Proposals</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Hub Lead
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeiNetworkPipelineView;
