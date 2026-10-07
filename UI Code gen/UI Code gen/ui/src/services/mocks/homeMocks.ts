import type { HomeDashboardDto } from '../../types/dto/home';

// #region MOCK_DATA_TODO — replace with GET /api/home/dashboard once the real endpoint exists
export const MOCK_HOME_DASHBOARD_DTO: HomeDashboardDto = {
  lifecycleStages: [
    { stageId: 'on-hold', label: 'On Hold', count: 885 },
    { stageId: 'being-drafted', label: 'Being Drafted', count: 49 },
    { stageId: 'filed-complete', label: 'Filed Complete', count: 0 },
    { stageId: 'to-commission', label: 'To Commission', count: 0 },
    { stageId: 'telstra-executed', label: 'Telstra Executed', count: 3703 },
    { stageId: 'to-dealer', label: 'To Dealer', count: 102487 },
  ],
  recentDealers: [
    {
      dealerId: 'dealer-1001',
      dealerName: 'Northside Telstra Partner',
      categoryUnit: 'Retail / Unit 4',
      dealerCode: 'SD-10045',
      status: 'de-commissioned',
      email: 'contact@northsidepartner.com.au',
      phone: '02 9000 1234',
    },
    {
      dealerId: 'dealer-1002',
      dealerName: 'Coastal Mobile Solutions',
      categoryUnit: 'Business / Unit 2',
      dealerCode: 'SD-10046',
      status: 'active',
      email: 'info@coastalmobile.com.au',
      phone: '07 3000 5678',
    },
    {
      dealerId: 'dealer-1003',
      dealerName: 'Highland Communications',
      categoryUnit: 'Retail / Unit 1',
      dealerCode: 'SD-10047',
      status: 'pending',
      email: 'admin@highlandcomms.com.au',
      phone: '03 9000 4321',
    },
    {
      dealerId: 'dealer-1004',
      dealerName: 'Metro Connect Dealer Group',
      categoryUnit: 'Business / Unit 5',
      dealerCode: 'SD-10048',
      status: 'active',
      email: 'hello@metroconnect.com.au',
      phone: '08 8000 2468',
    },
    {
      dealerId: 'dealer-1005',
      dealerName: 'Summit Telecom Partners',
      categoryUnit: 'Retail / Unit 3',
      dealerCode: 'SD-10049',
      status: 'active',
      email: 'support@summittelecom.com.au',
      phone: '02 9000 9876',
    },
  ],
  totalDealerCount: 10,
};
// #endregion MOCK_DATA_TODO
