import type { AdvancedSearchResultsDto, DealerSearchResultDto } from '../types/dto/advancedSearch';
import type { AdvancedSearchResults, DealerSearchResult } from '../types/viewmodel/advancedSearch';

function mapDealerSearchResult(dto: DealerSearchResultDto): DealerSearchResult {
  return {
    dealerId: dto.dealerId,
    dealerName: dto.dealerName,
    dealerRefNumber: dto.dealerRefNumber,
    dealerStatus: dto.dealerStatus,
    tradingName: dto.tradingName,
    suburb: dto.suburb,
  };
}

export function mapAdvancedSearchResultsDtoToViewModel(dto: AdvancedSearchResultsDto): AdvancedSearchResults {
  return {
    results: dto.results.map(mapDealerSearchResult),
    totalCount: dto.totalCount,
  };
}
