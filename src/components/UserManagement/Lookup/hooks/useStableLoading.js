import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to create a debounced loading state
 * Provides a more stable loading experience by delaying the start and ensuring a minimum display time
 * 
 * @param {boolean} isLoading - Current loading state
 * @param {number} minDisplayTime - Minimum time in ms to show loading state
 * @param {number} delayStart - Delay in ms before showing loading state
 * @returns {boolean} Stabilized loading state
 */
const useStableLoading = (isLoading, minDisplayTime = 800, delayStart = 500) => {
  const [isStableLoading, setIsStableLoading] = useState(false);
  const loadingStartTimeRef = useRef(null);

  useEffect(() => {
    let startTimeout, endTimeout;

    if (isLoading && !isStableLoading) {
      // Delay showing the loading indicator
      startTimeout = setTimeout(() => {
        loadingStartTimeRef.current = Date.now();
        setIsStableLoading(true);
      }, delayStart);
    } else if (!isLoading && isStableLoading) {
      // Calculate how long the loading indicator has been visible
      const currentTime = Date.now();
      const elapsedTime = loadingStartTimeRef.current
        ? currentTime - loadingStartTimeRef.current
        : 0;

      // If it hasn't been visible for the minimum time, delay hiding it
      if (elapsedTime < minDisplayTime) {
        endTimeout = setTimeout(() => {
          setIsStableLoading(false);
          loadingStartTimeRef.current = null;
        }, minDisplayTime - elapsedTime);
      } else {
        // It's been visible long enough, hide it immediately
        setIsStableLoading(false);
        loadingStartTimeRef.current = null;
      }
    }

    return () => {
      if (startTimeout) clearTimeout(startTimeout);
      if (endTimeout) clearTimeout(endTimeout);
    };
  }, [isLoading, isStableLoading, minDisplayTime, delayStart]);

  return isStableLoading;
};

export default useStableLoading;