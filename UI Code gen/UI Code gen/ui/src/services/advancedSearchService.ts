import type { AdvancedSearchQueryDto } from '../types/dto/advancedSearch';
import type { AdvancedSearchResults } from '../types/viewmodel/advancedSearch';
import { mapAdvancedSearchResultsDtoToViewModel } from './advancedSearchMappers';
import { MOCK_ADVANCED_SEARCH_RESULTS_DTO } from './mocks/advancedSearchMocks';

/**
 * Runs an advanced dealer search. Currently backed by mock data
 * (see services/mocks/advancedSearchMocks.ts) until the real backend
 * endpoint is available (Constitution §13b).
 */
export function searchDealers(_query: AdvancedSearchQueryDto): Promise<AdvancedSearchResults> {
  void _query;
  return Promise.resolve(mapAdvancedSearchResultsDtoToViewModel(MOCK_ADVANCED_SEARCH_RESULTS_DTO));
}
