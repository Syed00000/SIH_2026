import React, { useState } from 'react';
import { X, Cpu, Plus, Sparkles } from 'lucide-react';
import { industryTechService } from '../../services/industryTechService.js';

export const AddTechToolModal = ({ isOpen, onClose, onSuccess, industryName }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'IoT & Embedded',
    version: 'v1.0 Pro',
    licenseType: 'Academic R&D Grant',
    techStackInput: '',
    description: '',
    accessInstructions: '',
    supportLevel: 'Dedicated Technical Assistance'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const techStackTags = formData.techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await industryTechService.createTechTool({
        ...formData,
        industryName: industryName || 'Ariba Research Labs',
        techStackTags: techStackTags.length > 0 ? techStackTags : ['General R&D']
      });

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to register tech tool:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#007A61] text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Register New Tech Tool / IP Asset</h3>
              <p className="text-[11px] text-slate-500 font-medium">Add proprietary software, hardware kit, or API sandbox</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white/80 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Tool / IP Asset Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Industrial LoRaWAN Gateway & Cloud Telemetry Suite"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              >
                <option value="IoT & Embedded">IoT & Embedded</option>
                <option value="AI & Analytics">AI & Analytics</option>
                <option value="Cloud & APIs">Cloud & APIs</option>
                <option value="Hardware & Simulation">Hardware & Simulation</option>
                <option value="Proprietary IP & Patents">Proprietary IP & Patents</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">License Type</label>
              <select
                value={formData.licenseType}
                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              >
                <option value="Academic R&D Grant">Academic R&D Grant</option>
                <option value="Commercial Lab License">Commercial Lab License</option>
                <option value="API Sandbox Key">API Sandbox Key</option>
                <option value="Proprietary IP License">Proprietary IP License</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Version / Build</label>
              <input
                type="text"
                placeholder="e.g. v4.2 Enterprise"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Support Level</label>
              <input
                type="text"
                placeholder="e.g. 24/7 Lab Assistance"
                value={formData.supportLevel}
                onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">
              Compatible Tech Stack Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. LoRaWAN, ESP32, Python, OpenCV, Arduino, MQTT"
              value={formData.techStackInput}
              onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Technical specifications, capabilities, and hardware/software environment..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-1">Provisioning / Access Instructions</label>
            <input
              type="text"
              placeholder="e.g. Provide API endpoint and enterprise license token upon grant"
              value={formData.accessInstructions}
              onChange={(e) => setFormData({ ...formData, accessInstructions: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Register Tech Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechToolModal;
