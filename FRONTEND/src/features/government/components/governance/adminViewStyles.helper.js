export const MASKED_CREDENTIAL = '••••••••••••';

export const getRoleTextStyle = (role) => {
  const map = {
    'Super Admin': 'text-purple-700 font-bold',
    'Nodal Officer': 'text-blue-700 font-bold',
    'District Admin': 'text-sky-700 font-bold',
    'HEI Admin': 'text-cyan-700 font-bold'
  };
  return map[role] || 'text-slate-700 font-semibold';
};

export const getStatusStyle = (status) => {
  if (status === 'Active') {
    return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
  }
  if (status === 'Suspended') {
    return { text: 'text-amber-600', dot: 'bg-amber-500' };
  }
  return { text: 'text-red-600', dot: 'bg-red-500' };
};
