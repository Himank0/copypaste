import type { LifecycleStageDto, RecentDealerDto, HomeDashboardDto } from '../types/dto/home';
import type { LifecycleStage, RecentDealer, DealerStatus, HomeDashboard } from '../types/viewmodel/home';
import type { StatCardColor } from '../components/common/StatCard';

const STAGE_COLOR_BY_ID: Record<string, StatCardColor> = {
  'on-hold': 'red',
  'being-drafted': 'blue',
  'filed-complete': 'green',
  'to-commission': 'teal',
  'telstra-executed': 'purple',
  'to-dealer': 'orange',
};

function mapStatus(status: string): DealerStatus {
  if (status === 'active' || status === 'de-commissioned' || status === 'pending') {
    return status;
  }
  return 'pending';
}

function mapLifecycleStage(dto: LifecycleStageDto): LifecycleStage {
  return {
    stageId: dto.stageId,
    label: dto.label,
    count: dto.count,
    color: STAGE_COLOR_BY_ID[dto.stageId] ?? 'blue',
  };
}

function mapRecentDealer(dto: RecentDealerDto): RecentDealer {
  return {
    dealerId: dto.dealerId,
    dealerName: dto.dealerName,
    categoryUnit: dto.categoryUnit,
    dealerCode: dto.dealerCode,
    status: mapStatus(dto.status),
    email: dto.email,
    phone: dto.phone,
  };
}

/** Maps the raw Home dashboard DTO to the UI-facing view model (Constitution §3.5). */
export function mapHomeDashboardDtoToViewModel(dto: HomeDashboardDto): HomeDashboard {
  return {
    lifecycleStages: dto.lifecycleStages.map(mapLifecycleStage),
    recentDealers: dto.recentDealers.map(mapRecentDealer),
    totalDealerCount: dto.totalDealerCount,
  };
}
