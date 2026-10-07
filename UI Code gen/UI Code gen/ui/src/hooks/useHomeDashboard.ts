import { useEffect, useState } from 'react';
import { getHomeDashboard } from '../services/homeService';
import type { HomeDashboard } from '../types/viewmodel/home';

export interface UseHomeDashboardResult {
  dashboard: HomeDashboard | null;
  isLoading: boolean;
  loadError: string | null;
  /** Re-runs the fetch; pass as the ErrorBanner's onRetry handler. */
  reload: () => void;
}

/**
 * Encapsulates the Home dashboard's data-fetching lifecycle (loading/error/
 * success), keeping `HomePage.tsx` focused on layout/presentation only
 * (Constitution §13a — standard loading/error/empty state pattern).
 */
export function useHomeDashboard(): UseHomeDashboardResult {
  const [dashboard, setDashboard] = useState<HomeDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  function load(): void {
    setIsLoading(true);
    setLoadError(null);
    getHomeDashboard()
      .then((result) => {
        setDashboard(result);
      })
      .catch(() => {
        setLoadError("Couldn't load the Home dashboard. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-time fetch on mount
  }, []);

  return { dashboard, isLoading, loadError, reload: load };
}
