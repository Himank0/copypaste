import './ErrorBanner.css';

export interface ErrorBannerProps {
  message?: string;
  /** Shown as a "Retry" button when provided. */
  onRetry?: () => void;
}

/**
 * Shared error state banner. Use whenever a data fetch/submit fails
 * (Constitution §13a) — do not build bespoke inline error messages.
 *
 * @example
 * <ErrorBanner message="Couldn't load dealers." onRetry={refetch} />
 */
export function ErrorBanner({ message = 'Something went wrong. Please try again.', onRetry }: ErrorBannerProps) {
  return (
    <div className="cmd-error-banner" role="alert">
      <span className="cmd-error-banner__message">{message}</span>
      {onRetry && (
        <button type="button" className="cmd-error-banner__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
