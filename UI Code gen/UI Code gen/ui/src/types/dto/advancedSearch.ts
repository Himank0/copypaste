/** Raw DTO shape returned by the advanced search backend (Constitution §13b). */
export interface DealerSearchResultDto {
  dealerId: string;
  dealerName: string;
  dealerRefNumber: string;
  dealerStatus: string;
  tradingName: string;
  suburb: string;
}

export interface AdvancedSearchResultsDto {
  results: DealerSearchResultDto[];
  totalCount: number;
}

/** Query parameters accepted by the advanced search endpoint. */
export interface AdvancedSearchQueryDto {
  keyword?: string;
  searchType?: string;
  channel?: string;
  state?: string;
  documentName?: string;
  module?: string;
  documentVersion?: string;
  documentStatus?: string;
  documentType?: string;
  taskDefinition?: string;
  taskStatus?: string;
  assignedTo?: string;
  codeType?: string;
  codes?: string;
  newDealersPending?: boolean;
  terminated?: boolean;
  sdCode?: string;
  accountManager?: string;
  dealerCode?: string;
  businessUnits?: string[];
  premiseCode?: string;
  dealerUnderNegotiation?: boolean;
  page?: number;
  pageSize?: number;
}
