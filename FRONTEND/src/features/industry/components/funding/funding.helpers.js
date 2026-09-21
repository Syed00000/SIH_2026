export const formatAmountINR = (val) => {
  const n = Number(val) || 0;
  return `₹ ${n.toLocaleString('en-IN')}`;
};

export const formatLakhs = (val) => {
  const n = Number(val) || 0;
  if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
  return `₹ ${(n / 100000).toFixed(2)} Lakhs`;
};
