/** UI view model for a single dealer row in Advanced Search results. */
export interface DealerSearchResult {
  dealerId: string;
  dealerName: string;
  dealerRefNumber: string;
  dealerStatus: string;
  tradingName: string;
  suburb: string;
}

export interface AdvancedSearchResults {
  results: DealerSearchResult[];
  totalCount: number;
}

/** Form state for every Advanced Search field (Constitution §13c). */
export interface AdvancedSearchFormValues {
  keyword: string;
  searchType: string;
  channel: string;
  state: string;
  documentName: string;
  module: string;
  documentVersion: string;
  documentStatus: string;
  documentType: string;
  taskDefinition: string;
  taskStatus: string;
  assignedTo: string;
  codeType: string;
  codes: string;
  newDealersPending: boolean;
  terminated: boolean;
  sdCode: string;
  accountManager: string;
  dealerCode: string;
  businessUnitTb: boolean;
  businessUnitTeg: boolean;
  businessUnitTccw: boolean;
  premiseCode: string;
  dealerUnderNegotiation: boolean;
}
