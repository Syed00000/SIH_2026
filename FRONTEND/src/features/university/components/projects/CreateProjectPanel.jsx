import React, { useState, useEffect } from 'react';
import { FolderPlus, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { ProjectFormFields } from './form/ProjectFormFields.jsx';
import { ProjectFormPreview } from './form/ProjectFormPreview.jsx';

export const CreateProjectPanel = ({ onBack, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [challengeList, setChallengeList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    domain: 'Water Resources',
    challengeId: 'CHL-1024',
    leadMentor: 'Dr. Priya Sharma',
    studentTeam: 'Aqua Sentinel Innovators',
    teamMembersCount: 5,
    deadline: '30 Nov 2026',
    problemStatement: '',
    status: 'In Progress'
  });

  const [hardwareCost, setHardwareCost] = useState(35000);
  const [fabCost, setFabCost] = useState(20000);
  const [fieldCost, setFieldCost] = useState(12000);
  const [overheadCost, setOverheadCost] = useState(8000);

  const totalBudget = Number(hardwareCost) + Number(fabCost) + Number(fieldCost) + Number(overheadCost);

  useEffect(() => {
    async function loadMeta() {
      const [facData, chlData] = await Promise.all([
        universityApiService.getFacultyList('RU001'),
        universityApiService.getAssignedChallenges('RU001')
      ]);
      const fList = Array.isArray(facData) ? facData : [];
      const cList = chlData?.challenges || (Array.isArray(chlData) ? chlData : []);
      setFacultyList(fList);
      setChallengeList(cList);
      if (fList.length > 0) {
        setFormData((prev) => ({ ...prev, leadMentor: fList[0].name }));
      }
      if (cList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          challengeId: cList[0].id || cList[0].challengeId,
          domain: cList[0].domain || prev.domain
        }));
      }
    }
    loadMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        projectId: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        budget: `₹ ${totalBudget.toLocaleString('en-IN')}`,
        budgetBreakdown: [
          { category: 'Hardware & Microcontrollers', amount: `₹ ${Number(hardwareCost).toLocaleString('en-IN')}` },
          { category: 'Lab & Prototype Fabrication', amount: `₹ ${Number(fabCost).toLocaleString('en-IN')}` },
          { category: 'Field Testing & Calibration', amount: `₹ ${Number(fieldCost).toLocaleString('en-IN')}` },
          { category: 'Fellowship & Overhead', amount: `₹ ${Number(overheadCost).toLocaleString('en-IN')}` }
        ],
        progressPercentage: 15,
        milestonesTotal: 6,
        milestonesCompleted: 1,
        daysLeft: '180 days left',
        facultyMentor: {
          name: formData.leadMentor,
          department: formData.domain
        }
      };

      await universityApiService.createProject(payload);
      setSuccessMessage(`Innovation project "${formData.title}" successfully created and initiated into RU001 portfolio!`);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else if (onBack) onBack();
      }, 1200);
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Header & Breadcrumbs in clean card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-slate-900" onClick={onBack}>Projects Portfolio</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">Initiate New Project</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-[#007A61]" />
            <span>Initiate &amp; Propose Innovation Project</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Allocate faculty mentorship, student teams, milestone deadlines, and state grant budgets for approved grassroots challenges.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Portfolio</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center space-x-2.5 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 space-y-4">
          <ProjectFormFields
            formData={formData}
            setFormData={setFormData}
            facultyList={facultyList}
            challengeList={challengeList}
            hardwareCost={hardwareCost}
            setHardwareCost={setHardwareCost}
            fabCost={fabCost}
            setFabCost={setFabCost}
            fieldCost={fieldCost}
            setFieldCost={setFieldCost}
            overheadCost={overheadCost}
            setOverheadCost={setOverheadCost}
            totalBudget={totalBudget}
          />

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 shadow-xs disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderPlus className="w-3.5 h-3.5" />}
              <span>{loading ? 'Initiating...' : 'Initiate Innovation Project'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <ProjectFormPreview formData={formData} totalBudget={totalBudget} />
        </div>
      </form>
    </div>
  );
};

export default CreateProjectPanel;
