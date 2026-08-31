import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  FlaskConical,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  Zap,
  Activity,
  AlertCircle,
  Radio,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Users
} from 'lucide-react';

export const InspectPrototypeModal = ({
  isOpen,
  onClose,
  project,
  onAdvanceStage
}) => {
  if (!isOpen || !project) return null;

  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
  const defaultTab = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
  const [activeStageTab, setActiveStageTab] = useState(defaultTab);

  // Sync when project TRL changes
  useEffect(() => {
    const nextTab = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
    setActiveStageTab(nextTab);
  }, [curTrlNum]);

  // Stage-specific test items with toggleable state
  const [stageTests, setStageTests] = useState({
    1: [
      { id: 'st1_1', title: 'Circuit CAD Simulation & Gerber Validation', status: 'Passed', cert: 'LAB-CAD-102' },
      { id: 'st1_2', title: 'Breadboard Sensor Bench Calibration', status: 'Passed', cert: 'CAL-REF-09' },
      { id: 'st1_3', title: 'Power Consumption & Solar Battery Drain Profile', status: 'Passed', cert: 'PWR-TEST-21' }
    ],
    2: [
      { id: 'st2_1', title: 'Real-world Environmental Stress (Dust, Monsoon, Heat)', status: 'Passed', cert: 'ENV-FLD-401' },
      { id: 'st2_2', title: '72-Hour Continuous Field Autonomy & Battery Run', status: 'Passed', cert: 'BAT-AUT-88' },
      { id: 'st2_3', title: 'RF Telemetry & JoharSetu Gateway Packet Verification', status: 'Passed', cert: 'TEL-GW-902' }
    ],
    3: [
      { id: 'st3_1', title: 'NABL Certified Electrical & Calibration Benchmarking', status: curTrlNum >= 7 ? 'Passed' : 'In-Progress', cert: 'NABL-ST-77' },
      { id: 'st3_2', title: 'State Technical Steering Committee Safety Clearance', status: curTrlNum >= 7 ? 'Passed' : 'Under Review', cert: 'DHTE-SAF-02' },
      { id: 'st3_3', title: 'District Handover & Administrative Protocol Signoff', status: curTrlNum >= 8 ? 'Passed' : 'Scheduled', cert: 'HANDOVER-DOC' }
    ],
    4: [
      { id: 'st4_1', title: 'District-Wide Public Rollout & Community Deployment', status: curTrlNum >= 9 ? 'Passed' : 'Pending', cert: 'DIST-ROLLOUT' },
      { id: 'st4_2', title: 'Citizen & Student Beneficiary Telemetry Verification', status: curTrlNum >= 9 ? 'Passed' : 'Pending', cert: 'BEN-AUDIT' },
      { id: 'st4_3', title: 'Final State Innovation Milestone Signoff', status: curTrlNum >= 9 ? 'Passed' : 'Pending', cert: 'GOV-SEAL-2026' }
    ]
  });

  const toggleTestStatus = (stageNum, testId) => {
    setStageTests((prev) => ({
      ...prev,
      [stageNum]: prev[stageNum].map((t) =>
        t.id === testId
          ? { ...t, status: t.status === 'Passed' ? 'Pending' : 'Passed' }
          : t
      )
    }));
  };

  const handlePrintCertificate = () => {
    const printWin = window.open('', '_blank', 'width=850,height=750');
    if (!printWin) {
      alert('Please allow popups to print certificate');
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>TRL Testing Certificate - ${project.id}</title>
  <style>
    body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; text-align: center; }
    .border-box { border: 4px double #0d1b3e; padding: 30px; }
    .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; color: #0d1b3e; }
    .header p { margin: 4px 0; font-size: 12px; color: #475569; }
    .gold-badge { font-size: 20px; font-weight: bold; color: #b45309; margin: 20px 0; }
    .details { text-align: left; margin: 25px 0; border-collapse: collapse; width: 100%; }
    .details td { padding: 8px 12px; border: 1px solid #cbd5e1; }
    .details td.lbl { background: #f8fafc; font-weight: bold; width: 30%; }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
  </style>
</head>
<body>
  <div class="border-box">
    <div class="header">
      <h2>Government of Jharkhand</h2>
      <p>Department of Higher & Technical Education · JoharSetu Innovation Hub</p>
      <p style="font-weight: bold; color: #0369a1;">OFFICIAL TECHNOLOGY READINESS LEVEL (TRL) CERTIFICATE</p>
    </div>

    <div class="gold-badge">★ ${project.trlLevel || 'TRL-6'} CERTIFIED PROTOTYPE ★</div>

    <p>This is to certify that the prototype system detailed below has undergone laboratory validation, field testing, and official state evaluation under the State Innovation Framework:</p>

    <table class="details">
      <tr><td class="lbl">Project Identifier</td><td><strong>${project.id}</strong></td></tr>
      <tr><td class="lbl">Prototype Name</td><td><strong>${project.title}</strong></td></tr>
      <tr><td class="lbl">Institution & Lab</td><td>${project.hei} (${project.district} District)</td></tr>
      <tr><td class="lbl">Prototype Architecture</td><td>${project.prototypeType || 'Hardware Device'}</td></tr>
      <tr><td class="lbl">Hardware / Tech Specs</td><td>${project.hardwareSpecs || 'Integrated IoT Microcontroller Suite'}</td></tr>
      <tr><td class="lbl">Problem Origin Ground Area</td><td>${project.problemOrigin || `${project.district} Rural Block`}</td></tr>
      <tr><td class="lbl">Lead Faculty / SPOC</td><td>${project.teamLead || 'Dr. Amitabh Verma'}</td></tr>
      <tr><td class="lbl">Technology Readiness</td><td>${project.trlLevel} (Stage ${activeStageTab} Cleared)</td></tr>
    </table>

    <div class="footer">
      <div>
        <br/><br/>
        __________________________<br/>
        <strong>Chief Technical Evaluator</strong><br/>
        State Innovation Council
      </div>
      <div>
        <br/><br/>
        __________________________<br/>
        <strong>Director</strong><br/>
        Higher & Technical Education
      </div>
    </div>
  </div>
</body>
</html>
    `;

    printWin.document.write(html);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {project.trlLevel}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{project.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {project.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{project.hei} · {project.district} District</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintCertificate}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print TRL Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Interactive Stage Navigation Header */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-white text-xs font-bold text-center">
          {[
            { num: 1, label: '1. Lab Design (TRL 1-3)', icon: FlaskConical },
            { num: 2, label: '2. Field Test (TRL 4-6)', icon: Radio },
            { num: 3, label: '3. State Cert (TRL 7-8)', icon: ShieldCheck },
            { num: 4, label: '4. Public Deploy (TRL 9)', icon: Users }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeStageTab === tab.num;

            return (
              <button
                key={tab.num}
                type="button"
                onClick={() => setActiveStageTab(tab.num)}
                className={`py-3 px-2 border-b-2 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1.5 ${
                  isActive
                    ? 'border-slate-900 text-slate-900 bg-slate-50/60 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                <span className="text-[11px] truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body with Stage Details */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 bg-slate-50/40">
          {/* Top Quick Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ground Problem Area</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">{project.problemOrigin || `${project.district} Rural Area`}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Lead Scientist / SPOC</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">{project.teamLead || 'Dr. Lead Faculty'}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Testing Lab</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">{project.hei} Lab</span>
            </div>
          </div>

          {/* Stage 1: College Lab Design Details */}
          {activeStageTab === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Laboratory CAD Simulation & Circuit Specifications
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {project.hardwareSpecs || 'Integrated embedded microcontroller with local processing, solar power, and emergency alert display.'}
                </p>
              </div>
            </div>
          )}

          {/* Stage 2: Ground & Field Tested Details */}
          {activeStageTab === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Field Testing Coordinates & Environmental Stress
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Field tested in {project.district} rural blocks under heavy coal dust, rainfall, and thermal variations. Telemetry sync verified with 99.2% packet reliability.
                </p>
              </div>
            </div>
          )}

          {/* Stage 3: State & NABL Certified Details */}
          {activeStageTab === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Government & NABL Safety Certification
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Passed National Accreditation Board for Testing and Calibration Laboratories (NABL) calibration benchmarks. Cleared by Jharkhand State Steering Committee.
                </p>
              </div>
            </div>
          )}

          {/* Stage 4: Public Deployment Details */}
          {activeStageTab === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  District Public Rollout & Impact
                </h4>
                <p className="text-slate-800 leading-relaxed font-medium">
                  Operational across {project.district} community centers with 12,500+ citizens and farmers directly benefiting. Live telemetry synchronized with JoharSetu portal.
                </p>
              </div>
            </div>
          )}

          {/* Real Submitted Phase Technical Documentation from Faculty */}
          {(() => {
            const phases = project.prototypeData?.phases;
            const legacy = project.prototypeData?.content;
            const phaseContent = phases 
              ? (activeStageTab === 1 ? phases.labDesign : activeStageTab === 2 ? phases.fieldTest : activeStageTab === 3 ? phases.stateCert : phases.publicDeploy)
              : (activeStageTab === 1 ? legacy : null);

            if (phaseContent && phaseContent.replace(/<[^>]*>/g, '').trim().length > 0) {
              return (
                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 space-y-2 shadow-2xs">
                  <div className="flex items-center space-x-2 text-[#007A61]">
                    <FileCheck2 className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wide">
                      Faculty Submitted Technical Blueprint (Phase {activeStageTab})
                    </h4>
                  </div>
                  <div
                    className="ql-editor prose prose-sm prose-slate max-w-none text-xs text-slate-700 leading-relaxed bg-emerald-50/30 p-3 rounded-lg border border-emerald-100"
                    dangerouslySetInnerHTML={{ __html: phaseContent }}
                  />
                </div>
              );
            }
            return null;
          })()}

          {/* Interactive Checklist for Selected Stage */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-between">
              <span>Stage {activeStageTab} Verification Checklist & Evidence</span>
              <span className="text-[10px] font-bold text-slate-400 lowercase">(click checkbox to toggle pass)</span>
            </h4>

            <div className="space-y-2">
              {stageTests[activeStageTab]?.map((test) => (
                <div
                  key={test.id}
                  onClick={() => toggleTestStatus(activeStageTab, test.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        test.status === 'Passed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {test.status === 'Passed' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="font-semibold text-slate-800 text-xs">{test.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {test.cert}
                    </span>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                        test.status === 'Passed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Stage Switching & Advancement */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={activeStageTab === 1}
              onClick={() => setActiveStageTab((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev Stage</span>
            </button>

            <button
              type="button"
              disabled={activeStageTab === 4}
              onClick={() => setActiveStageTab((prev) => Math.min(4, prev + 1))}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Close Window
            </button>

            <button
              onClick={() => onAdvanceStage?.(project.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <span>Advance Stage (+1 TRL)</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectPrototypeModal;
