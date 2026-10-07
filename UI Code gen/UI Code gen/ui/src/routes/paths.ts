/**
 * Central registry of named route path constants (Constitution §13).
 * Feature components MUST reference these constants rather than using
 * uncoordinated string literals for navigation.
 */
export const ROUTE_PATHS = {
  login: '/login',
  home: '/',
  dealerDetails: '/dealers/:dealerId',
  advancedSearch: '/advance-search',
} as const;

/** Builds the concrete dealer-details path for a given dealer id. */
export function buildDealerDetailsPath(dealerId: string): string {
  return `/dealers/${encodeURIComponent(dealerId)}`;
}
