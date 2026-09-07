import React, { useState, useEffect } from 'react';
import { Cpu, Share2, AlertCircle } from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { industryTechService } from '../../services/industryTechService.js';
import { IndustryGrantTechProblemSelector } from './IndustryGrantTechProblemSelector.jsx';
import { OfficialGrantLetterCard } from './OfficialGrantLetterCard.jsx';

export const IndustryGrantTechPanel = ({
  tool, tools = [], eligibleProblems = [], initialProblem = null, onBack, onSuccess
}) => {
  const [selectedToolId, setSelectedToolId] = useState(tool?.toolId || '');
  const [selectedProblemId, setSelectedProblemId] = useState(initialProblem?.projectId || '');
  const [credentials, setCredentials] = useState('');
  const [validity, setValidity] = useState('1 Year Active R&D Access');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tool?.toolId) setSelectedToolId(tool.toolId);
    else if (tools.length > 0 && !selectedToolId) setSelectedToolId(tools[0].toolId);
    if (initialProblem?.projectId) {
      setSelectedProblemId(initialProblem.projectId);
    } else if (eligibleProblems.length > 0 && !selectedProblemId) {
      setSelectedProblemId(eligibleProblems[0].projectId);
    }
  }, [tool, tools, eligibleProblems, initialProblem]);

  const currentProblem = eligibleProblems.find((p) => p.projectId === selectedProblemId) || initialProblem || eligibleProblems[0] || null;

  const fallbackTool = {
    toolId: 'LAB-ACCESS-01',
    name: currentProblem?.prototypeData?.requiredTechTool || 'Certified Research Lab & Testing Rig',
    category: currentProblem?.prototypeData?.department || currentProblem?.domain || 'Hardware & Simulation',
    version: '2026 Enterprise',
    licenseType: 'Commercial Lab License',
    industryName: 'Corporate Innovation Partner'
  };

  const currentTool = tools.find((t) => t.toolId === selectedToolId) || tool || fallbackTool;

  // Auto-fill prototype requirements when selected problem changes
  useEffect(() => {
    if (!currentProblem) return;
    const proto = currentProblem.prototypeData || {};
    const protoDept = proto.department || currentProblem.domain || '';
    const protoTool = proto.requiredTechTool || '';
    const protoStack = proto.techStack || currentProblem.techStack || '';

    if (protoTool && !tool) {
      const match = tools.find((t) => t.name.toLowerCase() === protoTool.toLowerCase() || t.toolId === protoTool);
      if (match) setSelectedToolId(match.toolId);
    } else if (protoDept && !tool) {
      const matchDept = tools.find((t) => t.category?.toLowerCase() === protoDept.toLowerCase());
      if (matchDept) setSelectedToolId(matchDept.toolId);
    }

    const autoNotes = `Official Lab & Tech Grant for "${currentProblem.title}". Authorized Facilities: Advanced Testing Lab, High-Precision Apparatus, and Technical Advisory. Permitted Tech: ${protoStack || 'Standard Framework'}.`;
    setNotes(autoNotes);

    const safeProj = (currentProblem.challengeId || currentProblem.projectId || 'PRJ').slice(-4);
    const safeTool = (currentTool?.toolId || 'TECH').replace('TECH-', '');
    setCredentials(`LAB-ACC-RU001-${safeTool}-${safeProj}-KEY`);
  }, [selectedProblemId, currentProblem?.projectId, currentTool?.toolId]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!currentProblem) return;
    setError('');
    try {
      setLoading(true);
      const targetToolId = currentTool?.toolId || 'LAB-ACCESS-01';
      const letterNo = `JHR/IND-LAB/${targetToolId.replace('TECH-', '')}-${Date.now().toString().slice(-4)}`;
      const grantLetter = {
        letterNo,
        dispatchDate: new Date(),
        issuingPartner: currentTool?.industryName || 'Corporate Industry Partner',
        recipientUniversity: currentProblem.universityName || 'Ranchi University',
        projectId: currentProblem.projectId,
        challengeId: currentProblem.challengeId || '',
        projectTitle: currentProblem.title,
        studentTeam: currentProblem.studentTeam || '',
        toolName: currentTool?.name || 'Certified Research Lab & Testing Rig',
        category: currentTool?.category || 'Hardware & Simulation',
        licenseType: currentTool?.licenseType || 'Commercial Lab License',
        accessCredentials: credentials,
        validity,
        notes: notes || `Technical lab access provisioned for ${currentProblem.title}.`
      };

      await industryTechService.grantTechHelp(targetToolId, {
        projectId: currentProblem.projectId,
        challengeId: currentProblem.challengeId || '',
        projectTitle: currentProblem.title,
        universityCode: currentProblem.universityCode || 'RU001',
        studentTeam: currentProblem.studentTeam,
        toolName: currentTool?.name || 'Certified Research Lab & Testing Rig',
        category: currentTool?.category || 'Hardware & Simulation',
        licenseType: currentTool?.licenseType || 'Commercial Lab License',
        accessCredentials: credentials,
        validity,
        notes: notes || `Technical lab access provisioned for ${currentProblem.title}.`,
        letterNo,
        grantLetter
      });
      onSuccess && onSuccess();
      onBack();
    } catch (err) {
      console.error('Failed to grant tech tool access:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to dispatch grant letter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullPageDetailPanel
      onBack={onBack}
      backLabel="Back to IP & Technology Transfer"
      breadcrumbs={['Corporate Innovation Node', 'Tech Transfer', currentTool?.name || 'Lab Grant']}
      idBadge={currentTool?.toolId || 'TECH-GRANT'}
      statusBadge={
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-purple-50 text-purple-800 border-purple-300 flex items-center space-x-1">
          <Cpu className="w-3 h-3 text-purple-700" />
          <span>{currentTool?.licenseType || 'Commercial Enterprise'}</span>
        </span>
      }
      title={`Grant Lab Access & Tech: ${currentProblem?.title || currentTool?.name || 'Research Prototype'}`}
      subtitle={`University: ${currentProblem?.universityName || 'Ranchi University'} • Sanctioned Fee: ${currentProblem?.feeAmount || '₹ 25,000'}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            Back to Problems
          </button>
          {currentProblem && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{loading ? 'Dispatching...' : 'Dispatch Official Lab Access Letter & ID Key'}</span>
            </button>
          )}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Problem Statement Selection with Full Prototype Tech Preview */}
        <IndustryGrantTechProblemSelector
          eligibleProblems={eligibleProblems}
          currentProblem={currentProblem}
          selectedProblemId={selectedProblemId}
          onSelectProblemId={setSelectedProblemId}
          currentTool={currentTool}
        />

        {/* Official Lab Access Authorization Letter & Security Key Card */}
        {currentProblem && (
          <OfficialGrantLetterCard
            currentTool={currentTool}
            currentProblem={currentProblem}
            credentials={credentials}
            setCredentials={setCredentials}
            validity={validity}
            setValidity={setValidity}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </form>
    </FullPageDetailPanel>
  );
};

export default IndustryGrantTechPanel;
