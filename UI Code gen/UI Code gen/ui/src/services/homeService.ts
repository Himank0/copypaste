import type { HomeDashboard } from '../types/viewmodel/home';
import { mapHomeDashboardDtoToViewModel } from './homeMappers';
import { MOCK_HOME_DASHBOARD_DTO } from './mocks/homeMocks';

/**
 * Fetches the Home dashboard dataset (lifecycle stage counts + recently
 * accessed dealers). Currently backed by mock data (see services/mocks/homeMocks.ts)
 * until a real endpoint exists — HomePage.tsx is unaffected either way since
 * it only depends on this function's Promise<HomeDashboard> shape (Constitution §13b).
 */
export async function getHomeDashboard(): Promise<HomeDashboard> {
  // TODO: replace with `apiClient.get<HomeDashboardDto>('/home/dashboard')` once available.
  const dto = MOCK_HOME_DASHBOARD_DTO;
  return mapHomeDashboardDtoToViewModel(dto);
}
