import {
  LayoutDashboard,
  GraduationCap,
  IndianRupee,
  Map,
  Users,
  FileText,
  Building2,
  Briefcase,
  ShieldCheck,
  Layers,
  FolderKanban,
  PlayCircle,
  FileCheck,
  CheckCircle2,
  Cpu,
  Landmark
} from 'lucide-react';

export const GOV_MAIN_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'heis', label: 'HEI Hub', icon: GraduationCap },
  { id: 'csr', label: 'CSR Grants', icon: IndianRupee },
  { id: 'gis', label: 'GIS Map', icon: Map },
  {
    id: 'projects_solutions',
    label: 'Projects & Solutions',
    icon: FolderKanban,
    subItems: [
      { id: 'projects_proposals', label: 'Solution Proposals', icon: FileCheck },
      { id: 'projects_active', label: 'Active Projects', icon: PlayCircle },
      { id: 'projects_milestones', label: 'Milestones & Monitoring', icon: CheckCircle2 },
      { id: 'projects_prototypes', label: 'Prototypes & TRL', icon: Cpu },
      { id: 'dept-budgets', label: 'Dept Budgets', icon: Landmark }
    ]
  },
  {
    id: 'user_governance',
    label: 'User Governance',
    icon: Users,
    subItems: [
      { id: 'governance_universities', label: 'Manage Universities', icon: Building2 },
      { id: 'governance_industries', label: 'Manage Industries', icon: Briefcase },
      { id: 'users_admin', label: 'User Admin', icon: ShieldCheck }
    ]
  },
  {
    id: 'departments_governance',
    label: 'Departments',
    icon: Landmark,
    subItems: [
      { id: 'dept_state', label: 'State Ministries', icon: Landmark },
      { id: 'dept_district', label: 'District Departments', icon: Building2 },
      { id: 'dept_block', label: 'Block / Tehsil Offices', icon: Layers },
      { id: 'dept_panchayat', label: 'Gram Panchayats / Wards', icon: Map }
    ]
  },
  { id: 'reports', label: 'Reports', icon: FileText }
];

const TAB_TITLES = {
  projects_solutions: 'Projects & Solutions Dashboard',
  projects_active: 'Active Projects in Progress',
  projects_proposals: 'Solution Proposals Queue',
  projects_milestones: 'Milestones & Stage Gate Compliance',
  projects_prototypes: 'Prototypes & TRL Monitoring',
  projects_deployment: 'Field Deployment & Telemetry',
  heis: 'HEI Hub & University Directory',
  csr: 'CSR Grants & Corporate Partnerships',
  gis: 'Jharkhand Geospatial Information System (GIS)',
  governance_industries: 'Industry & Partner Directory',
  users_admin: 'User Admin & Departmental Governance',
  dept_state: 'State Ministries Governance',
  dept_district: 'District Departments Governance',
  dept_panchayat: 'Gram Panchayats / Wards Governance',
  dept_block: 'Block Offices Governance',
  reports: 'Executive Reports & Audits'
};

export const getGovTabTitle = (tab) => TAB_TITLES[tab] || 'Innovation Module';
