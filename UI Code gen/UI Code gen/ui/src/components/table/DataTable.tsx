import type { ReactNode } from 'react';
import './DataTable.css';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** Total count of items if the dataset shown is a paged subset (for "View all (N)"). */
  totalCount?: number;
  viewAllLabel?: string;
  onViewAll?: () => void;
  /** Pagination state; omit to hide pagination controls. */
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

function noop(): void {
  // Default no-op for standalone previewability.
}

export type BadgeTone = 'default' | 'danger' | 'success' | 'warning';

export function DataTableBadge({ tone = 'default', children }: { tone?: BadgeTone; children: ReactNode }) {
  const toneClass = tone === 'default' ? '' : ` cmd-data-table__badge--${tone}`;
  return <span className={`cmd-data-table__badge${toneClass}`}>{children}</span>;
}

/**
 * Generic data table with optional "View all (N)" link and page-number
 * pagination controls. Column rendering is fully delegated via `render`,
 * so status badges, action buttons, etc. are composed by the caller.
 *
 * @example
 * <DataTable
 *   columns={[{ key: 'name', header: 'Dealer Name', render: (r) => r.name }]}
 *   rows={dealers}
 *   getRowKey={(r) => r.id}
 *   totalCount={10}
 *   page={1}
 *   pageSize={5}
 * />
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  totalCount,
  viewAllLabel,
  onViewAll = noop,
  page,
  pageSize,
  onPageChange = noop,
}: DataTableProps<T>) {
  const showFooter = totalCount !== undefined || (page !== undefined && pageSize !== undefined);
  const totalPages = page !== undefined && pageSize ? Math.max(1, Math.ceil((totalCount ?? rows.length) / pageSize)) : 1;
  const rangeStart = page !== undefined && pageSize ? (page - 1) * pageSize + 1 : 1;
  const rangeEnd = page !== undefined && pageSize ? Math.min(page * pageSize, totalCount ?? rows.length) : rows.length;

  return (
    <div className="cmd-data-table-wrapper">
      <table className="cmd-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showFooter && (
        <div className="cmd-data-table__footer">
          {totalCount !== undefined && (
            <button type="button" className="cmd-data-table__view-all" onClick={onViewAll}>
              {viewAllLabel ?? `View all (${totalCount})`}
            </button>
          )}

          {page !== undefined && pageSize !== undefined && (
            <div className="cmd-data-table__pagination">
              <span>
                Showing {rangeStart}-{rangeEnd} of {totalCount ?? rows.length}
              </span>
              <button
                type="button"
                className="cmd-data-table__page-button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    pageNumber === page
                      ? 'cmd-data-table__page-button cmd-data-table__page-button--active'
                      : 'cmd-data-table__page-button'
                  }
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="cmd-data-table__page-button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
