import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { APP_NAV_ITEMS } from '../../routes/navItems';
import { Button } from '../../components/common/Button';
import { SectionHeading } from '../../components/common/SectionHeading';
import { FormField } from '../../components/common/FormField';
import { SelectField, type SelectFieldOption } from '../../components/common/SelectField';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorBanner } from '../../components/common/ErrorBanner';
import { EmptyState } from '../../components/common/EmptyState';
import { DataTable, type DataTableColumn } from '../../components/table/DataTable';
import { useAuth } from '../../context/AuthContext';
import { useAdvancedSearch } from '../../hooks/useAdvancedSearch';
import { ROUTE_PATHS } from '../../routes/paths';
import type { AdvancedSearchFormValues } from '../../types/viewmodel/advancedSearch';
import type { DealerSearchResult } from '../../types/viewmodel/advancedSearch';
import './AdvancedSearch.css';

const NA_OPTIONS: SelectFieldOption[] = [{ value: 'N/A', label: 'N/A' }];

const SEARCH_TYPE_OPTIONS: SelectFieldOption[] = [
  { value: 'Dealer', label: 'Dealer' },
  { value: 'Document', label: 'Document' },
  { value: 'Task', label: 'Task' },
];

const CODE_TYPE_OPTIONS: SelectFieldOption[] = [{ value: 'Select existing', label: 'Select existing' }];

const ACCOUNT_MANAGER_OPTIONS: SelectFieldOption[] = [{ value: 'Any', label: 'Any' }];

const INITIAL_FORM_VALUES: AdvancedSearchFormValues = {
  keyword: '',
  searchType: 'Dealer',
  channel: 'N/A',
  state: 'N/A',
  documentName: 'N/A',
  module: 'N/A',
  documentVersion: 'N/A',
  documentStatus: 'N/A',
  documentType: 'N/A',
  taskDefinition: 'N/A',
  taskStatus: 'N/A',
  assignedTo: 'N/A',
  codeType: 'Select existing',
  codes: '',
  newDealersPending: false,
  terminated: false,
  sdCode: '',
  accountManager: 'Any',
  dealerCode: '',
  businessUnitTb: false,
  businessUnitTeg: false,
  businessUnitTccw: false,
  premiseCode: '',
  dealerUnderNegotiation: false,
};

const PAGE_SIZE = 10;

function noop(): void {
  // Default no-op so this component is safely previewable standalone
  // (see ui/preview.html?component=advancedSearch/AdvancedSearch) with zero props supplied.
}

export interface AdvancedSearchProps {
  onOpenDealer?: (dealerId: string) => void;
}

/**
 * Advanced Search screen: a multi-criteria dealer/document/task search form
 * with a results table below it (Constitution §13a/§13b/§13c).
 */
export function AdvancedSearch({ onOpenDealer = noop }: AdvancedSearchProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [formValues, setFormValues] = useState<AdvancedSearchFormValues>(INITIAL_FORM_VALUES);
  const [page, setPage] = useState(1);

  const { results, totalCount, isLoading, loadError, hasSearched, runSearch } = useAdvancedSearch();

  function updateField<K extends keyof AdvancedSearchFormValues>(field: K, value: AdvancedSearchFormValues[K]): void {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function runCurrentSearch(): void {
    runSearch({
      keyword: formValues.keyword,
      searchType: formValues.searchType,
      channel: formValues.channel,
      state: formValues.state,
      documentName: formValues.documentName,
      module: formValues.module,
      documentVersion: formValues.documentVersion,
      documentStatus: formValues.documentStatus,
      documentType: formValues.documentType,
      taskDefinition: formValues.taskDefinition,
      taskStatus: formValues.taskStatus,
      assignedTo: formValues.assignedTo,
      codeType: formValues.codeType,
      codes: formValues.codes,
      newDealersPending: formValues.newDealersPending,
      terminated: formValues.terminated,
      sdCode: formValues.sdCode,
      accountManager: formValues.accountManager,
      dealerCode: formValues.dealerCode,
      businessUnits: [
        formValues.businessUnitTb ? 'TB' : null,
        formValues.businessUnitTeg ? 'TEG' : null,
        formValues.businessUnitTccw ? 'TCCW' : null,
      ].filter((unit): unit is string => unit !== null),
      premiseCode: formValues.premiseCode,
      dealerUnderNegotiation: formValues.dealerUnderNegotiation,
      page,
      pageSize: PAGE_SIZE,
    });
  }

  const columns: DataTableColumn<DealerSearchResult>[] = [
    { key: 'dealerName', header: 'Dealer Name', render: (r) => r.dealerName },
    { key: 'dealerRefNumber', header: 'Dealer Ref Number', render: (r) => r.dealerRefNumber },
    { key: 'dealerStatus', header: 'Dealer Status', render: (r) => r.dealerStatus },
    { key: 'tradingName', header: 'Trading Name', render: (r) => r.tradingName },
    { key: 'suburb', header: 'Suburb', render: (r) => r.suburb },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <Button variant="outline" size="sm" onClick={() => onOpenDealer(r.dealerId)}>
          Open
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      navItems={APP_NAV_ITEMS}
      activeTabId="advance-search"
      onNavigate={(item) => {
        if (item.tabId === 'home') {
          navigate(ROUTE_PATHS.home);
        }
      }}
      user={user ? { displayName: user.displayName, initials: user.initials } : undefined}
      onLogout={() => {
        logout();
        navigate(ROUTE_PATHS.login, { replace: true });
      }}
    >
      <div className="advanced-search-page">
        <section className="advanced-search-section">
          <SectionHeading eyebrow="Advance Search" title="Search" />

          <form
            className="advanced-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              runCurrentSearch();
            }}
          >
            <div className="advanced-search-form__grid">
              <FormField
                label="Keyword Search"
                value={formValues.keyword}
                onChange={(e) => updateField('keyword', e.target.value)}
              />
              <SelectField
                label="Search Type"
                options={SEARCH_TYPE_OPTIONS}
                value={formValues.searchType}
                onChange={(e) => updateField('searchType', e.target.value)}
              />
              <SelectField
                label="Channel"
                options={NA_OPTIONS}
                value={formValues.channel}
                onChange={(e) => updateField('channel', e.target.value)}
              />
              <SelectField
                label="State"
                options={NA_OPTIONS}
                value={formValues.state}
                onChange={(e) => updateField('state', e.target.value)}
              />

              <SelectField
                label="Document Name"
                options={NA_OPTIONS}
                value={formValues.documentName}
                onChange={(e) => updateField('documentName', e.target.value)}
              />
              <SelectField
                label="Module"
                options={NA_OPTIONS}
                value={formValues.module}
                onChange={(e) => updateField('module', e.target.value)}
              />

              <SelectField
                label="Document Version"
                options={NA_OPTIONS}
                value={formValues.documentVersion}
                onChange={(e) => updateField('documentVersion', e.target.value)}
              />
              <SelectField
                label="Document Status"
                options={NA_OPTIONS}
                value={formValues.documentStatus}
                onChange={(e) => updateField('documentStatus', e.target.value)}
              />
              <SelectField
                label="Document Type"
                options={NA_OPTIONS}
                value={formValues.documentType}
                onChange={(e) => updateField('documentType', e.target.value)}
              />

              <SelectField
                label="Task Definition"
                options={NA_OPTIONS}
                value={formValues.taskDefinition}
                onChange={(e) => updateField('taskDefinition', e.target.value)}
              />

              <SelectField
                label="Task Status"
                options={NA_OPTIONS}
                value={formValues.taskStatus}
                onChange={(e) => updateField('taskStatus', e.target.value)}
              />
              <SelectField
                label="Assigned to"
                options={NA_OPTIONS}
                value={formValues.assignedTo}
                onChange={(e) => updateField('assignedTo', e.target.value)}
              />

              <SelectField
                label="Code Type"
                options={CODE_TYPE_OPTIONS}
                value={formValues.codeType}
                onChange={(e) => updateField('codeType', e.target.value)}
              />
              <FormField
                label="Codes"
                value={formValues.codes}
                onChange={(e) => updateField('codes', e.target.value)}
              />
              <div className="advanced-search-form__checkbox-group">
                <label className="advanced-search-form__checkbox">
                  <input
                    type="checkbox"
                    checked={formValues.newDealersPending}
                    onChange={(e) => updateField('newDealersPending', e.target.checked)}
                  />
                  New Dealers (Pending)
                </label>
                <label className="advanced-search-form__checkbox">
                  <input
                    type="checkbox"
                    checked={formValues.terminated}
                    onChange={(e) => updateField('terminated', e.target.checked)}
                  />
                  Terminated
                </label>
              </div>

              <FormField
                label="SD Code"
                value={formValues.sdCode}
                onChange={(e) => updateField('sdCode', e.target.value)}
              />
              <SelectField
                label="Account Manager"
                options={ACCOUNT_MANAGER_OPTIONS}
                value={formValues.accountManager}
                onChange={(e) => updateField('accountManager', e.target.value)}
              />

              <FormField
                label="Dealer Code"
                value={formValues.dealerCode}
                onChange={(e) => updateField('dealerCode', e.target.value)}
              />
              <div className="advanced-search-form__checkbox-group">
                <span className="advanced-search-form__group-label">Business Unit</span>
                <label className="advanced-search-form__checkbox">
                  <input
                    type="checkbox"
                    checked={formValues.businessUnitTb}
                    onChange={(e) => updateField('businessUnitTb', e.target.checked)}
                  />
                  TB
                </label>
                <label className="advanced-search-form__checkbox">
                  <input
                    type="checkbox"
                    checked={formValues.businessUnitTeg}
                    onChange={(e) => updateField('businessUnitTeg', e.target.checked)}
                  />
                  TEG
                </label>
                <label className="advanced-search-form__checkbox">
                  <input
                    type="checkbox"
                    checked={formValues.businessUnitTccw}
                    onChange={(e) => updateField('businessUnitTccw', e.target.checked)}
                  />
                  TCCW
                </label>
              </div>

              <FormField
                label="Premise Code"
                value={formValues.premiseCode}
                onChange={(e) => updateField('premiseCode', e.target.value)}
              />
              <label className="advanced-search-form__checkbox advanced-search-form__checkbox--standalone">
                <input
                  type="checkbox"
                  checked={formValues.dealerUnderNegotiation}
                  onChange={(e) => updateField('dealerUnderNegotiation', e.target.checked)}
                />
                Dealer Under Negotiation
              </label>
            </div>

            <div className="advanced-search-form__actions">
              <Button type="submit" variant="filled">
                Search
              </Button>
            </div>
          </form>
        </section>

        <section className="advanced-search-section">
          <SectionHeading eyebrow="Results" title="Search Results" />

          {isLoading ? (
            <LoadingSpinner label="Searching…" fullWidth />
          ) : loadError ? (
            <ErrorBanner message={loadError} onRetry={runCurrentSearch} />
          ) : !hasSearched ? (
            <EmptyState message="Enter search criteria above and click Search to see results." />
          ) : results && results.length === 0 ? (
            <EmptyState message="No results found." />
          ) : results && results.length > 0 ? (
            <DataTable
              columns={columns}
              rows={results}
              getRowKey={(r) => r.dealerId}
              totalCount={totalCount}
              page={page}
              pageSize={PAGE_SIZE}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                runCurrentSearch();
              }}
            />
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}

export default AdvancedSearch;
