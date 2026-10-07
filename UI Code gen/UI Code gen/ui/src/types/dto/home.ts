/**
 * Raw backend response shapes for the Home dashboard. These mirror the
 * (not-yet-approved) API contract and MUST NOT be used directly in
 * components — map to ui/src/types/viewmodel/home.ts first (Constitution §3.5).
 */
export interface LifecycleStageDto {
  stageId: string;
  label: string;
  count: number;
}

export interface RecentDealerDto {
  dealerId: string;
  dealerName: string;
  categoryUnit: string;
  dealerCode: string;
  status: string;
  email: string;
  phone: string;
}

export interface HomeDashboardDto {
  lifecycleStages: LifecycleStageDto[];
  recentDealers: RecentDealerDto[];
  totalDealerCount: number;
}
