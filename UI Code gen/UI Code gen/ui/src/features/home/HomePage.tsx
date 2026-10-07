import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { APP_NAV_ITEMS } from '../../routes/navItems';
import { Button } from '../../components/common/Button';
import { SectionHeading } from '../../components/common/SectionHeading';
import { QuickSearchBar } from '../../components/common/QuickSearchBar';
import { StatCard } from '../../components/common/StatCard';
import { BarChart } from '../../components/common/BarChart';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { EmptyState } from '../../components/common/EmptyState';
import { DataTable, DataTableBadge, type DataTableColumn } from '../../components/table/DataTable';
import { useAuth } from '../../context/AuthContext';
import { useHomeDashboard } from '../../hooks/useHomeDashboard';
import { ROUTE_PATHS, buildDealerDetailsPath } from '../../routes/paths';
import type { DealerStatus, RecentDealer } from '../../types/viewmodel/home';
import './HomePage.css';

export interface HomePageProps {
  onViewAllDealers?: () => void;
  onFullDirectory?: () => void;
  onCreateDealer?: () => void;
  onMyTasks?: () => void;
  onReports?: () => void;
}

const PAGE_SIZE = 5;

function noop(): void {
  // Default no-op so this component is safely previewable standalone
  // (see ui/preview.html?component=home/HomePage) with zero props supplied.
}

function statusBadgeTone(status: DealerStatus): 'default' | 'danger' | 'success' | 'warning' {
  switch (status) {
    case 'active':
      return 'success';
    case 'de-commissioned':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
}

function statusLabel(status: DealerStatus): string {
  return status.toUpperCase();
}

export function HomePage({
  onViewAllDealers = noop,
  onFullDirectory = noop,
  onCreateDealer = noop,
  onMyTasks = noop,
  onReports = noop,
}: HomePageProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  const { dashboard, isLoading, loadError, reload } = useHomeDashboard();

  const lifecycleStages = dashboard?.lifecycleStages ?? [];
  const recentDealers = dashboard?.recentDealers ?? [];
  const totalDealerCount = dashboard?.totalDealerCount ?? 0;

  const chartData = useMemo(
    () => lifecycleStages.map((stage) => ({ label: stage.label, value: stage.count, color: stage.color })),
    [lifecycleStages]
  );

  const pagedDealers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return recentDealers.slice(start, start + PAGE_SIZE);
  }, [recentDealers, page]);

  const columns: DataTableColumn<RecentDealer>[] = [
    { key: 'dealerName', header: 'Dealer Name', render: (r) => r.dealerName },
    { key: 'categoryUnit', header: 'Category / Unit', render: (r) => r.categoryUnit },
    { key: 'dealerCode', header: 'SD / Dealer Code', render: (r) => r.dealerCode },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <DataTableBadge tone={statusBadgeTone(r.status)}>{statusLabel(r.status)}</DataTableBadge>,
    },
    { key: 'email', header: 'Email', render: (r) => r.email },
    { key: 'phone', header: 'Phone', render: (r) => r.phone },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <Button variant="outline" size="sm" onClick={() => navigate(buildDealerDetailsPath(r.dealerId))}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      navItems={APP_NAV_ITEMS}
      activeTabId="home"
      onNavigate={(item) => {
        if (item.tabId === 'advance-search') {
          navigate(ROUTE_PATHS.advancedSearch);
        }
      }}
      user={user ? { displayName: user.displayName, initials: user.initials } : undefined}
      onLogout={() => {
        logout();
        navigate(ROUTE_PATHS.login, { replace: true });
      }}
    >
      <div className="home-page">
        <section className="home-section">
          <SectionHeading eyebrow="Section 1: Home Workspace" title="Dealer Management & Task Overview" />

          <div className="home-page__actions">
            <Button variant="outline" badge={6} onClick={onMyTasks}>
              My Tasks
            </Button>
            <Button variant="outline" onClick={onReports}>
              Reports & Extracts
            </Button>
            <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.advancedSearch)}>
              Advanced Search
            </Button>
            <Button variant="filled" onClick={onCreateDealer}>
              + Create New Dealer
            </Button>
          </div>

          <QuickSearchBar
            label="Quick Search Active Dealer Records"
            placeholder="Search by dealer name, code, or trading name..."
            value={searchValue}
            onChange={setSearchValue}
            actionLabel="Full Directory"
            onAction={onFullDirectory}
          />
        </section>

        {isLoading ? (
          <LoadingSpinner label="Loading dashboard…" fullWidth />
        ) : loadError ? (
          <ErrorBanner message={loadError} onRetry={reload} />
        ) : (
          <>
            <section className="home-section">
              <SectionHeading eyebrow="Contracts Team Lifecycle" title="Graphic Display of Current Tasks" />

              {lifecycleStages.length === 0 ? (
                <EmptyState message="No lifecycle data available yet." />
              ) : (
                <>
                  <div className="home-page__stat-grid">
                    {lifecycleStages.map((stage) => (
                      <StatCard key={stage.stageId} value={stage.count} label={stage.label} color={stage.color} />
                    ))}
                  </div>

                  <BarChart data={chartData} />
                </>
              )}
            </section>

            <section className="home-section">
              <SectionHeading eyebrow="Quick Access" title="Recently Accessed Dealers" />

              {recentDealers.length === 0 ? (
                <EmptyState message="No recently accessed dealers yet." />
              ) : (
                <DataTable
                  columns={columns}
                  rows={pagedDealers}
                  getRowKey={(r) => r.dealerId}
                  totalCount={totalDealerCount}
                  viewAllLabel={`View all dealers (${totalDealerCount})`}
                  onViewAll={onViewAllDealers}
                  page={page}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                />
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

export default HomePage;
