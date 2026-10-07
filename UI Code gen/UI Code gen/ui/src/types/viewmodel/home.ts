import type { StatCardColor } from '../../components/common/StatCard';

/** UI-facing shapes consumed by HomePage. Built from home DTOs via mappers.ts. */
export interface LifecycleStage {
  stageId: string;
  label: string;
  count: number;
  color: StatCardColor;
}

export type DealerStatus = 'active' | 'de-commissioned' | 'pending';

export interface RecentDealer {
  dealerId: string;
  dealerName: string;
  categoryUnit: string;
  dealerCode: string;
  status: DealerStatus;
  email: string;
  phone: string;
}

export interface HomeDashboard {
  lifecycleStages: LifecycleStage[];
  recentDealers: RecentDealer[];
  totalDealerCount: number;
}
