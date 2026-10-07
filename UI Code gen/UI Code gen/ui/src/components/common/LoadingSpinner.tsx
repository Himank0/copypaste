import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  /** Message shown next to the spinner. */
  label?: string;
  /** Stretch to fill the width of its container. */
  fullWidth?: boolean;
}

/**
 * Shared loading indicator. Use for the "loading" state whenever a component
 * fetches data (Constitution §13a) — do not build bespoke spinners inline.
 *
 * @example
 * <LoadingSpinner label="Loading dealers..." />
 */
export function LoadingSpinner({ label = 'Loading…', fullWidth = false }: LoadingSpinnerProps) {
  const className = fullWidth ? 'cmd-loading-spinner cmd-loading-spinner--fullwidth' : 'cmd-loading-spinner';
  return (
    <div className={className} role="status" aria-live="polite">
      <span className="cmd-loading-spinner__icon" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
