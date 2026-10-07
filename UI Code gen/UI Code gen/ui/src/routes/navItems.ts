import type { AppShellNavItem } from '../components/layout/AppShell';

/**
 * Single source of truth for AppShell's persistent top navigation items
 * (Constitution §13). Feature screens MUST import this rather than
 * redefining their own nav item list.
 */
export const APP_NAV_ITEMS: AppShellNavItem[] = [
  { tabId: 'home', label: 'Home' },
  { tabId: 'dealers', label: 'Dealers' },
  { tabId: 'advance-search', label: 'Advance Search' },
  { tabId: 'create-dealer', label: '+ Create New Dealer' },
  { tabId: 'my-tasks', label: 'My Tasks' },
  { tabId: 'reports', label: 'Reports' },
  { tabId: 'admin', label: 'Admin' },
];
