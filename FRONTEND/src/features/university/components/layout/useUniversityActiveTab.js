import { useState, useEffect } from 'react';

export const useUniversityActiveTab = (defaultTab = 'dashboard') => {
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
      const stored = localStorage.getItem('joharsetu_uni_active_tab');
      if (stored) return stored;
    } catch {
      // fallback
    }
    return defaultTab;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('joharsetu_uni_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');
        if (urlTab) {
          setActiveTab(urlTab);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [activeTab, handleSetActiveTab];
};

export default useUniversityActiveTab;
