import React, { useMemo } from 'react';
import { Layers, Wrench, Sparkles, Check } from 'lucide-react';
import { INDUSTRY_TECH_DEPARTMENTS, getAllIndustryTools } from './industryTechCatalog.data.js';

export const PrototypeTechStackFields = ({
  department = '',
  requiredTechTool = '',
  techStack = '',
  onChangeData,
  isLocked = false
}) => {
  const currentDeptObj = useMemo(() => {
    return INDUSTRY_TECH_DEPARTMENTS.find((d) => d.name === department || d.id === department);
  }, [department]);

  const availableTools = useMemo(() => {
    if (currentDeptObj) return currentDeptObj.tools;
    return getAllIndustryTools();
  }, [currentDeptObj]);

  const selectedToolObj = useMemo(() => {
    return availableTools.find((t) => t.name === requiredTechTool || t.id === requiredTechTool);
  }, [availableTools, requiredTechTool]);

  const compatibleTags = useMemo(() => {
    if (selectedToolObj?.stack) return selectedToolObj.stack;
    if (currentDeptObj?.tools?.[0]?.stack) return currentDeptObj.tools[0].stack;
    return ['ESP32', 'FreeRTOS', 'LoRaWAN', 'Python', 'MQTT', 'OpenCV'];
  }, [selectedToolObj, currentDeptObj]);

  const handleSelectDepartment = (e) => {
    const newDept = e.target.value;
    onChangeData('department', newDept);
    const deptObj = INDUSTRY_TECH_DEPARTMENTS.find((d) => d.name === newDept);
    if (deptObj?.tools?.[0]) {
      onChangeData('requiredTechTool', deptObj.tools[0].name);
    }
  };

  const handleSelectTool = (e) => {
    const toolName = e.target.value;
    onChangeData('requiredTechTool', toolName);
    const found = availableTools.find((t) => t.name === toolName);
    if (found && !techStack) {
      onChangeData('techStack', found.stack.join(', '));
    }
  };

  const handleToggleTag = (tag) => {
    if (isLocked) return;
    const currentList = techStack
      ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    let updated;
    if (currentList.includes(tag)) {
      updated = currentList.filter((t) => t !== tag);
    } else {
      updated = [...currentList, tag];
    }
    onChangeData('techStack', updated.join(', '));
  };

  const isTagSelected = (tag) => {
    if (!techStack) return false;
    return techStack.split(',').map((s) => s.trim().toLowerCase()).includes(tag.toLowerCase());
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1 flex items-center space-x-1">
            <Layers className="w-3 h-3 text-[#007A61]" />
            <span>Target Technology Department / Domain *</span>
          </label>
          <select
            value={department || ''}
            onChange={handleSelectDepartment}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
          >
            <option value="">Select Domain Category...</option>
            {INDUSTRY_TECH_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1 flex items-center space-x-1">
            <Wrench className="w-3 h-3 text-[#007A61]" />
            <span>Required Industry Tech Tool / Equipment *</span>
          </label>
          <select
            value={requiredTechTool || ''}
            onChange={handleSelectTool}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
          >
            <option value="">Select or Requisition Industry Tech Tool...</option>
            {availableTools.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name} ({t.id})
              </option>
            ))}
            <option value="Custom Industry Equipment Requisition">Other / Custom Industry Tool Requisition</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10.5px] font-bold text-slate-500 uppercase block">
            Core Tech Stack & Controller Array
          </label>
          <span className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5 text-[#007A61]" />
            <span>Click tags to add/remove</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pb-2">
          {compatibleTags.map((tag) => {
            const active = isTagSelected(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  active
                    ? 'bg-[#007A61] text-white border border-[#007A61] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {active && <Check className="w-2.5 h-2.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={techStack || ''}
          onChange={(e) => onChangeData('techStack', e.target.value)}
          placeholder="e.g., ESP32, FreeRTOS, LoRaWAN, Python FastApi"
          className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-[#007A61]"
        />
      </div>
    </div>
  );
};

export default PrototypeTechStackFields;
