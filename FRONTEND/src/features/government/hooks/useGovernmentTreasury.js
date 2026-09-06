import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../infrastructure/api/client.js';
import { projectCsrSyncService } from '../services/projectCsrSyncService.js';

export const useGovernmentTreasury = () => {
  const [treasury, setTreasury] = useState({
    stateGrantsTotal: 0,
    totalDisbursed: 0,
    availableStateFund: 0,
    isLoading: true
  });

  const fetchTreasury = useCallback(async () => {
    try {
      const [fundsRes, ledgerRes] = await Promise.all([
        apiClient.get('government/funds').catch(() => ({ data: { data: {} } })),
        apiClient.get('government/funds/ledger').catch(() => ({ data: { data: [] } }))
      ]);

      const fData = fundsRes.data?.data || fundsRes.data || {};
      const lData = ledgerRes.data?.data || ledgerRes.data || [];

      const totalAllocated = Number(fData.stateGrantsTotal) || 0;
      const totalDisbursed = Array.isArray(lData)
        ? lData
            .filter((t) => t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success')
            .reduce((sum, t) => sum + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0)
        : 0;

      const available = Math.max(0, totalAllocated - totalDisbursed);

      setTreasury({
        stateGrantsTotal: totalAllocated,
        totalDisbursed,
        availableStateFund: available,
        isLoading: false
      });
    } catch {
      setTreasury((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchTreasury();
    const unsub = projectCsrSyncService.subscribe(fetchTreasury);
    return () => unsub?.();
  }, [fetchTreasury]);

  const hasSufficientFund = useCallback(
    (requiredAmount) => {
      const req = Number(requiredAmount) || 0;
      return treasury.availableStateFund >= req && treasury.availableStateFund > 0;
    },
    [treasury.availableStateFund]
  );

  return {
    ...treasury,
    isLowFund: treasury.availableStateFund <= 0,
    hasSufficientFund,
    refreshTreasury: fetchTreasury
  };
};

export default useGovernmentTreasury;
