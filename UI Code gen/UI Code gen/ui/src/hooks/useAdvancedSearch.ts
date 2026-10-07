import { useState } from 'react';
import { searchDealers } from '../services/advancedSearchService';
import type { AdvancedSearchQueryDto } from '../types/dto/advancedSearch';
import type { DealerSearchResult } from '../types/viewmodel/advancedSearch';

export interface UseAdvancedSearchResult {
  results: DealerSearchResult[] | null;
  totalCount: number;
  isLoading: boolean;
  loadError: string | null;
  hasSearched: boolean;
  /** Runs the search with the given query parameters. */
  runSearch: (query: AdvancedSearchQueryDto) => void;
}

/**
 * Encapsulates the Advanced Search screen's data-fetching lifecycle
 * (loading/error/success), keeping `AdvancedSearch.tsx` focused on form
 * layout/presentation only (Constitution §13a).
 */
export function useAdvancedSearch(): UseAdvancedSearchResult {
  const [results, setResults] = useState<DealerSearchResult[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  function runSearch(query: AdvancedSearchQueryDto): void {
    setIsLoading(true);
    setLoadError(null);
    setHasSearched(true);
    searchDealers(query)
      .then((result) => {
        setResults(result.results);
        setTotalCount(result.totalCount);
      })
      .catch(() => {
        setLoadError("Couldn't run the search. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return { results, totalCount, isLoading, loadError, hasSearched, runSearch };
}
