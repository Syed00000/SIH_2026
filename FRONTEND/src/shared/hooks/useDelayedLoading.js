import { useState, useEffect } from 'react';

/**
 * Custom hook to delay the rendering of loading skeletons.
 * Prevents skeleton flickering on fast networks.
 *
 * @param {boolean} isLoading - The actual loading state from data fetching
 * @param {number} delay - The delay in ms before showing the skeleton (default: 200ms)
 * @returns {boolean} - The delayed loading state to use for UI rendering
 */
export const useDelayedLoading = (isLoading, delay = 200) => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      // If loading starts, wait for the delay before showing skeleton
      timeoutId = setTimeout(() => {
        setShowSkeleton(true);
      }, delay);
    } else {
      // If loading finishes, immediately hide the skeleton
      setShowSkeleton(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, delay]);

  return showSkeleton;
};
