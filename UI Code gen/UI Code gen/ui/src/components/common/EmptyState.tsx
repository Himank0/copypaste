import './EmptyState.css';

export interface EmptyStateProps {
  message?: string;
  icon?: string;
}

/**
 * Shared empty-result state. Use when a fetch succeeds but returns zero
 * items (Constitution §13a) — do not build bespoke inline empty messages.
 *
 * @example
 * <EmptyState message="No recently accessed dealers yet." />
 */
export function EmptyState({ message = 'No results found.', icon = '📭' }: EmptyStateProps) {
  return (
    <div className="cmd-empty-state">
      <span className="cmd-empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="cmd-empty-state__message">{message}</span>
    </div>
  );
}

export default EmptyState;
