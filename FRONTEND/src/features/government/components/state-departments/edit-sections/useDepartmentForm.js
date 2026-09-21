import { useState, useEffect } from 'react';
import {
  createInitialFormData,
  mapDepartmentToFormData,
  generateSecurePassword
} from './departmentFormDefaults.js';

export const useDepartmentForm = (department, onSave) => {
  const isEditing = Boolean(department);
  const [formData, setFormData] = useState(() => mapDepartmentToFormData(department));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (department) {
      setFormData(mapDepartmentToFormData(department));
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('credentials.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        credentials: { ...prev.credentials, [field]: type === 'checkbox' ? checked : value }
      }));
    } else if (name.startsWith('mandate.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mandate: { ...prev.mandate, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleDistrictCoverageToggle = (dist) => {
    setFormData(prev => {
      const coverage = prev.districtCoverage || [];
      const newCoverage = coverage.includes(dist)
        ? coverage.filter(d => d !== dist)
        : [...coverage, dist];
      return { ...prev, districtCoverage: newCoverage };
    });
  };

  const handleHierarchyToggle = (level) => {
    setFormData(prev => {
      if (level === 'State Department') return prev;
      const isChecked = prev.hierarchyConfig.includes(level);
      const newLevels = isChecked
        ? prev.hierarchyConfig.filter((l) => l !== level)
        : [...prev.hierarchyConfig, level];
      return { ...prev, hierarchyConfig: newLevels };
    });
  };

  const handleKeyFunctionChange = (index, value) => {
    const newFunctions = [...formData.keyFunctions];
    newFunctions[index] = value;
    setFormData(prev => ({ ...prev, keyFunctions: newFunctions }));
  };

  const addKeyFunction = () => {
    setFormData(prev => ({ ...prev, keyFunctions: [...prev.keyFunctions, ''] }));
  };

  const removeKeyFunction = (index) => {
    if (formData.keyFunctions.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      keyFunctions: prev.keyFunctions.filter((_, i) => i !== index)
    }));
  };

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword();
    setFormData(prev => ({
      ...prev,
      credentials: { ...prev.credentials, password: generated }
    }));
    showToast('Secure password generated!');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department Name is Required';
    if (!formData.headEmail.trim() && !formData.credentials.loginEmail.trim()) {
      errs.headEmail = 'Official Department / Login Email is Required';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      alert(`Validation Failed:\n${Object.values(errs).join('\n')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (!payload.credentials.loginEmail) {
        payload.credentials.loginEmail = payload.headEmail;
      }
      if (!payload.credentials.loginId) {
        payload.credentials.loginId = payload.code || payload.name.split(' ').map(w => w[0] || '').join('').toUpperCase();
      }
      await onSave(payload);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to save department');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    formData,
    errors,
    isSubmitting,
    toastMessage,
    handleChange,
    handleDistrictCoverageToggle,
    handleHierarchyToggle,
    handleKeyFunctionChange,
    addKeyFunction,
    removeKeyFunction,
    handleGeneratePassword,
    handleSubmit
  };
};
