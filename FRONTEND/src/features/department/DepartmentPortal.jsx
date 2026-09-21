import React from 'react';
import { DepartmentHeader } from './components/DepartmentHeader.jsx';
import { DepartmentSidebar } from './components/DepartmentSidebar.jsx';
import { DepartmentOverview } from './components/DepartmentOverview.jsx';
import { DepartmentProblemsPanel } from './components/DepartmentProblemsPanel.jsx';
import { DepartmentProblemActionPanel } from './components/DepartmentProblemActionPanel.jsx';
import { DepartmentTechniciansPanel } from './components/DepartmentTechniciansPanel.jsx';
import { DepartmentDistrictsPanel } from './components/DepartmentDistrictsPanel.jsx';
import { DepartmentCsrGrantPanel } from './components/DepartmentCsrGrantPanel.jsx';
import { DepartmentPrototypesPanel } from './components/DepartmentPrototypesPanel.jsx';
import { DepartmentBudgetOfficersPanel } from './components/DepartmentBudgetOfficersPanel.jsx';
import { DepartmentBudgetReviewPanel } from './components/DepartmentBudgetReviewPanel.jsx';
import { DepartmentMobileNav } from './components/DepartmentMobileNav.jsx';
import { DepartmentModals } from './components/DepartmentModals.jsx';
import { GovernmentFooter } from '../government/components/layout/GovernmentFooter.jsx';
import { useDepartmentPortal } from './hooks/useDepartmentPortal.js';

export const DepartmentPortal = ({ user, onLogout }) => {
  const {
    activeTab,
    setActiveTab,
    isSidebarExpanded,
    setIsSidebarExpanded,
    department,
    allDepartments,
    problems,
    technicians,
    budgetOfficers,
    districts,
    loading,
    selectedProblem,
    setSelectedProblem,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isWardDept,
    isAddTechOpen,
    setIsAddTechOpen,
    showAddBudgetOfficerModal,
    setShowAddBudgetOfficerModal,
    isAddDistrictOpen,
    setIsAddDistrictOpen,
    viewingTech,
    setViewingTech,
    editingTech,
    setEditingTech,
    viewingBudgetOfficer,
    setViewingBudgetOfficer,
    editingBudgetOfficer,
    setEditingBudgetOfficer,
    assigningProblemTech,
    setAssigningProblemTech,
    assigningBudgetProblem,
    setAssigningBudgetProblem,
    handleUpdateProblem,
    handleAssignBudgetOfficer,
    handleSubmitBudgetToGovt,
    handleCreatedTech,
    handleUpdatedTech,
    handleDeletedTech,
    handleCreatedBudgetOfficer,
    handleUpdatedBudgetOfficer,
    handleDeletedBudgetOfficer,
    handleCreatedDistrict,
    handleDeletedDistrict,
    handleSelectDepartment
  } = useDepartmentPortal({ user });

  const renderContent = () => {
    if (selectedProblem) {
      return (
        <DepartmentProblemActionPanel
          problem={selectedProblem}
          department={department}
          onClose={() => setSelectedProblem(null)}
          onUpdateProblem={handleUpdateProblem}
          onAssignTechnician={setAssigningProblemTech}
        />
      );
    }

    switch (activeTab) {
      case 'problems':
        return (
          <DepartmentProblemsPanel
            problems={problems}
            onSelectProblem={(p) => setSelectedProblem(p)}
            onAssignToTech={setAssigningProblemTech}
          />
        );
      case 'prototypes':
        return (
          <DepartmentPrototypesPanel
            problems={problems}
            onAssignToBudgetOfficer={setAssigningBudgetProblem}
          />
        );
      case 'technicians':
      case 'field-workers':
        return (
          <DepartmentTechniciansPanel
            technicians={technicians}
            department={department}
            onAddTech={() => setIsAddTechOpen(true)}
            onViewTech={setViewingTech}
            onEditTech={setEditingTech}
            onDeletedTech={handleDeletedTech}
          />
        );
      case 'budget-officers':
        return (
          <DepartmentBudgetOfficersPanel
            officers={budgetOfficers}
            department={department}
            onAddOfficer={() => setShowAddBudgetOfficerModal(true)}
            onViewOfficer={setViewingBudgetOfficer}
            onEditOfficer={setEditingBudgetOfficer}
            onDeletedOfficer={handleDeletedBudgetOfficer}
          />
        );
      case 'budget-approvals':
        return (
          <DepartmentBudgetReviewPanel
            problems={problems}
            onSubmitToGovernment={handleSubmitBudgetToGovt}
          />
        );
      case 'csr-grant':
        return <DepartmentCsrGrantPanel department={department} problems={problems} />;
      case 'districts':
        if (isWardDept) {
          return (
            <DepartmentOverview
              department={department}
              problems={problems}
              onSelectProblem={(p) => setSelectedProblem(p)}
              onNavigateProblems={() => setActiveTab('problems')}
            />
          );
        }
        return (
          <DepartmentDistrictsPanel
            districts={districts}
            isDistrictDept={department?.category === 'District Department'}
            isBlockDept={department?.category === 'Block / Tehsil Office'}
            onAddDistrict={() => setIsAddDistrictOpen(true)}
            onDeletedDistrict={handleDeletedDistrict}
          />
        );
      case 'overview':
      default:
        return (
          <DepartmentOverview
            department={department}
            problems={problems}
            onSelectProblem={(p) => setSelectedProblem(p)}
            onNavigateProblems={() => setActiveTab('problems')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden h-screen text-slate-800 antialiased select-none">
      <DepartmentHeader
        department={department}
        activeTab={activeTab}
        onNavigateTab={(t) => {
          setSelectedProblem(null);
          setActiveTab(t);
          setIsMobileMenuOpen(false);
        }}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        allDepartments={allDepartments}
        onSelectDepartment={handleSelectDepartment}
      />

      <div className="flex-1 flex flex-row min-w-0 min-h-0 overflow-hidden bg-white">
        <DepartmentSidebar
          activeTab={activeTab}
          setActiveTab={(t) => {
            setSelectedProblem(null);
            setActiveTab(t);
            setIsMobileMenuOpen(false);
          }}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          departmentName={department?.name || 'Department Authority'}
          departmentCategory={department?.category || 'State Ministry'}
          onLogout={onLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar pb-20 md:pb-4">
            <div className="max-w-7xl mx-auto w-full">
              {loading ? (
                <div className="py-20 text-center text-slate-400 font-bold text-xs">
                  Loading Department Dashboard...
                </div>
              ) : (
                renderContent()
              )}
            </div>
          </main>
          <GovernmentFooter />
        </div>
      </div>

      <DepartmentMobileNav
        activeTab={activeTab}
        onSelectTab={(t) => {
          setSelectedProblem(null);
          setActiveTab(t);
          setIsMobileMenuOpen(false);
        }}
        problemCount={problems.length}
        techCount={technicians.length}
        districtCount={districts.length}
        isWard={isWardDept}
      />

      {/* Modals */}
      <DepartmentModals
        department={department}
        technicians={technicians}
        budgetOfficers={budgetOfficers}
        isWardDept={isWardDept}
        isAddTechOpen={isAddTechOpen}
        setIsAddTechOpen={setIsAddTechOpen}
        handleCreatedTech={handleCreatedTech}
        showAddBudgetOfficerModal={showAddBudgetOfficerModal}
        setShowAddBudgetOfficerModal={setShowAddBudgetOfficerModal}
        handleCreatedBudgetOfficer={handleCreatedBudgetOfficer}
        viewingBudgetOfficer={viewingBudgetOfficer}
        setViewingBudgetOfficer={setViewingBudgetOfficer}
        editingBudgetOfficer={editingBudgetOfficer}
        setEditingBudgetOfficer={setEditingBudgetOfficer}
        handleUpdatedBudgetOfficer={handleUpdatedBudgetOfficer}
        isAddDistrictOpen={isAddDistrictOpen}
        setIsAddDistrictOpen={setIsAddDistrictOpen}
        handleCreatedDistrict={handleCreatedDistrict}
        viewingTech={viewingTech}
        setViewingTech={setViewingTech}
        editingTech={editingTech}
        setEditingTech={setEditingTech}
        handleUpdatedTech={handleUpdatedTech}
        assigningProblemTech={assigningProblemTech}
        setAssigningProblemTech={setAssigningProblemTech}
        handleUpdateProblem={handleUpdateProblem}
        assigningBudgetProblem={assigningBudgetProblem}
        setAssigningBudgetProblem={setAssigningBudgetProblem}
        handleAssignBudgetOfficer={handleAssignBudgetOfficer}
      />
    </div>
  );
};

export default DepartmentPortal;
