export const parseBudgetAmount = (val, fallback = 0) => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const str = String(val).trim();
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return isNaN(parsed) || cleaned === '' ? fallback : parsed;
};

export const formatIndianCurrency = (val, fallback = '0') => {
  const amount = parseBudgetAmount(val, null);
  if (amount === null || isNaN(amount)) return fallback;
  return amount.toLocaleString('en-IN');
};

export const getPreliminaryBudget = (task) => {
  if (!task) return 0;
  const candidate = task.sanctionedBudget || task.estimatedCost || task.budget;
  return parseBudgetAmount(candidate, 0);
};
