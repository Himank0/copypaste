import './AppShell.css';

export interface AppShellNavItem {
  tabId: string;
  label: string;
}

export interface AppShellUser {
  displayName: string;
  initials: string;
}

export interface AppShellProps {
  /** Persistent top navigation items (e.g. Home, Dealers, Advance Search). */
  navItems?: AppShellNavItem[];
  /** Currently active nav tab id. */
  activeTabId?: string;
  /** Called when a nav item is clicked. */
  onNavigate?: (item: AppShellNavItem) => void;
  /** Called when the brand/logo is clicked (typically navigates Home). */
  onBrandClick?: () => void;
  /** Signed-in user shown in the top-right corner. */
  user?: AppShellUser;
  /** Called when Logout is clicked. */
  onLogout?: () => void;
  /** Page content rendered below the header. */
  children?: React.ReactNode;
}

const DEFAULT_NAV_ITEMS: AppShellNavItem[] = [{ tabId: 'home', label: 'Home' }];

const DEFAULT_USER: AppShellUser = { displayName: 'Guest User', initials: 'GU' };

function noop(): void {
  // Default no-op so AppShell is safely previewable standalone with zero props.
}

function noopNavigate(item: AppShellNavItem): void {
  void item;
}

/**
 * Persistent application header: brand/logo, top-level navigation tabs, and
 * signed-in user menu with logout. Intended to wrap every authenticated
 * feature screen.
 *
 * @example
 * <AppShell navItems={tabs} activeTabId="home" user={user} onLogout={logout}>
 *   <HomePage />
 * </AppShell>
 */
export function AppShell({
  navItems = DEFAULT_NAV_ITEMS,
  activeTabId = navItems[0]?.tabId,
  onNavigate = noopNavigate,
  onBrandClick = noop,
  user = DEFAULT_USER,
  onLogout = noop,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <button type="button" className="app-shell-brand" onClick={onBrandClick} aria-label="Home">
          <span className="app-shell-brand__logo">T</span>
        </button>

        <nav className="app-shell-nav" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.tabId}
              type="button"
              className={
                item.tabId === activeTabId
                  ? 'app-shell-nav__button app-shell-nav__button--active'
                  : 'app-shell-nav__button'
              }
              aria-current={item.tabId === activeTabId ? 'page' : undefined}
              onClick={() => onNavigate(item)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-shell-user">
          <span className="app-shell-user__avatar" aria-hidden="true">
            {user.initials}
          </span>
          <span className="app-shell-user__name">{user.displayName}</span>
          <button type="button" className="app-shell-user__logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}

export default AppShell;
