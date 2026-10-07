import type { AdvancedSearchResultsDto } from '../../types/dto/advancedSearch';

// #region MOCK_DATA_TODO — replace with GET /api/dealers/advanced-search once the real endpoint exists
export const MOCK_ADVANCED_SEARCH_RESULTS_DTO: AdvancedSearchResultsDto = {
  results: [
    {
      dealerId: 'dealer-d00392',
      dealerName: 'Micro Tech Sales Pty Ltd',
      dealerRefNumber: 'D00392',
      dealerStatus: 'Active',
      tradingName: 'Solve Communications (Aust)',
      suburb: 'South Melbourne',
    },
  ],
  totalCount: 1,
};
// #endregion MOCK_DATA_TODO
